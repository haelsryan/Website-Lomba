// Placeholder challenge items: replace these with findings from Moneva audience research.
const challenges = [
  {
    number: '01',
    label: 'ARUS KAS',
    titleFirst: 'Uang cepat',
    titleSecond: 'habis',
    description:
      'Pemasukan terasa tidak cukup sampai akhir bulan ketika kebutuhan rutin belum direncanakan.',
    visual: [
      'h-5 w-2/5 bg-primary/25',
      'h-8 w-3/4 bg-primary/50',
      'h-6 w-1/2 bg-primary/25',
    ],
  },
  {
    number: '02',
    label: 'PENGELUARAN',
    titleFirst: 'Belanja tanpa',
    titleSecond: 'rencana',
    description:
      'Pengeluaran kecil yang tidak tercatat bisa membuat anggaran bulanan sulit dipantau.',
    visual: [
      'h-5 w-1/2 bg-primary/25',
      'h-8 w-1/3 bg-primary/50',
      'h-6 w-2/3 bg-primary/25',
    ],
  },
  {
    number: '03',
    label: 'KEBIASAAN MENABUNG',
    titleFirst: 'Mulai terasa',
    titleSecond: 'membingungkan',
    description:
      'Menentukan langkah awal dan jumlah tabungan dapat terasa sulit tanpa rencana sederhana.',
    visual: [
      'h-5 w-1/3 bg-primary/25',
      'h-8 w-1/2 bg-primary/50',
      'h-6 w-3/4 bg-primary/25',
    ],
  },
]

export default function TantanganKeuangan() {
  return (
    <section
      id="masalah"
      aria-labelledby="tantangan-heading"
      className="bg-transparent py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <header className="mb-20">
          <h2
            id="tantangan-heading"
            className="mt-6 text-5xl font-bold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            <span className="block">Keuangan Gen Z</span>
            <span className="block text-muted">
              <span className="font-serif font-normal italic">bukan</span> soal
              gaji
            </span>
          </h2>
          {/* Placeholder copy; replace with concise, research-backed audience insight. */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
            Banyak anak muda menghadapi pemasukan yang habis sebelum akhir bulan,
            pengeluaran tak terencana, dan kebingungan menentukan awal untuk
            menabung (contoh placeholder, ganti dengan temuan riset audiens
            Moneva).
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <article
              key={challenge.number}
              className="flex min-h-[320px] flex-col rounded-2xl border border-line bg-surface p-8 transition duration-300 hover:-translate-y-1 hover:border-primary/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                  {challenge.label}
                </span>
                <span className="font-mono text-xs text-muted/60">
                  {challenge.number}
                </span>
              </div>

              <h3 className="mt-8 text-2xl font-semibold leading-tight">
                <span className="block text-ink">{challenge.titleFirst}</span>
                <span className="block text-muted">{challenge.titleSecond}</span>
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                {challenge.description}
              </p>

              <div
                className="mt-auto flex h-12 items-end gap-2 pt-6"
                aria-hidden="true"
              >
                {challenge.visual.map((barClass, index) => (
                  <span
                    key={`${challenge.number}-${index}`}
                    className={`rounded-t-sm ${barClass}`}
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
