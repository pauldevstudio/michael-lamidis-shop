/**
 * _audit_product_images.mjs
 *
 * Read-only audit. Dumps every product with brand/model/category/imageUrl
 * and flags rows where the imageUrl filename obviously does not match the
 * product's brand/model.
 *
 *   node scripts/_audit_product_images.mjs
 */
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

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

const URI = process.env.DATABASE_URI || process.env.MONGODB_URI;
if (!URI) { console.error("No DATABASE_URI/MONGODB_URI"); process.exit(1); }

const dbName = new URL(URI.replace("mongodb+srv://", "https://")).pathname.replace(/^\//, "") || "test";
const cli = new MongoClient(URI);
await cli.connect();
const db = cli.db(dbName);
const col = db.collection("products");

const all = await col.find({}).sort({ displayOrder: 1, brand: 1, model: 1 }).toArray();
console.log(`Total products: ${all.length}\n`);

// Helper: pull last "filename-ish" token out of any URL (or media doc filename field)
function fileToken(u) {
  if (!u || typeof u !== "string") return "";
  const tail = u.split("?")[0].split("/").pop() || "";
  return tail.toLowerCase();
}

const brandTokens = new Set();
for (const p of all) {
  if (p.brand) brandTokens.add(String(p.brand).toLowerCase().split(/\s+/)[0]);
}
const KNOWN_BRANDS = [...brandTokens].filter(Boolean);

const rows = [];
for (const p of all) {
  const brand = (p.brand || "").toString();
  const model = (p.model || "").toString();
  const url   = p.imageUrl || "";
  const file  = fileToken(url);

  // If imageUrl is a generic stock URL with no brand info, don't flag it.
  const isStock = /pexels|unsplash|images\.unsplash/i.test(url);

  // What brand tokens appear in the filename?
  const brandInFile = KNOWN_BRANDS.filter(b => b.length >= 3 && file.includes(b));
  const myBrand = brand.toLowerCase().split(/\s+/)[0];
  const myModel = model.toLowerCase();

  let flag = null;
  if (!isStock && file) {
    const mentionsAnotherBrand =
      brandInFile.length > 0 && !brandInFile.includes(myBrand);
    const missingOwnBrandAndModel =
      myBrand && myBrand.length >= 3 &&
      !file.includes(myBrand) &&
      myModel && myModel.length >= 3 && !file.replace(/[^a-z0-9]/g, "").includes(myModel.replace(/[^a-z0-9]/g, ""));

    if (mentionsAnotherBrand) flag = `filename mentions ${brandInFile.join(",")} (not ${myBrand})`;
    else if (missingOwnBrandAndModel) flag = `filename has no brand/model match`;
  }

  rows.push({
    id: String(p._id),
    brand, model, category: p.category, file, url, flag, isStock,
    image: p.image ? String(p.image) : null,
  });
}

// Print full table
console.log("ID                        | BRAND/MODEL                          | CATEGORY            | IMAGE TOKEN");
console.log("-".repeat(140));
for (const r of rows) {
  const bm = `${r.brand} ${r.model}`.padEnd(36).slice(0, 36);
  const cat = (r.category || "").padEnd(20).slice(0, 20);
  const tok = r.file || "(empty)";
  console.log(`${r.id} | ${bm} | ${cat} | ${tok}${r.flag ? "   <-- " + r.flag : ""}`);
}

console.log("\n=== FLAGGED ROWS ===");
const flagged = rows.filter(r => r.flag);
if (!flagged.length) console.log("None.");
for (const r of flagged) {
  console.log(`\n  ${r.brand} ${r.model}  [${r.category}]   id=${r.id}`);
  console.log(`    flag: ${r.flag}`);
  console.log(`    url : ${r.url}`);
  if (r.image) console.log(`    image relation: ${r.image}`);
}

console.log("\n=== STOCK / GENERIC IMAGES (informational) ===");
const stock = rows.filter(r => r.isStock).length;
console.log(`${stock} products use a generic Pexels/Unsplash stock photo.`);

console.log(`\n=== Specific lookup: 6a1524e09881812debc87620 ===`);
const target = rows.find(r => r.id === "6a1524e09881812debc87620");
console.log(target || "(not found by id; full doc dump below)");
if (!target) {
  const doc = await col.findOne({ _id: { $eq: undefined } }); // placeholder
}
const raw = await col.findOne({ _id: { $exists: true }, $expr: { $eq: [{ $toString: "$_id" }, "6a1524e09881812debc87620"] } });
console.log("raw imageUrl:", raw?.imageUrl);
console.log("raw image   :", raw?.image);

await cli.close();
