import { test } from "node:test";
import assert from "node:assert/strict";
import { parseConsentValue, consentFromCookieString, CONSENT_COOKIE, CONSENT_VERSION } from "../lib/consent-core.ts";
import { readJsonBody } from "../lib/request-guard.ts";

const consent = (fields) => JSON.stringify({ necessary: true, v: CONSENT_VERSION, ts: "2026-10-09T00:00:00.000Z", ...fields });

test("no cookie, an empty cookie or broken JSON means no consent", () => {
  for (const raw of [undefined, null, "", "not json", "{", "%7Bbroken"]) {
    assert.deepEqual(parseConsentValue(raw), { analytics: false, marketing: false });
  }
});

test("reads a choice that allows analytics but not marketing", () => {
  assert.deepEqual(
    parseConsentValue(consent({ analytics: true, marketing: false })),
    { analytics: true, marketing: false },
  );
});

test("reads the value whether or not it is still URL-encoded", () => {
  const encoded = encodeURIComponent(consent({ analytics: true, marketing: true }));
  assert.deepEqual(parseConsentValue(encoded), { analytics: true, marketing: true });
});

test("a choice saved under an older policy version does not count", () => {
  for (const v of [0, CONSENT_VERSION - 1]) {
    const old = JSON.stringify({ necessary: true, analytics: true, marketing: true, v });
    assert.deepEqual(parseConsentValue(old), { analytics: false, marketing: false });
  }
});

test("only a real true grants consent", () => {
  assert.equal(parseConsentValue(consent({ analytics: "yes", marketing: 1 })).analytics, false);
  assert.equal(parseConsentValue(consent({ analytics: "yes", marketing: 1 })).marketing, false);
});

test("a withdrawn choice reads as no analytics", () => {
  assert.equal(parseConsentValue(consent({ analytics: false, marketing: false })).analytics, false);
});

test("finds the consent cookie among the page's other cookies", () => {
  const value = encodeURIComponent(consent({ analytics: true, marketing: false }));
  const cookies = `theme=dark; ${CONSENT_COOKIE}=${value}; _fbp=fb.0.1`;
  assert.deepEqual(consentFromCookieString(cookies), { analytics: true, marketing: false });
  assert.deepEqual(consentFromCookieString("theme=dark"), { analytics: false, marketing: false });
  assert.deepEqual(consentFromCookieString(""), { analytics: false, marketing: false });
});

const request = (headers, text) => ({
  headers: { get: (name) => headers[name] ?? null },
  text: async () => text,
});
const JSON_HEADERS = { "content-type": "application/json" };

test("accepts a same-site JSON request and returns the parsed body", async () => {
  const r = await readJsonBody(request({ ...JSON_HEADERS, "sec-fetch-site": "same-origin" }, '{"a":1}'), 1000);
  assert.deepEqual(r, { ok: true, body: { a: 1 } });
});

test("refuses a request that another website's page triggered", async () => {
  const r = await readJsonBody(request({ ...JSON_HEADERS, "sec-fetch-site": "cross-site" }, '{"a":1}'), 1000);
  assert.equal(r.ok, false);
  assert.equal(r.status, 403);
});

test("refuses a body that is not sent as JSON, such as a plain HTML form post", async () => {
  const r = await readJsonBody(request({ "content-type": "text/plain" }, '{"a":1}'), 1000);
  assert.equal(r.status, 415);
  assert.equal((await readJsonBody(request({}, '{"a":1}'), 1000)).status, 415);
});

test("refuses a body over the size limit, by the header or by what was really sent", async () => {
  const big = JSON.stringify({ text: "x".repeat(2000) });
  const byHeader = await readJsonBody(request({ ...JSON_HEADERS, "content-length": "5000" }, "{}"), 1000);
  assert.equal(byHeader.status, 413);
  const byBody = await readJsonBody(request(JSON_HEADERS, big), 1000);
  assert.equal(byBody.status, 413);
});

test("counts the size in bytes, so Greek text cannot slip past the limit", async () => {
  const greek = JSON.stringify({ text: "Ψ".repeat(400) });
  assert.ok(greek.length < 1000);
  assert.equal((await readJsonBody(request(JSON_HEADERS, greek), 600)).status, 413);
});

test("refuses broken JSON", async () => {
  const r = await readJsonBody(request(JSON_HEADERS, "{not json"), 1000);
  assert.equal(r.status, 400);
});
