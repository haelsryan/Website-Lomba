import { useEffect, useState } from 'react'
import { getDashboardData, initDashboard, mountPage } from '../main.jsx'
import { DashboardSidebar } from '../components/layout/DashboardSidebar.jsx'
import { GlobalHeader } from '../components/layout/GlobalHeader.jsx'

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

function SummaryCards() {
  const summaries = [
    { icon: 'wallet', label: 'Total saldo', value: 'Belum tersedia', hook: 'data-summary-balance', meta: 'Dari semua transaksi tersimpan', tone: 'bg-primary/10 text-primary dark:bg-primary/20' },
    { icon: 'down', label: 'Total pemasukan', hook: 'data-summary-income', metaHook: 'data-summary-period', tone: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
    { icon: 'up', label: 'Total pengeluaran', hook: 'data-summary-expenses', metaHook: 'data-summary-expense-period', tone: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' },
    { icon: 'chart', label: 'Total tabungan', hook: 'data-summary-savings', metaHook: 'data-summary-savings-period', tone: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' },
  ]

  return (
    <section className="dashboard-summary grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" aria-label="Ringkasan keuangan">
      {summaries.map(({ icon, label, value, hook, meta, metaHook, tone }) => {
        const content = (
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="dashboard-summary-label text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
              <span className={`dashboard-summary-icon grid size-10 place-items-center rounded-2xl ${tone} shadow-sm transition-transform duration-200 group-hover:scale-110`}>
                <Icon name={icon} className="size-5" />
              </span>
            </div>
            <div>
              <p className="dashboard-summary-value text-2xl lg:text-3xl font-extrabold tracking-tight text-ink font-mono sm:font-sans" {...(hook ? { [hook]: '' } : {})}>{value}</p>
              <p className="dashboard-summary-meta mt-1.5 text-xs text-muted" {...(metaHook ? { [metaHook]: '' } : {})}>{meta}</p>
            </div>
          </div>
        )

        return hook === 'data-summary-balance' ? (
          <a
            href="/pages/finances.html"
            className="card dashboard-card dashboard-summary-card dashboard-summary-card-link p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
            aria-label="Lihat total saldo di halaman Keuangan"
            key={label}
          >
            {content}
          </a>
        ) : (
          <article className="card dashboard-card dashboard-summary-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group" key={label}>
            {content}
          </article>
        )
      })}
    </section>
  )
}

function IncomeChart() {
  return (
    <section className="card dashboard-card dashboard-income-card">
      <header className="dashboard-card-header">
        <div><p className="dashboard-section-kicker">Arus masuk</p><h2>Total pemasukan</h2><p className="dashboard-chart-total" data-income-total /></div>
        <div
          className="dashboard-period-control gooey-nav"
          role="group"
          aria-label="Periode grafik pemasukan"
          style={{ '--gooey-items': 5, '--gooey-indicator-width': '20%', '--gooey-offset': '300%' }}
        >
          <button type="button" data-act="income-period" data-v="7d" aria-pressed="false" className="btn dashboard-range-button">Minggu ini</button>
          <button type="button" data-act="income-period" data-v="30d" aria-pressed="false" className="btn dashboard-range-button">Bulan ini</button>
          <button type="button" data-act="income-period" data-v="3m" aria-pressed="false" className="btn dashboard-range-button">3 bulan</button>
          <button type="button" data-act="income-period" data-v="6m" aria-pressed="true" className="btn dashboard-range-button">6 bulan</button>
          <button type="button" data-act="income-period" data-v="1y" aria-pressed="false" className="btn dashboard-range-button">Tahun ini</button>
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
      <div className="dashboard-scroll-list-wrap" data-scroll-list>
        <ul
          data-dashboard-transactions
          className="dashboard-transaction-list"
          role="list"
        />

        <p
          data-dashboard-transactions-empty
          className="dashboard-empty-state"
          hidden
        />
      </div>
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
          <button type="button" data-act="month" data-v="-1" className="icon-btn dashboard-icon-action" aria-label="Bulan sebelumnya"><Icon name="chevron-l" /></button>
          <button type="button" data-act="month" data-v="1" className="icon-btn dashboard-icon-action" aria-label="Bulan berikutnya"><Icon name="chevron-r" /></button>
        </div>
      </header>
      <ul className="dashboard-calendar-weekdays" role="list" aria-label="Hari dalam minggu">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
          <li key={day}>{day}</li>
        ))}
      </ul>
      <ul data-cal-days className="dashboard-calendar-days" role="list" aria-label="Tanggal dalam bulan" />
    </section>
  )
}

function DashboardLeftColumn() {
  return (
    <section className="dashboard-column dashboard-column-left" aria-label="Ringkasan pengeluaran dan transaksi">
      <IncomeChart />
      <ActivityChart />
      <TransactionHistory />
    </section>
  )
}

function DashboardRightColumn({ reminders }) {
  return (
    <aside className="dashboard-column dashboard-column-right" aria-label="Kalender, notifikasi, dan tagihan">
      <DashboardCalendar />
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
          <button
            type="button"
            data-act="toggle-mute"
            className="icon-btn dashboard-icon-action"
            aria-label="Matikan notifikasi"
            aria-pressed="false"
          >
            <Icon name="bell" />
          </button>
        </div>
      </header>
      <div className="dashboard-notification-tabs" role="tablist" aria-label="Filter notifikasi">
        <button type="button" role="tab" data-act="tab" data-v="all" aria-selected="true" className="btn dashboard-range-button">Semua</button>
        <button type="button" role="tab" data-act="tab" data-v="shared" aria-selected="false" className="btn dashboard-range-button">Undangan</button>
        <button type="button" role="tab" data-act="tab" data-v="comment" aria-selected="false" className="btn dashboard-range-button">Komentar</button>
        <button type="button" role="tab" data-act="tab" data-v="view" aria-selected="false" className="btn dashboard-range-button">Dilihat</button>
      </div>
      <div className="dashboard-scroll-list-wrap dashboard-notification-list-wrap">
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
      <div data-toast role="status" aria-live="polite" className="dashboard-toast hidden" />
      <dialog
        data-modal
        className="dashboard-dialog"
        onKeyDown={(event) => {
          if (event.key === 'Escape') event.currentTarget.close()
        }}
      />
      <div className="dashboard-layout">
        <DashboardSidebar page="dashboard" />
        <div className="dashboard-workspace">
          <main className="dashboard-main">
            <GlobalHeader title="Dashboard" subtitle="Ringkasan kondisi keuangan Anda." />
            <p data-dashboard-loading className="dashboard-state-note" role="status">Memuat data dashboard...</p>
            <div data-dashboard-error hidden className="dashboard-error-state" role="alert">
              <p>Data tersimpan tidak dapat dibaca. Dashboard menampilkan data contoh.</p>
              <button type="button" data-act="reload-dashboard" className="dashboard-text-action">Muat ulang dashboard</button>
            </div>
            <SummaryCards />
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
