# Dompet Cerdas: Design Guide

Financial Resilience for Everyone.
Read this before building or changing any UI. Update it when a design decision changes.
Related docs: `AGENTS.md` (rules), `docs/PRODUCT.md` (who and why), `docs/COMPONENTS.md` (building blocks), `docs/ARCHITECTURE.md` (code structure).

## 1. Design intent

- **Feel:** modern minimalist fintech. Calm, clear, trustworthy, friendly. Never flashy.
- **Job of every screen:** let someone see their money at a glance and take one small next step (record, pay, save, learn).
- **Audience:** young people, students and small business owners (UMKM) in Indonesia. Many use mid-range phones, so keep it light and readable.
- **Priority:** desktop-first, but every page must work at 375px wide.
- **Themes:** light and dark, switchable in Settings (section 4). Every screen must look finished in both.
- **Reference:** the dashboard layout was adapted from a bento-style reference (dark sidebar pill, rounded cards on a tinted panel). Borrow structure and mood only, never branding. See `docs/references/README.md`.

## 2. Principles

1. One focus per screen: the number or action that matters most gets the most visual weight.
2. Color carries meaning (blue = action or progress), not decoration.
3. Calm motion in a few chosen moments, never everywhere.
4. Plain Indonesian, no jargon without an explanation.
5. Accessible by default: contrast, labels, keyboard, reduced motion.

## 3. Typography

- **Font:** Plus Jakarta Sans (400 to 800), loaded from Google Fonts in `<head>`. Fallback: `ui-sans-serif, system-ui, sans-serif`.
- Page title (`h1`): `text-3xl font-medium tracking-tight`.
- Card title (`h2`): `text-xl font-medium`. Small card label: `text-sm text-muted`.
- Big numbers: `text-4xl` or `text-5xl font-medium tracking-tight`.
- Meta text: `text-xs` (12px is the minimum size).
- Sentence case everywhere. No ALL CAPS labels. Keep lines under about 70 characters.

## 4. Color tokens and themes

All colors are semantic tokens defined in `src/css/style.css`. **Never hard-code a hex value or a raw Tailwind palette color (such as `bg-slate-200`) in components.** Because the tokens switch with the theme, most components need no `dark:` variants.

| Token | Light | Dark | Use |
|---|---|---|---|
| `canvas` | `#F7F9FC` | `#0B1220` | Page background, inner tiles |
| `panel` | `#EDF2F9` | `#111A2E` | Large rounded panel behind the cards |
| `surface` | `#FFFFFF` | `#1A2438` | Cards, dialogs |
| `ink` | `#172B4D` | `#E6ECF5` | Primary text |
| `muted` | `#64748B` | `#94A3B8` | Secondary text |
| `line` | `#E2E8F0` | `#2A3650` | Borders, dividers |
| `primary` | `#2563EB` | `#2563EB` | Fills for main actions (white text on top) |
| `primary-text` | `#2563EB` | `#60A5FA` | Blue text and links |
| `primary-soft` | `#DBE7FE` | `#1E3470` | Banner, secondary buttons, active nav |
| `primary-tint` | `#EEF4FF` | `#16264A` | Hover fills, quiet bars |
| `accent` | `#172B4D` | `#2563EB` | Strong fills: selected day, dark buttons |
| `sidebar` | `#172B4D` | `#0A101C` | Sidebar pill background |

Rules:
- Text on `accent`, `sidebar` and `primary` is always white.
- Body text meets WCAG AA (4.5:1) in both themes. Check any new pair before using it.
- Never use pure black or pure white as a text color.
- Brand blue `#2563EB` and navy `#172B4D` are the identity. Do not add new brand colors without updating this table.

### Dark mode implementation

Use CSS variables that swap under `[data-theme="dark"]`, exposed to Tailwind with `@theme inline`:

```css
@import "tailwindcss";
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

:root {
  color-scheme: light;
  --canvas: #f7f9fc;
  --surface: #ffffff;
  --ink: #172b4d;
  /* ...one variable per token in the table above */
}
[data-theme="dark"] {
  color-scheme: dark;
  --canvas: #0b1220;
  --surface: #1a2438;
  --ink: #e6ecf5;
}

@theme inline {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-ink: var(--ink);
  /* ...same for panel, muted, line, primary-text, primary-soft, primary-tint, accent, sidebar */
}
```

Behavior (Settings page, section "Tampilan"):
- A radio group named "Tema" with three options: **Terang**, **Gelap**, **Ikuti sistem**. Default: Ikuti sistem.
- Stored in `localStorage` under `dompet-cerdas-theme` with the value `light`, `dark` or `system`.
- The resolved theme is written to `<html data-theme="light|dark">`.
- While "Ikuti sistem" is selected, react to `matchMedia("(prefers-color-scheme: dark)")` changes.
- Every HTML entry has this blocking script in `<head>` (before CSS) so the page never flashes the wrong theme:

