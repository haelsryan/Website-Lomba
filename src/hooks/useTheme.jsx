import { useEffect, useState } from 'react'

const THEME_KEY = 'dompet-cerdas-theme'
const THEMES = ['light', 'dark', 'system']

function readTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    return {
      theme: THEMES.includes(stored) ? stored : 'system',
      error: '',
    }
  } catch {
    return {
      theme: 'system',
      error: 'Preferensi tema tidak dapat dibaca dari penyimpanan browser.',
    }
  }
}

function resolveTheme(theme) {
  if (theme !== 'system') return theme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [preference, setPreference] = useState(readTheme)
  const { theme, error } = preference

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      document.documentElement.dataset.theme = resolveTheme(theme)
    }

    applyTheme()
    media.addEventListener('change', applyTheme)
    return () => media.removeEventListener('change', applyTheme)
  }, [theme])

  function setTheme(nextTheme) {
    if (!THEMES.includes(nextTheme)) {
      throw new RangeError(`Unsupported theme: ${nextTheme}`)
    }

    let nextError = ''
    try {
      localStorage.setItem(THEME_KEY, nextTheme)
    } catch {
      nextError = 'Tema berubah, tetapi preferensinya tidak dapat disimpan di browser.'
    }
    document.documentElement.dataset.theme = resolveTheme(nextTheme)
    setPreference({ theme: nextTheme, error: nextError })
  }

  return { theme, setTheme, error }
}
