
import { useState } from 'react'
import { mountPage } from '../main.jsx'
import { DashboardSidebar } from '../components/layout/DashboardSidebar.jsx'
import { GlobalHeader } from '../components/layout/GlobalHeader.jsx'
import { GooeyNav } from '../components/ui/GooeyNav.jsx'

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
              className="h-3 overflow-hidden rounded-full bg-primary-tint"
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between gap-3 text-xs text-muted">
              <span>Saat ini {currency.format(saved)}</span>
              <span>Target {currency.format(target)}</span>
            </div>
          </div>

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

          <h4 className="mt-6 text-sm font-semibold text-ink">
            Perkiraan waktu dengan alokasi saat ini
          </h4>

          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              ['Target 3 bulan', monthsToLowerTarget],
              ['Target 6 bulan', monthsToUpperTarget],
            ].map(([label, duration]) => (
              <div
                key={label}
                className="rounded-2xl bg-canvas/60 dark:bg-white/5 border border-line/40 dark:border-white/10 p-4 transition-all hover:bg-canvas/80 dark:hover:bg-white/[0.08]"
              >
                <dt className="text-sm text-muted">
                  {label}
                </dt>

                <dd className="mt-1 font-semibold text-ink">
                  {duration === 0
                    ? 'Sudah tercapai'
                    : duration === null
                      ? 'Belum dapat dihitung'
                      : `${duration} bulan`}
                </dd>

                {duration === null && (
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Tentukan alokasi tabungan bulanan
                    untuk memperkirakan waktunya.
                  </p>
                )}
              </div>
            ))}
          </dl>

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

mountPage(SimulatorPage, { effects: true })
