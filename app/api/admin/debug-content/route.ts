export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isValidSessionToken } from "@/lib/admin-auth";

/**
 * Diagnostic endpoint — read sitecontents through three different paths so
 * we can see which one returns what on Vercel. Remove once the edit-through
 * bug is fully understood.
 */
export async function GET(request: NextRequest) {
  if (!isValidSessionToken(request.cookies.get("admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const out: Record<string, unknown> = {
    env: {
      hasMongoUri: Boolean(process.env.MONGODB_URI),
      hasDatabaseUri: Boolean(process.env.DATABASE_URI),
    },
  };
  try {
    const { connectDB } = await import("@/lib/db");
    const conn = await connectDB();
    out.connDb = conn?.connection?.db?.databaseName ?? null;
    out.readyState = conn?.connection?.readyState ?? null;
    out.collections = conn ? (await conn.connection.db?.listCollections().toArray() ?? []).map((c) => c.name) : [];

    // Path A: direct collection query
    try {
      const docA = await conn?.connection?.db?.collection("sitecontents").findOne({ key: "site" });
      out.pathA_direct = {
        found: Boolean(docA),
        badge: docA?.data?.hero?.badge ?? null,
        updatedAt: docA?.updatedAt ?? null,
      };
    } catch (e) { out.pathA_direct = { error: String(e) }; }

    // Path B: Mongoose model
    try {
      const { SiteContentModel } = await import("@/lib/models");
      const docB = await SiteContentModel.findOne({ key: "site" }).lean<{ data?: { hero?: { badge?: string } }; updatedAt?: Date } | null>();
      out.pathB_model = {
        found: Boolean(docB),
        badge: docB?.data?.hero?.badge ?? null,
        updatedAt: docB?.updatedAt ?? null,
      };
    } catch (e) { out.pathB_model = { error: String(e) }; }

    // Path C: what getSiteContent returns
    try {
      const { getSiteContent } = await import("@/lib/site-content");
      const content = await getSiteContent();
      out.pathC_getSiteContent = { badge: content.hero.badge };
    } catch (e) { out.pathC_getSiteContent = { error: String(e) }; }
  } catch (e) {
    out.topLevelError = String(e);
  }
  return NextResponse.json(out);
}
