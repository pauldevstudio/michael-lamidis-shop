import { requireAdmin } from "@/lib/admin-auth";
import { getLeads } from "@/lib/leads";
import LeadsDashboard from "./LeadsDashboard";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  await requireAdmin();
  const leads = await getLeads();
  return <LeadsDashboard initialLeads={leads} />;
}
