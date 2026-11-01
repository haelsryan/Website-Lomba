# Pages

One section per page: what it is for, what is on it, how it behaves and when it is done.
Files for an app page `<page>`: `pages/html/<page>.html`, `pages/jsx/<page>.jsx`, `pages/jsx/<page>/`.
App pages use `AppShell` (panel plus sidebar); the landing page has its own responsive shell. All pages work in light and dark theme, and at 375px wide.
The sidebar links to built pages only; Simulator and Belajar will appear when their pages are implemented.

Pages marked **Draft** were sketched from the product goals. Confirm them with the team before building and remove the word "Draft" once agreed.

---

## Landing page
- **Files:** `index.html`, `pages/jsx/index.jsx`
- **Purpose:** introduce Dompet Cerdas and let visitors open the demo or try the budget simulator.
- **Layout:** floating compact navigation, centered hero copy, and a large sample dashboard preview overlapping the tinted hero panel. The footer has working section links and the "do it better" wordmark.
- **Behavior:** navigation links scroll to existing sections; dashboard links open the demo; the 50/30/20 simulator updates from the entered monthly income.
- **States:** the dashboard preview is labeled as example data.
- **Done when:** section and dashboard links work, the simulator updates, and the page holds up in both themes at 375, 768 and 1280px.

## Dashboard
- **Files:** `pages/html/dashboard.html`, `pages/jsx/dashboard.jsx`, `pages/jsx/dashboard/`
- **Status:** Spec is final. The behavior was prototyped in the earlier vanilla version (`index.html` plus `main.js` of the first build, if still in the repo). Rebuild it in React.
- **Purpose:** show money status at a glance and offer the next step.
- **Layout:** see `DESIGN.md` section 6.

Sections, with behavior:

| Section | Behavior |
|---|---|
| Banner | Headline (BlurText) and "Tambah anggota" button (Magnet). Soft blue background with drifting blobs |
| Anggota | Avatar grid (initials). Plus button adds a member (dialog with a name field). Clicking a member offers removal |
| Pengeluaran | Weekly total (CountUp) for the week shown in the calendar. Split bar and legend by category. Plus button records a transaction (category, amount, note, date). Receipt button lists the week's transactions with delete |
| Tabungan 3 bulan | Three bars from monthly `tabungan` totals. A bubble shows the change versus last month. Bars grow in when data changes |
| Statistik | Mingguan or Bulanan toggle. Shows paid bills versus total bills, plus two tiles (paid, open) |
| Pengingat | Bills for the selected calendar date. Check button marks the first one paid and reveals the next. "+ Tambah pengingat" adds one for that date. Empty state when none |
| Paket Premium | Simulated toggle in a dialog. No payment. The card text changes when active |
| Kalender | Seven-day strip (Monday first), previous and next week, dot on days with open bills. Selecting a day updates Pengingat. Changing the week updates Pengeluaran |
| Video edukasi | Horizontal list. Opening one adds a view (once per visit) and lets the user post a comment |
| Notifikasi | Tabs (Ringkasan, Dibagikan, Komentar), mute toggle, mark all read, open an item (marks it read). User actions create notifications. Relative time ("30 menit lalu") |

- **States:** every list has an empty state that says what to do next.
- **Done when:** every row above works with demo data, state persists after refresh, and both themes look finished.

---

## Keuangan (finances)  *Draft*
- **Files:** `pages/html/finances.html`, `pages/jsx/finances.jsx`, `pages/jsx/finances/`
- **Purpose:** see, search and manage all transactions, and watch budgets.
- **Content:**
  - Transaction table: date, note, category, amount. Sort by date. Filter by week or month and by category.
  - Add, edit and delete a transaction (same dialog fields as the dashboard).
  - Budget cards for Kebutuhan, Tabungan and Hiburan with progress bars against a 50/30/20 split of a monthly income the user can set.
  - Summary line: total this month and difference versus last month.
- **Data:** the same `Transaction` list as the dashboard (shared hook). A change here must show on the dashboard after navigation.
- **States:** empty (no transactions), no results for a filter.
- **Done when:** CRUD works, filters work, budgets update live, and the dashboard reflects the changes.

---

## Simulator
- **Files:** `pages/html/simulator.html`, `pages/jsx/simulator.jsx`, `pages/jsx/simulator/`
- **Purpose:** let someone try "what if" plans without risk.
- **Content:**
  - **Target tabungan:** inputs for goal amount, deadline (months) and current savings. Output: needed saving per month and a progress indicator.
  - **Dana darurat:** inputs for monthly needs, current emergency savings and a monthly saving amount. Output: a target of 3 to 6 months of needs and how long it may take to reach each.
- **Rules:** show the assumptions next to every result and label it "Estimasi". Interest or return defaults to 0% and is optional. Never promise returns.
- **States:** validation messages next to fields, results hidden until inputs are valid.
- **Navigation:** uses the same left icon rail as Dashboard, Keuangan and Pengaturan.
- **Status:** Built. Results are calculated locally from the values entered and are not saved.
- **Done when:** both calculators work, handle zero and large numbers, and results are readable by screen readers.

---

## Belajar (learn)  *Draft*
- **Files:** `pages/html/learn.html`, `pages/jsx/learn.jsx`, `pages/jsx/learn/`
- **Purpose:** short lessons that build financial habits.
- **Content:**
  - Lesson cards grouped by topic: budgeting (50/30/20), emergency fund, separating personal and business money, avoiding illegal pinjol.
  - A lesson view with short text, key takeaways and an optional video.
  - "Tandai selesai" saves progress locally and shows a progress bar per topic.
  - A pinjol safety checklist that points to OJK as the official source.
- **Rules:** educational only. No advice to buy specific products.
- **Done when:** lessons open, progress persists, and content is readable at 375px.

---

## Pengaturan (settings)
- **Files:** `pages/html/settings.html`, `pages/jsx/settings.jsx`, `pages/jsx/settings/`
- **Purpose:** preferences and demo controls.
- **Content:**
  - **Tampilan & aksesibilitas:** theme radio group with Terang, Gelap and Ikuti sistem, plus text size, contrast and motion preferences. Spec in `DESIGN.md` section 4. Changes apply at once, persist, and follow the system when "Ikuti sistem" is chosen.
  - **Notifikasi:** turn notifications on or off (the same flag as the dashboard mute).
  - **Privasi & keamanan:** explain local demo storage and the lack of account authentication or server sync.
  - **Bahasa:** choose a saved language preference; full translation is not available in the demo.
  - **Data demo:** button to reset demo data to the starting set, with a confirmation dialog.
  - **Tentang:** short note that this is an educational demo and no real money or personal data is used.
- **Profile:** the local profile form and personal-data fields are removed; any saved profile entry is cleared when Settings loads.
- **Status:** Built. Preferences persist in the browser; theme changes are applied to the settings page, dashboard and finances page.
- **Navigation:** Uses the same left icon rail and working page links as Dashboard and Keuangan.
- **Done when:** the theme switches instantly with no flash on reload, system mode follows OS changes, notifications stay in sync with the dashboard, and reset restores seeded demo data without changing the theme.