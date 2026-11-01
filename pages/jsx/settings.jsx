import { useState } from 'react'
import { Camera, Check, ChevronRight, Eye, Globe2, KeyRound, LockKeyhole } from 'lucide-react'
import { Modal } from '../../src/components/Modal.jsx'
import { useAppState } from '../../src/hooks/useAppState.js'
import { useTheme } from '../../src/hooks/useTheme.jsx'
import { mountPage } from '../../src/js/main.jsx'
import { ThemeToggle } from './settings/ThemeToggle.jsx'

const DEMO_DATA_KEY = 'dompet-cerdas-v1'
const SETTINGS_KEY = 'dompet-cerdas-settings'

const DEFAULT_SETTINGS = {
  profile: {
    name: 'Sari Wulandari',
    username: 'sariwulandari',
    email: '',
    phone: '',
    country: 'Indonesia',
    description: '',
    avatar: '',
  },
  accessibility: { fontSize: 'default', highContrast: false, reducedMotion: false },
  language: 'id',
}

function readSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
    return {
      ...DEFAULT_SETTINGS,
      ...stored,
      profile: { ...DEFAULT_SETTINGS.profile, ...stored.profile },
      accessibility: { ...DEFAULT_SETTINGS.accessibility, ...stored.accessibility },
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function SettingsPage() {
  const [appState, updateAppState] = useAppState()
  const { theme, setTheme, error: themeError } = useTheme()
  const [settings, setSettings] = useState(readSettings)
  const [resetOpen, setResetOpen] = useState(false)
  const [resetError, setResetError] = useState('')
  const [notificationError, setNotificationError] = useState('')
  const [settingsError, setSettingsError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  function updateSettings(changes) {
    const next = {
      ...settings,
      ...changes,
      profile: { ...settings.profile, ...(changes.profile || {}) },
      accessibility: { ...settings.accessibility, ...(changes.accessibility || {}) },
    }
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
      setSettings(next)
      setSettingsError('')
      setSavedMessage('')
      const root = document.documentElement
      root.dataset.fontSize = next.accessibility.fontSize
      root.dataset.highContrast = String(next.accessibility.highContrast)
      root.dataset.reducedMotion = String(next.accessibility.reducedMotion)
      return true
    } catch {
      setSettingsError('Pengaturan tidak dapat disimpan. Periksa ruang penyimpanan browser.')
      setSavedMessage('')
      return false
    }
  }

  function handleProfileSave(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const saved = updateSettings({
      profile: {
        name: data.get('name').trim(),
        username: data.get('username').trim().replace(/^@/, ''),
        email: data.get('email').trim(),
        phone: data.get('phone').trim(),
        country: data.get('country').trim(),
        description: data.get('description').trim(),
      },
    })
    if (saved) setSavedMessage('Profil berhasil disimpan di browser ini.')
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setSettingsError('Pilih file gambar untuk foto profil.')
      return
    }
    if (file.size > 1024 * 1024) {
      setSettingsError('Ukuran foto profil maksimal 1 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => updateSettings({ profile: { avatar: reader.result } })
    reader.onerror = () => setSettingsError('Foto profil tidak dapat dibaca.')
    reader.readAsDataURL(file)
  }

  function handleNotificationsChange(event) {
    const nextState = { ...appState, muted: !event.target.checked }
    try {
      localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(nextState))
      updateAppState(nextState)
      setNotificationError('')
    } catch {
      setNotificationError('Preferensi notifikasi tidak dapat disimpan. Periksa ruang penyimpanan browser.')
    }
  }

  function handleReset() {
    try {
      localStorage.removeItem(DEMO_DATA_KEY)
      window.location.reload()
    } catch {
      setResetError('Data demo tidak dapat dihapus. Periksa pengaturan penyimpanan browser.')
      return false
    }
  }

  return (
    <>
      <svg className="hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <symbol id="i-wallet" viewBox="0 0 24 24">
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <path d="M2 10h20M16 14h2" />
          </symbol>
          <symbol id="i-home" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" />
          </symbol>
          <symbol id="i-chart" viewBox="0 0 24 24">
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </symbol>
          <symbol id="i-calc" viewBox="0 0 24 24">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M8 6h8M8 10h8M8 14h2M8 18h2M14 14h2M14 18h2" />
          </symbol>
          <symbol id="i-gear" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </symbol>
        </defs>
      </svg>

      <div className="flex min-h-[calc(100dvh-1.5rem)] flex-col gap-3 rounded-[2.5rem] bg-panel p-2 pb-20 lg:min-h-[calc(100dvh-2rem)] lg:flex-row lg:gap-4 lg:p-4 lg:pb-4">
        <aside
          className="app-sidebar"
          aria-label="Navigasi"
        >
          <a
            href="/"
            className="mb-0 grid size-11 shrink-0 place-items-center rounded-full bg-primary text-white transition hover:bg-primary/80 lg:mb-3 lg:size-10"
            aria-label="Dompet Cerdas, beranda"
          >
            <svg className="icon" aria-hidden="true"><use href="#i-wallet" /></svg>
          </a>
          <nav aria-label="Halaman utama">
            <ul className="flex flex-row gap-0 lg:flex-col lg:gap-1" role="list">
              <li>
                <a href="/pages/html/dashboard.html" className="nav-link" aria-label="Dashboard">
                  <svg className="icon" aria-hidden="true"><use href="#i-home" /></svg>
                </a>
              </li>
              <li>
                <a href="/pages/html/finances.html" className="nav-link" aria-label="Keuangan">
                  <svg className="icon" aria-hidden="true"><use href="#i-chart" /></svg>
                </a>
              </li>
              <li>
                <a href="/pages/html/simulator.html" className="nav-link" aria-label="Simulator">
                  <svg className="icon" aria-hidden="true"><use href="#i-calc" /></svg>
                </a>
              </li>
              <li>
                <a
                  href="/pages/html/settings.html"
                  className="nav-link"
                  aria-label="Pengaturan"
                  aria-current="page"
                >
                  <svg className="icon" aria-hidden="true"><use href="#i-gear" /></svg>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-sm font-semibold text-primary">Preferensi</p>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Pengaturan</h1>
          <p className="mt-3 leading-7 text-muted">
            Personalisasi akun demo dan pengalaman penggunaan Anda.
          </p>
        </div>

        <nav className="settings-nav mb-6 flex flex-wrap gap-2" aria-label="Bagian pengaturan">
          {[
            ['#profile', 'Profil'],
            ['#privacy', 'Privasi'],
            ['#preferences', 'Preferensi'],
            ['#security', 'Keamanan'],
            ['#language', 'Bahasa'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="settings-nav-link">
              {label}<ChevronRight aria-hidden="true" size={14} />
            </a>
          ))}
        </nav>

        <section id="profile" aria-labelledby="profile-heading" className="card settings-card settings-profile mb-6 overflow-hidden p-0">
          <div className="settings-profile-banner flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
            <div className="settings-avatar-wrap">
              {settings.profile.avatar ? (
                <img src={settings.profile.avatar} alt="" className="settings-avatar" />
              ) : (
                <span className="settings-avatar settings-avatar-fallback" aria-hidden="true">
                  {(settings.profile.name || 'S').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
                </span>
              )}
              <label htmlFor="profile-picture" className="settings-avatar-upload" title="Ubah foto profil">
                <Camera size={16} aria-hidden="true" />
                <span className="sr-only">Pilih foto profil</span>
              </label>
              <input id="profile-picture" type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary">Akun demo</p>
              <h2 id="profile-heading" className="mt-1 text-2xl font-bold tracking-tight text-ink">
                {settings.profile.name || 'Profil Anda'}
              </h2>
              <p className="mt-1 text-sm text-muted">
                @{settings.profile.username || 'pengguna'} · Data profil hanya tersimpan di browser ini.
              </p>
            </div>
            <span className="settings-demo-badge sm:ml-auto">Profil lokal</span>
          </div>
          <form onSubmit={handleProfileSave} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">
            <label className="settings-field">
              <span>Nama lengkap</span>
              <input name="name" defaultValue={settings.profile.name} required maxLength={80} autoComplete="name" />
            </label>
            <label className="settings-field">
              <span>Username</span>
              <input name="username" defaultValue={settings.profile.username} maxLength={30} autoComplete="username" />
            </label>
            <label className="settings-field">
              <span>Email</span>
              <input name="email" type="email" defaultValue={settings.profile.email} autoComplete="email" placeholder="nama@email.com" />
            </label>
            <label className="settings-field">
              <span>Nomor telepon</span>
              <input name="phone" type="tel" defaultValue={settings.profile.phone} autoComplete="tel" placeholder="+62" />
            </label>
            <label className="settings-field">
              <span>Negara</span>
              <input name="country" defaultValue={settings.profile.country} maxLength={60} autoComplete="country-name" />
            </label>
            <label className="settings-field sm:col-span-2">
              <span>Deskripsi</span>
              <textarea name="description" rows="3" maxLength="350" defaultValue={settings.profile.description} placeholder="Ceritakan sedikit tentang diri Anda." />
              <span className="settings-field-hint">Maksimal 350 karakter.</span>
            </label>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              <button type="submit" className="btn bg-primary text-white hover:bg-primary/90">
                <Check size={16} aria-hidden="true" /> Simpan profil
              </button>
              {savedMessage && <p className="text-sm text-muted" role="status">{savedMessage}</p>}
              {settingsError && <p className="text-sm text-red-600" role="alert">{settingsError}</p>}
            </div>
          </form>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,1fr)]">
          <section id="preferences" aria-labelledby="appearance-heading" className="card settings-card border border-line p-5 sm:p-7">
            <h2 id="appearance-heading" className="mb-5 text-lg font-bold text-ink">Tampilan</h2>
            <ThemeToggle value={theme} onChange={setTheme} />
            {themeError && (
              <p className="mt-4 text-sm text-muted" role="status">{themeError}</p>
            )}
            <div className="settings-divider mt-6 pt-5">
              <div className="mb-4 flex items-center gap-2">
                <Eye size={18} aria-hidden="true" className="text-primary" />
                <h3 className="text-base font-bold text-ink">Aksesibilitas</h3>
              </div>
              <label className="settings-field">
                <span>Ukuran teks</span>
                <select
                  value={settings.accessibility.fontSize}
                  onChange={(event) => updateSettings({ accessibility: { fontSize: event.target.value } })}
                >
                  <option value="small">Kecil</option>
                  <option value="default">Standar</option>
                  <option value="large">Besar</option>
                  <option value="extra-large">Ekstra besar</option>
                </select>
              </label>
              <label className="settings-switch-row mt-4">
                <span>
                  <span className="block font-semibold text-ink">Kontras tinggi</span>
                  <span className="mt-1 block text-sm text-muted">Tingkatkan kontras teks dan garis pemisah.</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.accessibility.highContrast}
                  onChange={(event) => updateSettings({ accessibility: { highContrast: event.target.checked } })}
                />
              </label>
              <label className="settings-switch-row mt-3">
                <span>
                  <span className="block font-semibold text-ink">Kurangi animasi</span>
                  <span className="mt-1 block text-sm text-muted">Matikan gerakan dan transisi dekoratif.</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.accessibility.reducedMotion}
                  onChange={(event) => updateSettings({ accessibility: { reducedMotion: event.target.checked } })}
                />
              </label>
              <p className="mt-4 text-xs leading-5 text-muted">
                Navigasi keyboard dan indikator fokus tetap tersedia untuk semua kontrol.
              </p>
            </div>
          </section>

          <section aria-labelledby="notification-heading" className="card settings-card border border-line p-5 sm:p-7">
            <h2 id="notification-heading" className="text-lg font-bold text-ink">Notifikasi</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Atur apakah notifikasi demo ditampilkan di dasbor.
            </p>
            <label className="mt-6 flex items-start gap-3">
              <input
                type="checkbox"
                checked={!appState.muted}
                onChange={handleNotificationsChange}
                className="mt-1 size-4 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
              <span>
                <span className="block font-semibold text-ink">Tampilkan notifikasi</span>
                <span className="mt-1 block text-sm text-muted">
                  {!appState.muted ? 'Notifikasi dasbor aktif.' : 'Notifikasi dasbor dinonaktifkan.'}
                </span>
              </span>
            </label>
            {notificationError && (
              <p className="mt-4 text-sm text-muted" role="alert">{notificationError}</p>
            )}
          </section>

          <section id="privacy" aria-labelledby="privacy-heading" className="card settings-card border border-line p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <LockKeyhole size={18} aria-hidden="true" className="text-primary" />
              <h2 id="privacy-heading" className="text-lg font-bold text-ink">Privasi</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              Data transaksi, profil, dan preferensi demo disimpan di penyimpanan lokal browser ini. Tidak ada akun daring atau sinkronisasi server.
            </p>
            <p className="mt-4 rounded-2xl border border-line bg-canvas/70 p-4 text-sm leading-6 text-ink">
              Gunakan perangkat pribadi dan hapus data demo sebelum membagikan perangkat.
            </p>
          </section>

          <section id="security" aria-labelledby="security-heading" className="card settings-card border border-line p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <KeyRound size={18} aria-hidden="true" className="text-primary" />
              <h2 id="security-heading" className="text-lg font-bold text-ink">Keamanan</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              Ini adalah demo lokal tanpa autentikasi, kata sandi, atau sesi akun. Jangan masukkan kredensial asli.
            </p>
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-line bg-canvas/70 p-4">
              <LockKeyhole size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
              <p className="text-sm leading-6 text-ink">Perubahan hanya terlihat di browser dan perangkat ini.</p>
            </div>
          </section>

          <section id="language" aria-labelledby="language-heading" className="card settings-card border border-line p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <Globe2 size={18} aria-hidden="true" className="text-primary" />
              <h2 id="language-heading" className="text-lg font-bold text-ink">Bahasa</h2>
            </div>
            <label className="settings-field mt-4">
              <span>Bahasa pilihan</span>
              <select
                value={settings.language}
                onChange={(event) => updateSettings({ language: event.target.value })}
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </label>
            <p className="mt-3 text-xs leading-5 text-muted">
              Pilihan disimpan di browser. Terjemahan antarmuka lengkap belum tersedia di demo ini.
            </p>
          </section>

          <section aria-labelledby="data-heading" className="card settings-card border border-line p-5 sm:p-7 lg:col-span-2">
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <h2 id="data-heading" className="text-lg font-bold text-ink">Data demo</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Kembalikan transaksi, pengingat, dan preferensi notifikasi demo ke kondisi awal. Tema pilihan Anda tidak berubah.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setResetError('')
                  setResetOpen(true)
                }}
                className="shrink-0 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-panel"
              >
                Reset data demo
              </button>
            </div>
          </section>
        </div>
        <footer className="mt-12 border-t border-line pt-5 text-sm text-muted">
          Dompet Cerdas adalah demo edukasi dan tidak memindahkan uang sungguhan.
        </footer>
        </main>
      </div>

      <Modal
        isOpen={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset data demo?"
        onSubmit={handleReset}
        submitLabel="Reset data"
      >
        <p className="leading-6 text-muted">
          Semua perubahan pada data demo akan dihapus dan diganti dengan data awal. Tindakan ini tidak dapat dibatalkan.
        </p>
        {resetError && <p className="text-sm text-muted" role="alert">{resetError}</p>}
      </Modal>
    </>
  )
}

mountPage(SettingsPage, { effects: true })