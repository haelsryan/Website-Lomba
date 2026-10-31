import { useEffect } from 'react'

export function Sidebar({ page }) {
  return (
    <>
      {/* SVG sprite */}
      <svg className="hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <symbol id="i-wallet" viewBox="0 0 24 24">
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
            <path d="M16 14h2" />
          </symbol>
          <symbol id="i-home" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M9 22V12h6v10" />
          </symbol>
          <symbol id="i-chart" viewBox="0 0 24 24">
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </symbol>
          <symbol id="i-calc" viewBox="0 0 24 24">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M8 6h8M8 10h8M8 14h2M8 18h2M14 14h2M14 18h2" />
          </symbol>
          <symbol id="i-book" viewBox="0 0 24 24">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </symbol>
          <symbol id="i-gear" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </symbol>
          <symbol id="i-help" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <circle cx="12" cy="17" r=".5" fill="currentColor" />
          </symbol>
          <symbol id="i-logout" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </symbol>
          <symbol id="i-plus" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </symbol>
          <symbol id="i-chevron-l" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </symbol>
          <symbol id="i-chevron-r" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </symbol>
          <symbol id="i-bell" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </symbol>
          <symbol id="i-bell-off" viewBox="0 0 24 24">
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            <path d="M17.63 17.63A9 9 0 0 1 18 15c0-7-3-9-3-9a6 6 0 0 0-9.56-4.44" />
            <path d="M5.52 5.52A9 9 0 0 0 6 8c0 4.67-1.6 7.17-2.63 8.3" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </symbol>
          <symbol id="i-receipt" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </symbol>
          <symbol id="i-check" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </symbol>
          <symbol id="i-trash" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
          </symbol>
          <symbol id="i-x" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </symbol>
          <symbol id="i-link" viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </symbol>
          <symbol id="i-cal" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </symbol>
          <symbol id="i-eye" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </symbol>
          <symbol id="i-chat" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </symbol>
          <symbol id="i-up" viewBox="0 0 24 24">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </symbol>
          <symbol id="i-down" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </symbol>
        </defs>
      </svg>

      {/* Sidebar */}
      <aside
        className="flex w-14 shrink-0 flex-col items-center gap-1 rounded-[2rem] bg-navy py-5"
        aria-label="Navigasi"
      >
        <a
          href="/"
          className="mb-3 grid size-10 shrink-0 place-items-center rounded-full bg-primary text-white transition hover:bg-primary/80"
          aria-label="Dompet Cerdas – beranda"
        >
          <svg className="icon" aria-hidden="true"><use href="#i-wallet" /></svg>
        </a>

        <nav aria-label="Halaman utama">
          <ul className="flex flex-col gap-1" role="list">
            <li>
              <a 
                href="/pages/dashboard.html" 
                className="nav-link" 
                aria-label="Dashboard"
                aria-current={page === 'dashboard' ? 'page' : undefined}
              >
                <svg className="icon" aria-hidden="true"><use href="#i-home" /></svg>
              </a>
            </li>
            <li>
              <a 
                href="/pages/finances.html" 
                className="nav-link" 
                aria-label="Keuangan"
                aria-current={page === 'finances' ? 'page' : undefined}
              >
                <svg className="icon" aria-hidden="true"><use href="#i-chart" /></svg>
              </a>
            </li>
            <li>
              <a href="/pages/simulator.html" className="nav-link" aria-label="Simulator">
                <svg className="icon" aria-hidden="true"><use href="#i-calc" /></svg>
              </a>
            </li>
            <li>
              <a href="/pages/learn.html" className="nav-link" aria-label="Belajar">
                <svg className="icon" aria-hidden="true"><use href="#i-book" /></svg>
              </a>
            </li>
            <li>
              <a href="/pages/settings.html" className="nav-link" aria-label="Pengaturan">
                <svg className="icon" aria-hidden="true"><use href="#i-gear" /></svg>
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex-1" aria-hidden="true"></div>

        <button type="button" data-act="help" className="nav-link" aria-label="Bantuan">
          <svg className="icon" aria-hidden="true"><use href="#i-help" /></svg>
        </button>
        <button type="button" data-act="logout" className="nav-link" aria-label="Keluar">
          <svg className="icon" aria-hidden="true"><use href="#i-logout" /></svg>
        </button>
      </aside>
    </>
  )
}
