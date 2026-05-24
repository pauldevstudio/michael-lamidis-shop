import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { listProducts } from "@/lib/products";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listProducts({ activeOnly: false, limit: 500 });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-ink-900">Products</h1>
        </div>
        <Link href="/admin/products/new">
          <Button size="md">
            <Plus className="h-4 w-4" /> New product
          </Button>
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
        <table className="min-w-full divide-y divide-ink-100 text-sm">
          <thead className="bg-bone-100/50 text-left text-xs uppercase tracking-[0.12em] text-ink-500">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Brand</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-ink-500">
                  No products yet. Create your first one.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-bone-100/40">
                <td className="px-5 py-3 font-medium text-ink-900">{p.name}</td>
                <td className="px-5 py-3 text-ink-600">{p.brand}</td>
                <td className="px-5 py-3 text-ink-900">{formatPrice(p.price, p.currency)}</td>
                <td className="px-5 py-3">
                  <Badge tone={p.active ? "success" : "warning"}>
                    {p.active ? "Active" : "Hidden"}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-ink-700">{p.stock}</td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/products/${p._id}`} className="text-gold-600 hover:text-gold-700 font-medium">
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
