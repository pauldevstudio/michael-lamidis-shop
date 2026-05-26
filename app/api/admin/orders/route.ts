export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isValidSessionToken } from "@/lib/admin-auth";

function isAuthorized(req: NextRequest): boolean {
  return isValidSessionToken(req.cookies.get("admin_session")?.value);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ orders: [], note: "MONGODB_URI not set" });
    }
    const { connectDB } = await import("@/lib/db");
    const { OrderModel } = await import("@/lib/models");
    await connectDB();
    const docs = await OrderModel.find({}).sort({ createdAt: -1 }).limit(500).lean();
    const orders = docs.map((d) => ({
      id: String(d._id),
      customer: d.customer,
      items: d.items,
      totalPrice: d.totalPrice,
      payment: d.payment,
      status: d.status ?? "new",
      createdAt: d.createdAt instanceof Date ? d.createdAt.toISOString() : String(d.createdAt),
    }));
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("[admin/orders] list failed:", err);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
