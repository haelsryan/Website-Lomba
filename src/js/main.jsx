import React from 'react'
import ReactDOM from 'react-dom/client'
import '../css/style.css'

export function mountPage(Component) {
  const root = document.getElementById('root')
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <Component />
      </React.StrictMode>
    )
    return
  }
  // No root = legacy vanilla page, run legacy init
  legacyInit()
}

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ico = (n, c = "") => `<svg class="icon ${c}"><use href="#i-${n}"/></svg>`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const pad = (n) => String(n).padStart(2, "0");
const dkey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const startOfWeek = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return addDays(x, -((x.getDay() + 6) % 7)); };
const idr = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1 }).format(n);
const fmt = (d, o) => new Intl.DateTimeFormat("id-ID", o).format(d);
const ago = (ts) => { const m = Math.floor((Date.now() - ts) / 6e4); return m < 1 ? "baru saja" : m < 60 ? `${m} menit lalu` : m < 1440 ? `${Math.floor(m / 60)} jam lalu` : `${Math.floor(m / 1440)} hari lalu`; };
const INPUT = "w-full rounded-xl border border-slate-300 bg-surface px-3 py-2 text-sm font-normal";
const field = (label, name, attrs = "") => `<label class="grid gap-1 text-sm font-medium">${label}<input name="${name}" class="${INPUT}" ${attrs} /></label>`;
const TONES = ["from-sky-300 to-blue-500", "from-amber-300 to-orange-500", "from-slate-400 to-slate-700", "from-teal-300 to-emerald-600", "from-indigo-300 to-violet-600", "from-rose-300 to-pink-600"];
const tone = (s) => TONES[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % TONES.length];
const initials = (n) => n.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

/* ---------- motion helpers (vanilla ports of React Bits effects) ---------- */
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE = "cubic-bezier(.2,.8,.2,1)";
const lastVal = {}, lastSig = {};

