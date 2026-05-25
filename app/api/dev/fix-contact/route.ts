/**
 * One-shot: rescue values the user put in the wrong fields.
 * The "Label" fields in Contact Section are meant to be LABEL words
 * (like "Phone"). The real phone/email/address belong in Business Info.
 * This route moves the data to the right place AND restores label words.
 *
 * Hit: http://localhost:3000/api/dev/fix-contact
 */
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPayload({ config });

    // Move user's real data into Business Info
    const existing = await payload.findGlobal({ slug: "business-info" });
    const e = existing as Record<string, unknown>;

    await payload.updateGlobal({
      slug: "business-info",
      data: {
        name: (e.name as string) ?? "Michael Lamidis",
        tagline: (e.tagline as string) ?? "Cyprus's #1 Open Box Appliance Destination",
        description: (e.description as string) ?? "",
        phone: "+357 97 755914",
        email: "lamidismichaelshop@gmail.com",
        address: "Al Hassa Village, Limassol, Cyprus",
        hours: "Mon-Fri: 09:00 - 17:00",
        social: {
          facebook: (e.social as Record<string, unknown> | undefined)?.facebook as string ?? "",
          instagram: (e.social as Record<string, unknown> | undefined)?.instagram as string ?? "",
          youtube: (e.social as Record<string, unknown> | undefined)?.youtube as string ?? "",
        },
      },
    });

    // Restore Contact Section labels to LABEL words (not values)
    await payload.updateGlobal({
      slug: "contact-section",
      data: {
        eyebrow: "Talk to a Specialist",
        title: "Visit our Limassol showroom",
        subtitle:
          "Walk in, see the inventory, talk to a real human. Or send us a message - we reply within 2 hours during business hours.",
        addressLabel: "Showroom",
        phoneLabel: "Call Us",
        emailLabel: "Email",
        hoursLabel: "Open Hours",
        mapCta: "Open in Google Maps",
      },
    });

    return NextResponse.json({
      ok: true,
      message:
        "Moved phone/email/address/hours into Business Info. Restored Contact Section labels.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
