export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { put, del, list } from "@vercel/blob";

import { isValidSessionToken } from "@/lib/admin-auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function isAuthorized(req: NextRequest): boolean {
  return isValidSessionToken(req.cookies.get("admin_session")?.value);
}

const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** POST /api/admin/upload  — multipart/form-data with field "file" */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 415 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 413 });
  }

  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 60);
  const fileName = `${Date.now()}-${baseName}${ext}`;

  if (hasBlob()) {
    const blob = await put(`products/${fileName}`, file, {
      access: "public",
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url, fileName });
  }

  // Local dev fallback: write to public/uploads
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  const filePath = path.join(UPLOAD_DIR, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
  return NextResponse.json({ url: `/uploads/${fileName}`, fileName });
}

/** GET /api/admin/upload — list uploaded files */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (hasBlob()) {
    const result = await list({ prefix: "products/" });
    const files = result.blobs.map((b) => ({
      fileName: b.pathname.replace(/^products\//, ""),
      url: b.url,
      size: b.size,
      createdAt: b.uploadedAt.toISOString(),
    }));
    return NextResponse.json(files);
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    return NextResponse.json([]);
  }
  const files = fs
    .readdirSync(UPLOAD_DIR)
    .filter((f) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f))
    .map((f) => {
      const stat = fs.statSync(path.join(UPLOAD_DIR, f));
      return {
        fileName: f,
        url: `/uploads/${f}`,
        size: stat.size,
        createdAt: stat.birthtime.toISOString(),
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(files);
}

/** DELETE /api/admin/upload?file=filename  OR  ?url=<blob-url> */
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blobUrl = request.nextUrl.searchParams.get("url");
  const fileName = request.nextUrl.searchParams.get("file");

  if (hasBlob() && blobUrl) {
    await del(blobUrl);
    return NextResponse.json({ ok: true });
  }

  if (!fileName) {
    return NextResponse.json({ error: "Missing file or url param" }, { status: 400 });
  }

  // Local dev: filesystem delete
  const safeName = path.basename(fileName);
  const filePath = path.join(UPLOAD_DIR, safeName);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
  fs.unlinkSync(filePath);
  return NextResponse.json({ ok: true });
}
