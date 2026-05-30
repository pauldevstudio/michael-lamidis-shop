import fs from "node:fs";
import { MongoClient } from "mongodb";

const env = fs.readFileSync(".env.local", "utf8")
  .split(/\r?\n/)
  .reduce((a, l) => {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)$/);
    if (m) a[m[1]] = m[2].replace(/^["']|["']$/g, "");
    return a;
  }, {});

const uri = env.DATABASE_URI;
const dbName = uri.match(/\/([^/?]+)\?/)?.[1] || "test";
const cli = new MongoClient(uri);
await cli.connect();
const db = cli.db(dbName);

console.log("=== DB:", dbName, "===");
const cols = await db.listCollections().toArray();
console.log("Collections:", cols.map(c => c.name).join(", "));

console.log("\n=== globals (key fields only) ===");
const globals = await db.collection("globals").find({}).toArray();
for (const g of globals) {
  console.log(`\n--- ${g.globalType} ---`);
  const interesting = ["badge", "locationLabel", "headline", "subheadline", "message", "ctaLabel", "name", "logo", "tagline"];
  for (const k of interesting) {
    if (g[k] != null) console.log(`  ${k}: ${String(g[k]).slice(0, 180)}`);
  }
}

console.log("\n=== site-content doc ===");
for (const cn of ["sitecontents", "site_contents", "siteContent"]) {
  try {
    const sc = await db.collection(cn).findOne({ key: "site" });
    if (sc) {
      console.log(`Collection: ${cn}`);
      console.log("business.logo:", sc.data?.business?.logo || "(none)");
      console.log("business.name:", sc.data?.business?.name);
      console.log("hero.badge:", sc.data?.hero?.badge);
      console.log("hero.locationLabel:", sc.data?.hero?.locationLabel);
      console.log("hero.headline:", JSON.stringify(sc.data?.hero?.headline)?.slice(0, 160));
      break;
    }
  } catch {}
}

const pCount = await db.collection("products").countDocuments();
console.log(`\n=== Products: ${pCount} ===`);
const sample = await db.collection("products").find({}).limit(5).toArray();
for (const p of sample) {
  console.log(`  - ${p.brand} ${p.model} EUR${p.salePrice} [${p.category}]`);
}

await cli.close();
