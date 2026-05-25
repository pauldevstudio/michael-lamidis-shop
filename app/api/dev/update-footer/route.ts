/**
 * One-shot: refine the Footer global with a polished description +
 * designer credit appended to the copyright line.
 * Hit: http://localhost:3000/api/dev/update-footer
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
      slug: "footer",
      data: {
        description:
          "Cyprus's #1 destination for certified open box appliances. Quality you can trust. Savings you can feel.",
        copyright:
          "Michael Lamidis. All rights reserved. · Designed by Smart Web App Solutions",
        companyLinks: [
          { label: "Our Story",    href: "/about" },
          { label: "Services",     href: "/services" },
          { label: "Testimonials", href: "/testimonials" },
          { label: "Blog",         href: "/blog" },
        ],
        servicesLinks: [
          { label: "Free Delivery",      href: "/services" },
          { label: "Pro Installation",   href: "/services" },
          { label: "12-Month Warranty",  href: "/services" },
          { label: "14-Day Returns",     href: "/services" },
        ],
      },
    });

    return NextResponse.json({
      ok: true,
      message:
        "Footer updated with polished description, refreshed link labels, and Smart Web App Solutions credit.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
