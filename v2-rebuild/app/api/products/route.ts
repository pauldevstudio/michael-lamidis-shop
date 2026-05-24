import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { productSchema } from "@/lib/validation";
import { ok, fail, requireAdmin } from "@/lib/http";
import { listProducts } from "@/lib/products";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const products = await listProducts({
    category: sp.get("category") ?? undefined,
    brand: sp.get("brand") ?? undefined,
    featured: sp.get("featured") === "true" ? true : undefined,
  });
  return ok(products);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const guard = requireAdmin(session);
  if (guard) return guard;

  const json = await req.json();
  const parsed = productSchema.safeParse(json);
  if (!parsed.success) return fail(parsed.error.message, 422);

  await connectDB();
  const created = await ProductModel.create(parsed.data);
  return ok({ _id: String(created._id) }, 201);
}
