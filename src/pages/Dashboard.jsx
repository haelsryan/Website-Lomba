import { useEffect, useState } from 'react'
import { getDashboardData, initDashboard, mountPage } from '../main.jsx'

function IconSprite() {
  const icons = {
    wallet: <><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 10h20M16 14h2" /></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>,
    chart: <path d="M18 20V10M12 20V4M6 20v-6" />,
    calc: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 10h8M8 14h2M8 18h2M14 14h2M14 18h2" /></>,
    gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    help: <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r=".5" fill="currentColor" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
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
    <svg className="dashboard-icon-sprite" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {Object.entries(icons).map(([name, paths]) => (
          <symbol key={name} id={`i-${name}`} viewBox="0 0 24 24">{paths}</symbol>
        ))}
      </defs>
    </svg>
  )
}

function Icon({ name, className = 'icon', ...props }) {
  return <svg className={className} aria-hidden="true" {...props}><use href={`#i-${name}`} /></svg>
}

const money = (amount) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(amount)

const formatDate = (value) => new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
}).format(new Date(`${value}T00:00:00`))

function DashboardSidebar() {
  const links = [
    { href: '/pages/dashboard.html', icon: 'home', label: 'Dashboard', current: true },
    { href: '/pages/finances.html', icon: 'chart', label: 'Keuangan' },
    { href: '/pages/simulator.html', icon: 'calc', label: 'Simulator' },
    { href: '/pages/settings.html', icon: 'gear', label: 'Pengaturan' },
  ]

  return (
    <aside className="app-sidebar dashboard-sidebar" aria-label="Navigasi Moneva">
      <a href="/" className="dashboard-brand" aria-label="Moneva, beranda">
        <span className="dashboard-brand-mark"><Icon name="wallet" /></span>
      </a>
      <nav className="dashboard-navigation" aria-label="Halaman utama">
        <ul className="dashboard-nav-list" role="list">
          {links.map(({ href, icon, label, current }) => (
            <li key={href}>
              <a href={href} className="nav-link dashboard-nav-link" aria-label={label} title={label} aria-current={current ? 'page' : undefined}>
                <Icon name={icon} />
                <span className="dashboard-nav-label">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="dashboard-sidebar-spacer" aria-hidden="true" />
      <button type="button" data-act="help" className="nav-link dashboard-nav-link" aria-label="Bantuan" title="Bantuan"><Icon name="help" /></button>
      <button type="button" data-act="logout" className="nav-link dashboard-nav-link" aria-label="Keluar" title="Keluar"><Icon name="logout" /></button>
    </aside>
  )
}

function DashboardHeader() {
  return (
    <header className="dashboard-banner">
      <div className="dashboard-banner-copy">
        <h1>Dashboard</h1>
        <p className="dashboard-intro">Ringkasan kondisi keuangan Anda.</p>
        <p className="dashboard-date-line"><span data-dashboard-date /><span aria-hidden="true">·</span><span data-dashboard-period /></p>
      </div>
      <div className="dashboard-header-actions">
        <button type="button" data-act="help" className="dashboard-help-action" aria-label="Buka bantuan"><Icon name="help" /></button>
        <a href="#dashboard-notifications" className="dashboard-notification-shortcut" aria-label="Lihat notifikasi"><Icon name="bell" /></a>
        <span className="dashboard-profile" aria-label="Profil pengguna demo">
          <span className="dashboard-profile-avatar" aria-hidden="true">D</span><span>Demo</span>
        </span>
        <button type="button" data-act="add-tx" className="btn dashboard-primary-action"><Icon name="plus" />Catat transaksi</button>
      </div>
    </header>
  )
}

function SummaryCards() {
  const summaries = [
    { icon: 'wallet', label: 'Total saldo', value: 'Belum tersedia', hook: 'data-summary-balance', meta: 'Saldo awal belum dicatat' },
    { icon: 'down', label: 'Total pemasukan', hook: 'data-summary-income', metaHook: 'data-summary-period' },
    { icon: 'up', label: 'Total pengeluaran', hook: 'data-summary-expenses', metaHook: 'data-summary-expense-period' },
    { icon: 'chart', label: 'Total tabungan', hook: 'data-summary-savings', metaHook: 'data-summary-savings-period' },
  ]

  return (
    <section className="dashboard-summary" aria-label="Ringkasan keuangan">
      {summaries.map(({ icon, label, value, hook, meta, metaHook }) => (
        <article className="card dashboard-card dashboard-summary-card" key={label}>
          <span className="dashboard-summary-icon"><Icon name={icon} /></span>
          <p className="dashboard-summary-label">{label}</p>
          <p className="dashboard-summary-value" {...(hook ? { [hook]: '' } : {})}>{value}</p>
          <p className="dashboard-summary-meta" {...(metaHook ? { [metaHook]: '' } : {})}>{meta}</p>
        </article>
      ))}
    </section>
  )
}

function IncomeChart() {
  return (
    <section className="card dashboard-card dashboard-income-card">
      <header className="dashboard-card-header">
        <div><p className="dashboard-section-kicker">Arus masuk</p><h2>Total pemasukan</h2><p className="dashboard-chart-total" data-income-total /></div>
        <div className="dashboard-period-control" role="group" aria-label="Periode grafik pemasukan">
          <button type="button" data-act="income-period" data-v="7d" aria-pressed="false" className="btn dashboard-range-button">7 hari</button>
          <button type="button" data-act="income-period" data-v="30d" aria-pressed="false" className="btn dashboard-range-button">30 hari</button>
          <button type="button" data-act="income-period" data-v="6m" aria-pressed="true" className="btn dashboard-range-button">6 bulan</button>
          <button type="button" data-act="income-period" data-v="1y" aria-pressed="false" className="btn dashboard-range-button">1 tahun</button>
        </div>
      </header>
      <div className="dashboard-income-chart-wrap">
        <svg data-income-chart className="dashboard-income-chart" viewBox="0 0 640 260" role="img" aria-label="Grafik pemasukan berdasarkan transaksi tersimpan" />
      </div>
    </section>
  )
}

function ActivityChart() {
  return (
    <section className="card dashboard-card dashboard-activity-card">
      <header className="dashboard-card-header">
        <div><p className="dashboard-section-kicker">Menurut periode</p><h2>Porsi pengeluaran</h2></div>
      </header>
      <div className="dashboard-activity-layout">
        <div data-activity-chart className="dashboard-donut-chart" role="img" aria-label="Distribusi pengeluaran berdasarkan kategori" />
        <ul data-activity-legend className="dashboard-activity-legend" role="list" />
      </div>
    </section>
  )
}

function TransactionHistory() {
  return (
    <section className="card dashboard-card dashboard-transactions-card">
      <header className="dashboard-card-header dashboard-transactions-header">
        <div><p className="dashboard-section-kicker">Aktivitas dompet</p><h2>Riwayat transaksi</h2></div>
        <a href="/pages/finances.html" className="dashboard-text-action">Lihat semua</a>
      </header>
      <div className="dashboard-transactions-tools">
        <label className="dashboard-search">
          <Icon name="search" />
          <span className="sr-only">Cari transaksi</span>
          <input type="search" data-dashboard-search placeholder="Cari transaksi" autoComplete="off" />
        </label>
        <div className="dashboard-range-control" role="group" aria-label="Filter jenis transaksi">
          <button type="button" data-act="dashboard-tx-filter" data-v="all" aria-pressed="true" className="btn dashboard-range-button">Semua</button>
          <button type="button" data-act="dashboard-tx-filter" data-v="in" aria-pressed="false" className="btn dashboard-range-button">Pemasukan</button>
          <button type="button" data-act="dashboard-tx-filter" data-v="out" aria-pressed="false" className="btn dashboard-range-button">Pengeluaran</button>
        </div>
        <label className="dashboard-sort">
          <span className="sr-only">Urutkan transaksi</span>
          <select data-dashboard-sort aria-label="Urutkan transaksi">
            <option value="newest">Terbaru</option><option value="oldest">Terlama</option>
          </select>
        </label>
      </div>
      <ul data-dashboard-transactions className="dashboard-transaction-list" role="list" />
      <p data-dashboard-transactions-empty className="dashboard-empty-state" hidden />
    </section>
  )
}

function UpcomingBills({ reminders }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueSoon = 3
  const bills = reminders
    .map((reminder) => ({
      ...reminder,
      dueDate: new Date(`${reminder.date}T00:00:00`),
    }))
    .filter(({ date, done }) => {
      const daysUntilDue = Math.round((new Date(`${date}T00:00:00`) - today) / 86400000)
      return !done || daysUntilDue >= -7
    })
    .sort((a, b) => Number(a.done) - Number(b.done) || a.dueDate - b.dueDate)
    .slice(0, 4)

  return (
    <section className="card dashboard-card dashboard-upcoming-bills-card">
      <header className="dashboard-card-header">
        <div><p className="dashboard-section-kicker">Dari pengingat Anda</p><h2>Tagihan mendatang</h2></div>
        <button type="button" data-act="add-rem" className="dashboard-text-action">Tambah</button>
      </header>
      {bills.length ? (
        <ul className="dashboard-upcoming-bills-list" role="list">
          {bills.map((bill) => {
            const daysUntilDue = Math.round((bill.dueDate - today) / 86400000)
            const status = bill.done ? 'Lunas' : daysUntilDue < 0
              ? `Terlambat ${Math.abs(daysUntilDue)} hari`
              : daysUntilDue <= dueSoon ? 'Segera jatuh tempo' : 'Belum lunas'
            return (
              <li key={bill.id} className={daysUntilDue <= dueSoon && !bill.done ? 'is-due-soon' : ''}>
                <div className="dashboard-upcoming-bill-copy">
                  <strong>{bill.title}</strong>
                  <span>{formatDate(bill.date)}{bill.time ? ` · ${bill.time}` : ''}</span>
                  <span className="dashboard-upcoming-bill-amount">
                    {typeof bill.amount === 'number' ? money(bill.amount) : 'Nominal belum dicatat'}
                  </span>
                </div>
                <span className={`dashboard-upcoming-bill-status${bill.done ? ' is-paid' : ''}`}>
                  {status}
                </span>
                {!bill.done && (
                  <button
                    type="button"
                    data-act="done-rem"
                    data-id={bill.id}
                    className="dashboard-bill-done"
                    aria-label={`Tandai ${bill.title} lunas`}
                  >
                    <Icon name="check" />
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="dashboard-empty-state">Belum ada tagihan mendatang. Tambahkan pengingat untuk mencatat jatuh tempo.</p>
      )}
    </section>
  )
}

function DashboardCalendar() {
  return (
    <section className="card dashboard-card dashboard-calendar-card">
      <header className="dashboard-card-header">
        <h2 data-cal-title />
        <div className="dashboard-icon-group">
          <button type="button" data-act="week" data-v="-7" className="icon-btn dashboard-icon-action" aria-label="Minggu lalu"><Icon name="chevron-l" /></button>
          <button type="button" data-act="week" data-v="7" className="icon-btn dashboard-icon-action" aria-label="Minggu depan"><Icon name="chevron-r" /></button>
        </div>
      </header>
      <ul data-cal-days className="dashboard-calendar-days" role="list" aria-label="Hari dalam minggu ini" />
    </section>
  )
}

function DashboardLeftColumn() {
  return (
    <section className="dashboard-column dashboard-column-left" aria-label="Transaksi dan kalender">
      <TransactionHistory />
      <DashboardCalendar />
    </section>
  )
}

function DashboardRightColumn({ reminders }) {
  return (
    <aside className="dashboard-column dashboard-column-right" aria-label="Notifikasi dan tagihan">
      <DashboardNotifications />
      <UpcomingBills reminders={reminders} />
    </aside>
  )
}

function DashboardNotifications() {
  return (
    <section id="dashboard-notifications" className="card dashboard-card dashboard-notification-card">
      <header className="dashboard-card-header dashboard-notification-header">
        <div><p className="dashboard-section-kicker">Aktivitas terbaru</p><h2>Notifikasi</h2></div>
        <div className="dashboard-icon-group">
          <button type="button" data-act="mute" data-v="off" aria-pressed="true" className="icon-btn dashboard-icon-action" aria-label="Notifikasi aktif"><Icon name="bell" /></button>
          <button type="button" data-act="mute" data-v="on" aria-pressed="false" className="icon-btn dashboard-icon-action" aria-label="Matikan notifikasi"><Icon name="bell-off" /></button>
        </div>
      </header>
      <div className="dashboard-notification-tabs" role="tablist" aria-label="Filter notifikasi">
        <button type="button" role="tab" data-act="tab" data-v="all" aria-selected="true" className="btn dashboard-range-button">Semua</button>
        <button type="button" role="tab" data-act="tab" data-v="shared" aria-selected="false" className="btn dashboard-range-button">Undangan</button>
        <button type="button" role="tab" data-act="tab" data-v="comment" aria-selected="false" className="btn dashboard-range-button">Komentar</button>
        <button type="button" role="tab" data-act="tab" data-v="view" aria-selected="false" className="btn dashboard-range-button">Dilihat</button>
      </div>
      <div className="dashboard-notification-list-wrap">
        <ul data-notif-list className="dashboard-notification-list" role="list" />
        <p data-notif-muted className="hidden dashboard-muted-state">Notifikasi dimatikan.</p>
      </div>
      <button type="button" data-act="read-all" className="dashboard-text-action dashboard-read-all">Tandai semua dibaca</button>
    </section>
  )
}

function Dashboard() {
  const [reminders, setReminders] = useState(() => getDashboardData().reminders)

  useEffect(() => {
    initDashboard()
    const updateData = () => setReminders(getDashboardData().reminders)
    window.addEventListener('moneva:dashboard-data-change', updateData)
    updateData()
    return () => window.removeEventListener('moneva:dashboard-data-change', updateData)
  }, [])

  return (
    <>
      <IconSprite />
      <div data-toast role="status" aria-live="polite" className="dashboard-toast hidden" />
      <dialog
        data-modal
        className="dashboard-dialog"
        onKeyDown={(event) => {
          if (event.key === 'Escape') event.currentTarget.close()
        }}
      />
      <div className="dashboard-layout">
        <DashboardSidebar />
        <div className="dashboard-workspace">
          <main className="dashboard-main">
            <DashboardHeader />
            <p data-dashboard-loading className="dashboard-state-note" role="status">Memuat data dashboard...</p>
            <div data-dashboard-error hidden className="dashboard-error-state" role="alert">
              <p>Data tersimpan tidak dapat dibaca. Dashboard menampilkan data contoh.</p>
              <button type="button" data-act="reload-dashboard" className="dashboard-text-action">Muat ulang dashboard</button>
            </div>
            <SummaryCards />
            <div className="dashboard-insights-row"><IncomeChart /><ActivityChart /></div>
            <div className="dashboard-columns">
              <DashboardLeftColumn />
              <DashboardRightColumn reminders={reminders} />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

mountPage(Dashboard)
