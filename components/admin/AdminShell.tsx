"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

/**
 * Client-side admin shell: the login page draws its own full-screen layout so it
 * must NOT be wrapped in the sidebar shell; every other /admin route must be.
 *
 * This decision lives in a CLIENT component (usePathname) on purpose — NOT in the
 * server layout. A shared server layout is not re-rendered on client-side
 * navigation, so a `headers()`/x-pathname branch there freezes on whichever route
 * first rendered the layout. After signing in (router.replace from /admin/login to
 * /admin) the layout would keep the login branch and the dashboard would render
 * with NO sidebar until a full page reload. usePathname re-renders on every client
 * navigation, so the shell appears the instant you land on the dashboard.
 *
 * Responsive: on desktop the sidebar is a static column; on mobile it collapses
 * into an off-canvas drawer opened from the hamburger in the mobile top bar.
 */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close the mobile drawer whenever the route changes (tap a link → navigate → close).
  useEffect(() => { setMobileNavOpen(false); }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileNavOpen]);

  // Login draws its own layout — no sidebar shell.
  if (pathname?.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#1E293B" }}>
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar (hamburger) — hidden on desktop where the sidebar is static */}
        <header
          className="lg:hidden sticky top-0 z-30 flex items-center gap-3 h-14 px-4 border-b border-white/[0.06]"
          style={{ background: "linear-gradient(180deg, #030813 0%, #060F2A 100%)" }}
        >
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="w-11 h-11 -ml-2.5 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Image src="/logo.png" alt="" width={28} height={28} className="w-7 h-7" />
          <span className="text-white font-display font-bold text-sm">Admin Panel</span>
        </header>
        {children}
      </div>
    </div>
  );
}
