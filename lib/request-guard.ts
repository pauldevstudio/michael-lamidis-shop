/**
 * Checks every public JSON endpoint runs before it trusts a request body:
 * same-site only, JSON only, and a size limit that is enforced on the bytes
 * actually read. No local imports, so `node --test` can load this file.
 */

interface IncomingRequest {
  headers: { get(name: string): string | null };
  text(): Promise<string>;
}

export type BodyResult =
  | { ok: true; body: unknown }
  | { ok: false; status: number; error: string };

export async function readJsonBody(request: IncomingRequest, maxBytes: number): Promise<BodyResult> {
  // Browsers label a request that another website's page triggered. Our own
  // forms are never cross-site, so a hostile page cannot post through visitors.
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return { ok: false, status: 403, error: "Forbidden" };
  }
  const contentType = (request.headers.get("content-type") ?? "").toLowerCase();
  if (!contentType.includes("application/json")) {
    return { ok: false, status: 415, error: "Unsupported content type" };
  }
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes) {
    return { ok: false, status: 413, error: "Request too large" };
  }
  // The header can be missing or wrong, so measure what was really sent.
  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) {
    return { ok: false, status: 413, error: "Request too large" };
  }
  try {
    return { ok: true, body: JSON.parse(text) };
  } catch {
    return { ok: false, status: 400, error: "Invalid request" };
  }
}
