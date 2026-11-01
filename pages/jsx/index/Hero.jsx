import TypedHeading from '../../../src/components/fx/TypedHeading'

export default function Hero() {
  return (
    <section
      className="relative z-10 flex flex-1 items-end px-6 pb-14 pt-16 sm:px-8 sm:pb-20"
      aria-labelledby="landing-title"
    >
      <div className="w-full pl-4 sm:pl-12 lg:pl-20">
        <h1
          id="landing-title"
          aria-label="Uangmu, masa depanmu."
          className="mb-4 min-h-[3.1em] max-w-6xl text-[clamp(3rem,7.5vw,6.5rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-hero-foreground sm:min-h-[1.1em]"
        >
          <span aria-hidden="true">
            <TypedHeading text="Uangmu, masa depanmu." />
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-hero-foreground/80 motion-safe:animate-fade-rise motion-safe:[animation-delay:120ms]">
          Catat pengeluaran, atur rencana, dan bangun tabungan yang tahan lama.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="/pages/html/dashboard.html"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-hero-foreground px-6 text-sm font-semibold text-hero-bg shadow-lg shadow-hero-bg/20 transition hover:bg-hero-foreground/90 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-safe:animate-fade-rise motion-safe:[animation-delay:120ms] sm:min-w-44"
          >
            Lihat Dashboard
            <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </a>
          <a
            href="#masalah"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-hero-foreground/15 bg-hero-foreground/5 px-6 text-sm font-medium text-hero-foreground transition hover:border-hero-foreground/30 hover:bg-hero-foreground/10 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-safe:animate-fade-rise motion-safe:[animation-delay:120ms] sm:min-w-36"
          >
            Tantangan Keuangan
          </a>
        </div>
      </div>
    </section>
  )
}
