/* ==========================================================================
   THU TECH COM — SHARED COMPONENTS (Navbar / Footer / Helpers)
   These render once per page from js/content.js, so header/footer content
   (logo, nav, contact info, social links) only needs to be edited in ONE
   place: js/content.js
   ========================================================================== */

const NAV_ITEMS = [
  { label: "Home", href: "index.html" },
  { label: "About", href: "about.html" },
  { label: "Services", href: "services.html" },
  { label: "Solutions", href: "solutions.html" },
  { label: "Projects", href: "projects.html" },
  { label: "Products", href: "products.html" },
  { label: "Careers", href: "careers.html" },
  { label: "Contact", href: "contact.html" }
];

function brandMarkHTML(size = "text-2xl") {
  return `<span class="brand-mark ${size}"><span class="b-th">Th</span><span class="b-u">u</span><span class="b-rest"> Tech com</span></span>`;
}

function currentPage() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  return path;
}

function renderHeader() {
  const current = currentPage();
  const links = NAV_ITEMS.map(item => `
    <a href="${item.href}" class="nav-link ${current === item.href ? "active" : ""}">${item.label}</a>
  `).join("");

  const mobileLinks = NAV_ITEMS.map(item => `
    <a href="${item.href}" class="block py-3 text-lg font-medium border-b border-gray-100 ${current === item.href ? "text-blue-600" : "text-gray-800"}">${item.label}</a>
  `).join("");

  const header = document.createElement("header");
  header.id = "site-header";
  header.innerHTML = `
    <div class="container-max flex items-center justify-between h-20">
      <a href="index.html" aria-label="${SITE_CONTENT.company.name} — Home" class="flex items-center">${brandMarkHTML()}</a>
      <nav class="hidden lg:flex items-center gap-8" aria-label="Primary">
        ${links}
      </nav>
      <div class="hidden lg:flex items-center gap-3">
        <a href="contact.html" class="btn btn-primary btn-sm">
          <i data-lucide="message-circle" class="w-4 h-4"></i> Contact Us
        </a>
      </div>
      <button id="mobile-menu-btn" class="lg:hidden p-2 -mr-2 text-gray-800" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        <i data-lucide="menu" class="w-7 h-7"></i>
      </button>
    </div>
    <div id="mobile-menu" class="fixed inset-y-0 right-0 w-[82%] max-w-sm bg-white z-50 lg:hidden shadow-2xl flex flex-col">
      <div class="flex items-center justify-between h-20 px-6 border-b border-gray-100">
        ${brandMarkHTML("text-xl")}
        <button id="mobile-menu-close" class="p-2 -mr-2 text-gray-800" aria-label="Close menu">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>
      </div>
      <nav class="flex-1 overflow-y-auto px-6 pt-2" aria-label="Mobile">
        ${mobileLinks}
      </nav>
      <div class="p-6 border-t border-gray-100">
        <a href="contact.html" class="btn btn-primary w-full">
          <i data-lucide="message-circle" class="w-4 h-4"></i> Contact Us
        </a>
      </div>
    </div>
    <div id="mobile-menu-overlay" class="fixed inset-0 bg-black/40 z-40 hidden lg:hidden"></div>
  `;
  document.body.prepend(header);

  // scroll shadow
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }, { passive: true });

  const menu = header.querySelector("#mobile-menu");
  const overlay = header.querySelector("#mobile-menu-overlay");
  const btn = header.querySelector("#mobile-menu-btn");
  const closeBtn = header.querySelector("#mobile-menu-close");

  function openMenu() {
    menu.classList.add("open");
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    btn.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    menu.classList.remove("open");
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
    btn.setAttribute("aria-expanded", "false");
  }
  btn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
}

function renderFooter() {
  const c = SITE_CONTENT.company;
  const year = new Date().getFullYear();

  const socialIcons = [
    { key: "facebook", icon: "facebook" },
    { key: "telegram", icon: "send" },
    { key: "linkedin", icon: "linkedin" },
    { key: "tiktok", icon: "music-2" },
    { key: "youtube", icon: "youtube" }
  ];

  const footer = document.createElement("footer");
  footer.className = "bg-[var(--ink)] text-gray-300";
  footer.innerHTML = `
    <div class="container-max py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
      <div class="col-span-2 md:col-span-1">
        <a href="index.html" class="inline-flex items-center mb-4">
          <span class="brand-mark text-xl"><span class="b-th">Th</span><span class="b-u">u</span><span class="text-white"> Tech com</span></span>
        </a>
        <p class="text-sm text-gray-400 leading-relaxed mb-5">${c.tagline}</p>
        <div class="flex gap-3">
          ${socialIcons.map(s => `
            <a href="${c.social[s.key]}" target="_blank" rel="noopener noreferrer" aria-label="${s.key}" class="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-colors">
              <i data-lucide="${s.icon}" class="w-4 h-4"></i>
            </a>`).join("")}
        </div>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-4">Company</h4>
        <ul class="space-y-3 text-sm">
          <li><a href="about.html" class="hover:text-white transition-colors">About Us</a></li>
          <li><a href="services.html" class="hover:text-white transition-colors">Services</a></li>
          <li><a href="projects.html" class="hover:text-white transition-colors">Projects</a></li>
          <li><a href="careers.html" class="hover:text-white transition-colors">Careers</a></li>
          <li><a href="contact.html" class="hover:text-white transition-colors">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-4">Services</h4>
        <ul class="space-y-3 text-sm">
          <li><a href="services.html#web-development" class="hover:text-white transition-colors">Web Development</a></li>
          <li><a href="services.html#software-development" class="hover:text-white transition-colors">Software Development</a></li>
          <li><a href="services.html#it-support" class="hover:text-white transition-colors">IT Support</a></li>
          <li><a href="services.html#ai-solutions" class="hover:text-white transition-colors">AI Solutions</a></li>
          <li><a href="services.html#business-automation" class="hover:text-white transition-colors">Business Automation</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-4">Support</h4>
        <ul class="space-y-3 text-sm">
          <li><a href="support.html" class="hover:text-white transition-colors">Help Center</a></li>
          <li><a href="support.html#faq" class="hover:text-white transition-colors">FAQ</a></li>
          <li><a href="support.html" class="hover:text-white transition-colors">Contact Support</a></li>
          <li><a href="#" class="hover:text-white transition-colors">Terms</a></li>
          <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/10">
      <div class="container-max py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <p>© ${year} ${c.name}. All Rights Reserved.</p>
        <p>${c.address} · <a href="mailto:${c.email}" class="hover:text-white">${c.email}</a></p>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}

function initIcons() {
  if (window.lucide) lucide.createIcons();
}

async function initPage() {
  // Wait for js/api-client.js to finish loading content from the CMS
  // backend (or fall back to offline content) before rendering anything
  // that depends on SITE_CONTENT.
  if (window.SITE_CONTENT_READY) await window.SITE_CONTENT_READY;
  renderHeader();
  renderFooter();
  initIcons();
  if (window.initScrollReveal) initScrollReveal();
  if (window.hideLoadingScreen) hideLoadingScreen();
  document.dispatchEvent(new CustomEvent("site-content-ready"));
}

document.addEventListener("DOMContentLoaded", initPage);
