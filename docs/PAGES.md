# Pages

One section per page: what it is for, what is on it, how it behaves and when it is done.
Files for an app page `<Page>`: `pages/<page>.html`, `src/pages/<Page>.jsx`, with shared components in `src/components/`.
App pages use `AppShell` (panel plus sidebar); the landing page has its own responsive shell. All pages work in light and dark theme, and at 375px wide.
The sidebar links to built pages only; Simulator and Belajar will appear when their pages are implemented.

Pages marked **Draft** were sketched from the product goals. Confirm them with the team before building and remove the word "Draft" once agreed.

---

## Landing page
- **Files:** `index.html`, `src/pages/Landing.jsx`
- **Purpose:** introduce Moneva and let visitors open the demo or try the budget simulator.
- **Layout:** a full-viewport dark hero with a compact brand, section navigation, and demo action. The headline sits lower left; it wraps and the buttons stack on mobile. Existing content sections, including About, lead to a responsive footer with brand details, grouped links, social profile placeholders, and a return-to-top button.
- **Behavior:** the Indonesian headline types once with a reduced-motion static fallback, while the supporting copy and buttons keep their one-time entrance fade. Navbar links scroll to Features, About, Simulator, and Learn; dashboard actions open the demo. A lazy-loaded, low-contrast DotGrid responds to pointer movement and is omitted when reduced motion is requested; the hero remains dark if the effect cannot load. "Tantangan Keuangan" scrolls to the challenges section; the 50/30/20 simulator updates from the entered monthly income.
- **States:** the dashboard preview is labeled as example data.
- **Done when:** section and dashboard links work, the simulator updates, and the page holds up in both themes at 375, 768 and 1280px.

## Dashboard
- **Files:** `pages/dashboard.html`, `src/pages/Dashboard.jsx`
- **Status:** Implemented in React.
- **Purpose:** show money status at a glance and offer the next step.
- **Layout:** four summary cards and two balanced charts sit above two content columns. The left contains transaction history and a compact calendar; the right contains notifications and upcoming bills. Cards follow their content height, see `DESIGN.md` section 6.

Sections, with behavior:

| Section | Behavior |
|---|---|
| Header and summary | Shows the dashboard period and transaction action with total balance, income, expenses, and savings from stored data |
| Grafik pemasukan | Shows transaction-based income for the selected period; period controls update the chart |
| Porsi pengeluaran | Shows transaction-based expense categories |
| Riwayat transaksi | Search and filter the latest transactions; links to the full financial ledger |
| Notifikasi | Filter tabs, mute controls, mark all read, and open an item (marks it read). Relative time is shown |
| Tagihan mendatang | Shows upcoming reminders with due dates, recorded amounts when available, and payment status. Users can add a reminder or mark it paid |
| Kalender | Full Monday-to-Sunday monthly grid with previous/next month controls and dynamic transaction indicators; selecting a day sets the reminder date |

- **States:** transactions, notifications, and bills have empty states that explain the next action.
- **Done when:** period controls, transaction history, reminders, calendar, and notifications work with demo data, state persists after refresh, and both themes look finished.

---

## Keuangan (finances)  *Draft*
- **Files:** `pages/finances.html`, `src/pages/Finances.jsx`
- **Purpose:** see, search and manage all transactions, and watch budgets.
- **Content:**
  - Transaction table: date, note, category, amount. Sort by date. Filter by week or month and by category.
  - Add, edit and delete a transaction (same dialog fields as the dashboard).
  - Budget cards for Kebutuhan, Tabungan and Hiburan with progress bars against a 50/30/20 split of a monthly income the user can set.
  - Summary line: total this month and difference versus last month.
- **Data:** the same persisted `Transaction` list as the dashboard. Current total balance uses all transactions; period net uses only the selected range. A change here must show on the dashboard after navigation.
- **States:** empty (no transactions), no results for a filter.
- **Done when:** CRUD works, filters work, budgets update live, and the dashboard reflects the changes.

---

## Simulator
- **Files:** `pages/simulator.html`, `src/pages/Simulator.jsx`
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
- **Files:** `pages/learn.html`, `src/pages/Learn.jsx`
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
- **Files:** `pages/settings.html`, `src/pages/Settings.jsx`
- **Purpose:** preferences and demo controls.
- **Content:**
  - **Tampilan:** theme radio group with Terang, Gelap and Ikuti sistem. Spec in `DESIGN.md` section 4. Changes apply at once, persist, and follow the system when "Ikuti sistem" is chosen.
  - **Notifikasi:** turn notifications on or off (the same flag as the dashboard mute).
  - **Data demo:** button to reset demo data to the starting set, with a confirmation dialog.
  - **Tentang:** short note that this is an educational demo and no real money or personal data is used.
- **Status:** Built. Preferences persist in the browser; theme changes are applied to the settings page, dashboard and finances page.
- **Navigation:** Uses the same left icon rail and working page links as Dashboard and Keuangan.
- **Done when:** the theme switches instantly with no flash on reload, system mode follows OS changes, notifications stay in sync with the dashboard, and reset restores seeded demo data without changing the theme.