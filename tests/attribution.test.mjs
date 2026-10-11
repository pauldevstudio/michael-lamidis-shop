import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseCampaignParams,
  hasCampaign,
  classifySource,
  pickAttribution,
  referrerWithoutQuery,
  EMPTY_CAMPAIGN,
} from "../lib/attribution.ts";

const HOST = "michaellamidisshop.com";

test("parses the utm tags the ads carry", () => {
  const c = parseCampaignParams(
    "?utm_source=facebook&utm_medium=paid&utm_campaign=120252096443100523&utm_content=120253164474590523",
  );
  assert.equal(c.utmSource, "facebook");
  assert.equal(c.utmMedium, "paid");
  assert.equal(c.utmCampaign, "120252096443100523");
  assert.equal(c.utmContent, "120253164474590523");
  assert.equal(c.utmTerm, "");
  assert.equal(c.clickId, "");
});

test("records that a click id was present without keeping its value", () => {
  const c = parseCampaignParams("?fbclid=IwAR0secretvalue123");
  assert.equal(c.clickId, "fbclid");
  assert.equal(JSON.stringify(c).includes("IwAR0secretvalue123"), false);
});

test("prefers gclid when both click ids are present", () => {
  assert.equal(parseCampaignParams("?fbclid=a&gclid=b").clickId, "gclid");
});

test("returns empty values when the query has no campaign tags", () => {
  assert.deepEqual(parseCampaignParams("?page=2&sort=price"), EMPTY_CAMPAIGN);
  assert.deepEqual(parseCampaignParams(""), EMPTY_CAMPAIGN);
  assert.equal(hasCampaign(parseCampaignParams("")), false);
});

test("strips markup and caps the length of tag values", () => {
  const c = parseCampaignParams(
    `?utm_source=<script>alert(1)</script>&utm_campaign=${"x".repeat(500)}`,
  );
  assert.equal(c.utmSource.includes("<"), false);
  assert.equal(c.utmSource.includes(">"), false);
  assert.equal(c.utmCampaign.length, 100);
});

test("keeps readable campaign names, including Greek letters", () => {
  const c = parseCampaignParams("?utm_campaign=" + encodeURIComponent("Ψυγεία Sale 2026"));
  assert.equal(c.utmCampaign, "Ψυγεία Sale 2026");
});

test("a malformed query still yields clean text values", () => {
  const c = parseCampaignParams("?utm_source=%E0%A4%A&utm_medium=paid");
  assert.equal(typeof c.utmSource, "string");
  assert.equal(/[%<>]/.test(c.utmSource), false);
  assert.equal(c.utmMedium, "paid");
});

test("classifies a tagged ad click as paid advertising", () => {
  const c = parseCampaignParams("?utm_source=facebook&utm_medium=paid");
  assert.equal(classifySource("https://l.facebook.com/", c, HOST), "Paid Advertising");
});

test("classifies paid even when the app strips the referrer", () => {
  const c = parseCampaignParams("?utm_source=instagram&utm_medium=paid_social");
  assert.equal(classifySource("", c, HOST), "Paid Advertising");
});

test("classifies a google ads click id as paid advertising", () => {
  assert.equal(classifySource("", parseCampaignParams("?gclid=abc"), HOST), "Paid Advertising");
});

test("classifies an untagged facebook visit as social media", () => {
  assert.equal(classifySource("https://m.facebook.com/", EMPTY_CAMPAIGN, HOST), "Social Media");
});

test("uses the utm source when a social visit arrives with no referrer", () => {
  const c = parseCampaignParams("?utm_source=facebook&utm_medium=social");
  assert.equal(classifySource("", c, HOST), "Social Media");
});

test("classifies search engines, other sites and direct visits", () => {
  assert.equal(classifySource("https://www.google.com/", EMPTY_CAMPAIGN, HOST), "Organic Search");
  assert.equal(classifySource("https://example.org/page", EMPTY_CAMPAIGN, HOST), "Referral");
  assert.equal(classifySource("", EMPTY_CAMPAIGN, HOST), "Direct");
  assert.equal(classifySource("not a url", EMPTY_CAMPAIGN, HOST), "Direct");
});

test("treats the site's own pages as direct, not as a referral", () => {
  assert.equal(
    classifySource("https://www.michaellamidisshop.com/products", EMPTY_CAMPAIGN, HOST),
    "Direct",
  );
});

const day = (n) => new Date(Date.UTC(2026, 9, n));
const adVisit = {
  ts: day(5), source: "Paid Advertising", path: "/products/abc",
  utmSource: "fb", utmMedium: "paid", utmCampaign: "111", utmContent: "222", utmTerm: "333", clickId: "fbclid",
};
const todaysVisit = { ts: day(9), source: "Direct", path: "/" };

test("an earlier ad visit wins over today's direct visit", () => {
  const a = pickAttribution(adVisit, todaysVisit, { ts: day(1) });
  assert.equal(a.source, "Paid Advertising");
  assert.equal(a.utmContent, "222");
  assert.equal(a.landingPath, "/products/abc");
  assert.deepEqual(a.touchAt, day(5));
  assert.deepEqual(a.firstSeen, day(1));
});

test("without an ad visit the current session's channel is used, with no tags", () => {
  const a = pickAttribution(null, todaysVisit, null);
  assert.equal(a.source, "Direct");
  assert.equal(a.utmCampaign, "");
  assert.equal(a.landingPath, "/");
  assert.deepEqual(a.firstSeen, day(9));
});

test("no known visit means no attribution", () => {
  assert.equal(pickAttribution(null, null, null), null);
});

test("attribution never carries a visitor or session id", () => {
  const a = pickAttribution({ ...adVisit, vid: "visitor-1", sid: "session-1" }, null, null);
  assert.equal("vid" in a, false);
  assert.equal("sid" in a, false);
});

test("a stored referrer keeps the site and page but never the query", () => {
  assert.equal(
    referrerWithoutQuery("https://www.michaellamidisshop.com/products?fbclid=SECRET&utm_source=fb#top"),
    "https://www.michaellamidisshop.com/products",
  );
  assert.equal(referrerWithoutQuery("https://l.facebook.com/l.php?u=x"), "https://l.facebook.com/l.php");
  assert.equal(referrerWithoutQuery("not a url"), "");
  assert.equal(referrerWithoutQuery(""), "");
});
