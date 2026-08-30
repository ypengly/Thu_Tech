/* ==========================================================================
   THU TECH COM — API CLIENT
   Replaces the old static js/content.js. On every page load this fetches
   the live, published content from the CMS backend (GET /api/public/bootstrap)
   and exposes it as `window.SITE_CONTENT` — same shape as before, so every
   existing page script (which reads SITE_CONTENT.services, .projects, etc.)
   keeps working unchanged.

   `window.SITE_CONTENT_READY` is a Promise every page script awaits before
   rendering, since the data now arrives asynchronously over the network.

   If the API is unreachable (server not running, network error), the site
   falls back to the last-known static content below so the public pages
   still render something reasonable instead of a blank screen — this is
   the "graceful error state" for the public site.
   ========================================================================== */

const API_BASE = "/api";

// Minimal offline fallback — only used if the backend cannot be reached.
// Kept intentionally small; the database is the real source of truth.
const OFFLINE_FALLBACK_CONTENT = {
  company: {
    name: "Thu Tech com",
    tagline: "Technology that helps your business move forward.",
    shortDescription: "Thu Tech com is a technology company focused on creating practical, reliable, and affordable digital solutions.",
    email: "info@thutechcom.com", phone: "+855 XX XXX XXX", address: "Phnom Penh, Cambodia", hours: "Mon – Fri, 8:00 AM – 6:00 PM",
    social: { facebook: "#", telegram: "#", linkedin: "#", tiktok: "#", youtube: "#" }
  },
  stats: [{ label: "Projects Completed", value: "50+" }, { label: "Happy Clients", value: "30+" }, { label: "Years Experience", value: "5+" }, { label: "Technical Support", value: "24/7" }],
  mission: "To provide practical and innovative technology solutions.",
  vision: "To become a trusted technology partner.",
  story: "", values: [], whyChooseUs: [], processSteps: [],
  services: [], solutions: [], projects: [], products: [], team: [], testimonials: [],
  clients: [], careers: [], blog: [], faqs: [], supportOptions: []
};

async function fetchSiteContent() {
  try {
    const res = await fetch(`${API_BASE}/public/bootstrap`, { credentials: "same-origin" });
    if (!res.ok) throw new Error(`Bootstrap request failed: ${res.status}`);
    const data = await res.json();
    window.SITE_CONTENT = data;
    window.SITE_CONTENT_OFFLINE = false;
    return data;
  } catch (err) {
    console.warn("[api-client] Could not reach the CMS backend — showing offline fallback content.", err);
    window.SITE_CONTENT = OFFLINE_FALLBACK_CONTENT;
    window.SITE_CONTENT_OFFLINE = true;
    return OFFLINE_FALLBACK_CONTENT;
  }
}

// Kick off the fetch immediately; every page awaits this single shared promise.
window.SITE_CONTENT_READY = fetchSiteContent();

/** Reads a slug from a clean URL path (e.g. /services/web-development) or ?id= query param. */
function getSlugFromLocation(prefix) {
  const path = window.location.pathname;
  const marker = `/${prefix}/`;
  const idx = path.indexOf(marker);
  if (idx !== -1) {
    const slug = path.slice(idx + marker.length).replace(/\/$/, "");
    if (slug) return decodeURIComponent(slug);
  }
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

/** Small fetch helper for public API calls used by forms (contact/support/careers). */
async function apiPost(path, body, { isFormData = false } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "same-origin",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? body : JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Not found.");
  return data;
}
