/* ==========================================================================
   THU TECH COM ADMIN — SHARED SHELL (sidebar + topbar)
   Every admin page calls renderAdminShell(activeKey) at the top of its own
   script. It injects the sidebar nav + topbar into #admin-shell and fetches
   the current user for the "logged in as" display + role-based nav hiding.
   ========================================================================== */

const ADMIN_NAV = [
  { section: "Overview", items: [
    { key: "dashboard", label: "Dashboard", href: "/admin/index.html", icon: "layout-dashboard", permission: null }
  ]},
  { section: "Company", items: [
    { key: "settings", label: "Company Settings", href: "/admin/settings.html", icon: "settings", permission: "pages" },
    { key: "values", label: "Core Values", href: "/admin/resource.html?type=values", icon: "gem", permission: "pages" },
    { key: "why_choose_us", label: "Why Choose Us", href: "/admin/resource.html?type=why_choose_us", icon: "star", permission: "pages" },
    { key: "process_steps", label: "Process Steps", href: "/admin/resource.html?type=process_steps", icon: "list-ordered", permission: "pages" },
    { key: "stats", label: "Statistics", href: "/admin/resource.html?type=stats", icon: "bar-chart-3", permission: "pages" }
  ]},
  { section: "Content", items: [
    { key: "services", label: "Services", href: "/admin/resource.html?type=services", icon: "code-2", permission: "services" },
    { key: "solutions", label: "Solutions", href: "/admin/resource.html?type=solutions", icon: "puzzle", permission: "pages" },
    { key: "projects", label: "Projects", href: "/admin/resource.html?type=projects", icon: "folder-kanban", permission: "projects" },
    { key: "products", label: "Products", href: "/admin/resource.html?type=products", icon: "package", permission: "products" },
    { key: "team", label: "Team", href: "/admin/resource.html?type=team", icon: "users", permission: "team" },
    { key: "testimonials", label: "Testimonials", href: "/admin/resource.html?type=testimonials", icon: "quote", permission: "testimonials" },
    { key: "clients", label: "Clients", href: "/admin/resource.html?type=clients", icon: "building-2", permission: "pages" },
    { key: "faqs", label: "FAQs", href: "/admin/resource.html?type=faqs", icon: "circle-help", permission: "faqs" },
    { key: "support_options", label: "Support Page Options", href: "/admin/resource.html?type=support_options", icon: "life-buoy", permission: "pages" },
    { key: "media", label: "Media Library", href: "/admin/media.html", icon: "image", permission: "media" }
  ]},
  { section: "Blog", items: [
    { key: "blog", label: "Blog Posts", href: "/admin/resource.html?type=blog", icon: "newspaper", permission: "blog" },
    { key: "blog_categories", label: "Blog Categories", href: "/admin/resource.html?type=blog_categories", icon: "tag", permission: "blog" }
  ]},
  { section: "Careers", items: [
    { key: "careers", label: "Job Postings", href: "/admin/resource.html?type=careers", icon: "briefcase", permission: "careers" },
    { key: "applications", label: "Applications", href: "/admin/applications.html", icon: "file-user", permission: "applications" }
  ]},
  { section: "Inbox", items: [
    { key: "messages", label: "Contact Messages", href: "/admin/messages.html", icon: "mail", permission: "contact_messages" },
    { key: "support", label: "Support Requests", href: "/admin/support.html", icon: "life-buoy", permission: "support_requests" }
  ]}
];

// Mirrors server/src/middleware/auth.js ROLE_RESOURCES — used only to decide
// which nav links to SHOW. The backend re-checks every request regardless,
// so this is a UX convenience, never a security boundary.
const ROLE_RESOURCES_CLIENT = {
  content_manager: ["pages", "services", "projects", "products", "blog", "faqs", "team", "testimonials", "media"],
  hr_manager: ["careers", "applications"],
  support_manager: ["support_requests", "contact_messages"]
};

async function renderAdminShell(activeKey) {
  const shell = document.getElementById("admin-shell");
  const main = document.getElementById("admin-main");

  shell.innerHTML = `
    <div class="flex items-center gap-2 px-5 h-16 border-b border-gray-800">
      <span class="brand-mark text-lg"><span class="b-th" style="color:#60A5FA">Th</span><span class="b-u" style="color:#F87171">u</span><span style="color:#fff"> Tech com</span></span>
    </div>
    <div class="px-3 py-2 text-[11px] uppercase tracking-wider text-gray-500 font-semibold mt-1">Admin</div>
    <nav class="flex-1 overflow-y-auto px-2 pb-4" id="admin-nav"></nav>
    <div class="px-4 py-4 border-t border-gray-800" id="admin-user-box">
      <div class="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
    </div>
  `;

  let user;
  try {
    const res = await adminGet("/auth/me");
    user = res.user;
  } catch {
    return; // adminGet already redirects to login on 401
  }

  const roleAllows = (permission) =>
    permission === null || user.role === "super_admin" || (ROLE_RESOURCES_CLIENT[user.role] || []).includes(permission);

  const navEl = document.getElementById("admin-nav");
  navEl.innerHTML = ADMIN_NAV.map((section) => {
    const items = section.items.filter((item) => roleAllows(item.permission));
    if (!items.length) return "";
    return `
      <div class="mt-3">
        <p class="px-3 text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">${section.section}</p>
        ${items.map((item) => `
          <a href="${item.href}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeKey === item.key ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"}">
            <i data-lucide="${item.icon}" class="w-4 h-4 flex-shrink-0"></i> ${item.label}
          </a>`).join("")}
      </div>`;
  }).join("");

  document.getElementById("admin-user-box").innerHTML = `
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">${user.name.charAt(0)}</div>
      <div class="min-w-0">
        <p class="text-sm font-medium text-white truncate">${user.name}</p>
        <p class="text-xs text-gray-500 truncate">${user.role.replace("_", " ")}</p>
      </div>
    </div>
    <button id="admin-logout-btn" class="mt-3 w-full text-xs font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg py-2 transition-colors">Log Out</button>
  `;
  document.getElementById("admin-logout-btn").addEventListener("click", async () => {
    await adminPost("/auth/logout", {});
    window.location.href = "/admin/login.html";
  });

  if (window.lucide) lucide.createIcons();
  main.classList.remove("hidden");
  document.getElementById("admin-loading")?.classList.add("hidden");
}

/**
 * Initialize Lucide icons in dynamically rendered content
 */
function initIcons() {
  if (window.lucide) lucide.createIcons();
}

/**
 * Debounce utility function for rate-limiting callbacks
 */
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
