# michael-lamidis-shop — Rebuild Plan

Honest assessment, no marketing voice. Read it once, then we work the phases.

---

## Why we're rebuilding

The current codebase has a working shell but a structural problem: every public
section component (Hero, Stats, About, ProductGallery, Testimonials, Services,
FAQ, LeadCapture, ContactSection, CategoryStrip, TrustBadges, Features) reads
hardcoded data from `lib/constants.ts`. The custom admin panel writes to
`data/site-content.json`, but only Navbar, Footer, `/products`, and
`/products/[id]` read from that file. The admin is a Potemkin village for
most fields.

You can wire each section through `useContent()` one by one — that's the cheap
fix — but it leaves three real problems standing:

1. **Custom auth (HMAC + plaintext password fallback)** is a ticking liability.
2. **JSON file storage** is fragile (we already lost data to a partial-write
   corruption today). It also can't run on Vercel's read-only filesystem,
   so you'd need MongoDB for production anyway.
3. **A bespoke admin UI** means every new content type costs a day of
   form-building. That work compounds badly as the site grows.

So we tear it out and use a real headless CMS instead. The public site stays
Next.js, Tailwind, and the visual design you already have. The admin and
storage layer get replaced.

---

## Stack pick — Payload CMS

I'm recommending **Payload** over Sanity, Strapi, and Contentful. Reasons:

- **Runs in the same Next.js process.** No separate service to deploy.
- **Open source, self-hosted.** Zero recurring SaaS fees.
- **TypeScript native** — collections become TS types automatically.
- **Uses MongoDB** (already in your dependencies) or Postgres.
- **Built-in admin UI** at `/admin` — no UI work needed.
- **Built-in auth** — bcrypt password hashing, role-based access, sessions,
  password reset, all out of the box.
- **Built-in upload handling** — local in dev, S3/Vercel Blob in production.

Sanity is the strongest alternative (better ecosystem, slicker editor), but
it's a separate hosted service, has a free-tier ceiling, and locks you into
their query language. Payload keeps everything in your repo.

If you want to pay for convenience instead: Sanity. If you want full control
in one codebase: Payload. We're going with Payload.

---

## What stays, what goes

