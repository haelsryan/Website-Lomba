import { useState, useEffect } from 'react'

export function Toast() {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handler = (e) => {
      setMessage(e.detail)
      setVisible(true)
      setTimeout(() => setVisible(false), 2500)
    }
    window.addEventListener('toast', handler)
    return () => window.removeEventListener('toast', handler)
  }, [])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-lg lg:bottom-6"
    >
      {message}
    </div>
  )
}

export function toast(message) {
  window.dispatchEvent(new CustomEvent('toast', { detail: message }))
}
