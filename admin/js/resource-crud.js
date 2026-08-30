/* ==========================================================================
   THU TECH COM ADMIN — GENERIC RESOURCE CRUD
   Renders a list table + create/edit modal for ANY resource described in
   server/src/config/resources.js (fetched via /api/admin/meta/resources).
   This is what lets one admin/resource.html?type=... page manage Services,
   Projects, Products, Team, Testimonials, Clients, Careers, Blog, FAQs,
   Solutions, and the small page-content blocks (Values, Why Choose Us,
   Process Steps, Stats) without duplicating a form for each.
   ========================================================================== */

let RESOURCE_META_CACHE = null;

async function getResourceMeta(type) {
  if (!RESOURCE_META_CACHE) {
    const res = await adminGet("/admin/meta/resources");
    RESOURCE_META_CACHE = res.data;
  }
  const meta = RESOURCE_META_CACHE[type];
  if (!meta) throw new Error(`Unknown resource type: ${type}`);
  return meta;
}

function fieldToColumnLabel(meta, key) {
  const f = meta.fields.find((x) => x.key === key);
  return f ? f.label : key;
}

function renderCellValue(row, key) {
  const val = row[key];
  if (val === null || val === undefined || val === "") return `<span class="text-gray-300">—</span>`;
  if (typeof val === "boolean") return val ? `<i data-lucide="check" class="w-4 h-4 text-green-600"></i>` : `<i data-lucide="x" class="w-4 h-4 text-gray-300"></i>`;
  if (key === "status") return `<span class="status-pill status-${val}">${val}</span>`;
  if (typeof val === "string" && val.length > 60) return escapeHtml(val.slice(0, 60)) + "…";
  return escapeHtml(String(val));
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function renderResourceList(type, container) {
  const meta = await getResourceMeta(type);
  document.title = `${meta.label} | Thu Tech com Admin`;
  document.getElementById("page-title").textContent = meta.label;
  const topbarTitle = document.getElementById("topbar-title");
  if (topbarTitle) topbarTitle.textContent = meta.label;

  container.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div class="relative w-full sm:max-w-xs">
        <i data-lucide="search" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input id="res-search" type="text" placeholder="Search ${meta.label.toLowerCase()}..." class="field-input pl-9" />
      </div>
      <div class="flex items-center gap-2">
        ${meta.hasStatus ? `
          <select id="res-status-filter" class="field-input" style="width:auto">
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>` : ""}
        <button id="res-new-btn" class="btn btn-primary btn-sm"><i data-lucide="plus" class="w-4 h-4"></i> New ${meta.label.replace(/s$/, "")}</button>
      </div>
    </div>
    <div class="card overflow-x-auto">
      <table class="admin-table">
        <thead><tr>${meta.listColumns.map((c) => `<th>${fieldToColumnLabel(meta, c)}</th>`).join("")}<th></th></tr></thead>
        <tbody id="res-table-body"></tbody>
      </table>
    </div>
    <div id="res-empty" class="hidden text-center py-16 text-[var(--muted)]">No records yet — click "New ${meta.label.replace(/s$/, "")}" to add one.</div>
    <div id="res-pagination" class="flex items-center justify-between mt-4 text-sm text-[var(--muted)]"></div>
  `;

  let currentPage = 1;

  async function load() {
    const search = document.getElementById("res-search").value;
    const status = document.getElementById("res-status-filter")?.value || "";
    const params = new URLSearchParams({ page: currentPage, pageSize: 20 });
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    const { data, pagination } = await adminGet(`/admin/${type}?${params.toString()}`);
    const tbody = document.getElementById("res-table-body");
    document.getElementById("res-empty").classList.toggle("hidden", data.length > 0);

    tbody.innerHTML = data.map((row) => `
      <tr>
        ${meta.listColumns.map((c) => `<td>${renderCellValue(row, c)}</td>`).join("")}
        <td class="text-right whitespace-nowrap">
          ${meta.hasStatus ? `<button class="text-xs font-medium text-blue-600 hover:underline mr-3 toggle-status-btn" data-id="${row.id}" data-status="${row.status}">${row.status === "published" ? "Unpublish" : "Publish"}</button>` : ""}
          <button class="text-xs font-medium text-blue-600 hover:underline mr-3 edit-btn" data-id="${row.id}">Edit</button>
          <button class="text-xs font-medium text-red-600 hover:underline delete-btn" data-id="${row.id}">Delete</button>
        </td>
      </tr>`).join("");

    document.getElementById("res-pagination").innerHTML = `
      <span>${pagination.total} total</span>
      <div class="flex items-center gap-2">
        <button id="page-prev" class="btn btn-outline btn-sm" ${currentPage <= 1 ? "disabled" : ""}>Previous</button>
        <span>Page ${pagination.page} of ${pagination.totalPages}</span>
        <button id="page-next" class="btn btn-outline btn-sm" ${currentPage >= pagination.totalPages ? "disabled" : ""}>Next</button>
      </div>`;

    document.getElementById("page-prev")?.addEventListener("click", () => { currentPage--; load(); });
    document.getElementById("page-next")?.addEventListener("click", () => { currentPage++; load(); });

    initIcons();
  }

  container.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".edit-btn");
    const deleteBtn = e.target.closest(".delete-btn");
    const toggleBtn = e.target.closest(".toggle-status-btn");

    if (editBtn) openResourceForm(type, meta, editBtn.dataset.id, load);
    if (deleteBtn) {
      if (!confirm("Delete this record? This cannot be undone.")) return;
      try {
        await adminDelete(`/admin/${type}/${deleteBtn.dataset.id}`);
        adminToast("Deleted successfully.");
        load();
      } catch (err) { adminToast(err.message, true); }
    }
    if (toggleBtn) {
      const newStatus = toggleBtn.dataset.status === "published" ? "draft" : "published";
      try {
        await adminPatch(`/admin/${type}/${toggleBtn.dataset.id}/status`, { status: newStatus });
        adminToast(`Status updated to ${newStatus}.`);
        load();
      } catch (err) { adminToast(err.message, true); }
    }
  });

  document.getElementById("res-new-btn").addEventListener("click", () => openResourceForm(type, meta, null, load));
  document.getElementById("res-search").addEventListener("input", debounce(() => { currentPage = 1; load(); }, 300));
  document.getElementById("res-status-filter")?.addEventListener("change", () => { currentPage = 1; load(); });

  await load();

  // Support "?new=1" deep link from dashboard Quick Actions
  if (new URLSearchParams(window.location.search).get("new") === "1") {
    openResourceForm(type, meta, null, load);
  }
}

// ---------------------------------------------------------------------
// Create / Edit modal form — built dynamically from meta.fields
// ---------------------------------------------------------------------
async function openResourceForm(type, meta, id, onSaved) {
  let record = {};
  if (id) {
    const { data } = await adminGet(`/admin/${type}/${id}`);
    record = data;
  }

  const overlay = document.createElement("div");
  overlay.className = "admin-modal-overlay";
  overlay.innerHTML = `
    <div class="admin-modal">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 class="font-display font-semibold text-lg">${id ? "Edit" : "New"} ${meta.label.replace(/s$/, "")}</h2>
        <button id="modal-close-btn" class="p-1.5 text-gray-400 hover:text-gray-700"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="resource-form" class="p-6 space-y-5 max-h-[70vh] overflow-y-auto"></form>
      <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
        <button id="modal-cancel-btn" class="btn btn-outline btn-sm" type="button">Cancel</button>
        <button id="modal-save-btn" class="btn btn-primary btn-sm" type="submit" form="resource-form">Save</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const form = overlay.querySelector("#resource-form");
  form.innerHTML = meta.fields.map((f) => renderFieldInput(f, record)).join("");
  initIcons();
  initFieldWidgets(overlay, meta, record);

  const close = () => overlay.remove();
  overlay.querySelector("#modal-close-btn").addEventListener("click", close);
  overlay.querySelector("#modal-cancel-btn").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = collectFormData(overlay, meta);
    const saveBtn = overlay.querySelector("#modal-save-btn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving…";
    try {
      if (id) await adminPut(`/admin/${type}/${id}`, payload);
      else await adminPost(`/admin/${type}`, payload);
      adminToast("Saved successfully.");
      close();
      onSaved();
    } catch (err) {
      adminToast(err.message, true);
      saveBtn.disabled = false;
      saveBtn.textContent = "Save";
    }
  });
}

