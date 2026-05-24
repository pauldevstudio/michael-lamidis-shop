/**
 * Idempotent seed script:
 *  - Creates the bootstrap admin user from env
 *  - Upserts the singleton site content document with premium copy
 *  - Adds demo products
 *
 * Run with: `npm run seed`
 */
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db";
import { UserModel } from "../models/User";
import { ContentModel } from "../models/Content";
import { ProductModel } from "../models/Product";
import { DEFAULT_CONTENT } from "../lib/default-content";

async function main() {
  await connectDB();

  const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (email && password) {
    const exists = await UserModel.findOne({ email });
    if (!exists) {
      const passwordHash = await bcrypt.hash(password, 10);
      await UserModel.create({ email, name: "Admin", passwordHash, role: "admin" });
      console.log(`[seed] Created admin: ${email}`);
    } else {
      console.log(`[seed] Admin already exists: ${email}`);
    }
  }

  // Upsert content so re-runs pick up new sections without manual cleanup.
  await ContentModel.findOneAndUpdate(
    { key: "site" },
    { ...DEFAULT_CONTENT, key: "site" },
    { upsert: true, new: true }
  );
  console.log("[seed] Upserted site content (with premium sections)");

  const sample = [
    {
      slug: "samsung-rf28-fridge",
      name: "Samsung RF28 French Door Fridge",
      brand: "Samsung",
      category: "Refrigeration",
      description: "28 cu ft French door refrigerator with twin cooling and water dispenser. Inspected, cleaned and warrantied.",
      price: 1199,
      originalPrice: 1899,
      condition: "open-box" as const,
      stock: 3,
      featured: true,
      active: true,
      images: [{ url: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=1200" }],
      specs: [
        { label: "Capacity", value: "28 cu ft" },
        { label: "Energy", value: "A+" },
        { label: "Dimensions", value: "178 x 91 x 73 cm" },
      ],
    },
    {
      slug: "bosch-series-6-dishwasher",
      name: "Bosch Series 6 Dishwasher",
      brand: "Bosch",
      category: "Dishwashers",
      description: "Whisper-quiet 42 dB dishwasher with crystal-dry technology. Tested through a full cycle in our showroom.",
      price: 549,
      originalPrice: 899,
      condition: "open-box" as const,
      stock: 5,
      featured: true,
      active: true,
      images: [{ url: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1200" }],
      specs: [
        { label: "Noise", value: "42 dB" },
        { label: "Place settings", value: "14" },
        { label: "Energy", value: "A++" },
      ],
    },
    {
      slug: "miele-w1-washing-machine",
      name: "Miele W1 Washing Machine",
      brand: "Miele",
      category: "Laundry",
      description: "9kg honeycomb-drum washing machine. Display unit, used for under a week.",
      price: 999,
      originalPrice: 1799,
      condition: "open-box" as const,
      stock: 2,
      featured: true,
      active: true,
      images: [{ url: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1200" }],
      specs: [
        { label: "Capacity", value: "9 kg" },
        { label: "Spin", value: "1400 rpm" },
        { label: "Energy", value: "A" },
      ],
    },
    {
      slug: "bosch-induction-hob",
      name: "Bosch Series 8 Induction Hob",
      brand: "Bosch",
      category: "Cooking",
      description: "60cm induction hob with FlexInduction zones. Cosmetic mark on the underside, fully functional.",
      price: 449,
      originalPrice: 799,
      condition: "open-box" as const,
      stock: 4,
      featured: false,
      active: true,
      images: [{ url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200" }],
      specs: [
        { label: "Width", value: "60 cm" },
        { label: "Zones", value: "4 induction" },
      ],
    },
  ];

  for (const p of sample) {
    await ProductModel.updateOne({ slug: p.slug }, { $setOnInsert: p }, { upsert: true });
  }
  console.log(`[seed] Upserted ${sample.length} products`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
