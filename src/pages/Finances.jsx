
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import {
  getDashboardData,
  getDashboardTransactions,
  mountPage,
  subscribeToDashboardTransactions,
  updateDashboardTransactions,
} from '../main.jsx'
import { DashboardSidebar } from '../components/layout/DashboardSidebar.jsx'
import { GlobalHeader } from '../components/layout/GlobalHeader.jsx'
import { GooeyNav } from '../components/ui/GooeyNav.jsx'
import { ProtectedPage } from '../components/auth/ProtectedPage.jsx'

// ==========================================
// TRANSACTION HELPERS
// ==========================================

// Tabungan disimpan sebagai transaksi keluar dengan kategori tabungan
// agar tetap kompatibel dengan struktur transaksi Dashboard (in/out).

const normalizeTransaction = (item) => {
  const category = item.cat || item.category || 'kebutuhan'

  const isSaving =
    item.type === 'saving' ||
    (item.type === 'out' && ['tabungan', 'savings'].includes(category))

  return {
    id: item.id,
    name: item.name || item.note || 'Transaksi',
    category: isSaving ? 'tabungan' : category,
    type: isSaving
      ? 'saving'
      : item.type === 'in'
        ? 'income'
        : 'expense',
    amount: Number(item.amount) || 0,
    date: item.date,
    method: item.method || 'Transfer',
    note: item.note || 'Transaksi',
  }
}

const toDashboardTransaction = (item) => ({
  id: item.id,
  date: item.date,
  cat: item.type === 'saving' ? 'tabungan' : item.category,
  type: item.type === 'income' ? 'in' : 'out',
  amount: item.amount,
  name: item.name,
  method: item.method,
  note: item.note || item.name,
})

const currency = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)

const isoToday = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const addMonths = (date, value) => {
  const next = new Date(date)
  next.setMonth(next.getMonth() + value)
  return next
}

const addDays = (date, value) => {
  const next = new Date(date)
  next.setDate(next.getDate() + value)
  return next
}

const formatLongDate = (value) =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))

const categoryMeta = {
  kebutuhan: { label: 'Kebutuhan', tone: '#2563eb' },
  tabungan: { label: 'Tabungan', tone: '#10b981' },
  hiburan: { label: 'Hiburan', tone: '#ec4899' },
  food: { label: 'Makanan & minuman', tone: '#2563eb' },
  transport: { label: 'Transportasi', tone: '#10b981' },
  shopping: { label: 'Belanja', tone: '#f59e0b' },
  bills: { label: 'Tagihan', tone: '#8b5cf6' },
  fun: { label: 'Hiburan', tone: '#ec4899' },
  health: { label: 'Kesehatan', tone: '#14b8a6' },
  education: { label: 'Pendidikan', tone: '#f97316' },
  other: { label: 'Lainnya', tone: '#64748b' },
}

const rangeConfig = {
  week: { label: 'Minggu ini' },
  month: { label: 'Bulan ini' },
  '3m': { label: '3 bulan terakhir' },
  '6m': { label: '6 bulan terakhir' },
  year: { label: 'Tahun ini' },
}

const today = new Date()

const previousMonths = (count) => {
  const months = []

  for (let index = count - 1; index >= 0; index -= 1) {
    const current = addMonths(
      new Date(today.getFullYear(), today.getMonth(), 1),
      -index
    )

    months.push({
      key: `${current.getFullYear()}-${String(
        current.getMonth() + 1
      ).padStart(2, '0')}`,
      label: new Intl.DateTimeFormat('id-ID', {
        month: 'short',
      }).format(current),
    })
  }

  return months
}

const initialBudgets = {
  kebutuhan: 2200000,
  hiburan: 900000,
  tabungan: 3000000,
}

const formatChange = (value) => {
  if (value === 0) return '0%'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  icon,
  label,
  value,
  change,
  tone,
  helper,
  positive = true,
  href,
}) {
  const content = (
    <>
      <div className="finance-stat-top">
        <span className={`finance-stat-icon ${tone}`}>
          {icon}
        </span>

        <span
          className="finance-stat-change"
          data-trend={positive ? 'positive' : 'negative'}
        >
          {change}
        </span>
      </div>

      <div>
        <p className="finance-stat-label">{label}</p>
        <p className="finance-stat-value">{value}</p>
      </div>

      <p className="finance-stat-helper">{helper}</p>
    </>
  )

  const className =
    `card dashboard-card finance-stat-card${href ? ' finance-stat-card-link' : ''}`

  return href
    ? <a href={href} className={className}>{content}</a>
    : <article className={className}>{content}</article>
}

// ==========================================
// AREA CHART
// ==========================================

