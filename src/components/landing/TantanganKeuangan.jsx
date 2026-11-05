const challenges = [
  {
    number: '01',
    label: 'KEAMANAN FINANSIAL',
    titleFirst: 'Rasa aman',
    titleSecond: 'masih tertinggal',
    description:
      'Lebih sedikit responden Gen Z merasa aman secara finansial dibanding baby boomer.',
    metric: 'Merasa aman secara finansial',
    data: [
      { label: 'Gen Z', value: 49 },
      { label: 'Baby boomer', value: 63 },
    ],
  },
  {
    number: '02',
    label: 'RENCANA JANGKA PANJANG',
    titleFirst: 'Rencana keuangan',
    titleSecond: 'sering berhenti di setahun',
    description:
      'Lebih dari setengah responden belum memiliki rencana keuangan lebih dari 12 bulan.',
    metric: 'Belum punya rencana lebih dari 12 bulan',
    data: [
      { label: 'Responden', value: 55 },
    ],
  },
  {
    number: '03',
    label: 'NASIHAT KEUANGAN',
    titleFirst: 'Banyak mengambil',
    titleSecond: 'keputusan sendiri',
    description:
      'Sebagian responden Gen Z tidak mencari bantuan atau nasihat saat mengambil keputusan finansial.',
    metric: 'Gen Z yang tidak mencari nasihat',
    data: [
      { label: 'Gen Z', value: 29 },
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
            className="landing-section-title mt-6 text-ink"
          >
            <span className="block">Keuangan Gen Z</span>
            <span className="block text-muted">
              <span className="landing-accent">bukan</span> soal
              gaji
            </span>
          </h2>
          <p className="landing-section-copy mt-6 max-w-xl text-muted">
            Riset Sun Life Indonesia 2025 menyoroti tantangan Gen Z dalam merasa
            aman secara finansial, merencanakan masa depan, dan mencari nasihat.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <article
              key={challenge.number}
              className="feature-glass-card flex min-h-[320px] flex-col overflow-hidden rounded-[28px] border border-line bg-white p-6 text-ink transition-colors duration-300 hover:border-primary/40 motion-reduce:transition-none sm:p-7"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                  {challenge.label}
                </span>
                <span className="text-xs text-muted/60">
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

              <figure className="mt-auto space-y-3 pt-6">
                <figcaption className="text-xs font-medium text-muted">
                  {challenge.metric}
                </figcaption>
                {challenge.data.map((point) => (
                  <div key={point.label}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                      <span className="text-muted">{point.label}</span>
                      <span className="font-semibold tabular-nums text-ink">
                        {point.value}%
                      </span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-primary-tint"
                      role="meter"
                      aria-label={`${challenge.metric}: ${point.label}`}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={point.value}
                    >
                      <span
                        className="block h-full rounded-full bg-primary"
                        style={{ width: `${point.value}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                ))}
              </figure>
            </article>
          ))}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-muted">
          Sumber:{' '}
          <a
            className="font-medium text-primary-text underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href="https://www.sunlife.co.id/id/about-us/newsroom/press-releases/2025/sun-life-indonesia-financial-resilience-index-reveals-gen-z/"
            target="_blank"
            rel="noreferrer"
          >
            Sun Life Indonesia, Financial Resilience Index 2025
          </a>
          {' · '}
          <a
            className="font-medium text-primary-text underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href="https://sumut.antaranews.com/berita/628953/indeks-ketahanan-finansial-sun-life-indonesia-ungkap-gen-z-paling-rentan"
            target="_blank"
            rel="noreferrer"
          >
            ANTARA, 3 Juli 2025
          </a>
        </p>
      </div>
    </section>
  )
}
