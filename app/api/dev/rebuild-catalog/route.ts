/**
 * One-shot: rebuild the Products catalog with Michael Lamidis's real inventory.
 *
 * Wipes existing products, then imports 12 appliances with images from
 * /product-images/, attached to Media collection and linked on each product.
 *
 * Hit: http://localhost:3000/api/dev/rebuild-catalog
 */
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ProductDef {
  filename: string;
  brand: string;
  model: string;
  category: "refrigerators" | "washing-machines" | "freezers" | "air-conditioners" | "mattresses" | "furniture" | "tools" | "kitchenware" | "bicycles";
  originalPrice: number;
  salePrice: number;
  grade: string;
  warranty: number;
  description: string;
  specs: { label: string; value: string }[];
  displayOrder: number;
}

// Category visual + icon mapping
const CATEGORY_META: Record<ProductDef["category"], { icon: string; colorFrom: string; colorTo: string }> = {
  refrigerators:      { icon: "Square",    colorFrom: "#0F766E", colorTo: "#14B8A6" },
  "washing-machines": { icon: "Loader",    colorFrom: "#7C3AED", colorTo: "#A78BFA" },
  freezers:           { icon: "Snowflake", colorFrom: "#0E7490", colorTo: "#22D3EE" },
  "air-conditioners": { icon: "Wind",      colorFrom: "#0369A1", colorTo: "#38BDF8" },
  mattresses:         { icon: "Bed",       colorFrom: "#475569", colorTo: "#94A3B8" },
  furniture:          { icon: "Sofa",      colorFrom: "#854D0E", colorTo: "#A16207" },
  tools:              { icon: "Wrench",    colorFrom: "#991B1B", colorTo: "#DC2626" },
  kitchenware:        { icon: "Utensils",  colorFrom: "#65A30D", colorTo: "#84CC16" },
  bicycles:           { icon: "Bike",      colorFrom: "#1E40AF", colorTo: "#3B82F6" },
};

