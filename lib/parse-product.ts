/**
 * Product field parser — untangles messy marketplace copy-paste into clean
 * { brand, model, name }. Runs on every admin product save (see
 * app/api/admin/products/route.ts).
 *
 * Behaviour (verified against the live catalogue):
 *  - brand : keeps only the recognised brand word, dropping stuffed product
 *            types, quotes, and SKU codes. Read from the brand field first,
 *            the description only as a last resort.
 *  - model : keeps an already-clean short code; otherwise extracts the SKU
 *            from the brand field's quotes/token. Flags "no-sku" if none.
 *  - name  : keeps a good existing name (title-cases SHOUTY ones); generates a
 *            short title from the paste when the name is blank/brand-only,
 *            flagging it "name-generated" for a human glance.
 *  - Idempotent: re-parsing an already-clean product returns it unchanged.
 *  - Never throws (see safeParseProduct) — a parser error falls back to the
 *    original values so a save can never break.
 */

export interface ParseInput {
  name?: string;
  brand?: string;
  model?: string;
  description?: string;
}

export interface ParseResult {
  brand: string;
  model: string;
  name: string;
  /** e.g. "no-sku", "name-generated", "name?", "brand?" — for future review UI. */
  flags: string[];
}

const BRANDS = [
  "SONGMICS", "VASAGLE", "Samsung", "Midea", "Tesla", "RAF", "Winning Star",
  "Sokany", "Sokani", "Feandrea", "Philips", "Bosch", "Hisense", "Comfee",
  "Tineco", "Lefant", "Epson", "Nespresso", "Metz", "Master Kitchen", "Electa",
  "Hobbs", "Fatafeat", "Playless", "Hotshoppa", "DSP", "Gorenje", "AEG",
  "Siemens", "Miele",
];
const TYPO: Record<string, string> = { SONGMIC: "SONGMICS", SONICS: "SONGMICS", SONGMICES: "SONGMICS" };
const SMALL = new Set(["with", "and", "for", "the", "of", "in", "to", "a"]);
const ACR = new Set(["LED", "BBQ", "TV", "LPG", "BTU", "PU", "USB", "XL"]);
const bRe = (b: string) => new RegExp(`\\b${b.replace(/\s/g, "\\s")}\\b`, "i");

function capWord(w: string, i: number): string {
  const up = w.toUpperCase();
  if (ACR.has(up)) return up;
  if (i > 0 && SMALL.has(w)) return w;
  if (w.includes("-")) {
    return w.split("-").map((p) => (/^\d/.test(p) ? p : /[a-z]/i.test(p) ? p.charAt(0).toUpperCase() + p.slice(1) : p)).join("-");
  }
  if (/^\d/.test(w)) return w;
  return w.charAt(0).toUpperCase() + w.slice(1);
}

function titleCaseName(s: string): string {
  return String(s).toLowerCase().split(/\s+/).filter(Boolean).map(capWord).join(" ");
}

