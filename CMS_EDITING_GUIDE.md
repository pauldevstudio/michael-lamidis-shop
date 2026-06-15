# CMS editing guide — Michael Lamidis Shop

You log in at: **http://localhost:3000/cms**
Credentials: see `cms-creds.txt` on your Desktop.

There are 4 things you can edit, all from the left sidebar. Order suggested.

---

## 1. Business Info  (Globals -> Business Info)

Edits propagate to: Navbar phone (top right) and Footer.

| Field        | What to put                                          |
|--------------|-------------------------------------------------------|
| Name         | Michael Lamidis                                      |
| Tagline      | Open Box. Open Savings.                              |
| Description  | One-sentence pitch, used in social shares and meta   |
| Phone        | Real shop phone number, with country code            |
| Email        | Real shop email                                      |
| Address      | Limassol showroom street + city                      |
| Hours        | e.g. "Mon-Sat: 09:00 - 20:00"                        |
| Social.Facebook  | https://facebook.com/...                         |
| Social.Instagram | https://instagram.com/...                        |
| Social.YouTube   | https://youtube.com/@...                         |

Click **Save** when done.
Verify: open http://localhost:3000/ - top right of the navbar shows your phone.

---

## 2. Home Hero  (Globals -> Home Hero)

Edits propagate to: the big hero on the home page.

| Field             | What to put                                         |
|-------------------|------------------------------------------------------|
| locationLabel     | "Limassol, Cyprus"                                  |
| badge             | "Certified Open Box Quality"                        |
| headline          | Two lines, separated by a line break in the textarea. First line is white, second line is gold/blue accent. Example: |
|                   | `Premium Home Appliances` newline `in Limassol, Cyprus` |
| subheadline       | One-liner under the headline. e.g. "Refrigerators, Washing Machines, Ovens & More - Designed for Style and Performance" |
| primaryCtaLabel   | "Browse Products"                                   |
| primaryCtaHref    | "/products"                                         |
| secondaryCtaLabel | "View Collection"                                   |
| secondaryCtaHref  | "/products"                                         |

Click **Save**.
Verify: http://localhost:3000/ - check the hero text matches.

---

## 3. About Page  (Globals -> About Page)

Edits propagate to: the hero and story section at /about.

| Field        | What to put                                          |
|--------------|-------------------------------------------------------|
| Headline     | The big H1 at the top of /about. e.g. "Redefining how Cyprus buys appliances" |
| Subheadline  | The subtitle right below. One sentence about what you do. |
| Story        | Array of paragraphs. Click "Add Paragraph". Each paragraph is its own text block in the story section. Start with 3 paragraphs - origin, mission, today. |

Click **Save**.
Verify: http://localhost:3000/about - headline + story paragraphs reflect.

---

## 4. Products  (Collections -> Products)

This is the only collection (multiple documents).

### 4a. Clean up the zombies first.
You have 4 broken docs from an earlier session (the "<No Model>" rows).
Click each one in the Products list, scroll to the bottom of its edit page,
look for a **Delete** button. If Delete is missing on a row, that doc is
hidden from the public site anyway (the overlay filters it out) so leave it.

### 4b. Add real products.
For each product Michael actually sells, click **Create New** at the top of
the Products list and fill in:

| Field         | What to put                                          |
|---------------|-------------------------------------------------------|
| Brand         | e.g. Samsung, Bosch, LG, Miele                       |
| Model         | Exact model number, e.g. RS68A8820WW                 |
| Category      | Pick from the dropdown                               |
| Sale Price    | The current open-box price                           |
| Original Price| The original retail price                            |
| Savings       | Leave blank - auto-calculated from the two prices    |
| Grade         | A, A+, B, etc.                                       |
| Warranty      | In months. Default 12.                               |
| Description   | 1-2 sentences. Shown in card and detail page.        |
| Image URL     | Full URL to a hosted image, or /uploads/... path     |
| Colour From / To | Hex colours used for the card accent gradient    |
| Specs         | Array. Click "Add Spec". Each is label + value, e.g. "Capacity": "300L" |

Click **Save**.
Verify: http://localhost:3000/products - product appears in the grid.
       http://localhost:3000/products/<auto-id> - detail page works.

---

## What is NOT in the CMS yet  (Phase 1 follow-ups)

These still read from `lib/constants.ts` and are NOT editable in the CMS yet:

- /contact - all copy and form labels
- Home page: Stats (5000+ customers), Services list, Testimonials, FAQ, ProductGallery section, CategoryStrip, Features
- /services, /testimonials, /faq, /blog pages
- Theme colours, font choices
- SEO per-route titles and meta descriptions

Adding any of these is mechanical, same pattern as the four above. Roughly
20-30 minutes per area. Open a fresh session with Linus, point at
`REBUILD_PLAN.md`, and pick the next one.

---

## Production gotchas - do these before shipping to a public URL

1. Rotate the database password again (it's in chat logs).
2. Rotate `PAYLOAD_SECRET` - generate a fresh 64-hex via:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Change the legacy `ADMIN_PASSWORD` (still used by the old /admin routes
   we haven't removed yet).
4. Change the CMS user password (currently `Lamidis-CMS-Dev-2026!` which is
   in chat logs and on cms-creds.txt).
5. Whitelist your production IP (or 0.0.0.0/0) in Atlas Network Access.
6. Set DATABASE_URI and PAYLOAD_SECRET as env vars on Vercel.
7. Remove the temporary `dns.setServers(["8.8.8.8", "1.1.1.1"])` block at
   the top of `payload.config.ts` - it was for your local IPv6 problem,
   not needed on Vercel.
