import { useState, useEffect } from 'react'
import { mountPage } from '../../src/js/main.jsx'

function LandingPage() {
  const [income, setIncome] = useState(5000000)
  const [theme, setTheme] = useState(() => {
      return localStorage.getItem('dc-theme') || 'light'
    })

    useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('dc-theme', theme)
    }, [theme])

  const toggleTheme = () => {
      setTheme((current) => current === 'light' ? 'dark' : 'light')
    }
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

      {/* HEADER — SWISS GRID */}
      <header className="dc-header sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="dc-header-inner">

            <a href="/" className="dc-logo" aria-label="Dompet Cerdas">
              <span className="dc-logo-mark">
                <svg className="icon size-5" aria-hidden="true">
                  <use href="#i-wallet" />
                </svg>
              </span>
              <span>DOMPET CERDAS<span className="dc-logo-dot">.</span></span>
            </a>

            <nav className="dc-nav hidden lg:flex"
              aria-label="Navigasi utama">
              <a href="#masalah">Tantangan</a>
              <a href="#fitur">Fitur</a>
              <a href="#simulasi">Simulasi</a>
              <a href="#edukasi">Edukasi</a>
            </nav>

            <div className="flex items-center gap-3">

              {/* THEME TOGGLE */}
              <button
                type="button"
                onClick={toggleTheme}
                className="dc-theme-toggle"
                aria-label={
                  theme === 'light'
                    ? 'Aktifkan dark mode'
                    : 'Aktifkan light mode'
                }
                title="Ganti tema"
              >
                {theme === 'light' ? (
                  <svg className="icon size-5" viewBox="0 0 24 24"
                    aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
                  </svg>
                ) : (
                  <svg className="icon size-5" viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
                  </svg>
                )}
              </button>

              <a
                href="/pages/html/dashboard.html"
                className="dc-header-cta"
              >
                Masuk ke Dasbor
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          {/* MOBILE NAVIGATION */}
          <nav className="dc-mobile-nav lg:hidden"
            aria-label="Navigasi seluler">
            <a href="#masalah">Tantangan</a>
            <a href="#fitur">Fitur</a>
            <a href="#simulasi">Simulasi</a>
            <a href="#edukasi">Edukasi</a>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO — SWISS GRID */}
        <section className="dc-hero">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* HERO TOP LABEL */}
            <div className="dc-hero-top">
              <span>PERSONAL FINANCE PLATFORM</span>
              <span>INDONESIA · 2026</span>
            </div>

            {/* HERO GRID */}
            <div className="dc-hero-grid">

              {/* LEFT CONTENT */}
              <div className="dc-hero-content">

                <p className="dc-eyebrow">
                  <span className="dc-eyebrow-line"></span>
                  FINANCIAL WELLNESS, SIMPLIFIED
                </p>

                <h1>
                  Atur uang.
                  <br />
                  <span>Rencanakan</span>
                  <br />
                  masa depan.
                </h1>

                <p className="dc-hero-description">
                  Kelola arus kas, pantau tagihan, dan bangun
                  kebiasaan finansial yang lebih baik dalam
                  satu tempat.
                </p>

                <div className="dc-hero-actions">
                  <a
                    href="/pages/html/dashboard.html"
                    className="dc-primary-button"
                  >
                    Buka Dasbor
                    <span aria-hidden="true">↗</span>
                  </a>

                  <a href="#fitur" className="dc-text-link">
                    Jelajahi fitur <span aria-hidden="true">→</span>
                  </a>
                </div>

                <div className="dc-hero-note">
                  <span className="dc-status-dot"></span>
                  Demo edukasi · Tidak terhubung ke rekening bank
                </div>
              </div>

              {/* RIGHT DASHBOARD PREVIEW */}
              <div className="dc-hero-visual">

                <div className="dc-preview-heading">
                  <span>01 / DASHBOARD PREVIEW</span>
                  <span>LIVE DEMO</span>
                </div>

                <div className="dc-preview-card">

                  <div className="dc-preview-top">
                    <div>
                      <span className="dc-preview-label">
                        TOTAL PENGELUARAN
                      </span>
                      <h2>Rp 1.450.000</h2>
                    </div>

                    <span className="dc-preview-icon">
                      ↗
                    </span>
                  </div>

                  <div className="dc-preview-chart">
                    <div className="dc-chart-labels">
                      <span>Pengeluaran mingguan</span>
                      <span>+12.5%</span>
                    </div>

                    <div className="dc-chart-bars">
                      <span style={{ height: '35%' }}></span>
                      <span style={{ height: '52%' }}></span>
                      <span style={{ height: '42%' }}></span>
                      <span style={{ height: '75%' }}></span>
                      <span style={{ height: '60%' }}></span>
                      <span style={{ height: '90%' }}></span>
                      <span style={{ height: '68%' }}></span>
                    </div>

                    <div className="dc-chart-days">
                      <span>Sen</span>
                      <span>Sel</span>
                      <span>Rab</span>
                      <span>Kam</span>
                      <span>Jum</span>
                      <span>Sab</span>
                      <span>Min</span>
                    </div>
                  </div>

                  <div className="dc-preview-divider"></div>

                  <div className="dc-preview-bottom">
                    <div>
                      <span className="dc-preview-label">DOMPET BERSAMA</span>
                      <strong>6 anggota</strong>
                    </div>
                    <div className="dc-preview-avatars">
                      <span>SW</span>
                      <span>RP</span>
                      <span>DS</span>
                    </div>
                  </div>
                </div>

                <div className="dc-preview-caption">
                  <span>FIG. 01</span>
                  <span>Contoh tampilan aplikasi Dompet Cerdas</span>
                </div>
              </div>
            </div>

            {/* BOTTOM METRICS */}
            <div className="dc-hero-bottom">
              <div>
                <strong>50 / 30 / 20</strong>
                <span>Metode alokasi anggaran</span>
              </div>
              <div>
                <strong>01</strong>
                <span>Satu tempat untuk mengelola</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Demo edukasi gratis</span>
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
