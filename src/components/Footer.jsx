function SocialLink({ label, children }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="inline-flex size-11 items-center justify-center rounded-full text-[color:var(--footer-text)] hover:bg-[var(--footer-primary)]/10 active:bg-[var(--footer-primary)]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--footer-primary)]"
    >
      {children}
    </a>
  )
}

function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--footer-muted)]">
        {title}
      </h2>
      <ul className="mt-4 grid gap-1">
        {links.map(({ label, href, todo }) => (
          <li key={label}>
            <a
              href={href}
              className="inline-flex min-h-11 items-center rounded-sm text-sm font-medium text-[color:var(--footer-text)] underline decoration-transparent underline-offset-4 hover:decoration-[color:var(--footer-primary)] active:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--footer-primary)]"
            >
              {label}
            </a>
            {todo ? <span className="sr-only"> (tautan belum tersedia)</span> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

const linkGroups = [
  {
    title: 'Produk',
    links: [
      { label: 'Fitur', href: '#fitur' },
      { label: 'Simulator', href: '#simulasi' },
      { label: 'Belajar', href: '#edukasi' },
    ],
  },
  {
    title: 'Perusahaan',
    links: [
      { label: 'Tentang', href: '#about' },
      // TODO: Add a real contact page or contact method.
      { label: 'Kontak', href: '#', todo: true },
    ],
  },
  {
    title: 'Sumber daya',
    links: [
      { label: 'Dashboard', href: '/pages/html/dashboard.html' },
      { label: 'Tantangan Keuangan', href: '#masalah' },
    ],
  },
]

export default function Footer() {
  function scrollToTop() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <footer className="relative isolate overflow-hidden border-t border-[var(--footer-border)] bg-[var(--footer-background)] text-[color:var(--footer-text)]">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-10 -z-0 translate-y-1/2 select-none whitespace-nowrap text-center text-[clamp(2.5rem,16vw,17rem)] font-bold leading-none tracking-[-0.05em] text-[color:var(--footer-wordmark)] opacity-[0.05] sm:text-[clamp(5rem,16vw,17rem)] lg:text-[clamp(5rem,19.3vw,17rem)]"
        aria-hidden="true"
      >
        do it better
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(24rem,1fr)_2fr] lg:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--footer-primary)] text-white" aria-hidden="true">
                <svg className="size-5" viewBox="0 0 24 24" fill="none">
                  <path d="M20 8H5a2 2 0 1 1 0-4h13v4M3 6v13a2 2 0 0 0 2 2h15V8H5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                  <circle cx="16.5" cy="14" r="1" fill="currentColor" />
                </svg>
              </span>
              <span className="text-base font-semibold tracking-[-0.04em] text-[color:var(--footer-text)] sm:text-lg">
                Dompet Cerdas
              </span>
            </div>

            <p className="mt-4 whitespace-nowrap text-xs leading-relaxed text-[color:var(--footer-muted)] sm:text-sm">
              Keuangan cerdas untuk masa depan yang berkelanjutan.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <SocialLink label="Dompet Cerdas di X">
                {/* TODO: Replace with the verified X profile URL. */}
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.5L5.5 22H2.36l7.25-8.28L1.8 2h6.4l4.43 6.96L18.9 2Zm-1.1 18h1.73L7.26 3.9H5.4L17.8 20Z" />
                </svg>
              </SocialLink>
              <SocialLink label="Dompet Cerdas di Instagram">
                {/* TODO: Replace with the verified Instagram profile URL. */}
                <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.5" cy="6.8" r="1.1" fill="currentColor" />
                </svg>
              </SocialLink>
              <SocialLink label="Dompet Cerdas di LinkedIn">
                {/* TODO: Replace with the verified LinkedIn profile URL. */}
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M5.2 7.8a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM3.5 9.5h3.4V21H3.5V9.5Zm5.5 0h3.3v1.6h.05c.46-.87 1.58-1.79 3.26-1.79 3.49 0 4.14 2.3 4.14 5.29V21h-3.45v-5.67c0-1.35-.03-3.08-1.88-3.08-1.89 0-2.18 1.47-2.18 2.98V21H9V9.5Z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          <nav aria-label="Tautan footer" className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-3">
            {linkGroups.map((group) => (
              <FooterLinkGroup key={group.title} {...group} />
            ))}
          </nav>
        </div>

        <div className="relative z-10 mt-12 flex flex-col gap-3 border-t border-[var(--footer-border)] pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 text-[color:var(--footer-muted)]">
            © 2026 Dompet Cerdas. Hak cipta dilindungi.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex min-h-11 w-fit items-center rounded-sm font-semibold text-[color:var(--footer-text)] underline decoration-transparent underline-offset-4 hover:decoration-[color:var(--footer-primary)] active:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--footer-primary)]"
          >
            Kembali ke atas
          </button>
        </div>
      </div>
    </footer>
  )
}
