import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ContentModel } from "@/models/Content";
import { contentSchema } from "@/lib/validation";
import { ok, fail, requireAdmin } from "@/lib/http";
import { getSiteContent } from "@/lib/content";

export async function GET() {
  const content = await getSiteContent();
  return ok(content);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  const guard = requireAdmin(session);
  if (guard) return guard;

  const json = await req.json();
  const parsed = contentSchema.safeParse(json);
  if (!parsed.success) return fail(parsed.error.message, 422);

  await connectDB();
  await ContentModel.findOneAndUpdate(
    { key: "site" },
    { ...parsed.data, key: "site" },
    { upsert: true, new: true }
  );
  return ok({ updated: true });
}
