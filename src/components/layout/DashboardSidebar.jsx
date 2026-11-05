import { useState } from 'react'

function IconSprite() {
  const icons = {
    wallet: <><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 10h20M16 14h2" /></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>,
    chart: <path d="M18 20V10M12 20V4M6 20v-6" />,
    calc: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 10h8M8 14h2M8 18h2M14 14h2M14 18h2" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z" /><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8M8 11h7" /></>,
    gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    help: <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r=".5" fill="currentColor" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    menu: <><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    'chevron-l': <polyline points="15 18 9 12 15 6" />,
    'chevron-r': <polyline points="9 18 15 12 9 6" />,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    'bell-off': <><path d="M13.73 21a2 2 0 0 1-3.46 0" /><path d="M17.63 17.63A9 9 0 0 1 18 15c0-7-3-9-3-9a6 6 0 0 0-9.56-4.44" /><path d="M5.52 5.52A9 9 0 0 0 6 8c0 4.67-1.6 7.17-2.63 8.3" /><line x1="1" y1="1" x2="23" y2="23" /></>,
    receipt: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    link: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>,
    cal: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    up: <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>,
    down: <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>,
  }

  return (
    <svg
      className="dashboard-icon-sprite"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {Object.entries(icons).map(([name, paths]) => (
          <symbol
            key={name}
            id={`i-${name}`}
            viewBox="0 0 24 24"
          >
            {paths}
          </symbol>
        ))}
      </defs>
    </svg>
  )
}

function Icon({ name }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  )
}

export function DashboardSidebar({ page }) {
  const [expanded, setExpanded] = useState(false)
  const links = [
    {
      href: '/pages/dashboard.html',
      icon: 'home',
      label: 'Dashboard',
      id: 'dashboard',
    },
    {
      href: '/pages/finances.html',
      icon: 'chart',
      label: 'Keuangan',
      id: 'finances',
    },
    {
      href: '/pages/simulator.html',
      icon: 'calc',
      label: 'Simulator',
      id: 'simulator',
    },
    {
      href: '/pages/learn.html',
      icon: 'book',
      label: 'Belajar',
      id: 'learn',
    },
    {
      href: '/pages/settings.html',
      icon: 'gear',
      label: 'Pengaturan',
      id: 'settings',
    },
  ]

  return (
    <>
      <IconSprite />

      <aside
        className={`app-sidebar dashboard-sidebar${expanded ? ' is-expanded' : ''}`}
        aria-label="Navigasi Moneva"
      >
        <a
          href="/"
          className="dashboard-brand"
          aria-label="Moneva, beranda"
        >
          <span className="dashboard-brand-mark">
            <Icon name="wallet" />
          </span>
        </a>

        <button
          type="button"
          className="dashboard-sidebar-toggle dashboard-nav-link"
          aria-label={expanded ? 'Ciutkan navigasi' : 'Perluas navigasi'}
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          <Icon name="menu" />
          <span className="dashboard-nav-label">Menu</span>
        </button>

        <nav
          className="dashboard-navigation"
          aria-label="Halaman utama"
        >
          <ul className="dashboard-nav-list" role="list">
            {links.map(({ href, icon, label, id }) => (
              <li key={id}>
                <a
                  href={href}
                  className="nav-link dashboard-nav-link"
                  aria-label={label}
                  title={label}
                  aria-current={
                    page === id ? 'page' : undefined
                  }
                >
                  <Icon name={icon} />
                  <span className="dashboard-nav-label">
                    {label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="dashboard-sidebar-spacer"
          aria-hidden="true"
        />

        <button
          type="button"
          data-act="help"
          className="nav-link dashboard-nav-link"
          aria-label="Bantuan"
          title="Bantuan"
        >
          <Icon name="help" />
          <span className="dashboard-nav-label">Bantuan</span>
        </button>

        <button
          type="button"
          data-act="logout"
          className="nav-link dashboard-nav-link"
          aria-label="Keluar"
          title="Keluar"
        >
          <Icon name="logout" />
          <span className="dashboard-nav-label">Keluar</span>
        </button>
      </aside>
    </>
  )
}
