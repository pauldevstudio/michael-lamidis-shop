import { requireAdmin } from "@/lib/admin-auth";
import ContentClient from "./ContentClient";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  await requireAdmin();
  return <ContentClient />;
}