// Count Up: animates from the previous value to the new one
function countUp(el, key, to, f = (n) => Math.round(n)) {
  const from = lastVal[key] ?? 0;
  lastVal[key] = to;
  if (reduced || from === to) { el.textContent = f(to); return; }
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min((t - t0) / 900, 1), e = 1 - (1 - p) ** 3;
    el.textContent = f(from + (to - from) * e);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Bars grow in: height for vertical bars, a clip sweep for horizontal segments
function grow(sel, axis) {
  if (reduced) return;
  $$(sel).forEach((el, i) => el.animate(
    axis === "y"
      ? [{ height: "0px" }, { height: getComputedStyle(el).height }]
      : [{ clipPath: "inset(0 100% 0 0 round 9999px)" }, { clipPath: "inset(0 0 0 0 round 9999px)" }],
    { duration: 800, delay: i * 90, easing: EASE, fill: "backwards" }
  ));
}

// Blur Text: words fade in from a blur, one after another
function blurText(el) {
  if (!el) return;
  const t = el.textContent.trim();
  el.setAttribute("aria-label", t);
  el.innerHTML = t.split(" ").map((w) => `<span aria-hidden="true" class="inline-block">${esc(w)}</span>`).join(" ");
  if (reduced) return;
  $$("span", el).forEach((s, i) => s.animate(
    [{ opacity: 0, filter: "blur(10px)", transform: "translateY(.6rem)" }, { opacity: 1, filter: "blur(0)", transform: "none" }],
    { duration: 700, delay: 150 + i * 80, easing: EASE, fill: "backwards" }
  ));
}

// One orchestrated entrance on first load
function intro() {
  if (reduced) return;
  const pop = (sel, from, o) => $$(sel).forEach((el, i) => el.animate([from, { opacity: 1, transform: "none" }], { duration: 600, easing: EASE, fill: "backwards", ...o(i) }));
  pop("main section", { opacity: 0, transform: "translateY(16px) scale(.97)" }, (i) => ({ delay: 100 + i * 70 }));
  pop("[data-members] .avatar", { transform: "scale(0)" }, (i) => ({ delay: 500 + i * 70, easing: "cubic-bezier(.34,1.56,.64,1)" }));
  pop("[data-notif-list] > li", { opacity: 0, transform: "translateX(24px)" }, (i) => ({ delay: 600 + i * 90 }));
  pop("[data-fin-list] li", { opacity: 0, transform: "translateY(8px)" }, (i) => ({ delay: 150 + i * 40 }));
}

const CATS = { kebutuhan: ["Kebutuhan", "bg-navy"], tabungan: ["Tabungan", "bg-primary"], hiburan: ["Hiburan", "bg-primary-soft"] };
const VIDEOS = [
  { id: 1, title: "Menyusun anggaran bulanan dengan aturan 50/30/20", dur: "4 mnt", date: "28 Okt", bg: "from-blue-200 via-primary-soft to-indigo-300", desc: "Bagi pemasukan menjadi kebutuhan, keinginan, dan tabungan agar uang tidak habis sebelum akhir bulan." },
  { id: 2, title: "Mengenal OJK dan cara cek pinjol legal", dur: "8 mnt", date: "20 Okt", bg: "from-sky-200 via-white to-blue-300", desc: "Langkah memeriksa izin penyedia pinjaman online sebelum Anda mengajukan pinjaman." },
  { id: 3, title: "Pisahkan uang pribadi dan uang usaha", dur: "6 mnt", date: "12 Okt", bg: "from-slate-200 via-primary-tint to-slate-300", desc: "Mengapa UMKM perlu dua rekening, dan cara memulainya tanpa ribet." },
];

/* ---------- state ---------- */
const KEY = "dompet-cerdas-v1";
const today = new Date();
function seed() {
  const wk = startOfWeek(today), m = (k) => dkey(new Date(today.getFullYear(), today.getMonth() - k, 15)), now = Date.now();
  return {
    premium: false, muted: false,
    members: ["Sari Wulandari", "Raka Pratama", "Dimas Saputra", "Maya Putri", "Andini Nur", "Bagas Hidayat"].map((name, i) => ({ id: i + 1, name })),
    // type: "out" = uang keluar, "in" = uang masuk (setoran ke tabungan)
    tx: [
      { id: 1, date: dkey(wk), cat: "kebutuhan", type: "out", amount: 850000, note: "Belanja mingguan" },
      { id: 2, date: dkey(addDays(wk, 1)), cat: "kebutuhan", type: "out", amount: 450000, note: "Transport dan makan" },
      { id: 3, date: dkey(addDays(wk, 2)), cat: "tabungan", type: "in", amount: 600000, note: "Setoran dana darurat" },
      { id: 4, date: dkey(addDays(wk, 3)), cat: "hiburan", type: "out", amount: 200000, note: "Nonton dan kopi" },
      { id: 5, date: m(1), cat: "tabungan", type: "in", amount: 900000, note: "Setoran dana darurat" },
      { id: 6, date: m(2), cat: "tabungan", type: "in", amount: 500000, note: "Setoran dana darurat" },
      { id: 7, date: m(0), cat: "tabungan", type: "in", amount: 400000, note: "Setoran dana darurat" },
      { id: 8, date: m(0), cat: "kebutuhan", type: "out", amount: 350000, note: "Listrik dan air" },
      { id: 9, date: m(0), cat: "kebutuhan", type: "out", amount: 1200000, note: "Belanja bulanan" },
      { id: 10, date: m(0), cat: "hiburan", type: "out", amount: 150000, note: "Kopi bersama" },
    ],
    rem: [
      { id: 1, date: dkey(today), title: "Bayar listrik rumah", time: "12:45", done: false },
      { id: 2, date: dkey(addDays(today, 2)), title: "Cicilan motor", time: "09:00", done: false },
      { id: 3, date: dkey(addDays(today, -1)), title: "Internet bulanan", time: "10:00", done: true },
      { id: 4, date: dkey(addDays(today, -3)), title: "Iuran sampah", time: "08:00", done: true },
      { id: 5, date: dkey(new Date(today.getFullYear(), today.getMonth(), 2)), title: "Uang kos", time: "08:00", done: true },
    ],
    vid: { 1: { views: 3, c: 15, list: [] }, 2: { views: 5, c: 12, list: [] }, 3: { views: 9, c: 4, list: [] } },
    notifs: [
      { id: 1, who: "Dewi Lestari", type: "shared", label: "Undangan", text: "Dewi Lestari mengundang Anda ke webinar “Dana Darurat untuk UMKM”", ts: now - 30 * 6e4, read: false },
      { id: 2, who: "Raka Pratama", type: "comment", label: "Komentar", text: "Raka Pratama berkomentar di video “Menyusun anggaran bulanan dengan aturan 50/30/20”", ts: now - 60 * 6e4, read: false, go: 1 },
      { id: 3, who: "Maya Putri", type: "view", label: "Dilihat", text: "Maya Putri melihat laporan Anda: “Arus Kas Warung Kopi”", ts: now - 1440 * 6e4, read: true },
    ],
  };
}
let S;
try { S = JSON.parse(localStorage.getItem(KEY)); } catch { /* ignore */ }
S ||= seed();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* ignore */ } };
const ui = { sel: new Date(today), week: startOfWeek(today), tab: "all", range: "weekly", finMonthOffset: 0, finFilter: "all" };
const seen = new Set();
const commit = () => { save(); renderAll(); };
const notify = (n) => {
  if (!S.muted) {
    S.notifs.unshift({ id: Date.now(), ts: Date.now(), read: false, who: "Saya", ...n });
    if (S.notifs.length > 20) S.notifs.length = 20;
  }
};

