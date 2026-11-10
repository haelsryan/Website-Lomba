import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

const AUTH_SESSION_KEY = 'moneva-auth-session'

export function ProtectedPage({ children }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const sessionRaw = localStorage.getItem(AUTH_SESSION_KEY)
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw)
          // Check if session is still valid
          if (session.expiresAt && Date.now() < session.expiresAt) {
            setIsAuthenticated(true)
          } else {
            // Session expired, clear it
            localStorage.removeItem(AUTH_SESSION_KEY)
            setIsAuthenticated(false)
          }
        } else {
          setIsAuthenticated(false)
        }
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [])

  if (isChecking) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-spinner" />
        <p className="text-sm text-muted">Memverifikasi sesi...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login page
    window.location.href = '/pages/login.html'
    return null
  }

  return children
}

export function AuthenticatedApp({ children }) {
  const [user, setUser] = useState(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const loadSession = () => {
      try {
        const sessionRaw = localStorage.getItem(AUTH_SESSION_KEY)
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw)
          if (session.expiresAt && Date.now() < session.expiresAt) {
            setUser(session.user)
          } else {
            localStorage.removeItem(AUTH_SESSION_KEY)
          }
        }
      } catch {
        localStorage.removeItem(AUTH_SESSION_KEY)
      } finally {
        setIsChecking(false)
      }
    }

    loadSession()
  }, [])

  if (isChecking) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-spinner" />
        <p className="text-sm text-muted">Memuat aplikasi...</p>
      </div>
    )
  }

  // If not authenticated, render children anyway (for public pages)
  // or the ProtectedPage wrapper will handle redirection
  return children
}

export default ProtectedPage
