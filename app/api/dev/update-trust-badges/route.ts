/**
 * One-shot: polish the Trust Badges global.
 * 5 credibility-anchored badges for Cyprus shoppers.
 *
 * Hit: http://localhost:3000/api/dev/update-trust-badges
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
      slug: "trust-badges",
      data: {
        eyebrow: "Trusted by Thousands",
        title: "Why Families Choose Lamidis",
        items: [
          {
            icon: "CheckCircle2",
            title: "47-Point Certified",
            description: "Every appliance individually inspected and tested.",
          },
          {
            icon: "ShieldCheck",
            title: "12-Month Warranty",
            description: "Full manufacturer-grade protection on every unit.",
          },
          {
            icon: "Truck",
            title: "Free Cyprus Delivery",
            description: "Anywhere on the island, no extra charges.",
          },
          {
            icon: "RotateCcw",
            title: "14-Day Returns",
            description: "Not satisfied? Send it back for a full refund.",
          },
          {
            icon: "Star",
            title: "5-Star Rated",
            description: "Hundreds of happy Cypriot households.",
          },
        ],
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Trust Badges polished with 5 credibility-anchored claims.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
