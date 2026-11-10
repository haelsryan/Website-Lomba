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
- **Behavior:** the Indonesian headline types once with a reduced-motion static fallback, while the supporting copy and buttons keep their one-time entrance fade. Navbar links scroll to Problems, Features, and Preview; dashboard actions open the demo. A lazy-loaded, low-contrast DotGrid responds to pointer movement and is omitted when reduced motion is requested; the hero remains dark if the effect cannot load. "Tantangan Keuangan" scrolls to the challenges section; the 50/30/20 simulator updates from the entered monthly income.
- The financial challenges section summarizes Sun Life Indonesia's 2025 findings with labeled percentage bars for financial confidence, long-term planning, and advice-seeking, with links to the release and its ANTARA coverage.
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
| Header and summary | Shows the selected period (current week, current month, 3 or 6 recent months, or current year) and transaction action with total balance, income, expenses, and savings from stored data. Shared profile and notification controls are available from the top-right header |
| Target keuangan | Shows saved savings targets with their target amount, monthly estimate, completion estimate, and progress. Targets are created in the Simulator and stored locally |
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
  - **Target tabungan:** formatted Rupiah inputs, quick durations, reverse monthly-capacity calculation, optional return, inflation and contribution-growth assumptions, progress, projections and duration comparisons.
  - **Dana darurat:** profile-based minimum and ideal targets, adjustable month assumptions, progress and estimated completion times.
  - **Anggaran 50/30/20:** configurable allocations compared with current-month demo transactions.
  - **Utang dan cicilan:** simplified balance-based interest estimate with an accelerated-payment comparison.
  - **Usaha UMKM:** unit contribution, break-even, monthly profit and working-capital estimates.
  - **Bunga majemuk and dampak inflasi:** illustrative projections with assumptions shown alongside the results.
  - Saved scenarios can be renamed, deleted, restored and compared. A savings goal can be added to Dashboard. Summaries can be copied or printed from the browser.
- **Rules:** show the assumptions next to every result and label it "Estimasi". Interest or return defaults to 0% and is optional. Never promise returns. Calculations are educational estimates, not lender-specific quotes or investment advice.
- **States:** validation messages next to fields, results hidden until inputs are valid.
- **Navigation:** uses the same left icon rail as Dashboard, Keuangan and Pengaturan.
- **Status:** Built. Results are calculated locally; scenarios and saved goals persist in the browser.
- **Done when:** calculators work, handle invalid and large values, show assumptions, and results are readable by screen readers.

---

## Belajar (learn)
- **Files:** `pages/learn.html`, `src/pages/Learn.jsx`
- **Status:** Implemented in React. YouTube topics remain visibly unconfigured until verified video IDs are added.
- **Purpose:** short lessons that build financial habits.
- **Content:**
  - Searchable article and video-topic cards grouped by financial topic.
  - Article details with complete Indonesian educational content, reading time, publication date, key takeaways and an OJK reference for online-lending safety.
  - "Tandai selesai" saves reading progress locally and shows a progress bar per topic.
  - Bookmarks persist locally and can be filtered from the material list.
  - Video topics open a player only when their data includes a valid YouTube ID; otherwise, the page labels the missing configuration and links to a YouTube topic search.
  - Simulator results link to the corresponding existing learning article.
- **Rules:** educational only. No advice to buy specific products. Popularity is not claimed without usage data.
- **Done when:** lessons open, bookmarks and progress persist, the OJK reference works, unconfigured videos are not presented as playable, and content is readable at 375px in both themes.

---

## Pengaturan (settings)
- **Files:** `pages/settings.html`, `src/pages/Settings.jsx`
- **Purpose:** preferences and demo controls.
- **Content:**
  - **Profil:** editable name, email, short bio, and user type, stored in the browser.
  - **Tampilan:** theme radio group with Terang, Gelap and Ikuti sistem. Changes apply at once, persist, and follow the system when "Ikuti sistem" is chosen.
  - **Aksesibilitas:** text scale, high contrast, and reduced motion.
  - **Preferensi:** toggle the supplied cloud wallpaper.
  - **Notifikasi:** turn notifications on or off (the same flag as the dashboard mute).
  - **Data demo:** button to reset demo data to the starting set, with a confirmation dialog.
  - **Tentang:** short note that this is an educational demo and no real money or personal data is used.
- **Status:** Built. Preferences persist in the browser; theme changes are applied to the settings page, dashboard and finances page.
- **Navigation:** Uses the same left icon rail and working page links as Dashboard and Keuangan.
- **Done when:** the theme switches instantly with no flash on reload, system mode follows OS changes, notifications stay in sync with the dashboard, and reset restores seeded demo data without changing the theme.