import { SECTIONS } from "./data/metrics.js";

const $ = (sel, root=document) => root.querySelector(sel);

const state = {
  openMenu: null, // { sectionId, rowId }
  rowsBySection: Object.fromEntries(SECTIONS.map(s => [s.id, []]))
};

function uid(){ return Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(2,6); }

function getMetric(sectionId, metricId){
  const sec = SECTIONS.find(s => s.id === sectionId);
  return sec?.metrics.find(m => m.id === metricId) ?? null;
}
function parseNumber(v){
  const s = String(v ?? "").trim().replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
function computeStatus(metric, valueNum){
  if (!metric || valueNum === null) return { code:"neutral", emoji:"—", text:"No data", rank:0 };
  if (metric.direction === "max"){
    if (valueNum <= metric.green) return { code:"ok", emoji:"🟢", text:"Green", rank:1 };
    if (valueNum <= metric.yellow) return { code:"warn", emoji:"🟡", text:"Yellow", rank:2 };
    return { code:"bad", emoji:"🔴", text:"Red", rank:3 };
  } else {
    if (valueNum >= metric.green) return { code:"ok", emoji:"🟢", text:"Green", rank:1 };
    if (valueNum >= metric.yellow) return { code:"warn", emoji:"🟡", text:"Yellow", rank:2 };
    return { code:"bad", emoji:"🔴", text:"Red", rank:3 };
  }
}
function aggregateSectionStatus(sectionId){
  const rows = state.rowsBySection[sectionId];
  let best = { code:"neutral", emoji:"—", text:"No data", rank:0 };
  for (const r of rows){
    const m = getMetric(sectionId, r.metricId);
    const st = computeStatus(m, parseNumber(r.value));
    if (st.rank > best.rank) best = st;
  }
  return best;
}

function renderApp(){
  const stack = $("#stack");
  stack.innerHTML = SECTIONS.map(renderSection).join("");
  // создать по 1 строке на секцию
  for (const s of SECTIONS){
    addRow(s.id);
    updateSectionPill(s.id);
  }
}

function renderSection(sec){
  return `
  <section class="card" data-section="${sec.id}">
    <div class="cardHead">
      <div>
        <h2>${sec.title}</h2>
        <p class="hint">${sec.hint}</p>
      </div>
      <div class="right">
        <button class="btn" data-action="add-row" data-section="${sec.id}">+ Добавить метрику</button>
        <div class="pill neutral" data-role="section-pill" data-section="${sec.id}">
          <span class="e">—</span><span class="t">No data</span>
        </div>
      </div>
    </div>
    <div class="body" data-role="rows" data-section="${sec.id}"></div>
  </section>`;
}

function addRow(sectionId){
  const sec = SECTIONS.find(s=>s.id===sectionId);
  const rowId = uid();
  const metricId = sec.metrics[0]?.id ?? null;

  state.rowsBySection[sectionId].push({ rowId, metricId, value:"" });

  const rowsWrap = document.querySelector(`[data-role="rows"][data-section="${sectionId}"]`);
  rowsWrap.insertAdjacentHTML("beforeend", renderRow(sectionId, rowId));
  syncRowUI(sectionId, rowId);
  updateSectionPill(sectionId);
}

function renderRow(sectionId, rowId){
  return `
  <div class="rowCard" data-row="${rowId}" data-section="${sectionId}">
    <div class="rowTop">
      <div class="mini neutral" data-role="row-pill" data-section="${sectionId}" data-row="${rowId}">
        <span class="e">—</span><span class="t">No data</span>
      </div>
      <button class="btn danger" data-action="remove-row" data-section="${sectionId}" data-row="${rowId}">Удалить</button>
    </div>

    <div class="grid">
      <div class="field">
        <label>Метрика</label>
        <div class="combo">
          <input data-role="metric-input" data-section="${sectionId}" data-row="${rowId}" placeholder="Поиск..." />
          <div class="chev">⌄</div>
          <div class="menu" data-role="menu" data-section="${sectionId}" data-row="${rowId}"></div>
        </div>
      </div>

      <div class="field">
        <label>Текущее значение</label>
        <input type="number" step="any" data-role="value-input" data-section="${sectionId}" data-row="${rowId}" />
      </div>

      <div class="field">
        <label>Guardrail</label>
        <div class="guard">
          <span data-role="guardrail" data-section="${sectionId}" data-row="${rowId}">—</span>
          <span class="unit" data-role="unit" data-section="${sectionId}" data-row="${rowId}"></span>
        </div>
      </div>
    </div>
  </div>`;
}

function findRow(sectionId, rowId){
  return state.rowsBySection[sectionId].find(r => r.rowId === rowId);
}

function syncRowUI(sectionId, rowId){
  const r = findRow(sectionId, rowId);
  const metric = getMetric(sectionId, r.metricId);
  const rowEl = document.querySelector(`[data-row="${rowId}"][data-section="${sectionId}"]`);
  const metricInput = rowEl.querySelector(`[data-role="metric-input"]`);
  const guard = rowEl.querySelector(`[data-role="guardrail"]`);
  const unit = rowEl.querySelector(`[data-role="unit"]`);

  metricInput.value = metric?.name ?? "";
  guard.textContent = metric?.display ?? "—";
  unit.textContent = metric?.unit ?? "";

  updateRowPill(sectionId, rowId);
}

function updateRowPill(sectionId, rowId){
  const r = findRow(sectionId, rowId);
  const metric = getMetric(sectionId, r.metricId);
  const st = computeStatus(metric, parseNumber(r.value));
  const pill = document.querySelector(`[data-role="row-pill"][data-section="${sectionId}"][data-row="${rowId}"]`);
  pill.className = `mini ${st.code}`;
  pill.querySelector(".e").textContent = st.emoji;
  pill.querySelector(".t").textContent = st.text;
}

function updateSectionPill(sectionId){
  const st = aggregateSectionStatus(sectionId);
  const pill = document.querySelector(`[data-role="section-pill"][data-section="${sectionId}"]`);
  pill.className = `pill ${st.code}`;
  pill.querySelector(".e").textContent = st.emoji;
  pill.querySelector(".t").textContent = st.text;
}

/* ---------- меню ---------- */
function openMenu(sectionId, rowId){
  state.openMenu = { sectionId, rowId };
  const menu = document.querySelector(`[data-role="menu"][data-section="${sectionId}"][data-row="${rowId}"]`);
  menu.classList.add("open");
  renderMenu(sectionId, rowId);
}
function closeMenu(){
  if (!state.openMenu) return;
  const { sectionId, rowId } = state.openMenu;
  const menu = document.querySelector(`[data-role="menu"][data-section="${sectionId}"][data-row="${rowId}"]`);
  menu?.classList.remove("open");
  state.openMenu = null;
}
function renderMenu(sectionId, rowId){
  const sec = SECTIONS.find(s=>s.id===sectionId);
  const rowEl = document.querySelector(`[data-row="${rowId}"][data-section="${sectionId}"]`);
  const inputEl = rowEl.querySelector(`[data-role="metric-input"]`);

  const r = findRow(sectionId, rowId);
  const selected = getMetric(sectionId, r.metricId);

  // query из инпута
  let q = (inputEl.value || "").toLowerCase().trim();

  // ✅ если в инпуте просто "название выбранной метрики", значит это не поиск
  const selectedName = (selected?.name || "").toLowerCase().trim();
  if (q === selectedName) q = "";

  const list = !q
    ? sec.metrics
    : sec.metrics.filter(m => {
        const hay = `${m.name} ${m.id} ${m.unit || ""}`.toLowerCase();
        return hay.includes(q);
      });

  const menu = rowEl.querySelector(`[data-role="menu"]`);
  menu.innerHTML = list.length
    ? list.map(m => `
        <div class="opt" data-action="pick-metric"
             data-section="${sectionId}" data-row="${rowId}" data-metric="${m.id}">
          <div>${m.name}</div>
          <div class="meta">${m.display}</div>
        </div>
      `).join("")
    : `<div class="empty">Ничего не найдено</div>`;
}
/* ---------- один набор обработчиков ---------- */
document.addEventListener("click", (e) => {
  const btnAdd = e.target.closest(`[data-action="add-row"]`);
  if (btnAdd){
    addRow(btnAdd.dataset.section);
    return;
  }

  const btnRemove = e.target.closest(`[data-action="remove-row"]`);
  if (btnRemove){
    const { section, row } = btnRemove.dataset;
    const rows = state.rowsBySection[section];
    if (rows.length <= 1) return;

    state.rowsBySection[section] = rows.filter(r => r.rowId !== row);
    document.querySelector(`[data-row="${row}"][data-section="${section}"]`)?.remove();
    updateSectionPill(section);
    return;
  }

  const opt = e.target.closest(`[data-action="pick-metric"]`);
  if (opt){
    const { section, row, metric } = opt.dataset;
    const r = findRow(section, row);
    r.metricId = metric;
    syncRowUI(section, row);
    updateSectionPill(section);
    closeMenu();
    return;
  }

  // клик по инпуту метрики
  const metricInput = e.target.closest(`[data-role="metric-input"]`);
  if (metricInput){
    openMenu(metricInput.dataset.section, metricInput.dataset.row);
    return;
  }

  // клик вне меню — закрыть
  if (!e.target.closest(".combo")) closeMenu();
});

document.addEventListener("input", (e) => {
  const valueInput = e.target.closest(`[data-role="value-input"]`);
  if (valueInput){
    const { section, row } = valueInput.dataset;
    const r = findRow(section, row);
    r.value = valueInput.value;
    updateRowPill(section, row);
    updateSectionPill(section);
    return;
  }

  const metricInput = e.target.closest(`[data-role="metric-input"]`);
  if (metricInput){
    openMenu(metricInput.dataset.section, metricInput.dataset.row);
    return;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

renderApp();