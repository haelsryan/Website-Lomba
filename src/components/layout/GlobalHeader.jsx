import { useState, useEffect, useRef } from 'react'
import { useProfile } from '../../hooks/useProfile.js'

function Icon({ name, className = 'size-4' }) {
  const icons = {
    help: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <circle cx="12" cy="17" r=".5" fill="currentColor" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
    chevronDown: <polyline points="6 9 12 15 18 9" />,
  }

  return (
    <svg
      className={`icon ${className}`}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name] || null}
    </svg>
  )
}

const timeAgo = (ts) => {
  const m = Math.floor((Date.now() - ts) / 6e4)
  return m < 1
    ? 'baru saja'
    : m < 60
      ? `${m} mnt lalu`
      : m < 1440
        ? `${Math.floor(m / 60)} jam lalu`
        : `${Math.floor(m / 1440)} hari lalu`
}

const AUTH_SESSION_KEY = 'moneva-auth-session'

export function GlobalHeader({
  title = 'Dashboard',
  showDateLine = true,
  actionButton = null,
}) {
  const { profile } = useProfile()
  const [activeDropdown, setActiveDropdown] = useState(null) // 'notif' | 'profile' | null
  const [notifications, setNotifications] = useState([])
  const [notifFilter, setNotifFilter] = useState('all')

  const headerRef = useRef(null)

  const handleLogout = () => {
    localStorage.removeItem(AUTH_SESSION_KEY)
    window.location.href = '/pages/login.html'
  }

  // Load and subscribe to notifications
  useEffect(() => {
    const loadNotifs = () => {
      try {
        const raw = localStorage.getItem('dompet-cerdas-v1')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed?.notifs)) {
            setNotifications(parsed.notifs)
          }
        }
      } catch {
        // Fallback default
      }
    }

    loadNotifs()
    window.addEventListener('moneva:dashboard-data-change', loadNotifs)
    return () => window.removeEventListener('moneva:dashboard-data-change', loadNotifs)
  }, [])

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveDropdown(null)
    }
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }

    if (activeDropdown) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeDropdown])

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifs = notifications.filter((n) => {
    if (notifFilter === 'all') return true
    return n.type === notifFilter
  })

  const markAllRead = () => {
    try {
      const raw = localStorage.getItem('dompet-cerdas-v1')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed.notifs)) {
          parsed.notifs.forEach((n) => (n.read = true))
          localStorage.setItem('dompet-cerdas-v1', JSON.stringify(parsed))
          setNotifications([...parsed.notifs])
          window.dispatchEvent(new Event('moneva:dashboard-data-change'))
        }
      }
    } catch {
      // Ignore
    }
  }

  return (
    <header
      ref={headerRef}
      className="dashboard-header relative z-30 mb-6 flex flex-col gap-4 py-1 md:flex-row md:items-center md:justify-between"
    >
      {/* Title & Subtitle */}
      <div className="dashboard-banner-copy min-w-0">
        <h1 className="global-header-title text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>

        {showDateLine && (
          <p className="dashboard-date-line mt-2 flex items-center gap-2 text-xs font-medium text-muted/80">
            <span data-dashboard-date className="font-semibold text-ink" />
            <span aria-hidden="true">·</span>
            <span data-dashboard-period />
          </p>
        )}
      </div>

      {/* Top Right Controls */}
      <div className="dashboard-header-actions flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Notification Button + Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setActiveDropdown((cur) => (cur === 'notif' ? null : 'notif'))
            }
            aria-expanded={activeDropdown === 'notif'}
            aria-haspopup="true"
            aria-label="Lihat notifikasi"
            className="dashboard-notification-shortcut relative grid size-10 place-items-center rounded-2xl bg-surface/80 dark:bg-white/10 border border-line/60 dark:border-white/15 text-muted transition-all duration-200 hover:text-ink hover:bg-surface dark:hover:bg-white/20 hover:shadow-sm active:scale-95"
          >
            <Icon name="bell" className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-surface">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Premium Glass Notification Dropdown */}
          {activeDropdown === 'notif' && (
            <div
              role="dialog"
              aria-label="Daftar notifikasi"
              className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-3xl bg-surface/90 dark:bg-slate-900/90 p-4 shadow-2xl backdrop-blur-2xl border border-white/30 dark:border-white/10 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-line/50 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-ink">Notifikasi</h2>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>

              {/* Filter tabs */}
              <div className="my-2.5 flex items-center gap-1 rounded-xl bg-canvas/70 dark:bg-white/5 p-1 text-xs">
                {['all', 'shared', 'comment', 'view'].map((tab) => {
                  const labels = {
                    all: 'Semua',
                    shared: 'Undangan',
                    comment: 'Komentar',
                    view: 'Dilihat',
                  }
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setNotifFilter(tab)}
                      className={`flex-1 rounded-lg py-1 text-center font-medium transition-all ${notifFilter === tab
                          ? 'bg-surface dark:bg-slate-800 text-ink shadow-sm font-semibold'
                          : 'text-muted hover:text-ink'
                        }`}
                    >
                      {labels[tab]}
                    </button>
                  )
                })}
              </div>

              {/* Notification list */}
              <div className="max-h-72 overflow-y-auto pr-1 space-y-2 moneva-scrollbar">
                {filteredNotifs.length > 0 ? (
                  filteredNotifs.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 rounded-2xl p-2.5 transition-colors ${n.read
                          ? 'bg-transparent hover:bg-canvas/60 dark:hover:bg-white/5'
                          : 'bg-primary/5 dark:bg-primary/10 border border-primary/20'
                        }`}
                    >
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {n.who ? n.who[0] : 'M'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-ink leading-snug">
                          {n.text}
                        </p>
                        <p className="mt-1 text-[10px] text-muted">
                          {timeAgo(n.ts)}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="mt-1 size-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-xs text-muted">
                    Tidak ada notifikasi di tab ini.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Button + Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setActiveDropdown((cur) => (cur === 'profile' ? null : 'profile'))
            }
            aria-expanded={activeDropdown === 'profile'}
            aria-haspopup="true"
            aria-label="Menu profil pengguna"
            className="dashboard-profile flex items-center gap-2.5 rounded-2xl bg-surface/80 dark:bg-white/10 border border-line/60 dark:border-white/15 px-3 py-1.5 transition-all duration-200 hover:bg-surface dark:hover:bg-white/20 hover:shadow-sm active:scale-95"
          >
            <span className="dashboard-profile-avatar grid size-7 place-items-center rounded-xl bg-gradient-to-tr from-primary to-blue-600 text-xs font-bold text-white shadow-sm overflow-hidden shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="size-full object-cover"
                />
              ) : (
                (profile.name || 'D').charAt(0).toUpperCase()
              )}
            </span>
            <span className="text-xs font-semibold text-ink hidden sm:inline max-w-[120px] truncate">
              {profile.name || 'Demo'}
            </span>
            <Icon name="chevronDown" className="size-3 text-muted" />
          </button>

          {/* Premium Glass Profile Dropdown */}
          {activeDropdown === 'profile' && (
            <div
              role="menu"
              aria-label="Pilihan profil"
              className="absolute right-0 top-12 z-50 w-64 rounded-3xl bg-surface/90 dark:bg-slate-900/90 p-3 shadow-2xl backdrop-blur-2xl border border-white/30 dark:border-white/10 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
            >
              {/* User overview */}
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-canvas/60 dark:bg-white/5 mb-2">
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-tr from-primary to-blue-600 text-sm font-bold text-white shadow-md overflow-hidden shrink-0">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    (profile.name || 'D').charAt(0).toUpperCase()
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink truncate">
                    {profile.name || 'Demo Moneva'}
                  </p>
                  <p className="text-[11px] text-muted truncate">
                    {profile.email || 'demo@moneva.id'}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {profile.userType || 'Young Professional'}
                  </span>
                </div>
              </div>

              {/* Menu items */}
              <div className="space-y-1">
                <a
                  href="/pages/settings.html#profile"
                  onClick={() => {
                    setActiveDropdown(null)
                    if (window.location.pathname.includes('settings')) {
                      const el = document.getElementById('profile-section')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-primary/10 hover:text-primary"
                  role="menuitem"
                >
                  <Icon name="user" className="size-4 text-muted" />
                  Profil Pengguna
                </a>
                <a
                  href="/pages/settings.html"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-primary/10 hover:text-primary"
                  role="menuitem"
                >
                  <Icon name="settings" className="size-4 text-muted" />
                  Pengaturan Akun
                </a>
                <button
                  type="button"
                  data-act="help"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-primary/10 hover:text-primary text-left"
                  role="menuitem"
                >
                  <Icon name="help" className="size-4 text-muted" />
                  Pusat Bantuan
                </button>
                <div className="my-1 h-px bg-line/40 dark:bg-white/10" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-500 transition-colors hover:bg-rose-500/10 text-left"
                  role="menuitem"
                >
                  <Icon name="logout" className="size-4 text-rose-500" />
                  Keluar dari Demo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA (Catat Transaksi or custom button) */}
        {actionButton || (
          <button
            type="button"
            data-act="add-tx"
            className="btn dashboard-primary-action inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
          >
            <Icon name="plus" className="size-4" />
            <span>Catat transaksi</span>
          </button>
        )}
      </div>
    </header>
  )
}

