/**
 * One-shot: delete junk/test products that don't belong in Michael Lamidis's
 * real inventory. Targets products that match the following patterns:
 *   - salePrice = 0 (clear test data)
 *   - Empty/garbage model strings (under 4 chars or non-alphanumeric ratio)
 *   - Specific known-bad models (LG TV, Philips espresso, EWRTG)
 *
 * Hit: http://localhost:3000/api/dev/delete-junk
 */
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Models we know don't have real images and don't fit the inventory
const KILL_MODELS = new Set([
  "OLED55C36LC",  // LG TV - no real image, not in inventory
  "EP3324/40",    // Philips espresso - no real image
  "SRTrg",        // EWRTG/SRTrg test entry
  "RS68A8820WW",  // old Samsung seed
  "WAX32EH0GR",   // old Bosch seed
  "SN73HX36VE",   // old Siemens seed
  "MDA 5P Series", // old Miele seed
]);

export async function GET() {
  try {
    const payload = await getPayload({ config });

    const all = await payload.find({
      collection: "products",
      limit: 500,
    });

    const deleted: { model: string; reason: string }[] = [];
    const kept: string[] = [];

    for (const product of all.docs) {
      const p = product as Record<string, unknown>;
      const model = (p.model as string) ?? "";
      const salePrice = (p.salePrice as number) ?? 0;
      let reason = "";

      if (salePrice === 0)              reason = "salePrice = 0 (test data)";
      else if (!model || model.length < 3) reason = `invalid model: "${model}"`;
      else if (KILL_MODELS.has(model))  reason = "in kill list";

      if (reason) {
        await payload.delete({ collection: "products", id: p.id as string });
        deleted.push({ model, reason });
      } else {
        kept.push(model);
      }
    }

    return NextResponse.json({
      ok: true,
      message: `Deleted ${deleted.length} junk products. Kept ${kept.length} clean products.`,
      deleted,
      kept,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
