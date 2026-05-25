import { requireAdmin } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/site-content";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Validates the HMAC and expiry — not just "cookie exists".
  await requireAdmin();
  const content = await getSiteContent();
  return <AdminDashboard content={content} />;
}
