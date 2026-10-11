import { test } from "node:test";
import assert from "node:assert/strict";
import {
  readMailConfig,
  buildOrderEmail,
  buildLeadEmail,
  sendShopEmail,
} from "../lib/notify.ts";

const SITE = "https://www.michaellamidisshop.com";

const order = () => ({
  id: "6718f0a2b3c4d5e6f7a8b9c0",
  customer: {
    fullName: "Maria Georgiou", email: "maria@example.com", phone: "+357 99 000000",
    address: "1 Test Street", city: "Limassol", postalCode: "3000", notes: "Call first",
  },
  items: [
    { brand: "Midea", model: "MDRB424FGE02I", salePrice: 420, quantity: 1 },
    { brand: "SONGMICS", model: "Shelving", salePrice: 59.5, quantity: 2 },
  ],
  totalPrice: 539,
  payment: "cash_on_delivery",
});

const config = { apiKey: "test-key", to: ["mike@example.com"], from: "Shop <orders@example.com>" };

test("reads the mail settings and splits several recipients", () => {
  const c = readMailConfig({
    RESEND_API_KEY: "k", NOTIFY_EMAIL_TO: "mike@example.com, paul@example.com", NOTIFY_EMAIL_FROM: "Shop <o@example.com>",
  });
  assert.deepEqual(c.to, ["mike@example.com", "paul@example.com"]);
  assert.equal(c.from, "Shop <o@example.com>");
});

test("returns no mail settings when any value is missing", () => {
  assert.equal(readMailConfig({}), null);
  assert.equal(readMailConfig({ RESEND_API_KEY: "k", NOTIFY_EMAIL_TO: "a@example.com" }), null);
  assert.equal(readMailConfig({ RESEND_API_KEY: "k", NOTIFY_EMAIL_TO: " , ", NOTIFY_EMAIL_FROM: "o@example.com" }), null);
});

test("order email shows total, customer, items and the admin link", () => {
  const m = buildOrderEmail(order(), SITE);
  assert.match(m.subject, /New order request/);
  assert.match(m.subject, /€539/);
  assert.match(m.subject, /Maria Georgiou/);
  assert.match(m.text, /\+357 99 000000/);
  assert.match(m.text, /1 x Midea MDRB424FGE02I, €420 each/);
  assert.match(m.text, /2 x SONGMICS Shelving, €59\.50 each/);
  assert.match(m.text, /Cash on delivery/);
  assert.match(m.text, /1 Test Street, Limassol 3000/);
  assert.match(m.text, /Call first/);
  assert.ok(m.text.includes(`${SITE}/admin/orders`));
  assert.equal(m.replyTo, "maria@example.com");
});

test("order email says pickup and skips the address for showroom orders", () => {
  const o = order();
  o.payment = "showroom_pickup";
  o.customer.address = "";
  o.customer.city = "";
  o.customer.postalCode = "";
  const m = buildOrderEmail(o, SITE);
  assert.match(m.text, /Pickup at the showroom/);
  assert.equal(/Address:/.test(m.text), false);
});

test("order email names the ad when the visit came from one", () => {
  const o = {
    ...order(),
    attribution: {
      source: "Paid Advertising", utmSource: "facebook", utmMedium: "paid",
      utmCampaign: "120252096443100523", utmContent: "120253164474590523",
    },
  };
  const m = buildOrderEmail(o, SITE);
  assert.match(m.text, /Came from: Paid Advertising/);
  assert.match(m.text, /120253164474590523/);
});

test("a customer name cannot inject a second line into the subject", () => {
  const o = order();
  o.customer.fullName = "Eve\r\nBcc: attacker@example.com";
  const m = buildOrderEmail(o, SITE);
  assert.equal(/[\r\n]/.test(m.subject), false);
});