/* ---------- modal + toast ---------- */
const modal = $("[data-modal]");
function openModal(title, body, onSubmit, submitLabel = "Simpan") {
  modal.innerHTML = `<form method="dialog" class="grid gap-4 p-6">
    <header class="flex items-center justify-between gap-4"><h2 class="text-xl font-medium">${title}</h2>
      <button type="button" data-close class="icon-btn size-8 shrink-0 bg-canvas" aria-label="Tutup">${ico("x", "size-4")}</button></header>
    ${body}
    <div class="flex justify-end gap-2">${onSubmit
      ? `<button type="button" data-close class="btn bg-canvas">Batal</button><button class="btn bg-primary text-white hover:bg-primary/90">${submitLabel}</button>`
      : `<button type="button" data-close class="btn bg-canvas">Tutup</button>`}</div></form>`;
  const form = $("form", modal);
  form.onsubmit = (e) => {
    e.preventDefault();
    if (onSubmit && onSubmit(Object.fromEntries(new FormData(form))) === false) return;
    modal.close();
  };
  if (!modal.open) modal.showModal();
}
if (modal) {
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest("[data-close]")) modal.close(); });
}
let tt;
const toast = (m) => {
  const el = $("[data-toast]");
  el.textContent = m; el.classList.remove("hidden");
  clearTimeout(tt); tt = setTimeout(() => el.classList.add("hidden"), 2500);
};

/* ---------- renderers ---------- */
function renderMembers() {
  $("[data-members]").innerHTML = S.members.map((m) => {
    const [a, ...b] = m.name.split(" ");
    return `<li><button type="button" data-act="member" data-id="${m.id}" class="w-full rounded-2xl text-center transition hover:bg-primary-tint" aria-label="Kelola ${esc(m.name)}">
      <span class="avatar mx-auto size-16 bg-gradient-to-br text-lg ${tone(m.name)}">${initials(m.name)}</span>
      <span class="mt-1.5 block text-xs font-semibold leading-tight">${esc(a)}<br />${esc(b.join(" "))}</span></button></li>`;
  }).join("");
}

const weekTx = () => { const a = dkey(ui.week), b = dkey(addDays(ui.week, 6)); return S.tx.filter((t) => t.date >= a && t.date <= b); };
// Renderers no-op when their hook is not on the current page (finances carries no dashboard widgets).
function renderSpend() {
  const el = $("[data-spend]");
  if (!el) return;
  const tx = weekTx().filter((t) => t.type === "out"), total = tx.reduce((s, t) => s + t.amount, 0);
  const sums = Object.keys(CATS).map((k) => [k, tx.filter((t) => t.cat === k).reduce((s, t) => s + t.amount, 0)]);
  const sig = JSON.stringify([dkey(ui.week), sums]);
  if (sig === lastSig.spend) return;
  lastSig.spend = sig;
  const range = `${fmt(ui.week, { day: "numeric", month: "short" })} – ${fmt(addDays(ui.week, 6), { day: "numeric", month: "short" })}`;
  el.innerHTML = `<p data-spend-total class="mt-3 text-4xl font-medium tracking-tight">${idr(total)}</p>
    <p class="mt-1 text-xs text-muted">${range}</p>
    <div class="mt-5 flex gap-1">${total ? sums.filter(([, v]) => v).map(([k, v]) => `<span data-grow class="h-2.5 rounded-full ${CATS[k][1]}" style="flex:${v}"></span>`).join("") : '<span class="h-2.5 flex-1 rounded-full bg-primary-tint"></span>'}</div>
    <ul class="mt-4 grid gap-1 text-xs text-muted">${sums.map(([k, v]) => `<li class="flex items-center gap-2"><span class="size-2 rounded-full ${CATS[k][1]}"></span>${CATS[k][0]}<span class="ml-auto font-semibold text-navy">${total ? Math.round((v / total) * 100) : 0}%</span></li>`).join("")}</ul>`;
  countUp($("[data-spend-total]"), "spend", total, idr);
  grow("[data-spend] [data-grow]", "x");
}

