# Architecture

How the project is organized and how data flows. Keep this in sync with the code.

## Stack

- **Vite** for dev server and build, with `@vitejs/plugin-react`.
- **React** (function components, hooks).
- **Tailwind CSS v4** through `@tailwindcss/vite`. Tokens live in `src/styles/style.css`.
- No backend and no client-side router. Demo data and preferences live in `localStorage`.

## The big idea: one page, one JSX file

Every page is a separate document made of two files, plus an optional folder:

```
pages/finances.html           shell: <head>, theme script, <div id="root">, loads the JSX below
src/pages/Finances.jsx        the page component and the mountPage(...) call
```

Why: a change to one page cannot break another, each page is easy to hand to a person or an AI tool, and the folder tells you at once what belongs where.

## Folder map

```
index.html                  "/" landing page
pages/                      dashboard.html  finances.html  simulator.html  learn.html  settings.html
src/
├─ assets/                  imported source assets
├─ components/              shared and page-grouped components
│  └─ react-bits/           copied React Bits components
├─ hooks/                   useAppState.js, useTheme.js
├─ lib/                     money.js, dates.js, nav.js (the sidebar list), seed.js (demo data)
├─ pages/                   Landing.jsx, Dashboard.jsx, Finances.jsx, Learn.jsx, Settings.jsx, Simulator.jsx
├─ styles/style.css         Tailwind import, light/dark tokens, shared classes
├─ App.jsx
└─ main.jsx                 shared entry and page bootstrap
```

## Rules for the structure

1. A page file imports from `src/` and from its own folder only. **Pages never import from each other.**
2. Page-only components live in the appropriate `src/components/` group. Shared code also lives in `src/components/`.
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
        ...Object.fromEntries(pages.map((p) => [p, abs(`./pages/${p}.html`)])),
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
    <script type="module" src="/src/pages/Finances.jsx"></script>
  </body>
</html>
```

The theme script is copied into every shell. Keep all copies identical.

Bootstrap (shared by all pages):

```jsx
// src/main.jsx
import "./styles/style.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

export function mountPage(Component) {
  const root = document.getElementById("root");
  if (!root) return;
  ReactDOM.createRoot(root).render(
    <StrictMode><Component /></StrictMode>
  );
}
```

Page file:

```jsx
// src/pages/Finances.jsx
import { mountPage } from "@/main.jsx";

function FinancesPage() {
  return <main><h1>Keuangan</h1></main>;
}

mountPage(FinancesPage);
```

Nav list (single source for the sidebar):

```js
// src/lib/nav.js
export const NAV = [
  { id: "dashboard", label: "Dasbor", href: "/pages/dashboard.html", icon: "grid" },
  { id: "finances", label: "Keuangan", href: "/pages/finances.html", icon: "wallet" },
  { id: "simulator", label: "Simulator", href: "/pages/simulator.html", icon: "target" },
  { id: "learn", label: "Belajar", href: "/pages/learn.html", icon: "book" },
  { id: "settings", label: "Pengaturan", href: "/pages/settings.html", icon: "sliders" },
];
```

Root `index.html` serves the landing page. Other pages use lowercase `/pages/<page>.html` URLs.

Optional: add a `jsconfig.json` with `"paths": { "@/*": ["src/*"] }` so the editor understands the `@` alias.

## Add a new page (checklist)

1. Copy a shell to `pages/<page>.html`. Change the title and the script path.
2. Create `src/pages/<Page>.jsx` and reuse shared components from `src/components/`.
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

- `npm run build` writes to `dist/` and keeps the lowercase `pages/` paths, so the nav links work in production.
- Static hosting is enough (no server code).