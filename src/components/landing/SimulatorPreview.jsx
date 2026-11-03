import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

const presets = [3000000, 5000000, 10000000, 20000000]
const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export default function SimulatorPreview() {
  const [income, setIncome] = useState(5000000)
  const needs = Math.round(income * 0.5)
  const wants = Math.round(income * 0.3)
  const savings = Math.round(income * 0.2)

  return (
    <section
      id="simulasi"
      aria-labelledby="simulator-preview-heading"
      className="bg-transparent py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div className="rounded-2xl border border-line bg-surface p-5 transition duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7">
          <p className="mb-5 text-xs text-muted">
            Estimasi dari pemasukan contoh. Bukan data rekening.
          </p>

          <label
            htmlFor="preview-monthly-income"
            className="text-sm font-semibold text-ink"
          >
            Pemasukan bulanan
          </label>
          <div className="mt-2 flex min-h-12 overflow-hidden rounded-xl border border-line bg-transparent focus-within:ring-2 focus-within:ring-primary">
            <span className="flex items-center border-r border-line px-4 text-sm text-muted">
              Rp
            </span>
            <input
              id="preview-monthly-income"
              type="number"
              inputMode="numeric"
              min="0"
              step="500000"
              value={income}
              placeholder="5000000"
              onChange={(event) =>
                setIncome(Number(event.target.value) || 0)
              }
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ink outline-none"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs text-muted">Pilihan cepat:</span>
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setIncome(preset)}
                aria-pressed={income === preset}
                className={`min-h-11 rounded-xl border px-3 text-xs font-medium transition duration-200 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  income === preset
                    ? 'border-primary bg-primary text-white'
                    : 'border-line bg-transparent text-ink hover:border-primary/50'
                }`}
              >
                Rp{preset / 1000000} jt
              </button>
            ))}
          </div>

          <div
            className="mt-7 flex h-3 overflow-hidden rounded-full"
            role="img"
            aria-label="Pembagian contoh anggaran: 50 persen kebutuhan, 30 persen keinginan, 20 persen tabungan"
          >
            <span className="w-1/2 bg-primary/30" />
            <span className="w-[30%] bg-primary/60" />
            <span className="w-1/5 bg-primary" />
          </div>

          <ul className="mt-5">
            {[
              { label: 'Kebutuhan · 50%', amount: needs },
              { label: 'Keinginan · 30%', amount: wants },
              { label: 'Tabungan · 20%', amount: savings },
            ].map((item) => (
              <li
                key={item.label}
                className="flex min-h-12 items-center justify-between gap-4 border-b border-line py-3 text-sm last:border-b-0"
              >
                <span className="text-muted">{item.label}</span>
                <span className="shrink-0 font-semibold text-ink">
                  {currency.format(item.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2
            id="simulator-preview-heading"
            className="mt-6 text-5xl font-bold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            <span className="block">Atur anggaranmu</span>
            <span className="block text-muted">
              dengan <span className="font-serif font-normal italic">metode</span>{' '}
              50/30/20.
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
            Sesuaikan contoh pemasukan untuk melihat pembagian anggaran
            kebutuhan, keinginan, dan tabungan.
          </p>
          <a
            href="#simulasi"
            className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-primary active:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Coba Simulator
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