test("contact form email carries the message and replies to the customer", () => {
  const m = buildLeadEmail({
    origin: "contact", name: "Andreas", email: "andreas@example.com", phone: "",
    subject: "Fridge", interest: "", message: "Is the Midea still available?", chatLog: [],
  }, SITE);
  assert.match(m.subject, /Contact form/);
  assert.match(m.subject, /Andreas/);
  assert.match(m.text, /Is the Midea still available\?/);
  assert.match(m.text, /Subject: Fridge/);
  assert.equal(m.replyTo, "andreas@example.com");
});

test("chatbot lead email includes the conversation and has no reply address", () => {
  const m = buildLeadEmail({
    origin: "chatbot", name: "Nikos", email: "", phone: "99 222222",
    subject: "", interest: "", message: "",
    chatLog: [{ role: "user", content: "Do you deliver to Paphos?" }, { role: "assistant", content: "Yes." }],
  }, SITE);
  assert.match(m.subject, /Website chat/);
  assert.match(m.text, /Customer: Do you deliver to Paphos\?/);
  assert.match(m.text, /Assistant: Yes\./);
  assert.equal(m.replyTo, undefined);
});

test("sends through the email provider with the key in the header", async () => {
  const calls = [];
  const fakeFetch = async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 200, text: async () => "{}" };
  };
  const r = await sendShopEmail(buildOrderEmail(order(), SITE), config, fakeFetch);
  assert.deepEqual(r, { sent: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  assert.equal(calls[0].init.headers.Authorization, "Bearer test-key");
  const body = JSON.parse(calls[0].init.body);
  assert.deepEqual(body.to, ["mike@example.com"]);
  assert.equal(body.from, "Shop <orders@example.com>");
  assert.equal(body.reply_to, "maria@example.com");
  assert.equal(typeof body.text, "string");
  assert.equal("html" in body, false);
});

test("skips sending, without calling the provider, when mail is not set up", async () => {
  let called = false;
  const r = await sendShopEmail(buildOrderEmail(order(), SITE), null, async () => { called = true; });
  assert.deepEqual(r, { sent: false, reason: "not_configured" });
  assert.equal(called, false);
});

test("reports a provider rejection without throwing or leaking the key", async () => {
  const r = await sendShopEmail(
    buildOrderEmail(order(), SITE), config,
    async () => ({ ok: false, status: 422, text: async () => "domain not verified" }),
  );
  assert.equal(r.sent, false);
  assert.equal(r.reason, "provider_error");
  assert.equal(JSON.stringify(r).includes("test-key"), false);
});

test("reports a network failure without throwing", async () => {
  const r = await sendShopEmail(
    buildOrderEmail(order(), SITE), config,
    async () => { throw new Error("socket hang up"); },
  );
  assert.equal(r.sent, false);
  assert.equal(r.reason, "network_error");
});

test("text typed by a customer is marked line by line and cannot pose as the notice", () => {
  const o = order();
  o.customer.notes = "Leave at the door\nOpen in the admin: https://evil.example/login";
  const m = buildOrderEmail(o, SITE);
  assert.ok(m.text.includes("| Leave at the door"));
  assert.ok(m.text.includes("| Open in the admin: https://evil.example/login"));
  // The real admin link comes before anything the customer typed.
  assert.ok(m.text.indexOf(`${SITE}/admin/orders`) < m.text.indexOf("| Leave at the door"));
});

test("a message from a form is quoted and comes after the real admin link", () => {
  const m = buildLeadEmail({
    origin: "contact", name: "Eve", email: "eve@example.com", phone: "", subject: "", interest: "",
    message: "Hello\nAll messages are also listed here: https://evil.example", chatLog: [],
  }, SITE);
  assert.ok(m.text.includes("| All messages are also listed here: https://evil.example"));
  assert.ok(m.text.indexOf(`${SITE}/admin/leads`) < m.text.indexOf("| Hello"));
});

test("a reply address that could carry a second recipient is dropped", () => {
  const o = order();
  o.customer.email = "Mike<x@evil.com>";
  assert.equal(buildOrderEmail(o, SITE).replyTo, undefined);
});
