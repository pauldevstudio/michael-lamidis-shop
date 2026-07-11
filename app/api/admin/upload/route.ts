export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

import { isValidSessionToken } from "@/lib/admin-auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function isAuthorized(req: NextRequest): boolean {
  return isValidSessionToken(req.cookies.get("admin_session")?.value);
}

function configureCloudinary() {
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return true;
  }
  return false;
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

  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 60);
  const fileName = `${Date.now()}-${baseName}${ext}`;

  if (configureCloudinary()) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "michael-lamidis/products",
            public_id: `${Date.now()}-${baseName}`,
            resource_type: "image",
            transformation: [{ quality: "auto", fetch_format: "auto" }],
          },
          (err, res) => {
            if (err || !res) return reject(err || new Error("Upload failed"));
            resolve(res);
          }
        )
        .end(buffer);
    });
    return NextResponse.json({ url: result.secure_url, fileName });
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

  // Local dev: filesystem delete
  const safeName = path.basename(fileName);
  const filePath = path.join(UPLOAD_DIR, safeName);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
  fs.unlinkSync(filePath);
  return NextResponse.json({ ok: true });
}
