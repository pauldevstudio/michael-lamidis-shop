"use client";

import { usePathname } from "next/navigation";
import WhatsAppButton from "./WhatsAppButton";
import { SITE_WHATSAPP } from "@/lib/constants";

/**
 * Mount the floating WhatsApp CTA on public pages only. Lives in its own
 * client component so the root layout can stay static (no headers(), no
 * data fetching) — Vercel can then cache the layout's HTML.
 */
export default function WhatsAppOnPublic() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/cms")) return null;
  return <WhatsAppButton phone={SITE_WHATSAPP} />;
}
