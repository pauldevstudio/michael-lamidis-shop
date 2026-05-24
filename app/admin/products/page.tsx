import { requireAdmin } from "@/lib/admin-auth";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await requireAdmin();
  return <ProductsClient />;
}
