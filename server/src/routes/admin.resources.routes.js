// server/src/routes/admin.resources.routes.js
// Mounts /api/admin/:resource CRUD routes for every entry in the resource
// registry (server/src/config/resources.js), using the generic CRUD
// controller. This is what lets the admin dashboard manage Services,
// Projects, Products, Blog, Careers, Team, Testimonials, Clients, FAQs,
// Solutions, and page-content blocks through ONE code path.

const express = require("express");
const { RESOURCES, allowedFieldsFor } = require("../config/resources");
const { createCrudController } = require("../controllers/genericCrud");
const { requireAuth, requireResource } = require("../middleware/auth");

const router = express.Router();

router.get("/meta/resources", requireAuth, (req, res) => {
  // Lets the generic admin UI build its tables/forms from this config
  // instead of hard-coding field lists in the frontend.
  res.json({ data: RESOURCES });
});

for (const [key, cfg] of Object.entries(RESOURCES)) {
  const controller = createCrudController({
    table: cfg.table,
    allowedFields: allowedFieldsFor(key),
    jsonFields: cfg.jsonFields || [],
    searchFields: cfg.searchFields || [],
    orderBy: cfg.orderBy || "sort_order ASC, created_at DESC",
    hasSlug: cfg.hasSlug,
    slugSource: cfg.slugSource,
    hasStatus: cfg.hasStatus
  });

  const guard = requireResource(cfg.permission);
  const base = `/${key}`;

  router.get(base, requireAuth, guard, controller.list);
  router.get(`${base}/:id`, requireAuth, guard, controller.getById);
  router.post(base, requireAuth, guard, controller.create);
  router.put(`${base}/:id`, requireAuth, guard, controller.update);
  router.delete(`${base}/:id`, requireAuth, guard, controller.remove);
  router.post(`${base}/reorder`, requireAuth, guard, controller.reorder);
  if (cfg.hasStatus) {
    router.patch(`${base}/:id/status`, requireAuth, guard, controller.setStatus);
  }
}

module.exports = router;
