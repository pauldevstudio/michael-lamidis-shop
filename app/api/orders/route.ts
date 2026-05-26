export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

interface OrderBody {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    postalCode?: string;
    notes?: string;
  };
  items: Array<{
    productId: string;
    brand: string;
    model: string;
    salePrice: number;
    quantity: number;
  }>;
  totalPrice: number;
  payment: "bank_transfer" | "cash_on_delivery" | "showroom_pickup";
}

const VALID_PAYMENTS = ["bank_transfer", "cash_on_delivery", "showroom_pickup"] as const;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderBody;

    // Validate
    if (!body.customer?.fullName?.trim() || !body.customer?.email?.trim() || !body.customer?.phone?.trim()) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 });
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!VALID_PAYMENTS.includes(body.payment)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }
    if (body.payment !== "showroom_pickup" && (!body.customer.address?.trim() || !body.customer.city?.trim())) {
      return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      // Local dev without DB — fall back to a generated id so the UI still works.
      const orderId = `dev-${Date.now().toString(36)}`;
      console.warn("[orders] MONGODB_URI not set — order not persisted (dev mode)", orderId);
      return NextResponse.json({ orderId });
    }

    const { connectDB } = await import("@/lib/db");
    const { OrderModel } = await import("@/lib/models");
    await connectDB();

    const order = await OrderModel.create({
      customer: body.customer,
      items: body.items,
      totalPrice: body.totalPrice,
      payment: body.payment,
      status: "new",
    });

    return NextResponse.json({ orderId: order._id.toString() }, { status: 201 });
  } catch (err) {
    console.error("[orders] failed:", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
