/**
 * One-shot: copy data/site-content.json products into Payload's
 * `products` collection. Safe to re-run (matches by brand+model).
 *
 * Run with:  npx payload run scripts/migrate-products.ts
 */
import { getPayload } from "payload";
import fs from "node:fs";
import path from "node:path";

async function main() {
  // Dynamic import keeps the (async) payload.config out of the static
  // module graph so npx payload run's CJS bridge doesn't choke on it.
  const configModule = await import("../payload.config.ts");
  const config = configModule.default;

  const dataPath = path.join(process.cwd(), "data", "site-content.json");
  const raw = fs.readFileSync(dataPath, "utf-8").replace(/\s+$/, "");
  const data = JSON.parse(raw);

  const payload = await getPayload({ config });

  const products = (data as { products?: unknown[] }).products ?? [];
  console.log("Found " + products.length + " products in JSON.");

  let created = 0;
  let updated = 0;

  for (const p of products as Array<Record<string, unknown>>) {
    const fields = {
      brand:         (p.brand as string) ?? "",
      model:         (p.model as string) ?? "",
      category:      (p.category as string) ?? "small-appliances",
      salePrice:     Number(p.salePrice ?? 0),
      originalPrice: Number(p.originalPrice ?? 0),
      savings:       Number(p.savings ?? 0),
      grade:         (p.grade as string) ?? "A",
      warranty:      Number(p.warranty ?? 12),
      description:   (p.description as string) ?? "",
      imageUrl:      (p.imageUrl as string) ?? "",
      icon:          (p.icon as string) ?? "Package",
      colorFrom:     (p.colorFrom as string) ?? "#3A5F8A",
      colorTo:       (p.colorTo as string) ?? "#7FAEDB",
      specs:         Array.isArray(p.specs) ? p.specs : [],
    };

    const existing = await payload.find({
      collection: "products",
      where: { and: [{ brand: { equals: fields.brand } }, { model: { equals: fields.model } }] },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      await payload.update({
        collection: "products",
        id: existing.docs[0].id,
        data: fields,
      });
      updated++;
      console.log("  updated  " + fields.brand + " " + fields.model);
    } else {
      await payload.create({ collection: "products", data: fields });
      created++;
      console.log("  created  " + fields.brand + " " + fields.model);
    }
  }

  console.log("\nDone. created=" + created + " updated=" + updated + " total=" + products.length);
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
