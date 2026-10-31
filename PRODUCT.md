# Product: Dompet Cerdas

Tagline: **Financial Resilience for Everyone**.

## Problem

Many young people and small business owners in Indonesia have money coming in and going out, but no clear picture of where it goes. Bills are missed, savings stay at zero, an emergency becomes a crisis, and pinjol (online lending) feels like the only way out. Existing finance apps are either too complex or built for people with large budgets.

## Vision

A calm, friendly money companion that shows your situation at a glance, nudges you to the next small step, and teaches you why it matters. Financial resilience means being able to absorb a shock (a late payment, a slow month, a sudden cost) without falling into debt.

## Who it's for

| Person | Situation | What they need |
|---|---|---|
| **Raka, university student** | Fixed monthly allowance, wants a laptop, often runs out of money before month end | A simple budget (50/30/20), a savings goal, bill reminders |
| **Sari, owner of a small coffee stall (UMKM)** | Personal and business money are mixed, irregular income | Separate pots, weekly cash flow, a way to build an emergency fund |
| **Dimas, first-job employee** | First salary, shared rent and bills with friends | Shared wallet with members, due-date reminders, learning basics |

## Principles

1. **Clarity over completeness.** Show what matters now, not every number.
2. **Small steps.** Every screen offers one obvious next action.
3. **No shame.** Language never blames the user for spending.
4. **Honest.** Estimates are labeled as estimates. No hype, no guaranteed returns.
5. **Inclusive.** Plain Indonesian, readable sizes, keyboard and screen reader friendly, light on data.

## Pages and features

| Page | Purpose | Status |
|---|---|---|
| **Landing page** | Introduce Dompet Cerdas, show the demo dashboard and link to the simulator | Built |
| **Dashboard** | Overview: shared wallet members, weekly spending split (kebutuhan, tabungan, hiburan), 3-month savings bars, bill statistics, bill reminders for the selected date, week calendar, education videos, notifications, Premium card | Built (demo data in `localStorage`) |
| **Keuangan (finances)** | Detailed transactions, budgets and cash flow | Intended. Update when built |
| **Simulator** | Try "what if" scenarios (saving goal, emergency fund). Must show assumptions and say results are estimates | Built |
| **Belajar (learn)** | Short lessons and videos on budgeting, pinjol safety (OJK), separating personal and business money | Intended. Update when built |
| **Pengaturan (settings)** | Preferences including the theme toggle (Terang, Gelap, Ikuti sistem), notification controls and demo reset | Built |

Update the Status column whenever a page changes. Detailed per-page specs live in `PAGES.md`.

## Competition context

This site is an entry for a web design competition with the theme **"Smart Ecosystems: Digital Solution for a Sustainable Future"**. Judges will look for an inclusive, smart solution that answers a real sustainability challenge. How Dompet Cerdas fits:

- **Economic sustainability:** helping households and UMKM stay financially resilient supports decent work and growth, and reduces poverty risk.
- **Smart:** reminders, automatic summaries and simulations turn raw numbers into decisions.
- **Ecosystem:** shared wallets (families, teams), learning content and reminders work together rather than as separate tools.
- **Inclusive:** Indonesian language, accessible design, light and dark themes, usable on modest phones.

When writing copy, pitch text or demo flows, keep this story consistent. Do not claim real user numbers or partnerships that do not exist.

## Tone of voice

- Friendly, calm, encouraging. Short sentences. "Anda" for the user.
- Say what something does ("Catat transaksi"), not what it is called internally.
- Celebrate small wins ("Tagihan lunas"). Never scold.
- Educational, not advisory. Avoid "you should invest in X".

## Glossary

| Term | Meaning |
|---|---|
| UMKM | Usaha Mikro, Kecil, dan Menengah (micro, small and medium enterprises) |
| Dompet bersama | Shared wallet with several members |
| Kebutuhan, Tabungan, Hiburan | Spending categories: needs, savings, fun |
| Tagihan lunas / berjalan | Bills paid / bills still open |
| Dana darurat | Emergency fund |
| Aturan 50/30/20 | Budget split: 50% needs, 30% wants, 20% savings |
| OJK | Otoritas Jasa Keuangan, Indonesia's financial services authority |
| Pinjol | Pinjaman online (online lending). Some providers are illegal |

## Out of scope

- Moving real money, payments, or connecting real bank accounts.
- Collecting identity numbers, card numbers or other sensitive personal data.
- Personalized investment advice.
- A real backend and login (demo data lives in the browser for now).