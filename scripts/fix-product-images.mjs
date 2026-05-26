/**
 * One-shot fix: update every Payload `products.imageUrl` to a working
 * Pexels stock photo chosen by category. The original seed pointed to
 * /api/payload/media/file/sample-*.jpg which never had backing files,
 * so all admin product cards showed broken thumbnails.
 *
 * Run with:  node scripts/fix-product-images.mjs
 */
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";

const uri = process.env.DATABASE_URI || process.env.MONGODB_URI;
if (!uri) {
  console.error("Set DATABASE_URI or MONGODB_URI first.");
  process.exit(1);
}

// Stock photos by category — same Pexels pattern the public site already uses.
const BY_CATEGORY = {
  "refrigerators":      "https://images.pexels.com/photos/6987718/pexels-photo-6987718.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
  "washing-machines":   "https://images.pexels.com/photos/7282376/pexels-photo-7282376.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
  "ovens":              "https://images.pexels.com/photos/4112556/pexels-photo-4112556.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
  "dishwashers":        "https://images.pexels.com/photos/8082218/pexels-photo-8082218.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
  "freezers":           "https://images.pexels.com/photos/9462256/pexels-photo-9462256.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
  "air-conditioners":   "https://images.pexels.com/photos/8082222/pexels-photo-8082222.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
  "tvs":                "https://images.pexels.com/photos/7587735/pexels-photo-7587735.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
  "small-appliances":   "https://images.pexels.com/photos/4112723/pexels-photo-4112723.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
  "mattresses":         "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
  "furniture":          "https://images.pexels.com/photos/447592/pexels-photo-447592.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
  "tools":              "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
  "kitchenware":        "https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
  "bicycles":           "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop",
};
const FALLBACK = "https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop";

await mongoose.connect(uri);
const db = mongoose.connection.db;
const coll = db.collection("products");

const all = await coll.find({}).toArray();
console.log(`Updating ${all.length} products...`);

let n = 0;
for (const p of all) {
  const url = BY_CATEGORY[p.category] || FALLBACK;
  // Clear the broken `image` upload relation too so the fallback `imageUrl` wins
  // in the admin and product detail rendering paths.
  await coll.updateOne({ _id: p._id }, { $set: { imageUrl: url }, $unset: { image: "" } });
  n++;
  console.log(`  ${p.brand} ${p.model} (${p.category}) -> set imageUrl`);
}

console.log(`\nDone. Updated ${n} products.`);
await mongoose.disconnect();
process.exit(0);
