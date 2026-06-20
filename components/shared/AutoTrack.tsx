"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, analytics, ANALYTICS_EVENTS } from "@/lib/analytics";
import { useCookieConsent } from "@/lib/cookie-consent";

/** Non-blocking first-party beacon to our own analytics endpoint. */
function beacon(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({ ...payload, referrer: document.referrer });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
    }
  } catch {
    /* never let tracking break the page */
  }
}

/**
 * Zero-touch event tracking. One delegated click listener on the document
 * auto-fires the right event for any phone / email / WhatsApp / product /
 * outbound link and any element marked with data-cta / data-track — so we
 * don't have to edit every component. Also emits a page_view on SPA route
 * changes (GA4's own page_view only fires on full loads).
 *
 * To tag a custom CTA: add `data-cta="Get a Quote"` to the element.
 * To fire a custom event: add `data-track="event_name"` (+ optional data-* params).
 */
export default function AutoTrack() {
  const pathname = usePathname();
  const { consent } = useCookieConsent();
  const allowed = consent.analytics; // only track once Analytics consent is given

  // SPA page_view on route change.
  useEffect(() => {
    if (!allowed || !pathname) return;
    track(ANALYTICS_EVENTS.PAGE_VIEW, {
      page_path: pathname,
      page_location: typeof window !== "undefined" ? window.location.href : pathname,
      page_title: typeof document !== "undefined" ? document.title : undefined,
    });
    beacon({ kind: "pageview", path: pathname });
  }, [pathname, allowed]);

  // Delegated click tracking.
  useEffect(() => {
    if (!allowed) return;
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const a = el.closest("a") as HTMLAnchorElement | null;
      const trackEl = el.closest("[data-track]") as HTMLElement | null;
      const ctaEl = el.closest("[data-cta]") as HTMLElement | null;

      // Explicit custom event marker wins.
      if (trackEl) {
        const name = trackEl.getAttribute("data-track") || "custom_click";
        const params: Record<string, unknown> = {};
        for (const { name: attr, value } of Array.from(trackEl.attributes)) {
          if (attr.startsWith("data-") && attr !== "data-track") {
            params[attr.slice(5).replace(/-/g, "_")] = value;
          }
        }
        track(name, params);
        beacon({ kind: "event", name, path: pathname, label: name });
      }

      if (ctaEl) {
        const label = ctaEl.getAttribute("data-cta") || ctaEl.textContent?.trim() || "cta";
        analytics.ctaClick(label, pathname);
        beacon({ kind: "event", name: ANALYTICS_EVENTS.CTA_CLICK, path: pathname, label });
      }

      if (!a) return;
      const href = a.getAttribute("href") || "";

      if (href.startsWith("tel:")) {
        analytics.phoneClick(href.replace("tel:", ""));
        beacon({ kind: "event", name: ANALYTICS_EVENTS.PHONE_CLICK, path: pathname, label: "Phone" });
      } else if (href.startsWith("mailto:")) {
        analytics.emailClick(href.replace("mailto:", ""));
        beacon({ kind: "event", name: ANALYTICS_EVENTS.EMAIL_CLICK, path: pathname, label: "Email" });
      } else if (/wa\.me|api\.whatsapp\.com|whatsapp/i.test(href)) {
        analytics.whatsappClick(href);
        beacon({ kind: "event", name: ANALYTICS_EVENTS.WHATSAPP_CLICK, path: pathname, label: "WhatsApp" });
      } else if (/^\/products\/[^/]+$/.test(href)) {
        const label = a.textContent?.trim() || "Product";
        analytics.productClick(href.split("/").pop() || "", label);
        beacon({ kind: "event", name: ANALYTICS_EVENTS.PRODUCT_CLICK, path: pathname, label });
      } else if (/^https?:\/\//i.test(href)) {
        try {
          const u = new URL(href);
          if (u.host !== window.location.host) {
            track(ANALYTICS_EVENTS.OUTBOUND_CLICK, { url: href, host: u.host });
            beacon({ kind: "event", name: ANALYTICS_EVENTS.OUTBOUND_CLICK, path: pathname, label: u.host });
          }
        } catch {
          /* ignore malformed href */
        }
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname, allowed]);

  return null;
}
