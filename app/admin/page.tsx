import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteContent } from "@/lib/site-content";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || !session.value) {
    redirect("/admin/login");
  }

  const content = await getSiteContent();
  return <AdminDashboard content={content} />;
}
