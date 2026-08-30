# Thu Tech com — CMS Platform

Thu Tech com has been upgraded from a static HTML site into a full CMS-driven
platform: a Node.js/Express + PostgreSQL backend, a secure Admin Dashboard,
and the original public website — now powered by the database instead of a
hard-coded `content.js` file.

> **The company owner can now manage every piece of content — services,
> projects, products, blog posts, careers, team, testimonials, FAQs, company
> info — from `/admin`, without touching HTML, CSS, or JavaScript.**

---

## 1. Final Project Structure

```
thutechcom-platform/
├── public/                    Public website (served at "/")
│   ├── index.html, about.html, services.html, service-detail.html,
│   │   solutions.html, projects.html, project-detail.html,
│   │   products.html, careers.html, career-detail.html,
│   │   blog.html, blog-post.html, contact.html, support.html, 404.html
│   ├── admin.html             → redirects to /admin/login.html (legacy URL)
│   ├── css/style.css          Design system (unchanged from v1)
│   ├── js/
│   │   ├── api-client.js      NEW — fetches live content from the API
│   │   ├── content.js         OLD static data — kept only as historical
│   │   │                        reference / migration source, no longer loaded
│   │   ├── components.js      Navbar/footer (now async, awaits API data)
│   │   └── main.js            Interactions (forms now call the real API)
│   ├── assets/, robots.txt, sitemap.xml (sitemap.xml is now also
│   │                                     generated dynamically — see below)
│
├── admin/                     Admin Dashboard (served at "/admin", auth-gated)
│   ├── login.html, index.html, resource.html, media.html,
│   │   messages.html, support.html, applications.html, settings.html
│   ├── css/admin.css
│   └── js/api.js, layout.js, resource-crud.js
│
├── server/                    Backend
│   ├── package.json, .env.example
│   ├── uploads/                Locally stored media (gitignored)
│   └── src/
│       ├── index.js            App entry point — wires everything together
│       ├── config/db.js         PostgreSQL connection pool
│       ├── config/resources.js  ⭐ Single source of truth: every CMS
│       │                          resource's DB columns + admin form fields
│       ├── controllers/genericCrud.js  Shared CRUD logic (DRY)
│       ├── middleware/auth.js, upload.js, errorHandler.js
│       ├── routes/              auth, admin resources, settings, dashboard,
│       │                        media, messages, support, applications,
│       │                        public (read API + submissions), sitemap
│       ├── db/schema.sql        Full PostgreSQL schema
│       ├── db/migrate.js        Runs schema.sql
│       ├── db/seed-admin.js     Creates the first Super Admin
│       ├── db/legacy-content.js       Node-compatible copy of old content.js
│       ├── db/seed-migrate-content.js Imports legacy-content.js → database
│       ├── db/export-content.js       Admin "Export Content" backup
│       └── utils/helpers.js
│
├── docker-compose.yml          Optional local PostgreSQL container
├── .gitignore
└── README.md                   This file
```

---

## 2. Database Schema

See `server/src/db/schema.sql` for the full, authoritative definition. Summary:

| Table | Purpose |
|---|---|
| `users` | Admin accounts (roles: `super_admin`, `content_manager`, `hr_manager`, `support_manager`) |
| `company_settings` | Singleton row — company info, contact, socials, SEO defaults |
| `stats`, `company_values`, `why_choose_us`, `process_steps` | Small structured "page content" blocks (Home/About) |
| `services` | Services (slug, icon, problems/provide/benefits/FAQs as JSONB, SEO fields, draft/published) |
| `solutions` | Solutions grouped by customer type |
| `projects` | Portfolio items (gallery, case study, results, featured flag) |
| `products` | Thu Tech com's own products |
| `team_members`, `testimonials`, `clients` | People / social proof |
| `careers` | Job postings |
| `job_applications` | Submitted applications (status pipeline, private resume URL) |
| `blog_categories`, `blog_posts` | Blog CMS (rich-text content, tags, SEO, featured) |
| `faqs` | FAQs (general or scoped to a service) |
| `support_options` | The 4 cards on the Support page |
| `contact_messages` | Contact form submissions |
| `support_requests` | Support form submissions |
| `media` | Uploaded file/image library |

