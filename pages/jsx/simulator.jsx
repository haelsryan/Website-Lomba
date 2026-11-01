import { useState } from 'react'
import { mountPage } from '../../src/js/main.jsx'

const MAX_AMOUNT = 1_000_000_000_000_000
const MAX_MONTHS = 600
const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const INITIAL_GOAL = { target: '', months: '', saved: '' }
const INITIAL_EMERGENCY = { needs: '', saved: '', monthlySaving: '' }

function amountError(value, label, { required = true, min = 0 } = {}) {
  if (value === '') return required ? `${label} perlu diisi.` : ''
  const amount = Number(value)
  if (!Number.isFinite(amount)) return `${label} harus berupa angka yang valid.`
  if (!Number.isInteger(amount)) return `${label} harus berupa jumlah rupiah bulat.`
  if (amount < min) return `${label} harus lebih dari Rp0.`
  if (amount > MAX_AMOUNT) return `${label} maksimal Rp1.000.000.000.000.000.`
  return ''
}

function monthError(value) {
  if (value === '') return 'Jangka waktu perlu diisi.'
  const months = Number(value)
  if (!Number.isInteger(months) || months < 1) return 'Masukkan jangka waktu minimal 1 bulan.'
  if (months > MAX_MONTHS) return `Jangka waktu maksimal ${MAX_MONTHS} bulan.`
  return ''
}

function NumberField({ id, label, value, onChange, error, hint, min = 0, max = MAX_AMOUNT, step = 1 }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">{label}</label>
      <div className="flex overflow-hidden rounded-xl border border-line bg-surface focus-within:ring-2 focus-within:ring-primary">
        <span className="flex items-center border-r border-line px-3 text-sm text-muted" aria-hidden="true">Rp</span>
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
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="min-h-11 w-full min-w-0 bg-transparent px-3 py-2 text-sm text-ink outline-none"
        />
      </div>
      {error
        ? <p id={`${id}-error`} className="text-sm text-muted" role="alert">{error}</p>
        : hint && <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>}
    </div>
  )
}

function MonthsField({ value, onChange, error }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor="goal-months" className="text-sm font-semibold text-ink">Jangka waktu</label>
      <div className="flex overflow-hidden rounded-xl border border-line bg-surface focus-within:ring-2 focus-within:ring-primary">
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
          aria-describedby={error ? 'goal-months-error' : 'goal-months-hint'}
          className="min-h-11 w-full min-w-0 bg-transparent px-3 py-2 text-sm text-ink outline-none"
        />
        <span className="flex items-center border-l border-line px-3 text-sm text-muted">bulan</span>
      </div>
      {error
        ? <p id="goal-months-error" className="text-sm text-muted" role="alert">{error}</p>
        : <p id="goal-months-hint" className="text-xs text-muted">Pilih 1 sampai {MAX_MONTHS} bulan.</p>}
    </div>
  )
}

function EstimateButton() {
  return (
    <button
      type="submit"
      className="min-h-11 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      Hitung estimasi
    </button>
  )
}

function Navigation() {
  return (
    <aside
      className="app-sidebar"
      aria-label="Navigasi"
    >
      <div className="sidebar-main-bubble">
        <a
          href="/"
          className="mb-0 grid size-11 shrink-0 place-items-center rounded-full bg-primary text-white transition hover:bg-primary/80 lg:mb-3 lg:size-10"
          aria-label="Dompet Cerdas, beranda"
        >
          <svg className="icon" aria-hidden="true"><use href="#i-wallet" /></svg>
        </a>
        <button
          type="button"
          className="sidebar-toggle"
          data-sidebar-toggle
          aria-controls="sidebar-navigation"
          aria-expanded="false"
          aria-label="Buka navigasi"
        >
          <svg className="icon size-4" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          <span data-sidebar-toggle-label>Menu</span>
        </button>
        <nav id="sidebar-navigation" aria-label="Halaman utama">
          <ul className="flex flex-row gap-0 lg:flex-col lg:gap-1" role="list">
            <li>
              <a href="/pages/html/dashboard.html" className="nav-link" aria-label="Dashboard">
                <svg className="icon" aria-hidden="true"><use href="#i-home" /></svg>
              </a>
            </li>
            <li>
              <a href="/pages/html/finances.html" className="nav-link" aria-label="Keuangan">
                <svg className="icon" aria-hidden="true"><use href="#i-chart" /></svg>
              </a>
            </li>
            <li>
              <a href="/pages/html/simulator.html" className="nav-link" aria-label="Simulator" aria-current="page">
                <svg className="icon" aria-hidden="true"><use href="#i-calc" /></svg>
              </a>
            </li>
            <li>
              <a href="/pages/html/settings.html" className="nav-link" aria-label="Pengaturan">
                <svg className="icon" aria-hidden="true"><use href="#i-gear" /></svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="sidebar-utility-bubble" role="group" aria-label="Bantuan dan akun">
        <button type="button" data-act="help" className="nav-link" aria-label="Bantuan">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <circle cx="12" cy="17" r=".5" />
          </svg>
        </button>
        <button type="button" data-act="logout" className="nav-link" aria-label="Keluar">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  )
}

