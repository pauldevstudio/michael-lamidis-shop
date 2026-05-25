/**
 * One-shot: download an image from a URL, save to Payload Media collection,
 * and attach it to a product by model number.
 *
 * Usage:
 *   /api/dev/attach-product-image?model=RS68A8820WW&url=https://example.com/img.jpg
 *
 * Supports Google Drive share links (auto-converts /file/d/ID/view → uc?export=download&id=ID)
 */
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeUrl(input: string): string {
  // Google Drive share link → direct download
  const driveFile = input.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveFile) {
    return `https://drive.google.com/uc?export=download&id=${driveFile[1]}`;
  }
  const driveOpen = input.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (driveOpen) {
    return `https://drive.google.com/uc?export=download&id=${driveOpen[1]}`;
  }
  return input;
}

function inferFilename(url: string, model: string): string {
  try {
    const u = new URL(url);
    const base = path.basename(u.pathname);
    if (base && base.includes(".")) return `${model}-${base}`;
  } catch {}
  return `${model}.jpg`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const model = searchParams.get("model");
    const rawUrl = searchParams.get("url");

    if (!model || !rawUrl) {
      return NextResponse.json(
        { ok: false, error: "Missing ?model= or ?url= parameter" },
        { status: 400 },
      );
    }

    const url = normalizeUrl(rawUrl);
    const payload = await getPayload({ config });

    // Find the product
    const products = await payload.find({
      collection: "products",
      where: { model: { equals: model } },
      limit: 1,
    });
    if (!products.docs.length) {
      return NextResponse.json(
        { ok: false, error: `No product found with model='${model}'` },
        { status: 404 },
      );
    }
    const product = products.docs[0] as Record<string, unknown>;

    // Download image
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Image fetch failed: HTTP ${res.status}` },
        { status: 502 },
      );
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        {
          ok: false,
          error: `URL did not return an image (got '${contentType}'). For Google Drive, make sure the file is set to "Anyone with link can view".`,
        },
        { status: 415 },
      );
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = inferFilename(url, model);

    // Create Media doc
    const media = await payload.create({
      collection: "media",
      data: { alt: `${product.brand as string} ${model}` },
      file: {
        data: buffer,
        mimetype: contentType,
        name: filename,
        size: buffer.length,
      },
    });

    // Attach to product
    await payload.update({
      collection: "products",
      id: product.id as string,
      data: { image: (media as { id: string }).id },
    });

    return NextResponse.json({
      ok: true,
      message: `Attached image to product '${model}' (${product.brand}). Filename: ${filename}, ${(buffer.length / 1024).toFixed(1)} KB.`,
      productId: product.id,
      mediaId: (media as { id: string }).id,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
