/* app.js — DROPDOWN PORTAL (SOLVES LAYERING + "TRANSPARENCY")
   - Menu is rendered into a single fixed "portal" attached to <body>
   - Always overlays other cards (no stacking-context issues)
   - No preselected metric on load
   - Event delegation only
*/

import { SECTIONS } from "./data/metrics.js";

const $ = (sel, root = document) => root.querySelector(sel);

const state = {
  openMenu: null, // { sectionId, rowId }
  rowsBySection: Object.fromEntries(SECTIONS.map((s) => [s.id, []])),
};

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(2, 6);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSection(sectionId) {
  return SECTIONS.find((s) => s.id === sectionId);
}

function getMetric(sectionId, metricId) {
  const sec = getSection(sectionId);
  return sec?.metrics.find((m) => m.id === metricId) ?? null;
}

function findRow(sectionId, rowId) {
  return state.rowsBySection[sectionId].find((r) => r.rowId === rowId);
}

function parseNumber(v) {
  const s = String(v ?? "").trim().replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function computeStatus(metric, valueNum) {
  if (!metric || valueNum === null) return { code: "neutral", emoji: "—", text: "No data", rank: 0 };

  if (metric.direction === "max") {
    if (valueNum <= metric.green) return { code: "ok", emoji: "🟢", text: "Green", rank: 1 };
    if (valueNum <= metric.yellow) return { code: "warn", emoji: "🟡", text: "Yellow", rank: 2 };
    return { code: "bad", emoji: "🔴", text: "Red", rank: 3 };
  } else {
    if (valueNum >= metric.green) return { code: "ok", emoji: "🟢", text: "Green", rank: 1 };
    if (valueNum >= metric.yellow) return { code: "warn", emoji: "🟡", text: "Yellow", rank: 2 };
    return { code: "bad", emoji: "🔴", text: "Red", rank: 3 };
  }
}

function aggregateSectionStatus(sectionId) {
  const rows = state.rowsBySection[sectionId];
  let worst = { code: "neutral", emoji: "—", text: "No data", rank: 0 };
  for (const r of rows) {
    const m = getMetric(sectionId, r.metricId);
    const st = computeStatus(m, parseNumber(r.value));
    if (st.rank > worst.rank) worst = st;
  }
  return worst;
}

/* ---------------- Portal menu ---------------- */

const portal = document.createElement("div");
portal.className = "menuPortal";
portal.setAttribute("aria-hidden", "true");
document.body.appendChild(portal);

function portalSetOpen(isOpen) {
  portal.classList.toggle("open", isOpen);
  portal.setAttribute("aria-hidden", String(!isOpen));
}

function positionPortalToInput(sectionId, rowId) {
  const input = document.querySelector(
    `[data-role="metric-input"][data-section="${sectionId}"][data-row="${rowId}"]`
  );
  if (!input) return;

  const rect = input.getBoundingClientRect();
  const top = rect.bottom + 8;
  const left = rect.left;
  const width = rect.width;

  portal.style.top = `${Math.round(top)}px`;
  portal.style.left = `${Math.round(left)}px`;
  portal.style.width = `${Math.round(width)}px`;
}

function closeMenu() {
  state.openMenu = null;
  portal.innerHTML = "";
  portalSetOpen(false);
}

function renderPortalMenu(sectionId, rowId) {
  const sec = getSection(sectionId);
  const r = findRow(sectionId, rowId);
  const selected = getMetric(sectionId, r?.metricId);

  const inputEl = document.querySelector(
    `[data-role="metric-input"][data-section="${sectionId}"][data-row="${rowId}"]`
  );

  let q = (inputEl?.value || "").toLowerCase().trim();
  const selectedName = (selected?.name || "").toLowerCase().trim();

  // if input equals selected metric name, treat as empty query -> show all
  if (q === selectedName) q = "";

  const list = !q
    ? sec.metrics
    : sec.metrics.filter((m) => {
        const hay = `${m.name} ${m.id} ${m.unit || ""}`.toLowerCase();
        return hay.includes(q);
      });

  portal.innerHTML = list.length
    ? list
        .map(
          (m) => `
      <div class="opt"
           data-action="pick-metric"
           data-section="${escapeHtml(sectionId)}"
           data-row="${escapeHtml(rowId)}"
           data-metric="${escapeHtml(m.id)}">
        <div class="name">${escapeHtml(m.name)}</div>
        <div class="meta">${escapeHtml(m.display)}</div>
      </div>`
        )
        .join("")
    : `<div class="empty">Ничего не найдено</div>`;
}

function openMenu(sectionId, rowId) {
  state.openMenu = { sectionId, rowId };
  positionPortalToInput(sectionId, rowId);
  renderPortalMenu(sectionId, rowId);
  portalSetOpen(true);
}

/* keep portal aligned on scroll/resize */
window.addEventListener("scroll", () => {
  if (!state.openMenu) return;
  positionPortalToInput(state.openMenu.sectionId, state.openMenu.rowId);
}, true);

window.addEventListener("resize", () => {
  if (!state.openMenu) return;
  positionPortalToInput(state.openMenu.sectionId, state.openMenu.rowId);
});

/* ---------------- Render ---------------- */

function renderApp() {
  const stack = $("#stack");
  stack.innerHTML = SECTIONS.map(renderSection).join("");

  for (const s of SECTIONS) {
    addRow(s.id);
    updateSectionPill(s.id);
  }
}

function renderSection(sec) {
  return `
  <section class="card" data-section="${escapeHtml(sec.id)}">
    <div class="cardHead">
      <div>
        <h2>${escapeHtml(sec.title)}</h2>
        <p class="hint">${escapeHtml(sec.hint)}</p>
      </div>
      <div class="right">
        <button class="btn" data-action="add-row" data-section="${escapeHtml(sec.id)}">+ Добавить метрику</button>
        <div class="pill neutral" data-role="section-pill" data-section="${escapeHtml(sec.id)}">
          <span class="e">—</span><span class="t">No data</span>
        </div>
      </div>
    </div>
    <div class="body" data-role="rows" data-section="${escapeHtml(sec.id)}"></div>
  </section>`;
}

function renderRow(sectionId, rowId) {
  return `
  <div class="rowCard" data-row="${escapeHtml(rowId)}" data-section="${escapeHtml(sectionId)}">
    <div class="rowTop">
      <div class="mini neutral" data-role="row-pill" data-section="${escapeHtml(sectionId)}" data-row="${escapeHtml(rowId)}">
        <span class="e">—</span><span class="t">No data</span>
      </div>
      <button class="btn danger" data-action="remove-row" data-section="${escapeHtml(sectionId)}" data-row="${escapeHtml(rowId)}">Удалить</button>
    </div>

    <div class="grid">
      <div class="field">
        <label>Метрика</label>
        <div class="combo">
          <input type="text"
                 data-role="metric-input"
                 data-section="${escapeHtml(sectionId)}"
                 data-row="${escapeHtml(rowId)}"
                 placeholder="Выберите метрику или начните вводить..." />
          <div class="chev" aria-hidden="true">⌄</div>
        </div>
      </div>

      <div class="field">
        <label>Текущее значение</label>
        <input type="number"
               step="any"
               data-role="value-input"
               data-section="${escapeHtml(sectionId)}"
               data-row="${escapeHtml(rowId)}"
               placeholder="Введите значение..." />
      </div>

      <div class="field">
        <label>Guardrail</label>
        <div class="guard">
          <span data-role="guardrail" data-section="${escapeHtml(sectionId)}" data-row="${escapeHtml(rowId)}">—</span>
          <span class="unit" data-role="unit" data-section="${escapeHtml(sectionId)}" data-row="${escapeHtml(rowId)}"></span>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------------- Mutations ---------------- */

function addRow(sectionId) {
  const rowId = uid();
  state.rowsBySection[sectionId].push({ rowId, metricId: null, value: "" });

  const rowsWrap = document.querySelector(`[data-role="rows"][data-section="${sectionId}"]`);
  rowsWrap.insertAdjacentHTML("beforeend", renderRow(sectionId, rowId));

  syncRowUI(sectionId, rowId);
  updateSectionPill(sectionId);
}

function removeRow(sectionId, rowId) {
  const rows = state.rowsBySection[sectionId];
  if (rows.length <= 1) return;

  state.rowsBySection[sectionId] = rows.filter((r) => r.rowId !== rowId);
  document.querySelector(`[data-row="${rowId}"][data-section="${sectionId}"]`)?.remove();

  if (state.openMenu && state.openMenu.sectionId === sectionId && state.openMenu.rowId === rowId) {
    closeMenu();
  }

  updateSectionPill(sectionId);
}

function syncRowUI(sectionId, rowId) {
  const r = findRow(sectionId, rowId);
  if (!r) return;

  const metric = getMetric(sectionId, r.metricId);

  const rowEl = document.querySelector(`[data-row="${rowId}"][data-section="${sectionId}"]`);
  if (!rowEl) return;

  const metricInput = rowEl.querySelector(`[data-role="metric-input"]`);
  const guard = rowEl.querySelector(`[data-role="guardrail"]`);
  const unit = rowEl.querySelector(`[data-role="unit"]`);
  const valueInput = rowEl.querySelector(`[data-role="value-input"]`);

  metricInput.value = metric?.name ?? "";
  guard.textContent = metric?.display ?? "—";
  unit.textContent = metric?.unit ?? "";
  valueInput.value = r.value ?? "";

  updateRowPill(sectionId, rowId);
}

function updateRowPill(sectionId, rowId) {
  const r = findRow(sectionId, rowId);
  if (!r) return;

  const metric = getMetric(sectionId, r.metricId);
  const st = computeStatus(metric, parseNumber(r.value));

  const pill = document.querySelector(
    `[data-role="row-pill"][data-section="${sectionId}"][data-row="${rowId}"]`
  );
  if (!pill) return;

  pill.className = `mini ${st.code}`;
  pill.querySelector(".e").textContent = st.emoji;
  pill.querySelector(".t").textContent = st.text;
}

function updateSectionPill(sectionId) {
  const st = aggregateSectionStatus(sectionId);
  const pill = document.querySelector(`[data-role="section-pill"][data-section="${sectionId}"]`);
  if (!pill) return;

  pill.className = `pill ${st.code}`;
  pill.querySelector(".e").textContent = st.emoji;
  pill.querySelector(".t").textContent = st.text;
}

function pickMetric(sectionId, rowId, metricId) {
  const r = findRow(sectionId, rowId);
  if (!r) return;

  r.metricId = metricId;
  syncRowUI(sectionId, rowId);
  updateSectionPill(sectionId);
  closeMenu();
}

/* ---------------- Event delegation ---------------- */

document.addEventListener("click", (e) => {
  const addBtn = e.target.closest(`[data-action="add-row"]`);
  if (addBtn) {
    addRow(addBtn.dataset.section);
    return;
  }

  const removeBtn = e.target.closest(`[data-action="remove-row"]`);
  if (removeBtn) {
    removeRow(removeBtn.dataset.section, removeBtn.dataset.row);
    return;
  }

  const opt = e.target.closest(`[data-action="pick-metric"]`);
  if (opt) {
    pickMetric(opt.dataset.section, opt.dataset.row, opt.dataset.metric);
    return;
  }

  const metricInput = e.target.closest(`[data-role="metric-input"]`);
  if (metricInput) {
    openMenu(metricInput.dataset.section, metricInput.dataset.row);
    return;
  }

  // if click is NOT inside input combo and NOT inside portal => close
  if (!e.target.closest(".combo") && !e.target.closest(".menuPortal")) {
    closeMenu();
  }
});

document.addEventListener("input", (e) => {
  const valueInput = e.target.closest(`[data-role="value-input"]`);
  if (valueInput) {
    const { section, row } = valueInput.dataset;
    const r = findRow(section, row);
    if (!r) return;

    r.value = valueInput.value;
    updateRowPill(section, row);
    updateSectionPill(section);
    return;
  }

  const metricInput = e.target.closest(`[data-role="metric-input"]`);
  if (metricInput) {
    const { section, row } = metricInput.dataset;
    // keep menu open and filter live
    openMenu(section, row);
    return;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* ---------------- Boot ---------------- */
renderApp();