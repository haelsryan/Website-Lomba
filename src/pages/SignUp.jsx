import { useState, useEffect } from 'react'
import { mountPage } from '../main.jsx'
import { useAuth } from '../context/AuthContext.jsx'

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
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
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
    alert: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    ),
    'check-circle': (
      <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </>
    ),
    briefcase: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </>
    ),
    graduation: (
      <>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </>
    ),
    home: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
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

const USER_TYPES = [
  { id: 'student', label: 'Pelajar/Mahasiswa', icon: 'graduation', description: 'Sedang menempuh pendidikan' },
  { id: 'professional', label: 'Young Professional', icon: 'briefcase', description: 'Sudah bekerja' },
  { id: 'household', label: 'Ibu Rumah Tangga', icon: 'home', description: 'Mengelola keuangan keluarga' },
]

function SignUpPage() {
  const { signup, isLoading, error, clearError, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'professional',
    termsAccepted: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/pages/dashboard.html'
    }
  }, [isAuthenticated])

  // Calculate password strength
  useEffect(() => {
    const password = formData.password
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    setPasswordStrength(strength)
  }, [formData.password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    clearError()

    const result = await signup(formData)

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

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-rose-500'
    if (passwordStrength <= 3) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return 'Lemah'
    if (passwordStrength <= 3) return 'Sedang'
    return 'Kuat'
  }

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
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 text-white shadow-md shadow-primary/25">
              <Icon name="wallet" className="size-5" />
            </span>
            <span className="text-base font-bold tracking-tight sm:text-lg">Moneva</span>
          </a>

          <a
            href="/pages/login.html"
            className="auth-login-link text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Masuk
          </a>
        </header>

        {/* Main content */}
        <main className="auth-main flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
          <div className="auth-card w-full max-w-md">
            {/* Card container with glassmorphism */}
            <div className="auth-card-inner rounded-3xl bg-surface/95 dark:bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl border border-white/30 dark:border-white/10">
              {/* Title */}
              <div className="auth-card-header mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Buat akun Moneva
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Gratis selamanya. Tanpa kartu kredit.
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
              <form onSubmit={handleSubmit} className="auth-form grid gap-4">
                {/* Name field */}
                <div className="auth-field grid gap-2">
                  <label htmlFor="name" className="text-sm font-semibold text-ink">
                    Nama lengkap
                  </label>
                  <div className="auth-input-wrap relative">
                    <span className="auth-input-icon absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                      <Icon name="user" className="size-5" />
                    </span>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      autoComplete="name"
                      required
                      className="auth-input w-full rounded-2xl border border-line/60 dark:border-white/15 bg-canvas/50 dark:bg-white/5 pl-12 pr-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

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
                      placeholder="Minimal 6 karakter"
                      autoComplete="new-password"
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
                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="auth-strength flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-line/40 dark:bg-white/10 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted">{getStrengthLabel()}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password field */}
                <div className="auth-field grid gap-2">
                  <label htmlFor="confirmPassword" className="text-sm font-semibold text-ink">
                    Konfirmasi kata sandi
                  </label>
                  <div className="auth-input-wrap relative">
                    <span className="auth-input-icon absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                      <Icon name="lock" className="size-5" />
                    </span>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Ulangi kata sandi"
                      autoComplete="new-password"
                      required
                      className="auth-input w-full rounded-2xl border border-line/60 dark:border-white/15 bg-canvas/50 dark:bg-white/5 pl-12 pr-12 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="auth-password-toggle absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
                      aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} className="size-5" />
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-rose-500 mt-1">Kata sandi tidak cocok</p>
                  )}
                </div>

                {/* User type selection */}
                <div className="auth-field grid gap-2">
                  <label className="text-sm font-semibold text-ink">
                    Anda adalah...
                  </label>
                  <div className="auth-user-types grid grid-cols-3 gap-2">
                    {USER_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleInputChange('userType', type.id)}
                        className={`auth-user-type flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-all duration-200 ${
                          formData.userType === type.id
                            ? 'bg-primary/10 border-2 border-primary text-primary'
                            : 'bg-canvas/50 dark:bg-white/5 border border-line/60 dark:border-white/15 text-muted hover:border-primary/40 hover:text-ink'
                        }`}
                      >
                        <Icon name={type.icon} className="size-5" />
                        <span className="text-[11px] font-semibold text-center leading-tight">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terms checkbox */}
                <label className="auth-terms flex items-start gap-3 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                    className="auth-checkbox mt-0.5 size-5 rounded-lg border border-line/60 dark:border-white/15 bg-canvas/50 dark:bg-white/5 text-primary transition-colors focus:ring-2 focus:ring-primary/20 shrink-0"
                  />
                  <span className="text-sm text-muted leading-relaxed">
                    Saya menyetujui{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        alert('Syarat dan Ketentuan Moneva\n\n1. Ini adalah aplikasi demo edukasi.\n2. Tidak ada transaksi uang nyata.\n3. Data yang Anda masukkan disimpan secara lokal di perangkat Anda.')
                      }}
                      className="text-primary font-medium hover:underline"
                    >
                      Syarat dan Ketentuan
                    </button>{' '}
                    dan{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        alert('Kebijakan Privasi Moneva\n\nData Anda disimpan secara lokal di browser Anda. Kami tidak mengirim data ke server manapun.')
                      }}
                      className="text-primary font-medium hover:underline"
                    >
                      Kebijakan Privasi
                    </button>
                  </span>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || !formData.termsAccepted}
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
                      <span>Daftar sekarang</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Login link */}
            <p className="auth-login-cta mt-6 text-center text-sm text-muted">
              Sudah punya akun?{' '}
              <a
                href="/pages/login.html"
                className="font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Masuk
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

function SignUpPageWithProvider() {
  return (
    <AuthProvider>
      <SignUpPage />
    </AuthProvider>
  )
}

mountPage(SignUpPageWithProvider)
