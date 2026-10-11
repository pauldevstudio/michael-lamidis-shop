/**
 * Analytics event layer.
 *
 * Pushes events into the GTM dataLayer (and GA4 via gtag when GTM isn't used).
 * Safe to call on the server or before the tag loads — it no-ops if there's no
 * window. All tracking flows through `track()` so event names stay consistent
 * with the GTM triggers documented in ANALYTICS_SETUP.md.
 *
 * `beacon()` is the first-party tracker (our own /api/track endpoint, shown in
 * Admin → Analytics). It only sends once the visitor has allowed Analytics.
 */
import { NO_CONSENT, consentFromCookieString, type ConsentFlags } from "@/lib/consent-core";

/** The visitor's current choice, read fresh each time so a withdrawal takes effect at once. */
function currentConsent(): ConsentFlags {
  return typeof document === "undefined" ? NO_CONSENT : consentFromCookieString(document.cookie);
}

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  PHONE_CLICK: "phone_click",
  EMAIL_CLICK: "email_click",
  WHATSAPP_CLICK: "whatsapp_click",
  CTA_CLICK: "cta_click",
  PRODUCT_CLICK: "product_click",
  VIEW_ITEM: "view_item",
  OUTBOUND_CLICK: "outbound_click",
  GENERATE_LEAD: "generate_lead",
  CONTACT_FORM_SUBMIT: "contact_form_submit",
  SEARCH: "search",
  ADD_TO_CART: "add_to_cart",
  BEGIN_CHECKOUT: "begin_checkout",
  PURCHASE: "purchase",
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META_PIXEL_MAP: Record<string, { event: string; mapParams?: (p: Record<string, unknown>) => Record<string, unknown> }> = {
  [ANALYTICS_EVENTS.PHONE_CLICK]: { event: "Contact", mapParams: () => ({ content_category: "Phone" }) },
  [ANALYTICS_EVENTS.WHATSAPP_CLICK]: { event: "Contact", mapParams: () => ({ content_category: "WhatsApp" }) },
  [ANALYTICS_EVENTS.EMAIL_CLICK]: { event: "Contact", mapParams: () => ({ content_category: "Email" }) },
  [ANALYTICS_EVENTS.GENERATE_LEAD]: { event: "Lead", mapParams: (p) => ({ content_name: p.lead_source }) },
  [ANALYTICS_EVENTS.CONTACT_FORM_SUBMIT]: { event: "Lead", mapParams: () => ({ content_name: "Contact Form" }) },
  [ANALYTICS_EVENTS.VIEW_ITEM]: { event: "ViewContent", mapParams: (p) => ({
    content_name: p.product_name,
    content_ids: p.product_id ? [p.product_id] : undefined,
    content_type: "product",
    value: p.price,
    currency: "EUR",
  }) },
  [ANALYTICS_EVENTS.ADD_TO_CART]: { event: "AddToCart", mapParams: (p) => ({
    content_name: p.product_name,
    content_ids: p.product_id ? [p.product_id] : undefined,
    content_type: "product",
    value: p.value,
    currency: "EUR",
  }) },
  [ANALYTICS_EVENTS.BEGIN_CHECKOUT]: { event: "InitiateCheckout", mapParams: (p) => ({
    content_ids: p.product_ids,
    content_type: "product",
    num_items: p.num_items,
    value: p.value,
    currency: "EUR",
  }) },
  [ANALYTICS_EVENTS.PURCHASE]: { event: "Purchase", mapParams: (p) => ({
    content_ids: p.product_ids,
    content_type: "product",
    num_items: p.num_items,
    value: p.value,
    currency: "EUR",
  }) },
};

interface TrackOptions {
  /** Stable id for this event, so Meta can match the browser event with a server copy of it. */
  eventId?: string;
}

function newEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Push a named event into the dataLayer (GTM), GA4 via gtag, and Meta Pixel
 * via fbq when a mapping exists. Each destination only receives the event
 * while the visitor's consent allows it (Analytics for GTM and GA4, Marketing
 * for Meta), and a failing tag can never break the page.
 *
 * GTM listens to dataLayer events; direct GA4 (gtag.js without GTM) does NOT —
 * it needs an explicit gtag('event', ...). Firing both makes events work under
 * either setup with no double-counting (only one of GTM / gtag is ever wired). */
export function track(
  event: AnalyticsEvent | string,
  params: Record<string, unknown> = {},
  options: TrackOptions = {},
): void {
  if (typeof window === "undefined") return;
  try {
    const consent = currentConsent();
    if (consent.analytics) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event, ...params });
      if (typeof window.gtag === "function") {
        window.gtag("event", event, params);
      }
    }
    const mapping = META_PIXEL_MAP[event];
    if (consent.marketing && mapping && typeof window.fbq === "function") {
      const pixelParams = mapping.mapParams ? mapping.mapParams(params) : {};
      window.fbq("track", mapping.event, pixelParams, { eventID: options.eventId ?? newEventId() });
    }
  } catch {
    /* never let tracking break the page */
  }
}

