import { useState, useEffect, useCallback } from 'react'

const REDUCED_MOTION_KEY = 'moneva-reduced-motion'

function getInitialReducedMotion() {
  if (typeof window === 'undefined') return false
  const saved = localStorage.getItem(REDUCED_MOTION_KEY)
  if (saved !== null) {
    return saved === 'true'
  }
  // Fall back to system preference
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useMotion() {
  const [reducedMotion, setReducedMotionState] = useState(getInitialReducedMotion)

  // Sync to HTML attribute and listen for cross-tab or cross-component changes
  useEffect(() => {
    // Ensure attribute is set
    document.documentElement.setAttribute(
      'data-reduced-motion',
      reducedMotion ? 'true' : 'false'
    )

    const handleStorage = (e) => {
      if (e.key === REDUCED_MOTION_KEY) {
        const val = e.newValue === 'true'
        setReducedMotionState(val)
        document.documentElement.setAttribute(
          'data-reduced-motion',
          val ? 'true' : 'false'
        )
      }
    }

    const handleCustom = (e) => {
      const val = Boolean(e.detail?.reducedMotion)
      setReducedMotionState(val)
      document.documentElement.setAttribute(
        'data-reduced-motion',
        val ? 'true' : 'false'
      )
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('moneva:motion-change', handleCustom)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('moneva:motion-change', handleCustom)
    }
  }, [reducedMotion])

  const setReducedMotion = useCallback((value) => {
    const nextVal = typeof value === 'function' ? value(reducedMotion) : Boolean(value)
    setReducedMotionState(nextVal)
    try {
      localStorage.setItem(REDUCED_MOTION_KEY, String(nextVal))
      document.documentElement.setAttribute(
        'data-reduced-motion',
        nextVal ? 'true' : 'false'
      )
      window.dispatchEvent(
        new CustomEvent('moneva:motion-change', {
          detail: { reducedMotion: nextVal },
        })
      )
    } catch {
      // ignore storage errors
    }
  }, [reducedMotion])

  const toggleReducedMotion = useCallback(() => {
    setReducedMotion((prev) => !prev)
  }, [setReducedMotion])

  return {
    reducedMotion,
    setReducedMotion,
    toggleReducedMotion,
  }
}

