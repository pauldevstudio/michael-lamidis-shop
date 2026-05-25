/**
 * One-shot dev: update the Stats Section global with polished real-world values.
 * Hit: http://localhost:3000/api/dev/update-stats
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
      slug: "stats",
      data: {
        eyebrow: "Our Impact",
        title: "Numbers That Tell the Story",
        items: [
          { value: 12,   suffix: "+", label: "Years Serving Cyprus" },
          { value: 5000, suffix: "+", label: "Households Powered" },
          { value: 47,   suffix: "",  label: "Point Inspection" },
          { value: 70,   suffix: "%", label: "Max Savings vs Retail" },
        ],
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Stats Section updated.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
