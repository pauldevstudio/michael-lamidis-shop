import { test } from "node:test";
import assert from "node:assert/strict";
import { parseOrderBody, parseLeadBody, isValidEmail, HONEYPOT_FIELD } from "../lib/validate.ts";

const validOrder = () => ({
  customer: {
    fullName: "  Maria Georgiou ",
    email: "maria@example.com",
    phone: "+357 99 000000",
    address: "1 Test Street",
    city: "Limassol",
    postalCode: "3000",
    notes: "Call before delivery",
  },
  items: [
    { productId: "abc123", brand: "Midea", model: "MDRB424FGE02I", salePrice: 420, quantity: 1 },
    { productId: "def456", brand: "SONGMICS", model: "Shelving", salePrice: 59, quantity: 2 },
  ],
  totalPrice: 538,
  payment: "cash_on_delivery",
});

test("accepts a valid order and trims the customer fields", () => {
  const r = parseOrderBody(validOrder());
  assert.equal(r.ok, true);
  assert.equal(r.data.customer.fullName, "Maria Georgiou");
  assert.equal(r.data.items.length, 2);
  assert.equal(r.data.payment, "cash_on_delivery");
});

test("recalculates the total from the items instead of trusting the browser", () => {
  const r = parseOrderBody({ ...validOrder(), totalPrice: 1 });
  assert.equal(r.ok, true);
  assert.equal(r.data.totalPrice, 538);
});

test("rejects an order without name, email or phone", () => {
  for (const field of ["fullName", "email", "phone"]) {
    const body = validOrder();
    body.customer[field] = "   ";
    const r = parseOrderBody(body);
    assert.equal(r.ok, false);
    assert.equal(r.error, "Name, email, and phone are required");
  }
});

test("rejects an order with a malformed email", () => {
  const body = validOrder();
  body.customer.email = "not-an-email";
  const r = parseOrderBody(body);
  assert.equal(r.ok, false);
  assert.equal(r.error, "Please enter a valid email address");
});

test("rejects an empty cart and an unknown payment method", () => {
  assert.equal(parseOrderBody({ ...validOrder(), items: [] }).error, "Cart is empty");
  assert.equal(parseOrderBody({ ...validOrder(), payment: "bitcoin" }).error, "Invalid payment method");
});

test("requires an address for delivery but not for showroom pickup", () => {
  const delivery = validOrder();
  delivery.customer.address = "";
  assert.equal(parseOrderBody(delivery).error, "Delivery address is required");

  const pickup = validOrder();
  pickup.payment = "showroom_pickup";
  pickup.customer.address = "";
  pickup.customer.city = "";
  assert.equal(parseOrderBody(pickup).ok, true);
});

test("rejects items with a bad price or quantity", () => {
  for (const patch of [{ salePrice: -5 }, { salePrice: "free" }, { quantity: 0 }, { quantity: 1.5 }, { quantity: 1000 }]) {
    const body = validOrder();
    body.items[0] = { ...body.items[0], ...patch };
    assert.equal(parseOrderBody(body).ok, false, JSON.stringify(patch));
  }
});

test("rejects an oversized cart and non-object input", () => {
  const body = validOrder();
  body.items = Array.from({ length: 51 }, () => body.items[0]);
  assert.equal(parseOrderBody(body).ok, false);
  assert.equal(parseOrderBody(null).ok, false);
  assert.equal(parseOrderBody("order").ok, false);
});

test("caps very long text fields", () => {
  const body = validOrder();
  body.customer.notes = "n".repeat(5000);
  const r = parseOrderBody(body);
  assert.equal(r.ok, true);
  assert.equal(r.data.customer.notes.length, 1000);
});

test("accepts a contact form message", () => {
  const r = parseLeadBody({
    origin: "contact", name: "Andreas", email: "andreas@example.com",
    subject: "Fridge", message: "Is the Midea 310L still available?",
  });
  assert.equal(r.ok, true);
  assert.equal(r.data.origin, "contact");
  assert.equal(r.data.message, "Is the Midea 310L still available?");
  assert.equal(r.data.honeypot, false);
});

