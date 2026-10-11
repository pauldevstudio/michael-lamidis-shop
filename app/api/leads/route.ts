export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { after, NextRequest, NextResponse } from "next/server";
import { addLead, getLeads, deleteLead } from "@/lib/leads";
import { isValidSessionToken } from "@/lib/admin-auth";
import { SITE_URL } from "@/lib/constants";
import { buildLeadEmail, readMailConfig, sendShopEmail, type SendResult } from "@/lib/notify";
import { clientKey, createRateLimiter } from "@/lib/rate-limit";
import { readJsonBody } from "@/lib/request-guard";
import { parseLeadBody } from "@/lib/validate";
import { dropAnalyticsCookiesWithoutConsent, lookupAttribution } from "@/lib/visitor-attribution";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const LEADS_PER_HOUR_PER_ADDRESS = 5;
const MAX_BODY_BYTES = 64 * 1024;
// Kept below the order cap (see the orders route) so messages can never use up
// the email allowance that order notices need. Extra messages are still saved.
const MAX_LEAD_NOTICES_PER_DAY = 40;

const limiter = createRateLimiter(LEADS_PER_HOUR_PER_ADDRESS, HOUR_MS);

function isAuthorized(req: NextRequest): boolean {
  return isValidSessionToken(req.cookies.get("admin_session")?.value);
}

/** Messages saved in the last 24 hours, or 0 when there is no database to ask. */
async function leadsToday(): Promise<number> {
  if (!process.env.MONGODB_URI) return 0;
  try {
    const { connectDB } = await import("@/lib/db");
    const { LeadModel } = await import("@/lib/models");
    await connectDB();
    return await LeadModel.countDocuments({ createdAt: { $gte: new Date(Date.now() - DAY_MS) } });
  } catch {
    return 0;
  }
}

async function saveNoticeStatus(leadId: string, noticeStatus: string): Promise<void> {
  if (!process.env.MONGODB_URI) return;
  try {
    const { LeadModel } = await import("@/lib/models");
    await LeadModel.updateOne({ _id: leadId }, { $set: { noticeStatus } });
  } catch {
    /* the status is informational; the message itself is already saved */
  }
}

/** POST /api/leads — save a new lead (public: chatbot, contact form, offers form) */
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
    const parsed = parseLeadBody(read.body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const { honeypot, ...input } = parsed.data;
    // Only bots fill the hidden field. Answer as if it worked, save nothing,
    // and leave a trace so a wrongly dropped message can be noticed.
    if (honeypot) {
      console.warn("[leads] hidden field was filled in; message dropped as a bot");
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const attribution = await lookupAttribution(request);
    const lead = await addLead({ ...input, attribution });
    const savedToday = await leadsToday();

    // The message is saved. The notice to the shop runs after the response.
    after(async () => {
      const notice: SendResult = savedToday > MAX_LEAD_NOTICES_PER_DAY
        ? { sent: false, reason: "daily_cap" }
        : await sendShopEmail(
            buildLeadEmail({ ...input, attribution }, SITE_URL),
            readMailConfig(process.env),
          );
      const noticeStatus = notice.sent ? "sent" : notice.reason;
      if (!notice.sent) {
        console.warn("[leads] shop notice not sent:", noticeStatus, lead.id);
      }
      await saveNoticeStatus(lead.id, noticeStatus);
    });

    const response = NextResponse.json({ ok: true, lead: { id: lead.id } }, { status: 201 });
    dropAnalyticsCookiesWithoutConsent(request, response);
    return response;
  } catch (err) {
    // Log the error type only: database errors can echo what the visitor typed.
    console.error("[leads] failed:", err instanceof Error ? err.name : "unknown error");
    return NextResponse.json({ error: "Failed to send your message" }, { status: 500 });
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
