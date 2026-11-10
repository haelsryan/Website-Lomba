
import { useState } from 'react'
import { Modal } from '../components/ui/Modal.jsx'
import { DashboardSidebar } from '../components/layout/DashboardSidebar.jsx'
import { GlobalHeader } from '../components/layout/GlobalHeader.jsx'
import { ProfileSettings } from '../components/settings/ProfileSettings.jsx'
import { useAppState } from '../hooks/useAppState.js'
import { useTheme } from '../hooks/useTheme.js'
import { useMotion } from '../hooks/useMotion.js'
import { mountPage } from '../main.jsx'
import { ThemeToggle } from '../components/settings/ThemeToggle.jsx'
import { ProtectedPage } from '../components/auth/ProtectedPage.jsx'


const DEMO_DATA_KEY = 'dompet-cerdas-v1'

function SettingsPage() {
  const [appState, updateAppState] = useAppState()
  const {
    theme,
    setTheme,
    error: themeError,
  } = useTheme()
  const { reducedMotion, toggleReducedMotion } = useMotion()

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
            <GlobalHeader
              title="Pengaturan"
              showDateLine={false}
            />

            {/* Profile Management Section */}
            <ProfileSettings />

            {/* Settings sections */}
            <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,1fr)]">

              {/* Appearance */}
              <section
                aria-labelledby="appearance-heading"
                className="card p-5 sm:p-7"
              >
                <h2
                  id="appearance-heading"
                  className="mb-5 text-xl font-bold text-ink"
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

              {/* Accessibility / Motion & Animation */}
              <section
                aria-labelledby="accessibility-heading"
                className="card p-5 sm:p-7"
              >
                <h2
                  id="accessibility-heading"
                  className="mb-2 text-xl font-bold text-ink"
                >
                  Aksesibilitas
                </h2>

                <p className="text-sm leading-6 text-muted mb-6">
                  Atur kenyamanan visual dan pengalaman gerak antarmuka Moneva.
                </p>

                <div className="rounded-2xl bg-surface/80 dark:bg-white/[0.04] p-4 border border-line/40 dark:border-white/10">
                  <label className="flex items-start justify-between gap-4 cursor-pointer">
                    <div className="space-y-1">
                      <span className="block font-semibold text-sm text-ink">
                        Kurangi Animasi (Reduce Motion)
                      </span>
                      <span className="block text-sm leading-5 text-muted">
                        Kurangi gerakan dan transisi visual untuk pengalaman yang lebih nyaman.
                      </span>
                    </div>

                    <div className="relative inline-flex items-center shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={reducedMotion}
                        onChange={toggleReducedMotion}
                        className="sr-only peer"
                        aria-label="Kurangi animasi"
                      />
                      <div className="w-11 h-6 bg-canvas dark:bg-white/15 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner" />
                    </div>
                  </label>
                </div>
              </section>

              {/* Notifications */}
              <section
                aria-labelledby="notification-heading"
                className="card p-5 sm:p-7"
              >
                <h2
                  id="notification-heading"
                  className="text-xl font-bold text-ink"
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
                className="card p-5 sm:p-7 lg:col-span-2"
              >
                <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">

                  <div className="max-w-xl">
                    <h2
                      id="data-heading"
                      className="text-xl font-bold text-ink"
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
                    className="shrink-0 rounded-xl border border-line dark:border-white/15 px-4 py-2.5 text-sm font-semibold text-ink dark:text-slate-200 bg-surface/80 dark:bg-white/5 hover:bg-panel dark:hover:bg-white/10 hover:border-line dark:hover:border-white/25 transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
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

mountPage(() => (
  <ProtectedPage>
    <SettingsPage />
  </ProtectedPage>
), { effects: true })
