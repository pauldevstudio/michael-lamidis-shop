/**
 * One-shot: polish the Features Section global (Why Open Box?).
 * 6 features tuned for Cyprus market.
 *
 * Hit: http://localhost:3000/api/dev/update-features
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
      slug: "features-section",
      data: {
        eyebrow: "Why Open Box?",
        title: "Premium appliances. Honest prices. Zero compromise.",
        subtitle:
          "Same warranty, same performance - at the price you actually want to pay.",
        items: [
          {
            icon: "Tag",
            title: "Save up to 70%",
            description: "Genuine new-stock appliances at open-box pricing.",
          },
          {
            icon: "CheckCircle2",
            title: "47-Point Inspection",
            description: "Every unit certified by our technicians before sale.",
          },
          {
            icon: "Shield",
            title: "12-Month Warranty",
            description: "Full manufacturer-grade warranty on every appliance.",
          },
          {
            icon: "Truck",
            title: "Free Cyprus Delivery",
            description: "Anywhere on the island, no extra charges.",
          },
          {
            icon: "Recycle",
            title: "Old Unit Removed",
            description: "We haul away your old appliance at no cost.",
          },
          {
            icon: "HeartHandshake",
            title: "14-Day Returns",
            description: "Don't love it? Send it back for a full refund.",
          },
        ],
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Features Section polished with 6 Cyprus-tuned features.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
