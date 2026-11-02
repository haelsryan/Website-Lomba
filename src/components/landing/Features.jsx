import { useEffect, useState } from 'react'
import FluxLines from '../FluxLines.jsx'
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
    href: '/pages/pembelajaran.html',
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

    const [isDark, setIsDark] = useState(false)

useEffect(() => {
  const updateTheme = () => {
    const themeElement =
      document.documentElement.dataset.theme ||
      document.body.dataset.theme

    setIsDark(themeElement === 'dark')
  }

  updateTheme()

  const observer = new MutationObserver(updateTheme)

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  return () => observer.disconnect()
}, [])

  return (
    <section
      id="fitur"
      className="feature-velocity relative overflow-hidden py-24 sm:py-32"
    >
      <div className="feature-grid pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <div className="feature-heading-panel relative isolate overflow-hidden rounded-3xl border border-line p-6 sm:p-8 lg:p-10">
          <div className="feature-flux-background pointer-events-none absolute z-0" aria-hidden="true">
            <FluxLines
              colors={
                isDark
                  ? ['#8eacc5', '#c0d3e2', '#6d8da8']
                  : ['#456b89', '#7899b5', '#355b79']
              }
              glow={1.8}
              rimWidth={0.18}
              lineWidth={1.75}
              flowDirection="down"
              mouseInteraction={true}
              clickSwirl={true}
              speed={0.3}
              scale={1.5}
              turbulence={0.45}
              fluidity={0.12}
              sharpness={2.2}
              shimmer={0.8}
              opacity={0.45}
              mouseStrength={0.5}
              mouseRadius={0.35}
              intro={true}
              lightMode={!isDark}
              transparent={true}
            />
          </div>

          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl space-y-5">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
                Explore Moneva
              </span>

              <h2 className="text-4xl font-black uppercase leading-none tracking-tighter sm:text-6xl lg:text-7xl">
                Everything You
                <br />
                Need to Grow.
              </h2>

              <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                Tiga fitur utama Moneva untuk membantu Anda memahami,
                mengatur, dan mengembangkan kondisi keuangan dengan lebih baik.
              </p>
            </div>

            <div className="max-w-xs">
              <p className="font-mono text-xs uppercase leading-relaxed tracking-widest text-muted">
                Understand your money.
                <br />
                Manage your future.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 lg:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.number}
                className={`feature-glass-card feature-card-${feature.color} group relative flex min-h-[480px] flex-col overflow-hidden rounded-3xl border border-line p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl sm:p-8`}
              >

                {/* Hover Glow */}
                <div className="feature-card-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                {/* Card Number */}
                <span className="absolute right-7 top-7 font-mono text-xs tracking-widest text-muted/60">
                  {feature.number}
                </span>

                <div className="relative z-10 flex flex-1 flex-col">

                  {/* Icon */}
                  <div className={`feature-icon feature-icon-${feature.color}`}>
                    <Icon className="size-7" strokeWidth={1.7} />
                  </div>

                  {/* Content */}
                  <div className="mt-10">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
                      {feature.label}
                    </span>

                    <h3 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl">
                      {feature.title}
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      {feature.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="mt-8 space-y-3">
                    {feature.highlights.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 text-sm text-ink"
                      >
                        <span className={`feature-check feature-check-${feature.color}`}>
                          ✓
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="mt-auto pt-10">
                    <a
                      href={feature.href}
                      className={`feature-action feature-action-${feature.color}`}
                    >
                      <span>{feature.action}</span>
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </a>
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
