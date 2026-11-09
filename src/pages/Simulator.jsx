
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
  months: '',
  saved: '',
}

const INITIAL_EMERGENCY = {
  needs: '',
  saved: '',
  monthlySaving: '',
}

const INITIAL_BUDGET_503020 = {
  income: '',
}

// ==================================================
// HELPER FUNCTIONS
// ==================================================

function calculateBudget503020(income) {
  const needs = Math.round(income * 0.5)
  const wants = Math.round(income * 0.3)
  const savings = Math.round(income * 0.2)
  return { needs, wants, savings, total: income }
}

function getBudgetInsight(income) {
  const insights = []
  
  if (income <= 0) return insights
  
  const budget = calculateBudget503020(income)
  
  // Needs insight
  if (budget.needs < 3000000) {
    insights.push({
      type: 'info',
      category: 'Kebutuhan',
      title: 'Pengeluaran dasar terjangkau',
      description: `Alokasi ${currency.format(budget.needs)} untuk kebutuhan seperti sewa, makan, dan transportasi. Pertimbangkan gaya hidup hemat jika baru mulai bekerja.`
    })
  } else if (budget.needs > 15000000) {
    insights.push({
      type: 'warning',
      category: 'Kebutuhan',
      title: 'Perhatikan pengeluaran tetap',
      description: `Alokasi ${currency.format(budget.needs)} cukup besar. Pastikan tidak lebih dari 50% pendapatan untuk kebutuhan tetap.`
    })
  } else {
    insights.push({
      type: 'success',
      category: 'Kebutuhan',
      title: 'Alokasi kebutuhan ideal',
      description: `${currency.format(budget.needs)} dialokasikan untuk kebutuhan pokok bulanan.`
    })
  }
  
  // Wants insight
  if (budget.wants > 5000000) {
    insights.push({
      type: 'info',
      category: 'Keinginan',
      title: 'Siap menabung untuk tujuan besar',
      description: `Dengan ${currency.format(budget.wants)} untuk keinginan, Anda bisa menabung untuk liburan atau gadget impian.`
    })
  } else {
    insights.push({
      type: 'success',
      category: 'Keinginan',
      title: 'Dana hiburan tersedia',
      description: `${currency.format(budget.wants)} bisa digunakan untuk hiburan, makan di luar, atau hobi.`
    })
  }
  
  // Savings insight
  if (budget.savings >= 10000000) {
    insights.push({
      type: 'success',
      category: 'Tabungan',
      title: 'Potensi tabungan besar',
      description: `${currency.format(budget.savings)} per bulan = ${currency.format(budget.savings * 12)} per tahun. Dalam 5 tahun bisa mencapai ${currency.format(budget.savings * 60)}!`
    })
  } else if (budget.savings >= 3000000) {
    insights.push({
      type: 'success',
      category: 'Tabungan',
      title: 'Konsisten menabung',
      description: `${currency.format(budget.savings)} per bulan akan menjadi ${currency.format(budget.savings * 12)} dalam setahun. Pertahankan!`
    })
  } else {
    insights.push({
      type: 'info',
      category: 'Tabungan',
      title: 'Mulai kebiasaan menabung',
      description: `${currency.format(budget.savings)} per bulan adalah langkah awal yang baik. Tingkatkan bila memungkinkan.`
    })
  }
  
  return insights
}

function getTipsForIncome(income) {
  const tips = []
  
  if (income <= 5000000) {
    tips.push('Prioritaskan kebutuhan dasar: makan, tempat tinggal, transportasi.')
    tips.push('Cari cara kreatif untuk hiburan gratis atau murah.')
    tips.push('Mulai dana darurat minimal 1 bulan kebutuhan.')
  } else if (income <= 10000000) {
    tips.push('Tingkatkan dana darurat ke 3-6 bulan kebutuhan.')
    tips.push('Pertimbangkan investasi reksa dana atau deposito.')
    tips.push('Hindari gaya hidup yang mengikuti kenaikan gaji.')
  } else if (income <= 20000000) {
    tips.push('Maksimalkan tabungan dan investasi.')
    tips.push('Pertimbangkan diversifikasi: saham, properti, emas.')
    tips.push('Review pengeluaran besar secara berkala.')
  } else {
    tips.push('Optimalkan portofolio investasi Anda.')
    tips.push('Pertimbangkan konsultasi dengan perencana keuangan.')
    tips.push('Berbagi keberuntungan: zakat atau donasi.')
  }
  
  return tips
}

