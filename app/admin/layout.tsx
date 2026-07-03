import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin | Michael Lamidis",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // The sidebar-shell-vs-login decision lives in AdminShell (a client component
  // using usePathname) — NOT here. A shared server layout is not re-rendered on
  // client-side navigation, so deciding it here left the dashboard sidebar-less
  // after signing in until a full reload. See AdminShell for the full rationale.
  return <AdminShell>{children}</AdminShell>;
}
