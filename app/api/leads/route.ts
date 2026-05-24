export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { addLead, getLeads, deleteLead } from "@/lib/leads";
import { isValidSessionToken } from "@/lib/admin-auth";

function isAuthorized(req: NextRequest): boolean {
  return isValidSessionToken(req.cookies.get("admin_session")?.value);
}

/** POST /api/leads — save a new lead (public, from chatbot) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lead = await addLead({
      name: body.name ?? "Unknown",
      phone: body.phone ?? "Unknown",
      chatLog: body.chatLog ?? [],
    });
    return NextResponse.json({ ok: true, lead }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/** GET /api/leads — list all leads (admin only) */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const leads = await getLeads();
  return NextResponse.json(leads);
}

/** DELETE /api/leads?id=xxx — remove a lead (admin only) */
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deleteLead(id);
  return NextResponse.json({ ok: true });
}
