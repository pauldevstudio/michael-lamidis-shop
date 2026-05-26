export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isValidSessionToken } from "@/lib/admin-auth";

function isAuthorized(req: NextRequest): boolean {
  return isValidSessionToken(req.cookies.get("admin_session")?.value);
}

const VALID_STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = (await request.json()) as { status?: string };
    if (!body.status || !VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 503 });
    }
    const { connectDB } = await import("@/lib/db");
    const { OrderModel } = await import("@/lib/models");
    await connectDB();
    const updated = await OrderModel.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    ).lean();
    if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/orders/:id] update failed:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 503 });
    }
    const { connectDB } = await import("@/lib/db");
    const { OrderModel } = await import("@/lib/models");
    await connectDB();
    const deleted = await OrderModel.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/orders/:id] delete failed:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
