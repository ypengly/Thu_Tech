// server/src/config/resources.js
// Single source of truth describing every "simple" CMS resource: which
// database columns exist, how to build its CRUD controller, and how the
// generic admin UI should render its list table and edit form. Adding a
// brand-new field to a resource means editing ONE array here — the API,
// validation whitelist, and admin form all update automatically.

const RESOURCES = {
  services: {
    label: "Services", table: "services", permission: "services",
    hasSlug: true, slugSource: "title", hasStatus: true,
    listColumns: ["title", "status", "sort_order"],
    searchFields: ["title", "short_description"],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug (URL)", type: "text", hint: "Auto-generated from title if left blank. Used in /services/:slug" },
      { key: "icon", label: "Icon (Lucide icon name)", type: "text", hint: "e.g. code-2, terminal-square, bot" },
      { key: "short_description", label: "Short Description", type: "textarea" },
      { key: "full_description", label: "Full Description", type: "richtext" },
      { key: "problems", label: "Problems We Solve", type: "list-text", hint: "One per line" },
      { key: "provide", label: "What We Provide", type: "list-text", hint: "One per line" },
      { key: "benefits", label: "Benefits", type: "list-text", hint: "One per line" },
      { key: "faqs", label: "Service FAQs", type: "list-qa" },
      { key: "featured_image_url", label: "Featured Image", type: "image" },
      { key: "seo_title", label: "SEO Title", type: "text" },
      { key: "seo_description", label: "SEO Description", type: "textarea" },
      { key: "status", label: "Status", type: "status" },
      { key: "sort_order", label: "Sort Order", type: "number" }
    ],
    jsonFields: ["problems", "provide", "benefits", "faqs"]
  },

  solutions: {
    label: "Solutions", table: "solutions", permission: "pages",
    hasSlug: true, slugSource: "title", hasStatus: true,
    listColumns: ["title", "status", "sort_order"],
    searchFields: ["title", "description"],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text" },
      { key: "icon", label: "Icon (Lucide icon name)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "items", label: "Items", type: "list-text", hint: "One per line" },
      { key: "status", label: "Status", type: "status" },
      { key: "sort_order", label: "Sort Order", type: "number" }
    ],
    jsonFields: ["items"]
  },

  projects: {
    label: "Projects", table: "projects", permission: "projects",
    hasSlug: true, slugSource: "name", hasStatus: true,
    listColumns: ["name", "category", "is_featured", "status", "sort_order"],
    searchFields: ["name", "description", "category"],
    fields: [
      { key: "name", label: "Project Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", hint: "Used in /projects/:slug" },
      { key: "description", label: "Short Description", type: "textarea" },
      { key: "long_description", label: "Long Description", type: "richtext" },
      { key: "category", label: "Category", type: "text" },
      { key: "filter_tag", label: "Filter Tag", type: "select", options: ["web-application", "business", "mobile", "education"] },
      { key: "technologies", label: "Technologies", type: "list-text", hint: "One per line" },
      { key: "client_name", label: "Client", type: "text" },
      { key: "project_date", label: "Project Date", type: "date" },
      { key: "featured_image_url", label: "Featured Image", type: "image" },
      { key: "gallery", label: "Gallery Images", type: "list-text", hint: "One image URL per line" },
      { key: "project_url", label: "Live Project URL", type: "text" },
      { key: "case_study", label: "Case Study", type: "richtext" },
      { key: "results_impact", label: "Results / Impact", type: "textarea" },
      { key: "is_featured", label: "Featured Project", type: "boolean" },
      { key: "seo_title", label: "SEO Title", type: "text" },
      { key: "seo_description", label: "SEO Description", type: "textarea" },
      { key: "status", label: "Status", type: "status" },
      { key: "sort_order", label: "Sort Order", type: "number" }
    ],
    jsonFields: ["technologies", "gallery"]
  },

  products: {
    label: "Products", table: "products", permission: "products",
    hasSlug: true, slugSource: "name", hasStatus: true,
    listColumns: ["name", "status", "sort_order"],
    searchFields: ["name", "tagline", "description"],
    fields: [
      { key: "name", label: "Product Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "features", label: "Features", type: "list-text", hint: "One per line" },
      { key: "screenshots", label: "Screenshots", type: "list-text", hint: "One image URL per line" },
      { key: "icon", label: "Icon (Lucide icon name)", type: "text" },
      { key: "logo_url", label: "Logo", type: "image" },
      { key: "pricing", label: "Pricing Label", type: "text" },
      { key: "cta_label", label: "Call-to-Action Label", type: "text" },
      { key: "product_url", label: "Product URL", type: "text" },
      { key: "seo_title", label: "SEO Title", type: "text" },
      { key: "seo_description", label: "SEO Description", type: "textarea" },
      { key: "status", label: "Status", type: "status" },
      { key: "sort_order", label: "Sort Order", type: "number" }
    ],
    jsonFields: ["features", "screenshots"]
  },

  team: {
    label: "Team Members", table: "team_members", permission: "team",
    hasSlug: false, hasStatus: true,
    listColumns: ["name", "position", "status", "sort_order"],
    searchFields: ["name", "position"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "position", label: "Position", type: "text" },
      { key: "bio", label: "Biography", type: "textarea" },
      { key: "photo_url", label: "Photo", type: "image" },
      { key: "status", label: "Status", type: "status" },
      { key: "sort_order", label: "Sort Order", type: "number" }
    ],
    jsonFields: []
  },

  testimonials: {
    label: "Testimonials", table: "testimonials", permission: "testimonials",
    hasSlug: false, hasStatus: true,
    listColumns: ["client_name", "company", "is_featured", "status", "sort_order"],
    searchFields: ["client_name", "company", "quote"],
    fields: [
      { key: "client_name", label: "Client Name", type: "text", required: true },
      { key: "company", label: "Company", type: "text" },
      { key: "position", label: "Position", type: "text" },
      { key: "quote", label: "Quote", type: "textarea", required: true },
      { key: "photo_url", label: "Photo", type: "image" },
      { key: "rating", label: "Rating (1–5)", type: "number" },
      { key: "is_featured", label: "Featured", type: "boolean" },
      { key: "status", label: "Status", type: "status" },
      { key: "sort_order", label: "Sort Order", type: "number" }
    ],
    jsonFields: []
  },

  clients: {
    label: "Clients", table: "clients", permission: "pages",
    hasSlug: false, hasStatus: true,
    listColumns: ["name", "status", "sort_order"],
    searchFields: ["name"],
    fields: [
      { key: "name", label: "Client Name", type: "text", required: true },
      { key: "logo_url", label: "Logo", type: "image" },
      { key: "website", label: "Website", type: "text" },
      { key: "status", label: "Status", type: "status" },
      { key: "sort_order", label: "Sort Order", type: "number" }
    ],
    jsonFields: []
  },

  careers: {
    label: "Careers", table: "careers", permission: "careers",
    hasSlug: true, slugSource: "title", hasStatus: true,
    listColumns: ["title", "location", "employment_type", "status"],
    searchFields: ["title", "department", "location"],
    fields: [
      { key: "title", label: "Job Title", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text" },
      { key: "department", label: "Department", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "employment_type", label: "Employment Type", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "responsibilities", label: "Responsibilities", type: "list-text", hint: "One per line" },
      { key: "requirements", label: "Requirements", type: "list-text", hint: "One per line" },
      { key: "qualifications", label: "Qualifications", type: "list-text", hint: "One per line" },
      { key: "benefits", label: "Benefits", type: "list-text", hint: "One per line" },
      { key: "deadline", label: "Application Deadline", type: "date" },
      { key: "status", label: "Status", type: "select", options: ["draft", "published", "closed"] },
      { key: "sort_order", label: "Sort Order", type: "number" }
    ],
    jsonFields: ["responsibilities", "requirements", "qualifications", "benefits"]
  },

  blog: {
    label: "Blog Posts", table: "blog_posts", permission: "blog",
    hasSlug: true, slugSource: "title", hasStatus: true,
    listColumns: ["title", "is_featured", "status", "published_at"],
    searchFields: ["title", "excerpt"],
    orderBy: "published_at DESC NULLS LAST, created_at DESC",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", hint: "Used in /blog/:slug" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "content_html", label: "Article Content", type: "richtext" },
      { key: "category_id", label: "Category ID", type: "text", hint: "See Blog Categories for IDs" },
      { key: "author_name_override", label: "Author Name", type: "text" },
      { key: "tags", label: "Tags", type: "list-text", hint: "One per line" },
      { key: "featured_image_url", label: "Featured Image", type: "image" },
      { key: "is_featured", label: "Featured Article", type: "boolean" },
      { key: "seo_title", label: "SEO Title", type: "text" },
      { key: "seo_description", label: "SEO Description", type: "textarea" },
      { key: "og_image_url", label: "Open Graph Image", type: "image" },
      { key: "status", label: "Status", type: "select", options: ["draft", "published", "scheduled"] },
      { key: "published_at", label: "Publish Date", type: "datetime" }
    ],
    jsonFields: ["tags"]
  },

  blog_categories: {
    label: "Blog Categories", table: "blog_categories", permission: "blog",
    hasSlug: true, slugSource: "name", hasStatus: false,
    listColumns: ["name", "slug"],
    searchFields: ["name"],
    orderBy: "name ASC",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text" }
    ],
    jsonFields: []
  },

  faqs: {
    label: "FAQs", table: "faqs", permission: "faqs",
    hasSlug: false, hasStatus: true,
    listColumns: ["question", "category", "status", "sort_order"],
    searchFields: ["question", "answer"],
    fields: [
      { key: "question", label: "Question", type: "text", required: true },
      { key: "answer", label: "Answer", type: "textarea", required: true },
      { key: "category", label: "Category", type: "text", hint: "'general' or a service slug" },
      { key: "status", label: "Status", type: "status" },
      { key: "sort_order", label: "Sort Order", type: "number" }
    ],
    jsonFields: []
  },

  values: {
    label: "Core Values", table: "company_values", permission: "pages",
    hasSlug: false, hasStatus: false,
    listColumns: ["title", "sort_order"],
    searchFields: ["title"],
    fields: [
      { key: "icon", label: "Icon (Lucide icon name)", type: "text" },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" }
    ],
    jsonFields: []
  },

  why_choose_us: {
    label: "Why Choose Us", table: "why_choose_us", permission: "pages",
    hasSlug: false, hasStatus: false,
    listColumns: ["title", "sort_order"],
    searchFields: ["title"],
    fields: [
      { key: "icon", label: "Icon (Lucide icon name)", type: "text" },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" }
    ],
    jsonFields: []
  },

  process_steps: {
    label: "Process Steps", table: "process_steps", permission: "pages",
    hasSlug: false, hasStatus: false,
    listColumns: ["step_number", "title", "sort_order"],
    searchFields: ["title"],
    fields: [
      { key: "step_number", label: "Step Number (e.g. 01)", type: "text", required: true },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" }
    ],
    jsonFields: []
  },

  stats: {
    label: "Statistics", table: "stats", permission: "pages",
    hasSlug: false, hasStatus: false,
    listColumns: ["label", "value", "sort_order"],
    searchFields: ["label"],
    fields: [
      { key: "label", label: "Label", type: "text", required: true },
      { key: "value", label: "Value", type: "text", required: true },
      { key: "sort_order", label: "Sort Order", type: "number" }
    ],
    jsonFields: []
  },

  support_options: {
    label: "Support Options", table: "support_options", permission: "pages",
    hasSlug: false, hasStatus: false,
    listColumns: ["title", "sort_order"],
    searchFields: ["title"],
    fields: [
      { key: "icon", label: "Icon (Lucide icon name)", type: "text" },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" }
    ],
    jsonFields: []
  }
};

/** Every writable column across a resource's fields — the mass-assignment whitelist. */
function allowedFieldsFor(resourceKey) {
  const r = RESOURCES[resourceKey];
  return r.fields.map((f) => f.key);
}

module.exports = { RESOURCES, allowedFieldsFor };
