/**
 * Tiny helpers for API route responses to keep route handlers terse.
 */
import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function requireAdmin<T extends { user?: unknown } | null>(session: T) {
  if (!session?.user) return fail("Unauthorized", 401);
  return null;
}
