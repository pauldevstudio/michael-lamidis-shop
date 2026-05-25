/**
 * One-shot: polish the Navigation global.
 * Schema: { items: [{ label, href }], getQuoteLabel, getQuoteHref }
 *
 * Hit: http://localhost:3000/api/dev/update-navigation
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
      slug: "navigation",
      data: {
        items: [
          { label: "Home",         href: "/" },
          { label: "Shop",         href: "/products" },
          { label: "About",        href: "/about" },
          { label: "Testimonials", href: "/testimonials" },
          { label: "Contact",      href: "/contact" },
        ],
        getQuoteLabel: "Visit Showroom",
        getQuoteHref: "/contact",
      },
    });

    return NextResponse.json({
      ok: true,
      message:
        "Navigation polished: Blog removed, Products→Shop, CTA now 'Visit Showroom'.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
