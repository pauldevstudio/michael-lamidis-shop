/**
 * Instant email notice to the shop for every new order request and website
 * message. Pure builders plus one sender, no local imports (so `node --test`
 * can load this file directly).
 *
 * Emails are plain text only, so nothing a customer types can be interpreted
 * as markup. Sending goes through Resend's HTTP API and never throws: an order
 * must be saved even when the email cannot be sent.
 *
 *   RESEND_API_KEY      API key of the sending account
 *   NOTIFY_EMAIL_TO     who receives the notices (comma-separated for several)
 *   NOTIFY_EMAIL_FROM   verified sender, e.g. "Michael Lamidis Shop <orders@…>"
 */

const RESEND_URL = "https://api.resend.com/emails";
const SEND_TIMEOUT_MS = 6000;
const MAX_SUBJECT_LENGTH = 150;
const MAX_CHAT_LINES_IN_EMAIL = 30;

export interface MailConfig {
  apiKey: string;
  to: string[];
  from: string;
}

export interface MailMessage {
  subject: string;
  text: string;
  replyTo?: string;
}

export type SendResult =
  | { sent: true }
  | { sent: false; reason: "not_configured" }
  | { sent: false; reason: "daily_cap" }
  | { sent: false; reason: "provider_error"; status: number }
  | { sent: false; reason: "network_error" };

export interface AttributionSummary {
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
}

export interface OrderEmailInput {
  id: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    postalCode?: string;
    notes?: string;
  };
  items: ReadonlyArray<{ brand: string; model: string; salePrice: number; quantity: number }>;
  totalPrice: number;
  payment: string;
  attribution?: AttributionSummary | null;
}

export interface LeadEmailInput {
  origin: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  interest: string;
  message: string;
  chatLog: ReadonlyArray<{ role: string; content: string }>;
  attribution?: AttributionSummary | null;
}

const PAYMENT_LABELS: Record<string, string> = {
  bank_transfer: "Bank transfer",
  cash_on_delivery: "Cash on delivery",
  showroom_pickup: "Pickup at the showroom",
};

const ORIGIN_LABELS: Record<string, string> = {
  contact: "Contact form",
  lead_capture: "Offers form",
  chatbot: "Website chat",
};

export function readMailConfig(env: Record<string, string | undefined>): MailConfig | null {
  const apiKey = (env.RESEND_API_KEY ?? "").trim();
  const from = (env.NOTIFY_EMAIL_FROM ?? "").trim();
  const to = (env.NOTIFY_EMAIL_TO ?? "").split(",").map((address) => address.trim()).filter(Boolean);
  if (!apiKey || !from || to.length === 0) return null;
  return { apiKey, to, from };
}

function formatEuro(amount: number): string {
  return `€${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}

/** One line, no control characters: safe for an email subject. */
function oneLine(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_SUBJECT_LENGTH);
}

function replyAddress(email: string): string | undefined {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(email) ? email : undefined;
}

/**
 * Free text typed by a customer, with every line marked. A customer cannot
 * make their text look like one of the notice's own lines or links.
 */
function quoted(text: string): string[] {
  return text.split("\n").map((textLine) => `| ${textLine}`);
}

function attributionLine(attribution?: AttributionSummary | null): string[] {
  if (!attribution || !attribution.source) return [];
  const channel = [attribution.utmSource, attribution.utmMedium].filter(Boolean).join(" / ");
  const details = [
    channel,
    attribution.utmCampaign ? `campaign ${attribution.utmCampaign}` : "",
    attribution.utmContent ? `content ${attribution.utmContent}` : "",
  ].filter(Boolean);
  const suffix = details.length > 0 ? ` (${details.join(", ")})` : "";
  return ["", `Came from: ${attribution.source}${suffix}`];
}

export function buildOrderEmail(order: OrderEmailInput, siteUrl: string): MailMessage {
  const { customer } = order;
  const reference = order.id.slice(-6).toUpperCase();
  const addressLine = [customer.address, [customer.city, customer.postalCode].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");

  const text = [
    "New order request on the website",
    "",
    `Order: #${reference}`,
    `Total: ${formatEuro(order.totalPrice)}`,
    `Payment: ${PAYMENT_LABELS[order.payment] ?? order.payment}`,
    "",
    "Please contact the customer to confirm, then update the status here:",
    `${siteUrl}/admin/orders`,
    ...attributionLine(order.attribution),
    "",
    "Customer",
    `Name: ${customer.fullName}`,
    `Phone: ${customer.phone}`,
    `Email: ${customer.email}`,
    ...(addressLine ? [`Address: ${addressLine}`] : []),
    ...(customer.notes ? ["Notes from the customer:", ...quoted(customer.notes)] : []),
    "",
    "Items",
    ...order.items.map(
      (item) => `${item.quantity} x ${[item.brand, item.model].filter(Boolean).join(" ")}, ${formatEuro(item.salePrice)} each`,
    ),
  ].join("\n");

  return {
    subject: oneLine(`New order request: ${formatEuro(order.totalPrice)} from ${customer.fullName} [#${reference}]`),
    text,
    replyTo: replyAddress(customer.email),
  };
}

export function buildLeadEmail(lead: LeadEmailInput, siteUrl: string): MailMessage {
  const originLabel = ORIGIN_LABELS[lead.origin] ?? "Website";
  const chatLines = lead.chatLog
    .slice(-MAX_CHAT_LINES_IN_EMAIL)
    .flatMap((entry) => quoted(`${entry.role === "assistant" ? "Assistant" : "Customer"}: ${entry.content}`));

  const text = [
    `New message from the website (${originLabel})`,
    "",
    "All messages are also listed here:",
    `${siteUrl}/admin/leads`,
    ...attributionLine(lead.attribution),
    "",
    `Name: ${lead.name}`,
    ...(lead.email ? [`Email: ${lead.email}`] : []),
    ...(lead.phone ? [`Phone: ${lead.phone}`] : []),
    ...(lead.subject ? [`Subject: ${lead.subject}`] : []),
    ...(lead.interest ? [`Interested in: ${lead.interest}`] : []),
    ...(lead.message ? ["", "Message:", ...quoted(lead.message)] : []),
    ...(chatLines.length > 0 ? ["", "Conversation:", ...chatLines] : []),
  ].join("\n");

  return {
    subject: oneLine(`New website message (${originLabel}) from ${lead.name}`),
    text,
    replyTo: replyAddress(lead.email),
  };
}

/** Send one notice. Resolves with the outcome; never rejects. */
export async function sendShopEmail(
  message: MailMessage,
  config: MailConfig | null,
  fetchImpl: typeof fetch = fetch,
): Promise<SendResult> {
  if (!config) return { sent: false, reason: "not_configured" };
  try {
    const response = await fetchImpl(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: config.to,
        subject: message.subject,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
    if (!response.ok) return { sent: false, reason: "provider_error", status: response.status };
    return { sent: true };
  } catch {
    return { sent: false, reason: "network_error" };
  }
}