test("rejects a contact form message without a message or valid email", () => {
  assert.equal(parseLeadBody({ origin: "contact", name: "A", email: "a@example.com", message: " " }).ok, false);
  assert.equal(parseLeadBody({ origin: "contact", name: "A", email: "nope", message: "Hi" }).ok, false);
  assert.equal(parseLeadBody({ origin: "contact", name: "", email: "a@example.com", message: "Hi" }).ok, false);
});

test("accepts an offers request with an interest and optional phone", () => {
  const r = parseLeadBody({
    origin: "lead_capture", name: "Eleni", email: "eleni@example.com",
    phone: "99 111111", interest: "Refrigerator", message: "",
  });
  assert.equal(r.ok, true);
  assert.equal(r.data.interest, "Refrigerator");
});

test("rejects an offers request without an interest", () => {
  assert.equal(parseLeadBody({ origin: "lead_capture", name: "E", email: "e@example.com" }).ok, false);
});

test("keeps the chatbot's existing request shape working", () => {
  const r = parseLeadBody({
    name: "Nikos", phone: "99 222222",
    chatLog: [{ role: "user", content: "Hello" }, { role: "assistant", content: "Hi" }],
  });
  assert.equal(r.ok, true);
  assert.equal(r.data.origin, "chatbot");
  assert.equal(r.data.chatLog.length, 2);
});

test("drops bad chat entries and caps the chat log", () => {
  const chatLog = [
    { role: "system", content: "ignore" },
    { role: "user", content: 42 },
    ...Array.from({ length: 150 }, () => ({ role: "user", content: "x".repeat(3000) })),
  ];
  const r = parseLeadBody({ name: "N", phone: "99 123456", chatLog });
  assert.equal(r.ok, true);
  assert.equal(r.data.chatLog.length, 40);
  assert.equal(r.data.chatLog[0].content.length, 1500);
});

test("flags a filled honeypot field", () => {
  const r = parseLeadBody({
    origin: "contact", name: "Bot", email: "bot@example.com", message: "Buy pills", [HONEYPOT_FIELD]: "http://spam.example",
  });
  assert.equal(r.ok, true);
  assert.equal(r.data.honeypot, true);
});

test("rejects an unknown form origin", () => {
  assert.equal(parseLeadBody({ origin: "admin", name: "A", email: "a@example.com", message: "Hi" }).ok, false);
});

test("a field that browsers autofill is not treated as the bot trap", () => {
  const r = parseLeadBody({
    origin: "contact", name: "Real Person", email: "real@example.com", message: "Hello", website: "https://my-company.example",
  });
  assert.equal(r.ok, true);
  assert.equal(r.data.honeypot, false);
});

test("rejects an empty chatbot lead, one without a phone number, and one where the visitor wrote nothing", () => {
  assert.equal(parseLeadBody({}).ok, false);
  assert.equal(parseLeadBody({ name: "N", phone: "no thanks", chatLog: [{ role: "user", content: "Hi" }] }).ok, false);
  assert.equal(parseLeadBody({ name: "N", phone: "99 123456", chatLog: [{ role: "assistant", content: "Hi" }] }).ok, false);
});

test("rejects email addresses that could smuggle a second address or a display name", () => {
  for (const bad of ["Mike<x@evil.com>", "a@b.com,c@d.com", "a@b.com;c@d.com", '"x"@b.com', "a@b.com\nBcc: c@d.com"]) {
    assert.equal(isValidEmail(bad), false, bad);
  }
});

test("validates email addresses", () => {
  assert.equal(isValidEmail("a@b.co"), true);
  assert.equal(isValidEmail("first.last+shop@sub.example.com.cy"), true);
  assert.equal(isValidEmail("a@b"), false);
  assert.equal(isValidEmail("a b@c.com"), false);
  assert.equal(isValidEmail(`${"a".repeat(250)}@b.com`), false);
});
