import Link from "next/link";
import { Package, FileText, MessageSquare } from "lucide-react";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { LeadModel } from "@/models/Lead";

export const dynamic = "force-dynamic";

async function getStats() {
  await connectDB();
  const [products, leads] = await Promise.all([
    ProductModel.countDocuments(),
    LeadModel.countDocuments(),
  ]);
  return { products, leads };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <p className="eyebrow">Admin</p>
      <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-ink-900">
        Dashboard
      </h1>
      <p className="mt-1.5 text-sm text-ink-500">Manage your storefront.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Products" value={stats.products} href="/admin/products" Icon={Package} />
        <StatCard label="Leads" value={stats.leads} href="/admin/leads" Icon={MessageSquare} />
        <StatCard label="Site content" value="Edit" href="/admin/content" Icon={FileText} />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  Icon,
}: {
  label: string;
  value: string | number;
  href: string;
  Icon: typeof Package;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-ink-100 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover hover:border-ink-200"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-500">{label}</span>
        <Icon className="h-5 w-5 text-ink-400 group-hover:text-gold-500 transition-colors" />
      </div>
      <p className="mt-3 font-heading text-4xl font-bold text-ink-900">{value}</p>
    </Link>
  );
}
