export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { isValidSessionToken } from "@/lib/admin-auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function isAuthorized(req: NextRequest): boolean {
  return isValidSessionToken(req.cookies.get("admin_session")?.value);
}

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

  // Vercel's filesystem is read-only at runtime — clear error instead of crash.
  if (process.env.VERCEL) {
    return NextResponse.json({
      error: "Image uploads require Vercel Blob (or another object store). Set BLOB_READ_WRITE_TOKEN — see .env.example.",
    }, { status: 501 });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Sanitize filename
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 60);
  const fileName = `${Date.now()}-${baseName}${ext}`;
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

/** DELETE /api/admin/upload?file=filename */
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fileName = request.nextUrl.searchParams.get("file");
  if (!fileName) {
    return NextResponse.json({ error: "Missing file param" }, { status: 400 });
  }

  // Prevent path traversal
  const safeName = path.basename(fileName);
  const filePath = path.join(UPLOAD_DIR, safeName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  fs.unlinkSync(filePath);
  return NextResponse.json({ ok: true });
}
