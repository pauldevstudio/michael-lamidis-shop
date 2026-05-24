import { requireAdmin } from "@/lib/admin-auth";
import MediaClient from "./MediaClient";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireAdmin();
  return <MediaClient />;
}
