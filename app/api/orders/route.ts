export const runtime = "nodejs";

import { after, NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import { buildOrderEmail, readMailConfig, sendShopEmail, type SendResult } from "@/lib/notify";
import { clientKey, createRateLimiter } from "@/lib/rate-limit";
import { readJsonBody } from "@/lib/request-guard";
import { parseOrderBody } from "@/lib/validate";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const ORDERS_PER_HOUR_PER_ADDRESS = 6;
const MAX_BODY_BYTES = 32 * 1024;
// A free email plan sends about 100 emails a day. Orders may use at most half
// and messages less (see the leads route), so a flood of one kind can never
// silence the other. Orders over the cap are still saved, only not emailed.
const MAX_ORDER_NOTICES_PER_DAY = 50;

const limiter = createRateLimiter(ORDERS_PER_HOUR_PER_ADDRESS, HOUR_MS);

export async function POST(request: NextRequest) {
  try {
    if (!limiter.check(clientKey(request.headers))) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later or call us." },
        { status: 429 },
      );
    }

    const read = await readJsonBody(request, MAX_BODY_BYTES);
    if (!read.ok) {
      return NextResponse.json({ error: read.error }, { status: read.status });
    }
    const parsed = parseOrderBody(read.body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const input = parsed.data;

    if (!process.env.MONGODB_URI) {
      // Local dev without DB — fall back to a generated id so the UI still works.
      const orderId = `dev-${Date.now().toString(36)}`;
      console.warn("[orders] MONGODB_URI not set — order not persisted (dev mode)", orderId);
      return NextResponse.json({ orderId });
    }

    const { connectDB } = await import("@/lib/db");
    const { OrderModel } = await import("@/lib/models");
    const { lookupAttribution, dropAnalyticsCookiesWithoutConsent } = await import("@/lib/visitor-attribution");
    await connectDB();
    const attribution = await lookupAttribution(request);

    const order = await OrderModel.create({
      customer: input.customer,
      items: input.items,
      totalPrice: input.totalPrice,
      payment: input.payment,
      status: "new",
      ...(attribution ? { attribution } : {}),
    });
    const orderId = order._id.toString();
    const ordersToday = await OrderModel.countDocuments({ createdAt: { $gte: new Date(Date.now() - DAY_MS) } });

    // The order is saved. The notice to the shop runs after the response, so a
    // slow or failing email provider can never delay or fail the customer's
    // order. Its outcome is stored on the order for the admin and the reports.
    after(async () => {
      const notice: SendResult = ordersToday > MAX_ORDER_NOTICES_PER_DAY
        ? { sent: false, reason: "daily_cap" }
        : await sendShopEmail(
            buildOrderEmail({ id: orderId, ...input, attribution }, SITE_URL),
            readMailConfig(process.env),
          );
      const noticeStatus = notice.sent ? "sent" : notice.reason;
      if (!notice.sent) {
        console.warn("[orders] shop notice not sent:", noticeStatus, orderId);
      }
      try {
        await OrderModel.updateOne({ _id: order._id }, { $set: { noticeStatus } });
      } catch {
        /* the status is informational; the order itself is already saved */
      }
    });

    const response = NextResponse.json({ orderId }, { status: 201 });
    dropAnalyticsCookiesWithoutConsent(request, response);
    return response;
  } catch (err) {
    // Log the error type only: database errors can echo what the customer typed.
    console.error("[orders] failed:", err instanceof Error ? err.name : "unknown error");
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