function GoalSimulator() {
  const [values, setValues] = useState(INITIAL_GOAL)
  const [attempted, setAttempted] = useState(false)
  const errors = {
    target: amountError(values.target, 'Target tabungan', { min: 1 }),
    months: monthError(values.months),
    saved: amountError(values.saved, 'Tabungan saat ini'),
  }
  const valid = Object.values(errors).every((error) => !error)
  const target = Number(values.target)
  const saved = Number(values.saved)
  const months = Number(values.months)
  const remaining = Math.max(target - saved, 0)
  const monthlyAmount = Math.ceil(remaining / months)
  const progress = target > 0 ? Math.min((saved / target) * 100, 100) : 0

  function update(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }))
  }

  function submit(event) {
    event.preventDefault()
    setAttempted(true)
  }

  return (
    <section aria-labelledby="goal-heading" className="card border border-line p-5 sm:p-7">
      <div className="mb-6">
        <h2 id="goal-heading" className="text-xl font-semibold text-ink">Target tabungan</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Perkirakan setoran rutin yang diperlukan untuk mencapai target.
        </p>
      </div>
      <form className="grid gap-4" noValidate onSubmit={submit}>
        <NumberField
          id="goal-target"
          label="Target tabungan"
          value={values.target}
          onChange={update('target')}
          error={attempted ? errors.target : ''}
          hint="Masukkan jumlah yang ingin dikumpulkan."
          min="1"
        />
        <MonthsField value={values.months} onChange={update('months')} error={attempted ? errors.months : ''} />
        <NumberField
          id="goal-saved"
          label="Tabungan saat ini"
          value={values.saved}
          onChange={update('saved')}
          error={attempted ? errors.saved : ''}
          hint="Isi 0 jika belum mulai menabung."
        />
        <div className="pt-1"><EstimateButton /></div>
      </form>

      {attempted && valid && (
        <section aria-live="polite" aria-labelledby="goal-result-heading" className="mt-7 border-t border-line pt-6">
          <p className="text-sm font-semibold text-primary">Estimasi</p>
          <h3 id="goal-result-heading" className="mt-1 text-lg font-semibold text-ink">
            {remaining === 0 ? 'Target tabungan sudah tercapai' : 'Setoran rutin yang diperlukan'}
          </h3>
          <p className="mt-2 break-all text-3xl font-bold tracking-tight text-ink">
            {currency.format(monthlyAmount)}{' '}
            <span className="text-sm font-medium text-muted">per bulan</span>
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            {remaining === 0
              ? `Tabungan saat ini ${currency.format(saved)} sudah mencapai atau melebihi target ${currency.format(target)}.`
              : `Perlu mengumpulkan ${currency.format(remaining)} dalam ${months} bulan, tanpa memperhitungkan bunga atau imbal hasil.`}
          </p>
          <div className="mt-5 grid gap-2">
            <div className="flex justify-between gap-3 text-sm">
              <span className="font-medium text-ink">Kemajuan menuju target</span>
              <span className="text-muted">{Math.round(progress)}%</span>
            </div>
            <div
              role="progressbar"
              aria-label="Kemajuan menuju target tabungan"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={Math.round(progress)}
              className="h-3 overflow-hidden rounded-full bg-primary-tint"
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between gap-3 text-xs text-muted">
              <span>Saat ini {currency.format(saved)}</span>
              <span>Target {currency.format(target)}</span>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted">
            Asumsi: jumlah setoran sama setiap bulan dan tidak ada bunga atau imbal hasil.
            Hasil ini perkiraan, bukan jaminan.
          </p>
        </section>
      )}
    </section>
  )
}

function monthsToTarget(target, saved, monthlySaving) {
  const gap = Math.max(target - saved, 0)
  if (gap === 0) return 0
  if (monthlySaving === 0) return null
  return Math.ceil(gap / monthlySaving)
}

