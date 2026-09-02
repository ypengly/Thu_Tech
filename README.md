# 🚀 Thu Tech com — CMS Platform

> **From Static to Dynamic: A Complete CMS Solution**

A production-ready, full-stack CMS platform that transforms a static business website into a fully managed content system. Built with Node.js, Express, and PostgreSQL — with a secure admin dashboard and zero-dependency frontend.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-ff69b4.svg)](https://github.com)
[![Deploy on Railway](https://img.shields.io/badge/Deploy%20on-Railway-0B0D0E?logo=railway)](https://railway.app)

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Problem & Solution](#-problem--solution)
- [📸 Preview](#-preview)
- [🏗️ Architecture](#️-architecture)
- [🗄️ Database Schema](#️-database-schema)
- [🚀 Quick Start](#-quick-start)
- [🔧 Environment Setup](#-environment-setup)
- [📦 Data Migration](#-data-migration)
- [👥 User Roles](#-user-roles)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚢 Deployment](#-deployment)
- [📊 Backup & Export](#-backup--export)
- [🧪 Testing Checklist](#-testing-checklist)
- [⚠️ Known Limitations](#️-known-limitations)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center"><b>📝</b><br>Full CMS</td>
      <td align="center"><b>🔒</b><br>RBAC Security</td>
      <td align="center"><b>📄</b><br>Content Migration</td>
    </tr>
    <tr>
      <td align="center"><b>🖼️</b><br>Media Library</td>
      <td align="center"><b>📊</b><br>Real-time Stats</td>
      <td align="center"><b>🌍</b><br>Clean URLs</td>
    </tr>
    <tr>
      <td align="center"><b>📬</b><br>Form Submissions</td>
      <td align="center"><b>🔍</b><br>SEO Friendly</td>
      <td align="center"><b>📱</b><br>Responsive</td>
    </tr>
  </table>
</div>

### 🎯 Core Capabilities

| Feature | Description |
|---------|-------------|
| **Content Management** | Services, Solutions, Projects, Products, Blog Posts, Careers, Team Members, Testimonials, FAQs, Clients |
| **Admin Dashboard** | Secure, role-based interface for managing all content with real-time preview |
| **User Roles** | Super Admin, Content Manager, HR Manager, Support Manager with granular permissions |
| **Media Library** | Upload, organize, and manage images and files with secure access |
| **Form Handling** | Contact messages, support requests, and job applications with resume uploads |
| **SEO Optimized** | Meta titles, descriptions, and keywords for every content type |
| **Sitemap Generation** | Dynamic XML sitemap with only published content |
| **Content Migration** | One-command import from static content.js to database |
| **Backup & Export** | Full JSON export and PostgreSQL backup capabilities |
| **Draft/Published** | Content workflow with status management |
| **Clean URLs** | Slug-based routing for all content types |
| **Search & Filters** | Blog search, category filtering, project filters |

---

## 🎯 Problem & Solution

### The Problem
Small businesses and agencies using static HTML sites face a critical limitation: every content update requires developer intervention. The company owner can't manage services, projects, blog posts, or team members without editing HTML/CSS/JavaScript files.

### The Solution
**Thu Tech com — CMS Platform** provides:
- ✅ Complete content management through a secure admin dashboard
- ✅ Zero developer dependency for content updates
- ✅ Preserved brand identity and design system
- ✅ Seamless migration from static content
- ✅ Role-based access control for team collaboration
- ✅ All the features of the original static site, now database-driven

---

## 📸 Preview

<div align="center">
  <img src="https://via.placeholder.com/800x450/2F5D62/FFFFFF?text=Thu+Tech+com+CMS+Platform+Preview" alt="Thu Tech com CMS Platform" width="800">
  <br>
  <em>Manage every piece of content from a secure admin dashboard</em>
</div>

### Admin Dashboard Preview

<div align="center">
  <table>
    <tr>
      <td><img src="https://via.placeholder.com/400x300/EDE8DC/211D18?text=Dashboard+Overview" alt="Dashboard"></td>
      <td><img src="https://via.placeholder.com/400x300/EDE8DC/211D18?text=Content+Editor" alt="Content Editor"></td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/400x300/EDE8DC/211D18?text=Media+Library" alt="Media Library"></td>
      <td><img src="https://via.placeholder.com/400x300/EDE8DC/211D18?text=Form+Submissions" alt="Form Submissions"></td>
    </tr>
  </table>
</div>

### Public Website Preview

<div align="center">
  <table>
    <tr>
      <td><img src="https://via.placeholder.com/400x300/EDE8DC/211D18?text=Home+Page" alt="Home Page"></td>
      <td><img src="https://via.placeholder.com/400x300/EDE8DC/211D18?text=Service+Detail" alt="Service Detail"></td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/400x300/EDE8DC/211D18?text=Blog+Page" alt="Blog Page"></td>
      <td><img src="https://via.placeholder.com/400x300/EDE8DC/211D18?text=Contact+Page" alt="Contact Page"></td>
    </tr>
  </table>
</div>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                          │
│  ┌──────────────────┐    ┌──────────────────┐                 │
│  │  Public Website  │    │ Admin Dashboard  │                 │
│  │  (HTML + JS)     │    │  (HTML + JS)     │                 │
│  └────────┬─────────┘    └────────┬─────────┘                 │
└───────────┼───────────────────────┼───────────────────────────┘
            │                       │
            │  GET /                │  GET /admin
            │  GET /api/public/*    │  POST /api/admin/*
            │                       │
┌───────────▼───────────────────────▼───────────────────────────┐
│                    Node.js + Express Server                    │
│  ┌───────────────────────────────────────────────────────────┐│
│  │                    API Routes                             ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐││
│  │  │  Public  │  │  Admin   │  │  Auth    │  │ Sitemap  │││
│  │  │  Routes  │  │  Routes  │  │  Routes  │  │ Routes   │││
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘││
│  ├───────────────────────────────────────────────────────────┤│
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐││
│  │  │  Generic │  │  Auth    │  │  Upload  │  │  Error   │││
│  │  │   CRUD   │  │  Middle- │  │  Middle- │  │  Handler │││
│  │  │Controller│  │   ware   │  │   ware   │  │          │││
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘││
│  └───────────────────────────────────────────────────────────┘│
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   PostgreSQL Database                       │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  Users │ Settings │ Services │ Solutions │ Projects     ││
│  │  Products │ Blog │ Careers │ Team │ Testimonials       ││
│  │  FAQs │ Media │ Contact │ Support │ Applications       ││
│  └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `users` | Admin accounts with role-based access |
| `company_settings` | Company info, contact, socials, SEO defaults |
| `stats` | Home page statistics |
| `company_values` | Company values section |
| `why_choose_us` | Why Choose Us section |
| `process_steps` | Process steps |
| `services` | Services with slug, icon, structured content, SEO |
| `solutions` | Solutions grouped by customer type |
| `projects` | Portfolio items with gallery, case study, results |
| `products` | Products |
| `team_members` | Team members |
| `testimonials` | Testimonials |
| `clients` | Client logos |
| `careers` | Job postings |
| `job_applications` | Submitted applications with resume URLs |
| `blog_categories` | Blog categories |
| `blog_posts` | Blog posts with rich text, tags, SEO |
| `faqs` | FAQs (general or service-specific) |
| `support_options` | Support page cards |
| `contact_messages` | Contact form submissions |
| `support_requests` | Support form submissions |
| `media` | Uploaded files and images |

**Key Features:**
- Auto-maintained `created_at`/`updated_at` via triggers
- `draft`/`published` status for content workflow
- `sort_order` for manual ordering
- Unique indexed slugs for clean URLs

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/thutechcom-platform.git
cd thutechcom-platform

# Start PostgreSQL (or use your existing instance)
docker compose up -d

# Install backend dependencies
cd server
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL and credentials

# Create the database schema
npm run db:migrate

# Create Super Admin account
npm run db:seed:admin

# Import static content to database
npm run db:seed:content

# Start the development server
npm run dev
```

### Access the Application

- **Public Website:** http://localhost:4000/
- **Admin Dashboard:** http://localhost:4000/admin/login.html
- **Login Credentials:** Use the email/password from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env`

### Quick Setup Commands

```bash
# One-command setup (migrate + seed admin + seed content)
npm run db:setup

# Reset everything (drop and recreate)
npm run db:reset

# Export all content
npm run db:export
```

---

## 🔧 Environment Setup

Create `server/.env` with these variables:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/thutechcom"

# Security
JWT_SECRET="your-super-secret-jwt-key-use-openssl-rand-hex-32"
COOKIE_SECURE=false  # Set true in production (HTTPS only)

# Admin Seeding (only used once)
SEED_ADMIN_NAME="Super Admin"
SEED_ADMIN_EMAIL="admin@thutech.com"
SEED_ADMIN_PASSWORD="secure-password-here"

# Storage
STORAGE_DRIVER="local"  # or "s3" (coming soon)

# Server
PORT=4000
NODE_ENV="development"
APP_URL="http://localhost:4000"

# Email (optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="user@example.com"
SMTP_PASS="password"
SMTP_FROM="noreply@thutech.com"
```

> ⚠️ **Security Note:** Never commit the real `.env` file. Use `.env.example` as a template.

---

## 📦 Data Migration

### Importing Static Content

The original `public/js/content.js` data has been captured into `server/src/db/legacy-content.js` and can be imported with:

```bash
npm run db:seed:content
```

**Safe to re-run:** Content is upserted by slug (`ON CONFLICT (slug) DO UPDATE`), so running it multiple times won't create duplicates.

**After migration:** The database is the source of truth — all future edits should go through `/admin`, not by re-running the migration.

### Exporting Content

```bash
# Through the admin UI
Admin → Company Settings → Export Content (JSON)

# Or via command line
npm run db:export
```

Exports a full JSON snapshot of every content table to `server/content-export-<timestamp>.json`.

### Full Database Backup

```bash
pg_dump "$DATABASE_URL" -Fc -f thutechcom-backup.dump

# Restore
pg_restore -d "$DATABASE_URL" thutechcom-backup.dump
```

---

## 👥 User Roles

### Role Capabilities

| Resource | Super Admin | Content Manager | HR Manager | Support Manager |
|----------|-------------|-----------------|------------|-----------------|
| Company Settings | ✅ | ✅ | ❌ | ❌ |
| Services | ✅ | ✅ | ❌ | ❌ |
| Solutions | ✅ | ✅ | ❌ | ❌ |
| Projects | ✅ | ✅ | ❌ | ❌ |
| Products | ✅ | ✅ | ❌ | ❌ |
| Team Members | ✅ | ✅ | ❌ | ❌ |
| Testimonials | ✅ | ✅ | ❌ | ❌ |
| Clients | ✅ | ✅ | ❌ | ❌ |
| Blog Posts | ✅ | ✅ | ❌ | ❌ |
| Blog Categories | ✅ | ✅ | ❌ | ❌ |
| FAQs | ✅ | ✅ | ❌ | ❌ |
| Media | ✅ | ✅ | ❌ | ❌ |
| Careers | ✅ | ❌ | ✅ | ❌ |
| Job Applications | ✅ | ❌ | ✅ | ❌ |
| Contact Messages | ✅ | ❌ | ❌ | ✅ |
| Support Requests | ✅ | ❌ | ❌ | ✅ |

**Permission Philosophy:**
- Every check happens **server-side** (`middleware/auth.js` + `requireResource()`)
- The sidebar simply hides links a role can't use
- The sidebar is **never** the actual security boundary

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express** | Web framework |
| **PostgreSQL** | Database |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |
| **Multer** | File uploads |
| **HTML5** | Frontend structure |
| **CSS3** | Styling |
| **Vanilla JS** | Frontend logic (no frameworks) |
| **Docker** | Development environment |

### Why No Frontend Framework?

The platform deliberately avoids React, Vue, or Angular to:
- Keep the codebase accessible to developers of all skill levels
- Maintain zero build-step deployment
- Preserve the original static site's simplicity
- Make it easy to migrate existing HTML/JS sites

---

## 📁 Project Structure

```
thutechcom-platform/
├── public/                    # Public website
│   ├── index.html, about.html, services.html, service-detail.html,
│   │   solutions.html, projects.html, project-detail.html,
│   │   products.html, careers.html, career-detail.html,
│   │   blog.html, blog-post.html, contact.html, support.html, 404.html
│   ├── admin.html             # Redirects to /admin/login.html
│   ├── css/style.css          # Design system
│   ├── js/
│   │   ├── api-client.js      # Fetches live content from the API
│   │   ├── content.js         # Legacy static data (historical reference)
│   │   ├── components.js      # Navbar/footer (async, awaits API data)
│   │   └── main.js            # Interactions (forms call the real API)
│   ├── assets/
│   ├── robots.txt
│   └── sitemap.xml            # Generated dynamically
│
├── admin/                     # Admin Dashboard
│   ├── login.html, index.html, resource.html, media.html,
│   │   messages.html, support.html, applications.html, settings.html
│   ├── css/admin.css
│   └── js/
│       ├── api.js             # API client
│       ├── layout.js          # Sidebar, navigation
│       └── resource-crud.js   # Generic CRUD UI
│
├── server/                    # Backend
│   ├── package.json
│   ├── .env.example
│   ├── uploads/               # Local media storage
│   └── src/
│       ├── index.js           # App entry point
│       ├── config/
│       │   ├── db.js          # PostgreSQL connection pool
│       │   └── resources.js   # Single source of truth for CMS resources
│       ├── controllers/
│       │   └── genericCrud.js # Shared CRUD logic (DRY)
│       ├── middleware/
│       │   ├── auth.js        # Authentication & authorization
│       │   ├── upload.js      # File upload handling
│       │   └── errorHandler.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── admin.routes.js
│       │   ├── public.routes.js
│       │   ├── sitemap.routes.js
│       │   └── ... (all API routes)
│       ├── db/
│       │   ├── schema.sql     # Full PostgreSQL schema
│       │   ├── migrate.js     # Runs schema.sql
│       │   ├── seed-admin.js  # Creates Super Admin
│       │   ├── legacy-content.js  # Static content copy
│       │   ├── seed-migrate-content.js  # Imports legacy content
│       │   └── export-content.js  # Admin export functionality
│       └── utils/
│           └── helpers.js     # Utility functions
│
├── docker-compose.yml         # PostgreSQL container
├── .gitignore
└── README.md                  # This file
```

---

## 🚢 Deployment

### Deploy to Railway (Recommended)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yourusername/thutechcom-platform)

### Deploy to Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Use these settings:
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Environment Variables:** Set all variables from `.env.example`

### Deploy to a VPS

```bash
# Install Node.js and PostgreSQL
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql nginx

# Clone and setup
git clone https://github.com/yourusername/thutechcom-platform.git
cd thutechcom-platform/server
npm install
cp .env.example .env
# Edit .env

# Run migrations and seed
npm run db:setup

# Use PM2 for process management
npm install -g pm2
pm2 start src/index.js --name thutechcom
pm2 save
pm2 startup
```

### Production Considerations

- Set `NODE_ENV=production`
- Set `COOKIE_SECURE=true` (requires HTTPS)
- Set a strong `JWT_SECRET` (`openssl rand -hex 32`)
- Move to S3 for file storage when scaling horizontally
- Set up regular database backups
- Configure proper SSL/TLS certificates

---

## 📊 Backup & Export

### Admin Export

1. Log in to the admin dashboard
2. Navigate to **Company Settings**
3. Click **Export Content (JSON)**
4. Download the complete content backup

### CLI Export

```bash
npm run db:export
# Outputs: server/content-export-<timestamp>.json
```

### Scheduled Backups

Consider using PostgreSQL's built-in backup tools:

```bash
# Daily backup cron job
0 2 * * * pg_dump "$DATABASE_URL" -Fc -f /backups/thutechcom-$(date +\%Y\%m\%d).dump
```

---

## 🧪 Testing Checklist

Run through this checklist after setup:

### Backend Setup
- [ ] `npm run db:migrate` completes with no errors
- [ ] `npm run db:seed:admin` creates the account
- [ ] `npm run db:seed:content` imports all legacy content without errors
- [ ] Re-running seed doesn't duplicate rows

### Authentication & Security
- [ ] Visiting `/admin` while logged out redirects to `/admin/login.html`
- [ ] Calling `/api/admin/*` routes without a session returns `401`
- [ ] A `content_manager` account cannot reach Careers/Applications/Support endpoints (`403`)

### CRUD Operations
- [ ] Create/Edit/Delete works for: Services, Projects, Products, Team, Testimonials, Clients, Careers, Blog Posts, Blog Categories, FAQs, Solutions, Values, Why Choose Us, Process Steps, Stats
- [ ] Publish/Unpublish toggles correctly hide drafts from the public site

### File Uploads
- [ ] Image upload in Media Library stores a file
- [ ] Inline image fields work
- [ ] Resume uploads for job applications are secure

### Public Site
- [ ] `/` loads and renders content from the database
- [ ] `/services/:slug`, `/projects/:slug`, `/blog/:slug`, `/careers/:slug` clean URLs work
- [ ] Blog search + category filter work
- [ ] Projects filter pills work
- [ ] FAQ accordions open/close

### Form Submissions
- [ ] Contact form appears in `Admin → Contact Messages`
- [ ] Support form appears in `Admin → Support Requests`
- [ ] Career application with resume appears in `Admin → Applications`
- [ ] Resume downloads only for logged-in admins

### Mobile & Responsive
- [ ] Public site works on mobile
- [ ] Admin dashboard sidebar collapses on mobile

### Error Handling
- [ ] `/404.html` renders for unknown routes
- [ ] `/sitemap.xml` reflects only published content
- [ ] Stopping the backend still shows a reasonable public site via offline fallback

### Security
- [ ] No secrets appear in any frontend JS
- [ ] No secrets in git history
- [ ] `.env` is properly gitignored

---

## ⚠️ Known Limitations

| Issue | Impact | Workaround |
|-------|--------|------------|
| **No user management UI** | Creating admin accounts requires direct DB insert | Use SQL script or await next update |
| **Rich text editor is minimal** | Limited formatting options | Current editor supports bold, italic, underline, lists, headings, links |
| **Local file storage default** | Not shared across multiple servers | Swap to S3 in `middleware/upload.js` |
| **Email notifications stubbed** | No automatic notifications for submissions | Submissions saved to DB; email nudge not yet wired |
| **Scheduled posts** | `scheduled` status exists but not auto-published | Manual publishing until cron job added |
| **No automated test suite** | Manual testing required | Integration tests recommended before production |

### Recommended Next Steps

1. **Add Admin User Management UI** — Super Admin interface for creating/managing admin accounts
2. **Enhance Rich Text Editor** — Consider TipTap or Quill integration
3. **Implement Email Notifications** — Wire SMTP to send notifications for submissions
4. **Add Scheduled Publishing** — Cron job to publish scheduled blog posts
5. **Implement S3 Storage** — Cloud storage for file uploads
6. **Add Integration Tests** — Supertest for API endpoint testing
7. **Implement Rate Limiting** — Prevent API abuse
8. **Add Audit Logs** — Track who changed what and when

---

## 🤝 Contributing

We welcome contributions! Here's how to help:

### 🐛 Report Bugs
- Open an issue with detailed steps to reproduce
- Include screenshots if applicable
- Specify your Node.js and PostgreSQL versions

### 💡 Suggest Features
- Open an issue with the "enhancement" label
- Describe the feature and its use case
- Provide examples if possible

### 🔧 Submit PRs
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📝 Code Style
- Follow existing code conventions
- Use ES6+ syntax
- Keep frontend code vanilla JS (no frameworks)
- Document new API endpoints
- Add validation for new database fields

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

```
Copyright (c) 2024 Thu Tech com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

- **Node.js & Express** — For the robust backend framework
- **PostgreSQL** — For the reliable relational database
- **All contributors** — For making this platform possible
- **Original static site authors** — For the design and content

---

## 📞 Support & Contact

- **Email:** ypengly060@gmail.com


---

<div align="center">
  <sub>Built with ❤️ by the Thu Tech com team</sub>
  <br>
  <sub>⭐ Star this repo if you find it useful!</sub>
</div>
