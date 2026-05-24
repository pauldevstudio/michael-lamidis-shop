import { connectDB } from "@/lib/db";
import { LeadModel } from "@/models/Lead";
import type { Lead } from "@/types";

export const dynamic = "force-dynamic";

async function getLeads(): Promise<Lead[]> {
  await connectDB();
  const docs = await LeadModel.find().sort({ createdAt: -1 }).limit(200).lean();
  return docs.map((d: Record<string, unknown>) => ({
    _id: String(d._id),
    name: d.name as string,
    email: d.email as string,
    phone: d.phone as string | undefined,
    message: d.message as string,
    productSlug: d.productSlug as string | undefined,
    createdAt: (d.createdAt as Date | undefined)?.toISOString() ?? "",
  }));
}

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <p className="eyebrow">Inbox</p>
      <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-ink-900">Leads</h1>
      <p className="mt-1.5 text-sm text-ink-500">
        Customer inquiries — newest first.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
        <table className="min-w-full divide-y divide-ink-100 text-sm">
          <thead className="bg-bone-100/50 text-left text-xs uppercase tracking-[0.12em] text-ink-500">
            <tr>
              <th className="px-5 py-3 font-medium">When</th>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-ink-500">
                  No leads yet.
                </td>
              </tr>
            )}
            {leads.map((l: Lead) => (
              <tr key={l._id} className="hover:bg-bone-100/40">
                <td className="px-5 py-3 whitespace-nowrap text-xs text-ink-500">
                  {new Date(l.createdAt).toLocaleString()}
                </td>
                <td className="px-5 py-3 font-medium text-ink-900">{l.name}</td>
                <td className="px-5 py-3 text-ink-600">{l.email}</td>
                <td className="px-5 py-3 text-ink-600">{l.productSlug ?? "—"}</td>
                <td className="px-5 py-3 max-w-md text-ink-700">{l.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
