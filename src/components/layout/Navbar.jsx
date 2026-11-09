export default function Navbar() {
  return (
    <header className="landing-navbar sticky top-0 z-50 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 bg-hero-bg px-6 py-5 text-hero-foreground sm:px-8 sm:py-6">
      <a
        href="/"
        className="inline-flex min-h-11 items-center gap-3 text-hero-foreground"
        aria-label="Moneva, Beranda"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-hero-foreground" aria-hidden="true">
          <svg className="icon size-5">
            <use href="#i-wallet" />
          </svg>
        </span>
        <span className="text-base font-semibold tracking-[-0.04em] sm:text-lg">Moneva</span>
      </a>

      <nav
        aria-label="Main navigation"
        className="order-3 flex w-full items-center justify-between gap-4 text-xs font-medium text-hero-muted sm:justify-start sm:gap-6 md:order-none md:w-auto md:gap-8"
      >
        <a className="transition-colors hover:text-hero-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="#masalah">Problems</a>
        <a className="transition-colors hover:text-hero-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="#fitur">Features</a>
        <a className="transition-colors hover:text-hero-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href="#about">Preview</a>
      </nav>

      <nav aria-label="Demo" className="flex items-center gap-3">
        <a
          href="/pages/login.html"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-hero-foreground px-5 text-sm font-semibold text-hero-bg transition hover:bg-hero-foreground/90 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:px-6"
        >
          Masuk
        </a>
        <a
          href="/pages/signup.html"
          className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-hero-foreground/30 px-5 text-sm font-semibold text-hero-foreground transition hover:bg-hero-foreground/10 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:px-6"
        >
          Daftar
        </a>
      </nav>
    </header>
  )
}
