// server/src/db/seed-migrate-content.js
// One-time migration: imports the original js/content.js data (captured in
// legacy-content.js) into the database. Safe to re-run — uses ON CONFLICT
// upserts keyed by slug/unique fields, so re-running won't duplicate rows.
// Run with: npm run db:seed:content
require("dotenv").config();
const slugify = require("slugify");
const { pool, query } = require("../config/db");
const legacy = require("./legacy-content");

const slug = (s) => slugify(s, { lower: true, strict: true });

async function run() {
  console.log("[seed-content] Starting import of legacy content.js data...");

  // ---- Company settings ----
  const c = legacy.company;
  await query(
    `UPDATE company_settings SET
      name=$1, tagline=$2, description=$3, founded_year=$4, email=$5, support_email=$6,
      phone=$7, address=$8, hours=$9, social_facebook=$10, social_telegram=$11,
      social_linkedin=$12, social_tiktok=$13, social_youtube=$14, mission=$15, vision=$16, story=$17
     WHERE id = 1`,
    [
      c.name, c.tagline, c.shortDescription, c.foundedYear, c.email, c.supportEmail,
      c.phone, c.address, c.hours, c.social.facebook, c.social.telegram,
      c.social.linkedin, c.social.tiktok, c.social.youtube, legacy.mission, legacy.vision, legacy.story
    ]
  );
  console.log("[seed-content] ✔ Company settings");

  // ---- Stats ----
  await query("DELETE FROM stats");
  for (let i = 0; i < legacy.stats.length; i++) {
    const s = legacy.stats[i];
    await query("INSERT INTO stats (label, value, sort_order) VALUES ($1,$2,$3)", [s.label, s.value, i]);
  }
  console.log(`[seed-content] ✔ ${legacy.stats.length} stats`);

  // ---- Values ----
  await query("DELETE FROM company_values");
  for (let i = 0; i < legacy.values.length; i++) {
    const v = legacy.values[i];
    await query("INSERT INTO company_values (icon,title,description,sort_order) VALUES ($1,$2,$3,$4)",
      [v.icon, v.title, v.description, i]);
  }

  // ---- Why choose us ----
  await query("DELETE FROM why_choose_us");
  for (let i = 0; i < legacy.whyChooseUs.length; i++) {
    const w = legacy.whyChooseUs[i];
    await query("INSERT INTO why_choose_us (icon,title,description,sort_order) VALUES ($1,$2,$3,$4)",
      [w.icon, w.title, w.description, i]);
  }

  // ---- Process steps ----
  await query("DELETE FROM process_steps");
  for (let i = 0; i < legacy.processSteps.length; i++) {
    const p = legacy.processSteps[i];
    await query("INSERT INTO process_steps (step_number,title,description,sort_order) VALUES ($1,$2,$3,$4)",
      [p.number, p.title, p.description, i]);
  }
  console.log("[seed-content] ✔ Values, Why Choose Us, Process steps");

  // ---- Services ----
  for (let i = 0; i < legacy.services.length; i++) {
    const s = legacy.services[i];
    await query(
      `INSERT INTO services (title, slug, icon, short_description, problems, provide, benefits, faqs, status, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'published',$9)
       ON CONFLICT (slug) DO UPDATE SET
         title=EXCLUDED.title, icon=EXCLUDED.icon, short_description=EXCLUDED.short_description,
         problems=EXCLUDED.problems, provide=EXCLUDED.provide, benefits=EXCLUDED.benefits,
         faqs=EXCLUDED.faqs, sort_order=EXCLUDED.sort_order`,
      [
        s.title, s.id, s.icon, s.shortDescription,
        JSON.stringify(s.problems || []), JSON.stringify(s.provide || []),
        JSON.stringify(s.benefits || []),
        JSON.stringify((s.faqs || []).map(f => ({ q: f.q, a: f.a }))),
        i
      ]
    );
  }
  console.log(`[seed-content] ✔ ${legacy.services.length} services`);

  // ---- Solutions ----
  for (let i = 0; i < legacy.solutions.length; i++) {
    const s = legacy.solutions[i];
    await query(
      `INSERT INTO solutions (title, slug, icon, description, items, status, sort_order)
       VALUES ($1,$2,$3,$4,$5,'published',$6)
       ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, icon=EXCLUDED.icon,
         description=EXCLUDED.description, items=EXCLUDED.items, sort_order=EXCLUDED.sort_order`,
      [s.title, s.id, s.icon, s.description, JSON.stringify(s.items || []), i]
    );
  }
  console.log(`[seed-content] ✔ ${legacy.solutions.length} solutions`);

  // ---- Projects ----
  for (let i = 0; i < legacy.projects.length; i++) {
    const p = legacy.projects[i];
    await query(
      `INSERT INTO projects (name, slug, description, category, filter_tag, technologies, status, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,'published',$7)
       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description,
         category=EXCLUDED.category, filter_tag=EXCLUDED.filter_tag, technologies=EXCLUDED.technologies,
         sort_order=EXCLUDED.sort_order`,
      [p.name, p.id, p.description, p.category, p.filterTag, JSON.stringify(p.technologies || []), i]
    );
  }
  console.log(`[seed-content] ✔ ${legacy.projects.length} projects`);

  // ---- Products ----
  for (let i = 0; i < legacy.products.length; i++) {
    const p = legacy.products[i];
    await query(
      `INSERT INTO products (name, slug, tagline, description, features, icon, pricing, status, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'published',$8)
       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, tagline=EXCLUDED.tagline,
         description=EXCLUDED.description, features=EXCLUDED.features, icon=EXCLUDED.icon,
         pricing=EXCLUDED.pricing, sort_order=EXCLUDED.sort_order`,
      [p.name, p.id, p.tagline, p.description, JSON.stringify(p.features || []), p.icon, p.pricing, i]
    );
  }
  console.log(`[seed-content] ✔ ${legacy.products.length} products`);

  // ---- Team ----
  await query("DELETE FROM team_members");
  for (let i = 0; i < legacy.team.length; i++) {
    const t = legacy.team[i];
    await query("INSERT INTO team_members (name, position, bio, sort_order) VALUES ($1,$2,$3,$4)",
      [t.name, t.role, t.bio, i]);
  }
  console.log(`[seed-content] ✔ ${legacy.team.length} team members`);

  // ---- Testimonials ----
  await query("DELETE FROM testimonials");
  for (let i = 0; i < legacy.testimonials.length; i++) {
    const t = legacy.testimonials[i];
    await query("INSERT INTO testimonials (client_name, position, quote, is_featured, sort_order) VALUES ($1,$2,$3,$4,$5)",
      [t.name, t.role, t.quote, i < 3, i]);
  }
  console.log(`[seed-content] ✔ ${legacy.testimonials.length} testimonials`);

  // ---- Clients ----
  await query("DELETE FROM clients");
  for (let i = 0; i < legacy.clients.length; i++) {
    await query("INSERT INTO clients (name, sort_order) VALUES ($1,$2)", [legacy.clients[i], i]);
  }
  console.log(`[seed-content] ✔ ${legacy.clients.length} clients`);

  // ---- Careers ----
  for (let i = 0; i < legacy.careers.length; i++) {
    const j = legacy.careers[i];
    await query(
      `INSERT INTO careers (title, slug, location, employment_type, description, requirements, status, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,'published',$7)
       ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, location=EXCLUDED.location,
         employment_type=EXCLUDED.employment_type, description=EXCLUDED.description,
         requirements=EXCLUDED.requirements, sort_order=EXCLUDED.sort_order`,
      [j.title, j.id, j.location, j.type, j.description, JSON.stringify(j.requirements || []), i]
    );
  }
  console.log(`[seed-content] ✔ ${legacy.careers.length} careers`);

  // ---- Blog categories + posts ----
  const categoryNames = [...new Set(legacy.blog.map(b => b.category))];
  const categoryIds = {};
  for (const name of categoryNames) {
    const res = await query(
      `INSERT INTO blog_categories (name, slug) VALUES ($1,$2)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
      [name, slug(name)]
    );
    categoryIds[name] = res.rows[0].id;
  }
  for (const b of legacy.blog) {
    await query(
      `INSERT INTO blog_posts (title, slug, excerpt, category_id, author_name_override, is_featured, status, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,'published',$7)
       ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, excerpt=EXCLUDED.excerpt,
         category_id=EXCLUDED.category_id, is_featured=EXCLUDED.is_featured`,
      [b.title, b.id, b.excerpt, categoryIds[b.category], b.author, !!b.featured, b.date]
    );
  }
  console.log(`[seed-content] ✔ ${legacy.blog.length} blog posts, ${categoryNames.length} categories`);

  // ---- FAQs ----
  await query("DELETE FROM faqs WHERE category = 'general'");
  for (let i = 0; i < legacy.faqs.length; i++) {
    const f = legacy.faqs[i];
    await query("INSERT INTO faqs (question, answer, category, sort_order) VALUES ($1,$2,'general',$3)",
      [f.q, f.a, i]);
  }
  console.log(`[seed-content] ✔ ${legacy.faqs.length} FAQs`);

  // ---- Support options ----
  await query("DELETE FROM support_options");
  for (let i = 0; i < legacy.supportOptions.length; i++) {
    const o = legacy.supportOptions[i];
    await query("INSERT INTO support_options (icon, title, description, sort_order) VALUES ($1,$2,$3,$4)",
      [o.icon, o.title, o.description, i]);
  }
  console.log(`[seed-content] ✔ ${legacy.supportOptions.length} support options`);

  console.log("[seed-content] ✔ Migration complete. The database is now the source of truth.");
  await pool.end();
}

run().catch((err) => {
  console.error("[seed-content] ✘ Failed:", err);
  process.exit(1);
});
