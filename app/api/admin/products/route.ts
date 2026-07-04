export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { isValidSessionToken } from "@/lib/admin-auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { SITE_CONTENT_TAG } from "@/lib/site-content";
import type { Product } from "@/lib/constants";

function isAuthorized(req: NextRequest): boolean {
  return isValidSessionToken(req.cookies.get("admin_session")?.value);
}

function toPayloadData(p: Partial<Product>) {
  // Single-price model: mirror originalPrice to salePrice so public
  // displays show one figure (the "real saving" guards hide the badge
  // + strikethrough when these are equal).
  const sale = Number(p.salePrice ?? 0);
  // Reconcile the gallery with the primary imageUrl. The modal sends
  // images[] with imageUrl === images[0]; the grid's quick-replace sends a
  // new imageUrl without reordering images[] — promote it to primary while
  // keeping the rest of the gallery intact.
  let images = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
  if (p.imageUrl && images[0] !== p.imageUrl) {
    images = [p.imageUrl, ...images.filter((u) => u !== p.imageUrl)];
  }
  const primary = images[0] ?? p.imageUrl ?? "";
  return {
    brand:         p.brand ?? "",
    model:         p.model ?? "",
    category:      p.category ?? "refrigerators",
    originalPrice: sale,
    salePrice:     sale,
    savings:       0,
    grade:         p.grade ?? "A",
    warranty:      p.warranty ?? 12,
    icon:          p.icon ?? "Package",
    colorFrom:     p.colorFrom ?? "#3A5F8A",
    colorTo:       p.colorTo ?? "#7FAEDB",
    imageUrl:      primary,
    gallery:       images.map((url) => ({ url })),
    videoUrl:      p.videoUrl ?? "",
    sold:          Boolean(p.sold),
    promo:         Boolean(p.promo),
    description:   p.description ?? "",
    specs:         Array.isArray(p.specs) ? p.specs : [],
  };
}

/** Extract gallery URLs from a Payload product doc. */
function galleryFromDoc(d: Record<string, unknown>): string[] {
  return Array.isArray(d.gallery)
    ? (d.gallery as Array<{ url?: string }>).map((g) => g?.url ?? "").filter(Boolean)
    : [];
}

function fromPayloadDoc(d: Record<string, unknown>): Product {
  const img = d.image as { url?: string } | string | undefined;
  const uploadUrl =
    (img && typeof img === "object" && typeof img.url === "string")
      ? img.url
      : ((d.imageUrl as string) ?? "");
  const gallery = galleryFromDoc(d);
  // images[0] is the primary; fall back to the legacy upload/imageUrl field.
  const images = gallery.length > 0 ? gallery : (uploadUrl ? [uploadUrl] : []);
  const imageUrl = images[0] ?? "";
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
    images,
    videoUrl:      (d.videoUrl as string) ?? "",
    sold:          Boolean(d.sold),
    promo:         Boolean(d.promo),
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
    revalidateTag(SITE_CONTENT_TAG); revalidatePath("/", "layout");
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
    revalidateTag(SITE_CONTENT_TAG); revalidatePath("/", "layout");
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
    revalidateTag(SITE_CONTENT_TAG); revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