function renderImpact() {
  const months = [2, 1, 0].map((k) => {
    const d = new Date(today.getFullYear(), today.getMonth() - k, 1), p = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
    return { label: fmt(d, { month: "short" }), v: S.tx.filter((x) => x.cat === "tabungan" && x.type === "in" && x.date.startsWith(p)).reduce((s, x) => s + x.amount, 0) };
  });
  const max = Math.max(...months.map((m) => m.v), 1), [, prev, cur] = months;
  const sig = JSON.stringify(months);
  if (sig === lastSig.impact) return;
  lastSig.impact = sig;
  const pct = prev.v ? Math.round(((cur.v - prev.v) / prev.v) * 100) : null;
  const el = $("[data-impact]");
  if (!el) return;
  el.innerHTML = months.map((m, i) => `<div class="flex flex-1 flex-col items-center gap-1" title="${m.label}: ${idr(m.v)}">
    <span data-grow class="relative w-full rounded-xl ${i === 2 ? "bg-primary-soft" : "bg-primary-tint"}" style="height:${Math.max((m.v / max) * 6.5, 0.4)}rem">
      ${i === 2 && pct !== null ? `<span class="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-navy px-2 py-0.5 text-[0.6875rem] font-semibold text-white">${pct > 0 ? "+" : ""}${pct}%</span>` : ""}</span>
    <span class="text-xs text-muted">${m.label}</span></div>`).join("");
  grow("[data-impact] [data-grow]", "y");
}

function renderStats() {
  const a0 = $("[data-stat-a]");
  if (!a0) return;
  const wk = startOfWeek(today), weekly = ui.range === "weekly";
  const a = dkey(weekly ? wk : new Date(today.getFullYear(), today.getMonth(), 1));
  const b = dkey(weekly ? addDays(wk, 6) : new Date(today.getFullYear(), today.getMonth() + 1, 0));
  const r = S.rem.filter((x) => x.date >= a && x.date <= b);
  countUp(a0, "a", r.filter((x) => x.done).length);
  countUp($("[data-stat-b]"), "b", r.length);
  countUp($("[data-stat-done]"), "done", S.rem.filter((x) => x.done).length);
  countUp($("[data-stat-open]"), "open", S.rem.filter((x) => !x.done).length);
}

function renderReminder() {
  const host = $("[data-reminder]");
  if (!host) return;
  const k = dkey(ui.sel), label = fmt(ui.sel, { day: "numeric", month: "long" });
  const open = S.rem.filter((r) => r.date === k && !r.done).sort((a, b) => a.time.localeCompare(b.time)), r = open[0];
  host.innerHTML = (r
    ? `<div class="flex items-center gap-3 rounded-full bg-surface p-2.5 pr-3">
        <span class="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">${ico("receipt")}</span>
        <div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold">${esc(r.title)}</p><p class="text-xs text-muted">${r.time} WIB</p></div>
        <button type="button" data-act="done-rem" data-id="${r.id}" class="icon-btn size-8 border border-navy/20" aria-label="Tandai ${esc(r.title)} lunas">${ico("check", "size-4")}</button></div>
       ${open.length > 1 ? '<div class="mx-4 -mt-3 h-6 rounded-b-3xl bg-white/50"></div>' : ""}${open.length > 2 ? '<div class="mx-8 -mt-3 h-6 rounded-b-3xl bg-white/25"></div>' : ""}`
    : `<p class="py-6 text-center text-sm text-white/80">Tidak ada tagihan pada ${label}.</p>`)
    + `<div class="mt-3 flex items-center justify-between text-xs text-white/70"><span>${open.length > 1 ? `${open.length - 1} pengingat lagi` : label}</span>
       <button type="button" data-act="add-rem" class="font-semibold text-white hover:underline">+ Tambah pengingat</button></div>`;
}

function renderUpgrade() {
  const host = $("[data-upgrade]");
  if (!host) return;
  host.innerHTML = S.premium
    ? `<h2 class="text-xl font-medium leading-snug">Premium aktif</h2><p class="mt-2 text-sm text-muted">Laporan arus kas lengkap sudah terbuka.</p>
       <button type="button" data-act="plan" class="btn mt-auto self-start bg-primary-soft text-navy hover:bg-primary hover:text-white">Kelola paket</button>`
    : `<h2 class="text-xl font-medium leading-snug">Naik level ke Premium</h2><p class="mt-2 text-sm text-muted">Buka laporan arus kas lengkap dan analisis untuk usaha Anda.</p>
       <button type="button" data-act="plan" class="btn mt-auto self-start bg-primary-soft text-navy hover:bg-primary hover:text-white">${ico("up", "size-4")}Upgrade paket</button>`;
}

function renderCalendar() {
  const title = $("[data-cal-title]"), days = $("[data-cal-days]");
  if (!title || !days) return;
  title.textContent = fmt(addDays(ui.week, 3), { month: "long", year: "numeric" });
  days.innerHTML = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(ui.week, i), k = dkey(d), on = k === dkey(ui.sel), has = S.rem.some((r) => r.date === k && !r.done);
    return `<li><button type="button" data-act="day" data-v="${d.getTime()}" aria-pressed="${on}" aria-label="${fmt(d, { weekday: "long", day: "numeric", month: "long" })}"
      class="group w-full rounded-2xl border border-transparent px-0.5 py-2 transition hover:bg-white aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-white">
      <span class="block text-xs text-muted group-aria-pressed:text-white/70">${fmt(d, { weekday: "short" })}</span>
      <span class="mt-1 block text-lg font-semibold">${d.getDate()}</span>
      <span class="mx-auto mt-1 block size-1 rounded-full ${has ? "bg-primary group-aria-pressed:bg-white" : "bg-transparent"}"></span></button></li>`;
  }).join("");
}

