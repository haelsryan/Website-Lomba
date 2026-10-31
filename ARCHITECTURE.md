# Architecture

How the project is organized and how data flows. Keep this in sync with the code.

## Stack

- **Vite** for dev server and build, with `@vitejs/plugin-react`.
- **React** (function components, hooks).
- **Tailwind CSS v4** through `@tailwindcss/vite`. Tokens live in `src/css/style.css`.
- No backend and no client-side router. Demo data and preferences live in `localStorage`.

## The big idea: one page, one JSX file

Every page is a separate document made of two files, plus an optional folder:

```
pages/html/finances.html      shell: <head>, theme script, <div id="root">, loads the JSX below
pages/jsx/finances.jsx        the page component and the mountPage(...) call
pages/jsx/finances/           components that only this page uses (optional)
```

Why: a change to one page cannot break another, each page is easy to hand to a person or an AI tool, and the folder tells you at once what belongs where.

## Folder map

```
index.html                  "/" entry. Redirects to the dashboard
pages/
├─ html/                    dashboard.html  finances.html  simulator.html  learn.html  settings.html
└─ jsx/
   ├─ dashboard.jsx         + dashboard/   (Banner, MembersCard, SpendCard, ...)
   ├─ finances.jsx          + finances/
   ├─ simulator.jsx         + simulator/
   ├─ learn.jsx             + learn/
   └─ settings.jsx          + settings/    (ThemeToggle, ...)
src/
├─ components/              shared: AppShell, Sidebar, Card, Modal, Toast, Button, Icon, ...
│  └─ reactbits/            copied React Bits components
├─ hooks/                   useLocalStorage, useTheme (ThemeProvider), useToast, ...
├─ lib/                     money.js, dates.js, nav.js (the sidebar list), seed.js (demo data)
├─ css/style.css            Tailwind import, light/dark tokens, shared classes
├─ js/main.jsx              mountPage(): creates the root and wraps providers
└─ assets/                  images and static assets
App.jsx                     Vite template leftover. Not used by pages. Delete once nothing imports it
```

## Rules for the structure

1. A page file imports from `src/` and from its own folder only. **Pages never import from each other.**
2. Page-only components live in `pages/jsx/<page>/`. When a second page needs one, move it to `src/components/`.
3. Page-to-page navigation uses plain `<a href>` (a full page load). Build the list once in `src/lib/nav.js`, and let `AppShell` render it.
4. Because each page is a new document, React state is lost on navigation. Anything that must survive goes through the `localStorage` hooks.
5. Do not put business logic in JSX files. Put pure functions in `src/lib/` and stateful logic in `src/hooks/`.

## Entry files

Vite config (all five pages plus the root are build inputs):

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const pages = ["dashboard", "finances", "simulator", "learn", "settings"];
const abs = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": abs("./src") } },
  build: {
    rollupOptions: {
      input: {
        index: abs("./index.html"),
        ...Object.fromEntries(pages.map((p) => [p, abs(`./pages/html/${p}.html`)])),
      },
    },
  },
});
```

HTML shell (one per page, only the title and the script path change):

```html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <title>Keuangan | Dompet Cerdas</title>
    <script>
      (function () {
        try {
          var t = localStorage.getItem("dompet-cerdas-theme") || "system";
          var dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
          document.documentElement.dataset.theme = dark ? "dark" : "light";
        } catch (e) {}
      })();
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-canvas font-sans text-ink antialiased">
    <div id="root"></div>
    <script type="module" src="/pages/jsx/finances.jsx"></script>
  </body>
</html>
```

The theme script is copied into every shell. Keep all copies identical.

Bootstrap (shared by all pages):

```jsx
// src/js/main.jsx
import "../css/style.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/hooks/useTheme.jsx";

export function mountPage(page) {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <ThemeProvider>{page}</ThemeProvider>
    </StrictMode>
  );
}
```

Page file:

```jsx
// pages/jsx/finances.jsx
import { mountPage } from "@/js/main.jsx";
import AppShell from "@/components/AppShell.jsx";
import TransactionTable from "./finances/TransactionTable.jsx";

