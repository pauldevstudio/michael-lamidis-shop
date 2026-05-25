/**
 * One-shot: replace every product's image with a random sample image from
 * /product-images/. For sampling purposes only - existing products keep
 * their data, only the image gets swapped.
 *
 * Hit: http://localhost:3000/api/dev/sample-images
 */
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only real product images - skip logos and marketing promos
const SAMPLE_IMAGES = [
  "662271389_1463756535175062_7970263347889576988_n.jpg", // bicycle
  "667107332_1466015791615803_480292278061389983_n.jpg", // Samsung Bespoke fridge
  "667375681_1466016791615703_1995041639614522653_n.jpg", // Samsung tall fridge
  "667392312_1466014728282576_8358449013578616411_n.jpg", // Tesla 8kg washer
  "673525335_1474371514113564_5723093939029224197_n.jpg", // Samsung 9kg washer
  "677334228_1475327480684634_3445826054162749798_n.jpg", // Tesla 8kg silver washer
  "678779730_1476691680548214_2270234178947408392_n.jpg", // Samsung French Door fridge
  "681248867_1481642926719756_3196513784116901355_n.jpg", // JTC tool cabinet
  "684521294_1481645453386170_8181659828627705339_n.jpg", // Hotshoppa mattress
  "687026969_1485631679654214_2707756120081853865_n.jpg", // Tesla chest freezer large
  "687870385_1487186906165358_327224033343484094_n.jpg", // DSP cookware
  "688980623_1487439819473400_1394881063339976199_n.jpg", // Tesla chest freezer small
  "693175530_1491397389077643_2527276311260474256_n.jpg", // Premium pocket spring mattress
  "695838199_1488943105989738_4732014813167858676_n.jpg", // Tesla 7kg washer
  "696004931_1492099702340745_3317729672318876486_n.jpg", // Rattan swing chair
  "697107275_1492922028925179_6624731052807725003_n.jpg", // METZ AC
  "703035095_1498710025013046_2419156101390887269_n.jpg", // Tesla fridge
  "703131672_1498712175012831_1508342980366213268_n.jpg", // Tesla AC
];

// Best-fit mapping: category → preferred image candidates
// Falls back to random pick from full pool if no match.
const CATEGORY_PREFERRED: Record<string, string[]> = {
  refrigerators: [
    "667107332_1466015791615803_480292278061389983_n.jpg",
    "667375681_1466016791615703_1995041639614522653_n.jpg",
    "678779730_1476691680548214_2270234178947408392_n.jpg",
    "703035095_1498710025013046_2419156101390887269_n.jpg",
  ],
  "washing-machines": [
    "667392312_1466014728282576_8358449013578616411_n.jpg",
    "673525335_1474371514113564_5723093939029224197_n.jpg",
    "677334228_1475327480684634_3445826054162749798_n.jpg",
    "695838199_1488943105989738_4732014813167858676_n.jpg",
  ],
  freezers: [
    "687026969_1485631679654214_2707756120081853865_n.jpg",
    "688980623_1487439819473400_1394881063339976199_n.jpg",
  ],
  "air-conditioners": [
    "697107275_1492922028925179_6624731052807725003_n.jpg",
    "703131672_1498712175012831_1508342980366213268_n.jpg",
  ],
  mattresses: [
    "684521294_1481645453386170_8181659828627705339_n.jpg",
    "693175530_1491397389077643_2527276311260474256_n.jpg",
  ],
  furniture:   ["696004931_1492099702340745_3317729672318876486_n.jpg"],
  tools:       ["681248867_1481642926719756_3196513784116901355_n.jpg"],
  kitchenware: ["687870385_1487186906165358_327224033343484094_n.jpg"],
  bicycles:    ["662271389_1463756535175062_7970263347889576988_n.jpg"],
  // For unmatched categories (ovens, dishwashers, tvs, small-appliances)
  // we use kitchen/cookware as a visual stand-in
  ovens:            ["687870385_1487186906165358_327224033343484094_n.jpg"],
  dishwashers:      ["687870385_1487186906165358_327224033343484094_n.jpg"],
  tvs:              ["703131672_1498712175012831_1508342980366213268_n.jpg"],
  "small-appliances":["687870385_1487186906165358_327224033343484094_n.jpg"],
};

function pickImage(category: string, idx: number): string {
  const preferred = CATEGORY_PREFERRED[category];
  if (preferred && preferred.length > 0) {
    return preferred[idx % preferred.length];
  }
  return SAMPLE_IMAGES[idx % SAMPLE_IMAGES.length];
}

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const imagesDir = path.join(process.cwd(), "product-images");

    const products = await payload.find({ collection: "products", limit: 500 });
    const results: { model: string; status: string }[] = [];

    let counter = 0;
    for (const product of products.docs) {
      try {
        const p = product as Record<string, unknown>;
        const category = (p.category as string) || "all";
        const filename = pickImage(category, counter);
        counter++;

        const filePath = path.join(imagesDir, filename);
        const buffer = await fs.readFile(filePath);

        // Create fresh Media doc for this product
        const media = await payload.create({
          collection: "media",
          data: { alt: `${p.brand} ${p.model}` },
          file: {
            data: buffer,
            mimetype: "image/jpeg",
            name: `sample-${(p.model as string).toLowerCase().replace(/[^a-z0-9]/g, "-")}.jpg`,
            size: buffer.length,
          },
        });

        await payload.update({
          collection: "products",
          id: p.id as string,
          data: { image: (media as { id: string }).id },
        });

        results.push({ model: p.model as string, status: `OK → ${filename}` });
      } catch (err) {
        results.push({ model: (product as { model?: string }).model ?? "?", status: `ERROR: ${String(err)}` });
      }
    }

    const okCount = results.filter(r => r.status.startsWith("OK")).length;
    return NextResponse.json({
      ok: true,
      message: `Replaced images on ${okCount}/${products.docs.length} products.`,
      results,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
