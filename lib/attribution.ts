/**
 * Campaign attribution helpers shared by /api/track and the order and lead
 * routes. Pure functions, no I/O, no local imports (so `node --test` can load
 * this file directly).
 *
 * Privacy: only utm_* values and the KIND of click id are kept. The click id
 * value itself (fbclid, gclid) is never stored.
 */

/** First-party analytics cookies, set by /api/track once Analytics consent is given. */
export const VISITOR_COOKIE = "_av"; // anonymous visitor id (12 months)
export const SESSION_COOKIE = "_as"; // session id (30 min sliding)

export interface CampaignParams {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  clickId: "" | "fbclid" | "gclid";
}

export const EMPTY_CAMPAIGN: CampaignParams = Object.freeze({
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: "",
  clickId: "",
});

const MAX_PARAM_LENGTH = 100;

// Letters and digits of any language plus a few safe separators. Built with the
// constructor because the project targets ES2017 (no \p{…} in regex literals).
const UNSAFE_PARAM_CHARS = new RegExp("[^\\p{L}\\p{N}\\-_.~ |:+]", "gu");

const PAID_MEDIUM = /^(cpc|ppc|paid)/i;
const SEARCH_HOST = /(google|bing|yahoo|duckduckgo|ecosia|yandex|baidu)\./;
const SOCIAL_HOST = /(facebook|fb\.|instagram|t\.co|twitter|x\.com|linkedin|youtube|tiktok|pinterest|reddit|whatsapp)\./;
const SOCIAL_UTM_SOURCE = /^(facebook|fb|instagram|ig|meta|tiktok|youtube|twitter|x|linkedin|pinterest|reddit|whatsapp)$/i;

function cleanParam(value: string | null): string {
  return (value ?? "").replace(UNSAFE_PARAM_CHARS, "").trim().slice(0, MAX_PARAM_LENGTH);
}

/** Read the campaign tags from a URL query string such as "?utm_source=facebook". */
export function parseCampaignParams(search: string): CampaignParams {
  let query: URLSearchParams;
  try {
    query = new URLSearchParams(search);
  } catch {
    return EMPTY_CAMPAIGN;
  }
  const clickId = query.has("gclid") ? "gclid" : query.has("fbclid") ? "fbclid" : "";
  return {
    utmSource: cleanParam(query.get("utm_source")),
    utmMedium: cleanParam(query.get("utm_medium")),
    utmCampaign: cleanParam(query.get("utm_campaign")),
    utmContent: cleanParam(query.get("utm_content")),
    utmTerm: cleanParam(query.get("utm_term")),
    clickId,
  };
}

export function hasCampaign(campaign: CampaignParams): boolean {
  return Boolean(
    campaign.utmSource || campaign.utmMedium || campaign.utmCampaign ||
    campaign.utmContent || campaign.utmTerm || campaign.clickId,
  );
}

/** One stored analytics event, as far as attribution needs it. */
export interface TouchEvent {
  ts: Date;
  source?: string;
  path?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  clickId?: string;
}

/** Where an order or message came from. Holds no visitor or session id. */
export interface Attribution {
  source: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  clickId: string;
  landingPath: string;
  touchAt: Date;
  firstSeen: Date;
}

/**
 * Attribution rule: the most recent visit that carried campaign tags (the
 * caller limits how far back that may be); otherwise the start of the current
 * session; otherwise nothing.
 */
export function pickAttribution(
  campaignTouch: TouchEvent | null,
  sessionStart: TouchEvent | null,
  firstEvent: TouchEvent | null,
): Attribution | null {
  const touch = campaignTouch ?? sessionStart;
  if (!touch) return null;
  return {
    source: touch.source || "Direct",
    utmSource: campaignTouch?.utmSource ?? "",
    utmMedium: campaignTouch?.utmMedium ?? "",
    utmCampaign: campaignTouch?.utmCampaign ?? "",
    utmContent: campaignTouch?.utmContent ?? "",
    utmTerm: campaignTouch?.utmTerm ?? "",
    clickId: campaignTouch?.clickId ?? "",
    landingPath: touch.path || "",
    touchAt: touch.ts,
    firstSeen: firstEvent?.ts ?? touch.ts,
  };
}

/** Referrer reduced to site and page, so no query string (and no click id) is ever stored. */
export function referrerWithoutQuery(referrer: string): string {
  if (!referrer) return "";
  try {
    const url = new URL(referrer);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}

/** Hostname of the referring site, or "" for no referrer or the site's own pages. */
function externalReferrerHost(referrer: string, host: string): string {
  if (!referrer) return "";
  let refHost = "";
  try {
    refHost = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "";
  }
  if (!refHost || refHost === host || refHost.endsWith("." + host)) return "";
  return refHost;
}

/**
 * Channel of one visit. Campaign tags win over the referrer because in-app
 * browsers (Facebook, Instagram) often strip the referrer.
 */
export function classifySource(referrer: string, campaign: CampaignParams, host: string): string {
  if (campaign.clickId === "gclid" || PAID_MEDIUM.test(campaign.utmMedium)) return "Paid Advertising";

  const refHost = externalReferrerHost(referrer, host);
  if (!refHost) {
    if (SOCIAL_UTM_SOURCE.test(campaign.utmSource) || campaign.clickId === "fbclid") return "Social Media";
    return campaign.utmSource ? "Referral" : "Direct";
  }
  if (SEARCH_HOST.test(refHost)) return "Organic Search";
  if (SOCIAL_HOST.test(refHost)) return "Social Media";
  return "Referral";
}
