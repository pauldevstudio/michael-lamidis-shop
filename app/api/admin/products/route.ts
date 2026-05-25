export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { isValidSessionToken } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import type { Product } from "@/lib/constants";

function isAuthorized(req: NextRequest): boolean {
  return isValidSessionToken(req.cookies.get("admin_session")?.value);
}

function toPayloadData(p: Partial<Product>) {
  return {
    brand:         p.brand ?? "",
    model:         p.model ?? "",
    category:      p.category ?? "refrigerators",
    originalPrice: p.originalPrice ?? 0,
    salePrice:     p.salePrice ?? 0,
    savings:       p.savings,
    grade:         p.grade ?? "A",
    warranty:      p.warranty ?? 12,
    icon:          p.icon ?? "Package",
    colorFrom:     p.colorFrom ?? "#3A5F8A",
    colorTo:       p.colorTo ?? "#7FAEDB",
    imageUrl:      p.imageUrl ?? "",
    description:   p.description ?? "",
    specs:         Array.isArray(p.specs) ? p.specs : [],
  };
}

function fromPayloadDoc(d: Record<string, unknown>): Product {
  const img = d.image as { url?: string } | string | undefined;
  const imageUrl =
    (img && typeof img === "object" && typeof img.url === "string")
      ? img.url
      : ((d.imageUrl as string) ?? "");
  return {
    id:            String(d.id ?? ""),
    brand:         (d.brand as string)         ?? "",
    model:         (d.model as string)         ?? "",
    category:      (d.category as string)      ?? "",
    originalPrice: Number(d.originalPrice ?? 0),
    salePrice:     Number(d.salePrice ?? 0),
    savings:       Number(d.savings ?? 0),
    grade:         (d.grade as string)         ?? "A",
    warranty:      Number(d.warranty ?? 12),
    icon:          (d.icon as string)          ?? "Package",
    colorFrom:     (d.colorFrom as string)     ?? "#3A5F8A",
    colorTo:       (d.colorTo as string)       ?? "#7FAEDB",
    imageUrl,
    description:   (d.description as string)   ?? "",
    specs:         Array.isArray(d.specs)
      ? (d.specs as Array<{ label?: string; value?: string }>).map((s) => ({
          label: s?.label ?? "",
          value: s?.value ?? "",
        }))
      : [],
  };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "products",
      limit: 500,
      depth: 1,
      sort: "displayOrder",
    });
    return NextResponse.json(result.docs.map((d) => fromPayloadDoc(d as Record<string, unknown>)));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as Partial<Product>;
    const payload = await getPayload({ config });
    const created = await payload.create({ collection: "products", data: toPayloadData(body) });
    revalidatePath("/", "layout");
    return NextResponse.json(fromPayloadDoc(created as Record<string, unknown>), { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as Partial<Product>;
    if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const payload = await getPayload({ config });
    const updated = await payload.update({
      collection: "products",
      id: body.id,
      data: toPayloadData(body),
    });
    revalidatePath("/", "layout");
    return NextResponse.json(fromPayloadDoc(updated as Record<string, unknown>));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    const payload = await getPayload({ config });
    await payload.delete({ collection: "products", id });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
