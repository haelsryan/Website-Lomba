# Decisions

A short log of choices that affect the whole project. Newest at the bottom.
Format: **Context**, **Decision**, **Consequences**. Add an entry whenever you make a decision others should not undo by accident.

## 001. Tailwind CSS v4 with theme tokens
- **Context:** Needs a consistent look across five pages without a lot of custom CSS.
- **Decision:** Use Tailwind v4 through `@tailwindcss/vite`. Define colors and fonts in `src/css/style.css` (`@theme`). No `tailwind.config.js`.
- **Consequences:** Components use token utilities. No hard-coded colors. Dynamic class names must be written in full.

## 002. Start vanilla, then add React
- **Context:** The first dashboard build used HTML plus vanilla JS to follow a "no frameworks" brief.
- **Decision:** Add React on top of Vite so React Bits components can be used fully.
- **Consequences:** The old `data-act` and `innerHTML` rendering approach is replaced by React components and hooks. Pages are organized as in decision 008. Docs and `AGENTS.md` were updated to allow React.

## 003. Demo data in localStorage
- **Context:** No backend during the competition. The demo needs to feel real and survive refresh.
- **Decision:** Keep seeded demo data and preferences in `localStorage` (`dompet-cerdas-v1`, `dompet-cerdas-theme`).
- **Consequences:** Data is per browser. "Keluar" resets the demo. Never store sensitive data. Bump the key version if the data shape changes.

## 004. Light and dark theme with semantic tokens
- **Context:** Users want a night mode, switchable in Settings.
- **Decision:** Semantic CSS variables swapped under `[data-theme="dark"]` on `<html>`, exposed with `@theme inline`. Three choices: Terang, Gelap, Ikuti sistem (default). A blocking script in `<head>` prevents a flash of the wrong theme.
- **Consequences:** Components use `text-ink`, `bg-surface` and similar, rarely `dark:` variants. Old `navy` usages must be migrated: text becomes `ink`, strong fills become `accent`, the sidebar uses `sidebar`. Every UI change is checked in both themes.

## 005. Indonesian UI, English code
- **Context:** Audience is Indonesian. The team and tools work comfortably in English.
- **Decision:** All user-facing text is Indonesian. Code, comments, commit messages and docs are English.
- **Consequences:** Copy follows the tone rules in `PRODUCT.md` and `DESIGN.md`.

## 006. Educational demo, not financial advice
- **Context:** Finance content can mislead or harm if it sounds like advice or handles real data.
- **Decision:** The app never handles real money or sensitive identifiers. Simulators show assumptions and label results as estimates. No promises of returns.
- **Consequences:** Rules in `AGENTS.md` ("Finance and safety rules") apply to every feature and every piece of copy.

## 007. Motion is limited and optional
- **Context:** React Bits makes it easy to add many effects, which would hurt clarity and performance.
- **Decision:** A few chosen moments, at most one continuous background effect per screen, everything respects `prefers-reduced-motion`.
- **Consequences:** New effects are checked against `DESIGN.md` section 8 before they are added.

## 008. One HTML shell and one JSX file per page
- **Context:** Five pages (dashboard, finances, simulator, learn, settings) must stay easy to manage, and several people (and AI tools) work on them.
- **Decision:** Multi-page Vite app. `pages/html/<page>.html` is the shell and loads `pages/jsx/<page>.jsx`, which renders itself with `mountPage()`. Page-only components live in `pages/jsx/<page>/`. Shared code lives in `src/components/`, `src/hooks/` and `src/lib/`. Pages never import each other. No client-side router. `App.jsx` from the Vite template is not used.
- **Consequences:** Changing one page cannot break another. Page-to-page navigation is a full page load, so shared data goes through `localStorage` hooks. Each new page needs a Vite input entry and a nav entry (checklist in `ARCHITECTURE.md`).

## 009. Specs and tasks live in the repo
- **Context:** AI tools need to know what to build and when it is done.
- **Decision:** `docs/PAGES.md` describes each page. `docs/TASKS.md` is an ordered task list with acceptance criteria. Tools take the first unchecked task when told to continue.
- **Consequences:** Keep both files current. Tick a task only when its acceptance criteria are met.