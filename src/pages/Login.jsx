import { useState, useEffect } from 'react'
import { mountPage } from '../main.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import logo from "../img/logo_transparan.png"


function Icon({ name, className = 'size-5' }) {
  const icons = {
    wallet: (
      <>
        <path d="M20 7H5a2 2 0 0 1 0-4h13v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h15V7" />
        <circle cx="16.5" cy="14" r="1" />
      </>
    ),
    eye: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    'eye-off': (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ),
    mail: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    'arrow-left': (
      <>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    ),
  }

  return (
    <svg
      className={`icon ${className}`}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name] || null}
    </svg>
  )
}

function LoginPage() {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/pages/dashboard.html'
    }
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    clearError()

    const result = await login(formData.email, formData.password, formData.rememberMe)

    if (!result.success) {
      setLocalError(result.error)
    } else {
      window.location.href = '/pages/dashboard.html'
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (localError) setLocalError('')
    if (error) clearError()
  }

  const displayError = localError || error

  return (
    <div className="auth-page min-h-screen bg-canvas relative overflow-hidden">
      {/* Background wallpaper */}
      <div className="auth-bg fixed inset-0 z-0">
        <div className="auth-bg-image absolute inset-0 bg-cover bg-center bg-no-repeat" />
        <div className="auth-bg-overlay absolute inset-0 bg-canvas/85 dark:bg-canvas/90" />
      </div>

      <div className="auth-container relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="auth-header flex items-center justify-between px-6 py-5 sm:px-8">
          <a
            href="/"
            className="auth-brand inline-flex items-center gap-3 text-ink transition-opacity hover:opacity-80"
            aria-label="Kembali ke beranda"
          >
            <span className="grid size-10 shrink-0 place-items-center" aria-hidden="true">
              <img
                src={logo}
                alt=""
                className="w-10 h-10 object-contain"
              />
            </span>
            <span className="text-base font-bold tracking-tight sm:text-lg">Moneva</span>
          </a>

          <a
            href="/pages/signup.html"
            className="auth-signup-link text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Buat akun
          </a>
        </header>

        {/* Main content */}
        <main className="auth-main flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
          <div className="auth-card w-full max-w-md">
            {/* Card container with glassmorphism */}
            <div className="auth-card-inner rounded-3xl bg-surface/95 dark:bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl border border-white/30 dark:border-white/10">
              {/* Title */}
              <div className="auth-card-header mb-8 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Selamat datang kembali
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Masuk ke akun Moneva Anda untuk melanjutkan
                </p>
              </div>

              {/* Error message */}
              {displayError && (
                <div className="auth-error mb-6 flex items-center gap-3 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-400" role="alert">
                  <Icon name="alert" className="size-5 shrink-0" />
                  <span>{displayError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="auth-form grid gap-5">
                {/* Email field */}
                <div className="auth-field grid gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-ink">
                    Email
                  </label>
                  <div className="auth-input-wrap relative">
                    <span className="auth-input-icon absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                      <Icon name="mail" className="size-5" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="nama@email.com"
                      autoComplete="email"
                      required
                      className="auth-input w-full rounded-2xl border border-line/60 dark:border-white/15 bg-canvas/50 dark:bg-white/5 pl-12 pr-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="auth-field grid gap-2">
                  <label htmlFor="password" className="text-sm font-semibold text-ink">
                    Kata sandi
                  </label>
                  <div className="auth-input-wrap relative">
                    <span className="auth-input-icon absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                      <Icon name="lock" className="size-5" />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Masukkan kata sandi"
                      autoComplete="current-password"
                      required
                      className="auth-input w-full rounded-2xl border border-line/60 dark:border-white/15 bg-canvas/50 dark:bg-white/5 pl-12 pr-12 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-password-toggle absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
                      aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      <Icon name={showPassword ? 'eye-off' : 'eye'} className="size-5" />
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot password */}
                <div className="auth-options flex items-center justify-between">
                  <label className="auth-remember flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                      className="auth-checkbox size-5 rounded-lg border border-line/60 dark:border-white/15 bg-canvas/50 dark:bg-white/5 text-primary transition-colors focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm text-muted">Ingat saya</span>
                  </label>

                  <button
                    type="button"
                    className="auth-forgot text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    onClick={() => {
                      // Mock forgot password - show alert
                      alert('Fitur lupa kata sandi akan segera tersedia. Silakan hubungi support@moneva.id')
                    }}
                  >
                    Lupa kata sandi?
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="auth-submit mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isLoading ? (
                    <>
                      <svg className="auth-spinner size-5 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="auth-divider my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-line/40 dark:bg-white/10" />
                <span className="text-xs font-medium text-muted">ATAU</span>
                <div className="h-px flex-1 bg-line/40 dark:bg-white/10" />
              </div>

              {/* Demo access */}
              <div className="auth-demo text-center">
                <p className="text-xs text-muted mb-3">
                  Demo: Gunakan email dan kata sandi apapun untuk mencoba
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      email: 'demo@moneva.id',
                      password: 'demo123',
                      rememberMe: true,
                    })
                  }}
                  className="auth-demo-fill text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Isi dengan akun demo
                </button>
              </div>
            </div>

            {/* Sign up link */}
            <p className="auth-signup-cta mt-6 text-center text-sm text-muted">
              Belum punya akun?{' '}
              <a
                href="/pages/signup.html"
                className="font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Daftar sekarang
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

// Wrap with AuthProvider for useAuth to work
import { AuthProvider } from '../context/AuthContext.jsx'

function LoginPageWithProvider() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  )
}

mountPage(LoginPageWithProvider)