// ==================================================
// VALIDATION
// ==================================================

function amountError(
  value,
  label,
  { required = true, min = 0 } = {}
) {
  if (value === '') {
    return required ? `${label} perlu diisi.` : ''
  }

  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return `${label} harus berupa angka yang valid.`
  }

  if (!Number.isInteger(amount)) {
    return `${label} harus berupa jumlah rupiah bulat.`
  }

  if (amount < min) {
    return `${label} harus lebih dari Rp0.`
  }

  if (amount > MAX_AMOUNT) {
    return `${label} maksimal Rp1.000.000.000.000.000.`
  }

  return ''
}

function monthError(value) {
  if (value === '') {
    return 'Jangka waktu perlu diisi.'
  }

  const months = Number(value)

  if (!Number.isInteger(months) || months < 1) {
    return 'Masukkan jangka waktu minimal 1 bulan.'
  }

  if (months > MAX_MONTHS) {
    return `Jangka waktu maksimal ${MAX_MONTHS} bulan.`
  }

  return ''
}

// ==================================================
// NUMBER FIELD
// ==================================================

function NumberField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  min = 0,
  max = MAX_AMOUNT,
  step = 1,
}) {
  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-ink"
      >
        {label}
      </label>

      <div className="flex overflow-hidden rounded-xl border border-line dark:border-white/15 bg-surface/80 dark:bg-white/5 focus-within:border-primary dark:focus-within:border-primary-text focus-within:ring-2 focus-within:ring-primary/20 backdrop-blur-sm transition-all duration-200">
        <span
          className="flex items-center border-r border-line dark:border-white/15 px-3 text-sm text-muted dark:text-slate-400 bg-canvas/40 dark:bg-white/5 font-medium"
          aria-hidden="true"
        >
          Rp
        </span>

        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${id}-error`
              : hint
                ? `${id}-hint`
                : undefined
          }
          className="min-h-11 w-full min-w-0 bg-transparent px-3 py-2 text-sm text-ink outline-none"
        />
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          className="text-sm text-muted"
          role="alert"
        >
          {error}
        </p>
      ) : (
        hint && (
          <p
            id={`${id}-hint`}
            className="text-xs text-muted"
          >
            {hint}
          </p>
        )
      )}
    </div>
  )
}

// ==================================================
// MONTHS FIELD
// ==================================================

function MonthsField({
  value,
  onChange,
  error,
}) {
  return (
    <div className="grid gap-1.5">
      <label
        htmlFor="goal-months"
        className="text-sm font-semibold text-ink"
      >
        Jangka waktu
      </label>

      <div className="flex overflow-hidden rounded-xl border border-line dark:border-white/15 bg-surface/80 dark:bg-white/5 focus-within:border-primary dark:focus-within:border-primary-text focus-within:ring-2 focus-within:ring-primary/20 backdrop-blur-sm transition-all duration-200">
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
          aria-describedby={
            error
              ? 'goal-months-error'
              : 'goal-months-hint'
          }
          className="min-h-11 w-full min-w-0 bg-transparent px-3 py-2 text-sm text-ink outline-none"
        />

        <span className="flex items-center border-l border-line dark:border-white/15 px-3 text-sm text-muted dark:text-slate-400 bg-canvas/40 dark:bg-white/5 font-medium">
          bulan
        </span>
      </div>

      {error ? (
        <p
          id="goal-months-error"
          className="text-sm text-muted"
          role="alert"
        >
          {error}
        </p>
      ) : (
        <p
          id="goal-months-hint"
          className="text-xs text-muted"
        >
          Pilih 1 sampai {MAX_MONTHS} bulan.
        </p>
      )}
    </div>
  )
}

// ==================================================
// SUBMIT BUTTON
// ==================================================

function EstimateButton() {
  return (
    <button
      type="submit"
      className="btn-primary dashboard-primary-action min-h-11 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary inline-flex items-center justify-center cursor-pointer"
    >
      Hitung estimasi
    </button>
  )
}

// ==================================================
// SAVINGS GOAL SIMULATOR
// ==================================================

function GoalSimulator() {
  const [values, setValues] = useState(INITIAL_GOAL)
  const [attempted, setAttempted] = useState(false)

  const errors = {
    target: amountError(
      values.target,
      'Target tabungan',
      { min: 1 }
    ),

    months: monthError(values.months),

    saved: amountError(
      values.saved,
      'Tabungan saat ini'
    ),
  }

  const valid = Object.values(errors).every(
    (error) => !error
  )

  const target = Number(values.target)
  const saved = Number(values.saved)
  const months = Number(values.months)

  const remaining = Math.max(target - saved, 0)

  const monthlyAmount = months
    ? Math.ceil(remaining / months)
    : 0

  const progress = target > 0
    ? Math.min((saved / target) * 100, 100)
    : 0

  function update(field) {
    return (event) => {
      setValues((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }
  }

  function submit(event) {
    event.preventDefault()
    setAttempted(true)
  }

  return (
    <section
      aria-labelledby="goal-heading"
      className="card p-5 sm:p-7"
    >
      <div className="mb-6">
        <h2
          id="goal-heading"
          className="text-xl font-semibold text-ink"
        >
          Target tabungan
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Perkirakan setoran rutin yang diperlukan untuk mencapai target.
        </p>
      </div>

      <form
        className="grid gap-4"
        noValidate
        onSubmit={submit}
      >
        <NumberField
          id="goal-target"
          label="Target tabungan"
          value={values.target}
          onChange={update('target')}
          error={attempted ? errors.target : ''}
          hint="Masukkan jumlah yang ingin dikumpulkan."
          min="1"
        />

        <MonthsField
          value={values.months}
          onChange={update('months')}
          error={attempted ? errors.months : ''}
        />

        <NumberField
          id="goal-saved"
          label="Tabungan saat ini"
          value={values.saved}
          onChange={update('saved')}
          error={attempted ? errors.saved : ''}
          hint="Isi 0 jika belum mulai menabung."
        />

        <div className="pt-1">
          <EstimateButton />
        </div>
      </form>

      {attempted && valid && (
        <section
          aria-live="polite"
          aria-labelledby="goal-result-heading"
          className="mt-7 border-t border-line pt-6"
        >
          <p className="text-sm font-semibold text-primary">
            Estimasi
          </p>

          <h3
            id="goal-result-heading"
            className="mt-1 text-lg font-semibold text-ink"
          >
            {remaining === 0
              ? 'Target tabungan sudah tercapai'
              : 'Setoran rutin yang diperlukan'}
          </h3>

          <p className="mt-2 break-all text-3xl font-bold tracking-tight text-ink">
            {currency.format(monthlyAmount)}{' '}
            <span className="text-sm font-medium text-muted">
              per bulan
            </span>
          </p>

          <p className="mt-2 text-sm leading-6 text-muted">
            {remaining === 0
              ? `Tabungan saat ini ${currency.format(saved)} sudah mencapai atau melebihi target ${currency.format(target)}.`
              : `Perlu mengumpulkan ${currency.format(remaining)} dalam ${months} bulan, tanpa memperhitungkan bunga atau imbal hasil.`}
          </p>

          {/* Progress Visual */}
          <div className="mt-5 grid gap-2">
            <div className="flex justify-between gap-3 text-sm">
              <span className="font-medium text-ink">
                Kemajuan menuju target
              </span>

              <span className="text-muted">
                {Math.round(progress)}%
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Kemajuan menuju target tabungan"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={Math.round(progress)}
              className="h-4 overflow-hidden rounded-full bg-canvas dark:bg-white/10 shadow-inner"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between gap-3 text-xs text-muted">
              <span>Saat ini {currency.format(saved)}</span>
              <span>Target {currency.format(target)}</span>
            </div>
          </div>

          {/* Timeline Visualization */}
          {remaining > 0 && months > 0 && (
            <div className="mt-6 p-4 rounded-2xl bg-canvas/60 dark:bg-white/5 border border-line/40">
              <h4 className="text-sm font-semibold text-ink mb-3">Timeline pencapaian</h4>
              <div className="space-y-2">
                {[25, 50, 75, 100].map((percentage) => {
                  const amountAtPoint = Math.round(saved + (remaining * percentage / 100))
                  const monthsAtPoint = Math.ceil((amountAtPoint - saved) / monthlyAmount)
                  const isPast = progress >= percentage
                  return (
                    <div key={percentage} className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isPast ? 'bg-primary text-white' : 'bg-line/40 dark:bg-white/10 text-muted'}`}>
                        {percentage}%
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-ink">{currency.format(amountAtPoint)}</span>
                          <span className="text-muted text-xs">
                            {percentage === 100 ? `${months} bulan` : `~${monthsAtPoint} bulan`}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-line/30 dark:bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isPast ? 'bg-primary' : 'bg-line dark:bg-white/20'}`}
                            style={{ width: isPast ? '100%' : `${(progress / percentage) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Insights */}
          {remaining > 0 && (
            <div className="mt-5 p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <h4 className="text-sm font-semibold text-ink mb-2">💡 Tips mencapai target</h4>
              <ul className="space-y-1.5 text-sm text-muted">
                {monthlyAmount > 5000000 && (
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Setoran besar seperti ini perlu komitmen kuat. Pertimbangkan auto-debit dari gaji.</span>
                  </li>
                )}
                {months >= 12 && (
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Jangka panjang berarti lebih fleksibel. Naikkan setoran saat ada bonus untuk mempercepat.</span>
                  </li>
                )}
                {months < 6 && remaining > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Target jangka pendek: pastikan dana tidak terpakai untuk kebutuhan lain.</span>
                  </li>
                )}
                {saved === 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Memulai dari nol? Mulai dengan jumlah kecil dan tingkatkan bertahap.</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Pisahkan akun tabungan khusus untuk target ini agar tidak tercampur.</span>
                </li>
              </ul>
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-muted">
            Asumsi: jumlah setoran sama setiap bulan dan tidak ada
            bunga atau imbal hasil. Hasil ini perkiraan, bukan jaminan.
          </p>
        </section>
      )}
    </section>
  )
}

