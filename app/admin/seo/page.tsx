import { requireAdmin } from "@/lib/admin-auth";
import SeoClient from "./SeoClient";

export const dynamic = "force-dynamic";

export default async function SeoPage() {
  await requireAdmin();
  return <SeoClient />;
}
