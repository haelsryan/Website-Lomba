import { Wallet } from 'lucide-react'
import Threads from '../ui/Threads.jsx'

export default function CtaFooter() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0a0a0a] py-28 sm:py-36">
      <div className="absolute inset-0 -z-0 pointer-events-none" aria-hidden="true">
        <Threads
          color={[1, 1, 1]}
          amplitude={0.25}
          distance={0.4}
          enableMouseInteraction
          parting={0.28}
          lineCount={120}
          thickness={0.45}
          opacity={0.14}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <div
          className="pointer-events-none absolute inset-[-3rem] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6),transparent_70%)]"
          aria-hidden="true"
        />
        <h2 className="font-serif text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl">
          Mulai kelola keuangan
          <br />
          Anda dengan lebih tenang.
        </h2>
        <a
          href="/pages/dashboard.html"
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-white/90 active:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <Wallet className="size-4" aria-hidden="true" />
          Mulai Gratis
        </a>
        <p className="mt-4 text-sm text-white/70">Coba demo pengelolaan keuangan Moneva.</p>
      </div>
    </section>
  )
}