```html
<meta name="color-scheme" content="light dark" />
<script>
  (function () {
    try {
      var t = localStorage.getItem("dompet-cerdas-theme") || "system";
      var dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    } catch (e) {}
  })();
</script>
```

- Apply `transition-colors duration-200` only after first paint, and not under `prefers-reduced-motion`.
- In dark mode, depth comes from borders (`border-line`) and surface steps, not shadows.
- Dim decorative gradients and aurora blobs in dark mode (lower opacity) so they do not glare.
- Photos and avatars are never filtered or inverted.

## 5. Shape and spacing

- Radii: outer panel `rounded-[2.5rem]`, cards `rounded-[1.75rem]`, inner tiles `rounded-2xl`, buttons and chips `rounded-full`.
- Gap between cards: `gap-5`. Card padding: `p-5` (`p-6` for large cards).
- Light mode: white cards on the tinted panel, almost no shadow. Dialogs and hovered media cards may use a soft shadow.
- Icons: 1.75px stroke, rounded caps, 20px default, 16px inside small buttons.

## 6. Layout

Dashboard grid:

```
[ sidebar ] [ banner ................................. ] [ calendar       ]
            [ Anggota ][ Pengeluaran ][ Tabungan 3 bln ] [ Video edukasi   ]
            [ Statistik ........ ][ Pengingat / Premium ] [ Notifikasi      ]
```

- Sidebar: dark pill, icons only, logo on top, help and logout at the bottom.
- Keep the sidebar content-sized and sticky while scrolling so longer pages do not stretch it.
- Main grid: flexible left content plus a 22rem right column. Below `xl` the right column stacks under the content. Below `lg` the sidebar becomes a horizontal bar.
- Other pages reuse the same shell (panel + sidebar) and change only the main area.
- Breakpoints to test: 375, 768, 1280 and 1440px.

## 7. Components and buttons

Component inventory and file locations live in `docs/COMPONENTS.md`. Visual rules:

- Primary action: `bg-accent text-white` (or `bg-primary text-white` in dialogs). Secondary action: `bg-primary-soft text-ink`.
- Button labels start with a verb: "Tambah anggota", "Catat transaksi", "Aktifkan Premium". Never "OK" or "Submit".
- Icon-only buttons need `aria-label` and a visible focus ring.
- Forms: visible label above each field, error text below the field, validation on blur, submit button always clickable.
- Empty states say what to do next. Loading states use skeletons after 1 second, nothing before 100 ms.

## 8. Motion and React Bits

The project now uses React, so effects from React Bits (reactbits.dev) are allowed. Install and wrap them as described in `docs/COMPONENTS.md`.

Rules:
- Spend motion on a few moments: one entrance on load, count-up on key numbers, a hover glow on cards, one hero effect.
- At most **one continuous background effect per screen**. WebGL effects (Aurora, Particles, and similar) are only for hero or banner areas, never behind data or forms, and are lazy-loaded.
- Every animation respects `prefers-reduced-motion` (skip it or show the end state at once).
- Durations: 250 to 900 ms for UI motion. Easing: `cubic-bezier(.2,.8,.2,1)`.
- Animate `transform`, `opacity` and `filter` only. Avoid animating layout during scroll.
- Effects must read colors from tokens so they work in both themes.

Currently used effects: BlurText (headline), CountUp (numbers), SpotlightCard (cards), Magnet (banner button), Aurora-style blobs (banner), chart grow-in.

## 9. Accessibility

- Every input has a visible `<label>`. Placeholders are only format hints.
- Icon-only buttons have `aria-label`. Decorative graphics have `aria-hidden="true"`.
- Toggles use `aria-pressed`, tabs use `role="tab"` plus `aria-selected`, radio groups use real radios.
- Focus ring: 2px `primary` outline with a 2px offset. Never remove it.
- Touch targets are at least 40px.
- Dialogs use native `<dialog>` (or an equivalent with focus trap, Esc to close and focus restore).
- Do not rely on color alone: pair it with text or an icon.

## 10. Copy

- UI language: Indonesian, polite but informal ("Anda"). Short and plain.
- Currency: "Rp" with compact amounts ("Rp4,2 jt"). Dates in Indonesian ("28 Okt"). Weeks start on Monday.
- Errors say what happened and how to fix it. They never blame the user.
- Use one name per action everywhere. Example: the button "Tandai lunas" leads to the toast "Tagihan lunas".
- Financial content is educational. Never promise returns or give personal investment advice (see `AGENTS.md`).

## 11. Do and don't

- Do reuse an existing component before creating a new one.
- Do check every change in both themes and at 375px.
- Don't add colors outside the token table.
- Don't decorate with gradients, shadows or emoji that carry no meaning.
- Don't write placeholder text like "Lorem ipsum". Write realistic Indonesian content.