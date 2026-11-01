import { mountPage } from '../../src/js/main.jsx'

function LearnPage() {
  const topics = [
    'Menyusun anggaran dengan aturan 50/30/20',
    'Membangun dana darurat secara bertahap',
    'Memisahkan keuangan pribadi dan usaha',
  ]

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 sm:px-6">
      <a href="/" className="w-fit text-sm font-semibold text-primary-text hover:underline">
        Dompet Cerdas
      </a>
      <section className="my-auto py-16">
        <p className="text-sm font-bold uppercase tracking-widest text-primary-text">Pusat edukasi</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Belajar keuangan
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          Materi praktis untuk membantu membangun kebiasaan keuangan yang lebih sehat.
          Pelajaran lengkap sedang disiapkan.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {topics.map((topic) => (
            <li key={topic} className="rounded-2xl border border-line bg-surface p-5 text-sm font-semibold text-ink">
              {topic}
              <span className="mt-3 block text-xs font-medium text-muted">Segera hadir</span>
            </li>
          ))}
        </ul>
        <a
          href="/pages/html/dashboard.html"
          className="mt-8 inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Kembali ke dasbor
        </a>
      </section>
    </main>
  )
}

mountPage(LearnPage)