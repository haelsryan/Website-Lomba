# Dompet Cerdas: Design Guide

Financial Resilience for Everyone.
Read this before building or changing any page. Keep it short and update it when a decision changes.

## 1. Product

- **Who it's for:** young people, students and small business owners (UMKM) in Indonesia.
- **Job of the interface:** help someone see their money at a glance and take the next small step (record, pay, save).
- **Feel:** modern minimalist fintech. Calm, clear, trustworthy, friendly. Never flashy.
- **Priority:** desktop-first, but every page must stay usable on mobile.

## 2. Stack and rules

- HTML5, Tailwind CSS v4, Vanilla JavaScript, Vite. No React, Vue or other frameworks.
- Tailwind utilities first. Custom CSS only for reusable components (see section 5).
- Semantic HTML: `main`, `nav`, `aside`, `section`, `header`, `h1` to `h3` in order.
- JavaScript only where interaction is needed. No new dependencies without a reason.

## 3. Design tokens

All tokens live in `src/css/style.css` under `@theme`. Never hard-code a hex value in HTML.

| Token | Value | Use |
|---|---|---|
| `primary` | `#2563EB` | Main actions, focus ring, highlights |
| `primary-soft` | `#DBE7FE` | Banner, secondary buttons, active nav, soft fills |
| `primary-tint` | `#EEF4FF` | Hover fills, quiet bars |
| `navy` | `#172B4D` | Text, sidebar, dark accents, selected state |
| `canvas` | `#F7F9FC` | Page background, inner tiles |
| `surface` | `#FFFFFF` | Cards |
| `muted` | `#64748B` | Secondary text |

- Outer dashboard panel: `bg-[#edf2f9]`.
- Body text is `navy`. Secondary text is `muted`. Never use pure black.
- Use color for meaning, not decoration. Blue means action or progress, navy means emphasis.
- Contrast: body text must meet WCAG AA (4.5:1). `muted` on white passes.

## 4. Typography

- **Font:** Plus Jakarta Sans (400, 500, 600, 700, 800), loaded from Google Fonts in `<head>`.
- Page title (`h1`): `text-3xl font-medium tracking-tight`.
- Card title (`h2`): `text-xl font-medium`. Small card label: `text-sm text-muted`.
- Big numbers: `text-4xl` or `text-5xl font-medium tracking-tight`.
- Small meta text: `text-xs`. Do not go below 12px.
- Sentence case everywhere. No ALL CAPS labels.
- Keep lines under about 70 characters.

## 5. Shape, spacing and components

- Large radii: outer panel `rounded-[2.5rem]`, cards `rounded-[1.75rem]`, inner tiles `rounded-2xl`, buttons and chips `rounded-full`.
- Gap between cards: `gap-5`. Card padding: `p-5` (`p-6` for the large Statistik card).
- Depth comes from color contrast (white cards on a tinted panel). Avoid heavy shadows. A soft shadow is only for dialogs and hovered video cards.

Reusable classes (defined in `style.css`):

| Class | Purpose |
|---|---|
| `.card` | White card with a cursor-following glow on hover |
| `.btn` | Pill button base. Add color utilities, for example `bg-navy text-white` |
| `.icon-btn` | Round icon-only button (needs `aria-label`) |
| `.nav-link` | Sidebar icon. Active state comes from `aria-current="page"` |
| `.avatar` | Circle with initials. Add `bg-gradient-to-br` plus a tone |
| `.icon` | SVG icon from the sprite: `<svg class="icon"><use href="#i-name"/></svg>` |

Buttons:
- Primary action: `bg-navy text-white` (banner) or `bg-primary text-white` (dialog submit).
- Secondary action: `bg-primary-soft text-navy`, hover `bg-primary text-white`.
- Labels start with a verb: "Tambah anggota", "Catat transaksi", "Aktifkan Premium". Never "OK" or "Submit".

## 6. Layout

### Landing Page (`index.html`)

- **Struktur halaman:**
  - Header: Logo Dompet Cerdas, navigasi section (`#fitur`, `#solusi`, `#simulasi`, `#prinsip`), tombol CTA primer *"Masuk ke Dasbor"*.
  - Hero: Headline nilai utama ("Bangun ketahanan keuangan pribadi dan usaha, langkah demi langkah"), deskripsi ringkas, tombol CTA ganda, dan live interactive preview kartu arus kas nyata.
  - Masalah nyata: 3 pilar tantangan finansial UMKM & generasi muda di Indonesia (pencampuran kas, denda keterlambatan tagihan, minimnya bantalan darurat).
  - Fitur unggulan: Tampilan asimetris (Arus kas bersama, kalender pengingat bebas denda, modul edukasi OJK & 50/30/20).
  - Simulasi interaktif: Kalkulator pembagian anggaran 50/30/20 langsung di tempat.
  - Nilai sosial & komitmen: Privasi lokal di peramban, tanpa biaya tersembunyi, ramah pemula.
  - Penutup & CTA: Dorongan aksi tegas untuk mencoba dasbor.
  - Footer: Navigasi modul lengkap, hak cipta, dan identitas kompetisi.

