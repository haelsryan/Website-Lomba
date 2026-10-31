# Tasks
 
Ordered work list. When told to "do the next task", take the **first unchecked task**, follow its acceptance criteria, then tick it.
Do not start a later task early. If a task is blocked or unclear, ask one question and stop.
Read the docs named in each task before you start. Run `npm run build` at the end of every task.
 
Legend: `- [ ]` open, `- [x]` done.
 
---
 
## T1. Multi-page foundation
- [ ] **Read:** `docs/ARCHITECTURE.md`
- Set up `vite.config.js` (React plugin, Tailwind plugin, `@` alias, all pages as inputs).
- Create `src/js/main.jsx` with `mountPage()`.
- Create the five HTML shells in `pages/html/` (with the theme script) and a placeholder `pages/jsx/<page>.jsx` for each.
- Make root `index.html` redirect to the dashboard.
- Create `src/lib/nav.js`.
- **Accept:**
  - `npm run dev` serves all five `/pages/html/*.html` URLs, each showing its page title.
  - `npm run build` passes and `dist/` contains all five pages.
  - No page imports from another page.
## T2. Tokens and theme engine
- [ ] **Read:** `DESIGN.md` sections 3 to 5
- Put the light and dark tokens in `src/css/style.css` (`@theme inline`, `@custom-variant dark`).
- Add the shared classes (`.card`, `.btn`, `.icon-btn`, `.nav-link`, `.avatar`, `.icon`) using tokens only.
- Create `src/hooks/useTheme.jsx` (`ThemeProvider`, `useTheme`) with `light`, `dark` and `system`, storage key `dompet-cerdas-theme`, and a listener for system changes.
- **Accept:**
  - Setting `data-theme="dark"` on `<html>` in devtools flips every color.
  - No hex values outside the token definitions.
  - Reload with a stored theme shows no flash of the wrong theme.
  - Body text contrast is at least 4.5:1 in both themes.
## T3. Shared components and hooks
- [ ] **Read:** `docs/COMPONENTS.md`, `DESIGN.md` sections 7 and 9
- Build in `src/components/`: `AppShell`, `Sidebar`, `Card`, `Button`, `IconButton`, `Icon`, `Avatar`, `Field`, `Modal`, `Toast`.
- Build in `src/hooks/`: `useLocalStorage`, `useDemoData` (with the seed from `src/lib/seed.js`), `useToast`.
- Build in `src/lib/`: `money.js`, `dates.js`, `seed.js`.
- **Accept:**
  - `AppShell` highlights the current page from the `current` prop and works as a horizontal bar below `lg`.
  - `Modal` closes with Esc and a backdrop click and restores focus.
  - Every icon-only button has an `aria-label`.
  - Storage failures fall back to defaults without crashing.
## T4. Dashboard page
- [ ] **Read:** `docs/PAGES.md` (Dashboard), `DESIGN.md` section 8
- Build `pages/jsx/dashboard.jsx` and the components in `pages/jsx/dashboard/`.
- Add React Bits effects as listed in `docs/COMPONENTS.md` (BlurText, CountUp, SpotlightCard, Magnet). Ask before installing a new package.
- **Accept:**
  - Every behavior in the Dashboard table works with demo data and survives a refresh.
  - Looks finished in both themes at 375, 768 and 1280px.
  - Only one continuous background effect is active. Animations stop under `prefers-reduced-motion`.
## T5. Settings page with the theme toggle
- [ ] **Read:** `docs/PAGES.md` (Pengaturan), `DESIGN.md` section 4
- Build `pages/jsx/settings.jsx` and `pages/jsx/settings/ThemeToggle.jsx` (a real radio group with visible labels).
- Add the notification switch and the "reset demo data" action with a confirmation dialog.
- **Accept:**
  - Choosing Terang, Gelap or Ikuti sistem changes the theme at once and persists.
  - "Ikuti sistem" reacts when the OS theme changes.
  - The notification switch matches the dashboard mute. Reset restores the seed data.
  - The toggle works with keyboard only.
## T6. Finances page
- [ ] **Read:** `docs/PAGES.md` (Keuangan)
- **Accept:** CRUD, filters and budget progress work; a change appears on the dashboard after navigation; empty and no-result states exist.
## T7. Simulator page
- [ ] **Read:** `docs/PAGES.md` (Simulator), `AGENTS.md` (Finance and safety rules)
- **Accept:** both calculators work for edge values; assumptions and the word "Estimasi" appear next to results; no promise of returns anywhere.
## T8. Learn page
- [ ] **Read:** `docs/PAGES.md` (Belajar)
- **Accept:** lessons open, progress persists, the pinjol checklist links to OJK as the source, and the layout works at 375px.
## T9. Quality pass
- [ ] **Read:** `AGENTS.md` (Definition of done)
- Check every page in both themes at 375, 768 and 1280px, with keyboard only, with a screen reader spot check, and with reduced motion on.
- Run an accessibility audit (for example Lighthouse) on each page.
- **Accept:** Lighthouse accessibility is at least 90 on all pages, no console errors, `npm run build` passes, and `docs/` matches the code.
## T10. Competition polish
- [ ] **Read:** `docs/PRODUCT.md` (Competition context)
- Write a `README.md` (what it is, how to run it, the theme fit, screenshots in both themes).
- Prepare a 60-second demo path across the five pages and note it in `README.md`.
- **Accept:** a new person can run the project and follow the demo path without help.
