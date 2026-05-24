import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/admin");

  return (
    <div className="min-h-screen bg-bone md:flex">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader userName={session.user.name ?? session.user.email ?? "Admin"} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
