import { test } from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter, clientKey } from "../lib/rate-limit.ts";

test("allows requests up to the limit, then blocks", () => {
  const limiter = createRateLimiter(3, 60_000);
  assert.equal(limiter.check("1.1.1.1", 0), true);
  assert.equal(limiter.check("1.1.1.1", 1), true);
  assert.equal(limiter.check("1.1.1.1", 2), true);
  assert.equal(limiter.check("1.1.1.1", 3), false);
});

test("counts each visitor separately", () => {
  const limiter = createRateLimiter(1, 60_000);
  assert.equal(limiter.check("1.1.1.1", 0), true);
  assert.equal(limiter.check("2.2.2.2", 0), true);
  assert.equal(limiter.check("1.1.1.1", 1), false);
});

test("allows requests again after the window passes", () => {
  const limiter = createRateLimiter(1, 60_000);
  assert.equal(limiter.check("1.1.1.1", 0), true);
  assert.equal(limiter.check("1.1.1.1", 59_999), false);
  assert.equal(limiter.check("1.1.1.1", 60_001), true);
});

test("does not grow without bound when many visitors arrive", () => {
  const limiter = createRateLimiter(1, 60_000, 100);
  for (let i = 0; i < 1000; i++) limiter.check(`ip-${i}`, i);
  assert.ok(limiter.size() <= 100);
});

test("reads the visitor address from the proxy headers", () => {
  const headers = (h) => ({ get: (name) => h[name] ?? null });
  assert.equal(clientKey(headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" })), "203.0.113.7");
  assert.equal(clientKey(headers({ "x-real-ip": "203.0.113.8" })), "203.0.113.8");
  assert.equal(clientKey(headers({})), "unknown");
});
