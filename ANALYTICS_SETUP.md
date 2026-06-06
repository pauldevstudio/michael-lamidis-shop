# Analytics Setup — Michael Lamidis

This site ships with a complete analytics layer (GTM + GA4 + Microsoft Clarity)
and an **Admin → Analytics** dashboard. Everything is **off by default** and
loads only when you provide IDs, so there is zero performance cost until you
opt in.

---

## 1. What's already built (no code changes needed)

| Piece | File | Behaviour |
|---|---|---|
| Tag loader | `components/shared/Analytics.tsx` | Injects GTM, GA4, Clarity — each gated behind its own env var |
| Auto event tracking | `components/shared/AutoTrack.tsx` | One delegated listener fires events for phone / email / WhatsApp / product / outbound / CTA clicks + SPA page views — no need to edit components |
| Event helper | `lib/analytics.ts` | `track()` + `analytics.*` wrappers; consistent event names |
| Dashboard data | `lib/analytics-data.ts` | Pulls GA4 Data API when configured, else realistic **sample** data |
| Dashboard API | `app/api/admin/analytics/route.ts` | Session-gated `GET /api/admin/analytics?range=` |
| Dashboard UI | `app/admin/analytics/*` | Visitor overview, traffic, top pages, devices, locations, click tracking, funnel, entry/exit |

---

## 2. Go live in 3 steps

### Step A — Client tags (visitor data → GA4 / Clarity)
Set these in **Vercel → Project → Settings → Environment Variables** (Production):

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX      # preferred: GA4 lives inside the container
# or, without GTM:
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx   # Microsoft Clarity project id
```

- **GA4:** create a property at analytics.google.com → Admin → Data Streams → Web → copy the `G-` Measurement ID.
- **GTM:** create a container at tagmanager.google.com → copy the `GTM-` ID → inside GTM add a **GA4 Configuration** tag with your Measurement ID, triggered on All Pages.
- **Clarity:** create a project at clarity.microsoft.com → Settings → copy the project ID. Heatmaps + session replay appear in the Clarity dashboard.

### Step B — Custom conversion events in GTM
`AutoTrack` already pushes these to `dataLayer`. In GTM, create a
**Custom Event** trigger for each, and a **GA4 Event** tag that forwards it:

| dataLayer event | Meaning | Mark as GA4 key event (conversion) |
|---|---|---|
| `phone_click` | tapped a phone number | ✅ |
| `whatsapp_click` | tapped WhatsApp | ✅ |
| `email_click` | tapped an email | ✅ |
| `cta_click` | clicked any `[data-cta]` button | — |
| `product_click` | clicked a product → details | — |
| `generate_lead` | submitted a lead form | ✅ |
| `contact_form_submit` | submitted the contact form | ✅ |
| `outbound_click` | clicked an external link | — |
| `search` | used site search (when added) | — |

> To tag any button as a CTA without code changes elsewhere, add
> `data-cta="Get a Quote"`. For a custom event use `data-track="event_name"`.

### Step C — Live numbers in the Admin dashboard (GA4 Data API)
The dashboard shows **sample data** until you connect a service account. To show
live data, set (Production env, server-only — do **not** prefix with `NEXT_PUBLIC`):

```
GA4_PROPERTY_ID=123456789
GA4_CLIENT_EMAIL=analytics-reader@your-project.iam.gserviceaccount.com
GA4_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

How to get them:
1. Google Cloud Console → create a **Service Account** → create a JSON key.
2. In GA4 → Admin → Property Access Management → add the service-account email as **Viewer**.
3. Find the numeric **Property ID** in GA4 → Admin → Property Settings.
4. Paste the JSON key's `client_email` and `private_key` into the env vars
   (keep the `\n` escapes in the private key).

Once set, the dashboard banner disappears and KPIs/charts show real GA4 figures.
If the API call fails for any reason it falls back to sample data with a note —
it never errors the page.

---

## 3. Cost & maintenance
- GA4, GTM, and Microsoft Clarity are **free**.
- No paid dependencies were added; charts are hand-built SVG/CSS.
- The GA4 Data API has a generous free quota, far beyond this site's volume.
