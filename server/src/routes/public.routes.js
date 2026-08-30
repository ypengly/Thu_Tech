// server/src/routes/public.routes.js
// Unauthenticated, read-only endpoints consumed by the public website, plus
// the three public submission endpoints (contact, support, job application).
// Every SELECT here is scoped to status = 'published' (or the resource has
// no draft concept) so drafts never leak to visitors or search engines.

const express = require("express");
const { query } = require("../config/db");
const { asyncHandler } = require("../utils/helpers");
const { uploadDocument, fileUrl } = require("../middleware/upload");

const router = express.Router();

// ---------------------------------------------------------------------
// Aggregate "bootstrap" endpoint — mirrors the shape of the original
// js/content.js SITE_CONTENT object, so the existing public page scripts
// (index.html, about.html, etc.) keep working almost unchanged: they just
// `await` this instead of reading a hard-coded JS object.
// ---------------------------------------------------------------------
router.get("/bootstrap", asyncHandler(async (req, res) => {
  const [
    settings, stats, values, whyChooseUs, processSteps,
    services, solutions, projects, products, team, testimonials, clients,
    careers, faqs, supportOptions
  ] = await Promise.all([
    query("SELECT * FROM company_settings WHERE id = 1"),
    query("SELECT * FROM stats ORDER BY sort_order"),
    query("SELECT * FROM company_values WHERE is_published = true ORDER BY sort_order"),
    query("SELECT * FROM why_choose_us WHERE is_published = true ORDER BY sort_order"),
    query("SELECT * FROM process_steps WHERE is_published = true ORDER BY sort_order"),
    query("SELECT * FROM services WHERE status = 'published' ORDER BY sort_order"),
    query("SELECT * FROM solutions WHERE status = 'published' ORDER BY sort_order"),
    query("SELECT * FROM projects WHERE status = 'published' ORDER BY sort_order"),
    query("SELECT * FROM products WHERE status = 'published' ORDER BY sort_order"),
    query("SELECT * FROM team_members WHERE status = 'published' ORDER BY sort_order"),
    query("SELECT * FROM testimonials WHERE status = 'published' ORDER BY sort_order"),
    query("SELECT * FROM clients WHERE status = 'published' ORDER BY sort_order"),
    query("SELECT * FROM careers WHERE status = 'published' ORDER BY sort_order"),
    query("SELECT * FROM faqs WHERE status = 'published' AND category = 'general' ORDER BY sort_order"),
    query("SELECT * FROM support_options WHERE is_published = true ORDER BY sort_order")
  ]);

  const blogRes = await query(`
    SELECT bp.*, bc.name AS category_name
    FROM blog_posts bp LEFT JOIN blog_categories bc ON bc.id = bp.category_id
    WHERE bp.status = 'published' ORDER BY bp.published_at DESC NULLS LAST, bp.created_at DESC
  `);

  const s = settings.rows[0] || {};

  res.json({
    company: {
      name: s.name, tagline: s.tagline, shortDescription: s.description,
      foundedYear: s.founded_year, email: s.email, supportEmail: s.support_email,
      phone: s.phone, address: s.address, hours: s.hours,
      social: {
        facebook: s.social_facebook, telegram: s.social_telegram,
        linkedin: s.social_linkedin, tiktok: s.social_tiktok, youtube: s.social_youtube
      }
    },
    stats: stats.rows.map((r) => ({ label: r.label, value: r.value })),
    mission: s.mission, vision: s.vision, story: s.story,
    values: values.rows.map((v) => ({ icon: v.icon, title: v.title, description: v.description })),
    whyChooseUs: whyChooseUs.rows.map((w) => ({ icon: w.icon, title: w.title, description: w.description })),
    processSteps: processSteps.rows.map((p) => ({ number: p.step_number, title: p.title, description: p.description })),
    services: services.rows.map(mapService),
    solutions: solutions.rows.map((sol) => ({
      id: sol.slug, icon: sol.icon, title: sol.title, description: sol.description, items: sol.items
    })),
    projects: projects.rows.map(mapProject),
    products: products.rows.map(mapProduct),
    team: team.rows.map((t) => ({ name: t.name, role: t.position, bio: t.bio, photo: t.photo_url })),
    testimonials: testimonials.rows.map((t) => ({ quote: t.quote, name: t.client_name, role: [t.position, t.company].filter(Boolean).join(", ") })),
    clients: clients.rows.map((c) => c.name),
    careers: careers.rows.map(mapCareer),
    blog: blogRes.rows.map(mapBlogPost),
    faqs: faqs.rows.map((f) => ({ q: f.question, a: f.answer })),
    supportOptions: supportOptions.rows.map((o) => ({ icon: o.icon, title: o.title, description: o.description }))
  });
}));

