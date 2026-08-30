-- ============================================================================
-- Thu Tech com — PostgreSQL Schema
-- Run via: npm run db:migrate  (executes this file)
-- Safe to re-run: every statement uses IF NOT EXISTS / CREATE OR REPLACE.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for gen_random_uuid()

-- Generic "touch updated_at" trigger function, reused by every table below.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- USERS / ADMINS
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  role           TEXT NOT NULL DEFAULT 'content_manager'
                 CHECK (role IN ('super_admin', 'content_manager', 'hr_manager', 'support_manager')),
  is_active      BOOLEAN NOT NULL DEFAULT true,
  last_login_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_users_updated ON users;
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- COMPANY SETTINGS (singleton row)
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_settings (
  id                  INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- enforce singleton
  name                TEXT NOT NULL DEFAULT 'Thu Tech com',
  tagline             TEXT,
  description         TEXT,
  founded_year        INT,
  email               TEXT,
  support_email       TEXT,
  phone               TEXT,
  address             TEXT,
  hours               TEXT,
  website             TEXT,
  logo_url            TEXT,
  favicon_url         TEXT,
  social_facebook     TEXT,
  social_telegram     TEXT,
  social_linkedin     TEXT,
  social_tiktok       TEXT,
  social_youtube      TEXT,
  footer_note         TEXT,
  copyright_text      TEXT,
  mission             TEXT,
  vision              TEXT,
  story               TEXT,
  seo_default_title       TEXT,
  seo_default_description TEXT,
  og_default_image_url    TEXT,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_settings_updated ON company_settings;
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON company_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
INSERT INTO company_settings (id, name) VALUES (1, 'Thu Tech com') ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STATS (homepage / about numbers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS stats (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label       TEXT NOT NULL,
  value       TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_stats_updated ON stats;
CREATE TRIGGER trg_stats_updated BEFORE UPDATE ON stats
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- VALUES / WHY-CHOOSE-US / PROCESS STEPS (structured "page content" blocks)
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT, title TEXT NOT NULL, description TEXT,
  sort_order INT NOT NULL DEFAULT 0, is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_values_updated ON company_values;
CREATE TRIGGER trg_values_updated BEFORE UPDATE ON company_values
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS why_choose_us (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT, title TEXT NOT NULL, description TEXT,
  sort_order INT NOT NULL DEFAULT 0, is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_wcu_updated ON why_choose_us;
CREATE TRIGGER trg_wcu_updated BEFORE UPDATE ON why_choose_us
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number TEXT NOT NULL, title TEXT NOT NULL, description TEXT,
  sort_order INT NOT NULL DEFAULT 0, is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_process_updated ON process_steps;
CREATE TRIGGER trg_process_updated BEFORE UPDATE ON process_steps
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- MEDIA LIBRARY
-- ============================================================================
CREATE TABLE IF NOT EXISTS media (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename      TEXT NOT NULL,
  url           TEXT NOT NULL,
  mime_type     TEXT,
  size_bytes    INT,
  alt_text      TEXT,
  uploaded_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- SERVICES
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  icon              TEXT,
  short_description TEXT,
  full_description  TEXT,
  problems          JSONB NOT NULL DEFAULT '[]',   -- array of strings
  provide           JSONB NOT NULL DEFAULT '[]',   -- array of strings
  benefits          JSONB NOT NULL DEFAULT '[]',   -- array of strings
  faqs              JSONB NOT NULL DEFAULT '[]',   -- array of {q, a}
  featured_image_url TEXT,
  seo_title         TEXT,
  seo_description   TEXT,
  status            TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order        INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_services_updated ON services;
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

-- ============================================================================
-- SOLUTIONS (grouped by customer type)
-- ============================================================================
CREATE TABLE IF NOT EXISTS solutions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  icon         TEXT,
  description  TEXT,
  items        JSONB NOT NULL DEFAULT '[]', -- array of strings
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_solutions_updated ON solutions;
CREATE TRIGGER trg_solutions_updated BEFORE UPDATE ON solutions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- PROJECTS / PORTFOLIO
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  long_description TEXT,
  category         TEXT,
  filter_tag       TEXT,
  technologies     JSONB NOT NULL DEFAULT '[]', -- array of strings
  client_name      TEXT,
  project_date     DATE,
  featured_image_url TEXT,
  gallery          JSONB NOT NULL DEFAULT '[]', -- array of image URLs
  project_url      TEXT,
  case_study       TEXT,
  results_impact   TEXT,
  is_featured      BOOLEAN NOT NULL DEFAULT false,
  seo_title        TEXT,
  seo_description  TEXT,
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order       INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_projects_updated ON projects;
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_filter_tag ON projects(filter_tag);

-- ============================================================================
-- PRODUCTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  tagline       TEXT,
  description   TEXT,
  features      JSONB NOT NULL DEFAULT '[]', -- array of strings
  screenshots   JSONB NOT NULL DEFAULT '[]', -- array of image URLs
  icon          TEXT,
  logo_url      TEXT,
  pricing       TEXT,
  cta_label     TEXT DEFAULT 'Request Demo',
  product_url   TEXT,
  seo_title     TEXT,
  seo_description TEXT,
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_products_updated ON products;
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- TEAM MEMBERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS team_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  position    TEXT,
  bio         TEXT,
  photo_url   TEXT,
  social_links JSONB NOT NULL DEFAULT '{}', -- {linkedin, facebook, ...}
  status      TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_team_updated ON team_members;
CREATE TRIGGER trg_team_updated BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- TESTIMONIALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company     TEXT,
  position    TEXT,
  quote       TEXT NOT NULL,
  photo_url   TEXT,
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status      TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_testimonials_updated ON testimonials;
CREATE TRIGGER trg_testimonials_updated BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- CLIENTS (logos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS clients (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  logo_url    TEXT,
  website     TEXT,
  status      TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_clients_updated ON clients;
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- CAREERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS careers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  department      TEXT,
  location        TEXT,
  employment_type TEXT,
  description     TEXT,
  responsibilities JSONB NOT NULL DEFAULT '[]',
  requirements    JSONB NOT NULL DEFAULT '[]',
  qualifications  JSONB NOT NULL DEFAULT '[]',
  benefits        JSONB NOT NULL DEFAULT '[]',
  deadline        DATE,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  sort_order      INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_careers_updated ON careers;
CREATE TRIGGER trg_careers_updated BEFORE UPDATE ON careers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- JOB APPLICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS job_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id     UUID REFERENCES careers(id) ON DELETE SET NULL,
  position_title TEXT, -- denormalized snapshot in case the job posting is later removed
  applicant_name TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  portfolio_url TEXT,
  message       TEXT,
  resume_url    TEXT, -- private; served only via authenticated admin route
  status        TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_applications_updated ON job_applications;
CREATE TRIGGER trg_applications_updated BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);

-- ============================================================================
-- BLOG
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name  TEXT NOT NULL UNIQUE,
  slug  TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  excerpt           TEXT,
  content_html      TEXT,               -- rich-text editor output
  category_id       UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  author_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name_override TEXT,            -- fallback display name if author_id is null
  tags              JSONB NOT NULL DEFAULT '[]',
  featured_image_url TEXT,
  is_featured       BOOLEAN NOT NULL DEFAULT false,
  seo_title         TEXT,
  seo_description   TEXT,
  og_image_url      TEXT,
  status            TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_blog_updated ON blog_posts;
CREATE TRIGGER trg_blog_updated BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_published_at ON blog_posts(published_at);

-- ============================================================================
-- FAQS
-- ============================================================================
CREATE TABLE IF NOT EXISTS faqs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question     TEXT NOT NULL,
  answer       TEXT NOT NULL,
  category     TEXT DEFAULT 'general', -- e.g. 'general' or a service slug
  service_id   UUID REFERENCES services(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_faqs_updated ON faqs;
CREATE TRIGGER trg_faqs_updated BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- SUPPORT OPTIONS (the 4 cards on the Support page)
-- ============================================================================
CREATE TABLE IF NOT EXISTS support_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT, title TEXT NOT NULL, description TEXT,
  sort_order INT NOT NULL DEFAULT 0, is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_supportopt_updated ON support_options;
CREATE TRIGGER trg_supportopt_updated BEFORE UPDATE ON support_options
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- CONTACT MESSAGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  company     TEXT,
  service     TEXT,
  subject     TEXT,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_contact_updated ON contact_messages;
CREATE TRIGGER trg_contact_updated BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);

-- ============================================================================
-- SUPPORT REQUESTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS support_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  company       TEXT,
  request_type  TEXT,
  product_service TEXT,
  priority      TEXT NOT NULL DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high')),
  message       TEXT NOT NULL,
  attachment_url TEXT,
  status        TEXT NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_support_req_updated ON support_requests;
CREATE TRIGGER trg_support_req_updated BEFORE UPDATE ON support_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX IF NOT EXISTS idx_support_status ON support_requests(status);

-- ============================================================================
-- Done.
-- ============================================================================
