/**
 * One-shot: delete payload-preferences for the Products list view.
 * Forces Payload to fall back to the defaultColumns from payload.config.ts.
 *
 * Hit: http://localhost:3000/api/dev/reset-prefs
 */
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPayload({ config });

    // Find and delete all preference docs for the products collection list
    const prefs = await payload.find({
      collection: "payload-preferences",
      where: { key: { equals: "collection-products" } },
      limit: 100,
    });

    const deleted: string[] = [];
    for (const doc of prefs.docs) {
      await payload.delete({
        collection: "payload-preferences",
        id: doc.id as string,
      });
      deleted.push(doc.id as string);
    }

    return NextResponse.json({
      ok: true,
      message: `Deleted ${deleted.length} preference doc(s). Refresh /cms/collections/products and you should see the default columns again.`,
      deletedIds: deleted,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
