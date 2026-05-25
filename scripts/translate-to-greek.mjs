#!/usr/bin/env node
/**
 * translate-to-greek.mjs — v2 (CMS-aware, AI-translated)
 *
 * Pulls the current English content live from Payload CMS, merges it with the
 * static copy in lib/translations.ts, sends the result to OpenAI for Greek
 * translation, then rewrites both the `en` and `gr` sections of translations.ts.
 *
 * Usage:
 *   1. OPENAI_API_KEY must be set (in .env.local or environment)
 *   2. From project root:  npm run translate
 *   3. Optional flags:
 *        --base <url>     Override the Payload API base URL
 *                         (default: tries http://localhost:3000 then PUBLIC_SITE_URL)
 *        --dry-run        Translate but don't write the file (prints diff hint)
 *        --skip-cms       Skip CMS fetch; just re-translate existing en → gr
 *
 * Cost: ~$0.001 per run (gpt-4o-mini).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ── Setup ───────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, "..", "lib", "translations.ts");

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const flagVal = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : null;
};
const DRY_RUN = flag("--dry-run");
const SKIP_CMS = flag("--skip-cms");
const BASE_OVERRIDE = flagVal("--base");

// ── Helpers ─────────────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m", dim: "\x1b[2m", red: "\x1b[31m",
  green: "\x1b[32m", yellow: "\x1b[33m", cyan: "\x1b[36m", bold: "\x1b[1m",
};
const log  = (...a) => console.log(...a);
const ok   = (m) => log(`${c.green}✓${c.reset} ${m}`);
const warn = (m) => log(`${c.yellow}⚠${c.reset} ${m}`);
const die  = (m) => { console.error(`${c.red}✗${c.reset} ${m}`); process.exit(1); };
const step = (m) => log(`\n${c.cyan}▸${c.reset} ${c.bold}${m}${c.reset}`);

function loadEnvFile() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || process.env[m[1]]) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    process.env[m[1]] = v;
  }
}
loadEnvFile();

// ── Validate env ────────────────────────────────────────────────────────────
const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) die("OPENAI_API_KEY not found in environment or .env.local");

// ── Locate `en` and `gr` blocks in translations.ts ──────────────────────────
function findBalancedBlock(text, marker) {
  const i = text.indexOf(marker);
  if (i < 0) return null;
  const braceStart = text.indexOf("{", i);
  if (braceStart < 0) return null;
  let depth = 0, inStr = null, esc = false;
  for (let j = braceStart; j < text.length; j++) {
    const ch = text[j];
    if (esc) { esc = false; continue; }
    if (ch === "\\") { esc = true; continue; }
    if (inStr) { if (ch === inStr) inStr = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; continue; }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        let end = j + 1;
        while (end < text.length && (text[end] === ";" || text[end] === " ")) end++;
        return { headerStart: i, bodyStart: braceStart, end };
      }
    }
  }
  return null;
}

step("Reading lib/translations.ts");
const src = fs.readFileSync(FILE, "utf8");
const enBlock = findBalancedBlock(src, "const en = ");
const grBlock = findBalancedBlock(src, "const gr: typeof en = ");
if (!enBlock || !grBlock) die("Could not locate `en`/`gr` blocks in translations.ts");

let en;
try {
  const bodyText = src.slice(enBlock.bodyStart, enBlock.end).replace(/;\s*$/, "");
  // eslint-disable-next-line no-new-func
  en = new Function(`"use strict"; return (${bodyText});`)();
} catch (e) {
  die(`Failed to parse \`en\`: ${e.message}`);
}
ok(`Loaded current en (${Object.keys(en).length} sections)`);

// ── Detect Payload API base ─────────────────────────────────────────────────
async function ping(url, ms = 1500) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    const r = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    return r.ok || r.status === 401;
  } catch { return false; }
}

let base = null;
if (!SKIP_CMS) {
  step("Locating Payload API");
  const candidates = [
    BASE_OVERRIDE,
    "http://localhost:3000",
    process.env.PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean).map(u => u.replace(/\/$/, ""));

  for (const url of candidates) {
    const probe = `${url}/api/payload/globals/home-hero`;
    if (await ping(probe)) { base = url; ok(`Using Payload API at ${url}`); break; }
    log(`${c.dim}  · ${url} — unreachable${c.reset}`);
  }
  if (!base) {
    warn("No reachable Payload API. Skipping CMS sync; will translate existing en as-is.");
    warn("To use a custom base:  npm run translate -- --base https://your-site.vercel.app");
  }
}

// ── Fetch globals ───────────────────────────────────────────────────────────
async function fetchGlobal(slug) {
  if (!base) return null;
  try {
    const r = await fetch(`${base}/api/payload/globals/${slug}`, {
      headers: { "Cache-Control": "no-cache" },
    });
    if (!r.ok) { warn(`Could not fetch ${slug} (${r.status})`); return null; }
    return await r.json();
  } catch (e) {
    warn(`Fetch failed for ${slug}: ${e.message}`);
    return null;
  }
}

const SECTIONS = [
  { key: "hero",           slug: "home-hero" },
  { key: "nav",            slug: "navigation" },
  { key: "announcement",   slug: "announcement-bar" },
  { key: "categoryStrip",  slug: "category-strip" },
  { key: "trust",          slug: "trust-badges" },
  { key: "features",       slug: "features-section" },
  { key: "services",       slug: "services-section" },
  { key: "testimonials",   slug: "testimonials-section" },
  { key: "stats",          slug: "stats" },
  { key: "faq",            slug: "faq-section" },
  { key: "leadCapture",    slug: "lead-capture" },
  { key: "contact",        slug: "contact-section" },
  { key: "footer",         slug: "footer" },
];

let globals = {};
if (base) {
  step("Fetching globals from CMS");
  const results = await Promise.all(SECTIONS.map(s => fetchGlobal(s.slug)));
  for (let i = 0; i < SECTIONS.length; i++) {
    if (results[i]) {
      globals[SECTIONS[i].slug] = results[i];
      ok(`Fetched ${SECTIONS[i].slug}`);
    }
  }
}

// ── Merge CMS values into en (per-section mappers) ──────────────────────────
// Each mapper takes (cmsGlobal, oldSection) and returns a new section object.
// If cmsGlobal is null or missing fields, oldSection values are preserved.
const fallback = (v, d) => (v != null && v !== "" ? v : d);

const MAPPERS = {
  hero: (g, t) => {
    if (!g) return t;
    const lines = (g.headline || "").split("\n").filter(Boolean);
    return {
      ...t,
      locationLabel: fallback(g.locationLabel, t.locationLabel),
      badge:         fallback(g.badge,         t.badge),
      titleLine1:    fallback(lines[0],        t.titleLine1),
      titleLine2:    fallback(lines.slice(1).join(" "), t.titleLine2),
      subtitle:      fallback(g.subheadline,   t.subtitle),
      cta1:          fallback(g.primaryCtaLabel,   t.cta1),
      cta2:          fallback(g.secondaryCtaLabel, t.cta2),
    };
  },
  nav: (g, t) => {
    if (!g) return t;
    const merged = { ...t };
    if (Array.isArray(g.items)) {
      const byPath = Object.fromEntries(g.items.map(it => [it.href, it.label]));
      const map = { "/": "home", "/products": "products", "/about": "about",
        "/services": "services", "/testimonials": "testimonials",
        "/blog": "blog", "/contact": "contact" };
      for (const [href, key] of Object.entries(map)) {
        if (byPath[href]) merged[key] = byPath[href];
      }
    }
    merged.getQuote = fallback(g.getQuoteLabel, t.getQuote);
    return merged;
  },
  announcement: (g, t) => g ? { ...t,
    message: fallback(g.message,  t.message),
    cta:     fallback(g.ctaLabel, t.cta),
  } : t,
  categoryStrip: (g, t) => {
    if (!g) return t;
    const items = Array.isArray(g.items) && g.items.length
      ? g.items.map(it => ({ id: it.id, label: it.label }))
      : t.items;
    return { ...t, eyebrow: fallback(g.eyebrow, t.eyebrow), items };
  },
  trust: (g, t) => {
    if (!g) return t;
    const items = Array.isArray(g.items) && g.items.length
      ? g.items.map(it => ({ icon: it.icon, title: it.title, description: it.description }))
      : t.items;
    return { ...t,
      eyebrow: fallback(g.eyebrow, t.eyebrow),
      title:   fallback(g.title,   t.title),
      items,
    };
  },
  features: (g, t) => {
    if (!g) return t;
    const items = Array.isArray(g.items) && g.items.length
      ? g.items.map(it => ({ icon: it.icon, title: it.title, description: it.description }))
      : t.items;
    return { ...t,
      eyebrow:  fallback(g.eyebrow,  t.eyebrow),
      title:    fallback(g.title,    t.title),
      subtitle: fallback(g.subtitle, t.subtitle),
      items,
    };
  },
  services: (g, t) => {
    if (!g) return t;
    const items = Array.isArray(g.items) && g.items.length
      ? g.items.map(it => ({
          icon: it.icon, title: it.title, description: it.description,
          price: it.price ?? null, badge: it.badge ?? null,
        }))
      : t.items;
    return { ...t,
      eyebrow:  fallback(g.eyebrow,  t.eyebrow),
      title:    fallback(g.title,    t.title),
      subtitle: fallback(g.subtitle, t.subtitle),
      items,
    };
  },
  testimonials: (g, t) => {
    if (!g) return t;
    const items = Array.isArray(g.items) && g.items.length
      ? g.items.map(it => ({
          name: it.name, role: it.role ?? "", location: it.location ?? "",
          content: it.content, rating: it.rating ?? 5,
        }))
      : t.items;
    return { ...t,
      eyebrow:  fallback(g.eyebrow,  t.eyebrow),
      title:    fallback(g.title,    t.title),
      subtitle: fallback(g.subtitle, t.subtitle),
      items,
    };
  },
  stats: (g, t) => {
    if (!g) return t;
    const items = Array.isArray(g.items) && g.items.length
      ? g.items.map(it => ({ value: it.value, suffix: it.suffix ?? "+", label: it.label }))
      : t.items;
    return { ...t,
      eyebrow: fallback(g.eyebrow, t.eyebrow),
      title:   fallback(g.title,   t.title),
      items,
    };
  },
  faq: (g, t) => {
    if (!g) return t;
    const items = Array.isArray(g.items) && g.items.length
      ? g.items.map(it => ({ question: it.question, answer: it.answer }))
      : t.items;
    return { ...t,
      eyebrow:  fallback(g.eyebrow,  t.eyebrow),
      title:    fallback(g.title,    t.title),
      subtitle: fallback(g.subtitle, t.subtitle),
      items,
    };
  },
  leadCapture: (g, t) => {
    if (!g) return t;
    const benefits = Array.isArray(g.benefits) && g.benefits.length
      ? g.benefits.map(b => b.text).filter(Boolean)
      : t.benefits;
    return { ...t,
      eyebrow:  fallback(g.eyebrow,  t.eyebrow),
      title:    fallback(g.title,    t.title),
      subtitle: fallback(g.subtitle, t.subtitle),
      benefits,
    };
  },
  contact: (g, t) => g ? { ...t,
    eyebrow:      fallback(g.eyebrow,      t.eyebrow),
    title:        fallback(g.title,        t.title),
    subtitle:     fallback(g.subtitle,     t.subtitle),
    addressLabel: fallback(g.addressLabel, t.addressLabel),
    phoneLabel:   fallback(g.phoneLabel,   t.phoneLabel),
    emailLabel:   fallback(g.emailLabel,   t.emailLabel),
    hoursLabel:   fallback(g.hoursLabel,   t.hoursLabel),
    mapCta:       fallback(g.mapCta,       t.mapCta),
  } : t,
  footer: (g, t) => {
    if (!g) return t;
    return { ...t,
      description: fallback(g.description, t.description),
      copyright:   fallback(g.copyright,   t.copyright),
      companyLinks:  Array.isArray(g.companyLinks)  && g.companyLinks.length
        ? g.companyLinks.map(l => ({ label: l.label, href: l.href }))
        : t.companyLinks,
      servicesLinks: Array.isArray(g.servicesLinks) && g.servicesLinks.length
        ? g.servicesLinks.map(l => ({ label: l.label, href: l.href }))
        : t.servicesLinks,
    };
  },
};

step("Merging CMS values into en object");
let mergedEn = JSON.parse(JSON.stringify(en)); // deep clone
let mergedCount = 0;
for (const { key, slug } of SECTIONS) {
  const g = globals[slug];
  if (!g) continue;
  if (MAPPERS[key]) {
    mergedEn[key] = MAPPERS[key](g, mergedEn[key]);
    mergedCount++;
  }
}
ok(`Merged ${mergedCount} section(s) from CMS into en`);

// ── Translate to Greek via OpenAI ───────────────────────────────────────────
const SYSTEM = `You are a professional English-to-Greek translator specialising in retail copy for the Cyprus market. You translate to modern, natural Cypriot Greek that sounds like a real local business wrote it — warm, confident, not overly formal.`;

const RULES = `Translate every STRING VALUE in this JSON to Greek. Return ONLY valid JSON with the EXACT same keys and structure.

RULES:
- Translate ONLY string values. Numbers, booleans, null, and structure stay identical.
- Brand names stay in English: Samsung, LG, Bosch, Miele, Siemens, Electrolux, Philips, Whirlpool, AEG, Gorenje, Beko, Candy, Indesit.
- Technical/marketing terms stay in English: "Open Box", "Premium", "Showroom", "Blog", "white-glove".
- URLs, paths (starting with /), email addresses, phone numbers stay unchanged.
- Icon names stay unchanged: ShieldCheck, Award, Truck, RefreshCw, Tag, CheckCircle2, Zap, Recycle, Star, HeartHandshake, Search, Wrench, Settings, Package.
- nav.switchLang must be exactly "EN" (the toggle label when in Greek mode).
- Person names in testimonials → Greek script (e.g. "Maria Papadopoulou" → "Μαρία Παπαδοπούλου").
- Place names → Greek form (Limassol → Λεμεσός, Nicosia → Λευκωσία, Paphos → Πάφος, Larnaca → Λάρνακα, Cyprus → Κύπρος).
- Currency stays as €. Emojis stay exactly as they are. Numbers in strings stay numeric.
- href values (in nav, footer link arrays) keep their English path; only translate the label.`;

async function translate(payload, attempt = 1) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `${RULES}\n\nINPUT:\n${JSON.stringify(payload, null, 2)}` },
      ],
    }),
  });
  if (!r.ok) {
    const t = await r.text();
    if (attempt < 3 && (r.status === 429 || r.status >= 500)) {
      warn(`OpenAI ${r.status}, retrying (${attempt}/3)…`);
      await new Promise(res => setTimeout(res, 1500 * attempt));
      return translate(payload, attempt + 1);
    }
    throw new Error(`OpenAI ${r.status}: ${t}`);
  }
  const data = await r.json();
  return { json: JSON.parse(data.choices[0].message.content), usage: data.usage };
}

step("Translating to Greek (OpenAI gpt-4o-mini)");
const t0 = Date.now();
const { json: gr, usage } = await translate(mergedEn);
gr.nav = gr.nav || {};
gr.nav.switchLang = "EN"; // hard-enforce
ok(`Done in ${((Date.now() - t0) / 1000).toFixed(1)}s · tokens: ${usage?.prompt_tokens || "?"}→${usage?.completion_tokens || "?"}`);

// ── Validate structural parity (en vs gr keys, including array indices) ────
function pathsOf(obj, prefix = "") {
  const out = [];
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => out.push(...pathsOf(v, `${prefix}[${i}]`)));
  } else if (obj && typeof obj === "object") {
    for (const k of Object.keys(obj)) out.push(...pathsOf(obj[k], prefix ? `${prefix}.${k}` : k));
  } else {
    out.push(prefix);
  }
  return out;
}
const enPaths = new Set(pathsOf(mergedEn));
const grPaths = new Set(pathsOf(gr));
const missing = [...enPaths].filter(p => !grPaths.has(p));
const extra   = [...grPaths].filter(p => !enPaths.has(p));
if (missing.length || extra.length) {
  if (missing.length) warn(`Translation missing ${missing.length} path(s): ${missing.slice(0,5).join(", ")}${missing.length>5?"…":""}`);
  if (extra.length)   warn(`Translation has ${extra.length} extra path(s): ${extra.slice(0,5).join(", ")}${extra.length>5?"…":""}`);
  if (!DRY_RUN) warn("Continuing anyway — review the diff carefully before committing.");
} else {
  ok("Structural parity between en and gr — verified");
}

// ── Write back to translations.ts ───────────────────────────────────────────
step("Writing translations.ts");
const indent2 = (s) => s; // JSON.stringify already uses 2-space indent
const newEnSrc = `const en = ${indent2(JSON.stringify(mergedEn, null, 2))};`;
const newGrSrc = `const gr: typeof en = ${indent2(JSON.stringify(gr, null, 2))};`;

// Splice both blocks. enBlock comes first in the file.
const before = src.slice(0, enBlock.headerStart);
const between = src.slice(enBlock.end, grBlock.headerStart);
const after = src.slice(grBlock.end);
const newSrc = before + newEnSrc + between + newGrSrc + after;

if (DRY_RUN) {
  warn("--dry-run: no file changes written.");
  log(`${c.dim}(Would write ${newSrc.length} bytes to lib/translations.ts)${c.reset}`);
} else {
  // Backup → atomic write (write to temp, fsync, rename) so a crash mid-write
  // never corrupts the file.
  const backup = FILE + ".bak";
  fs.copyFileSync(FILE, backup);
  const tmp = FILE + ".tmp";
  const fd = fs.openSync(tmp, "w");
  fs.writeSync(fd, newSrc, 0, "utf8");
  fs.fsyncSync(fd);
  fs.closeSync(fd);
  fs.renameSync(tmp, FILE);
  ok(`Updated lib/translations.ts (${newSrc.length} bytes)`);
  log(`${c.dim}  Backup saved to lib/translations.ts.bak${c.reset}`);
}

// ── Done ────────────────────────────────────────────────────────────────────
log(`\n${c.green}${c.bold}All done.${c.reset}`);
log(`\nNext steps:`);
log(`  1. ${c.cyan}git diff lib/translations.ts${c.reset}        ${c.dim}# review changes${c.reset}`);
log(`  2. ${c.cyan}npm run dev${c.reset}                          ${c.dim}# test locally, click 🇬🇷${c.reset}`);
log(`  3. ${c.cyan}git add lib/translations.ts${c.reset}`);
log(`     ${c.cyan}git commit -m "Refresh Greek translations from CMS"${c.reset}`);
log(`     ${c.cyan}git push origin main${c.reset}`);
