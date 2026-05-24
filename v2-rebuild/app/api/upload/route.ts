/**
 * Local-disk uploader for admin image uploads.
 * Writes to /public/uploads — swap for S3 / Vercel Blob in production.
 */
import { NextRequest } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { auth } from "@/lib/auth";
import { ok, fail, requireAdmin } from "@/lib/http";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  const session = await auth();
  const guard = requireAdmin(session);
  if (guard) return guard;

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return fail("Missing file", 400);
  if (file.size > 10 * 1024 * 1024) return fail("Max file size is 10MB", 413);

  const ext = path.extname(file.name) || ".bin";
  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), buf);

  return ok({ url: `/uploads/${name}` }, 201);
}
