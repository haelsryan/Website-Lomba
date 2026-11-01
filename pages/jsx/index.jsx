import { useState } from 'react'
import { mountPage } from '../../src/js/main.jsx'

function LandingPage() {
  const [income, setIncome] = useState(5000000)
  const title = 'Keuangan kuat dimulai dari langkah kecil yang konsisten'
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
        <symbol id="i-sliders" viewBox="0 0 24 24"><path d="M4 6h8M20 6h0M4 12h2M14 12h6M4 18h10M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="17" cy="18" r="2"/></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></symbol>
        <symbol id="i-receipt" viewBox="0 0 24 24"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/></symbol>
        <symbol id="i-cal" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></symbol>
        <symbol id="i-eye" viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></symbol>
        <symbol id="i-link" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></symbol>
        <symbol id="i-plus" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></symbol>
        <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></symbol>
        <symbol id="i-chart" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></symbol>
        <symbol id="i-users" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></symbol>
      </svg>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between rounded-full border border-line bg-surface px-4 py-3 sm:px-5">
            <a href="/" className="flex items-center gap-3 hover:underline active:underline" aria-label="Dompet Cerdas Beranda">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary text-white">
                <svg className="icon size-5 text-white" aria-hidden="true"><use href="#i-wallet" /></svg>
              </span>
              <div className="leading-none">
                <span className="text-base font-bold tracking-tight text-ink sm:text-lg">Dompet Cerdas</span>
                <span className="hidden text-[0.6875rem] font-medium text-muted sm:block">Inklusi &amp; Ketahanan Finansial</span>
              </div>
            </a>

            <nav aria-label="Navigasi situs" className="hidden items-center gap-5 lg:flex">
              <a href="#masalah" className="text-sm font-medium text-muted transition hover:text-primary-text active:underline">Tantangan</a>
              <a href="#fitur" className="text-sm font-medium text-muted transition hover:text-primary-text active:underline">Fitur Utama</a>
              <a href="#simulasi" className="text-sm font-medium text-muted transition hover:text-primary-text active:underline">Simulasi Anggaran</a>
              <a href="#edukasi" className="text-sm font-medium text-muted transition hover:text-primary-text active:underline">Edukasi</a>
            </nav>

            <div className="flex items-center gap-3">
              <a href="/pages/html/dashboard.html" className="btn min-h-11 bg-accent text-white hover:bg-accent/90 active:translate-y-px">
                <span className="sm:hidden">Masuk</span>
                <span className="hidden sm:inline">Masuk ke Dasbor</span>
              </a>
            </div>
          </div>
          <nav aria-label="Navigasi situs seluler" className="flex items-center justify-center gap-1 py-2 lg:hidden">
            <a href="#masalah" className="inline-flex min-h-11 items-center rounded-full px-2 text-xs font-medium text-ink transition hover:bg-primary-soft active:underline">Tantangan</a>
            <a href="#fitur" className="inline-flex min-h-11 items-center rounded-full px-2 text-xs font-medium text-ink transition hover:bg-primary-soft active:underline">Fitur</a>
            <a href="#simulasi" className="inline-flex min-h-11 items-center rounded-full px-2 text-xs font-medium text-ink transition hover:bg-primary-soft active:underline">Simulasi</a>
            <a href="#edukasi" className="inline-flex min-h-11 items-center rounded-full px-2 text-xs font-medium text-ink transition hover:bg-primary-soft active:underline">Edukasi</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary-tint pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pb-32 lg:pt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mx-auto text-4xl font-medium tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-ink sm:text-lg">
                Platform pencatatan arus kas bersama, pengingat tenggat tagihan, dan edukasi praktis untuk mahasiswa, keluarga, serta pelaku UMKM Indonesia.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <a href="/pages/html/dashboard.html" className="btn min-h-11 bg-primary px-6 py-3 text-base text-white hover:bg-primary/90 active:translate-y-px">
                  Buka Dasbor Aplikasi
                </a>
                <a href="#simulasi" className="btn min-h-11 border border-line bg-surface px-6 py-3 text-base text-ink hover:border-primary-text hover:text-primary-text active:translate-y-px">
                  Hitung Simulasi 50/30/20
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-ink">
                <div className="flex items-center gap-2">
                  <svg className="icon size-4 text-primary-text" aria-hidden="true"><use href="#i-shield" /></svg>
                  <span>Data tersimpan lokal di peramban</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="icon size-4 text-primary-text" aria-hidden="true"><use href="#i-check" /></svg>
                  <span>Pedoman literasi keuangan OJK</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="icon size-4 text-primary-text" aria-hidden="true"><use href="#i-users" /></svg>
                  <span>Dukungan kolaborasi keluarga &amp; tim</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mx-auto -mb-24 mt-12 max-w-6xl sm:-mb-32 sm:mt-16">
              <div className="rounded-[2.5rem] border border-line bg-surface p-2 shadow-xl sm:p-4">
                <div className="rounded-[2rem] bg-canvas p-4 sm:p-6 lg:p-8">
                  <div className="rounded-3xl bg-primary-soft p-5 text-ink sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-ink">Contoh tampilan aplikasi</p>
                        <h2 className="mt-1 text-xl font-medium">Dompet Bersama</h2>
                      </div>
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">Minggu Ini</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-ink">
                      <span>Contoh anggota: 6 orang</span>
                      <a href="/pages/html/dashboard.html" className="font-semibold text-ink hover:underline active:underline">Kelola &rarr;</a>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="card p-4">
                      <p className="text-xs font-medium text-muted">Pengeluaran Mingguan</p>
                      <p className="mt-2 text-2xl font-medium text-navy">Rp 1.450.000</p>
                      <div className="mt-3 flex h-2 gap-1 overflow-hidden rounded-full bg-canvas">
                        <span className="w-[55%] rounded-full bg-accent" title="Kebutuhan 55%"></span>
                        <span className="w-[30%] rounded-full bg-primary" title="Tabungan 30%"></span>
                        <span className="w-[15%] rounded-full bg-primary-soft" title="Lainnya 15%"></span>
                      </div>
                      <div className="mt-2 flex justify-between text-[0.6875rem] text-muted">
                        <span>Kebutuhan: 55%</span>
                        <span>Tabungan: 30%</span>
                      </div>
                    </div>

                    <div className="card p-4">
                      <p className="text-xs font-medium text-muted">Jadwal Tagihan Terdekat</p>
                      <div className="mt-2 flex items-center gap-2.5 rounded-2xl bg-canvas p-2.5">
                        <span className="grid size-8 place-items-center rounded-xl bg-primary-soft text-primary">
                          <svg className="icon size-4" aria-hidden="true"><use href="#i-receipt" /></svg>
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-navy">Listrik Rumah &amp; Usaha</p>
                          <p className="text-[0.6875rem] text-muted">Hari ini, 12:45 WIB</p>
                        </div>
                        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[0.6875rem] font-semibold text-ink">Siap Bayar</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        <span className="avatar size-7 bg-accent text-xs">SW</span>
                        <span className="avatar size-7 bg-primary text-xs">RP</span>
                        <span className="avatar size-7 bg-primary-soft text-xs text-ink">DS</span>
                      </div>
                      <span className="text-xs font-medium text-muted">Contoh aktivitas dompet bersama</span>
                    </div>
                    <a href="/pages/html/dashboard.html" className="min-h-11 shrink-0 text-xs font-semibold text-primary-text hover:underline active:underline">Buka &rarr;</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                  <span className="font-semibold text-primary">Solusi Dompet Cerdas:</span> Pembagian pos kebutuhan, tabungan, dan operasional dalam satu layar ringkas.
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
                  <span className="font-semibold text-primary">Solusi Dompet Cerdas:</span> Kalender mingguan interaktif yang menandai tanggal tagihan secara visual.
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
                  <span className="font-semibold text-primary">Solusi Dompet Cerdas:</span> Modul video edukatif cara cek legalitas pinjaman dan simulasi rasio pelunasan.
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="fitur" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-medium tracking-tight text-navy sm:text-4xl">
                Fitur yang berfokus pada ketahanan finansial
              </h2>
              <p className="mt-3 text-base text-muted">
                Bukan software akuntansi yang rumit. Dompet Cerdas menyajikan instrumen esensial yang langsung dapat Anda gunakan hari ini.
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
              <div className="card flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-primary text-white">
                      <svg className="icon size-5 text-white" aria-hidden="true"><use href="#i-users" /></svg>
                    </span>
                    <div>
                      <h3 className="text-2xl font-medium text-navy">Pencatatan Arus Kas Bersama</h3>
                      <p className="text-xs text-muted">Untuk keluarga, tim usaha, dan kelompok mahasiswa</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    Tambahkan anggota keluarga atau rekan kerja untuk memantau pengeluaran bersama. Setiap anggota memiliki avatar dan riwayat transaksi yang transparan tanpa perlu login rumit.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl bg-canvas p-4">
                  <p className="text-xs font-medium text-muted">Daftar Anggota Usaha Contoh:</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-navy shadow-xs">
                      Sari Wulandari (Kasir)
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-navy shadow-xs">
                      Raka Pratama (Operasional)
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-navy shadow-xs">
                      Dimas Saputra (Belanja)
                    </span>
                  </div>
                </div>
              </div>

              <div className="card flex flex-col justify-between p-5 sm:p-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-primary text-white">
                      <svg className="icon size-5 text-white" aria-hidden="true"><use href="#i-cal" /></svg>
                    </span>
                    <div>
                      <h3 className="text-2xl font-medium text-navy">Kalender Pengingat Bebas Denda</h3>
                      <p className="text-xs text-muted">Disiplin tenggat waktu cicilan &amp; utilitas</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    Visualisasikan minggu berjalan. Pilih tanggal untuk melihat tagihan jatuh tempo, lalu tandai lunas dengan satu ketukan begitu pembayaran selesai.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl bg-canvas p-4">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-navy">Jadwal Pekan Ini</span>
                    <span className="text-primary font-semibold">Tandai Lunas Instan</span>
                  </div>
                  <div className="mt-2.5 space-y-2">
                    <div className="flex items-center justify-between rounded-xl bg-white p-2.5 text-xs">
                      <span className="font-medium text-navy">Internet &amp; WiFi Usaha</span>
                      <span className="text-muted">10:00 WIB</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white p-2.5 text-xs">
                      <span className="font-medium text-navy">Cicilan Alat Produksi</span>
                      <span className="text-muted">09:00 WIB</span>
                    </div>
                  </div>
                </div>
              </div>
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
                  <a href="/pages/html/dashboard.html" className="btn bg-accent px-4 py-2 text-xs text-white hover:bg-accent/90 active:translate-y-px">
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
                Dompet Cerdas adalah demo edukasi. Data di layar ini hanya contoh dan tidak mewakili rekening nyata.
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
                <a href="/pages/html/dashboard.html" className="btn bg-primary px-7 py-3.5 text-base font-semibold text-white hover:bg-primary/90 shadow-md active:translate-y-px">
                  Buka Dasbor Dompet Cerdas
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      
        
        {/* FOOTER */}
          <footer className="dc-footer">

            <div className="dc-footer-container">

              {/* TOP SECTION */}
              <div className="dc-footer-top">
                <p className="dc-copyright">
                  &copy; {new Date().getFullYear()} Dompet Cerdas
                </p>

                <span className="dc-footer-divider"></span>

                <p className="dc-footer-tagline">
                  Ketahanan finansial untuk semua
                </p>
              </div>

              {/* NAVIGATION */}
              <nav className="dc-footer-nav" aria-label="Footer navigation">
                <a href="/">Beranda</a>
                <a href="#masalah">Tantangan</a>
                <a href="#fitur">Fitur</a>
                <a href="#simulasi">Simulasi</a>
                <a href="#edukasi">Edukasi</a>
                <a href="/pages/html/dashboard.html">Dasbor</a>
              </nav>

              {/* BRAND */}
              <div className="dc-footer-brand">
                <p>do it better</p>
              </div>

            </div>

          </footer>
        </>
          )
        }

        mountPage(LandingPage)
