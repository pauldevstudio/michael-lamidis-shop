"use client";

import dynamic from "next/dynamic";

const AIChatOnPublic = dynamic(() => import("@/components/shared/AIChatOnPublic"), { ssr: false });
const WhatsAppButton = dynamic(() => import("@/components/shared/WhatsAppButton"), { ssr: false });
const CookieBanner = dynamic(() => import("@/components/shared/CookieBanner"), { ssr: false });

export default function LazyWidgets() {
  return (
    <>
      <CookieBanner />
      <AIChatOnPublic />
      <WhatsAppButton />
    </>
  );
}