Every content table has `created_at`/`updated_at` (auto-maintained via
triggers), most have `status` (`draft`/`published`) and `sort_order` for
manual ordering (via the API's `/reorder` endpoint), and slugs are
unique-indexed for clean URLs.

---

## 3. Environment Variables

Copy `server/.env.example` to `server/.env` and fill in real values. Key variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Long random string signing admin session tokens (`openssl rand -hex 32`) |
| `COOKIE_SECURE` | Set `true` in production (HTTPS only) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Used once by `npm run db:seed:admin` |
| `STORAGE_DRIVER` | `local` (default) — swap to `s3` later by extending `middleware/upload.js` |
| `SMTP_*` | Optional — enables email notifications for new contact/support submissions |

**Never commit the real `.env` file.**

---

## 4. Setup Instructions (Local Development)

**Requirements:** Node.js 18+, PostgreSQL 14+ (or Docker).

```bash
# 1. Start PostgreSQL (skip if you already have one running)
docker compose up -d

# 2. Install backend dependencies
cd server
npm install

# 3. Configure environment
cp .env.example .env
# edit .env — set DATABASE_URL, JWT_SECRET, SEED_ADMIN_EMAIL/PASSWORD

# 4. Create the database schema
npm run db:migrate

# 5. Create your Super Admin account
npm run db:seed:admin

# 6. Import the original static content into the database
npm run db:seed:content
#   (equivalent shortcut for steps 4–6: npm run db:setup)

# 7. Start the server
npm run dev
```

Then open:
- **Public website:** http://localhost:4000/
- **Admin dashboard:** http://localhost:4000/admin/login.html

> ⚠️ **A note on this delivery:** this sandbox environment has no outbound
> network access, so `npm install` and a live PostgreSQL connection could
> not be executed here to run an end-to-end test. Every file has been
> written carefully and syntax-checked (`node --check` on every `.js` file,
> plus a cross-check that all `require()` paths resolve and that every
> admin form field name matches its backend route). You should run the
> steps above yourself before deploying — see the **Testing Checklist**
> below for what to verify.

---

## 5. Admin Login / Setup

1. Run `npm run db:seed:admin` (uses `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`,
   `SEED_ADMIN_PASSWORD` from `.env`). Re-running it is safe — it updates
   the existing account instead of duplicating it.
2. Go to `/admin/login.html` and log in with that email/password.
3. To add more admin accounts (Content Manager, HR Manager, Support
   Manager), currently the cleanest path is a one-off SQL insert or a small
   script modeled on `seed-admin.js` — a full "Manage Admin Users" screen
   is a natural next addition (see Limitations below).

Roles and what they can access:

```
super_admin      → everything
content_manager  → Company Settings, Services, Solutions, Projects,
                    Products, Team, Testimonials, Clients, Blog, FAQs, Media
hr_manager       → Careers, Job Applications
support_manager  → Contact Messages, Support Requests
```

Every permission check happens **server-side** (`middleware/auth.js` +
`requireResource()` on every route) — the sidebar simply hides links a
role can't use; it is never the actual security boundary.

---

## 6. Migration Instructions

The original `public/js/content.js` data was captured into
`server/src/db/legacy-content.js` (a Node-compatible copy) and is imported
by:

```bash
cd server
npm run db:seed:content
```

This is **safe to re-run** — services/solutions/projects/products/careers/
blog posts are upserted by slug (`ON CONFLICT (slug) DO UPDATE`), so
running it twice won't create duplicates. After this runs once, **the
database is the source of truth** — further edits should go through
`/admin`, not by re-running the migration.

---

## 7. Backup / Export

`Admin → Company Settings → Export Content (JSON)` downloads a full JSON
snapshot of every content table (also runnable directly: `npm run db:export`
from `server/`, which writes `server/content-export-<timestamp>.json`).

For a full database backup (recommended on a schedule in production), use
standard PostgreSQL tooling:

```bash
pg_dump "$DATABASE_URL" -Fc -f thutechcom-backup.dump
# restore with:
pg_restore -d "$DATABASE_URL" thutechcom-backup.dump
```

---

## 8. Deployment Instructions

1. Provision a PostgreSQL database (Supabase, Neon, RDS, or self-hosted).
2. Deploy the `server/` app to any Node host (Railway, Render, Fly.io, a
   VPS with PM2, etc). It serves the API **and** the `public/` + `admin/`
   static folders — there is nothing else to deploy separately.
3. Set all environment variables from `.env.example` on the host,
   with `NODE_ENV=production`, `COOKIE_SECURE=true`, and a real `APP_URL`.
4. Run `npm run db:migrate && npm run db:seed:admin` against the
   production database (then `db:seed:content` once, if migrating from
   the static site).
5. Point your domain's DNS at the host; put the app behind HTTPS
   (via the host's load balancer, or a reverse proxy like Caddy/Nginx +
   Let's Encrypt).
6. For file uploads at scale, swap `STORAGE_DRIVER=local` for an S3-based
   implementation in `server/src/middleware/upload.js` (the interface —
   `fileUrl()` / multer storage — is isolated there specifically so this
   swap doesn't touch any route code).

---

## 9. Files Created / Modified

**New — Backend (all of `server/`):** ~25 files — Express app, PostgreSQL
schema, migrations, seed scripts, generic CRUD controller, resource
registry, auth/upload/error middleware, and every API route file.

**New — Admin Dashboard (all of `admin/`):** login, dashboard, generic
resource manager, media library, messages, support requests, applications,
settings — plus shared `api.js` / `layout.js` / `resource-crud.js`.

**New — Public site additions:**
`public/js/api-client.js`, `public/project-detail.html`,
`public/career-detail.html`.

**Modified — Public site:**
`public/js/components.js` (async content loading), and every page
(`index.html`, `about.html`, `services.html`, `service-detail.html`,
`solutions.html`, `projects.html`, `products.html`, `careers.html`,
`blog.html`, `blog-post.html`, `contact.html`, `support.html`) — swapped
`js/content.js` → `js/api-client.js`, wrapped rendering in a
`site-content-ready` event listener, switched internal links to clean CMS
URLs (`/services/:slug`, `/projects/:slug`, `/blog/:slug`,
`/careers/:slug`), and wired the Contact/Support/Careers forms to real API
calls instead of client-only fake success states.

**Retired:** `public/admin.html` (old client-only content editor) now
redirects to `/admin/login.html`. `public/js/content.js` is kept
unmodified as a historical/migration reference but is no longer loaded by
any page.

**Unchanged:** `public/css/style.css`, `public/js/main.js` (still powers
scroll-reveal, accordions, filters, toasts), all visual design/branding,
`public/404.html`.

---

## 10. Testing Checklist

Run through this after `npm install` + database setup, before considering
the platform production-ready:

- [ ] `npm run db:migrate` completes with no errors
- [ ] `npm run db:seed:admin` creates the account; you can log in at `/admin/login.html`
- [ ] `npm run db:seed:content` imports all legacy content without errors; re-running it doesn't duplicate rows
- [ ] Visiting `/admin` while logged out redirects to `/admin/login.html`
- [ ] Calling an `/api/admin/*` route without a session returns `401`
- [ ] A `content_manager` account cannot reach Careers/Applications/Support endpoints (`403`)
- [ ] Create/edit/delete works for: Services, Projects, Products, Team, Testimonials, Clients, Careers, Blog Posts, Blog Categories, FAQs, Solutions, Values, Why Choose Us, Process Steps, Stats
- [ ] Publish/Unpublish toggles correctly hide drafts from the public site
- [ ] Image upload in the admin (Media Library + inline image fields) stores a file and the URL renders on the public page
- [ ] Public site (`/`) loads and renders services/projects/products/blog/careers/testimonials from the database
- [ ] `/services/:slug`, `/projects/:slug`, `/blog/:slug`, `/careers/:slug` clean URLs work
- [ ] Blog search + category filter work; Projects filter pills work
- [ ] FAQ accordions open/close on Support and Service Detail pages
- [ ] Contact form submission appears in `Admin → Contact Messages`
- [ ] Support form submission appears in `Admin → Support Requests`
- [ ] Careers application (with resume upload) appears in `Admin → Applications`, and the resume downloads only for a logged-in admin
- [ ] Mobile layout works for both the public site and the admin dashboard (sidebar collapses)
- [ ] `/404.html` renders for unknown routes
- [ ] `/sitemap.xml` reflects only published content
- [ ] Stopping the backend still shows a reasonable public site via the offline fallback content in `api-client.js` (graceful degradation, not a blank page)
- [ ] No secrets appear in any frontend JS or in git history

---

## 11. Known Limitations & Recommended Next Steps

- **Not live-tested end-to-end** in this delivery (no network access in
  the build sandbox — see the note in Section 4). Please run the setup
  steps and the checklist above yourself.
- **No admin user-management UI yet** — creating additional admin accounts
  beyond the seeded Super Admin currently requires a direct DB insert or a
  small script; a proper "Manage Admins" screen (super_admin only) is a
  natural next addition.
- **Rich text editor is intentionally minimal** — a dependency-free
  contenteditable toolbar (bold/italic/underline/lists/headings/links)
  rather than a full editor like TipTap/Quill, to avoid adding a heavy new
  frontend build step to a project that has deliberately stayed
  build-free. It's functional for real article writing; swapping in a
  richer editor later is straightforward since it only touches
  `admin/js/resource-crud.js`'s `richtext` field renderer.
- **Local file storage by default** — fine for a single server, but should
  move to S3 (or similar) before scaling to multiple server instances,
  since local disk uploads wouldn't be shared across them. The storage
  interface is isolated in `middleware/upload.js` specifically to make
  that swap contained.
- **Email notifications are optional/stubbed** — `SMTP_*` env vars are
  defined and documented, but sending isn't wired up yet; contact/support
  submissions are always saved to the database regardless, so nothing is
  lost, but the team won't get an email nudge until this is added (a
  small addition to `routes/public.routes.js`).
- **Scheduled blog publishing** — the `blog_posts.status` enum includes
  `scheduled` and there's a `published_at` field, but nothing currently
  flips a scheduled post to published automatically; would need a small
  cron job or a check added to the public blog query.
- **No automated test suite** — given the scope and sandbox constraints,
  testing here was static (syntax checks + cross-file consistency checks
  for routes/permissions/field names). Adding integration tests (e.g. with
  `supertest` against a test database) is recommended before production
  use.
