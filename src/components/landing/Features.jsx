const lessons = [
  { title: "Atur anggaran bulanan", progress: "w-3/4" },
  { title: "Mulai dana darurat", progress: "w-1/2" },
  { title: "Kenali bunga pinjaman", progress: "w-1/3" },
];

const dashboardBars = [
  "h-1/3",
  "h-2/3",
  "h-1/2",
  "h-full",
  "h-3/5",
  "h-4/5",
  "h-1/2",
];

const features = [
  {
    title: "Simulator Keuangan",
    description:
      "Hitung pembagian pemasukan dan target tabungan Anda dengan mudah.",
    href: "#simulasi",
    ctaLabel: "Coba Simulator",
    Mockup: SimulatorMockup,
  },
  {
    title: "Pusat Pembelajaran",
    description:
      "Pilih materi singkat untuk memahami pengelolaan uang sehari-hari.",
    href: "/pages/learn.html",
    ctaLabel: "Jelajahi Pembelajaran",
    Mockup: LessonMockup,
  },
  {
    title: "Dashboard Keuangan",
    description:
      "Lihat saldo, pemasukan, dan pengeluaran Anda dalam satu ringkasan.",
    href: "/pages/dashboard.html",
    ctaLabel: "Buka Dashboard",
    Mockup: DashboardMockup,
  },
];

export default function Features() {
  return (
    <section
      id="fitur"
      className="feature-velocity relative overflow-hidden bg-canvas py-24 text-ink lg:py-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <header className="feature-heading-panel">
          <h2 className="landing-section-title mt-6 max-w-4xl text-ink">
            Everything you
            <br />
            <span className="landing-accent">need</span> to grow.
          </h2>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="landing-section-copy max-w-xl text-muted">
              Tiga fitur utama Moneva untuk membantu Anda memahami, mengatur,
              dan mengembangkan kondisi keuangan dengan lebih baik.
            </p>
          </div>
        </header>

        <div className="feature-card-grid mt-14 mx-auto grid w-full max-w-5xl justify-center gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Mockup, ...feature }) => (
            <FeatureCard key={feature.title} {...feature}>
              <Mockup />
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  description,
  href,
  ctaLabel,
  children,
}) {
  return (
    <a
      href={href}
      aria-label={`${title}: ${ctaLabel}`}
      className="feature-glass-card feature-card-blue feature-card-link group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white text-ink transition-colors duration-300 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <div className="feature-card-visual relative aspect-[4/3.2] overflow-hidden bg-primary-tint">
        <div className="feature-mockup-position absolute bottom-[-2%] left-1/2 z-20 w-[calc(100%-2.5rem)] max-w-[25rem] -translate-x-1/2 transition duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
          {children}
        </div>
      </div>

      <div className="feature-card-caption flex flex-1 flex-col p-6 sm:p-7">
        <div className="feature-card-heading flex flex-wrap items-start gap-2.5">
          <h3 className="text-2xl font-medium leading-tight tracking-tight text-ink">
            {title}
          </h3>
        </div>
        <p className="feature-card-description mt-2 text-sm leading-relaxed text-muted">
          {description}
        </p>
        <span className="mt-auto inline-flex min-h-11 items-end pt-4 text-sm font-semibold text-primary-text">
          {ctaLabel}
        </span>
      </div>
    </a>
  );
}

function SimulatorMockup() {
  return (
    <div
      aria-hidden="true"
      className="feature-mockup rounded-2xl border border-line bg-surface p-4 shadow-sm"
    >
      <span className="text-sm font-semibold text-ink">Rencana tabungan</span>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <p className="text-xs leading-4 text-muted">Pemasukan bulanan</p>
          <div className="mt-1 flex min-h-10 items-center gap-1.5 rounded-lg border border-line bg-canvas px-2.5 text-xs font-medium text-ink">
            <span className="text-muted">Rp</span>
            <span className="truncate">5.000.000</span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xs leading-4 text-muted">Target tabungan</p>
          <div className="mt-1 flex min-h-10 items-center gap-1.5 rounded-lg border border-line bg-canvas px-2.5 text-xs font-medium text-ink">
            <span className="text-muted">Rp</span>
            <span className="truncate">15.000.000</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl bg-primary-tint px-3 py-2.5">
        <span className="text-xs text-ink">Setoran per bulan</span>
        <span className="text-sm font-semibold text-primary-text">
          Rp 1.250.000
        </span>
      </div>
    </div>
  );
}

function LessonMockup() {
  return (
    <div
      aria-hidden="true"
      className="feature-mockup rounded-2xl border border-line bg-surface p-4 shadow-sm"
    >
      <span className="text-sm font-semibold text-ink">Materi belajar</span>
      <ul className="mt-3">
        {lessons.map((lesson) => (
          <li
            key={lesson.title}
            className="border-t border-line py-2.5 first:border-t-0"
          >
            <p className="truncate text-xs font-medium text-ink">
              {lesson.title}
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-primary-tint">
              <span
                className={`block h-full rounded-full bg-primary ${lesson.progress}`}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div
      aria-hidden="true"
      className="feature-mockup rounded-2xl border border-line bg-surface p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted">Saldo saat ini</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">
            Rp 4.820.000
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs text-muted">Arus uang mingguan</p>
        <div className="mt-2 flex h-16 items-end gap-2 border-b border-line px-1 pb-1">
          {dashboardBars.map((height, index) => (
            <span
              key={index}
              className={`flex-1 rounded-t-sm bg-primary/70 ${height}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
