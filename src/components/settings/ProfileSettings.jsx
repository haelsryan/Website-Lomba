import { useState, useEffect, useRef } from 'react'
import {
  useProfile,
  USER_TYPES,
  FINANCIAL_GOALS,
  GENDERS,
} from '../../hooks/useProfile.js'

function ProfileIcon({ name, className = 'size-4' }) {
  const icons = {
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    camera: (
      <>
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    x: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    shield: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
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

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024 // 2MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function ProfileSettings() {
  const { profile, saveProfile } = useProfile()
  const sectionRef = useRef(null)
  const fileInputRef = useRef(null)

  // Form edit state
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)
  const [previewAvatar, setPreviewAvatar] = useState(profile.avatar || '')
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState(null) // { type: 'success' | 'error', text: '' }

  // Sync formData when profile changes outside
  useEffect(() => {
    setFormData(profile)
    setPreviewAvatar(profile.avatar || '')
  }, [profile])

  // Handle URL hash #profile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#profile') {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [])

  // Auto-dismiss success notification
  useEffect(() => {
    if (feedback?.type === 'success') {
      const timer = setTimeout(() => setFeedback(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [feedback])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear specific error on field change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  // Handle Profile Picture Upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation 1: Format
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFeedback({
        type: 'error',
        text: 'Format gambar tidak didukung. Harap gunakan format JPG, PNG, atau WebP.',
      })
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Validation 2: Size
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setFeedback({
        type: 'error',
        text: 'Ukuran gambar terlalu besar. Maksimal 2 MB.',
      })
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Convert file to Data URL
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result === 'string') {
        setPreviewAvatar(result)
        setFormData((prev) => ({ ...prev, avatar: result }))
        setFeedback(null)
      }
    }
    reader.onerror = () => {
      setFeedback({
        type: 'error',
        text: 'Gagal memproses file gambar. Silakan coba kembali.',
      })
    }
    reader.readAsDataURL(file)
  }

  // Remove Profile Picture
  const handleRemoveAvatar = () => {
    setPreviewAvatar('')
    setFormData((prev) => ({ ...prev, avatar: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Start Editing
  const handleStartEdit = () => {
    setIsEditing(true)
    setFormData(profile)
    setPreviewAvatar(profile.avatar || '')
    setErrors({})
    setFeedback(null)
  }

  // Cancel Editing
  const handleCancelEdit = () => {
    setIsEditing(false)
    setFormData(profile)
    setPreviewAvatar(profile.avatar || '')
    setErrors({})
    setFeedback(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Save Changes
  const handleSave = (e) => {
    e.preventDefault()
    setFeedback(null)

    const result = saveProfile({
      ...formData,
      avatar: previewAvatar,
    })

    if (result.success) {
      setIsEditing(false)
      setFeedback({
        type: 'success',
        text: 'Profil berhasil diperbarui dan tersimpan.',
      })
      setErrors({})
    } else {
      setErrors(result.errors || {})
      setFeedback({
        type: 'error',
        text:
          result.errors?.general ||
          'Mohon perbaiki data pada kolom yang ditandai.',
      })
    }
  }

  const initials = (profile.name || 'Demo')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <section
      id="profile-section"
      ref={sectionRef}
      aria-labelledby="profile-heading"
      className="card mb-8 p-6 sm:p-8"
    >
      {/* Top Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-line/40 dark:border-white/10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Manajemen Akun
          </span>
          <h2 id="profile-heading" className="text-xl sm:text-2xl font-bold text-ink mt-0.5">
            Profil Pengguna
          </h2>
          <p className="text-sm text-muted mt-1">
            Kelola identitas, foto profil, dan preferensi finansial akun Moneva Anda.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleStartEdit}
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
          >
            <ProfileIcon name="edit" className="size-3.5" />
            <span>Edit Profil</span>
          </button>
        )}
      </div>

      {/* Inline Feedback Alerts */}
      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={`mt-6 flex items-center gap-3 rounded-2xl p-4 text-xs font-medium backdrop-blur-md transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
          }`}
        >
          <span className="grid size-6 place-items-center rounded-full bg-current/10 shrink-0">
            <ProfileIcon name={feedback.type === 'success' ? 'check' : 'x'} className="size-3.5" />
          </span>
          <p className="flex-1">{feedback.text}</p>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-current opacity-70 hover:opacity-100"
            aria-label="Tutup notifikasi"
          >
            <ProfileIcon name="x" className="size-3" />
          </button>
        </div>
      )}

      {/* A. Profile Overview Card */}
      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-3xl bg-surface/50 dark:bg-white/[0.03] p-5 border border-white/40 dark:border-white/5">
        {/* Avatar Display */}
        <div className="relative group shrink-0">
          <div className="grid size-20 sm:size-24 place-items-center rounded-3xl bg-gradient-to-tr from-primary via-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-primary/20 overflow-hidden ring-4 ring-white/60 dark:ring-white/10">
            {previewAvatar ? (
              <img
                src={previewAvatar}
                alt={formData.name || 'Avatar'}
                className="size-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          {/* Quick upload overlay if editing */}
          {isEditing && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-navy/60 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Ubah foto profil"
              title="Ganti foto profil"
            >
              <ProfileIcon name="camera" className="size-5 mb-1" />
              <span className="text-[10px] font-semibold">Ubah</span>
            </button>
          )}
        </div>

        {/* Identity & Status */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-ink truncate">
              {formData.name || 'Demo Moneva'}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <ProfileIcon name="shield" className="size-3" />
              {formData.userType || 'Young Professional'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-muted">
            {formData.email || 'demo@moneva.id'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-muted/90">
            <span className="inline-flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500" />
              {profile.accountStatus || 'Akun Demo Terverifikasi'}
            </span>
            <span aria-hidden="true">·</span>
            <span>Bergabung sejak {profile.memberSince || 'Januari 2024'}</span>
          </div>
        </div>

        {/* Picture Action Buttons (when editing) */}
        {isEditing && (
          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="sr-only"
              aria-label="Unggah foto profil"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-surface/80 dark:bg-white/5 border border-line/60 dark:border-white/10 px-3 py-2 text-xs font-semibold text-ink hover:bg-surface hover:shadow-xs transition-all"
            >
              <ProfileIcon name="camera" className="size-3.5 text-primary" />
              <span>Unggah Foto</span>
            </button>
            {previewAvatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-all"
              >
                <ProfileIcon name="trash" className="size-3.5" />
                <span>Hapus Foto</span>
              </button>
            )}
          </div>
        )}
      </div>

      {isEditing && (
        <p className="mt-2 text-[11px] text-muted text-right sm:text-left">
          Format didukung: JPG, PNG, atau WebP (maksimal 2 MB).
        </p>
      )}

      {/* Main Form (B. Personal Information & D. User Preferences) */}
      <form onSubmit={handleSave} className="mt-8 space-y-8">
        {/* Personal Information Group */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
            <ProfileIcon name="user" className="size-4 text-primary" />
            Informasi Pribadi
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="profile-name"
                className="block text-xs font-semibold text-ink mb-1.5"
              >
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              {isEditing ? (
                <div>
                  <input
                    id="profile-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nama lengkap Anda"
                    required
                    className={`w-full rounded-2xl bg-surface/80 dark:bg-white/5 px-4 py-2.5 text-sm text-ink outline-none transition-all border ${
                      errors.name
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                        : 'border-line/70 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
                  )}
                </div>
              ) : (
                <p className="rounded-2xl bg-canvas/40 dark:bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-ink">
                  {profile.name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="profile-email"
                className="block text-xs font-semibold text-ink mb-1.5"
              >
                Alamat Email <span className="text-rose-500">*</span>
              </label>
              {isEditing ? (
                <div>
                  <input
                    id="profile-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="nama@domain.id"
                    required
                    className={`w-full rounded-2xl bg-surface/80 dark:bg-white/5 px-4 py-2.5 text-sm text-ink outline-none transition-all border ${
                      errors.email
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                        : 'border-line/70 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
                  )}
                </div>
              ) : (
                <p className="rounded-2xl bg-canvas/40 dark:bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-ink">
                  {profile.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="profile-phone"
                className="block text-xs font-semibold text-ink mb-1.5"
              >
                Nomor Telepon
              </label>
              {isEditing ? (
                <div>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="0812-3456-7890"
                    className={`w-full rounded-2xl bg-surface/80 dark:bg-white/5 px-4 py-2.5 text-sm text-ink outline-none transition-all border ${
                      errors.phone
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                        : 'border-line/70 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                  )}
                </div>
              ) : (
                <p className="rounded-2xl bg-canvas/40 dark:bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-ink">
                  {profile.phone || '-'}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label
                htmlFor="profile-dob"
                className="block text-xs font-semibold text-ink mb-1.5"
              >
                Tanggal Lahir
              </label>
              {isEditing ? (
                <div>
                  <input
                    id="profile-dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className={`w-full rounded-2xl bg-surface/80 dark:bg-white/5 px-4 py-2.5 text-sm text-ink outline-none transition-all border ${
                      errors.dob
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                        : 'border-line/70 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  {errors.dob && (
                    <p className="mt-1 text-xs text-rose-500">{errors.dob}</p>
                  )}
                </div>
              ) : (
                <p className="rounded-2xl bg-canvas/40 dark:bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-ink">
                  {profile.dob
                    ? new Intl.DateTimeFormat('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(new Date(`${profile.dob}T00:00:00`))
                    : '-'}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="profile-gender"
                className="block text-xs font-semibold text-ink mb-1.5"
              >
                Jenis Kelamin
              </label>
              {isEditing ? (
                <select
                  id="profile-gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full rounded-2xl bg-surface/80 dark:bg-slate-800 px-4 py-2.5 text-sm text-ink outline-none border border-line/70 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="rounded-2xl bg-canvas/40 dark:bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-ink">
                  {profile.gender || '-'}
                </p>
              )}
            </div>

            {/* Short Biography */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="profile-bio"
                  className="block text-xs font-semibold text-ink"
                >
                  Biografi Singkat
                </label>
                {isEditing && (
                  <span className="text-[11px] text-muted">
                    {(formData.bio || '').length}/250
                  </span>
                )}
              </div>
              {isEditing ? (
                <div>
                  <textarea
                    id="profile-bio"
                    rows={3}
                    maxLength={250}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Ceritakan gambaran singkat profil keuangan Anda..."
                    className={`w-full rounded-2xl bg-surface/80 dark:bg-white/5 p-4 text-sm text-ink outline-none transition-all resize-none border ${
                      errors.bio
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                        : 'border-line/70 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  {errors.bio && (
                    <p className="mt-1 text-xs text-rose-500">{errors.bio}</p>
                  )}
                </div>
              ) : (
                <p className="rounded-2xl bg-canvas/40 dark:bg-white/[0.02] p-4 text-sm leading-relaxed text-ink">
                  {profile.bio || 'Belum ada biografi singkat.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* D. User Preferences Group */}
        <div className="pt-6 border-t border-line/40 dark:border-white/10">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
            <ProfileIcon name="target" className="size-4 text-primary" />
            Preferensi Finansial & Tipe Akun
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* User Type */}
            <div>
              <label
                htmlFor="profile-usertype"
                className="block text-xs font-semibold text-ink mb-1.5"
              >
                Tipe Profil Pengguna
              </label>
              {isEditing ? (
                <select
                  id="profile-usertype"
                  value={formData.userType}
                  onChange={(e) => handleInputChange('userType', e.target.value)}
                  className="w-full rounded-2xl bg-surface/80 dark:bg-slate-800 px-4 py-2.5 text-sm text-ink outline-none border border-line/70 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {USER_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="rounded-2xl bg-canvas/40 dark:bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-ink">
                  {USER_TYPES.find((t) => t.id === profile.userType)?.label ||
                    profile.userType}
                </p>
              )}
            </div>

            {/* Financial Goal */}
            <div>
              <label
                htmlFor="profile-goal"
                className="block text-xs font-semibold text-ink mb-1.5"
              >
                Fokus Finansial Utama
              </label>
              {isEditing ? (
                <select
                  id="profile-goal"
                  value={formData.financialGoal}
                  onChange={(e) =>
                    handleInputChange('financialGoal', e.target.value)
                  }
                  className="w-full rounded-2xl bg-surface/80 dark:bg-slate-800 px-4 py-2.5 text-sm text-ink outline-none border border-line/70 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {FINANCIAL_GOALS.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="rounded-2xl bg-canvas/40 dark:bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-ink">
                  {profile.financialGoal || 'Dana Darurat & Menabung Rutin'}
                </p>
              )}
            </div>

            {/* Budget Alert Checkbox */}
            <div className="sm:col-span-2">
              <label className="flex items-start gap-3 rounded-2xl bg-surface/40 dark:bg-white/[0.02] p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.budgetAlert}
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleInputChange('budgetAlert', e.target.checked)
                  }
                  className="mt-1 size-4 accent-primary rounded focus:ring-primary"
                />
                <span className="text-xs">
                  <span className="block font-semibold text-ink">
                    Peringatan Anggaran & Target Finansial
                  </span>
                  <span className="mt-0.5 block text-muted leading-relaxed">
                    Kirim notifikasi di dashboard saat pengeluaran bulanan Anda
                    mendekati batas anggaran yang telah ditetapkan.
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Save / Cancel Controls (when editing) */}
        {isEditing && (
          <div className="pt-4 flex flex-wrap items-center justify-end gap-3 border-t border-line/40 dark:border-white/10">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-2xl bg-surface/80 dark:bg-white/10 border border-line/60 dark:border-white/15 px-5 py-2.5 text-xs font-semibold text-muted dark:text-slate-300 hover:text-ink dark:hover:text-white hover:bg-surface dark:hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary dashboard-primary-action inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 cursor-pointer"
            >
              <ProfileIcon name="check" className="size-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        )}
      </form>
    </section>
  )
}

