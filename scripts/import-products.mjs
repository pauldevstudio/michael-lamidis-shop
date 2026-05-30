#!/usr/bin/env node
/**
 * import-products.mjs
 *
 * Replaces all products in MongoDB with the 45 real products parsed from
 * Michael's supplier invoice (Excel). Run ONCE locally:
 *
 *   1. Make sure DATABASE_URI is set in .env.local
 *   2. From project root:  npm run import-products
 *   3. Refresh /admin/products to see the new catalog
 *   4. Refresh / to see the live shop with real items
 *
 * Safety:
 *   - DRY RUN by default — prints plan, does NOT write.
 *   - Pass --confirm to actually drop and replace the products collection.
 *   - Pass --keep to insert without dropping existing (rarely useful).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient, ObjectId } from "mongodb";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const JSON_PATH = path.join(__dirname, "_products_import.json");

const argv = process.argv.slice(2);
const DRY_RUN  = !argv.includes("--confirm");
const KEEP     = argv.includes("--keep");

const c = { reset: "\x1b[0m", red: "\x1b[31m", green: "\x1b[32m",
  yellow: "\x1b[33m", cyan: "\x1b[36m", dim: "\x1b[2m", bold: "\x1b[1m" };
const log  = (...a) => console.log(...a);
const ok   = (m) => log(`${c.green}✓${c.reset} ${m}`);
const warn = (m) => log(`${c.yellow}⚠${c.reset} ${m}`);
const die  = (m) => { console.error(`${c.red}✗${c.reset} ${m}`); process.exit(1); };
const step = (m) => log(`\n${c.cyan}▸${c.reset} ${c.bold}${m}${c.reset}`);

// ── Load DATABASE_URI from .env.local ───────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
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
loadEnv();

const URI = process.env.DATABASE_URI;
if (!URI) die("DATABASE_URI not set in environment or .env.local");

// ── Load parsed products ────────────────────────────────────────────────────
if (!fs.existsSync(JSON_PATH)) {
  die(`Missing ${JSON_PATH}. Run the Excel parser first.`);
}
const products = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
ok(`Loaded ${products.length} products from ${path.basename(JSON_PATH)}`);

// ── Connect & inspect ───────────────────────────────────────────────────────
step("Connecting to MongoDB");
const client = new MongoClient(URI);
await client.connect();
ok("Connected");

// Database name is in the URI; Payload uses the default db. Let's pick it up:
const dbName = new URL(URI.replace("mongodb+srv://", "https://")).pathname.replace(/^\//, "") || "test";
const db = client.db(dbName);
ok(`Using database: ${dbName}`);

const col = db.collection("products");
const existing = await col.countDocuments();
log(`${c.dim}  Current products in DB: ${existing}${c.reset}`);

// ── Build the docs Payload expects ──────────────────────────────────────────
const now = new Date();
const docs = products.map((p, i) => ({
  _id: new ObjectId(),
  brand:         p.brand,
  model:         p.model,
  category:      p.category,
  originalPrice: p.originalPrice,
  salePrice:     p.salePrice,
  savings:       p.savings,
  grade:         p.grade ?? "New",
  warranty:      p.warranty ?? 12,
  icon:          p.icon ?? "Package",
  colorFrom:     p.colorFrom ?? "#3A5F8A",
  colorTo:       p.colorTo ?? "#7FAEDB",
  description:   p.description ?? "",
  imageUrl:      "",         // no image yet — admin uploads later
  displayOrder:  p.displayOrder ?? (i + 1),
  specs:         [],
  createdAt:     now,
  updatedAt:     now,
}));

// ── Plan ────────────────────────────────────────────────────────────────────
step("Plan");
log(`  Action:  ${KEEP ? c.yellow + "ADD (keep existing)" : c.red + "REPLACE (drop existing)"}${c.reset}`);
log(`  Existing products: ${existing}`);
log(`  New products to insert: ${docs.length}`);
log(`  Mode:    ${DRY_RUN ? c.yellow + "DRY RUN" + c.reset : c.green + "WRITE" + c.reset}`);

// Sample preview
log(`\n${c.dim}  Sample (first 3):${c.reset}`);
for (const d of docs.slice(0, 3)) {
  log(`  ${c.dim}·${c.reset} ${d.brand} ${d.model}  €${d.salePrice} (was €${d.originalPrice}, save ${d.savings}%)  [${d.category}]`);
}
log(`  ${c.dim}...${c.reset}`);

// Category summary
const byCat = docs.reduce((acc, d) => { acc[d.category] = (acc[d.category] || 0) + 1; return acc; }, {});
log(`\n${c.dim}  By category:${c.reset}`);
for (const [k, v] of Object.entries(byCat)) log(`  ${c.dim}·${c.reset} ${k}: ${v}`);

if (DRY_RUN) {
  warn("\nDry run — no changes written. Re-run with --confirm to apply.");
  await client.close();
  process.exit(0);
}

// ── Apply ───────────────────────────────────────────────────────────────────
step("Applying");
if (!KEEP && existing > 0) {
  const r = await col.deleteMany({});
  ok(`Deleted ${r.deletedCount} existing product(s)`);
}
const r = await col.insertMany(docs);
ok(`Inserted ${r.insertedCount} new product(s)`);

// Verify
const after = await col.countDocuments();
ok(`Products now in DB: ${after}`);

await client.close();

log(`\n${c.green}${c.bold}Done.${c.reset}\n`);
log(`Next:`);
log(`  1. ${c.cyan}npm run dev${c.reset}                # if not already running`);
log(`  2. Open ${c.cyan}http://localhost:3000${c.reset} — see new catalog live`);
log(`  3. Open ${c.cyan}http://localhost:3000/admin/products${c.reset} — upload images / edit names`);
log(`  4. When happy: ${c.cyan}git push${c.reset} to ship to Vercel`);