/** Brand from the brand field first; description only as a last resort. */
function findBrand(bf: string, desc: string): string | null {
  for (const b of BRANDS) if (bRe(b).test(bf)) return b;
  const first = String(bf).replace(/["'’]/g, "").trim().split(/\s+/)[0] || "";
  if (TYPO[first.toUpperCase()]) return TYPO[first.toUpperCase()];
  for (const b of BRANDS) if (bRe(b).test(desc)) return b;
  return null;
}

/** Keep a clean short code; else extract the SKU from the brand field. */
function findModel(mf: string, bf: string): string | null {
  const m = String(mf || "").trim();
  if (m && m.length <= 30 && m.split(/\s+/).length <= 4 && !/,/.test(m)) return m.replace(/^["'’]+|["'’]+$/g, "");
  const q = String(bf || "").match(/["'’]([A-Z0-9][A-Z0-9/.\-]{3,})["'’]/i);
  if (q) return q[1];
  const tok = String(bf || "").match(/\b([A-Z]{2,4}\d{2,}[A-Z0-9/.\-]*)\b/);
  if (tok) return tok[1];
  return null;
}

/** Pull a short product-type phrase out of a messy source string. */
function productType(text: string, brand: string): string {
  if (!text) return "";
  let t = String(text).replace(/^\s*(brand new|about this item)\b[:\s]*/i, "").split(/[,\n\t]/)[0];
  t = t.replace(/["“”«»]/g, " ").replace(/['’]/g, (match: string, off: number, s: string) =>
    /[a-z]/i.test(s[off - 1] || "") && /[a-z]/i.test(s[off + 1] || "") ? match : " ");
  for (const b of BRANDS) t = t.replace(new RegExp(`\\b${b.replace(/\s/g, "\\s")}\\b`, "ig"), " ");
  if (brand) t = t.replace(new RegExp(brand.replace(/\s/g, "\\s"), "ig"), " ");
  t = t.replace(/\b[A-Z]{2,5}\d{1,}[A-Z0-9/.\-]*\b/g, " ").replace(/\b\d+\s*(pcs|pieces|x)\b/ig, " ").replace(/\s+/g, " ").trim();
  if (!t) return "";
  if (/^(item|product)\s+dimensions/i.test(t) || /^(dimensions|colour|color|material|size|style|brand|frame|number|tem)\b/i.test(t)) return "";
  const w = t.split(" ").filter(Boolean);
  if (w.length < 1 || w.length > 6 || !/[a-z]/i.test(t)) return "";
  return t;
}

function genName(oldName: string, brand: string, bf: string, mf: string, df: string): { name: string; gen: boolean; low?: boolean } {
  const n = String(oldName || "").trim();
  const brandOnly = !!brand && n.replace(/[^a-z]/ig, "").toUpperCase() === brand.replace(/[^a-z]/ig, "").toUpperCase();
  if (n && !brandOnly) {
    const shouty = n === n.toUpperCase() && (n.match(/[A-Z]/g) || []).length > 5;
    return { name: shouty ? titleCaseName(n) : n, gen: false };
  }
  const modelIsDesc = String(mf || "").length > 30 || /,/.test(String(mf || ""));
  let base = "";
  for (const s of [modelIsDesc ? mf : "", bf, df]) { base = productType(s, brand); if (base) break; }
  if (!base) return { name: n, gen: true, low: true };
  base = titleCaseName(base);
  const src = `${mf} ${df}`;
  let attr = (src.match(/\b\d+[\-–]?\d*\s*(?:compartments?|tier|pairs?|pieces?|kg|litres?|seater)\b/i) || [])[0]
    || (src.match(/\b(anthracite|natural oak|rustic brown|light oatmeal|oatmeal|black|white|grey|gray|brown|green|beige|silver|taupe|navy)\b/i) || [])[0];
  if (attr) { attr = titleCaseName(attr); if (base.toLowerCase().includes(attr.toLowerCase())) attr = ""; }
  return { name: (attr ? `${base} – ${attr}` : base).slice(0, 60), gen: true };
}

export function parseProduct(input: ParseInput): ParseResult {
  const bf = String(input.brand ?? ""), mf = String(input.model ?? ""), df = String(input.description ?? "");
  const flags: string[] = [];
  const fb = findBrand(bf, df); if (!fb) flags.push("brand?");
  const brand = fb || bf.replace(/["'’]/g, "").trim() || bf;
  const fm = findModel(mf, bf); if (!fm) flags.push("no-sku");
  const model = fm ?? mf.trim();
  const g = genName(input.name ?? "", brand, bf, mf, df);
  if (g.gen) flags.push(g.low ? "name?" : "name-generated");
  return { brand, model, name: g.name, flags };
}

/** Never throws — on any parser error, returns the original values untouched. */
export function safeParseProduct(input: ParseInput): ParseResult {
  try {
    return parseProduct(input);
  } catch {
    return { brand: String(input.brand ?? ""), model: String(input.model ?? ""), name: String(input.name ?? ""), flags: ["parse-error"] };
  }
}