### Dashboard (`pages/dashboard.html`)

```
[ sidebar pill ] [ banner ................................. ] [ calendar        ]
                 [ Anggota ][ Pengeluaran ][ Tabungan 3 bln ] [ Video edukasi    ]
                 [ Statistik ........ ][ Pengingat / Premium ] [ Notifikasi       ]
```

- Sidebar: dark navy pill, icons only, logo on top, help and logout at the bottom.
- Main grid: left content (flexible) plus a 22rem right column. Below `xl` the right column stacks under the content. Below `lg` the sidebar becomes a horizontal bar.
- App pages reuse the same shell (outer panel + sidebar) and change only the main area.

## 7. Motion

Spend motion on a few moments, not everywhere.

- One entrance on page load (cards pop in, avatars spring in, notifications slide in).
- Count-up on numbers, grow-in on chart bars, aurora drift in the banner, spotlight glow on cards, magnet on the banner button.
- Dialogs rise and fade in.
- Every animation must respect `prefers-reduced-motion` (skip or shorten it).
- Do not animate layout-heavy properties on scroll. Keep durations between 250 and 900 ms.

## 8. Accessibility

- Every input has a visible `<label>`. Placeholders are only for format hints.
- Icon-only buttons have `aria-label`. Decorative graphics have `aria-hidden="true"`.
- Toggles use `aria-pressed`, tabs use `role="tab"` plus `aria-selected`.
- Focus ring: 2px `primary` outline (set globally). Never remove it.
- Touch targets are at least 40px on mobile.
- Dialogs use native `<dialog>` so focus and Esc work by default.

## 9. Copy

- Language: Indonesian, informal-polite ("Anda"). Short and plain. Say what something does.
- Use "Rp" with compact amounts ("Rp4,2 jt"). Dates in Indonesian ("28 Okt").
- Empty states explain what to do next ("Belum ada transaksi. Tekan + untuk mencatat.").
- Errors say what went wrong and how to fix it. They never blame the user.
- Use the same name for an action everywhere (the button "Tandai lunas" leads to the toast "Tagihan lunas").

## 10. Code conventions

```
project/
├─ index.html              landing page (pengenalan & gerbang masuk)
├─ pages/
│  ├─ dashboard.html       dasbor utama aplikasi
│  ├─ finances.html        keuangan
│  ├─ simulator.html       simulator
│  ├─ learn.html           belajar & literasi
│  └─ settings.html        pengaturan
├─ src/
│  ├─ css/style.css        Tailwind import, @theme tokens, components
│  └─ js/main.js           shared behavior (see below)
└─ DESIGN.md
```

- Every page loads `<script type="module" src="/src/js/main.js"></script>`.
- Interactions use `data-act="name"` on buttons, handled by one click listener in `main.js`. Extra values go in `data-id` or `data-v`.
- State is kept in `localStorage` under `dompet-cerdas-v1`. Treat it as demo data until a backend exists.
- Tailwind only sees complete class names, so never build class names by string concatenation (`"bg-" + color`). Write the full class.
- Navigation links point to real files: `/`, `/pages/dashboard.html`, `/pages/finances.html`, `/pages/simulator.html`, `/pages/learn.html`, `/pages/settings.html`.

## 11. Visual references

Store reference images in `docs/references/` (not in `src/` or `public/`, so they never ship with the site).
Name files by what they show and list them here with what to borrow.

| File | Source | What to take from it |
|---|---|---|
| `docs/references/dashboard-main.jpg` | Original dashboard reference | Overall layout, bento cards, dark sidebar pill |
| _add more rows_ | | |

Do not copy a reference's branding, copy or illustrations. Borrow structure and mood only.

## 12. Do and don't

- Do keep one clear focus per screen: the number or action that matters most.
- Do reuse existing components before making a new one.
- Don't add new colors outside the token list without updating section 3.
- Don't decorate with gradients, shadows or emoji that carry no meaning.
- Don't use placeholder text such as "Lorem ipsum". Write realistic Indonesian content.