function renderVideos() {
  const host = $("[data-videos]");
  if (!host) return;
  host.innerHTML = VIDEOS.map((v) => {
    const s = S.vid[v.id];
    return `<li class="w-40 shrink-0 snap-start"><button type="button" data-act="video" data-id="${v.id}" class="block w-full rounded-3xl bg-surface p-2 text-left transition hover:shadow-md">
      <span class="relative block h-24 rounded-2xl bg-gradient-to-br ${v.bg}"><span class="absolute bottom-2 right-2 rounded-full bg-navy/80 px-2 py-0.5 text-xs font-semibold text-white">${v.dur}</span></span>
      <span class="mt-2 block text-xs font-semibold leading-snug">${v.title}</span>
      <span class="mt-3 flex items-center gap-2 text-xs text-muted">${ico("cal", "size-3.5")}${v.date}${ico("eye", "size-3.5")}${s.views}${ico("chat", "size-3.5")}${s.c}</span></button></li>`;
  }).join("");
}

function renderNotifs() {
  const list = $("[data-notif-list]");
  if (!list) return;
  list.hidden = S.muted;
  $("[data-notif-muted]")?.classList.toggle("hidden", !S.muted);
  $$("[data-act=mute]").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.v === "on") === S.muted)));
  const items = S.notifs.filter((n) => ui.tab === "all" || n.type === ui.tab);
  list.innerHTML = items.length ? items.map((n) => `<li class="rounded-2xl bg-canvas border border-navy/5 p-3">
    <div class="flex items-start gap-3">
      <span class="avatar size-10 shrink-0 bg-gradient-to-br text-sm ${tone(n.who)}">${initials(n.who)}</span>
      <p class="min-w-0 flex-1 text-sm leading-snug break-words ${n.read ? "" : "font-semibold"}">${esc(n.text)}</p>
      <button type="button" data-act="open-notif" data-id="${n.id}" class="btn shrink-0 h-fit bg-navy px-2.5 py-1 text-xs text-white">${ico("link", "size-3")}Buka</button>
    </div>
    <p class="mt-2 flex items-center justify-between text-xs text-muted"><span class="flex items-center gap-1.5">${n.read ? "" : '<span class="size-2 rounded-full bg-primary"></span>'}${n.label}</span><span>${ago(n.ts)}</span></p></li>`).join("")
    : '<li class="rounded-2xl bg-canvas p-4 text-center text-sm text-muted">Belum ada notifikasi di tab ini.</li>';
}

function renderAll() {
  // Each renderer targets its own data-hook, so a page renders only the widgets it carries.
  $("[data-members]") && renderMembers();
  $("[data-spend]") && renderSpend();
  $("[data-impact]") && renderImpact();
  $("[data-stat-a]") && renderStats();
  $("[data-reminder]") && renderReminder();
  $("[data-upgrade]") && renderUpgrade();
  $("[data-cal-days]") && renderCalendar();
  $("[data-videos]") && renderVideos();
  $("[data-notif-list]") && renderNotifs();
  $("[data-fin-list]") && renderFinances();
}

/* ---------- finances page renderers ---------- */
const finMonth = () => { const d = new Date(today.getFullYear(), today.getMonth() + ui.finMonthOffset, 1); return d; };
const monthTx = () => { const d = finMonth(), p = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; return S.tx.filter((t) => t.date.startsWith(p)); };

function renderFinSummary() {
  const tx = monthTx();
  const tin = tx.filter((t) => t.type === "in").reduce((s, t) => s + t.amount, 0);
  const tout = tx.filter((t) => t.type === "out").reduce((s, t) => s + t.amount, 0);
  const d = finMonth();
  const label = fmt(d, { month: "long", year: "numeric" });
  $$("[data-fin-month-label]").forEach((el) => (el.textContent = label));
  countUp($("[data-fin-in]"), "fin-in", tin, idr);
  countUp($("[data-fin-out]"), "fin-out", tout, idr);
  countUp($("[data-fin-saved]"), "fin-saved", tx.filter((t) => t.cat === "tabungan" && t.type === "in").reduce((s, t) => s + t.amount, 0), idr);
  countUp($("[data-fin-net]"), "fin-net", tin - tout, idr);
  // Data nyata hanya sampai bulan berjalan, jadi tombol bulan berikutnya dimatikan di sana.
  const next = $('[data-act="fin-month"][data-v="1"]');
  if (next) next.disabled = ui.finMonthOffset === 0;
}

