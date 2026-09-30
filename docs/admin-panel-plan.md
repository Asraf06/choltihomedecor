# Cholti Home Decor — Admin Panel Build Plan (build later, all together)

> Status: PLAN ONLY. No admin code yet. Public site already reads hero from
> `src/lib/hero.ts` (`HERO_STYLE` + `BANNER_SLIDES`) so the admin panel will
> just become a UI + DB on top of that config shape.

## 1. Goal (v1)

Owner can, without touching code:
1. Switch hero style: `banner` (full-width ads slider) ↔ `boxed` (contained rounded box).
2. Manage banner slides: add / edit / hide / delete / reorder / schedule.
3. Manage products, categories, reviews, site settings (WhatsApp number, hotline, announcement).
4. Upload banner/product images safely.

Out of scope v1: online payment, customer accounts, order DB (orders go via WhatsApp, only logged).

## 2. Tech choices (Next.js 16, matches current stack)

- App Router route group: `src/app/(admin)/admin/*` (separate layout, no shop header/footer).
- Auth: middleware-protected `/admin/*`. Single owner login: `ADMIN_PASSWORD_HASH` (scrypt) in env + signed httpOnly session cookie, 12h expiry, rate-limit login (5 tries / 10 min / IP). No next-auth needed for single admin.
- DB: SQLite + Prisma for local/dev now; Postgres (same Prisma schema) when deploying. All reads via cached queries.
- Images: upload to `public/uploads/` now (type allowlist jpg/png/webp, ≤2MB, server-side magic-byte check, random filename, no SVG). Later: S3/R2 + `next/image` remote pattern.
- Validation: zod on every server action (same as checkout `CheckoutSchema` pattern).
- Rendering: public hero/products fetch from DB with `revalidate = 300` (ISR); DB empty → fallback to `src/lib/hero.ts` + `src/lib/data.ts` defaults so site never breaks.

## 3. Data models (Prisma sketch)

```prisma
model HeroConfig {
  id    Int    @id @default(1)
  style String @default("banner") // "banner" | "boxed"
}

model HeroSlide {
  id        String    @id @default(cuid())
  titleBn   String
  titleEn   String
  subBn     String    @default("")
  subEn     String    @default("")
  eyebrowBn String    @default("")
  eyebrowEn String    @default("")
  ctaBn     String    @default("এখনই অর্ডার করুন")
  ctaEn     String    @default("Order Now")
  link      String    @default("#products")
  image     String                 // /uploads/xxx.webp
  theme     String    @default("clay") // clay | forest | cocoa
  badge     String    @default("")
  sortOrder Int       @default(0)
  active    Boolean   @default(true)
  startsAt  DateTime?
  endsAt    DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Product   { /* slug unique, nameBn/En, priceOld/Now, cat, rating, images[], badge, active, sortOrder */ }
model Category  { /* id, nameBn/En, image, count label, sortOrder, active */ }
model Review    { /* name, area, textBn/En, rating, verified, active */ }
model SiteSetting { key String @id, value String } // waNumber, hotline, email, announcementBn/En
```

## 4. Admin pages

- `/admin/login` — password only, rate-limited, generic error message (no user enumeration).
- `/admin` — dashboard: counts (products/slides/reviews), quick links, last-updated stamps.
- `/admin/hero` — style radio cards (live preview thumbnails of both styles) + slides table:
  table columns: thumb | title | theme | schedule | active toggle | sort ↑↓ | edit | delete.
  slide form: bilingual fields with tabs (বাংলা/EN), image uploader with preview, theme picker, CTA+link, schedule datetime, active switch. Live preview pane on the right reusing the real `<BannerHero>` component with draft data.
- `/admin/products`, `/admin/categories`, `/admin/reviews` — same table+form pattern.
- `/admin/settings` — WhatsApp number (validated `8801XXXXXXXXX`), hotline, email, announcement bar text; "Reset to defaults" with confirm.

## 5. API / server actions

- All mutations = server actions under `src/app/(admin)/admin/_actions/*`, each: `auth()` check → zod parse → DB write → `revalidatePath("/")`.
- `uploadImage` action: size/type/magic-byte checks, sharp → webp max 1600px, save `public/uploads/`, return path. Delete action removes file (only if unreferenced).
- Public readers: `src/lib/hero-db.ts` — `getHeroConfig()` + `getActiveSlides()` (filters active + schedule window, sorts by sortOrder), fallback to static config on DB error/empty.

## 6. Security checklist (must, before going live)

- [ ] Middleware auth on `/admin/:path*` + API; session cookie httpOnly, Secure, SameSite=Lax.
- [ ] Login rate limit + constant-time hash compare.
- [ ] Zod on all inputs; URL fields allowlist (`#products`, `/product/*`, `https://wa.me/*` only).
- [ ] Upload: allowlist + magic bytes + size cap + random names + no SVG/HTML; serve with `X-Content-Type-Options: nosniff`.
- [ ] Keep existing security headers; extend CSP `img-src` for `/uploads/` (same-origin, already covered).
- [ ] No secrets in client components; env validated at boot with zod.
- [ ] Audit log table (who changed what, when) — simple append-only.

## 7. Milestones (build together later)

- M1: Prisma schema + SQLite + seed from current static data + middleware auth + admin layout/login.
- M2: Hero manager (style switch + slides CRUD + upload + live preview) + public hero DB wiring + fallback.
- M3: Products/categories/reviews managers + public wiring.
- M4: Settings + audit log + Postgres switch guide + production deploy checklist.

## 8. Open questions (decide at build time)

1. Deploy target: same VPS (SQLite ok) vs Vercel/Netlify (needs Postgres + R2)?
2. More than one admin user, or single owner forever?
3. Banner auto-expiry indication on public site ("Offer ends in X days") — wanted?
