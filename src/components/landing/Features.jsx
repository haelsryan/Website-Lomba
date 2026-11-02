import {
  Calculator,
  BookOpen,
  LayoutDashboard,
  ArrowUpRight,
} from 'lucide-react'

const features = [
  {
    number: '01',
    label: 'FINANCIAL SIMULATOR',
    title: 'Simulator Keuangan',
    description:
      'Rencanakan keuangan dengan lebih mudah. Hitung pembagian pemasukan, kebutuhan, keinginan, dan tabungan melalui simulasi interaktif.',
    icon: Calculator,
    color: 'blue',
    highlights: [
      'Kalkulasi otomatis',
      'Metode anggaran 50/30/20',
      'Hasil perhitungan langsung',
    ],
    action: 'Coba Simulator',
    href: '#simulasi',
  },
  {
    number: '02',
    label: 'FINANCIAL EDUCATION',
    title: 'Pusat Pembelajaran',
    description:
      'Tingkatkan literasi keuangan melalui berbagai materi edukasi berupa video dan artikel yang mengacu pada sumber resmi, termasuk OJK.',
    icon: BookOpen,
    color: 'blue',
    highlights: [
      'Video pembelajaran',
      'Artikel edukasi keuangan',
      'Referensi resmi OJK',
    ],
    action: 'Jelajahi Pembelajaran',
    href: '/pages/learn.html',
  },
  {
    number: '03',
    label: 'FINANCIAL DASHBOARD',
    title: 'Dashboard Keuangan',
    description:
      'Pantau kondisi keuangan dalam satu tempat. Catat pemasukan dan pengeluaran, serta lihat ringkasan arus kas secara praktis.',
    icon: LayoutDashboard,
    color: 'blue',
    highlights: [
      'Catatan pemasukan',
      'Catatan pengeluaran',
      'Ringkasan keuangan',
    ],
    action: 'Buka Dashboard',
    href: '/pages/dashboard.html',
  },
]

export default function Features() {
  return (
    <section
      id="fitur"
      className="feature-velocity bg-canvas text-ink"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <header className="feature-heading-panel">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Explore Moneva
          </span>

          <h2 className="mt-6 max-w-4xl text-[clamp(2.5rem,7vw,5.25rem)] font-bold leading-[0.95] tracking-tight text-ink">
            Everything you
            <br />
            <span className="font-serif font-normal italic">need</span> to grow.
          </h2>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              Tiga fitur utama Moneva untuk membantu Anda memahami, mengatur,
              dan mengembangkan kondisi keuangan dengan lebih baik.
            </p>

            <p className="font-mono text-xs leading-relaxed text-muted md:shrink-0">
              Understand your money.
              <br />
              Manage your future.
            </p>
          </div>
        </header>

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            const [titleLead, ...titleRest] = feature.title.split(' ')

            return (
              <article
                key={feature.number}
                className={`feature-glass-card feature-card-${feature.color} group flex min-h-[560px] flex-col overflow-hidden rounded-2xl border border-line p-8 transition duration-300 hover:-translate-y-1 hover:border-primary/40`}
              >
                <div className="flex items-start justify-between">
                  <span className={`feature-icon feature-icon-${feature.color}`}>
                    <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs tracking-widest text-muted">
                    {feature.number}
                  </span>
                </div>

                <div className="mt-8">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                    {feature.label}
                  </span>

                  <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-ink">
                    <span className="block">{titleLead}</span>
                    <span className="block text-muted">{titleRest.join(' ')}</span>
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </div>

                <ul className="mt-6 space-y-3">
                  {feature.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-ink"
                    >
                      <span
                        className={`feature-check feature-check-${feature.color}`}
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <a
                    href={feature.href}
                    className={`feature-action feature-action-${feature.color} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
                  >
                    <span>{feature.action}</span>
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>

                  <div
                    className="feature-card-visual mt-6 flex h-28 items-center justify-center overflow-hidden rounded-xl border p-4"
                    aria-hidden="true"
                  >
                    {feature.number === '01' && (
                      <div className="flex w-full items-center gap-3">
                        <div className="grid size-16 shrink-0 grid-cols-2 gap-1.5">
                          <span className="feature-visual-block rounded-sm" />
                          <span className="feature-visual-block rounded-sm" />
                          <span className="feature-visual-block rounded-sm" />
                          <span className="feature-visual-block rounded-sm" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <span className="feature-visual-line block w-3/4" />
                          <span className="feature-visual-line block w-full" />
                          <span className="feature-visual-line block w-1/2" />
                        </div>
                      </div>
                    )}

                    {feature.number === '02' && (
                      <div className="feature-visual-sheet w-3/4 space-y-2 rounded-md border p-4">
                        <span className="feature-visual-line block w-1/2" />
                        <span className="feature-visual-line block w-full" />
                        <span className="feature-visual-line block w-5/6" />
                        <span className="feature-visual-line block w-2/3" />
                      </div>
                    )}

                    {feature.number === '03' && (
                      <div className="flex h-full w-4/5 items-end justify-center gap-3">
                        <span className="feature-visual-bar h-1/3 w-1/5 rounded-t-sm" />
                        <span className="feature-visual-bar h-2/3 w-1/5 rounded-t-sm" />
                        <span className="feature-visual-bar h-full w-1/5 rounded-t-sm" />
                        <span className="feature-visual-bar h-1/2 w-1/5 rounded-t-sm" />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