// ==================================================
// BUDGET 50/30/20 SIMULATOR
// ==================================================

function Budget503020Simulator() {
  const [values, setValues] = useState(INITIAL_BUDGET_503020)
  const [attempted, setAttempted] = useState(false)
  const [showAnnual, setShowAnnual] = useState(false)

  const errors = {
    income: amountError(
      values.income,
      'Pendapatan bulanan',
      { min: 1 }
    ),
  }

  const valid = Object.values(errors).every((error) => !error)

  const income = Number(values.income)
  const budget = income > 0 ? calculateBudget503020(income) : null
  const insights = income > 0 ? getBudgetInsight(income) : []
  const tips = income > 0 ? getTipsForIncome(income) : []

  function update(field) {
    return (event) => {
      setValues((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }
  }

  function submit(event) {
    event.preventDefault()
    setAttempted(true)
  }

  const annualBudget = budget ? {
    needs: budget.needs * 12,
    wants: budget.wants * 12,
    savings: budget.savings * 12,
  } : null

  return (
    <section
      aria-labelledby="budget-heading"
      className="card p-5 sm:p-7"
    >
      <div className="mb-6">
        <h2
          id="budget-heading"
          className="text-xl font-semibold text-ink"
        >
          Anggaran 50/30/20
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Atur pengeluaran dengan cara sederhana: 50% kebutuhan, 30% keinginan, 20% tabungan.
        </p>
      </div>

      <form
        className="grid gap-4"
        noValidate
        onSubmit={submit}
      >
        <NumberField
          id="budget-income"
          label="Pendapatan bulanan bersih"
          value={values.income}
          onChange={update('income')}
          error={attempted ? errors.income : ''}
          hint="Masukkan penghasilan setelah potongan."
          min="1"
        />

        <div className="pt-1">
          <EstimateButton />
        </div>
      </form>

      {attempted && valid && budget && (
        <section
          aria-live="polite"
          aria-labelledby="budget-result-heading"
          className="mt-7 border-t border-line pt-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-primary">
                Hasil perhitungan
              </p>
              <h3
                id="budget-result-heading"
                className="mt-1 text-lg font-semibold text-ink"
              >
                Alokasi anggaran Anda
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAnnual(!showAnnual)}
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {showAnnual ? 'Lihat bulanan' : 'Lihat tahunan'}
            </button>
          </div>

          {/* Visual Chart */}
          <div className="mb-6">
            <div className="flex h-8 overflow-hidden rounded-2xl shadow-sm">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: '50%' }}
                title="Kebutuhan 50%"
              />
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                style={{ width: '30%' }}
                title="Keinginan 30%"
              />
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                style={{ width: '20%' }}
                title="Tabungan 20%"
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted">
              <span>50% Kebutuhan</span>
              <span>30% Keinginan</span>
              <span>20% Tabungan</span>
            </div>
          </div>

          {/* Budget Cards */}
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            {/* Needs Card */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="grid size-8 place-items-center rounded-xl bg-blue-500/20 text-blue-600">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </span>
                <span className="text-sm font-semibold text-blue-600">Kebutuhan</span>
              </div>
              <p className="text-2xl font-bold text-ink break-all">
                {currency.format(showAnnual ? annualBudget.needs : budget.needs)}
              </p>
              <p className="text-xs text-muted mt-1">
                {showAnnual ? 'per tahun (50%)' : 'per bulan (50%)'}
              </p>
              <ul className="mt-3 space-y-1 text-xs text-muted">
                <li>• Sewa/KPR</li>
                <li>• Makan & groceries</li>
                <li>• Transportasi</li>
                <li>• Tagihan & utilitas</li>
              </ul>
            </div>

            {/* Wants Card */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-500/5 border border-amber-400/20 p-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="grid size-8 place-items-center rounded-xl bg-amber-400/20 text-amber-600">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </span>
                <span className="text-sm font-semibold text-amber-600">Keinginan</span>
              </div>
              <p className="text-2xl font-bold text-ink break-all">
                {currency.format(showAnnual ? annualBudget.wants : budget.wants)}
              </p>
              <p className="text-xs text-muted mt-1">
                {showAnnual ? 'per tahun (30%)' : 'per bulan (30%)'}
              </p>
              <ul className="mt-3 space-y-1 text-xs text-muted">
                <li>• Hiburan & hobi</li>
                <li>• Makan di luar</li>
                <li>• Langganan streaming</li>
                <li>• Shopping non-esensial</li>
              </ul>
            </div>

            {/* Savings Card */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-600/5 border border-emerald-500/20 p-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-600">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/>
                    <path d="M2 9v1c0 1.1.9 2 2 2h1"/>
                    <path d="M16 11h.01"/>
                  </svg>
                </span>
                <span className="text-sm font-semibold text-emerald-600">Tabungan</span>
              </div>
              <p className="text-2xl font-bold text-ink break-all">
                {currency.format(showAnnual ? annualBudget.savings : budget.savings)}
              </p>
              <p className="text-xs text-muted mt-1">
                {showAnnual ? 'per tahun (20%)' : 'per bulan (20%)'}
              </p>
              <ul className="mt-3 space-y-1 text-xs text-muted">
                <li>• Dana darurat</li>
                <li>• Investasi</li>
                <li>• Tabungan pensiun</li>
                <li>• Tujuan keuangan</li>
              </ul>
            </div>
          </div>

          {/* Insights Section */}
          {insights.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-ink mb-3">Analisis untuk Anda</h4>
              <div className="grid gap-3">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 p-3 rounded-xl border ${
                      insight.type === 'success'
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : insight.type === 'warning'
                        ? 'bg-amber-500/5 border-amber-500/20'
                        : 'bg-blue-500/5 border-blue-500/20'
                    }`}
                  >
                    <span className={`shrink-0 grid size-6 place-items-center rounded-full text-xs font-bold ${
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
                      <p className="text-xs text-muted mt-0.5">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips Section */}
          {tips.length > 0 && (
            <div className="rounded-2xl bg-canvas/60 dark:bg-white/5 border border-line/40 p-4">
              <h4 className="text-sm font-semibold text-ink mb-2">Tips sesuai pendapatan Anda</h4>
              <ul className="space-y-1.5">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted">
                    <span className="text-primary font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-muted">
            Aturan 50/30/20 adalah panduan umum. Sesuaikan dengan kondisi Anda: misalnya 60/20/20 untuk biaya hidup tinggi, atau 40/20/40 untuk fokus menabung.
          </p>
        </section>
      )}
    </section>
  )
}

// ==================================================
// EMERGENCY FUND CALCULATION
// ==================================================

function monthsToTarget(target, saved, monthlySaving) {
  const gap = Math.max(target - saved, 0)

  if (gap === 0) return 0
  if (monthlySaving === 0) return null

  return Math.ceil(gap / monthlySaving)
}

// ==================================================
// EMERGENCY FUND SIMULATOR
// ==================================================

function EmergencySimulator() {
  const [values, setValues] = useState(INITIAL_EMERGENCY)
  const [attempted, setAttempted] = useState(false)

  const errors = {
    needs: amountError(
      values.needs,
      'Kebutuhan bulanan',
      { min: 1 }
    ),

    saved: amountError(
      values.saved,
      'Dana darurat saat ini'
    ),

    monthlySaving: amountError(
      values.monthlySaving,
      'Alokasi tabungan per bulan'
    ),
  }

  const valid = Object.values(errors).every(
    (error) => !error
  )

  const needs = Number(values.needs)
  const saved = Number(values.saved)
  const monthlySaving = Number(values.monthlySaving)

  const lowerTarget = needs * 3
  const upperTarget = needs * 6

  const monthsToLowerTarget = monthsToTarget(
    lowerTarget,
    saved,
    monthlySaving
  )

  const monthsToUpperTarget = monthsToTarget(
    upperTarget,
    saved,
    monthlySaving
  )

  function update(field) {
    return (event) => {
      setValues((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }
  }

  function submit(event) {
    event.preventDefault()
    setAttempted(true)
  }

  return (
    <section
      aria-labelledby="emergency-heading"
      className="card p-5 sm:p-7"
    >
      <div className="mb-6">
        <h2
          id="emergency-heading"
          className="text-xl font-semibold text-ink"
        >
          Dana darurat
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Lihat kisaran dana untuk 3 sampai 6 bulan kebutuhan
          dan perkiraan waktunya.
        </p>
      </div>

      <form
        className="grid gap-4"
        noValidate
        onSubmit={submit}
      >
        <NumberField
          id="emergency-needs"
          label="Kebutuhan bulanan"
          value={values.needs}
          onChange={update('needs')}
          error={attempted ? errors.needs : ''}
          hint="Perkiraan biaya penting dalam satu bulan."
          min="1"
        />

        <NumberField
          id="emergency-saved"
          label="Dana darurat saat ini"
          value={values.saved}
          onChange={update('saved')}
          error={attempted ? errors.saved : ''}
          hint="Isi 0 jika belum memiliki dana darurat."
        />

        <NumberField
          id="emergency-monthly-saving"
          label="Alokasi tabungan per bulan"
          value={values.monthlySaving}
          onChange={update('monthlySaving')}
          error={attempted ? errors.monthlySaving : ''}
          hint="Isi 0 jika belum bisa menentukan alokasi."
        />

        <div className="pt-1">
          <EstimateButton />
        </div>
      </form>

      {attempted && valid && (
        <section
          aria-live="polite"
          aria-labelledby="emergency-result-heading"
          className="mt-7 border-t border-line pt-6"
        >
          <p className="text-sm font-semibold text-primary">
            Estimasi
          </p>

          <h3
            id="emergency-result-heading"
            className="mt-1 text-lg font-semibold text-ink"
          >
            Kisaran dana darurat
          </h3>

          <p className="mt-2 break-all text-2xl font-bold tracking-tight text-ink">
            {currency.format(lowerTarget)} sampai{' '}
            {currency.format(upperTarget)}
          </p>

          <p className="mt-1 text-sm text-muted">
            Setara 3 sampai 6 bulan kebutuhan.
          </p>

          {/* Visual Progress Chart */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-ink mb-3">Posisi Anda saat ini</h4>
            <div className="relative">
              {/* Progress bar background */}
              <div className="h-4 rounded-full bg-canvas dark:bg-white/10 shadow-inner overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"
                  style={{ width: '100%' }}
                />
              </div>
              
              {/* Current position marker */}
              <div
                className="absolute top-0 transform -translate-x-1/2"
                style={{ 
                  left: `${Math.min(Math.max((saved / upperTarget) * 100, 0), 100)}%`,
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-ink dark:bg-white" />
                  <div className="mt-1 px-2 py-1 rounded-lg bg-surface border border-line dark:border-white/10 shadow-sm">
                    <span className="text-xs font-semibold text-ink">{currency.format(saved)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Labels */}
            <div className="flex justify-between mt-3 text-xs text-muted">
              <span>Rp0</span>
              <span className="text-emerald-600 font-medium">3 bulan</span>
              <span className="text-amber-600 font-medium">4.5 bulan</span>
              <span className="text-rose-600 font-medium">6 bulan</span>
            </div>
          </div>

          {/* Status Card */}
          <div className={`mt-6 p-4 rounded-2xl border ${
            saved >= upperTarget 
              ? 'bg-emerald-500/5 border-emerald-500/20' 
              : saved >= lowerTarget 
              ? 'bg-amber-500/5 border-amber-500/20'
              : 'bg-canvas/60 border-line/40 dark:bg-white/5 dark:border-white/10'
          }`}>
            <div className="flex items-start gap-3">
              <span className={`shrink-0 grid size-8 place-items-center rounded-full ${
                saved >= upperTarget 
                  ? 'bg-emerald-500/20 text-emerald-600' 
                  : saved >= lowerTarget 
                  ? 'bg-amber-500/20 text-amber-600'
                  : 'bg-line/40 text-muted'
              }`}>
                {saved >= upperTarget ? '✓' : saved >= lowerTarget ? '!' : '○'}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-ink">
                  {saved >= upperTarget 
                    ? 'Dana darurat ideal tercapai!' 
                    : saved >= lowerTarget 
                    ? 'Dana darurat minimal tercapai'
                    : 'Belum memiliki dana darurat cukup'}
                </h4>
                <p className="text-sm text-muted mt-1">
                  {saved >= upperTarget 
                    ? `Anda memiliki dana untuk ${Math.round(saved / needs)} bulan kebutuhan. Pertahankan!` 
                    : saved >= lowerTarget 
                    ? `Dana saat ini cukup untuk ${Math.round(saved / needs)} bulan. Tingkatkan ke 6 bulan untuk keamanan lebih.`
                    : saved > 0 
                    ? `Dana saat ini hanya cukup untuk ${Math.round(saved / needs * 10) / 10} bulan. Target minimal 3 bulan.`
                    : 'Mulai menabung sekarang, meskipun dengan jumlah kecil.'}
                </p>
              </div>
            </div>
          </div>

          <h4 className="mt-6 text-sm font-semibold text-ink">
            Perkiraan waktu dengan alokasi saat ini
          </h4>

          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              ['Target 3 bulan', monthsToLowerTarget, lowerTarget, 'emerald'],
              ['Target 6 bulan', monthsToUpperTarget, upperTarget, 'blue'],
            ].map(([label, duration, amount, color]) => (
              <div
                key={label}
                className={`rounded-2xl p-4 transition-all border ${
                  duration === 0 
                    ? `bg-${color}-500/10 border-${color}-500/20` 
                    : 'bg-canvas/60 dark:bg-white/5 border-line/40 dark:border-white/10 hover:bg-canvas/80 dark:hover:bg-white/[0.08]'
                }`}
              >
                <dt className="text-sm text-muted">
                  {label}
                </dt>

                <dd className="mt-1 text-lg font-bold text-ink">
                  {currency.format(amount)}
                </dd>

                <dd className={`mt-2 text-sm font-semibold ${
                  duration === 0 ? 'text-emerald-600' : 'text-muted'
                }`}>
                  {duration === 0
                    ? '✓ Sudah tercapai'
                    : duration === null
                      ? 'Belum dapat dihitung'
                      : `${duration} bulan lagi`}
                </dd>

                {duration === null && (
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Tentukan alokasi tabungan bulanan
                    untuk memperkirakan waktunya.
                  </p>
                )}
                
                {duration !== null && duration > 0 && monthlySaving > 0 && (
                  <p className="mt-1 text-xs text-muted">
                    Dengan setoran {currency.format(monthlySaving)}/bulan
                  </p>
                )}
              </div>
            ))}
          </dl>

          {/* Tips */}
          <div className="mt-5 p-4 rounded-2xl bg-primary/5 border border-primary/20">
            <h4 className="text-sm font-semibold text-ink mb-2">💡 Tips dana darurat</h4>
            <ul className="space-y-1.5 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Simpan di rekening terpisah yang tidak mudah diakses untuk keperluan sehari-hari.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Pilih rekening dengan liquidity tinggi seperti tabungan atau deposito jangka pendek.</span>
              </li>
              {saved < lowerTarget && (
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Prioritaskan dana darurat sebelum investasi lain untuk keamanan finansial.</span>
                </li>
              )}
              {saved >= upperTarget && (
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Dana darurat sudah ideal. Pertimbangkan alokasi lebih untuk investasi.</span>
                </li>
              )}
            </ul>
          </div>

          <p className="mt-4 text-xs leading-5 text-muted">
            Asumsi: kebutuhan bulanan dan alokasi tabungan tetap,
            tanpa bunga atau imbal hasil. Hasil ini perkiraan,
            bukan jaminan.
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

      {/* Shared sidebar: Simulator is active */}
      <DashboardSidebar page="simulator" />

      {/* Main workspace */}
      <div className="dashboard-workspace simulator-workspace">
        <main className="dashboard-main simulator-main">

          <div className="mx-auto w-full max-w-6xl py-3">

            <GlobalHeader
              title="Simulator"
              subtitle="Coba beberapa skenario sederhana untuk membantu merencanakan keuangan."
              showDateLine={false}
            />

            {/* Simulator calculator selector */}
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

            {/* Simulator cards */}
            <div className="simulator-calculators">

              <div className="simulator-calculator-panel" hidden={activeCalculator !== 'budget'}>
                <Budget503020Simulator />
              </div>
              <div className="simulator-calculator-panel" hidden={activeCalculator !== 'goal'}>
                <GoalSimulator />
              </div>
              <div className="simulator-calculator-panel" hidden={activeCalculator !== 'emergency'}>
                <EmergencySimulator />
              </div>
            </div>

            {/* Disclaimer */}
            <footer className="mt-8 border-t border-line pt-5 text-sm leading-6 text-muted">
              Simulator ini untuk edukasi. Hasil bergantung pada
              angka yang Anda masukkan, tidak memperhitungkan bunga
              atau imbal hasil, dan bukan jaminan hasil.
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
