/**
 * One-shot: expand the Category Strip global with all 12 product categories.
 *
 * Hit: http://localhost:3000/api/dev/update-category-strip-full
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
          { id: "freezers",          label: "Freezers" },
          { id: "air-conditioners",  label: "Air Conditioning" },
          { id: "mattresses",        label: "Mattresses" },
          { id: "furniture",         label: "Furniture" },
          { id: "tools",             label: "Tools" },
          { id: "kitchenware",       label: "Kitchenware" },
          { id: "bicycles",          label: "Bicycles" },
        ],
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Category Strip expanded with all 10 active categories.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