/* ── First-party tracker (/api/track) ───────────────────────────── */

interface BeaconPayload {
  kind: "pageview" | "event";
  path: string;
  name?: string;
  label?: string;
  /** Landing-page query string; the server keeps only its utm_* tags. */
  query?: string;
  /** Money value in EUR (cart and order events). */
  value?: number;
}

// The query string of the page the visitor first landed on carries the ad's
// campaign tags. It is kept in memory only (nothing is stored on the device),
// so it can still be reported if the visitor accepts Analytics after moving on
// to another page.
const landingQuery = typeof window !== "undefined" ? window.location.search : "";
let landingQueryReported = false;

/** Non-blocking beacon to our own analytics endpoint. Returns false when nothing was sent. */
export function beacon(payload: BeaconPayload): boolean {
  if (typeof window === "undefined" || !currentConsent().analytics) return false;
  try {
    const body = JSON.stringify({ ...payload, referrer: document.referrer });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
    }
    return true;
  } catch {
    /* never let tracking break the page */
    return false;
  }
}

/** Page view beacon. The first one of a visit also carries the landing query. */
export function pageviewBeacon(path: string): void {
  if (typeof window === "undefined") return;
  const query = window.location.search || (landingQueryReported ? "" : landingQuery);
  if (beacon({ kind: "pageview", path, query })) {
    landingQueryReported = true;
  }
}

function currentPath(): string {
  return typeof window === "undefined" ? "/" : window.location.pathname;
}

interface CartLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartSummary {
  productIds: string[];
  numItems: number;
  value: number;
}

/** Convenience wrappers for the high-value conversion events. */
export const analytics = {
  phoneClick: (value?: string) =>
    track(ANALYTICS_EVENTS.PHONE_CLICK, { channel: "phone", value }),
  emailClick: (value?: string) =>
    track(ANALYTICS_EVENTS.EMAIL_CLICK, { channel: "email", value }),
  whatsappClick: (value?: string) =>
    track(ANALYTICS_EVENTS.WHATSAPP_CLICK, { channel: "whatsapp", value }),
  ctaClick: (label: string, location?: string) =>
    track(ANALYTICS_EVENTS.CTA_CLICK, { cta_label: label, cta_location: location }),
  productClick: (id: string, name?: string) =>
    track(ANALYTICS_EVENTS.PRODUCT_CLICK, { product_id: id, product_name: name }),
  generateLead: (source?: string) => {
    track(ANALYTICS_EVENTS.GENERATE_LEAD, { lead_source: source });
    beacon({ kind: "event", name: ANALYTICS_EVENTS.GENERATE_LEAD, path: currentPath(), label: source ?? "" });
  },
  contactSubmit: () => {
    track(ANALYTICS_EVENTS.CONTACT_FORM_SUBMIT, {});
    beacon({ kind: "event", name: ANALYTICS_EVENTS.CONTACT_FORM_SUBMIT, path: currentPath(), label: "Contact form" });
  },
  search: (query: string) => track(ANALYTICS_EVENTS.SEARCH, { search_term: query }),
  addToCart: (line: CartLine) => {
    const value = line.price * line.quantity;
    track(ANALYTICS_EVENTS.ADD_TO_CART, {
      product_id: line.id, product_name: line.name, quantity: line.quantity, value, currency: "EUR",
    });
    beacon({ kind: "event", name: ANALYTICS_EVENTS.ADD_TO_CART, path: currentPath(), label: line.name, value });
  },
  beginCheckout: (cart: CartSummary) => {
    track(ANALYTICS_EVENTS.BEGIN_CHECKOUT, {
      product_ids: cart.productIds, num_items: cart.numItems, value: cart.value, currency: "EUR",
    });
    beacon({
      kind: "event", name: ANALYTICS_EVENTS.BEGIN_CHECKOUT, path: currentPath(),
      label: `${cart.numItems} item(s)`, value: cart.value,
    });
  },
  purchase: (orderId: string, cart: CartSummary) => {
    track(
      ANALYTICS_EVENTS.PURCHASE,
      {
        transaction_id: orderId, product_ids: cart.productIds, num_items: cart.numItems,
        value: cart.value, currency: "EUR",
      },
      { eventId: `purchase-${orderId}` },
    );
    beacon({ kind: "event", name: ANALYTICS_EVENTS.PURCHASE, path: currentPath(), label: orderId, value: cart.value });
  },
};
