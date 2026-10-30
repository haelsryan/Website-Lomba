import "../css/style.css";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Calendar: week strip (Mon–Sat), starts on the current week */
const calTitle = $("[data-cal-title]");
const calDays = $("[data-cal-days]");
let selected = new Date();
let weekStart = startOfWeek(selected);

function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

function renderCalendar() {
  calTitle.textContent = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(weekStart);
  calDays.innerHTML = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const on = d.toDateString() === selected.toDateString();
    const weekday = new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(d);
    return `<li>
      <button type="button" data-date="${d.getTime()}" aria-pressed="${on}"
        class="group w-full rounded-2xl border border-transparent px-1 py-2 transition hover:bg-white aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-white">
        <span class="block text-xs text-muted group-aria-pressed:text-white/70">${weekday}</span>
        <span class="mt-1 block text-lg font-semibold">${d.getDate()}</span>
      </button></li>`;
  }).join("");
}

$("[data-cal-prev]").addEventListener("click", () => {
  weekStart.setDate(weekStart.getDate() - 7);
  renderCalendar();
});
$("[data-cal-next]").addEventListener("click", () => {
  weekStart.setDate(weekStart.getDate() + 7);
  renderCalendar();
});
calDays.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-date]");
  if (!btn) return;
  selected = new Date(Number(btn.dataset.date));
  renderCalendar();
});
renderCalendar();

/* Statistics: weekly / monthly toggle */
const stats = { weekly: [12, 15], monthly: [49, 83] };
$$("[data-range]").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$("[data-range]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    const [a, b] = stats[btn.dataset.range];
    $("[data-stat-a]").textContent = a;
    $("[data-stat-b]").textContent = b;
  })
);

/* Notifications: tabs + mute */
const notifItems = $$("[data-notif-list] > li");
$$("[data-tab]").forEach((tab) =>
  tab.addEventListener("click", () => {
    $$("[data-tab]").forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
    notifItems.forEach((li) => {
      li.hidden = tab.dataset.tab !== "all" && li.dataset.type !== tab.dataset.tab;
    });
  })
);
$$("[data-notif-mute]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const muted = btn.dataset.notifMute === "on";
    $$("[data-notif-mute]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    $("[data-notif-list]").hidden = muted;
    $("[data-notif-muted]").classList.toggle("hidden", !muted);
  })
);

/* Reminder: dismiss */
$("[data-dismiss-reminder]").addEventListener("click", () => {
  $("[data-reminder]").classList.add("hidden");
  $("[data-reminder-empty]").classList.remove("hidden");
});