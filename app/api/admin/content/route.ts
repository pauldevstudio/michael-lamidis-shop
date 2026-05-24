export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, writeSiteContent } from "@/lib/site-content";
import { isValidSessionToken } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

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
    // Revalidate all pages so the live site reflects the new content
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to save content", detail: String(err) },
      { status: 500 }
    );
  }
}
