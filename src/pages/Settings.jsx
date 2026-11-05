
import { useState } from 'react'
import { Modal } from '../components/ui/Modal.jsx'
import { DashboardSidebar } from '../components/layout/DashboardSidebar.jsx'
import { useAppState } from '../hooks/useAppState.js'
import { useTheme } from '../hooks/useTheme.js'
import { mountPage } from '../main.jsx'
import { ThemeToggle } from '../components/settings/ThemeToggle.jsx'

const DEMO_DATA_KEY = 'dompet-cerdas-v1'

function SettingsPage() {
  const [appState, updateAppState] = useAppState()
  const {
    theme,
    setTheme,
    error: themeError,
  } = useTheme()

  const [resetOpen, setResetOpen] = useState(false)
  const [resetError, setResetError] = useState('')
  const [notificationError, setNotificationError] = useState('')

  // ================================================
  // Notification settings
  // ================================================

  function handleNotificationsChange(event) {
    const nextState = {
      ...appState,
      muted: !event.target.checked,
    }

    try {
      localStorage.setItem(
        DEMO_DATA_KEY,
        JSON.stringify(nextState)
      )

      updateAppState(nextState)
      setNotificationError('')
    } catch {
      setNotificationError(
        'Preferensi notifikasi tidak dapat disimpan. Periksa ruang penyimpanan browser.'
      )
    }
  }

  // ================================================
  // Reset demo data
  // ================================================

  function handleReset() {
    try {
      localStorage.removeItem(DEMO_DATA_KEY)
      window.location.reload()
    } catch {
      setResetError(
        'Data demo tidak dapat dihapus. Periksa pengaturan penyimpanan browser.'
      )

      return false
    }
  }

  // ================================================
  // Main render
  // ================================================

  return (
    <>
      <div className="dashboard-layout settings-layout">

        {/* Shared Moneva sidebar */}
        <DashboardSidebar page="settings" />

        {/* Settings workspace */}
        <div className="dashboard-workspace settings-workspace">
          <main className="dashboard-main settings-main">

            {/* Page header */}
            <div className="mb-8 max-w-2xl">
              <p className="mb-2 text-sm font-semibold text-primary">
                Preferensi
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Pengaturan
              </h1>

              <p className="mt-3 leading-7 text-muted">
                Atur tampilan dan notifikasi.
                Perubahan hanya disimpan di browser ini.
              </p>
            </div>

            {/* Settings sections */}
            <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,1fr)]">

              {/* Appearance */}
              <section
                aria-labelledby="appearance-heading"
                className="card border border-line p-5 sm:p-7"
              >
                <h2
                  id="appearance-heading"
                  className="mb-5 text-lg font-bold text-ink"
                >
                  Tampilan
                </h2>

                <ThemeToggle
                  value={theme}
                  onChange={setTheme}
                />

                {themeError && (
                  <p
                    className="mt-4 text-sm text-muted"
                    role="status"
                  >
                    {themeError}
                  </p>
                )}
              </section>

              {/* Notifications */}
              <section
                aria-labelledby="notification-heading"
                className="card border border-line p-5 sm:p-7"
              >
                <h2
                  id="notification-heading"
                  className="text-lg font-bold text-ink"
                >
                  Notifikasi
                </h2>

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
                    <span className="block font-semibold text-ink">
                      Tampilkan notifikasi
                    </span>

                    <span className="mt-1 block text-sm text-muted">
                      {!appState.muted
                        ? 'Notifikasi dasbor aktif.'
                        : 'Notifikasi dasbor dinonaktifkan.'}
                    </span>
                  </span>
                </label>

                {notificationError && (
                  <p
                    className="mt-4 text-sm text-muted"
                    role="alert"
                  >
                    {notificationError}
                  </p>
                )}
              </section>

              {/* Demo data */}
              <section
                aria-labelledby="data-heading"
                className="card border border-line p-5 sm:p-7 lg:col-span-2"
              >
                <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">

                  <div className="max-w-xl">
                    <h2
                      id="data-heading"
                      className="text-lg font-bold text-ink"
                    >
                      Data demo
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted">
                      Kembalikan transaksi, pengingat, dan preferensi
                      notifikasi demo ke kondisi awal. Tema pilihan
                      Anda tidak berubah.
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

            {/* Footer */}
            <footer className="mt-12 border-t border-line pt-5 text-sm text-muted">
              Moneva adalah demo edukasi dan tidak memindahkan uang sungguhan.
            </footer>

          </main>
        </div>
      </div>

      {/* Reset confirmation */}
      <Modal
        isOpen={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset data demo?"
        onSubmit={handleReset}
        submitLabel="Reset data"
      >
        <p className="leading-6 text-muted">
          Semua perubahan pada data demo akan dihapus dan diganti
          dengan data awal. Tindakan ini tidak dapat dibatalkan.
        </p>

        {resetError && (
          <p className="text-sm text-muted" role="alert">
            {resetError}
          </p>
        )}
      </Modal>
    </>
  )
}

mountPage(SettingsPage, { effects: true })
