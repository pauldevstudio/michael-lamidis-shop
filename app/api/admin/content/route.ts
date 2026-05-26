export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, writeSiteContent, SITE_CONTENT_TAG } from "@/lib/site-content";
import { isValidSessionToken } from "@/lib/admin-auth";
import { revalidatePath, revalidateTag } from "next/cache";

function isAuthorized(req: NextRequest): boolean {
  return isValidSessionToken(req.cookies.get("admin_session")?.value);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    await writeSiteContent(body);
    // Bust the cached getSiteContent + revalidate every page so live
    // edits show on the public site within seconds of save.
    revalidateTag(SITE_CONTENT_TAG);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to save content", detail: String(err) },
      { status: 500 }
    );
  }
}
