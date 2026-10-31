<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read these installed skill files directly (use these paths even if a same-named global skill exists):
- Core filter, always on: `antislop`: `.agents/skills/antislop/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.
<!-- antislop:end -->

## AGENTS.md: Dompet Cerdas

Instructions for AI coding assistants (Claude Code, Codex, Cursor, Copilot, and others).
Read this file fully before changing anything.

## What this project is

Dompet Cerdas ("Smart Wallet") is a modern minimalist fintech web app: **Financial Resilience for Everyone**.
It helps young people, students and small business owners (UMKM) in Indonesia track money, pay bills on time, save and learn.
It is a design-focused competition entry, so visual quality, accessibility and a clear story matter as much as features.
Product background: `PRODUCT.md`.

## Read before you work

| Task | Read first |
|---|---|
| Any UI work | `DESIGN.md` |
| New or changed component | `src/components/` and the relevant page file |
| New page, routing, state, data | `ARCHITECTURE.md` |
| Working on one page (what it contains, how it behaves) | that page's section in `PAGES.md` |
| "Do the next task", planning, or a big request | `TASKS.md` |
| Copy, features, user flows | `PRODUCT.md` |
| Why something is the way it is | `DECISIONS.md` |

If a doc and the code disagree, tell the user and ask which is right. Do not silently pick one.

## Stack

- Vite, React (function components and hooks), Tailwind CSS v4 (`@tailwindcss/vite`).
- **Multi-page app:** every page has its own HTML shell and its own JSX file. Pages are separate documents joined by plain links, not a client-side router.
- Components from React Bits (reactbits.dev) are allowed. Follow existing patterns in `src/components/`.
- Font: Plus Jakarta Sans. Language of the UI: Indonesian. Language of code, comments and commit messages: English.

## Commands

Check `package.json` first. Expected scripts:

```bash
npm install
npm run dev       # Vite dev server (usually http://localhost:5173)
npm run build     # production build, must pass before you say you are done
npm run preview   # serve the production build
```

## Project layout

```
index.html                  "/" landing page shell
pages/
├─ html/<page>.html         HTML shell per page: theme script, #root, loads its own JSX
└─ jsx/
   ├─ <page>.jsx            app page: component plus a mountPage(...) call
   ├─ index.jsx              landing page
   └─ <page>/               components used only by that page
src/
├─ components/              shared components (AppShell, Modal, Toast, ...)
│  └─ reactbits/            copied React Bits components
├─ hooks/                   useLocalStorage, useTheme, ...
├─ lib/                     pure helpers: money, dates, nav list
├─ css/style.css            Tailwind import, theme tokens, shared classes
├─ js/main.jsx              mountPage(): creates the root, wraps providers
└─ assets/                  images and static assets
App.jsx                     Vite template leftover, not used by pages
.agents/, skills-lock.json  installed agent skills. Do not edit by hand.
DESIGN.md, AGENTS.md, CLAUDE.md, root-level project docs (keep updated)
```

Pages: `dashboard`, `finances`, `simulator`, `learn`, `settings`.
See `ARCHITECTURE.md` for how the pieces connect and the steps to add a page.

## Hard rules

1. **Tokens only.** Use the semantic color tokens in `DESIGN.md` (`bg-surface`, `text-ink`, `text-muted`, `bg-primary`, and so on). Never hard-code hex values or raw palette colors like `bg-slate-200`.
2. **Both themes.** Every UI change must work in light and dark mode. Test both before finishing.
3. **Tailwind first.** Write utilities in JSX. Add custom CSS only for reusable components or things utilities cannot express, and put it in `src/css/style.css`.
4. **Write complete class names.** Never build Tailwind classes by string concatenation (`"bg-" + color`). Use a lookup object with full class strings.
5. **Accessibility is required.** Semantic HTML, a visible label on every input, `aria-label` on icon-only buttons, visible focus rings, keyboard access, `prefers-reduced-motion` respected.
6. **No new dependencies without asking.** This includes animation libraries that a React Bits component needs (`motion`, `gsap`, `ogl`, `three`). Name the package and the reason, then wait.
7. **Reuse before creating.** Look in `src/` for an existing component first.
8. **Do not touch** `node_modules/`, `.agents/`, `skills-lock.json` or lock files unless the task is about dependencies.
9. **Do not invent features, data or claims.** If a page's content is unclear, ask or leave a clearly marked placeholder.
10. **Match existing patterns.** Follow the naming, folder and code style already in the repo.
11. **One page, one JSX file.** Page code lives in `pages/jsx/<page>.jsx`. Components used only by that page live in `pages/jsx/<page>/`. Pages never import from each other. Anything a second page needs moves to `src/components/`.
12. **Pages are separate documents.** React state is lost on navigation. Share data between pages only through the `localStorage` hooks in `src/hooks/`. Links between pages are plain `<a href>` using the list in `src/lib/nav.js`.

## Finance and safety rules

- The app is educational and a demo. It never moves real money and never asks for real bank details, card numbers, PINs or identity numbers. Do not add forms that collect them.
- All sample data is fake and must look fake enough not to be mistaken for a real person's data.
- Never promise returns, guaranteed savings or "safe" investments. Simulators must show assumptions and say that results are estimates.
- Learning content that mentions lending (pinjol) should point users to official sources such as OJK.
- Do not store sensitive personal data in `localStorage`. Only demo data and preferences.

## Working style

- Make the smallest change that solves the task. Do not rewrite unrelated files or reformat whole files.
- Explain what you changed and why, in plain language, at the end.
- When a request is ambiguous, ask one focused question instead of guessing.
- When told to "do the next task", open `TASKS.md`, take the first unchecked task, follow its acceptance criteria, and tick it when done. Do not start a later task early.
- If you notice a bug, a doc mismatch or an accessibility problem outside the task, mention it. Do not silently fix it.
- When you make a design or architecture decision, add a short entry to `DECISIONS.md`.
- When you add or rename a component, page, token or storage key, update the matching doc in the same change.

## Definition of done

- [ ] `npm run build` passes with no errors.
- [ ] Works in light and dark theme.
- [ ] Checked at 375, 768 and 1280px wide.
- [ ] Keyboard only: can reach and use every control, focus is visible.
- [ ] Animations stop or simplify under `prefers-reduced-motion`.
- [ ] No hard-coded colors, no console errors or warnings.
- [ ] UI text is correct, natural Indonesian.
- [ ] If a page was added or changed: HTML shell, JSX file, `vite.config.js` input, `src/lib/nav.js` and `PAGES.md` are all consistent.
- [ ] Docs updated if tokens, components, pages or decisions changed.