const PRODUCTS: ProductDef[] = [
  // ── REFRIGERATORS ──────────────────────────────────────────
  {
    filename: "667107332_1466015791615803_480292278061389983_n.jpg",
    brand: "Samsung",
    model: "RB34C6B2E41",
    category: "refrigerators",
    originalPrice: 1099,
    salePrice: 599,
    grade: "A+",
    warranty: 12,
    description:
      "Samsung Bespoke Space Max Fridge & Freezer in elegant navy glass finish. SpaceMax™ insulation gives more usable interior, Twin Cooling Plus keeps food fresh longer.",
    specs: [
      { label: "Capacity",     value: "344 L" },
      { label: "Energy Class", value: "E" },
      { label: "Finish",       value: "Glam Navy" },
      { label: "No Frost",     value: "Yes" },
      { label: "Dimensions",   value: "185 × 60 × 66 cm" },
    ],
    displayOrder: 1,
  },
  {
    filename: "667375681_1466016791615703_1995041639614522653_n.jpg",
    brand: "Samsung",
    model: "RR39A74A312",
    category: "refrigerators",
    originalPrice: 999,
    salePrice: 549,
    grade: "A",
    warranty: 12,
    description:
      "Samsung Bespoke Max Tall Fridge in clean white. Single-door upright design optimised for maximum vertical storage - ideal as a primary or secondary unit.",
    specs: [
      { label: "Capacity",     value: "387 L" },
      { label: "Energy Class", value: "F" },
      { label: "Finish",       value: "Satin White" },
      { label: "No Frost",     value: "Yes" },
      { label: "Dimensions",   value: "186 × 60 × 65 cm" },
    ],
    displayOrder: 2,
  },
  {
    filename: "678779730_1476691680548214_2270234178947408392_n.jpg",
    brand: "Samsung",
    model: "RF50A5002S9",
    category: "refrigerators",
    originalPrice: 1599,
    salePrice: 899,
    grade: "A",
    warranty: 12,
    description:
      "Samsung Series 7 French Door fridge with Twin Cooling Plus. Generous 501L capacity with separately cooled compartments, perfect for large families.",
    specs: [
      { label: "Capacity",     value: "501 L" },
      { label: "Energy Class", value: "F" },
      { label: "Doors",        value: "French Door (3-door)" },
      { label: "No Frost",     value: "Yes" },
      { label: "Dimensions",   value: "178 × 79 × 72 cm" },
    ],
    displayOrder: 3,
  },
  {
    filename: "703035095_1498710025013046_2419156101390887269_n.jpg",
    brand: "Tesla",
    model: "RD4650FTXE",
    category: "refrigerators",
    originalPrice: 899,
    salePrice: 599,
    grade: "A",
    warranty: 12,
    description:
      "Tesla top-mount fridge-freezer in brushed stainless. NoFrost technology, electronic temperature control, and a quiet inverter compressor.",
    specs: [
      { label: "Capacity",     value: "465 L" },
      { label: "Energy Class", value: "E" },
      { label: "Finish",       value: "Brushed Steel" },
      { label: "No Frost",     value: "Yes" },
      { label: "Dimensions",   value: "180 × 70 × 70 cm" },
    ],
    displayOrder: 4,
  },

  // ── WASHING MACHINES ───────────────────────────────────────
  {
    filename: "667392312_1466014728282576_8358449013578616411_n.jpg",
    brand: "Tesla",
    model: "WF81230KGR",
    category: "washing-machines",
    originalPrice: 599,
    salePrice: 320,
    grade: "A",
    warranty: 12,
    description:
      "Tesla 8kg front-load washer in white. Inverter motor, 1200 RPM spin, 15+ programmes including quick wash and eco modes.",
    specs: [
      { label: "Capacity",   value: "8 kg" },
      { label: "Spin Speed", value: "1200 RPM" },
      { label: "Energy Class", value: "D" },
      { label: "Programmes", value: "15" },
      { label: "Dimensions", value: "85 × 60 × 53 cm" },
    ],
    displayOrder: 5,
  },
  {
    filename: "677334228_1475327480684634_3445826054162749798_n.jpg",
    brand: "Tesla",
    model: "WF81230KSGR",
    category: "washing-machines",
    originalPrice: 649,
    salePrice: 349,
    grade: "A",
    warranty: 12,
    description:
      "Tesla 8kg front-load washer in silver finish. Inverter motor with extra quiet operation, 1200 RPM spin, full Greek-language interface.",
    specs: [
      { label: "Capacity",   value: "8 kg" },
      { label: "Spin Speed", value: "1200 RPM" },
      { label: "Energy Class", value: "D" },
      { label: "Programmes", value: "15" },
      { label: "Finish",     value: "Silver" },
    ],
    displayOrder: 6,
  },
  {
    filename: "695838199_1488943105989738_4732014813167858676_n.jpg",
    brand: "Tesla",
    model: "WF71230KGR",
    category: "washing-machines",
    originalPrice: 549,
    salePrice: 299,
    grade: "A",
    warranty: 60,
    description:
      "Tesla 7kg front-load washer - brand new with 5-year warranty. Inverter motor, 1200 RPM, perfect for smaller households.",
    specs: [
      { label: "Capacity",   value: "7 kg" },
      { label: "Spin Speed", value: "1200 RPM" },
      { label: "Warranty",   value: "5 Years" },
      { label: "Programmes", value: "15" },
      { label: "Dimensions", value: "85 × 60 × 49 cm" },
    ],
    displayOrder: 7,
  },
  {
    filename: "673525335_1474371514113564_5723093939029224197_n.jpg",
    brand: "Samsung",
    model: "WW90T4040CE",
    category: "washing-machines",
    originalPrice: 649,
    salePrice: 339,
    grade: "A+",
    warranty: 12,
    description:
      "Samsung 9kg EcoBubble washer. Eco Bubble technology dissolves detergent for deep cleaning at low temperatures - saves up to 70% energy.",
    specs: [
      { label: "Capacity",   value: "9 kg" },
      { label: "Spin Speed", value: "1400 RPM" },
      { label: "Energy Class", value: "B" },
      { label: "Technology", value: "EcoBubble" },
      { label: "Programmes", value: "14" },
    ],
    displayOrder: 8,
  },

  // ── FREEZERS ───────────────────────────────────────────────
  {
    filename: "687026969_1485631679654214_2707756120081853865_n.jpg",
    brand: "Tesla",
    model: "RH4200ME",
    category: "freezers",
    originalPrice: 749,
    salePrice: 469,
    grade: "A",
    warranty: 12,
    description:
      "Tesla chest freezer - generous 400L capacity. Electronic temperature control with digital display, fast-freeze mode, and energy-efficient operation.",
    specs: [
      { label: "Capacity",       value: "400 L" },
      { label: "Type",           value: "Chest Freezer" },
      { label: "Control",        value: "Electronic / Digital" },
      { label: "Energy Class",   value: "F" },
      { label: "Dimensions",     value: "85 × 130 × 70 cm" },
    ],
    displayOrder: 9,
  },
  {
    filename: "688980623_1487439819473400_1394881063339976199_n.jpg",
    brand: "Tesla",
    model: "RH1501ME",
    category: "freezers",
    originalPrice: 399,
    salePrice: 220,
    grade: "A",
    warranty: 12,
    description:
      "Tesla compact chest freezer - perfect for tight spaces or as a secondary freezer. 150L capacity, mechanical thermostat, low energy consumption.",
    specs: [
      { label: "Capacity",     value: "150 L" },
      { label: "Type",         value: "Chest Freezer" },
      { label: "Control",      value: "Mechanical" },
      { label: "Energy Class", value: "F" },
      { label: "Dimensions",   value: "85 × 75 × 56 cm" },
    ],
    displayOrder: 10,
  },

  // ── AIR CONDITIONERS ───────────────────────────────────────
  {
    filename: "697107275_1492922028925179_6624731052807725003_n.jpg",
    brand: "METZ",
    model: "MTZ09E23",
    category: "air-conditioners",
    originalPrice: 549,
    salePrice: 349,
    grade: "A++",
    warranty: 12,
    description:
      "METZ split AC unit - 9000 BTU. Inverter technology for smart cooling, quiet operation, R32 eco-friendly refrigerant.",
    specs: [
      { label: "Cooling Power", value: "9000 BTU" },
      { label: "Energy Class",  value: "A++" },
      { label: "Refrigerant",   value: "R32" },
      { label: "Inverter",      value: "Yes" },
      { label: "Wi-Fi Ready",   value: "Yes" },
    ],
    displayOrder: 11,
  },
  {
    filename: "703131672_1498712175012831_1508342980366213268_n.jpg",
    brand: "Tesla",
    model: "TT26EX21-09321A",
    category: "air-conditioners",
    originalPrice: 549,
    salePrice: 310,
    grade: "A++",
    warranty: 12,
    description:
      "Tesla smart inverter AC - cool smarter, live more comfortably. Energy-efficient inverter compressor with LED display and remote control.",
    specs: [
      { label: "Cooling Power", value: "9000 BTU" },
      { label: "Energy Class",  value: "A++" },
      { label: "Refrigerant",   value: "R32" },
      { label: "Inverter",      value: "Yes" },
      { label: "Display",       value: "LED" },
    ],
    displayOrder: 12,
  },
  // ── MATTRESSES ─────────────────────────────────────────────
  {
    filename: "684521294_1481645453386170_8181659828627705339_n.jpg",
    brand: "Hotshoppa",
    model: "Hybrid",
    category: "mattresses",
    originalPrice: 599,
    salePrice: 369,
    grade: "A",
    warranty: 60,
    description:
      "Hotshoppa Hybrid Mattress - premium pocket springs + memory foam hybrid construction. Cool-touch top layer, medium-firm support, 5-year warranty.",
    specs: [
      { label: "Type",      value: "Hybrid (Pocket Spring + Memory Foam)" },
      { label: "Firmness",  value: "Medium-Firm" },
      { label: "Height",    value: "25 cm" },
      { label: "Warranty",  value: "5 Years" },
      { label: "Top Layer", value: "Cool-Touch Fabric" },
    ],
    displayOrder: 13,
  },
  {
    filename: "693175530_1491397389077643_2527276311260474256_n.jpg",
    brand: "Lamidis",
    model: "Premium Pocket Spring",
    category: "mattresses",
    originalPrice: 449,
    salePrice: 249,
    grade: "A",
    warranty: 24,
    description:
      "Premium Pocket Spring Mattress - independent pocket springs for tailored support and reduced motion transfer. Quilted top layer for breathable comfort.",
    specs: [
      { label: "Type",       value: "Pocket Spring" },
      { label: "Firmness",   value: "Medium" },
      { label: "Height",     value: "22 cm" },
      { label: "Spring Count", value: "1200+" },
      { label: "Cover",      value: "Quilted Knit" },
    ],
    displayOrder: 14,
  },

  // ── FURNITURE ──────────────────────────────────────────────
  {
    filename: "696004931_1492099702340745_3317729672318876486_n.jpg",
    brand: "Lamidis",
    model: "Double Rattan Swing Chair",
    category: "furniture",
    originalPrice: 549,
    salePrice: 299,
    grade: "A",
    warranty: 12,
    description:
      "High Quality Double Rattan Swing Chair with stand. Premium synthetic rattan weave, weather-resistant powder-coated steel frame, includes plush grey cushions.",
    specs: [
      { label: "Material",     value: "Synthetic Rattan + Steel" },
      { label: "Capacity",     value: "Double Seater (up to 200 kg)" },
      { label: "Includes",     value: "Stand + Cushions" },
      { label: "Use",          value: "Indoor / Outdoor" },
      { label: "Cushion Color", value: "Grey" },
    ],
    displayOrder: 15,
  },

  // ── TOOLS ──────────────────────────────────────────────────
  {
    filename: "681248867_1481642926719756_3196513784116901355_n.jpg",
    brand: "JTC",
    model: "Professional Tool Cabinet",
    category: "tools",
    originalPrice: 599,
    salePrice: 349,
    grade: "A",
    warranty: 12,
    description:
      "JTC Professional 7-drawer rolling tool cabinet with 199 essential tools - screwdrivers, pliers, wrenches, sockets and more. Heavy-duty steel construction.",
    specs: [
      { label: "Drawers",   value: "7" },
      { label: "Tools",     value: "199 pieces" },
      { label: "Material",  value: "Heavy-Duty Steel" },
      { label: "Mobility",  value: "4 lockable casters" },
      { label: "Use",       value: "Professional / Workshop" },
    ],
    displayOrder: 16,
  },

  // ── KITCHENWARE ────────────────────────────────────────────
  {
    filename: "687870385_1487186906165358_327224033343484094_n.jpg",
    brand: "DSP",
    model: "7-Piece Cookware Set",
    category: "kitchenware",
    originalPrice: 199,
    salePrice: 99,
    grade: "A",
    warranty: 12,
    description:
      "DSP Professional 7-Piece Multi-Cookware Set - non-stick granite coating, glass lids, ergonomic wood-effect handles. Induction & oven safe.",
    specs: [
      { label: "Pieces",     value: "7" },
      { label: "Coating",    value: "Non-Stick Granite" },
      { label: "Compatible", value: "Induction / Gas / Electric / Oven" },
      { label: "Lids",       value: "Tempered Glass" },
      { label: "Handles",    value: "Wood-Effect Bakelite" },
    ],
    displayOrder: 17,
  },

  // ── BICYCLES ───────────────────────────────────────────────
  {
    filename: "662271389_1463756535175062_7970263347889576988_n.jpg",
    brand: "Lamidis",
    model: "Korean Style City Bicycle",
    category: "bicycles",
    originalPrice: 349,
    salePrice: 199,
    grade: "A",
    warranty: 12,
    description:
      "Brand New Korean Style City Bicycle with front basket. Cream pastel frame, comfortable upright seating position, rear rack, ideal for daily commuting around Limassol.",
    specs: [
      { label: "Style",     value: "Korean City / Urban" },
      { label: "Frame",     value: "Cream Pastel" },
      { label: "Includes",  value: "Front Basket + Rear Rack" },
      { label: "Wheel Size", value: "26 inch" },
      { label: "Condition", value: "Brand New (still wrapped)" },
    ],
    displayOrder: 18,
  },
];

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const imagesDir = path.join(process.cwd(), "product-images");

    // 1. Delete all existing products
    const existing = await payload.find({ collection: "products", limit: 500 });
    let deletedCount = 0;
    for (const p of existing.docs) {
      await payload.delete({ collection: "products", id: p.id as string });
      deletedCount++;
    }

    // 2. Import each product
    const results: { model: string; status: string }[] = [];
    for (const def of PRODUCTS) {
      try {
        const filePath = path.join(imagesDir, def.filename);
        const buffer = await fs.readFile(filePath);

        // Create Media doc
        const media = await payload.create({
          collection: "media",
          data: { alt: `${def.brand} ${def.model}` },
          file: {
            data: buffer,
            mimetype: "image/jpeg",
            name: `${def.brand.toLowerCase()}-${def.model.toLowerCase().replace(/[^a-z0-9]/g, "-")}.jpg`,
            size: buffer.length,
          },
        });

        // Compute savings %
        const savings = Math.round(((def.originalPrice - def.salePrice) / def.originalPrice) * 100);
        const meta = CATEGORY_META[def.category];

        // Create Product
        await payload.create({
          collection: "products",
          data: {
            brand:         def.brand,
            model:         def.model,
            category:      def.category,
            originalPrice: def.originalPrice,
            salePrice:     def.salePrice,
            savings,
            grade:         def.grade,
            warranty:      def.warranty,
            description:   def.description,
            specs:         def.specs,
            displayOrder:  def.displayOrder,
            icon:          meta.icon,
            colorFrom:     meta.colorFrom,
            colorTo:       meta.colorTo,
            image:         (media as { id: string }).id,
          },
        });

        results.push({ model: def.model, status: "OK" });
      } catch (err) {
        results.push({ model: def.model, status: `ERROR: ${String(err)}` });
      }
    }

    const okCount = results.filter(r => r.status === "OK").length;
    return NextResponse.json({
      ok: true,
      message: `Catalog rebuilt. Deleted ${deletedCount} old, imported ${okCount}/${PRODUCTS.length} new products.`,
      results,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