### Keep
- Next.js 15 App Router
- Tailwind config and design tokens
- All public-route components (refactor, don't rewrite)
- `next.config.ts` images config (extend it)
- Vercel deployment target
- MongoDB Atlas (free tier)
- The visual design — Hero, sections, color scheme

### Replace
- `app/admin/**` — all custom admin pages → Payload Studio at `/admin`
- `app/api/admin/**` — custom REST handlers → Payload's auto-generated API
- `lib/admin-auth.ts` — HMAC cookies → Payload sessions
- `lib/db.ts`, `lib/models.ts` — ad-hoc mongoose → Payload collections
- `lib/site-content.ts`, `data/site-content.json` → Payload globals + collections
- `lib/leads.ts` → Payload Leads collection
- `lib/constants.ts` content arrays (`FEATURED_PRODUCTS`, etc.) → Payload data

### Tear out completely
- `v2-rebuild/` directory (already dead)
- `app/api/admin/upload/route.ts` — Payload handles uploads natively
- `.env.example` admin credentials — Payload manages users

---

## Phase order

Each phase is a focused chunk you can ship and demo. Don't skip ahead; the
order matters because later phases depend on earlier collection shapes.

### Phase 0 — Setup (1 hour)
- Create MongoDB Atlas cluster (free M0 tier is enough)
- Install Payload as a Next.js plugin: `pnpm dlx create-payload-app@latest --template website`
  into a sibling folder, cherry-pick the integration into this repo
- Wire `PAYLOAD_SECRET` and `MONGODB_URI` into `.env.local`
- Boot it locally, log in to the empty Payload admin at `/admin`

### Phase 1 — Business Identity (your priority) (1 day)
This is what you said you want first, so it goes here.

Collections / globals to define:
- **Global: BusinessInfo** — name, tagline, description, phone, email,
  address, hours, social links (FB/IG/YT)
- **Global: HomeHero** — badge, headline, subheadline, primary CTA, secondary
  CTA, background image
- **Global: AboutContent** — headline, subheadline, story paragraphs (array
  of rich text blocks)
- **Global: ContactInfo** — overlaps with BusinessInfo phone/email but adds
  a contact-page intro and map embed

Components to refactor (server-render, content as prop):
- `app/page.tsx` → fetch globals once, pass to `<Hero>` and `<ContactSection>`
- `app/about/page.tsx` → fetch `AboutContent`, pass to `<AboutContent>` block
- `app/contact/page.tsx` → fetch `ContactInfo`, pass down
- `components/layout/Navbar.tsx` + `Footer.tsx` → read from `BusinessInfo`
  via server-fetched props (drop the `useContent` hook for these — server
  fetching is cleaner)

Cut the legacy `ContentProvider` once these are migrated.

### Phase 2 — Products (1 day)
- **Collection: Products** — brand, model, slug, description, category, grade,
  salePrice, originalPrice, warranty, specs (array), images, badges, stock
  status. Slug auto-generated from brand+model.
- **Collection: ProductCategories** — name, slug, color tokens, icon.
- Wire `/products` and `/products/[id]` to query Payload collections (server
  components, no client `useContext`).
- Wire `<ProductGallery>` on the home page to a "featured" filter.
- Image uploads inline in the Payload admin — drag/drop, auto-resize.

### Phase 3 — Social proof (0.5 day)
- **Collection: Testimonials** — author name, role, quote, rating, photo,
  featured boolean.
- **Global: Stats** — customer count, brands count, savings range, cities.
- Wire `<Testimonials>` and `<Statistics>` to consume.
- `<TrustBadges>` becomes a Global with a list of partner logos.

### Phase 4 — Lead gen content (0.5 day)
- **Collection: Services** — name, description, icon, pricing tier.
- **Collection: FAQs** — question, answer (rich text), category, order.
- **Global: LeadCaptureSettings** — form intro copy, button text, success
  message, optional Resend integration toggle.
- Wire `<Services>`, `<FAQ>`, `<LeadCapture>`, `<CategoryStrip>`,
  `<Features>` to their content sources.

### Phase 5 — Blog + Leads inbox (0.5 day)
- **Collection: BlogPosts** — title, slug, author, date, hero image, body
  (Payload's lexical rich text editor), category, SEO override.
- **Collection: Leads** — replaces `lib/leads.ts`. Read-only writes from the
  public form; admins read + mark as contacted.
- Wire `/blog`, `/blog/[slug]`, and the public lead form.

### Phase 6 — SEO + Theme (0.5 day)
- **Global: SEO** — per-route title + description overrides.
- **Global: Theme** — primary color, accent color, heading font, body font.
  Inject as CSS variables at the root.
- Wire `app/layout.tsx` metadata generator and the theme CSS vars.

### Phase 7 — Production hardening (1 day)
- Set up Vercel project, connect to GitHub
- MongoDB Atlas connection string in Vercel env
- Vercel Blob storage for uploads (Payload has an adapter)
- Set up daily MongoDB backup (Atlas does this OOTB on M2+, M0 you script it)
- Add Sentry or similar for error monitoring
- Tighten Payload role-based access — `michael` is admin, anyone else gets
  read-only on collections they need to see
- Run Lighthouse, fix LCP image priority, font preloading, image sizes
- Add `localPatterns` to `next.config.ts` for the `?v=` query-string images
- Configure CSP headers in `vercel.json`

### Phase 8 — Cutover (0.5 day)
- Delete `app/admin/**` (the custom one), `app/api/admin/**`,
  `lib/admin-auth.ts`, `lib/site-content.ts`, `lib/leads.ts`,
  `lib/content-context.tsx`, `lib/models.ts`, `data/site-content.json`,
  `v2-rebuild/`
- Strip content arrays from `lib/constants.ts` — keep only true constants
  (SITE_URL, theme defaults that never change)
- Update DEPLOY.md
- Final smoke test in production
- Hand the admin panel to Michael, show him how to edit Hero copy

**Total: ~5.5 working days** if you stay focused. Likely 7-8 calendar days
once you account for blockers.

---

## Migration strategy for existing data

`data/site-content.json` has 7 products and your edited business info. We
don't lose that. Phase 0 includes a one-shot seed script:

```ts
// scripts/migrate-from-json.ts
import payload from "payload";
import data from "../data/site-content.json";

await payload.init({ /* ... */ });
await payload.updateGlobal({ slug: "business-info", data: data.business });
await payload.updateGlobal({ slug: "home-hero",     data: data.hero });
await payload.updateGlobal({ slug: "about-content", data: data.about });
await payload.updateGlobal({ slug: "stats",         data: data.stats });
for (const p of data.products) {
  await payload.create({ collection: "products", data: p });
}
```

Run it once after Phase 2's collections are defined. Old JSON file gets
deleted in Phase 8.

---

## What this gets you

- A real CMS at `/admin` with proper auth, file uploads, and rich editing
- All public content editable from one place — no more "I have to deploy
  to change the phone number"
- TypeScript types auto-generated from your CMS schema
- No JSON corruption risk — MongoDB is transactional
- Faster page loads — server-rendered with proper caching, not client-side
  context juggling
- A single place to add a new content type when the business grows

---

## What this does NOT get you

- A new visual design. The CSS stays. If you want a design refresh, that's a
  separate engagement.
- A way around having to host MongoDB. It's free tier on Atlas, but if your
  client wants their own data, they'll need an Atlas account.
- Magic. Every collection field still has to be defined by hand once.

---

## When you come back

Open a new session. Reference this document. We start with Phase 0. Have
your MongoDB Atlas account ready and a fresh Vercel project linked to this
repo. I'll drive each phase end-to-end, not bug-by-bug.

Phases 1 and 2 are where you'll start seeing real wins. Phase 1 is the one
you specifically asked for — business identity editable in 1 working day.