function MiniAreaChart({ data, series }) {
  const values = data.flatMap((point) =>
    series.map(({ key }) => point[key])
  )

  const max = Math.max(...values, 1)

  const width = 620
  const height = 180
  const left = 18
  const right = width - 18
  const top = 12
  const bottom = height - 30

  const lines = series.map(({ key, label, color }) => {
    const points = data.map((point, index) => ({
      label: point.label,
      value: point[key],
      x: left + (
        data.length === 1
          ? 0
          : (index / (data.length - 1)) * (right - left)
      ),
      y: bottom - (point[key] / max) * (bottom - top),
    }))

    const path = points
      .map((point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
      )
      .join(' ')

    return {
      key,
      label,
      color,
      points,
      path,
      area: `${path} L ${right} ${bottom} L ${left} ${bottom} Z`,
    }
  })

  const labelPoints = data
    .map((point, index) => ({
      ...point,
      x: left + (
        data.length === 1
          ? 0
          : (index / (data.length - 1)) * (right - left)
      ),
    }))
    .filter((_, index) =>
      index % Math.max(1, Math.floor(data.length / 5)) === 0 ||
      index === data.length - 1
    )

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="finance-area-chart"
      role="img"
      aria-label="Grafik pemasukan dan pengeluaran bulanan"
    >
      <defs>
        {series.map(({ key, color }) => (
          <linearGradient
            key={key}
            id={`fin-area-gradient-${key}`}
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        ))}
      </defs>

      {[0, 1, 2, 3].map((tick) => {
        const y = top + ((bottom - top) / 3) * tick

        return (
          <line
            key={tick}
            x1={left}
            x2={right}
            y1={y}
            y2={y}
            stroke="var(--app-line)"
            strokeDasharray="4 6"
          />
        )
      })}

      {lines.map(({ key, label, color, points, path, area }) => (
        <g key={label}>
          <path
            d={area}
            fill={`url(#fin-area-gradient-${key})`}
          />

          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point) => (
            <g key={`${label}-${point.label}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="3.5"
                fill={color}
              />
              <title>
                {`${label} ${point.label}: ${currency(point.value)}`}
              </title>
            </g>
          ))}
        </g>
      ))}

      {labelPoints.map((point) => (
        <text
          key={point.label}
          x={point.x}
          y={height - 8}
          textAnchor="middle"
          fontSize="11"
          fill="var(--app-muted)"
        >
          {point.label}
        </text>
      ))}
    </svg>
  )
}

// ==========================================
// DONUT CHART
// ==========================================

function DonutChart({ segments }) {
  const total = segments.reduce(
    (sum, segment) => sum + segment.value,
    0
  )

  if (total === 0) {
    return (
      <p className="finance-chart-empty">
        Belum ada pengeluaran pada periode ini.
      </p>
    )
  }

  const chart = segments.map((segment, index) => {
    const previous = segments
      .slice(0, index)
      .reduce((sum, item) => sum + item.value, 0)

    const start = (previous / total) * 100
    const end = ((previous + segment.value) / total) * 100

    return `${segment.color} ${start}% ${end}%`
  }).join(', ')

  return (
    <div className="finance-donut-layout">
      <div
        className="finance-donut"
        role="img"
        aria-label={`Distribusi pengeluaran, total ${currency(total)}`}
        style={{ background: `conic-gradient(${chart})` }}
      >
        <div className="finance-donut-center">
          <div>
            <p className="text-xs text-muted">Total</p>
            <p className="mt-1 font-semibold text-ink">
              {currency(total)}
            </p>
          </div>
        </div>
      </div>

      <div className="finance-donut-legend">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-muted">{segment.label}</span>
            </div>

            <span className="font-medium text-ink">
              {Math.round((segment.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// MAIN FINANCE PAGE
// ==========================================

function FinancesPage() {
  const [period, setPeriod] = useState('month')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')

  const storedTransactions = useSyncExternalStore(
    subscribeToDashboardTransactions,
    getDashboardTransactions,
    getDashboardTransactions
  )

  const transactions = useMemo(
    () => storedTransactions.map(normalizeTransaction),
    [storedTransactions]
  )

  const [budgets, setBudgets] = useState(initialBudgets)
  const [modalOpen, setModalOpen] = useState(false)
  const modalRef = useRef(null)

  const [form, setForm] = useState({
    type: 'expense',
    name: '',
    amount: '',
    category: 'food',
    date: isoToday(today),
    method: 'Transfer',
    note: '',
  })

  // ==========================================
  // MODAL ACCESSIBILITY
  // ==========================================

  useEffect(() => {
    if (!modalOpen) return undefined

    const dialog = modalRef.current
    const returnFocus = document.activeElement

    const focusableSelector =
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]'

    const focusableElements =
      dialog?.querySelectorAll(focusableSelector) ?? []

    focusableElements[0]?.focus()

    const handleDialogKeyDown = (event) => {
      if (event.key === 'Escape') {
        setModalOpen(false)
        return
      }

      if (event.key !== 'Tab' || focusableElements.length === 0) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault()
        lastElement.focus()
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleDialogKeyDown)

    return () => {
      document.removeEventListener('keydown', handleDialogKeyDown)

      if (returnFocus instanceof HTMLElement) {
        returnFocus.focus()
      }
    }
  }, [modalOpen])

  // ==========================================
  // CURRENT PERIOD
  // ==========================================

  const currentPeriodTransactions = useMemo(() => {
    const end = today
    let start = new Date(end)

    if (period === 'week') {
      start = addDays(end, -6)
    } else if (period === 'month') {
      start = new Date(end.getFullYear(), end.getMonth(), 1)
    } else if (period === '3m') {
      start = addMonths(
        new Date(end.getFullYear(), end.getMonth(), 1),
        -2
      )
    } else if (period === '6m') {
      start = addMonths(
        new Date(end.getFullYear(), end.getMonth(), 1),
        -5
      )
    } else if (period === 'year') {
      start = new Date(end.getFullYear(), 0, 1)
    }

    return transactions.filter((item) => {
      const itemDate = new Date(`${item.date}T00:00:00`)
      return itemDate >= start && itemDate <= end
    })
  }, [period, transactions])

  // ==========================================
  // PREVIOUS PERIOD
  // ==========================================

  const previousPeriodTransactions = useMemo(() => {
    const end = addDays(today, -1)
    let start = new Date(end)

    if (period === 'week') {
      start = addDays(end, -6)
    } else if (period === 'month') {
      start = new Date(end.getFullYear(), end.getMonth(), 1)
    } else if (period === '3m') {
      start = addMonths(
        new Date(end.getFullYear(), end.getMonth(), 1),
        -2
      )
    } else if (period === '6m') {
      start = addMonths(
        new Date(end.getFullYear(), end.getMonth(), 1),
        -5
      )
    } else if (period === 'year') {
      start = new Date(end.getFullYear(), 0, 1)
    }

    const previousStart = new Date(start)
    const previousEnd = new Date(end)

    if (period === 'week') {
      previousStart.setDate(previousStart.getDate() - 7)
      previousEnd.setDate(previousEnd.getDate() - 7)
    } else if (period === 'month') {
      previousStart.setMonth(previousStart.getMonth() - 1)
      previousEnd.setMonth(previousEnd.getMonth() - 1)
    } else if (period === '3m') {
      previousStart.setMonth(previousStart.getMonth() - 3)
      previousEnd.setMonth(previousEnd.getMonth() - 3)
    } else if (period === '6m') {
      previousStart.setMonth(previousStart.getMonth() - 6)
      previousEnd.setMonth(previousEnd.getMonth() - 6)
    } else if (period === 'year') {
      previousStart.setFullYear(previousStart.getFullYear() - 1)
      previousEnd.setFullYear(previousEnd.getFullYear() - 1)
    }

    return transactions.filter((item) => {
      const itemDate = new Date(`${item.date}T00:00:00`)
      return itemDate >= previousStart && itemDate <= previousEnd
    })
  }, [period, transactions])

  // ==========================================
  // FINANCIAL CALCULATIONS
  // ==========================================

  const totalIncome = currentPeriodTransactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0)

  // Pengeluaran tidak memasukkan alokasi tabungan.
  const totalExpense = currentPeriodTransactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0)

  // Tabungan merupakan dana yang dialokasikan dari pemasukan.
  const totalSavings = currentPeriodTransactions
    .filter((item) => item.type === 'saving')
    .reduce((sum, item) => sum + item.amount, 0)

  // Saldo saat ini menggunakan sumber data bersama Dashboard.
  const currentBalance = getDashboardData().currentBalance

  // Saldo bersih periode setelah pengeluaran dan alokasi tabungan.
  const summaryNet = totalIncome - totalExpense - totalSavings

  const previousIncome = previousPeriodTransactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0)

  const previousExpense = previousPeriodTransactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0)

  const previousSavings = previousPeriodTransactions
    .filter((item) => item.type === 'saving')
    .reduce((sum, item) => sum + item.amount, 0)

  const incomeDelta = previousIncome > 0
    ? ((totalIncome - previousIncome) / previousIncome) * 100
    : 0

  const expenseDelta = previousExpense > 0
    ? ((totalExpense - previousExpense) / previousExpense) * 100
    : 0

  const savingsDelta = previousSavings > 0
    ? ((totalSavings - previousSavings) / previousSavings) * 100
    : 0

  const savingsRate = totalIncome > 0
    ? (totalSavings / totalIncome) * 100
    : 0

  // ==========================================
  // MONTHLY CHART
  // ==========================================

  const chartSeries = useMemo(
    () =>
      previousMonths(6).map((month) => ({
        label: month.label,

        income: transactions
          .filter(
            (item) =>
              item.type === 'income' &&
              item.date.startsWith(month.key)
          )
          .reduce((sum, item) => sum + item.amount, 0),

        expense: transactions
          .filter(
            (item) =>
              item.type === 'expense' &&
              item.date.startsWith(month.key)
          )
          .reduce((sum, item) => sum + item.amount, 0),
      })),
    [transactions]
  )

  // ==========================================
  // EXPENSE BREAKDOWN
  // ==========================================

  const expenseBreakdown = useMemo(() => {
    const buckets = Object.entries(categoryMeta).reduce(
      (accumulator, [key, meta]) => {
        accumulator[key] = {
          ...meta,
          value: 0,
        }

        return accumulator
      },
      {}
    )

    currentPeriodTransactions
      .filter((item) => item.type === 'expense')
      .forEach((item) => {
        const categoryKey =
          item.category in buckets
            ? item.category
            : 'other'

        buckets[categoryKey].value += item.amount
      })

    return Object.values(buckets)
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [currentPeriodTransactions])

  const totalBreakdown = expenseBreakdown.reduce(
    (sum, item) => sum + item.value,
    0
  )

  // ==========================================
  // SAVINGS BREAKDOWN
  // ==========================================

  const savingsTransactions = useMemo(
    () =>
      currentPeriodTransactions.filter(
        (item) => item.type === 'saving'
      ),
    [currentPeriodTransactions]
  )

  // ==========================================
  // TRANSACTION HISTORY
  // ==========================================

  const transactionGroups = useMemo(() => {
    const list = [...currentPeriodTransactions]

    const filtered = list.filter(
      (item) => filter === 'all' || item.type === filter
    )

    const matches = filtered.filter((item) => {
      if (!search.trim()) return true

      const query = search.toLowerCase()

      return `${item.name} ${item.note} ${item.category}`
        .toLowerCase()
        .includes(query)
    })

    const sorted = [...matches].sort((a, b) => {
      if (sort === 'largest') {
        return b.amount - a.amount
      }

      if (sort === 'smallest') {
        return a.amount - b.amount
      }

      if (sort === 'oldest') {
        return (
          new Date(`${a.date}T00:00:00`) -
          new Date(`${b.date}T00:00:00`)
        )
      }

      return (
        new Date(`${b.date}T00:00:00`) -
        new Date(`${a.date}T00:00:00`)
      )
    })

    const groups = new Map()

    sorted.forEach((item) => {
      if (!groups.has(item.date)) {
        groups.set(item.date, [])
      }

      groups.get(item.date).push(item)
    })

    return [...groups.entries()].sort(
      (a, b) => b[0].localeCompare(a[0])
    )
  }, [currentPeriodTransactions, filter, search, sort])

  // ==========================================
  // BUDGET CALCULATIONS
  // ==========================================

  const budgetRows = useMemo(
    () =>
      Object.entries(budgets).map(([key, amount]) => {
        const spent = currentPeriodTransactions
          .filter(
            (item) =>
              item.type === 'expense' &&
              item.category === key
          )
          .reduce((sum, item) => sum + item.amount, 0)

        return {
          key,
          label: categoryMeta[key]?.label ?? 'Lainnya',
          amount,
          spent,
          remaining: amount - spent,
          percent: Math.min(100, (spent / amount) * 100),
        }
      }),
    [budgets, currentPeriodTransactions]
  )

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  const handleTypeChange = (type) => {
    setForm((previous) => ({
      ...previous,
      type,
      category:
        type === 'saving'
          ? 'tabungan'
          : previous.category === 'tabungan'
            ? 'food'
            : previous.category,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const amount = Number(form.amount)

    if (
      !form.name.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return
    }

    const nextTransaction = {
      id: Date.now(),
      name: form.name.trim(),
      category:
        form.type === 'saving'
          ? 'tabungan'
          : form.category,
      type: form.type,
      amount,
      date: form.date,
      method: form.method,
      note: form.note.trim() || form.name.trim(),
    }

    const nextTransactions = [
      nextTransaction,
      ...transactions,
    ]

    updateDashboardTransactions(
      nextTransactions.map(toDashboardTransaction)
    )

    setForm({
      type: 'expense',
      name: '',
      amount: '',
      category: 'food',
      date: isoToday(new Date()),
      method: 'Transfer',
      note: '',
    })

    setModalOpen(false)
  }

  const handleDelete = (id) => {
    const nextTransactions = transactions.filter(
      (item) => item.id !== id
    )

    updateDashboardTransactions(
      nextTransactions.map(toDashboardTransaction)
    )
  }

  const headerText = rangeConfig[period].label

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="dashboard-layout finance-layout">

      <DashboardSidebar page="finances" />

      <main className="finance-main">

        {/* HEADER */}

        <GlobalHeader
          title="Keuangan"
          showDateLine={false}
          actionButton={
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn dashboard-primary-action inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
            >
              <svg className="icon size-4" aria-hidden="true">
                <use href="#i-plus" />
              </svg>

              <span>Catat transaksi</span>
            </button>
          }
        />

        {/* PERIOD FILTER */}

        <div className="mb-6 flex items-center justify-start overflow-x-auto pb-1">
          <GooeyNav
            items={Object.entries(rangeConfig).map(
              ([key, config]) => ({
                id: key,
                label: config.label,
              })
            )}
            activeId={period}
            onChange={setPeriod}
            ariaLabel="Pilih periode ringkasan keuangan"
          />
        </div>

        {/* FINANCIAL SUMMARY */}

        <section
          className="finance-summary"
          aria-label="Ringkasan keuangan"
        >

          <StatCard
            icon={
              <svg className="icon size-4" aria-hidden="true">
                <use href="#i-down" />
              </svg>
            }
            label="Total pemasukan"
            value={currency(totalIncome)}
            change={formatChange(incomeDelta)}
            tone="bg-primary-soft text-primary"
            helper={`${headerText} · ${formatChange(incomeDelta)} vs periode sebelumnya`}
            positive={incomeDelta >= 0}
          />

          <StatCard
            icon={
              <svg className="icon size-4" aria-hidden="true">
                <use href="#i-up" />
              </svg>
            }
            label="Total pengeluaran"
            value={currency(totalExpense)}
            change={formatChange(expenseDelta)}
            tone="bg-primary-tint text-ink"
            helper={`${headerText} · ${formatChange(expenseDelta)} vs periode sebelumnya`}
            positive={expenseDelta <= 0}
          />

          <StatCard
            icon={
              <svg className="icon size-4" aria-hidden="true">
                <use href="#i-wallet" />
              </svg>
            }
            label="Total tabungan"
            value={currency(totalSavings)}
            change={formatChange(savingsDelta)}
            tone="bg-primary-soft text-primary"
            helper={`${savingsRate.toFixed(1)}% dari pemasukan periode ini`}
            positive={savingsDelta >= 0}
          />

          <StatCard
            icon={
              <svg className="icon size-4" aria-hidden="true">
                <use href="#i-wallet" />
              </svg>
            }
            label="Total saldo"
            value={currency(currentBalance)}
            change="Saat ini"
            tone="bg-primary-tint text-primary"
            helper="Saldo tersedia setelah transaksi dan alokasi tabungan"
            positive={currentBalance >= 0}
            href="#finance-transactions"
          />

          <StatCard
            icon={
              <svg className="icon size-4" aria-hidden="true">
                <use href="#i-chart" />
              </svg>
            }
            label="Saldo bersih periode"
            value={currency(summaryNet)}
            change={summaryNet >= 0 ? 'Surplus' : 'Defisit'}
            tone="bg-primary-tint text-primary"
            helper="Pemasukan dikurangi pengeluaran dan tabungan"
            positive={summaryNet >= 0}
          />

        </section>

        {/* CHARTS */}

        <section className="finance-charts-grid">

          <article className="card dashboard-card finance-chart-card">

            <div className="finance-card-header">
              <div>
                <h2 className="finance-section-title">
                  Pemasukan & pengeluaran
                </h2>

                <p className="finance-section-description">
                  Perbandingan total setiap bulan.
                </p>
              </div>

              <div
                className="finance-chart-legend"
                aria-label="Legenda grafik"
              >
                <span>
                  <span className="finance-legend-dot income" />
                  Pemasukan
                </span>

                <span>
                  <span className="finance-legend-dot expense" />
                  Pengeluaran
                </span>
              </div>
            </div>

            <MiniAreaChart
              data={chartSeries}
              series={[
                {
                  key: 'income',
                  label: 'Pemasukan',
                  color: 'var(--app-primary-text)',
                },
                {
                  key: 'expense',
                  label: 'Pengeluaran',
                  color: 'var(--app-ink)',
                },
              ]}
            />

          </article>

          <article className="card dashboard-card finance-chart-card">

            <header>
              <h2 className="finance-section-title">
                Distribusi pengeluaran
              </h2>

              <p className="finance-section-description">
                Porsi tiap kategori pada {headerText.toLowerCase()}.
              </p>
            </header>

            <div className="finance-donut-wrap">
              <DonutChart
                segments={expenseBreakdown.slice(0, 6).map(
                  (segment) => ({
                    label: segment.label,
                    value: segment.value,
                    color: segment.tone,
                  })
                )}
              />
            </div>

          </article>

        </section>

        {/* ANALYSIS */}

        <section className="finance-analysis-grid">

          {/* EXPENSE ANALYSIS */}

          <article className="card dashboard-card finance-section-card">

            <h2 className="finance-section-title">
              Analisis pengeluaran
            </h2>

            <p className="finance-section-description">
              Kategori dengan pengeluaran terbesar pada periode ini.
            </p>

            <div className="mt-4 space-y-3">

              {expenseBreakdown.length === 0 ? (
                <p className="text-sm text-muted">
                  Belum ada pengeluaran pada periode ini.
                </p>
              ) : (
                expenseBreakdown.map((item) => {
                  const pct = totalBreakdown
                    ? (item.value / totalBreakdown) * 100
                    : 0

                  return (
                    <div key={item.label}>

                      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-ink">
                          {item.label}
                        </span>

                        <span className="text-muted">
                          {currency(item.value)} · {pct.toFixed(0)}%
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-canvas">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: item.tone,
                          }}
                        />
                      </div>

                    </div>
                  )
                })
              )}

            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">

              <div className="rounded-2xl bg-canvas p-3">
                <p className="text-xs text-muted">
                  Pengeluaran terbesar
                </p>

                <p className="mt-1 text-lg font-semibold text-ink">
                  {expenseBreakdown[0]?.label ?? 'Belum ada'}
                </p>
              </div>

              <div className="rounded-2xl bg-canvas p-3">
                <p className="text-xs text-muted">
                  Rata-rata per transaksi
                </p>

                <p className="mt-1 text-lg font-semibold text-ink">
                  {currency(
                    totalExpense /
                    (
                      currentPeriodTransactions.filter(
                        (item) => item.type === 'expense'
                      ).length || 1
                    )
                  )}
                </p>
              </div>

            </div>

          </article>

          {/* BUDGET MANAGEMENT */}

          <article className="card dashboard-card finance-section-card">

            <div className="flex items-center justify-between gap-3">

              <h2 className="finance-section-title">
                Pengelolaan anggaran
              </h2>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn text-xs font-semibold rounded-xl bg-primary/10 text-primary dark:bg-white/10 dark:text-white hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer px-3 py-1.5"
              >
                Tambah
              </button>

            </div>

            <div className="mt-4 space-y-3">

              {budgetRows.map((budget) => (
                <div
                  key={budget.key}
                  className="rounded-2xl bg-canvas p-3"
                >

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-ink">
                      {budget.label}
                    </span>

                    <span className="text-xs text-muted">
                      {currency(budget.spent)} / {currency(budget.amount)}
                    </span>
                  </div>

                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-canvas">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${budget.percent}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-muted">
                    <span>
                      Sisa: {currency(budget.remaining)}
                    </span>

                    <span>
                      {budget.percent.toFixed(0)}%
                    </span>
                  </div>

                </div>
              ))}

            </div>

          </article>

        </section>

        {/* SAVINGS SUMMARY */}

        <section className="card dashboard-card finance-section-card">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="finance-section-title">
                Alokasi tabungan
              </h2>

              <p className="finance-section-description">
                Dana yang disisihkan dari pemasukan pada {headerText.toLowerCase()}.
              </p>
            </div>

            <span className="text-sm font-semibold text-primary">
              {savingsRate.toFixed(1)}% dari pemasukan
            </span>

          </div>

          <div className="mt-4 rounded-2xl bg-canvas p-4">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs text-muted">
                  Total dana dialokasikan
                </p>

                <p className="mt-1 text-2xl font-bold text-ink">
                  {currency(totalSavings)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setForm((previous) => ({
                    ...previous,
                    type: 'saving',
                    category: 'tabungan',
                  }))
                  setModalOpen(true)
                }}
                className="btn dashboard-primary-action rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-primary/90 active:scale-95"
              >
                <span className="inline-flex items-center gap-2">
                  <svg className="icon size-4" aria-hidden="true">
                    <use href="#i-plus" />
                  </svg>
                  Tambah tabungan
                </span>
              </button>

            </div>

          </div>

          <div className="mt-4 space-y-2">

            {savingsTransactions.length === 0 ? (
              <p className="rounded-2xl bg-canvas p-4 text-center text-sm text-muted">
                Belum ada alokasi tabungan pada periode ini.
              </p>
            ) : (
              savingsTransactions
                .slice(0, 5)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-canvas p-3"
                  >

                    <div className="flex items-center gap-3">

                      <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
                        <svg className="icon size-4" aria-hidden="true">
                          <use href="#i-wallet" />
                        </svg>
                      </span>

                      <div>
                        <p className="text-sm font-medium text-ink">
                          {item.name}
                        </p>

                        <p className="text-xs text-muted">
                          {formatLongDate(item.date)}
                        </p>
                      </div>

                    </div>

                    <p className="text-sm font-semibold text-primary">
                      {currency(item.amount)}
                    </p>

                  </div>
                ))
            )}

          </div>

        </section>

        {/* TRANSACTION HISTORY */}

        <section
          id="finance-transactions"
          className="card dashboard-card finance-section-card"
        >

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="finance-section-title">
                Riwayat transaksi
              </h2>

              <p className="finance-section-description">
                {transactionGroups.reduce(
                  (count, [, items]) => count + items.length,
                  0
                )} transaksi
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-line dark:border-white/15 bg-surface/80 dark:bg-white/5 px-3 py-2 text-sm text-ink outline-none focus:border-primary dark:focus:border-primary-text sm:w-52 transition-all"
                placeholder="Cari transaksi"
              />

              <div className="flex flex-wrap gap-2">

                {[
                  { value: 'all', label: 'Semua' },
                  { value: 'income', label: 'Pemasukan' },
                  { value: 'expense', label: 'Pengeluaran' },
                  { value: 'saving', label: 'Tabungan' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                    aria-pressed={filter === option.value}
                    className={`btn min-h-10 px-3.5 text-xs font-medium rounded-xl transition-all duration-200 active:scale-95 ${
                      filter === option.value
                        ? 'bg-primary text-white shadow-md shadow-primary/25 font-semibold'
                        : 'bg-canvas dark:bg-white/10 text-ink dark:text-slate-200 border border-line/60 dark:border-white/10 hover:bg-primary/10 hover:text-primary dark:hover:bg-white/15'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}

              </div>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Urutkan transaksi"
                className="rounded-xl border border-line dark:border-white/15 bg-surface dark:bg-slate-900 px-3 py-2 text-sm text-ink outline-none focus:border-primary dark:focus:border-primary-text transition-all"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="largest">Nominal terbesar</option>
                <option value="smallest">Nominal terkecil</option>
              </select>

            </div>

          </div>

          <div className="mt-5 space-y-4">

            {transactionGroups.length === 0 ? (
              <div className="rounded-2xl bg-canvas p-6 text-center text-sm text-muted">
                Belum ada transaksi untuk filter yang dipilih.
              </div>
            ) : (
              transactionGroups.map(([date, items]) => (
                <div key={date}>

                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    {formatLongDate(date)}
                  </p>

                  <ul className="space-y-2">

                    {items.map((item) => {

                      const isIncome = item.type === 'income'
                      const isSaving = item.type === 'saving'

                      const iconName = isIncome
                        ? 'down'
                        : isSaving
                          ? 'wallet'
                          : 'up'

                      const amountPrefix = isIncome ? '+' : '-'

                      return (
                        <li
                          key={item.id}
                          className="flex flex-col gap-3 rounded-2xl bg-canvas p-3 sm:flex-row sm:items-center"
                        >

                          <div className="flex items-center gap-3">

                            <span
                              className={`grid size-10 place-items-center rounded-xl ${
                                isIncome || isSaving
                                  ? 'bg-primary-soft text-primary'
                                  : 'bg-navy text-white'
                              }`}
                            >
                              <svg className="icon size-4" aria-hidden="true">
                                <use href={`#i-${iconName}`} />
                              </svg>
                            </span>

                            <div>
                              <p className="font-medium text-ink">
                                {item.name}
                              </p>

                              <p className="text-xs text-muted">
                                {isSaving
                                  ? 'Alokasi tabungan'
                                  : categoryMeta[item.category]?.label ?? item.category}
                              </p>
                            </div>

                          </div>

                          <div className="ml-auto flex flex-1 items-center justify-between gap-3 sm:flex-initial sm:justify-end">

                            <div className="text-right">

                              <p
                                className={`font-semibold ${
                                  isIncome || isSaving
                                    ? 'text-primary'
                                    : 'text-ink'
                                }`}
                              >
                                {amountPrefix}{currency(item.amount)}
                              </p>

                              <p className="text-xs text-muted">
                                {isSaving
                                  ? `Ditabung · ${item.method}`
                                  : item.method}
                              </p>

                            </div>

                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="grid size-8 place-items-center rounded-xl bg-surface dark:bg-white/10 border border-line/40 dark:border-white/10 text-muted hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all active:scale-95 cursor-pointer"
                              aria-label={`Hapus ${item.name}`}
                            >
                              <svg className="icon size-4" aria-hidden="true">
                                <use href="#i-trash" />
                              </svg>
                            </button>

                          </div>

                        </li>
                      )
                    })}

                  </ul>

                </div>
              ))
            )}

          </div>

        </section>

      </main>

      {/* ======================================
          TRANSACTION MODAL
      ====================================== */}

      {modalOpen && (
        <div className="finance-modal-backdrop">

          <div
            ref={modalRef}
            className="finance-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="finance-modal-title"
          >

            <div className="mb-4 flex items-center justify-between gap-3">

              <div>
                <h2
                  id="finance-modal-title"
                  className="finance-section-title"
                >
                  Catat transaksi
                </h2>

                <p className="mt-1 text-xs text-muted">
                  Masukkan detail aktivitas keuangan kamu.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid size-9 place-items-center rounded-xl bg-canvas dark:bg-white/10 text-muted hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Tutup dialog"
              >
                <svg className="icon size-4" aria-hidden="true">
                  <use href="#i-x" />
                </svg>
              </button>

            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* TRANSACTION TYPE */}

              <label className="grid gap-1 text-sm font-medium text-ink">

                Jenis transaksi

                <select
                  value={form.type}
                  onChange={(event) =>
                    handleTypeChange(event.target.value)
                  }
                  className="rounded-xl border border-line dark:border-white/15 bg-canvas/80 dark:bg-slate-900 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary dark:focus:border-primary-text transition-all"
                >
                  <option value="expense">Pengeluaran</option>
                  <option value="income">Pemasukan</option>
                  <option value="saving">Tabungan</option>
                </select>

              </label>

              {/* SAVINGS EXPLANATION */}

              {form.type === 'saving' && (
                <div className="rounded-xl bg-primary-soft p-3 text-sm text-primary">
                  <div className="flex items-start gap-2">
                    <svg className="icon size-4 mt-0.5 shrink-0" aria-hidden="true">
                      <use href="#i-wallet" />
                    </svg>

                    <p>
                      Dana ini akan dialokasikan dari saldo tersedia
                      dan dicatat sebagai tabungan, bukan pengeluaran biasa.
                    </p>
                  </div>
                </div>
              )}

              {/* CATEGORY */}

              <label className="grid gap-1 text-sm font-medium text-ink">

                Kategori

                {form.type === 'saving' ? (
                  <div className="rounded-xl border border-line dark:border-white/15 bg-canvas/80 dark:bg-slate-900 px-3 py-2.5 text-sm text-primary">
                    Tabungan
                  </div>
                ) : (
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        category: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-line dark:border-white/15 bg-canvas/80 dark:bg-slate-900 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary dark:focus:border-primary-text transition-all"
                  >
                    {Object.entries(categoryMeta)
                      .filter(([key]) => key !== 'tabungan')
                      .map(([key, item]) => (
                        <option key={key} value={key}>
                          {item.label}
                        </option>
                      ))}
                  </select>
                )}

              </label>

              {/* TRANSACTION NAME */}

              <label className="grid gap-1 text-sm font-medium text-ink">

                {form.type === 'saving'
                  ? 'Nama alokasi tabungan'
                  : 'Nama transaksi'}

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  className="rounded-xl border border-line dark:border-white/15 bg-canvas/80 dark:bg-white/5 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary dark:focus:border-primary-text focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder={
                    form.type === 'saving'
                      ? 'Contoh: Tabungan bulanan'
                      : form.type === 'income'
                        ? 'Contoh: Gaji bulanan'
                        : 'Contoh: Belanja bulanan'
                  }
                  required
                />

              </label>

              {/* AMOUNT AND DATE */}

              <div className="grid gap-4 sm:grid-cols-2">

                <label className="grid gap-1 text-sm font-medium text-ink">

                  Nominal

                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={form.amount}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        amount: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-line dark:border-white/15 bg-canvas/80 dark:bg-white/5 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary dark:focus:border-primary-text focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="Contoh: 500000"
                    required
                  />

                </label>

                <label className="grid gap-1 text-sm font-medium text-ink">

                  Tanggal

                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        date: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-line dark:border-white/15 bg-canvas/80 dark:bg-white/5 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary dark:focus:border-primary-text focus:ring-1 focus:ring-primary/20 transition-all"
                    required
                  />

                </label>

              </div>

              {/* PAYMENT METHOD AND NOTE */}

              <div className="grid gap-4 sm:grid-cols-2">

                <label className="grid gap-1 text-sm font-medium text-ink">

                  {form.type === 'saving'
                    ? 'Sumber dana'
                    : 'Metode pembayaran'}

                  <select
                    value={form.method}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        method: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-line dark:border-white/15 bg-canvas/80 dark:bg-slate-900 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary dark:focus:border-primary-text transition-all"
                  >
                    <option value="Transfer">Transfer</option>
                    <option value="E-wallet">E-wallet</option>
                    <option value="Debit">Debit</option>
                    <option value="Cash">Cash</option>
                  </select>

                </label>

                <label className="grid gap-1 text-sm font-medium text-ink">

                  Catatan

                  <input
                    type="text"
                    value={form.note}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        note: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-line dark:border-white/15 bg-canvas/80 dark:bg-white/5 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary dark:focus:border-primary-text focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="Opsional"
                  />

                </label>

              </div>

              {/* ACTION BUTTONS */}

              <div className="flex justify-end gap-2.5 pt-2">

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn rounded-xl px-4 py-2.5 text-sm font-medium bg-canvas dark:bg-white/10 text-ink dark:text-slate-200 hover:bg-line/50 dark:hover:bg-white/15 transition-all active:scale-95 cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="btn-primary dashboard-primary-action rounded-xl px-5 py-2.5 text-sm font-semibold bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 cursor-pointer"
                >
                  Simpan
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

// ==========================================
// PAGE MOUNT
// ==========================================

mountPage(() => (
  <ProtectedPage>
    <FinancesPage />
  </ProtectedPage>
))
