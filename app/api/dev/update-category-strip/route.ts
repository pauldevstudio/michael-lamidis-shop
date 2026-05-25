/**
 * One-shot: polish the Category Strip global.
 * Schema: { eyebrow, items: [{ id, label }] }
 *
 * Hit: http://localhost:3000/api/dev/update-category-strip
 */
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPayload({ config });

    await payload.updateGlobal({
      slug: "category-strip",
      data: {
        eyebrow: "Shop by Category",
        items: [
          { id: "all",               label: "All" },
          { id: "refrigerators",     label: "Refrigerators" },
          { id: "washing-machines",  label: "Washing Machines" },
          { id: "ovens",             label: "Ovens & Cookers" },
          { id: "dishwashers",       label: "Dishwashers" },
          { id: "freezers",          label: "Freezers" },
          { id: "air-conditioners",  label: "Air Conditioning" },
        ],
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Category Strip polished with Cyprus-relevant categories.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
