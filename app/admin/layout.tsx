import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Michael Lamidis",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "#F1F5F9" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
