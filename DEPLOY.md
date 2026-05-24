# Deploy to Vercel — Pilot Guide

Repo: **pauldevstudio/michael-lamidis-shop** (already on GitHub).

---

## What works on Vercel out of the box

The **public site is 100 % functional** for the pilot:

- Homepage with the appliance lineup hero image
- All pages: about, services, contact, faq, testimonials, blog, products
- Bilingual EN/GR with persistent localStorage preference
- Admin login page + dashboard (view-only without MongoDB)
- 8 seeded products visible on `/products`

## What is limited on Vercel (and how to enable)

Vercel's filesystem is read-only at runtime, so two things need external storage:

| Feature                  | On Vercel without setup | How to enable                                  |
|--------------------------|-------------------------|------------------------------------------------|
| Admin content edits      | Returns clear error     | Add `MONGODB_URI` env var (MongoDB Atlas free) |
| Admin image uploads      | Returns 501             | Add Vercel Blob + small code change            |
| Contact / Lead forms     | Success state, no email | Add `RESEND_API_KEY` later                     |

The site looks and feels finished for pilot users — only saving admin edits is blocked until storage is wired.

---

## Deploy in 4 steps

### 1 — Push current code

```bash
cd C:\Users\IDSIGN\Desktop\claude\session\michael-lamidis-shop
git add .
git commit -m "Pre-pilot: bilingual nav, admin grid, env-driven secrets"
git push origin main
```

### 2 — Create Vercel project

1. Open **https://vercel.com/new**
2. **Import Git Repository** → `pauldevstudio/michael-lamidis-shop`
3. Framework: Next.js (auto-detected). Leave build settings at defaults.
4. **Don't deploy yet** — set env vars first.

### 3 — Set environment variables

In Vercel project → **Settings → Environment Variables**:

| Name             | Value                                              | Required |
|------------------|----------------------------------------------------|----------|
| `ADMIN_USERNAME` | a username you choose                              | ✅       |
| `ADMIN_PASSWORD` | a strong password (do NOT reuse `Lamidis@2026`)   | ✅       |
| `ADMIN_SECRET`   | 64-char hex string (see below)                     | ✅       |
| `MONGODB_URI`    | from MongoDB Atlas — only if you want admin edits  | optional |

**Generate `ADMIN_SECRET`:**

```bash
# any Mac / Linux / WSL terminal
openssl rand -hex 32

# Windows PowerShell
-join ((1..32 | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) }))
```

### 4 — Deploy

Click **Deploy** in Vercel. First build is ~90 seconds. You get a URL like `michael-lamidis-shop.vercel.app`.

---

## Smoke test after deploy

1. ✅ Homepage loads with the appliance lineup image
2. ✅ Click `ΕΛ` in the navbar → whole page in Greek
3. ✅ Click the gold **Admin** button (top-right) → login page
4. ✅ Log in with the env-var credentials → admin dashboard
5. ✅ `/admin/products` → 8 products show in card grid with prices, View/Edit
6. ❌ Editing a price returns "Set MONGODB_URI" until step below — **expected**

---

## Enable admin edits (5 min) — MongoDB Atlas

1. Sign up at **https://www.mongodb.com/cloud/atlas** (free)
2. Create a cluster (the free **M0** tier is fine)
3. **Network Access** → Add IP → `0.0.0.0/0` (Vercel IPs rotate)
4. **Database Access** → Create user with read/write
5. **Connect** → **Drivers** → copy the connection string. Looks like:
   `mongodb+srv://USER:PASS@cluster.mongodb.net/?retryWrites=true&w=majority`
6. In Vercel project → Environment Variables → Add `MONGODB_URI` = that string
7. **Deployments** → click the latest deployment → **Redeploy**

After this, every admin edit (price, product, category rename, featured star) persists. The next deploy seeds the DB from `data/site-content.json`.

## Enable image uploads (5 min) — Vercel Blob

1. Vercel project → **Storage** tab → **Create Database** → **Blob**
2. Vercel auto-adds `BLOB_READ_WRITE_TOKEN` to your env vars
3. Ask Claude to update `app/api/admin/upload/route.ts` to use `@vercel/blob` (small change)

---

## Custom domain (optional)

Vercel project → **Settings → Domains** → add your domain (e.g. `michaellamidis.com.cy`). Vercel shows the DNS records to copy into your registrar.

DNS propagation: 5–30 minutes.

---

## Security notes

- The fallback admin password `Lamidis@2026` in the code is **only used in local dev**. In production it's overridden by the `ADMIN_PASSWORD` env var.
- Same for `ADMIN_SECRET` — the hardcoded fallback is for dev; production uses your env var.
- `.gitignore` is now correct — `node_modules`, `.next`, `.env*`, `data/site-content.json` and `public/uploads/*` are excluded.
