"use client";

import dynamic from "next/dynamic";

const CookieBanner = dynamic(() => import("@/components/shared/CookieBanner"), { ssr: false });
const WhatsAppButton = dynamic(() => import("@/components/shared/WhatsAppButton"), { ssr: false });

export default function LazyWidgets() {
  return (
    <>
      <CookieBanner />
      <WhatsAppButton />
    </>
  );
}
