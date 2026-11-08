import { useState } from 'react'

function IconSprite() {
  const icons = {
    wallet: <>
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M2 10h20M16 14h2" />
    </>,
    home: <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </>,
    chart: <path d="M18 20V10M12 20V4M6 20v-6" />,
    calc: <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8M8 10h8M8 14h2M8 18h2M14 14h2M14 18h2" />
    </>,
    book: <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z" />
      <path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8M8 11h7" />
    </>,
    gear: <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>,
    help: <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r=".5" fill="currentColor" />
    </>,
    logout: <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>,
  }

  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {Object.entries(icons).map(([name, paths]) => (
          <symbol key={name} id={`i-${name}`} viewBox="0 0 24 24">
            {paths}
          </symbol>
        ))}
      </defs>
    </svg>
  )
}

function NavIcon({ name, className = 'size-5' }) {
  return (
    <svg
      className={`icon ${className} shrink-0`}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <use href={`#i-${name}`} />
    </svg>
  )
}

export function DashboardSidebar({ page }) {
  const [zoneAExpanded, setZoneAExpanded] = useState(false)
  const [zoneBExpanded, setZoneBExpanded] = useState(false)

  const links = [
    { href: '/pages/dashboard.html', icon: 'home', label: 'Dashboard', id: 'dashboard' },
    { href: '/pages/finances.html', icon: 'chart', label: 'Keuangan', id: 'finances' },
    { href: '/pages/simulator.html', icon: 'calc', label: 'Simulator', id: 'simulator' },
    { href: '/pages/learn.html', icon: 'book', label: 'Belajar', id: 'learn' },
    { href: '/pages/settings.html', icon: 'gear', label: 'Pengaturan', id: 'settings' },
  ]

  const handleEnter = (setter) => (e) => {
    if (e.pointerType === 'touch') return
    setter(true)
  }

  const handleLeave = (setter) => (e) => {
    if (e.pointerType === 'touch') return
    setter(false)
  }

  return (
    <>
      <IconSprite />

      {/* DESKTOP SIDEBAR */}
      <aside
        className="moneva-sidebar-root hidden lg:flex fixed left-4 top-4 bottom-4 z-50 flex-col justify-between pointer-events-none select-none"
        aria-label="Navigasi Utama Moneva"
      >
        {/* ZONE A */}
        <div
          className={`moneva-sidebar-zone-a pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] rounded-3xl p-3 backdrop-blur-xl border border-white/40 dark:border-white/10 ${zoneAExpanded
              ? 'w-60 bg-surface/90 dark:bg-slate-900/90 shadow-2xl'
              : 'w-16 bg-surface/75 dark:bg-slate-900/80 shadow-lg'
            }`}
          onPointerEnter={handleEnter(setZoneAExpanded)}
          onPointerLeave={handleLeave(setZoneAExpanded)}
        >
          {/* BRAND */}
          <a
            href="/"
            className="flex items-center gap-3 rounded-2xl text-ink transition-colors group overflow-hidden h-10 w-full"
            aria-label="Moneva, beranda"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-primary to-blue-500 text-white shadow-md shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
              <NavIcon name="wallet" />
            </span>

            <div className={`flex flex-col whitespace-nowrap transition-all duration-200 ${zoneAExpanded
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-3 pointer-events-none w-0 overflow-hidden'
              }`}>
              <span className="text-sm font-bold tracking-tight text-ink leading-tight">MONEVA</span>
              <span className="text-[10px] font-medium text-muted leading-tight">Smart Financials</span>
            </div>
          </a>

          <div className="my-2.5 h-px w-full bg-line/40 dark:bg-white/10" />

          {/* MAIN NAVIGATION */}
          <nav aria-label="Menu Utama">
            <ul className="flex flex-col gap-1.5">
              {links.map(({ href, icon, label, id }) => {
                const isActive = page === id

                return (
                  <li key={id}>
                    <a
                      href={href}
                      className={`relative flex items-center h-10 w-full rounded-2xl transition-all duration-200 overflow-hidden group ${isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/25 font-semibold'
                          : 'text-muted hover:text-ink hover:bg-primary/10 dark:hover:bg-white/5'
                        }`}
                      aria-current={isActive ? 'page' : undefined}
                      title={label}
                    >
                      <span className="grid size-10 shrink-0 place-items-center">
                        <NavIcon
                          name={icon}
                          className={`size-5 transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:scale-110'
                            }`}
                        />
                      </span>

                      <span className={`text-sm whitespace-nowrap transition-all duration-200 pl-1 ${zoneAExpanded
                          ? 'opacity-100 translate-x-0 max-w-full'
                          : 'opacity-0 -translate-x-3 pointer-events-none max-w-0 overflow-hidden'
                        }`}>
                        {label}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* ZONE B */}
        <div
          className={`moneva-sidebar-zone-b pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] rounded-3xl p-3 backdrop-blur-xl border border-white/40 dark:border-white/10 ${zoneBExpanded
              ? 'w-60 bg-surface/90 dark:bg-slate-900/90 shadow-2xl'
              : 'w-16 bg-surface/75 dark:bg-slate-900/80 shadow-lg'
            }`}
          onPointerEnter={handleEnter(setZoneBExpanded)}
          onPointerLeave={handleLeave(setZoneBExpanded)}
        >
          <div className="flex flex-col gap-1.5" role="group" aria-label="Menu Bantuan & Keluar">
            <button
              type="button"
              data-act="help"
              className="group flex items-center h-10 w-full rounded-2xl text-muted transition-all duration-200 hover:bg-primary/10 hover:text-ink dark:hover:bg-white/5 overflow-hidden text-left"
              aria-label="Bantuan"
              title="Bantuan"
            >
              <span className="grid size-10 shrink-0 place-items-center">
                <NavIcon name="help" className="size-5 group-hover:scale-110 transition-transform" />
              </span>
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-200 pl-1 ${zoneBExpanded
                  ? 'opacity-100 translate-x-0 max-w-full'
                  : 'opacity-0 -translate-x-3 pointer-events-none max-w-0 overflow-hidden'
                }`}>
                Bantuan
              </span>
            </button>

            <button
              type="button"
              data-act="logout"
              className="group flex items-center h-10 w-full rounded-2xl text-rose-500 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:bg-rose-500/15 overflow-hidden text-left"
              aria-label="Keluar"
              title="Keluar"
            >
              <span className="grid size-10 shrink-0 place-items-center">
                <NavIcon name="logout" className="size-5 group-hover:scale-110 transition-transform" />
              </span>
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-200 pl-1 ${zoneBExpanded
                  ? 'opacity-100 translate-x-0 max-w-full'
                  : 'opacity-0 -translate-x-3 pointer-events-none max-w-0 overflow-hidden'
                }`}>
                Keluar
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav
        aria-label="Navigasi Seluler"
        className="fixed bottom-3 inset-x-3 z-50 flex items-center justify-around rounded-2xl bg-surface/85 dark:bg-slate-900/85 backdrop-blur-xl px-2 py-1.5 shadow-xl border border-white/40 dark:border-white/10 lg:hidden"
      >
        {links.map(({ href, icon, label, id }) => {
          const isActive = page === id

          return (
            <a
              key={id}
              href={href}
              className={`flex flex-col items-center justify-center rounded-xl p-2 transition-colors ${isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted dark:text-slate-300 hover:text-ink dark:hover:text-white active:scale-95'
                }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <NavIcon name={icon} className="size-5" />
              <span className="text-[10px] font-medium tracking-tight mt-0.5">
                {label}
              </span>
            </a>
          )
        })}

        <button
          type="button"
          data-act="help"
          className="flex flex-col items-center justify-center rounded-xl p-2 text-muted dark:text-slate-300 hover:text-ink dark:hover:text-white active:scale-95"
          aria-label="Bantuan"
        >
          <NavIcon name="help" className="size-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">
            Bantuan
          </span>
        </button>
      </nav>
    </>
  )
}
