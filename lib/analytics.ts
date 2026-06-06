/**
 * Analytics event layer.
 *
 * Pushes events into the GTM dataLayer (and GA4 via gtag when GTM isn't used).
 * Safe to call on the server or before the tag loads — it no-ops if there's no
 * window. All tracking flows through `track()` so event names stay consistent
 * with the GTM triggers documented in ANALYTICS_SETUP.md.
 */

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
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Push a named event into the dataLayer (GTM) and, if present, GA4 via gtag.
 *
 * GTM listens to dataLayer events; direct GA4 (gtag.js without GTM) does NOT —
 * it needs an explicit gtag('event', ...). Firing both makes events work under
 * either setup with no double-counting (only one of GTM / gtag is ever wired). */
export function track(
  event: AnalyticsEvent | string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
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
  generateLead: (source?: string) =>
    track(ANALYTICS_EVENTS.GENERATE_LEAD, { lead_source: source }),
  contactSubmit: () => track(ANALYTICS_EVENTS.CONTACT_FORM_SUBMIT, {}),
  search: (query: string) => track(ANALYTICS_EVENTS.SEARCH, { search_term: query }),
};
