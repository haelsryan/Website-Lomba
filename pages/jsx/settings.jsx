import { useState } from 'react'
import { Modal } from '../../src/components/Modal.jsx'
import { useAppState } from '../../src/hooks/useAppState.js'
import { useTheme } from '../../src/hooks/useTheme.jsx'
import { mountPage } from '../../src/js/main.jsx'
import { ThemeToggle } from './settings/ThemeToggle.jsx'

const DEMO_DATA_KEY = 'dompet-cerdas-v1'

function SettingsPage() {
  const [appState, updateAppState] = useAppState()
  const { theme, setTheme, error: themeError } = useTheme()
  const [resetOpen, setResetOpen] = useState(false)
  const [resetError, setResetError] = useState('')
  const [notificationError, setNotificationError] = useState('')

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

      <div className="flex min-h-[calc(100dvh-1.5rem)] flex-col gap-3 rounded-[2.5rem] bg-panel p-2 lg:min-h-[calc(100dvh-2rem)] lg:flex-row lg:gap-4 lg:p-4">
        <aside
          className="app-sidebar flex w-full shrink-0 flex-row items-center justify-between gap-0 rounded-[2rem] bg-navy p-1 lg:w-14 lg:flex-col lg:items-center lg:justify-start lg:gap-1 lg:px-0 lg:py-5"
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
            Atur tampilan dan notifikasi. Perubahan hanya disimpan di browser ini.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,1fr)]">
          <section aria-labelledby="appearance-heading" className="card border border-line p-5 sm:p-7">
            <h2 id="appearance-heading" className="mb-5 text-lg font-bold text-ink">Tampilan</h2>
            <ThemeToggle value={theme} onChange={setTheme} />
            {themeError && (
              <p className="mt-4 text-sm text-muted" role="status">{themeError}</p>
            )}
          </section>

          <section aria-labelledby="notification-heading" className="card border border-line p-5 sm:p-7">
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

          <section aria-labelledby="data-heading" className="card border border-line p-5 sm:p-7 lg:col-span-2">
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