export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, writeSiteContent } from "@/lib/site-content";
import { isValidSessionToken } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import type { Product } from "@/lib/constants";

function isAuthorized(req: NextRequest): boolean {
  return isValidSessionToken(req.cookies.get("admin_session")?.value);
}

/** GET /api/admin/products → list all */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await getSiteContent();
  return NextResponse.json(content.products);
}

/** POST /api/admin/products → create */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const product: Product = await request.json();
    const content = await getSiteContent();
    if (!product.id) {
      product.id = Date.now().toString();
    }
    content.products = [...content.products, product];
    await writeSiteContent(content);
    revalidatePath("/", "layout");
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/** PUT /api/admin/products → update one (expects full product with id) */
export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const updated: Product = await request.json();
    const content = await getSiteContent();
    content.products = content.products.map((p) =>
      p.id === updated.id ? updated : p
    );
    await writeSiteContent(content);
    revalidatePath("/", "layout");
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/** DELETE /api/admin/products?id=xxx */
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const content = await getSiteContent();
  content.products = content.products.filter((p) => p.id !== id);
  await writeSiteContent(content);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