function FinancesPage() {
  return (
    <AppShell current="finances">
      <h1 className="text-3xl font-medium tracking-tight">Keuangan</h1>
      <TransactionTable />
    </AppShell>
  );
}

mountPage(<FinancesPage />);
```

Nav list (single source for the sidebar):

```js
// src/lib/nav.js
export const NAV = [
  { id: "dashboard", label: "Dasbor", href: "/pages/html/dashboard.html", icon: "grid" },
  { id: "finances", label: "Keuangan", href: "/pages/html/finances.html", icon: "wallet" },
  { id: "simulator", label: "Simulator", href: "/pages/html/simulator.html", icon: "target" },
  { id: "learn", label: "Belajar", href: "/pages/html/learn.html", icon: "book" },
  { id: "settings", label: "Pengaturan", href: "/pages/html/settings.html", icon: "sliders" },
];
```

Root `index.html` only redirects: a `<meta http-equiv="refresh" content="0; url=/pages/html/dashboard.html">` plus a visible link as a fallback.

Optional: add a `jsconfig.json` with `"paths": { "@/*": ["src/*"] }` so the editor understands the `@` alias.

## Add a new page (checklist)

1. Copy a shell to `pages/html/<page>.html`. Change the title and the script path.
2. Create `pages/jsx/<page>.jsx` (and `pages/jsx/<page>/` if it needs its own components) using the page template.
3. Add the page name to the `pages` array in `vite.config.js`.
4. Add an entry to `src/lib/nav.js`.
5. Add a section to `PAGES.md` and a row to the pages table in `PRODUCT.md`.
6. Run `npm run build` and check the page in both themes.

## State and storage

| Key | Content | Owner |
|---|---|---|
| `dompet-cerdas-v1` | Demo data: members, transactions, reminders, notifications, videos, plan, mute flag | `useDemoData` hook (shared by dashboard, finances, simulator) |
| `dompet-cerdas-theme` | `light`, `dark` or `system` | `useTheme` and the Settings page |

Rules:
- Wrap every `localStorage` read and write in `try/catch` and fall back to defaults.
- Never store sensitive personal data.
- Use the shared hooks, not scattered `localStorage` calls. Listen to the `storage` event so a second open tab stays in sync.
- If the data shape changes, bump the key version (`v2`) or write a migration.
- The seed data generator lives in `src/lib/seed.js` and creates dates relative to today.

## Domain model (demo data)

```
Member        { id, name }
Transaction   { id, date: "YYYY-MM-DD", cat: "kebutuhan" | "tabungan" | "hiburan", amount: number (IDR), note }
Reminder      { id, date: "YYYY-MM-DD", title, time: "HH:MM", done: boolean }
Notification  { id, who, type: "shared" | "comment" | "view", label, text, ts: epoch ms, read: boolean, go?: videoId }
VideoState    { [videoId]: { views, c: commentCount, list: string[] } }
Settings      { premium: boolean, muted: boolean }
```

Derived values:
- Weekly spending = sum of transactions in the displayed week (Monday to Sunday).
- Savings per month = sum of `tabungan` transactions in that calendar month. The "+N%" bubble compares this month with last month.
- Bill stats = reminders in the current week or month, counted as done versus total.

## Conventions

- **Money:** `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact" })`. Store plain integers in rupiah.
- **Dates:** store local dates as `YYYY-MM-DD`. Format with `Intl.DateTimeFormat("id-ID")`. Weeks start on Monday.
- **IDs:** use `crypto.randomUUID()` or `Date.now()`; never rely on array index.
- **Escaping:** React escapes text by default. Never use `dangerouslySetInnerHTML` with user input.
- **Styling:** Tailwind utilities in JSX, tokens only, both themes.
- **Icons:** one `Icon` component backed by one sprite or icon set (stroke 1.75, rounded). No repeated inline SVG.

## Build and deploy

- `npm run build` writes to `dist/` and keeps the `pages/html/` paths, so the nav links work in production.
- Static hosting is enough (no server code).