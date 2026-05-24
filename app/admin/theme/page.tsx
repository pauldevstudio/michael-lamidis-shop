import { requireAdmin } from "@/lib/admin-auth";
import ThemeClient from "./ThemeClient";

export const dynamic = "force-dynamic";

export default async function ThemePage() {
  await requireAdmin();
  return <ThemeClient />;
}
