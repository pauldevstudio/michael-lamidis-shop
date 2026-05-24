# Michael Lamidis Shop — v2 Rebuild

Clean rebuild of the Cyprus open-box appliance storefront. Zero legacy code.

## Stack

- **Next.js 15** App Router, **React 19**, **TypeScript** (strict)
- **Tailwind CSS** for styling
- **MongoDB** + **Mongoose** for persistence
- **NextAuth v5** (credentials) for admin auth
- **Zod** for runtime validation
- **axios** for client calls
- **zustand** available for future client state

## Quick start

```bash
cp .env.example .env.local
# set MONGODB_URI, AUTH_SECRET (openssl rand -base64 32),
# ADMIN_BOOTSTRAP_EMAIL, ADMIN_BOOTSTRAP_PASSWORD

npm install
npm run seed     # creates admin user + site content + 2 demo products
npm run dev
```

Public site: <http://localhost:3000>
Admin login: <http://localhost:3000/login>

## Folder structure

```
app/
  (public pages)        page.tsx, products/, login/, not-found.tsx
  admin/                layout (auth-gated) + dashboard, products, content, leads
  api/
    auth/[...nextauth]  NextAuth handler
    products/           GET (list), POST (create), [id] GET/PUT/DELETE
    content/            GET (public), PUT (admin)
    leads/              POST (public)
    upload/             POST (admin) — local disk uploader
    chat/               POST stub (replace with real LLM)

components/
  ui/                   Button, Input, Textarea, Badge, Container
  layout/               Header, Footer, Logo, MobileMenu, nav-links
  sections/             Hero, Stats, FeaturedProducts, AboutBlurb
  products/             ProductCard, ProductGrid, ProductGallery,
                        ProductSpecs, ProductFilters, InquiryForm
  admin/                Sidebar, AdminHeader, LoginForm,
                        ProductForm, ContentForm
  chatbot/              ChatBot

lib/                    db, auth, content, products, validation,
                        api, http, utils
models/                 Product, User, Content, Lead   (Mongoose)
hooks/                  useChat
types/                  Application-wide TS types
middleware.ts           Protects /admin
scripts/seed.ts         Bootstrap admin + content + sample products
```

## Architecture principles

| Rule | How it's enforced |
|---|---|
| One component, one purpose | Each file exports a single component |
| No file > 200 lines | Largest: `ProductForm.tsx` at 174 lines |
| No business logic in UI | `lib/products.ts`, `lib/content.ts`, `lib/auth.ts` own DB/auth concerns |
| Runtime + compile-time validation | Zod schemas in `lib/validation.ts` are used in every mutating API route |
| Reusable primitives | All buttons/inputs/badges live in `components/ui/` |
| Strict TypeScript | `tsconfig.json` has `"strict": true` |
| Folder cohesion | Every folder has a single, named responsibility (see table above) |

## Admin workflow

1. Visit `/login`, sign in with bootstrap credentials.
2. **Dashboard** shows product / lead counts.
3. **Products** — list, create (`/admin/products/new`), edit (`/admin/products/[id]`). Form covers price, original price, stock, condition, images (one URL per line), featured flag, visibility.
4. **Content** — edit business info, hero copy, about copy. Saves to a singleton `Content` document.
5. **Leads** — view newest inquiries (read-only).

## API surface

| Verb | Path | Auth | Body |
|---|---|---|---|
| GET | `/api/products` | public | — |
| POST | `/api/products` | admin | `productSchema` |
| GET | `/api/products/:id` | public | — |
| PUT | `/api/products/:id` | admin | `productSchema.partial()` |
| DELETE | `/api/products/:id` | admin | — |
| GET | `/api/content` | public | — |
| PUT | `/api/content` | admin | `contentSchema` |
| POST | `/api/leads` | public | `leadSchema` |
| POST | `/api/upload` | admin | `FormData(file)` |
| POST | `/api/chat` | public | `{ message }` |

All responses follow `{ ok: boolean, data?: T, error?: string }`.

## Deployment notes

- Set `AUTH_URL` to the deployed origin so NextAuth callbacks resolve correctly.
- Image uploads currently go to `/public/uploads`. Swap `app/api/upload/route.ts` for S3 / Vercel Blob / R2 in production — `public/` is not writable on serverless platforms.
- Chatbot route is a stub; wire it to your LLM provider of choice.
- `revalidate = 60` on the home and product pages — adjust to taste.

## What was deliberately not migrated

The legacy project had: i18n, framer-motion animations, cart context, KV-backed leads, a custom ad-hoc admin auth, file-based content (`data/site-content.json`), and several marketing pages (about/blog/faq/services/testimonials). They were intentionally dropped to ship a clean foundation. Add them back as discrete features once the core CMS + product flow is solid.
