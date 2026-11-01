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
- **Decision:** `PAGES.md` describes each page. `TASKS.md` is an ordered task list with acceptance criteria. Tools take the first unchecked task when told to continue.
- **Consequences:** Keep both files current. Tick a task only when its acceptance criteria are met.

## 010. Landing page motion
- **Context:** The landing page needs a more polished entrance without distracting from its financial information.
- **Decision:** Use a short word-by-word blur reveal for the headline and subtle entrance motion for the supporting copy and product preview, using CSS keyframes through Tailwind's motion-safe variant.
- **Consequences:** Motion respects `prefers-reduced-motion` and stays limited to opacity, blur, and small vertical movement without adding runtime animation code.

## 011. Settings page preferences
- **Context:** The settings page needs to control the shared demo's theme, notification visibility and sample data.
- **Decision:** Keep the page in the documented React entry structure, persist theme choice under `dompet-cerdas-theme`, and update the dashboard's existing `muted` flag in `dompet-cerdas-v1`.
- **Consequences:** Theme preferences are retained when demo data is reset. Dashboard and finances shells read the same theme preference before rendering.

## 012. Sidebar destinations
- **Context:** Sidebar navigation must not point to missing or empty pages.
- **Decision:** Link the sidebar only to implemented pages and use the current `/pages/html/` routes.
- **Consequences:** Navigation opens working screens instead of blank or missing pages. The sidebar links to Dashboard, Keuangan, Simulator and Pengaturan; add Belajar when it is implemented.

## 013. Simulator estimates
- **Context:** The simulator needs useful estimates without implying guaranteed financial outcomes.
- **Decision:** Keep the savings-goal and emergency-fund calculations in the page, use only user-entered values, and assume zero interest or returns.
- **Consequences:** Results are labeled as estimates with their assumptions, and no demo financial values are presented as user data.

## 014. Shared app-page motion
- **Context:** Settings and Simulator use the same app shell as Dashboard and Keuangan but are mounted through React.
- **Decision:** Apply the existing one-time heading/card entrance and pointer-following card highlight to those React pages, while respecting reduced-motion preferences.
- **Consequences:** Shared motion stays consistent across app pages without adding continuous background animation.

## 015. Content-sized sticky sidebar
- **Context:** The sidebar stretched to the height of the page content because the app shell uses flex layout.
- **Decision:** Keep the sidebar at its content height and sticky near the top while scrolling; switch to a horizontal rail below `lg`.
- **Consequences:** Long pages no longer make the navigation rail grow, and the navigation fits the mobile layout without reducing content width.
- **Status:** Superseded by decision 019.

## 016. Framed landing hero and wordmark footer
- **Context:** The landing page should reflect the supplied rounded hero and large closing typography reference without using its embedded screenshot as product artwork.
- **Decision:** Center the existing message and product preview in a rounded frame, then close with working page links and the requested "do it better" wordmark using the established color tokens.
- **Consequences:** The landing page borrows the reference's composition while keeping Dompet Cerdas branding and theme support intact.

## 017. Floating landing preview
- **Context:** The new WEBP reference uses a compact header and a large product interface layered over a spacious hero.
- **Decision:** Move the landing message onto a light token background and enlarge the existing dashboard preview so it overlaps the hero boundary; keep the supplied image as reference only.
- **Consequences:** Visitors see the real demo UI as the landing page focal point without importing another brand, fabricated metrics, or extra image assets.

## 018. Landing feature hierarchy
- **Context:** The landing page's two core capabilities need distinct visual weight without hiding either from visitors.
- **Decision:** Give shared cash-flow tracking the wider feature panel because it is the product's most distinctive capability, and keep bill reminders as a supporting panel.
- **Consequences:** The asymmetric feature layout communicates priority while preserving both examples and their explanations.

## 019. Fixed app navigation and page transitions
- **Context:** App pages use full-page links, and their different shells made the navigation shift between screens.
- **Decision:** Pin the desktop rail to the viewport and place the mobile navigation at the bottom; use a brief page-entry fade that respects reduced-motion preferences.
- **Consequences:** App content reserves space for the fixed navigation, while links remain native full-page navigation without adding a router.