/**
 * One-shot: polish the About Page content global.
 * Schema: { headline, subheadline, story: [{ text }] }
 *
 * Hit: http://localhost:3000/api/dev/update-about
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
      slug: "about-content",
      data: {
        headline: "The Lamidis Story",
        subheadline:
          "A family-run business making premium appliances affordable for Cypriot families since 2014.",
        story: [
          {
            text:
              "Built in Limassol, for Cyprus. Michael Lamidis started this business with a simple idea: brand-new appliances shouldn't cost a fortune just because they came out of a box. After 12 years working with major manufacturers, he saw thousands of perfectly good units being marked down for the smallest reasons - a scratch on a side panel, missing styrofoam, an old packaging style.",
          },
          {
            text:
              "What 'open box' really means. Every appliance in our showroom is brand new - never used. The only thing different is the box. We test each unit through a 47-point inspection, restore the original warranty, and deliver it to your door at 30-70% off retail.",
          },
          {
            text:
              "A business that knows its customers by name. We're not a faceless chain. When you call us, you talk to Michael or a member of his team. When something needs fixing, we send a technician within 48 hours. Over 5,000 Cypriot households trust us - many on referrals from friends who already shop with us.",
          },
        ],
      },
    });

    return NextResponse.json({
      ok: true,
      message: "About Page polished with the Lamidis Story.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
