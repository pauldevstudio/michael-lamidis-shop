import { requireAdmin } from "@/lib/admin-auth";
import AnalyticsClient from "./AnalyticsClient";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  return <AnalyticsClient />;
}
