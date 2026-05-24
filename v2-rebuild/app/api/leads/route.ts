import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { LeadModel } from "@/models/Lead";
import { leadSchema } from "@/lib/validation";
import { ok, fail } from "@/lib/http";

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) return fail(parsed.error.message, 422);

  await connectDB();
  const lead = await LeadModel.create(parsed.data);
  return ok({ _id: String(lead._id) }, 201);
}
