
import { useState } from 'react'
import { mountPage } from '../main.jsx'
import { DashboardSidebar } from '../components/layout/DashboardSidebar.jsx'
import { GlobalHeader } from '../components/layout/GlobalHeader.jsx'
import { GooeyNav } from '../components/ui/GooeyNav.jsx'
import { ProtectedPage } from '../components/auth/ProtectedPage.jsx'


const MAX_AMOUNT = 1_000_000_000_000_000
const MAX_MONTHS = 600

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const INITIAL_GOAL = {
  target: '',
  months: '12',
  saved: '',
}

const INITIAL_EMERGENCY = {
  needs: '',
  saved: '',
  monthlySaving: '',
  targetMonths: '6',
}

const INITIAL_BUDGET = {
  income: '',
  needsPercent: '50',
  wantsPercent: '30',
  savingsPercent: '20',
}

// ==================================================
// HELPERS
// ==================================================

function formatAmountInput(value) {
  const digits = String(value ?? '').replace(/\D/g, '')
  if (!digits) return ''
  return new Intl.NumberFormat('id-ID').format(Number(digits))
}

function parseAmount(value) {
  const digits = String(value ?? '').replace(/\D/g, '')
  return digits ? Number(digits) : 0
}

function formatDateAfterMonths(months) {
  const date = new Date()
  const day = date.getDate()

  date.setDate(1)
  date.setMonth(date.getMonth() + Math.max(0, months))

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate()

  date.setDate(Math.min(day, lastDay))

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function amountError(value, label, { required = true, min = 0 } = {}) {
  if (value === '') {
    return required ? `${label} perlu diisi.` : ''
  }

  const amount = parseAmount(value)

  if (!Number.isFinite(amount)) {
    return `${label} harus berupa angka yang valid.`
  }

  if (amount < min) {
    return `${label} harus minimal ${currency.format(min)}.`
  }

  if (amount > MAX_AMOUNT) {
    return `${label} maksimal Rp1.000.000.000.000.000.`
  }

  return ''
}

function monthError(value) {
  if (value === '') return 'Jangka waktu perlu diisi.'

  const months = Number(value)

  if (!Number.isInteger(months) || months < 1) {
    return 'Masukkan jangka waktu minimal 1 bulan.'
  }

  if (months > MAX_MONTHS) {
    return `Jangka waktu maksimal ${MAX_MONTHS} bulan.`
  }

  return ''
}

function updateField(setValues, field) {
  return (event) => {
    setValues((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }
}

function calculateBudget(income, percentages) {
  const needs = Math.round(income * percentages.needs / 100)
  const wants = Math.round(income * percentages.wants / 100)
  const savings = income - needs - wants

  return {
    needs,
    wants,
    savings,
    total: income,
  }
}

function getBudgetInsight(income, budget, percentages) {
  if (income <= 0) return []

  const insights = []

  if (percentages.needs > 60) {
    insights.push({
      type: 'warning',
      category: 'Kebutuhan',
      title: 'Porsi kebutuhan cukup tinggi',
      description: `${percentages.needs}% pendapatan digunakan untuk kebutuhan. Periksa kembali pengeluaran tetap jika memungkinkan.`,
    })
  } else if (percentages.needs <= 50) {
    insights.push({
      type: 'success',
      category: 'Kebutuhan',
      title: 'Alokasi kebutuhan cukup terkendali',
      description: `${currency.format(budget.needs)} tersedia untuk kebutuhan pokok setiap bulan.`,
    })
  } else {
    insights.push({
      type: 'info',
      category: 'Kebutuhan',
      title: 'Evaluasi kebutuhan secara berkala',
      description: `Pastikan alokasi ${currency.format(budget.needs)} sesuai dengan biaya hidup Anda.`,
    })
  }

  if (percentages.wants > 35) {
    insights.push({
      type: 'warning',
      category: 'Keinginan',
      title: 'Porsi keinginan cukup besar',
      description: 'Pertimbangkan mengurangi pengeluaran non-esensial agar lebih banyak dana tersedia untuk tujuan keuangan.',
    })
  } else {
    insights.push({
      type: 'info',
      category: 'Keinginan',
      title: 'Dana keinginan tersedia',
      description: `${currency.format(budget.wants)} dapat digunakan untuk hiburan, hobi, dan kebutuhan non-esensial.`,
    })
  }

  if (percentages.savings >= 30) {
    insights.push({
      type: 'success',
      category: 'Tabungan',
      title: 'Potensi menabung sangat baik',
      description: `Anda mengalokasikan ${currency.format(budget.savings)} per bulan untuk tabungan dan tujuan keuangan.`,
    })
  } else if (percentages.savings >= 20) {
    insights.push({
      type: 'success',
      category: 'Tabungan',
      title: 'Alokasi tabungan cukup baik',
      description: `Pertahankan alokasi ${currency.format(budget.savings)} setiap bulan.`,
    })
  } else {
    insights.push({
      type: 'info',
      category: 'Tabungan',
      title: 'Tingkatkan tabungan secara bertahap',
      description: 'Jika kondisi memungkinkan, naikkan persentase tabungan sedikit demi sedikit.',
    })
  }

  return insights
}

function getTipsForIncome(income) {
  if (income <= 5000000) {
    return [
      'Prioritaskan kebutuhan dasar seperti makan, tempat tinggal, dan transportasi.',
      'Cari alternatif hiburan yang hemat biaya.',
      'Mulai membangun dana darurat secara bertahap.',
    ]
  }

  if (income <= 10000000) {
    return [
      'Tingkatkan dana darurat hingga 3–6 bulan kebutuhan.',
      'Pertimbangkan investasi sesuai profil risiko.',
      'Hindari menaikkan gaya hidup terlalu cepat.',
    ]
  }

  if (income <= 20000000) {
    return [
      'Maksimalkan tabungan dan investasi.',
      'Pertimbangkan diversifikasi investasi.',
      'Evaluasi pengeluaran besar secara berkala.',
    ]
  }

  return [
    'Evaluasi portofolio investasi secara berkala.',
    'Pertimbangkan konsultasi dengan perencana keuangan.',
    'Sisihkan sebagian pendapatan untuk kegiatan sosial.',
  ]
}

function monthsToTarget(target, saved, monthlySaving) {
  const gap = Math.max(target - saved, 0)

  if (gap === 0) return 0
  if (monthlySaving <= 0) return null

  return Math.ceil(gap / monthlySaving)
}

// ==================================================
// SHARED FORM COMPONENTS
// ==================================================

function NumberField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  max = MAX_AMOUNT,
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>

      <div className="flex overflow-hidden rounded-xl border border-line bg-surface/80 transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/15 dark:bg-white/5">
        <span className="flex items-center border-r border-line bg-canvas/40 px-3 text-sm font-medium text-muted dark:border-white/15 dark:bg-white/5 dark:text-slate-400">
          Rp
        </span>

        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={formatAmountInput(value)}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, '')

            if (digits.length > 15) return

            const amount = digits ? Number(digits) : 0

            if (amount <= max) {
              onChange({ target: { value: digits } })
            }
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="min-h-11 w-full min-w-0 bg-transparent px-3 py-2 text-sm text-ink outline-none"
          placeholder="0"
        />
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-sm text-muted" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function MonthsField({ value, onChange, error }) {
  const presets = [6, 12, 24, 36]

  return (
    <div className="grid gap-2">
      <label htmlFor="goal-months" className="text-sm font-semibold text-ink">
        Jangka waktu
      </label>

      <div className="flex overflow-hidden rounded-xl border border-line bg-surface/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/15 dark:bg-white/5">
        <input
          id="goal-months"
          type="number"
          inputMode="numeric"
          min="1"
          max={MAX_MONTHS}
          step="1"
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          className="min-h-11 w-full min-w-0 bg-transparent px-3 py-2 text-sm text-ink outline-none"
        />

        <span className="flex items-center border-l border-line bg-canvas/40 px-3 text-sm font-medium text-muted dark:border-white/15 dark:bg-white/5">
          bulan
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((month) => (
          <button
            key={month}
            type="button"
            onClick={() => onChange({ target: { value: String(month) } })}
            aria-pressed={Number(value) === month}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
              Number(value) === month
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-line bg-surface text-muted hover:border-primary/50 hover:text-ink dark:border-white/15 dark:bg-white/5'
            }`}
          >
            {month} bulan
          </button>
        ))}
      </div>

      {error ? (
        <p className="text-sm text-muted" role="alert">{error}</p>
      ) : (
        <p className="text-xs text-muted">
          Pilih durasi cepat atau masukkan 1 sampai {MAX_MONTHS} bulan.
        </p>
      )}
    </div>
  )
}

function EstimateButton() {
  return (
    <button
      type="submit"
      className="btn-primary dashboard-primary-action inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-lg active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      Hitung estimasi
    </button>
  )
}

function ExampleButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-muted transition-all hover:border-primary/50 hover:text-primary dark:border-white/15"
    >
      Isi contoh simulasi
    </button>
  )
}

function SectionHeading({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  )
}

function ResultLabel({ children }) {
  return <p className="text-sm font-semibold text-primary">{children}</p>
}

function ProgressBar({ value, label }) {
  const percentage = Math.max(0, Math.min(value, 100))

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.round(percentage)}
      className="h-4 overflow-hidden rounded-full bg-canvas shadow-inner dark:bg-white/10"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-700"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

function TipList({ title, items }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <h4 className="mb-2 text-sm font-semibold text-ink">{title}</h4>
      <ul className="space-y-1.5 text-sm text-muted">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="font-bold text-primary">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ==================================================
// STAGE 2: SAVINGS GOAL SIMULATOR
// ==================================================

function GoalSimulator() {
  const [values, setValues] = useState(INITIAL_GOAL)
  const [attempted, setAttempted] = useState(false)

  const errors = {
    target: amountError(values.target, 'Target tabungan', { min: 1 }),
    months: monthError(values.months),
    saved: amountError(values.saved, 'Tabungan saat ini'),
  }

  const valid = Object.values(errors).every((error) => !error)

  const target = parseAmount(values.target)
  const saved = parseAmount(values.saved)
  const months = Number(values.months)
  const remaining = Math.max(target - saved, 0)

  const requiredMonthly = months > 0
    ? Math.ceil(remaining / months)
    : 0

  const progress = target > 0
    ? Math.min((saved / target) * 100, 100)
    : 0

  const scenarios = [
    { label: 'Setoran ringan', factor: 0.8, description: '20% lebih rendah' },
    { label: 'Sesuai estimasi', factor: 1, description: 'Setoran yang dibutuhkan' },
    { label: 'Setoran lebih besar', factor: 1.2, description: '20% lebih tinggi' },
  ].map((scenario) => {
    const monthly = Math.max(1, Math.ceil(requiredMonthly * scenario.factor))
    const duration = remaining === 0 ? 0 : Math.ceil(remaining / monthly)

    return {
      ...scenario,
      monthly: remaining === 0 ? 0 : monthly,
      duration,
      date: formatDateAfterMonths(duration),
      reachesOnTime: duration <= months,
    }
  })

  function fillExample() {
    setValues({
      target: '20000000',
      months: '12',
      saved: '5000000',
    })
    setAttempted(false)
  }

  function submit(event) {
    event.preventDefault()
    setAttempted(true)
  }

  const milestones = [25, 50, 75, 100].map((percentage) => {
    const milestoneAmount = Math.ceil(target * percentage / 100)
    const gap = Math.max(milestoneAmount - saved, 0)
    const milestoneMonths = requiredMonthly > 0
      ? Math.ceil(gap / requiredMonthly)
      : 0

    return {
      percentage,
      amount: milestoneAmount,
      months: milestoneMonths,
      reached: saved >= milestoneAmount,
    }
  })

  return (
    <section aria-labelledby="goal-heading" className="card p-5 sm:p-7">
      <SectionHeading
        title="Target tabungan"
        description="Perkirakan setoran rutin, bandingkan beberapa skenario, dan lihat tahapan pencapaian target Anda."
      />

      <form className="grid gap-4" noValidate onSubmit={submit}>
        <NumberField
          id="goal-target"
          label="Target tabungan"
          value={values.target}
          onChange={updateField(setValues, 'target')}
          error={attempted ? errors.target : ''}
          hint="Masukkan jumlah yang ingin dikumpulkan."
        />

        <MonthsField
          value={values.months}
          onChange={updateField(setValues, 'months')}
          error={attempted ? errors.months : ''}
        />

        <NumberField
          id="goal-saved"
          label="Tabungan saat ini"
          value={values.saved}
          onChange={updateField(setValues, 'saved')}
          error={attempted ? errors.saved : ''}
          hint="Isi 0 jika belum mulai menabung."
        />

        <div className="flex flex-wrap gap-2 pt-1">
          <EstimateButton />
          <ExampleButton onClick={fillExample} />
        </div>
      </form>

      {attempted && valid && (
        <section
          aria-live="polite"
          aria-labelledby="goal-result-heading"
          className="mt-7 border-t border-line pt-6"
        >
          <ResultLabel>Hasil simulasi</ResultLabel>

          <h3 id="goal-result-heading" className="mt-1 text-lg font-semibold text-ink">
            {remaining === 0 ? 'Target tabungan sudah tercapai' : 'Setoran rutin yang diperlukan'}
          </h3>

          <p className="mt-2 break-all text-3xl font-bold tracking-tight text-ink">
            {currency.format(requiredMonthly)}
            <span className="text-sm font-medium text-muted"> per bulan</span>
          </p>

          <p className="mt-2 text-sm leading-6 text-muted">
            {remaining === 0
              ? `Tabungan Anda sebesar ${currency.format(saved)} sudah mencapai target ${currency.format(target)}.`
              : `Anda perlu mengumpulkan ${currency.format(remaining)} dalam ${months} bulan tanpa memperhitungkan bunga atau imbal hasil.`}
          </p>

          <div className="mt-5 rounded-2xl border border-line/40 bg-canvas/60 p-4 dark:bg-white/5">
            <p className="text-sm font-semibold text-ink">Estimasi tanggal target</p>
            <p className="mt-1 text-xl font-bold text-primary">
              {formatDateAfterMonths(months)}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Dengan asumsi mulai menabung bulan ini dan menyetor rutin setiap bulan.
            </p>
          </div>

          {/* Current progress */}
          <div className="mt-5 grid gap-2">
            <div className="flex justify-between gap-3 text-sm">
              <span className="font-medium text-ink">Kemajuan menuju target</span>
              <span className="text-muted">{Math.round(progress)}%</span>
            </div>

            <ProgressBar value={progress} label="Kemajuan menuju target tabungan" />

            <div className="flex justify-between gap-3 text-xs text-muted">
              <span>Saat ini {currency.format(saved)}</span>
              <span>Target {currency.format(target)}</span>
            </div>
          </div>

          {/* Scenario comparison */}
          {remaining > 0 && (
            <div className="mt-7">
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-ink">Perbandingan skenario setoran</h4>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Bandingkan pengaruh nominal setoran terhadap waktu pencapaian target.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {scenarios.map((scenario, index) => (
                  <div
                    key={scenario.label}
                    className={`rounded-2xl border p-4 ${
                      index === 1
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-line/40 bg-canvas/60 dark:bg-white/5'
                    }`}
                  >
                    <p className="text-xs font-semibold text-muted">{scenario.label}</p>
                    <p className="mt-2 break-all text-lg font-bold text-ink">
                      {currency.format(scenario.monthly)}
                    </p>
                    <p className="mt-1 text-xs text-muted">per bulan</p>

                    <div className="mt-4 border-t border-line/50 pt-3 dark:border-white/10">
                      <p className="text-xs text-muted">Estimasi waktu</p>
                      <p className="mt-1 text-lg font-bold text-primary">
                        {scenario.duration} bulan
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted">
                        {scenario.date}
                      </p>
                    </div>

                    <p className={`mt-3 text-xs font-semibold ${
                      scenario.reachesOnTime ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {scenario.reachesOnTime
                        ? 'Dapat tercapai sesuai target waktu'
                        : 'Melewati target waktu'}
                    </p>

                    <p className="mt-1 text-[11px] text-muted">
                      {scenario.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestones */}
          {remaining > 0 && (
            <div className="mt-7 rounded-2xl border border-line/40 bg-canvas/60 p-4 dark:bg-white/5">
              <h4 className="mb-1 text-sm font-semibold text-ink">Milestone tabungan</h4>
              <p className="mb-4 text-xs leading-5 text-muted">
                Tahapan yang perlu dilewati hingga target tabungan tercapai.
              </p>

              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.percentage} className="flex items-center gap-3">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      milestone.reached
                        ? 'bg-primary text-white'
                        : 'bg-line/40 text-muted dark:bg-white/10'
                    }`}>
                      {milestone.reached ? '✓' : `${milestone.percentage}%`}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="font-medium text-ink">
                          {currency.format(milestone.amount)}
                        </span>
                        <span className="text-xs text-muted">
                          {milestone.reached
                            ? 'Tercapai'
                            : `Estimasi ${milestone.months} bulan lagi`}
                        </span>
                      </div>

                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line/30 dark:bg-white/5">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${Math.min((saved / Math.max(milestone.amount, 1)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {remaining > 0 && (
            <div className="mt-5">
              <TipList
                title="Tips mencapai target"
                items={[
                  ...(requiredMonthly > 5000000
                    ? ['Setoran cukup besar. Pertimbangkan auto-debit agar lebih konsisten.']
                    : []),
                  ...(months >= 12
                    ? ['Naikkan setoran saat menerima bonus untuk mempercepat target.']
                    : []),
                  ...(saved === 0
                    ? ['Mulai dari jumlah kecil dan tingkatkan secara bertahap.']
                    : []),
                  'Pisahkan rekening tabungan agar tidak tercampur dengan uang harian.',
                ]}
              />
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-muted">
            Asumsi: jumlah setoran sama setiap bulan dan tidak ada bunga atau imbal hasil. Hasil ini perkiraan, bukan jaminan.
          </p>
        </section>
      )}
    </section>
  )
}

// ==================================================
// STAGE 2: FLEXIBLE BUDGET 50/30/20
// ==================================================

function Budget503020Simulator() {
  const [values, setValues] = useState(INITIAL_BUDGET)
  const [attempted, setAttempted] = useState(false)
  const [showAnnual, setShowAnnual] = useState(false)

  const incomeError = amountError(values.income, 'Pendapatan bulanan', { min: 1 })

  const percentages = {
    needs: Number(values.needsPercent),
    wants: Number(values.wantsPercent),
    savings: Number(values.savingsPercent),
  }

  const percentageTotal =
    percentages.needs + percentages.wants + percentages.savings

  const percentagesValid =
    Object.values(percentages).every(
      (value) => Number.isInteger(value) && value >= 0 && value <= 100
    ) && percentageTotal === 100

  const percentageError = !percentagesValid
    ? `Total persentase harus tepat 100%. Saat ini ${percentageTotal}%.`
    : ''

  const valid = !incomeError && percentagesValid
  const income = parseAmount(values.income)

  const budget = income > 0 && percentagesValid
    ? calculateBudget(income, percentages)
    : null

  const insights = budget
    ? getBudgetInsight(income, budget, percentages)
    : []

  const tips = income > 0 ? getTipsForIncome(income) : []

  const annualBudget = budget
    ? {
        needs: budget.needs * 12,
        wants: budget.wants * 12,
        savings: budget.savings * 12,
      }
    : null

  function fillExample() {
    setValues({
      income: '10000000',
      needsPercent: '50',
      wantsPercent: '30',
      savingsPercent: '20',
    })
    setAttempted(false)
    setShowAnnual(false)
  }

  function applyPreset(needs, wants, savings) {
    setValues((current) => ({
      ...current,
      needsPercent: String(needs),
      wantsPercent: String(wants),
      savingsPercent: String(savings),
    }))
    setAttempted(false)
  }

  function submit(event) {
    event.preventDefault()
    setAttempted(true)
  }

  function updatePercentage(field) {
    return (event) => {
      const digits = event.target.value.replace(/\D/g, '').slice(0, 3)

      setValues((current) => ({
        ...current,
        [field]: digits,
      }))
    }
  }

  const displayValue = (monthly, annual) =>
    currency.format(showAnnual ? annual : monthly)

  return (
    <section aria-labelledby="budget-heading" className="card p-5 sm:p-7">
      <SectionHeading
        title="Anggaran fleksibel"
        description="Atur pembagian pendapatan untuk kebutuhan, keinginan, dan tabungan sesuai kondisi keuangan Anda."
      />

      <form className="grid gap-4" noValidate onSubmit={submit}>
        <NumberField
          id="budget-income"
          label="Pendapatan bulanan bersih"
          value={values.income}
          onChange={updateField(setValues, 'income')}
          error={attempted ? incomeError : ''}
          hint="Masukkan penghasilan setelah potongan."
        />

        <div className="rounded-2xl border border-line/40 bg-canvas/60 p-4 dark:bg-white/5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-ink">Atur persentase anggaran</h3>
            <p className="mt-1 text-xs leading-5 text-muted">
              Sesuaikan setiap kategori. Total ketiganya harus tepat 100%.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                field: 'needsPercent',
                label: 'Kebutuhan',
                color: 'text-blue-600',
                border: 'focus-within:border-blue-500',
              },
              {
                field: 'wantsPercent',
                label: 'Keinginan',
                color: 'text-amber-600',
                border: 'focus-within:border-amber-500',
              },
              {
                field: 'savingsPercent',
                label: 'Tabungan',
                color: 'text-emerald-600',
                border: 'focus-within:border-emerald-500',
              },
            ].map((item) => (
              <div key={item.field} className="grid gap-1.5">
                <label className={`text-sm font-semibold ${item.color}`}>
                  {item.label}
                </label>

                <div className={`flex overflow-hidden rounded-xl border border-line bg-surface dark:border-white/15 dark:bg-white/5 ${item.border}`}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    inputMode="numeric"
                    value={values[item.field]}
                    onChange={updatePercentage(item.field)}
                    aria-label={`Persentase ${item.label}`}
                    className="min-h-11 w-full min-w-0 bg-transparent px-3 text-sm font-semibold text-ink outline-none"
                  />
                  <span className="flex items-center border-l border-line px-3 text-sm text-muted dark:border-white/15">
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-3 rounded-xl border p-3 text-sm ${
            percentagesValid
              ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600'
              : 'border-amber-500/20 bg-amber-500/5 text-amber-600'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">Total alokasi</span>
              <span className="font-bold">{percentageTotal}% / 100%</span>
            </div>
            {attempted && percentageError && (
              <p className="mt-1 text-xs" role="alert">{percentageError}</p>
            )}
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-muted">Preset pembagian</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '50 / 30 / 20', values: [50, 30, 20] },
                { label: '60 / 20 / 20', values: [60, 20, 20] },
                { label: '40 / 20 / 40', values: [40, 20, 40] },
                { label: '40 / 30 / 30', values: [40, 30, 30] },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(...preset.values)}
                  aria-pressed={
                    percentages.needs === preset.values[0] &&
                    percentages.wants === preset.values[1] &&
                    percentages.savings === preset.values[2]
                  }
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    percentages.needs === preset.values[0] &&
                    percentages.wants === preset.values[1] &&
                    percentages.savings === preset.values[2]
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-line bg-surface text-muted hover:border-primary/50 hover:text-ink dark:border-white/15 dark:bg-white/5'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <EstimateButton />
          <ExampleButton onClick={fillExample} />
        </div>
      </form>

      {attempted && valid && budget && (
        <section
          aria-live="polite"
          aria-labelledby="budget-result-heading"
          className="mt-7 border-t border-line pt-6"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <ResultLabel>Hasil perhitungan</ResultLabel>
              <h3 id="budget-result-heading" className="mt-1 text-lg font-semibold text-ink">
                Alokasi anggaran Anda
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowAnnual((current) => !current)}
              className="text-xs font-semibold text-primary transition-colors hover:text-primary/80"
            >
              {showAnnual ? 'Lihat bulanan' : 'Lihat tahunan'}
            </button>
          </div>

          {/* Dynamic chart */}
          <div className="mb-6">
            <div className="flex h-8 overflow-hidden rounded-2xl shadow-sm">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                style={{ width: `${percentages.needs}%` }}
                title={`Kebutuhan ${percentages.needs}%`}
              />
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                style={{ width: `${percentages.wants}%` }}
                title={`Keinginan ${percentages.wants}%`}
              />
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 transition-all"
                style={{ width: `${percentages.savings}%` }}
                title={`Tabungan ${percentages.savings}%`}
              />
            </div>

            <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-muted">
              <span>{percentages.needs}% Kebutuhan</span>
              <span>{percentages.wants}% Keinginan</span>
              <span>{percentages.savings}% Tabungan</span>
            </div>
          </div>

          {/* Category cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-4 transition-all hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-blue-500/20 text-blue-600">⌂</span>
                <span className="text-sm font-semibold text-blue-600">Kebutuhan</span>
              </div>
              <p className="break-all text-2xl font-bold text-ink">
                {displayValue(budget.needs, annualBudget.needs)}
              </p>
              <p className="mt-1 text-xs text-muted">
                {showAnnual ? 'per tahun' : 'per bulan'} ({percentages.needs}%)
              </p>
              <ul className="mt-3 space-y-1 text-xs text-muted">
                <li>• Sewa/KPR</li>
                <li>• Makan dan groceries</li>
                <li>• Transportasi</li>
                <li>• Tagihan dan utilitas</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-orange-500/5 p-4 transition-all hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-amber-400/20 text-amber-600">☺</span>
                <span className="text-sm font-semibold text-amber-600">Keinginan</span>
              </div>
              <p className="break-all text-2xl font-bold text-ink">
                {displayValue(budget.wants, annualBudget.wants)}
              </p>
              <p className="mt-1 text-xs text-muted">
                {showAnnual ? 'per tahun' : 'per bulan'} ({percentages.wants}%)
              </p>
              <ul className="mt-3 space-y-1 text-xs text-muted">
                <li>• Hiburan dan hobi</li>
                <li>• Makan di luar</li>
                <li>• Langganan streaming</li>
                <li>• Belanja non-esensial</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-600/5 p-4 transition-all hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-600">↗</span>
                <span className="text-sm font-semibold text-emerald-600">Tabungan</span>
              </div>
              <p className="break-all text-2xl font-bold text-ink">
                {displayValue(budget.savings, annualBudget.savings)}
              </p>
              <p className="mt-1 text-xs text-muted">
                {showAnnual ? 'per tahun' : 'per bulan'} ({percentages.savings}%)
              </p>
              <ul className="mt-3 space-y-1 text-xs text-muted">
                <li>• Dana darurat</li>
                <li>• Investasi</li>
                <li>• Tabungan pensiun</li>
                <li>• Tujuan keuangan</li>
              </ul>
            </div>
          </div>

          {/* Insights */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold text-ink">Analisis anggaran</h4>
            <div className="grid gap-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`flex gap-3 rounded-xl border p-3 ${
                    insight.type === 'success'
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : insight.type === 'warning'
                        ? 'border-amber-500/20 bg-amber-500/5'
                        : 'border-blue-500/20 bg-blue-500/5'
                  }`}
                >
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    insight.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-600'
                      : insight.type === 'warning'
                        ? 'bg-amber-500/20 text-amber-600'
                        : 'bg-blue-500/20 text-blue-600'
                  }`}>
                    {insight.type === 'success' ? '✓' : insight.type === 'warning' ? '!' : 'i'}
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-muted">{insight.category}</p>
                    <p className="text-sm font-medium text-ink">{insight.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <TipList title="Tips sesuai pendapatan Anda" items={tips} />

          <p className="mt-4 text-xs leading-5 text-muted">
            Aturan 50/30/20 merupakan panduan umum. Anda dapat menyesuaikan persentase sesuai biaya hidup, tanggungan, dan tujuan keuangan.
          </p>
        </section>
      )}
    </section>
  )
}

// ==================================================
// EMERGENCY FUND SIMULATOR
// ==================================================

function EmergencySimulator() {
  const [values, setValues] = useState(INITIAL_EMERGENCY)
  const [attempted, setAttempted] = useState(false)

  const errors = {
    needs: amountError(values.needs, 'Kebutuhan bulanan', { min: 1 }),
    saved: amountError(values.saved, 'Dana darurat saat ini'),
    monthlySaving: amountError(values.monthlySaving, 'Alokasi tabungan per bulan'),
    targetMonths: monthError(values.targetMonths),
  }

  const valid = Object.values(errors).every((error) => !error)

  const needs = parseAmount(values.needs)
  const saved = parseAmount(values.saved)
  const monthlySaving = parseAmount(values.monthlySaving)
  const targetMonths = Number(values.targetMonths)

  const target = needs * targetMonths
  const remaining = Math.max(target - saved, 0)

  const progress = target > 0
    ? Math.min((saved / target) * 100, 100)
    : 0

  const estimatedMonths = monthsToTarget(target, saved, monthlySaving)

  const targetOptions = [3, 6, 9, 12]

  function fillExample() {
    setValues({
      needs: '5000000',
      saved: '10000000',
      monthlySaving: '1000000',
      targetMonths: '6',
    })
    setAttempted(false)
  }

  function submit(event) {
    event.preventDefault()
    setAttempted(true)
  }

  return (
    <section aria-labelledby="emergency-heading" className="card p-5 sm:p-7">
      <SectionHeading
        title="Dana darurat"
        description="Hitung kebutuhan dana darurat dan perkirakan waktu untuk mencapainya."
      />

      <form className="grid gap-4" noValidate onSubmit={submit}>
        <NumberField
          id="emergency-needs"
          label="Kebutuhan bulanan"
          value={values.needs}
          onChange={updateField(setValues, 'needs')}
          error={attempted ? errors.needs : ''}
          hint="Perkiraan biaya penting dalam satu bulan."
        />

        <NumberField
          id="emergency-saved"
          label="Dana darurat saat ini"
          value={values.saved}
          onChange={updateField(setValues, 'saved')}
          error={attempted ? errors.saved : ''}
          hint="Isi 0 jika belum memiliki dana darurat."
        />

        <NumberField
          id="emergency-monthly-saving"
          label="Alokasi tabungan per bulan"
          value={values.monthlySaving}
          onChange={updateField(setValues, 'monthlySaving')}
          error={attempted ? errors.monthlySaving : ''}
          hint="Isi 0 jika belum bisa menentukan alokasi."
        />

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-ink">Target dana darurat</label>
          <p className="text-xs leading-5 text-muted">
            Standar awal yang umum digunakan adalah 3–6 bulan kebutuhan. Pilih target lebih panjang jika penghasilan tidak tetap atau memiliki banyak tanggungan.
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {targetOptions.map((month) => (
              <button
                key={month}
                type="button"
                onClick={() => setValues((current) => ({
                  ...current,
                  targetMonths: String(month),
                }))}
                aria-pressed={Number(values.targetMonths) === month}
                className={`rounded-xl border px-3 py-3 text-center transition-all ${
                  Number(values.targetMonths) === month
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-line bg-surface text-muted hover:border-primary/50 hover:text-ink dark:border-white/15 dark:bg-white/5'
                }`}
              >
                <span className="block text-lg font-bold">{month}</span>
                <span className="text-xs font-medium">bulan</span>
                {month === 6 && (
                  <span className="mt-1 block text-[10px] font-semibold">Rekomendasi</span>
                )}
              </button>
            ))}
          </div>

          {attempted && errors.targetMonths && (
            <p className="text-sm text-muted" role="alert">{errors.targetMonths}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <EstimateButton />
          <ExampleButton onClick={fillExample} />
        </div>
      </form>

      {attempted && valid && (
        <section
          aria-live="polite"
          aria-labelledby="emergency-result-heading"
          className="mt-7 border-t border-line pt-6"
        >
          <ResultLabel>Hasil simulasi</ResultLabel>

          <h3 id="emergency-result-heading" className="mt-1 text-lg font-semibold text-ink">
            Target dana darurat Anda
          </h3>

          <p className="mt-2 break-all text-2xl font-bold tracking-tight text-ink">
            {currency.format(target)}
          </p>

          <p className="mt-1 text-sm text-muted">
            Setara {targetMonths} bulan kebutuhan.
          </p>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-ink">Posisi dana saat ini</h4>
              <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
            </div>

            <ProgressBar value={progress} label="Progress dana darurat" />

            <div className="mt-2 flex justify-between gap-3 text-xs text-muted">
              <span>{currency.format(saved)}</span>
              <span>{currency.format(target)}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-line/40 bg-canvas/60 p-3 dark:bg-white/5">
                <p className="text-xs text-muted">Dana terkumpul</p>
                <p className="mt-1 break-all text-sm font-semibold text-ink">{currency.format(saved)}</p>
              </div>

              <div className="rounded-xl border border-line/40 bg-canvas/60 p-3 dark:bg-white/5">
                <p className="text-xs text-muted">Kekurangan dana</p>
                <p className="mt-1 break-all text-sm font-semibold text-ink">{currency.format(remaining)}</p>
              </div>
            </div>
          </div>

          <div className={`mt-6 rounded-2xl border p-4 ${
            saved >= target
              ? 'border-emerald-500/20 bg-emerald-500/5'
              : 'border-line/40 bg-canvas/60 dark:border-white/10 dark:bg-white/5'
          }`}>
            <div className="flex items-start gap-3">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full ${
                saved >= target
                  ? 'bg-emerald-500/20 text-emerald-600'
                  : 'bg-line/40 text-muted dark:bg-white/10'
              }`}>
                {saved >= target ? '✓' : '○'}
              </span>

              <div>
                <h4 className="text-sm font-semibold text-ink">
                  {saved >= target
                    ? 'Target dana darurat tercapai!'
                    : 'Target dana darurat belum tercapai'}
                </h4>

                <p className="mt-1 text-sm text-muted">
                  {saved >= target
                    ? `Dana saat ini setara dengan ${Math.floor(saved / needs)} bulan kebutuhan. Pertahankan dana tersebut.`
                    : saved > 0
                      ? `Dana saat ini setara dengan ${Math.round((saved / needs) * 10) / 10} bulan kebutuhan. Masih perlu mengumpulkan ${currency.format(remaining)}.`
                      : 'Mulai menabung sekarang, meskipun dengan jumlah kecil.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-line/40 bg-canvas/60 p-4 dark:bg-white/5">
            <h4 className="text-sm font-semibold text-ink">Perkiraan waktu mencapai target</h4>

            {estimatedMonths === 0 ? (
              <p className="mt-2 text-lg font-bold text-emerald-600">Target sudah tercapai</p>
            ) : estimatedMonths === null ? (
              <>
                <p className="mt-2 text-lg font-bold text-ink">Belum dapat dihitung</p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Masukkan alokasi tabungan bulanan lebih dari Rp0 untuk menghitung estimasi waktu.
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-2xl font-bold text-primary">{estimatedMonths} bulan lagi</p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Perkiraan tanggal: {formatDateAfterMonths(estimatedMonths)}.
                </p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Dengan setoran rutin {currency.format(monthlySaving)} per bulan.
                </p>
              </>
            )}
          </div>

          <div className="mt-5">
            <TipList
              title="Tips dana darurat"
              items={[
                'Simpan di rekening terpisah agar tidak tercampur dengan uang kebutuhan sehari-hari.',
                'Pilih tempat penyimpanan yang mudah dicairkan ketika dibutuhkan.',
                ...(saved < target
                  ? ['Usahakan menyisihkan dana secara rutin setiap bulan.']
                  : ['Target sudah tercapai. Evaluasi kembali jika kebutuhan bulanan berubah.']),
              ]}
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-muted">
            Asumsi: kebutuhan bulanan dan alokasi tabungan tetap, tanpa bunga atau imbal hasil. Hasil ini perkiraan, bukan jaminan.
          </p>
        </section>
      )}
    </section>
  )
}

// ==================================================
// SIMULATOR PAGE
// ==================================================

function SimulatorPage() {
  const [activeCalculator, setActiveCalculator] = useState('goal')

  return (
    <div className="dashboard-layout simulator-layout">
      <DashboardSidebar page="simulator" />

      <div className="dashboard-workspace simulator-workspace">
        <main className="dashboard-main simulator-main">
          <div className="mx-auto w-full max-w-6xl py-3">
            <GlobalHeader
              title="Simulator"
              showDateLine={false}
            />

            <div className="mb-6">
              <GooeyNav
                items={[
                  { id: 'budget', label: '50/30/20 Anggaran' },
                  { id: 'goal', label: 'Target tabungan' },
                  { id: 'emergency', label: 'Dana darurat' },
                ]}
                activeId={activeCalculator}
                onChange={setActiveCalculator}
                size="md"
                className="w-full sm:w-auto"
              />
            </div>

            <div className="simulator-calculators">
              <div
                className="simulator-calculator-panel"
                hidden={activeCalculator !== 'budget'}
              >
                <Budget503020Simulator />
              </div>

              <div
                className="simulator-calculator-panel"
                hidden={activeCalculator !== 'goal'}
              >
                <GoalSimulator />
              </div>

              <div
                className="simulator-calculator-panel"
                hidden={activeCalculator !== 'emergency'}
              >
                <EmergencySimulator />
              </div>
            </div>

            <footer className="mt-8 border-t border-line pt-5 text-sm leading-6 text-muted">
              Simulator ini untuk edukasi. Hasil bergantung pada angka yang Anda masukkan, tidak memperhitungkan bunga atau imbal hasil, dan bukan jaminan hasil.
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}

mountPage(() => (
  <ProtectedPage>
    <SimulatorPage />
  </ProtectedPage>
), { effects: true })
