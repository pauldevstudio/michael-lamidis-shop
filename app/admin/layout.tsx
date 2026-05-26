import type { Metadata } from "next";
import { headers } from "next/headers";
import Sidebar from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Michael Lamidis",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // The login page draws its own full-screen layout — don't wrap it in the
  // gray sidebar shell. middleware.ts forwards the pathname via x-pathname.
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  if (pathname.startsWith("/admin/login")) {
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