function renderFinList() {
  const wrap = $("[data-fin-list]"), empty = $("[data-fin-empty]"), emptyText = $("[data-fin-empty-text]");
  const d = finMonth(), p = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  let tx = S.tx.filter((t) => t.date.startsWith(p));
  const f = ui.finFilter;
  if (f === "in" || f === "out") tx = tx.filter((t) => t.type === f);
  tx.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  $("[data-fin-count]").textContent = `${tx.length} transaksi tercatat`;
  if (!tx.length) {
    wrap.classList.add("hidden");
    empty.classList.remove("hidden");
    emptyText.textContent = f === "all"
      ? `Belum ada catatan di ${fmt(d, { month: "long", year: "numeric" })}. Tekan Catat transaksi untuk memulai.`
      : `Tidak ada transaksi ${f === "in" ? "pemasukan" : "pengeluaran"} di bulan ini. Coba filter Semua.`;
    return;
  }
  empty.classList.add("hidden");
  wrap.classList.remove("hidden");
  const groups = new Map();
  tx.forEach((t) => {
    const k = t.date;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(t);
  });
  wrap.innerHTML = [...groups.entries()].map(([k, list]) => `
    <div>
      <p class="text-xs font-semibold text-muted">${fmt(new Date(k + "T00:00:00"), { weekday: "long", day: "numeric", month: "short" })}</p>
      <ul class="mt-2 grid gap-1.5" role="list">
        ${list.map((t) => `
          <li class="flex items-center gap-3 rounded-2xl bg-canvas p-3">
            <span class="grid size-9 shrink-0 place-items-center rounded-xl ${t.type === "in" ? "bg-primary-soft text-primary" : "bg-navy text-white"}">
              <svg class="icon size-4" aria-hidden="true"><use href="#i-${t.type === "in" ? "down" : "up"}" /></svg>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-semibold">${esc(t.note)}</span>
              <span class="block text-xs text-muted">${CATS[t.cat][0]}</span>
            </span>
            <span class="shrink-0 text-sm font-semibold ${t.type === "in" ? "text-primary" : ""}">${t.type === "in" ? "+" : "−"}${idr(t.amount)}</span>
            <button type="button" data-act="del-tx" data-id="${t.id}" class="icon-btn size-8 bg-surface" aria-label="Hapus ${esc(t.note)}">
              <svg class="icon size-4" aria-hidden="true"><use href="#i-trash" /></svg>
            </button>
          </li>`).join("")}
      </ul>
    </div>`).join("");
}

function renderFinChart() {
  const wrap = $("[data-fin-chart]");
  const tx = monthTx().filter((t) => t.type === "out");
  const total = tx.reduce((s, t) => s + t.amount, 0);
  if (!total) {
    wrap.innerHTML = `<p class="text-xs text-muted">Belum ada uang keluar bulan ini, jadi belum ada pos yang terbentuk.</p>`;
    return;
  }
  wrap.innerHTML = Object.keys(CATS).map((k) => {
    const v = tx.filter((t) => t.cat === k).reduce((s, t) => s + t.amount, 0);
    const pct = Math.round((v / total) * 100);
    return `<div>
      <div class="flex items-baseline justify-between text-xs">
        <span class="font-semibold">${CATS[k][0]}</span>
        <span class="text-muted">${idr(v)} · ${pct}%</span>
      </div>
      <div class="mt-1.5 h-2.5 overflow-hidden rounded-full bg-canvas">
        <div class="h-full rounded-full ${CATS[k][1]}" style="width:${pct}%"></div>
      </div>
    </div>`;
  }).join("");
}

function renderFinances() {
  renderFinSummary();
  renderFinList();
  renderFinChart();
}