function EmergencySimulator() {
  const [values, setValues] = useState(INITIAL_EMERGENCY)
  const [attempted, setAttempted] = useState(false)
  const errors = {
    needs: amountError(values.needs, 'Kebutuhan bulanan', { min: 1 }),
    saved: amountError(values.saved, 'Dana darurat saat ini'),
    monthlySaving: amountError(values.monthlySaving, 'Alokasi tabungan per bulan'),
  }
  const valid = Object.values(errors).every((error) => !error)
  const needs = Number(values.needs)
  const saved = Number(values.saved)
  const monthlySaving = Number(values.monthlySaving)
  const lowerTarget = needs * 3
  const upperTarget = needs * 6
  const monthsToLowerTarget = monthsToTarget(lowerTarget, saved, monthlySaving)
  const monthsToUpperTarget = monthsToTarget(upperTarget, saved, monthlySaving)

  function update(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }))
  }

  function submit(event) {
    event.preventDefault()
    setAttempted(true)
  }

  return (
    <section aria-labelledby="emergency-heading" className="card border border-line p-5 sm:p-7">
      <div className="mb-6">
        <h2 id="emergency-heading" className="text-xl font-semibold text-ink">Dana darurat</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Lihat kisaran dana untuk 3 sampai 6 bulan kebutuhan dan perkiraan waktunya.
        </p>
      </div>
      <form className="grid gap-4" noValidate onSubmit={submit}>
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
        <div className="pt-1"><EstimateButton /></div>
      </form>

      {attempted && valid && (
        <section aria-live="polite" aria-labelledby="emergency-result-heading" className="mt-7 border-t border-line pt-6">
          <p className="text-sm font-semibold text-primary">Estimasi</p>
          <h3 id="emergency-result-heading" className="mt-1 text-lg font-semibold text-ink">
            Kisaran dana darurat
          </h3>
          <p className="mt-2 break-all text-2xl font-bold tracking-tight text-ink">
            {currency.format(lowerTarget)} sampai {currency.format(upperTarget)}
          </p>
          <p className="mt-1 text-sm text-muted">setara 3 sampai 6 bulan kebutuhan.</p>

          <h4 className="mt-6 text-sm font-semibold text-ink">Perkiraan waktu dengan alokasi saat ini</h4>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {[['Target 3 bulan', monthsToLowerTarget], ['Target 6 bulan', monthsToUpperTarget]].map(([label, duration]) => (
              <div key={label} className="rounded-xl bg-canvas p-4">
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="mt-1 font-semibold text-ink">
                  {duration === 0
                    ? 'Sudah tercapai'
                    : duration === null
                      ? 'Belum dapat dihitung'
                      : `${duration} bulan`}
                </dd>
                {duration === null && (
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Tentukan alokasi tabungan bulanan untuk memperkirakan waktunya.
                  </p>
                )}
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-5 text-muted">
            Asumsi: kebutuhan bulanan dan alokasi tabungan tetap, tanpa bunga atau imbal hasil.
            Hasil ini perkiraan, bukan jaminan.
          </p>
        </section>
      )}
    </section>
  )
}

function SimulatorPage() {
  return (
    <>
      <svg className="hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <symbol id="i-wallet" viewBox="0 0 24 24">
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <path d="M2 10h20M16 14h2" />
          </symbol>
          <symbol id="i-home" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" />
          </symbol>
          <symbol id="i-chart" viewBox="0 0 24 24">
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </symbol>
          <symbol id="i-calc" viewBox="0 0 24 24">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M8 6h8M8 10h8M8 14h2M8 18h2M14 14h2M14 18h2" />
          </symbol>
          <symbol id="i-gear" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </symbol>
        </defs>
      </svg>

      <div className="flex min-h-[calc(100dvh-1.5rem)] flex-col gap-3 rounded-[2.5rem] bg-panel p-2 pb-20 lg:min-h-[calc(100dvh-2rem)] lg:flex-row lg:gap-4 lg:p-4 lg:pb-4">
        <Navigation />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl py-3">
            <header className="mb-8 max-w-2xl">
              <p className="mb-2 text-sm font-semibold text-primary">Rencana keuangan</p>
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Simulator</h1>
              <p className="mt-3 leading-7 text-muted">
                Coba beberapa skenario sederhana. Hasilnya perkiraan untuk membantu merencanakan langkah berikutnya.
              </p>
            </header>

            <div className="grid items-start gap-5 xl:grid-cols-2">
              <GoalSimulator />
              <EmergencySimulator />
            </div>

            <footer className="mt-8 border-t border-line pt-5 text-sm leading-6 text-muted">
              Simulator ini untuk edukasi. Hasil bergantung pada angka yang Anda masukkan,
              tidak memperhitungkan bunga atau imbal hasil, dan bukan jaminan hasil.
            </footer>
          </div>
        </main>
      </div>
    </>
  )
}

mountPage(SimulatorPage, { effects: true })