function mapService(s) {
  return {
    id: s.slug, icon: s.icon, title: s.title, shortDescription: s.short_description,
    image: s.featured_image_url, problems: s.problems, provide: s.provide, benefits: s.benefits,
    faqs: s.faqs
  };
}
function mapProject(p) {
  return {
    id: p.slug, name: p.name, category: p.category, filterTag: p.filter_tag,
    description: p.description, technologies: p.technologies, image: p.featured_image_url,
    isFeatured: p.is_featured
  };
}
function mapProduct(p) {
  return {
    id: p.slug, name: p.name, tagline: p.tagline, description: p.description,
    features: p.features, pricing: p.pricing, icon: p.icon, productUrl: p.product_url
  };
}
function mapCareer(j) {
  return {
    id: j.slug, title: j.title, location: j.location, type: j.employment_type,
    description: j.description, requirements: j.requirements
  };
}
function mapBlogPost(b) {
  return {
    id: b.slug, title: b.title, category: b.category_name || "General",
    date: b.published_at ? b.published_at.toISOString().slice(0, 10) : b.created_at.toISOString().slice(0, 10),
    author: b.author_name_override || "Thu Tech com Team", excerpt: b.excerpt,
    content: b.content_html, image: b.featured_image_url, featured: b.is_featured
  };
}

// ---------------------------------------------------------------------
// Individual published-content endpoints (clean-URL detail pages use these)
// ---------------------------------------------------------------------
router.get("/services/:slug", asyncHandler(async (req, res) => {
  const r = await query("SELECT * FROM services WHERE slug = $1 AND status = 'published'", [req.params.slug]);
  if (!r.rows.length) return res.status(404).json({ error: "Service not found." });
  res.json({ data: mapService(r.rows[0]) });
}));

router.get("/projects/:slug", asyncHandler(async (req, res) => {
  const r = await query("SELECT * FROM projects WHERE slug = $1 AND status = 'published'", [req.params.slug]);
  if (!r.rows.length) return res.status(404).json({ error: "Project not found." });
  const p = r.rows[0];
  res.json({ data: { ...mapProject(p), longDescription: p.long_description, gallery: p.gallery, caseStudy: p.case_study, resultsImpact: p.results_impact, client: p.client_name, projectUrl: p.project_url } });
}));

router.get("/blog/:slug", asyncHandler(async (req, res) => {
  const r = await query(
    `SELECT bp.*, bc.name AS category_name FROM blog_posts bp
     LEFT JOIN blog_categories bc ON bc.id = bp.category_id
     WHERE bp.slug = $1 AND bp.status = 'published'`,
    [req.params.slug]
  );
  if (!r.rows.length) return res.status(404).json({ error: "Article not found." });
  res.json({ data: mapBlogPost(r.rows[0]) });
}));

router.get("/careers/:slug", asyncHandler(async (req, res) => {
  const r = await query("SELECT * FROM careers WHERE slug = $1 AND status = 'published'", [req.params.slug]);
  if (!r.rows.length) return res.status(404).json({ error: "Position not found or no longer open." });
  res.json({ data: { ...mapCareer(r.rows[0]), id: r.rows[0].id, responsibilities: r.rows[0].responsibilities, qualifications: r.rows[0].qualifications, benefits: r.rows[0].benefits, deadline: r.rows[0].deadline } });
}));

// ---------------------------------------------------------------------
// Public submissions — Contact, Support, Job Applications
// ---------------------------------------------------------------------
router.post("/contact", asyncHandler(async (req, res) => {
  const { name, email, phone, company, service, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  await query(
    `INSERT INTO contact_messages (name, email, phone, company, service, subject, message)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [name, email, phone || null, company || null, service || null, req.body.subject || null, message]
  );
  res.status(201).json({ message: "Your message has been sent successfully!" });
}));

router.post("/support", asyncHandler(async (req, res) => {
  const { name, email, product, priority, description } = req.body;
  if (!name || !email || !product || !priority || !description) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }
  await query(
    `INSERT INTO support_requests (name, email, phone, company, product_service, priority, message)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [name, email, req.body.phone || null, req.body.company || null, product, priority, description]
  );
  res.status(201).json({ message: "Your support request has been submitted!" });
}));

router.post(
  "/careers/apply",
  uploadDocument.single("resume"),
  asyncHandler(async (req, res) => {
    const { name, email, position, message, portfolio } = req.body;
    if (!name || !email || !position || !message) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }
    let careerId = null;
    let positionTitle = position;
    const careerRes = await query("SELECT id, title FROM careers WHERE slug = $1 OR id::text = $1", [position]);
    if (careerRes.rows.length) {
      careerId = careerRes.rows[0].id;
      positionTitle = careerRes.rows[0].title;
    }
    const resumeUrl = req.file ? fileUrl(req.file.filename) : null;
    await query(
      `INSERT INTO job_applications (career_id, position_title, applicant_name, email, phone, portfolio_url, message, resume_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [careerId, positionTitle, name, email, req.body.phone || null, portfolio || null, message, resumeUrl]
    );
    res.status(201).json({ message: "Application submitted successfully!" });
  })
);

module.exports = router;
