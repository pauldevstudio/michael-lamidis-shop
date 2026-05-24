import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { productSchema } from "@/lib/validation";
import { ok, fail, requireAdmin } from "@/lib/http";
import { getProductById } from "@/lib/products";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return fail("Not found", 404);
  return ok(product);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  const guard = requireAdmin(session);
  if (guard) return guard;

  const { id } = await params;
  const json = await req.json();
  const parsed = productSchema.partial().safeParse(json);
  if (!parsed.success) return fail(parsed.error.message, 422);

  await connectDB();
  const updated = await ProductModel.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  if (!updated) return fail("Not found", 404);
  return ok({ _id: String(updated._id) });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  const guard = requireAdmin(session);
  if (guard) return guard;

  const { id } = await params;
  await connectDB();
  const removed = await ProductModel.findByIdAndDelete(id);
  if (!removed) return fail("Not found", 404);
  return ok({ removed: true });
}
