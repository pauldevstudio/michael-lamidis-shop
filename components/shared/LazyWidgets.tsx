"use client";

import dynamic from "next/dynamic";
import CookieBanner from "@/components/shared/CookieBanner";

const AIChatOnPublic = dynamic(() => import("@/components/shared/AIChatOnPublic"), { ssr: false });
const WhatsAppButton = dynamic(() => import("@/components/shared/WhatsAppButton"), { ssr: false });

export default function LazyWidgets() {
  return (
    <>
      <CookieBanner />
      <AIChatOnPublic />
      <WhatsAppButton />
    </>
  );
}
