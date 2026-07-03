"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCookieConsent } from "@/lib/cookie-consent";

/**
 * Meta (Facebook) Pixel — conversion tracking for the Sales / purchase-optimized
 * ad campaign. This is a MARKETING-category tag, so per GDPR / ePrivacy it must
 * never load until the visitor has consented to the Marketing category. We mirror
 * the gating in Analytics.tsx (which gates on consent.analytics).
 *
 *   NEXT_PUBLIC_META_PIXEL_ID   e.g. 1906717860018674
 *
 * The base script (afterInteractive) fires the initial PageView; the effect below
 * fires PageView again on SPA route changes only (skipping the first run so it
 * doesn't double-count with the base script).
 */
export default function MetaPixel() {
  const { ready, consent } = useCookieConsent();
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pathname = usePathname();
  const firstRun = useRef(true);

  // SPA PageView on route change. Skip the very first run — the base script
  // already fires the initial PageView, so firing here too would double-count.
  useEffect(() => {
    if (!ready || !consent.marketing || !pixelId) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, ready, consent.marketing, pixelId]);

  // GDPR / ePrivacy: do NOT load the Pixel until Marketing consent is given.
  if (!ready || !consent.marketing || !pixelId) return null;

  return (
    <>
      <Script id="meta-pixel-base" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init','${pixelId}');fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
