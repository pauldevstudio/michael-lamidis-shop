"use client";

import { usePathname } from "next/navigation";
import { SITE_WHATSAPP } from "@/lib/constants";

/**
 * Floating WhatsApp click-to-chat button (bottom-right). Public pages only
 * (skips admin/cms). Clicks are auto-tracked as `whatsapp_click` by AutoTrack.
 */
export default function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/cms")) return null;
  // Product detail pages have a sticky mobile bar with its own WhatsApp button —
  // hide the floating FAB there so they don't overlap.
  if (/^\/products\/[^/]+$/.test(pathname ?? "")) return null;

  const number = SITE_WHATSAPP.replace(/\D/g, "");
  if (!number) return null;
  const msg = encodeURIComponent("Hi Michael Lamidis! I'm interested in your open box appliances.");
  const href = `https://wa.me/${number}?text=${msg}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      data-cta="WhatsApp Float"
      className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 rounded-full bg-[#25D366] pl-3 pr-4 py-3 text-white shadow-xl shadow-black/20 ring-1 ring-black/5 transition-transform hover:scale-105 active:scale-95"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.17 0 4.2.84 5.74 2.38a8.06 8.06 0 0 1 2.38 5.73c0 4.48-3.65 8.12-8.12 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.06 8.06 0 0 1-1.25-4.3c0-4.47 3.64-8.11 8.11-8.11Zm-4.6 4.39c-.21 0-.55.08-.84.39-.29.32-1.1 1.08-1.1 2.62 0 1.55 1.13 3.05 1.29 3.26.16.21 2.22 3.39 5.39 4.62.75.29 1.33.46 1.79.59.75.24 1.44.21 1.98.13.6-.09 1.86-.76 2.12-1.49.26-.74.26-1.37.18-1.5-.08-.13-.29-.21-.6-.37-.32-.16-1.86-.92-2.15-1.02-.29-.11-.5-.16-.71.16-.21.31-.81 1.02-1 1.23-.18.21-.37.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.31-.02-.48.14-.64.14-.14.32-.37.47-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55l-.6-.01Z" />
      </svg>
      <span className="text-sm font-semibold whitespace-nowrap hidden sm:inline">WhatsApp</span>
    </a>
  );
}
