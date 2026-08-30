/* ==========================================================================
   THU TECH COM ADMIN — API CLIENT
   Thin wrapper around fetch() for the admin dashboard. Every admin page
   uses this instead of calling fetch() directly, so auth/error handling
   stays in one place.
   ========================================================================== */

const ADMIN_API_BASE = "/api";

async function adminApi(path, { method = "GET", body, isFormData = false } = {}) {
  const opts = {
    method,
    credentials: "same-origin",
    headers: isFormData ? {} : { "Content-Type": "application/json" }
  };
  if (body !== undefined) opts.body = isFormData ? body : JSON.stringify(body);

  const res = await fetch(`${ADMIN_API_BASE}${path}`, opts);

  if (res.status === 401 && path !== "/auth/login") {
    window.location.href = "/admin/login.html";
    throw new Error("Session expired. Redirecting to login…");
  }

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed (${res.status})`);
  }
  return data;
}

const adminGet = (path) => adminApi(path);
const adminPost = (path, body, opts = {}) => adminApi(path, { method: "POST", body, ...opts });
const adminPut = (path, body) => adminApi(path, { method: "PUT", body });
const adminPatch = (path, body) => adminApi(path, { method: "PATCH", body });
const adminDelete = (path) => adminApi(path, { method: "DELETE" });

/** Small toast helper reused across admin pages (mirrors the public site's). */
function adminToast(message, isError = false) {
  let toast = document.getElementById("admin-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "admin-toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.style.background = isError ? "#EF4444" : "#111827";
  toast.innerHTML = `<span>${message}</span>`;
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 4000);
}
