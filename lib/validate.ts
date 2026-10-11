/**
 * Validation for the public order and lead endpoints. Pure functions, no I/O,
 * no local imports (so `node --test` can load this file directly).
 *
 * Everything from the browser is untrusted: fields are type-checked, trimmed
 * and capped, and the order total is recalculated from the items.
 */

export type ParseResult<T> = { ok: true; data: T } | { ok: false; error: string };

export type PaymentMethod = "bank_transfer" | "cash_on_delivery" | "showroom_pickup";

export interface OrderCustomerInput {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

export interface OrderItemInput {
  productId: string;
  brand: string;
  model: string;
  salePrice: number;
  quantity: number;
}

export interface OrderInput {
  customer: OrderCustomerInput;
  items: OrderItemInput[];
  totalPrice: number;
  payment: PaymentMethod;
}

export type LeadOrigin = "chatbot" | "contact" | "lead_capture";

export interface ChatLogEntry {
  role: "user" | "assistant";
  content: string;
}

export interface LeadInput {
  origin: LeadOrigin;
  name: string;
  email: string;
  phone: string;
  subject: string;
  interest: string;
  message: string;
  chatLog: ChatLogEntry[];
  /** True when the hidden "website" field was filled in, which only bots do. */
  honeypot: boolean;
}

const VALID_PAYMENTS: readonly PaymentMethod[] = ["bank_transfer", "cash_on_delivery", "showroom_pickup"];
const VALID_ORIGINS: readonly LeadOrigin[] = ["chatbot", "contact", "lead_capture"];

const MAX_EMAIL_LENGTH = 254;
const MAX_CART_ITEMS = 50;
const MAX_ITEM_QUANTITY = 99;
const MAX_ITEM_PRICE = 1_000_000;
const MAX_CHAT_MESSAGES = 40;
const MAX_CHAT_MESSAGE_LENGTH = 1500;
const MIN_PHONE_DIGITS = 6;

/**
 * Name of the hidden form field that only bots fill in. It is deliberately
 * meaningless, so browser autofill and password managers leave it alone.
 */
export const HONEYPOT_FIELD = "ref_code_2";
const MAX_NOTES_LENGTH = 1000;
const MAX_MESSAGE_LENGTH = 3000;

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f]+/g;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_EXCEPT_NEWLINE = /[\u0000-\u0009\u000b-\u001f\u007f]+/g;

export function isValidEmail(value: string): boolean {
  return typeof value === "string" && value.length <= MAX_EMAIL_LENGTH && EMAIL_RE.test(value);
}

/** Single-line text: control characters removed, trimmed, capped. */
function line(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS, " ").trim().slice(0, max);
}

/** Multi-line text: keeps line breaks, removes other control characters. */
function multiline(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").replace(CONTROL_CHARS_EXCEPT_NEWLINE, " ").trim().slice(0, max);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseOrderItem(raw: unknown): OrderItemInput | null {
  if (!isRecord(raw)) return null;
  const { salePrice, quantity } = raw;
  if (typeof salePrice !== "number" || !Number.isFinite(salePrice) || salePrice < 0 || salePrice > MAX_ITEM_PRICE) return null;
  if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) return null;
  const productId = line(raw.productId, 64);
  if (!productId) return null;
  return { productId, brand: line(raw.brand, 120), model: line(raw.model, 200), salePrice, quantity };
}

export function parseOrderBody(raw: unknown): ParseResult<OrderInput> {
  if (!isRecord(raw)) return { ok: false, error: "Invalid order" };
  const c = isRecord(raw.customer) ? raw.customer : {};
  const customer: OrderCustomerInput = {
    fullName: line(c.fullName, 120),
    email: line(c.email, MAX_EMAIL_LENGTH + 1),
    phone: line(c.phone, 40),
    address: line(c.address, 200),
    city: line(c.city, 80),
    postalCode: line(c.postalCode, 20),
    notes: multiline(c.notes, MAX_NOTES_LENGTH),
  };

  if (!customer.fullName || !customer.email || !customer.phone) {
    return { ok: false, error: "Name, email, and phone are required" };
  }
  if (!isValidEmail(customer.email)) {
    return { ok: false, error: "Please enter a valid email address" };
  }
  if (!Array.isArray(raw.items) || raw.items.length === 0) {
    return { ok: false, error: "Cart is empty" };
  }
  if (raw.items.length > MAX_CART_ITEMS) {
    return { ok: false, error: "Cart has too many items" };
  }
  const payment = VALID_PAYMENTS.find((p) => p === raw.payment);
  if (!payment) {
    return { ok: false, error: "Invalid payment method" };
  }
  if (payment !== "showroom_pickup" && (!customer.address || !customer.city)) {
    return { ok: false, error: "Delivery address is required" };
  }

  const items: OrderItemInput[] = [];
  for (const rawItem of raw.items) {
    const item = parseOrderItem(rawItem);
    if (!item) return { ok: false, error: "Invalid cart item" };
    items.push(item);
  }
  const total = items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
  const totalPrice = Math.round(total * 100) / 100;

  return { ok: true, data: { customer, items, totalPrice, payment } };
}

function parseChatLog(raw: unknown): ChatLogEntry[] {
  if (!Array.isArray(raw)) return [];
  const entries: ChatLogEntry[] = [];
  for (const entry of raw) {
    if (!isRecord(entry)) continue;
    if (entry.role !== "user" && entry.role !== "assistant") continue;
    const content = multiline(entry.content, MAX_CHAT_MESSAGE_LENGTH);
    if (!content) continue;
    entries.push({ role: entry.role, content });
    if (entries.length === MAX_CHAT_MESSAGES) break;
  }
  return entries;
}

export function parseLeadBody(raw: unknown): ParseResult<LeadInput> {
  if (!isRecord(raw)) return { ok: false, error: "Invalid request" };
  // The chatbot predates the `origin` field, so a missing value means chatbot.
  const origin = raw.origin === undefined ? "chatbot" : VALID_ORIGINS.find((o) => o === raw.origin);
  if (!origin) return { ok: false, error: "Invalid request" };

  const name = line(raw.name, 120);
  const email = line(raw.email, MAX_EMAIL_LENGTH + 1);
  const lead: LeadInput = {
    origin,
    name,
    email,
    phone: line(raw.phone, 40),
    subject: line(raw.subject, 150),
    interest: line(raw.interest, 80),
    message: multiline(raw.message, MAX_MESSAGE_LENGTH),
    chatLog: parseChatLog(raw.chatLog),
    honeypot: line(raw[HONEYPOT_FIELD], 200).length > 0,
  };

  if (origin === "chatbot") {
    // A chatbot lead is only worth an email if it has a phone number and the
    // visitor actually wrote something. This also stops empty POSTs.
    const phoneDigits = lead.phone.replace(/\D/g, "").length;
    const visitorWrote = lead.chatLog.some((entry) => entry.role === "user");
    if (phoneDigits < MIN_PHONE_DIGITS || !visitorWrote) {
      return { ok: false, error: "A phone number and a message are required" };
    }
    return {
      ok: true,
      data: {
        ...lead,
        name: name || "Unknown",
        email: isValidEmail(email) ? email : "",
      },
    };
  }
  if (!name || !isValidEmail(email)) {
    return { ok: false, error: "Please enter your name and a valid email address" };
  }
  if (origin === "contact" && !lead.message) {
    return { ok: false, error: "Please write a message" };
  }
  if (origin === "lead_capture" && !lead.interest) {
    return { ok: false, error: "Please choose what you are looking for" };
  }
  return { ok: true, data: lead };
}
