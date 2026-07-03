"use client";

import { usePathname } from "next/navigation";
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
 */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login draws its own layout — no sidebar shell.
  if (pathname?.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#1E293B" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