function renderFieldInput(f, record) {
  const value = record[f.key];
  const req = f.required ? "required" : "";
  const hint = f.hint ? `<p class="text-xs text-[var(--muted)] mt-1">${f.hint}</p>` : "";
  const label = `<label class="field-label">${f.label}${f.required ? ' <span class="text-red-500">*</span>' : ""}</label>`;

  switch (f.type) {
    case "textarea":
      return `<div>${label}<textarea class="field-input" data-field="${f.key}" rows="3" ${req}>${escapeHtml(value || "")}</textarea>${hint}</div>`;
    case "richtext":
      return `<div>${label}<div class="richtext-editor border border-gray-200 rounded-lg" data-field="${f.key}">
                <div class="richtext-toolbar flex gap-1 border-b border-gray-200 p-2 bg-gray-50 rounded-t-lg"></div>
                <div class="richtext-content p-3 min-h-[160px] text-sm focus:outline-none" contenteditable="true">${value || ""}</div>
              </div>${hint}</div>`;
    case "number":
      return `<div>${label}<input class="field-input" type="number" data-field="${f.key}" value="${value ?? ""}" ${req} /></div>`;
    case "date":
      return `<div>${label}<input class="field-input" type="date" data-field="${f.key}" value="${value ? String(value).slice(0, 10) : ""}" ${req} /></div>`;
    case "datetime":
      return `<div>${label}<input class="field-input" type="datetime-local" data-field="${f.key}" value="${value ? String(value).slice(0, 16) : ""}" ${req} /></div>`;
    case "boolean":
      return `<label class="flex items-center gap-2 text-sm font-medium"><input type="checkbox" data-field="${f.key}" ${value ? "checked" : ""} class="w-4 h-4" /> ${f.label}</label>`;
    case "select":
      return `<div>${label}<select class="field-input" data-field="${f.key}" ${req}>${(f.options || []).map((o) => `<option value="${o}" ${value === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>`;
    case "status":
      return `<div>${label}<select class="field-input" data-field="${f.key}"><option value="draft" ${value === "draft" ? "selected" : ""}>Draft</option><option value="published" ${value === "published" ? "selected" : ""}>Published</option></select></div>`;
    case "image":
      return `<div>${label}<div class="image-field" data-field="${f.key}">
                <div class="flex items-center gap-3">
                  <div class="image-preview w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    ${value ? `<img src="${value}" class="w-full h-full object-cover" />` : `<i data-lucide="image" class="w-5 h-5 text-gray-300"></i>`}
                  </div>
                  <input class="field-input image-url-input" type="text" placeholder="Image URL, or upload below" value="${value || ""}" />
                </div>
                <input type="file" accept="image/*" class="image-upload-input mt-2 text-xs" />
              </div>${hint}</div>`;
    case "list-text":
      return `<div>${label}<textarea class="field-input" data-field="${f.key}" data-listtext="true" rows="4" placeholder="One item per line">${(value || []).join("\n")}</textarea>${hint}</div>`;
    case "list-qa":
      return `<div>${label}<div class="qa-repeater" data-field="${f.key}" data-qa="true">${(value || []).map((item) => renderQaRow(item)).join("")}</div>
                <button type="button" class="btn btn-outline btn-sm add-qa-row mt-2">+ Add Question</button>${hint}</div>`;
    default:
      return `<div>${label}<input class="field-input" type="text" data-field="${f.key}" value="${escapeHtml(value || "")}" ${req} /></div>`;
  }
}

function renderQaRow(item = { q: "", a: "" }) {
  return `
    <div class="list-repeater-row border border-gray-100 rounded-lg p-3 bg-gray-50 mb-2">
      <input class="field-input mb-2 qa-q" type="text" placeholder="Question" value="${escapeHtml(item.q || "")}" />
      <textarea class="field-input qa-a" rows="2" placeholder="Answer">${escapeHtml(item.a || "")}</textarea>
      <button type="button" class="text-xs text-red-600 mt-2 remove-qa-row">Remove</button>
    </div>`;
}

function initFieldWidgets(overlay, meta, record) {
  // Rich text toolbar (simple, dependency-free contenteditable formatting)
  overlay.querySelectorAll(".richtext-editor").forEach((editor) => {
    const toolbar = editor.querySelector(".richtext-toolbar");
    const content = editor.querySelector(".richtext-content");
    const buttons = [
      { cmd: "bold", icon: "bold" }, { cmd: "italic", icon: "italic" }, { cmd: "underline", icon: "underline" },
      { cmd: "insertUnorderedList", icon: "list" }, { cmd: "insertOrderedList", icon: "list-ordered" },
      { cmd: "formatBlock:h2", icon: "heading-2" }, { cmd: "createLink", icon: "link" }
    ];
    toolbar.innerHTML = buttons.map((b) => `<button type="button" class="p-1.5 rounded hover:bg-gray-200" data-cmd="${b.cmd}"><i data-lucide="${b.icon}" class="w-4 h-4"></i></button>`).join("");
    toolbar.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      content.focus();
      if (btn.dataset.cmd === "createLink") {
        const url = prompt("Link URL:");
        if (url) document.execCommand("createLink", false, url);
      } else if (btn.dataset.cmd.startsWith("formatBlock:")) {
        document.execCommand("formatBlock", false, btn.dataset.cmd.split(":")[1]);
      } else {
        document.execCommand(btn.dataset.cmd, false, null);
      }
    });
    initIcons();
  });

  // QA repeater add/remove
  overlay.querySelectorAll(".qa-repeater").forEach((repeater) => {
    const wrapper = repeater.closest("div").parentElement;
    wrapper.querySelector(".add-qa-row")?.addEventListener("click", () => {
      repeater.insertAdjacentHTML("beforeend", renderQaRow());
    });
  });
  overlay.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-qa-row")) {
      e.target.closest(".list-repeater-row").remove();
    }
  });

  // Image upload
  overlay.querySelectorAll(".image-field").forEach((field) => {
    const urlInput = field.querySelector(".image-url-input");
    const fileInput = field.querySelector(".image-upload-input");
    const preview = field.querySelector(".image-preview");
    fileInput.addEventListener("change", async () => {
      const file = fileInput.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const { data } = await adminPost("/admin/media/upload", formData, { isFormData: true });
        urlInput.value = data.url;
        preview.innerHTML = `<img src="${data.url}" class="w-full h-full object-cover" />`;
        adminToast("Image uploaded.");
      } catch (err) {
        adminToast(err.message, true);
      }
    });
  });
}

function collectFormData(overlay, meta) {
  const payload = {};
  meta.fields.forEach((f) => {
    if (f.type === "boolean") {
      const el = overlay.querySelector(`[data-field="${f.key}"]`);
      payload[f.key] = !!el?.checked;
    } else if (f.type === "richtext") {
      const el = overlay.querySelector(`.richtext-editor[data-field="${f.key}"] .richtext-content`);
      payload[f.key] = el ? el.innerHTML : "";
    } else if (f.type === "list-text") {
      const el = overlay.querySelector(`[data-field="${f.key}"][data-listtext]`);
      payload[f.key] = el ? el.value.split("\n").map((s) => s.trim()).filter(Boolean) : [];
    } else if (f.type === "list-qa") {
      const repeater = overlay.querySelector(`.qa-repeater[data-field="${f.key}"]`);
      const rows = repeater ? [...repeater.querySelectorAll(".list-repeater-row")] : [];
      payload[f.key] = rows.map((row) => ({
        q: row.querySelector(".qa-q").value.trim(),
        a: row.querySelector(".qa-a").value.trim()
      })).filter((r) => r.q || r.a);
    } else if (f.type === "image") {
      const el = overlay.querySelector(`.image-field[data-field="${f.key}"] .image-url-input`);
      payload[f.key] = el ? el.value : "";
    } else {
      const el = overlay.querySelector(`[data-field="${f.key}"]`);
      payload[f.key] = el ? el.value : "";
    }
  });
  return payload;
}
