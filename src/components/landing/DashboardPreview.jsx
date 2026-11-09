import { ArrowUpRight } from 'lucide-react'

const stats = [
  { label: 'Pemasukan', amount: 'Rp5 jt' },
  { label: 'Pengeluaran', amount: 'Rp3 jt' },
  { label: 'Saldo', amount: 'Rp2 jt' },
]

const transactions = [
  { label: 'Belanja harian', amount: '− Rp250 rb' },
  { label: 'Transportasi', amount: '− Rp80 rb' },
  { label: 'Setoran tabungan', amount: 'Rp500 rb' },
]

const chartBars = [
  'h-1/3 bg-primary/30',
  'h-2/3 bg-primary/55',
  'h-1/2 bg-primary/30',
  'h-full bg-primary/55',
  'h-3/5 bg-primary/30',
  'h-4/5 bg-primary/55',
  'h-1/2 bg-primary/30',
]

export default function DashboardPreview() {
  return (
    <section
      id="about"
      aria-labelledby="dashboard-preview-heading"
      className="bg-transparent py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div>
          <h2
            id="dashboard-preview-heading"
            className="landing-section-title mt-6 text-ink"
          >
            <span className="block">Pantau semua</span>
            <span className="block text-muted">
              dalam satu <span className="landing-accent">tempat.</span>
            </span>
          </h2>
          <p className="landing-section-copy mt-6 max-w-xl text-muted">
            Lihat ringkasan pemasukan, pengeluaran, saldo, dan transaksi
            terbaru dalam satu tampilan.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 transition duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-ink">Ringkasan keuangan</h3>
            <span className="text-xs text-muted">Data contoh</span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="min-w-0 rounded-xl border border-line bg-transparent p-3 sm:p-4"
              >
                <p className="truncate text-[10px] text-muted sm:text-xs">
                  {stat.label}
                </p>
                <p className="mt-2 break-words text-xs font-semibold text-ink sm:text-base">
                  {stat.amount}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-6 flex h-28 items-end gap-3 border-b border-line px-2 pb-2 sm:h-32"
            aria-hidden="true"
          >
            {chartBars.map((barClass, index) => (
              <span
                key={index}
                className={`flex-1 rounded-t-sm ${barClass}`}
              />
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-ink">Transaksi terbaru</h4>
            <ul className="mt-2">
              {transactions.map((transaction) => (
                <li
                  key={transaction.label}
                  className="flex min-h-11 items-center justify-between gap-4 border-b border-line py-2 text-sm last:border-b-0"
                >
                  <span className="text-muted">{transaction.label}</span>
                  <span className="shrink-0 font-medium text-ink">
                    {transaction.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
