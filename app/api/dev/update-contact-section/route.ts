/**
 * One-shot: refine the Contact Section global with polished copy.
 * Hit: http://localhost:3000/api/dev/update-contact-section
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
      slug: "contact-section",
      data: {
        eyebrow: "Talk to a Specialist",
        title: "Visit our Limassol showroom",
        subtitle:
          "Walk in, see the inventory, talk to a real human. Or send us a message - we reply within 2 hours during business hours.",
        addressLabel: "Showroom Address",
        phoneLabel: "Call Us",
        emailLabel: "Email Us",
        hoursLabel: "Open Hours",
        mapCta: "Open in Google Maps",
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Contact Section updated with polished copy.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