/* ---------- actions ---------- */
const A = {
  "add-member"() {
    openModal("Tambah anggota", field("Nama lengkap", "name", 'required maxlength="40" autocomplete="off"'), ({ name }) => {
      name = name.trim();
      if (!name) return false;
      S.members.push({ id: Date.now(), name });
      notify({ type: "shared", label: "Anggota", text: `Anda menambahkan ${name} ke dompet bersama` });
      commit(); toast(`${name} ditambahkan`);
    }, "Tambah");
  },
  member(id) {
    const m = S.members.find((x) => x.id === id);
    openModal(esc(m.name), `<p class="text-sm text-muted">Hapus ${esc(m.name)} dari dompet bersama?</p>`, () => {
      S.members = S.members.filter((x) => x.id !== id); commit(); toast("Anggota dihapus");
    }, "Hapus");
  },
  "add-tx"() {
    const sel = `<label class="grid gap-1 text-sm font-medium">Jenis<select name="type" class="${INPUT}"><option value="out">Pengeluaran (uang keluar)</option><option value="in">Pemasukan (setoran tabungan)</option></select></label>`;
    const cat = `<label class="grid gap-1 text-sm font-medium">Kategori<select name="cat" class="${INPUT}">${Object.entries(CATS).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join("")}</select></label>`;
    openModal("Catat transaksi", sel + cat + field("Jumlah (Rp)", "amount", 'type="number" min="1000" step="1000" required inputmode="numeric"') + field("Catatan", "note", 'maxlength="60"') + field("Tanggal", "date", `type="date" required value="${dkey(ui.sel)}"`), (f) => {
      S.tx.push({ id: Date.now(), date: f.date, cat: f.cat, type: f.type, amount: +f.amount, note: f.note.trim() || CATS[f.cat][0] });
      notify({ type: "view", label: "Transaksi", text: `Anda mencatat ${CATS[f.cat][0].toLowerCase()} ${idr(+f.amount)}` });
      commit(); toast("Transaksi dicatat");
    });
  },
  history() {
    const tx = weekTx().sort((a, b) => b.date.localeCompare(a.date));
    openModal("Transaksi minggu ini", tx.length
      ? `<ul class="grid gap-2">${tx.map((t) => `<li class="flex items-center gap-3 rounded-2xl bg-canvas p-3 text-sm"><span class="size-2 shrink-0 rounded-full ${CATS[t.cat][1]}"></span>
          <span class="min-w-0 flex-1"><b class="block truncate">${esc(t.note)}</b><span class="text-xs text-muted">${CATS[t.cat][0]}, ${t.date}</span></span>
          <span class="font-semibold">${t.type === "in" ? "+" : "−"}${idr(t.amount)}</span>
          <button type="button" data-act="del-tx" data-id="${t.id}" class="icon-btn size-8" aria-label="Hapus transaksi">${ico("trash", "size-4")}</button></li>`).join("")}</ul>`
      : '<p class="text-sm text-muted">Belum ada transaksi minggu ini. Tekan tombol + di kartu Pengeluaran untuk mencatat.</p>');
  },
  // Only refresh the history modal when it is the one open (dashboard); on the finances page the ledger re-renders via commit().
  "del-tx"(id) { S.tx = S.tx.filter((t) => t.id !== id); commit(); if (modal.open) A.history(); },
  "add-rem"() {
    openModal("Tambah pengingat", field("Nama tagihan", "title", 'required maxlength="40"') + field("Jam", "time", 'type="time" required value="09:00"') + `<p class="text-sm text-muted">Tanggal: ${fmt(ui.sel, { dateStyle: "long" })}</p>`, (f) => {
      S.rem.push({ id: Date.now(), date: dkey(ui.sel), title: f.title.trim(), time: f.time, done: false });
      commit(); toast("Pengingat ditambahkan");
    });
  },
  "done-rem"(id) {
    const r = S.rem.find((x) => x.id === id);
    r.done = true;
    notify({ type: "view", label: "Tagihan", text: `${r.title} ditandai lunas` });
    commit(); toast("Tagihan lunas");
  },
  plan() {
    openModal(S.premium ? "Kelola paket" : "Naik ke Premium",
      `<ul class="grid gap-2 text-sm"><li>Laporan arus kas lengkap</li><li>Analisis pengeluaran untuk UMKM</li><li>Pengingat tagihan tanpa batas</li></ul><p class="text-sm text-muted">Ini simulasi. Tidak ada pembayaran yang diproses.</p>`,
      () => {
        S.premium = !S.premium;
        notify({ type: "shared", label: "Paket", text: S.premium ? "Paket Premium aktif" : "Paket kembali ke Gratis" });
        commit(); toast(S.premium ? "Premium aktif" : "Kembali ke paket Gratis");
      }, S.premium ? "Kembali ke Gratis" : "Aktifkan Premium");
  },
  video(id) {
    const v = VIDEOS.find((x) => x.id === id), s = S.vid[id];
    if (!seen.has(id)) { seen.add(id); s.views++; save(); renderVideos(); }
    openModal(v.title, `<div class="h-36 rounded-2xl bg-gradient-to-br ${v.bg}"></div><p class="text-sm text-muted">${v.desc}</p>
      ${s.list.length ? `<ul class="grid gap-2 text-sm">${s.list.map((c) => `<li class="rounded-xl bg-canvas p-3">${esc(c)}</li>`).join("")}</ul>` : ""}
      ${field("Komentar", "comment", 'required maxlength="120"')}`, (f) => {
      s.list.unshift(f.comment.trim()); s.c++;
      commit(); toast("Komentar terkirim");
    }, "Kirim");
  },
  "open-notif"(id) {
    const n = S.notifs.find((x) => x.id === id);
    n.read = true; save(); renderNotifs();
    n.go ? A.video(n.go) : openModal("Notifikasi", `<p class="text-sm">${esc(n.text)}</p><p class="text-xs text-muted">${ago(n.ts)}</p>`);
  },
  "read-all"() { S.notifs.forEach((n) => (n.read = true)); commit(); },
  mute(v) { S.muted = v === "on"; save(); renderNotifs(); toast(S.muted ? "Notifikasi dimatikan" : "Notifikasi dinyalakan"); },
  tab(v) { ui.tab = v; $$("[data-act=tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.v === v))); renderNotifs(); },
  range(v) { ui.range = v; $$("[data-act=range]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === v))); renderStats(); },
  "fin-filter"(v) { ui.finFilter = v; $$("[data-act=fin-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === v))); renderFinList(); },
  "fin-month"(v) { ui.finMonthOffset = Math.min(ui.finMonthOffset + +v, 0); renderFinances(); },
  week(v) { ui.week = addDays(ui.week, +v); ui.sel = addDays(ui.sel, +v); renderCalendar(); renderSpend(); renderReminder(); },
  day(v) { ui.sel = new Date(+v); renderCalendar(); renderReminder(); },
  help() {
    openModal("Bantuan", `<ul class="grid gap-3 text-sm"><li><b>Catat transaksi.</b> Tekan + di kartu Pengeluaran.</li>
      <li><b>Pengingat tagihan.</b> Pilih tanggal di kalender, lalu tekan Tambah pengingat.</li>
      <li><b>Penyimpanan.</b> Data tersimpan di browser ini saja.</li></ul>`);
  },
  logout() {
    openModal("Keluar", '<p class="text-sm text-muted">Data demo di browser ini akan dikembalikan ke contoh awal.</p>', () => {
      try { localStorage.removeItem(KEY); } catch { /* ignore */ }
      location.assign("/");
    }, "Keluar");
  },
};

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  A[el.dataset.act]?.(el.dataset.id ? Number(el.dataset.id) : el.dataset.v);
});

/* ---------- landing page calculator ---------- */
function initLandingCalc() {
  const input = $("[data-calc-income]");
  if (!input) return;

  const update = (val) => {
    const raw = Math.max(0, Number(val) || 0);
    const needs = Math.round(raw * 0.5);
    const wants = Math.round(raw * 0.3);
    const savings = Math.round(raw * 0.2);

    const f = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

    const elNeeds = $("[data-calc-needs]");
    const elWants = $("[data-calc-wants]");
    const elSavings = $("[data-calc-savings]");

    if (elNeeds) elNeeds.textContent = f(needs);
    if (elWants) elWants.textContent = f(wants);
    if (elSavings) elSavings.textContent = f(savings);
  };

  input.addEventListener("input", (e) => {
    update(e.target.value);
  });

  $$("[data-set-income]").forEach((btn) => {
    btn.addEventListener("click", () => {
      input.value = btn.dataset.setIncome;
      update(btn.dataset.setIncome);
      $$("[data-set-income]").forEach((b) => {
        b.classList.remove("bg-navy", "text-white");
        b.classList.add("bg-surface", "text-navy");
      });
      btn.classList.remove("bg-surface", "text-navy");
      btn.classList.add("bg-navy", "text-white");
    });
  });

  update(input.value || 5000000);
}

/* ---------- init ---------- */
function legacyInit() {
  const here = location.pathname.replace(/index\.html$/, "");
  $$("nav a.nav-link").forEach((a) => {
    if (a.pathname.replace(/index\.html$/, "") === here) a.setAttribute("aria-current", "page");
  });
  renderAll();
  initLandingCalc();
  blurText($("h1"));
  intro();
  if ($("[data-notif-list]")) {
    setInterval(renderNotifs, 6e4);
  }

  // Spotlight Card: the glow follows the cursor inside any .card
  document.addEventListener("pointermove", (e) => {
    const c = e.target.closest?.(".card");
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--x", `${e.clientX - r.left}px`);
    c.style.setProperty("--y", `${e.clientY - r.top}px`);
  });

  // Magnet: the banner button leans toward a nearby cursor
  const mag = $(".btn[data-act=add-member]");
  if (mag && !reduced) {
    mag.style.transition = "transform .25s";
    document.addEventListener("pointermove", (e) => {
      const r = mag.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      mag.style.transform = Math.hypot(dx, dy) < 90 ? `translate(${dx * 0.25}px, ${dy * 0.25}px)` : "";
    });
  }
}

// Legacy pages have no React root and still need their vanilla initialization.
if (typeof window !== 'undefined' && !document.getElementById('root')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', legacyInit)
  } else {
    legacyInit()
  }
}