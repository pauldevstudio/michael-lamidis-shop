import { requireAdmin } from "@/lib/admin-auth";
import BusinessClient from "./BusinessClient";

export const dynamic = "force-dynamic";

export default async function BusinessPage() {
  await requireAdmin();
  return <BusinessClient />;
}
