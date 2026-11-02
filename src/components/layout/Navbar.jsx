export default function Navbar() {
  return (
    <header className="relative z-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-5 sm:px-8 sm:py-6">
      <a
        href="/"
        className="inline-flex min-h-11 items-center gap-3 text-hero-foreground"
        aria-label="Dompet Cerdas, Beranda"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-hero-foreground" aria-hidden="true">
          <svg className="icon size-5">
            <use href="#i-wallet" />
          </svg>
        </span>
        <span className="text-base font-semibold tracking-[-0.04em] sm:text-lg">Dompet Cerdas</span>
      </a>

      <nav
        aria-label="Main navigation"
        className="order-3 flex w-full items-center justify-between gap-4 text-xs font-medium text-hero-muted sm:justify-start sm:gap-6 md:order-none md:w-auto md:gap-8"
      >
        <a className="transition-colors hover:text-hero-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="#fitur">Features</a>
        <a className="transition-colors hover:text-hero-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="#about">About</a>
        <a className="transition-colors hover:text-hero-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="#simulasi">Simulator</a>
        <a className="transition-colors hover:text-hero-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="#edukasi">Learn</a>
      </nav>

      <nav aria-label="Demo">
        <a
          href="/pages/html/dashboard.html"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-hero-foreground px-5 text-sm font-semibold text-hero-bg transition hover:bg-hero-foreground/90 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:px-6"
        >
          Open demo
        </a>
      </nav>
    </header>
  )
}
