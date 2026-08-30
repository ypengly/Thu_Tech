/* ==========================================================================
   THU TECH COM — SITE INTERACTIONS
   ========================================================================== */

/* ---------- Loading screen ---------- */
function hideLoadingScreen() {
  const el = document.getElementById("loading-screen");
  if (!el) return;
  setTimeout(() => el.classList.add("hide"), 250);
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || items.length === 0) {
    items.forEach(i => i.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach(i => io.observe(i));
}

/* ---------- Toast ---------- */
function showToast(message, icon = "check-circle-2") {
  let toast = document.getElementById("global-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "global-toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5 text-green-400"></i><span>${message}</span>`;
  if (window.lucide) lucide.createIcons();
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 4200);
}

/* ---------- FAQ Accordion ---------- */
function initAccordion(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.addEventListener("click", (e) => {
    const trigger = e.target.closest(".accordion-trigger");
    if (!trigger) return;
    const item = trigger.closest(".accordion-item");
    const wasOpen = item.classList.contains("open");
    container.querySelectorAll(".accordion-item.open").forEach(i => {
      if (i !== item) { i.classList.remove("open"); i.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false"); }
    });
    item.classList.toggle("open", !wasOpen);
    trigger.setAttribute("aria-expanded", String(!wasOpen));
  });
}

/* ---------- Generic form validation ---------- */
function validateForm(form) {
  let valid = true;
  form.querySelectorAll("[required]").forEach(field => {
    const value = field.value.trim();
    let fieldValid = value.length > 0;
    if (field.type === "email" && value) {
      fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    field.classList.toggle("invalid", !fieldValid);
    if (!fieldValid) valid = false;
  });
  return valid;
}

function bindLiveValidation(form) {
  form.querySelectorAll("[required]").forEach(field => {
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) {
        const value = field.value.trim();
        let fieldValid = value.length > 0;
        if (field.type === "email" && value) fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        field.classList.toggle("invalid", !fieldValid);
      }
    });
  });
}

/* ---------- Contact / support form submit handler ---------- */
function initFormHandler(formId, successMessage) {
  const form = document.getElementById(formId);
  if (!form) return;
  bindLiveValidation(form);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(form)) {
      showToast("Please fill in all required fields correctly.", "alert-triangle");
      return;
    }
    const successBox = document.getElementById(formId + "-success");
    form.classList.add("hidden");
    if (successBox) successBox.classList.remove("hidden");
    showToast(successMessage);
    form.reset();
  });
}

/* ---------- Simple client-side filter (Projects page) ---------- */
function initFilters(filterBarSelector, itemSelector, dataAttr = "data-filter") {
  const bar = document.querySelector(filterBarSelector);
  if (!bar) return;
  bar.addEventListener("click", (e) => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;
    bar.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    const filter = pill.getAttribute("data-value");
    document.querySelectorAll(itemSelector).forEach(item => {
      const tag = item.getAttribute(dataAttr);
      const show = filter === "all" || tag === filter;
      item.style.display = show ? "" : "none";
    });
  });
}

/* ---------- Number count-up for stats ---------- */
function initCountUp(selector = "[data-countup]") {
  const els = document.querySelectorAll(selector);
  if (!els.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const match = raw.match(/(\d+)/);
      if (match) {
        const target = parseInt(match[1], 10);
        const suffix = raw.replace(match[1], "");
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current + suffix;
        }, 30);
      }
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  els.forEach(el => io.observe(el));
}
