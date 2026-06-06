export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isValidSessionToken } from "@/lib/admin-auth";
import { getAnalytics, type RangeKey } from "@/lib/analytics-data";

const VALID_RANGES: RangeKey[] = ["today", "7d", "30d", "90d"];

export async function GET(request: NextRequest) {
  if (!isValidSessionToken(request.cookies.get("admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const r = request.nextUrl.searchParams.get("range") as RangeKey | null;
  const range: RangeKey = r && VALID_RANGES.includes(r) ? r : "30d";
  try {
    const data = await getAnalytics(range);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to load analytics", detail: String(err) }, { status: 500 });
  }
}
