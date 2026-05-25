/**
 * One-shot: polish the Home Hero global.
 * Headline uses a single \n separator - second line renders in gold.
 *
 * Hit: http://localhost:3000/api/dev/update-hero
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
      slug: "home-hero",
      data: {
        locationLabel: "Limassol, Cyprus",
        badge: "Certified Open Box",
        headline: "The Same Appliance.\n50% Less. No Compromise.",
        subheadline:
          "Brand-new Samsung, LG, Bosch, Miele & Siemens appliances - certified, warranted, delivered free across Cyprus. Walk into our Limassol showroom or browse online.",
        primaryCtaLabel: "Shop Now",
        primaryCtaHref: "/products",
        secondaryCtaLabel: "Visit Showroom",
        secondaryCtaHref: "/contact",
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Home Hero polished with sharper hook and friction-removing CTAs.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
