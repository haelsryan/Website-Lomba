import { useState } from 'react'
import { mountPage } from '../main.jsx'
import Footer from '../components/layout/Footer.jsx'
import DotBackground from '../components/landing/DotBackground.jsx'
import Hero from '../components/landing/Hero.jsx'
import Navbar from '../components/layout/Navbar.jsx'
import Features from '../components/landing/Features.jsx'

function LandingPage() {
  const [income, setIncome] = useState(5000000)
  const needs = Math.round(income * 0.5)
  const wants = Math.round(income * 0.3)
  const savings = Math.round(income * 0.2)

  const idr = (n) => new Intl.NumberFormat("id-ID", { 
    style: "currency", 
    currency: "IDR", 
    maximumFractionDigits: 0 
  }).format(n)

  const presets = [3000000, 5000000, 10000000, 20000000]

  return (
    <>
      {/* SVG sprite */}
      <svg className="hidden" aria-hidden="true">
        <symbol id="i-wallet" viewBox="0 0 24 24"><path d="M20 7H5a2 2 0 0 1 0-4h13v4"/><path d="M3 5v14a2 2 0 0 0 2 2h15V7"/><circle cx="16.5" cy="14" r="1"/></symbol>
        <symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></symbol>
        <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M4 17a3 3 0 0 1 3-3h12"/></symbol>
        <symbol id="i-receipt" viewBox="0 0 24 24"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/></symbol>
        <symbol id="i-cal" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></symbol>
        <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></symbol>
        <symbol id="i-users" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></symbol>
      </svg>

      <main>
        <div className="flex min-h-svh flex-col overflow-hidden bg-hero-bg text-hero-foreground">
          <DotBackground />
          <Navbar />
          <Hero />
        </div>

        {/* Problems */}
        <section id="masalah" className="relative border-t border-line bg-surface pb-16 pt-36 sm:pb-24 sm:pt-44">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-medium tracking-tight text-navy sm:text-4xl">
                Tantangan keuangan nyata di Indonesia
              </h2>
              <p className="mt-3 text-base text-muted">
                Masalah keuangan UMKM dan generasi muda jarang bersumber dari minimnya kerja keras, melainkan ketiadaan alat pencatatan yang sederhana dan teratur.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <article className="rounded-[2rem] border border-navy/10 bg-canvas p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <svg className="icon size-6" aria-hidden="true"><use href="#i-wallet" /></svg>
                </span>
                <h3 className="mt-5 text-xl font-medium text-navy">Rekening Pribadi dan Usaha Bercampur</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Banyak pelaku UMKM tidak tahu keuntungan bersih yang sesungguhnya karena uang hasil penjualan sering terpakai untuk keperluan dapur dan harian tanpa tercatat.
                </p>
                <div className="mt-6 rounded-2xl bg-white p-3 text-xs text-navy/90">
                  <span className="font-semibold text-primary">Solusi Moneva:</span> Pembagian pos kebutuhan, tabungan, dan operasional dalam satu layar ringkas.
                </div>
              </article>

              <article className="rounded-[2rem] border border-navy/10 bg-canvas p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <svg className="icon size-6" aria-hidden="true"><use href="#i-receipt" /></svg>
                </span>
                <h3 className="mt-5 text-xl font-medium text-navy">Denda dan Bunga Tagihan Terlewat</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Cicilan peralatan, tagihan utilitas, dan kewajiban bulanan sering terlambat dibayar bukan karena tidak ada uang, tetapi karena lupa jadwal tenggat waktu.
                </p>
                <div className="mt-6 rounded-2xl bg-white p-3 text-xs text-navy/90">
                  <span className="font-semibold text-primary">Solusi Moneva:</span> Kalender mingguan interaktif yang menandai tanggal tagihan secara visual.
                </div>
              </article>

              <article className="rounded-[2rem] border border-navy/10 bg-canvas p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <svg className="icon size-6" aria-hidden="true"><use href="#i-shield" /></svg>
                </span>
                <h3 className="mt-5 text-xl font-medium text-navy">Minim Pemahaman Risiko Pinjaman</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Kurangnya literasi mengenai batas sehat rasio utang dan izin resmi OJK membuat banyak orang terjebak bunga pinjaman konsumtif yang mencekik.
                </p>
                <div className="mt-6 rounded-2xl bg-white p-3 text-xs text-navy/90">
                  <span className="font-semibold text-primary">Solusi Moneva:</span> Modul video edukatif cara cek legalitas pinjaman dan simulasi rasio pelunasan.
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Features */}
        <Features />

        <section id="about" className="border-y border-line bg-panel py-16 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:px-8">
            <h2 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Tentang Moneva
            </h2>
            <div className="max-w-2xl">
              <p className="text-lg leading-relaxed text-ink">
                Pendamping keuangan praktis untuk anak muda, keluarga, dan pelaku UMKM di Indonesia.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Jelajahi pencatatan arus kas bersama, pengingat tagihan, dan perencanaan anggaran melalui demo edukasi ini. Semua angka adalah contoh; aplikasi tidak terhubung ke rekening bank dan tidak memindahkan uang.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="simulasi" className="border-t border-navy/5 bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-ink">
                  Simulasi Interaktif
                </span>
                <h2 className="mt-4 text-3xl font-medium tracking-tight text-navy sm:text-4xl">
                  Alokasi Anggaran 50 / 30 / 20
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  Contoh pembagian anggaran 50/30/20 untuk melihat alokasi pemasukan pribadi maupun usaha kecil:
                </p>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-white">50</span>
                    <div>
                      <b className="text-navy">Kebutuhan Pokok &amp; Operasional:</b>
                      <p className="text-xs text-muted">Sewa tempat, belanja bahan, makan, listrik, air, dan transportasi harian.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">30</span>
                    <div>
                      <b className="text-navy">Keinginan &amp; Pengembangan:</b>
                      <p className="text-xs text-muted">Pelatihan skill, rekreasi keluarga, dan upgrade perlengkapan penunjang.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-navy">20</span>
                    <div>
                      <b className="text-navy">Tabungan &amp; Dana Darurat:</b>
                      <p className="text-xs text-muted">Bantalan jika omzet menurun, asuransi, serta pelunasan utang berbunga.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2.5rem] bg-canvas p-6 sm:p-8 shadow-sm">
                <label className="block text-sm font-semibold text-navy">
                  Masukkan Pemasukan Bulanan (Rp)
                  <input
                    type="number"
                    min="0"
                    step="500000"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value) || 0)}
                    className="mt-2 w-full rounded-2xl border border-navy/15 bg-white px-4 py-3 text-lg font-semibold text-navy shadow-xs hover:border-primary-text focus:border-primary focus:outline-none active:border-primary"
                    placeholder="Contoh: 5000000"
                  />
                </label>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted">Pilihan cepat:</span>
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setIncome(p)}
                      className={`btn px-3 py-1 text-xs shadow-xs ${
                        income === p
                          ? 'bg-accent text-white'
                          : 'bg-surface text-navy hover:bg-primary-soft'
                      } active:translate-y-px`}
                    >
                      Rp{p / 1000000} Jt
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-navy/10 bg-white p-4">
                    <span className="text-xs font-semibold text-navy">50% Kebutuhan</span>
                    <p className="mt-2 text-xl font-bold text-navy">{idr(needs)}</p>
                    <p className="mt-1 text-[0.6875rem] text-muted">Maksimal pengeluaran rutin</p>
                  </div>

                  <div className="rounded-2xl border border-primary/20 bg-primary-tint p-4">
                    <span className="text-xs font-semibold text-primary">30% Keinginan</span>
                    <p className="mt-2 text-xl font-bold text-navy">{idr(wants)}</p>
                    <p className="mt-1 text-[0.6875rem] text-muted">Batas fleksibel gaya hidup</p>
                  </div>

                  <div className="rounded-2xl border border-navy/10 bg-white p-4">
                    <span className="text-xs font-semibold text-muted">20% Tabungan</span>
                    <p className="mt-2 text-xl font-bold text-navy">{idr(savings)}</p>
                    <p className="mt-1 text-[0.6875rem] text-muted">Dana darurat &amp; investasi</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-primary-soft/50 p-4">
                  <p className="text-xs text-navy/80">
                    Ingin mencatat pos-pos ini secara harian di dasbor?
                  </p>
                  <a href="/pages/dashboard.html" className="btn bg-accent px-4 py-2 text-xs text-white hover:bg-accent/90 active:translate-y-px">
                    Buka Dasbor
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section id="edukasi" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-medium tracking-tight text-navy sm:text-4xl">
                Edukasi keuangan dengan data demo lokal
              </h2>
              <p className="mt-3 text-base text-muted">
                Moneva adalah demo edukasi. Data di layar ini hanya contoh dan tidak mewakili rekening nyata.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="card p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <svg className="icon size-5" aria-hidden="true"><use href="#i-shield" /></svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-navy">Data demo disimpan di peramban</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Data contoh dan preferensi tema tersimpan di penyimpanan lokal peramban. Aplikasi ini tidak terhubung ke rekening bank.
                </p>
              </div>

              <div className="card p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <svg className="icon size-5" aria-hidden="true"><use href="#i-book" /></svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-navy">Edukasi Regulasi &amp; OJK</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Menyediakan panduan praktis mengenali ciri-ciri entitas pinjaman ilegal dan cara mengecek keabsahan izin lembaga keuangan resmi melalui saluran resmi Otoritas Jasa Keuangan.
                </p>
              </div>

              <div className="card p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <svg className="icon size-5" aria-hidden="true"><use href="#i-target" /></svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-navy">Demo tanpa pembayaran</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Coba fitur pencatatan, pengingat, dan simulasi tanpa akun atau langganan. Demo ini tidak memindahkan uang.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-sidebar px-6 py-12 text-center text-white sm:px-12 sm:py-16">
              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
                Mulai rapikan arus kas Anda hari ini
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                Buka dasbor untuk melihat contoh pencatatan transaksi, pengingat tagihan, dan ringkasan arus kas.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <a href="/pages/dashboard.html" className="btn bg-primary px-7 py-3.5 text-base font-semibold text-white hover:bg-primary/90 shadow-md active:translate-y-px">
                  Buka Dasbor Moneva
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

mountPage(LandingPage)
