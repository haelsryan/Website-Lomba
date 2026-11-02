# Project instructions

Moneva is a Vite, React and Tailwind CSS v4 multi-page financial education demo for people in Indonesia.

Tagline: Your Money, Your Future, Your Way.

Pages are separate documents with lowercase HTML URLs; React page components live in `src/pages/`.

## Read before working

- UI changes: `DESIGN.md`, then the relevant page in `PAGES.md`.
- Routing, state, data, or page changes: `ARCHITECTURE.md`.
- Product copy and user flows: `PRODUCT.md`.
- Planned work: `TASKS.md`.
- Existing design decisions: `DECISIONS.md`.

If documentation disagrees with the code or task, identify the mismatch and ask which is authoritative before making a consequential choice.

## Project layout

```text
index.html
pages/                       lowercase HTML entries
docs/                        project documentation
src/
  assets/                    imported source assets
  components/
    fx/
    landing/
    layout/
    react-bits/
    settings/
    ui/
  hooks/
  lib/
  pages/                     PascalCase page components
  styles/style.css
  App.jsx
  main.jsx
```

Keep the root `AGENTS.md` as a one-line pointer to this document. Do not edit `.agents/skills/`, `skills-lock.json`, or lockfiles unless the task concerns those files or dependencies.

## Engineering rules

1. Keep changes surgical. Preserve existing behavior and follow the current code style.
2. Keep page URLs lowercase (`/pages/dashboard.html`, and so on) and page component filenames PascalCase (`src/pages/Dashboard.jsx`).
3. Use relative imports that resolve from the importing file. Keep shared components in `src/components/` and stateful behavior in `src/hooks/`.
4. Do not introduce dependencies without asking first.
5. Use existing design tokens and preserve both light and dark themes. Do not change styling unless requested.
6. Preserve Indonesian UI copy unless the task explicitly requests a copy change.
7. Use semantic HTML, accessible names, visible focus, keyboard interaction, and reduced-motion support.
8. Do not invent product behavior, data, user claims, or assets. This is an educational demo and does not move real money or collect sensitive financial details.
9. Keep local-storage keys stable unless a migration is explicitly required.
10. Run the relevant validation, including `npm run build`, before reporting completion.

## Finance and safety

- Never add real payments, bank connections, or collection of card numbers, PINs, identity numbers, or other sensitive information.
- Treat sample data as fictional demo data.
- Present simulator outputs as estimates. Do not promise returns or guaranteed savings.
- Direct pinjol safety guidance to official sources such as OJK.
