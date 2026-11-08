import { useState, useEffect, useCallback } from 'react'

export const PROFILE_STORAGE_KEY = 'moneva-profile-v1'

export const USER_TYPES = [
  { id: 'Student', label: 'Pelajar / Mahasiswa' },
  { id: 'Young Professional', label: 'Profesional Muda' },
  { id: 'Freelancer', label: 'Pekerja Lepas (Freelancer)' },
  { id: 'UMKM Owner', label: 'Pemilik UMKM' },
  { id: 'Other', label: 'Lainnya' },
]

export const FINANCIAL_GOALS = [
  'Dana Darurat & Menabung Rutin',
  'Investasi & Portofolio Masa Depan',
  'Kelola Arus Kas Bisnis / UMKM',
  'Pelunasan Pinjaman & Pengurangan Beban',
  'Rencana Pembelian Properti / Rumah',
]

export const GENDERS = [
  'Laki-laki',
  'Perempuan',
  'Lainnya',
  'Tidak ingin menyebutkan',
]

export const DEFAULT_PROFILE = {
  name: 'Demo Moneva',
  email: 'demo@moneva.id',
  phone: '0812-3456-7890',
  dob: '1998-05-15',
  gender: 'Laki-laki',
  bio: 'Pengguna aktif Moneva yang fokus mengoptimalkan alokasi anggaran bulanan, membangun dana darurat, dan merencanakan investasi mandiri.',
  userType: 'Young Professional',
  financialGoal: 'Dana Darurat & Menabung Rutin',
  budgetAlert: true,
  avatar: '', // base64 Data URL or empty string
  accountStatus: 'Akun Demo Terverifikasi',
  memberSince: 'Januari 2024',
}

function getStoredProfile() {
  if (typeof window === 'undefined') return DEFAULT_PROFILE
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return DEFAULT_PROFILE
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_PROFILE, ...parsed }
  } catch {
    return DEFAULT_PROFILE
  }
}

export function validateProfile(data) {
  const errors = {}

  if (!data.name || !data.name.trim()) {
    errors.name = 'Nama lengkap wajib diisi.'
  } else if (data.name.trim().length < 2) {
    errors.name = 'Nama minimal terdiri dari 2 karakter.'
  }

  if (!data.email || !data.email.trim()) {
    errors.email = 'Alamat email wajib diisi.'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Format email tidak valid (contoh: nama@domain.id).'
    }
  }

  if (data.phone && data.phone.trim()) {
    const phoneClean = data.phone.replace(/[\s-]/g, '')
    const phoneRegex = /^\+?[0-9]{8,15}$/
    if (!phoneRegex.test(phoneClean)) {
      errors.phone = 'Nomor telepon harus berupa 8-15 digit angka (opsional tanda +).'
    }
  }

  if (data.dob) {
    const dobDate = new Date(data.dob)
    const today = new Date()
    if (isNaN(dobDate.getTime())) {
      errors.dob = 'Format tanggal lahir tidak valid.'
    } else if (dobDate >= today) {
      errors.dob = 'Tanggal lahir harus sebelum hari ini.'
    }
  }

  if (data.bio && data.bio.length > 250) {
    errors.bio = 'Biografi singkat maksimal 250 karakter.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function useProfile() {
  const [profile, setProfile] = useState(getStoredProfile)

  // Listen for changes from other tabs or components
  useEffect(() => {
    const handleProfileChange = (event) => {
      if (event.detail) {
        setProfile((prev) => ({ ...prev, ...event.detail }))
      } else {
        setProfile(getStoredProfile())
      }
    }

    const handleStorage = (event) => {
      if (event.key === PROFILE_STORAGE_KEY) {
        setProfile(getStoredProfile())
      }
    }

    window.addEventListener('moneva:profile-change', handleProfileChange)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('moneva:profile-change', handleProfileChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const saveProfile = useCallback((nextData) => {
    const validation = validateProfile(nextData)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    try {
      const merged = { ...getStoredProfile(), ...nextData }
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged))
      setProfile(merged)
      window.dispatchEvent(
        new CustomEvent('moneva:profile-change', { detail: merged })
      )
      return { success: true, errors: {} }
    } catch {
      return {
        success: false,
        errors: {
          general: 'Penyimpanan lokal penuh atau tidak dapat diakses.',
        },
      }
    }
  }, [])

  const resetProfile = useCallback(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE))
      setProfile(DEFAULT_PROFILE)
      window.dispatchEvent(
        new CustomEvent('moneva:profile-change', { detail: DEFAULT_PROFILE })
      )
      return { success: true }
    } catch {
      return { success: false }
    }
  }, [])

  return {
    profile,
    saveProfile,
    resetProfile,
  }
}

