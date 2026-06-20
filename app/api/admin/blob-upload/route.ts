export const runtime = "nodejs";

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidSessionToken } from "@/lib/admin-auth";

/**
 * Client-direct-to-Blob upload handler — used for product VIDEOS.
 *
 * Videos are too large for the standard /api/admin/upload route: Vercel caps a
 * Serverless function's request body at ~4.5 MB. This route never receives the
 * file; it only mints a short-lived upload token, and the browser then uploads
 * the file straight to Vercel Blob, bypassing the function-body limit.
 */
export async function POST(request: Request): Promise<NextResponse> {
  // Read the admin cookie up-front. The token-generation request carries it;
  // the later server-to-server onUploadCompleted callback from Vercel does not
  // (and that phase doesn't call onBeforeGenerateToken, so it isn't gated).
  const adminToken = (await cookies()).get("admin_session")?.value;
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!isValidSessionToken(adminToken)) {
          throw new Error("Unauthorized");
        }
        return {
          allowedContentTypes: [
            "video/mp4",
            "video/webm",
            "video/ogg",
            "video/quicktime",
            "video/x-m4v",
          ],
          maximumSizeInBytes: 200 * 1024 * 1024, // 200 MB
          addRandomSuffix: true,
        };
      },
      // The browser already receives the public URL from upload(); no-op here.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
