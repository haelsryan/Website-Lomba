import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AUTH_KEY = 'moneva-auth-session'
const PROFILE_KEY = 'moneva-user-profile'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const sessionRaw = localStorage.getItem(AUTH_KEY)
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw)
          // Check if session is still valid (24 hours)
          if (session.expiresAt && Date.now() < session.expiresAt) {
            setUser(session.user)
          } else {
            // Session expired, clear it
            localStorage.removeItem(AUTH_KEY)
          }
        }
      } catch (err) {
        console.error('Failed to load auth session:', err)
        localStorage.removeItem(AUTH_KEY)
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [])

  const login = useCallback(async (email, password, rememberMe = false) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock authentication - accept any non-empty email/password
      if (!email || !password) {
        throw new Error('Email dan kata sandi harus diisi')
      }

      if (!email.includes('@') || !email.includes('.')) {
        throw new Error('Format email tidak valid')
      }

      if (password.length < 6) {
        throw new Error('Kata sandi minimal 6 karakter')
      }

      // Check if user exists in localStorage (from previous signup)
      const profilesRaw = localStorage.getItem(PROFILE_KEY)
      let profiles = []
      if (profilesRaw) {
        try {
          profiles = JSON.parse(profilesRaw)
        } catch {
          profiles = []
        }
      }

      const existingProfile = profiles.find((p) => p.email === email)

      // Create session
      const sessionDuration = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 7 days or 24 hours
      const session = {
        user: {
          id: existingProfile?.id || `user-${Date.now()}`,
          email,
          name: existingProfile?.name || email.split('@')[0],
          userType: existingProfile?.userType || 'Young Professional',
          avatar: existingProfile?.avatar || null,
          createdAt: existingProfile?.createdAt || new Date().toISOString(),
        },
        expiresAt: Date.now() + sessionDuration,
        createdAt: Date.now(),
      }

      localStorage.setItem(AUTH_KEY, JSON.stringify(session))
      setUser(session.user)

      return { success: true, user: session.user }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (userData) => {
    setIsLoading(true)
    setError(null)

    try {
      const { name, email, password, confirmPassword, userType, termsAccepted } = userData

      // Validate
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('Semua field harus diisi')
      }

      if (!email.includes('@') || !email.includes('.')) {
        throw new Error('Format email tidak valid')
      }

      if (password.length < 6) {
        throw new Error('Kata sandi minimal 6 karakter')
      }

      if (password !== confirmPassword) {
        throw new Error('Konfirmasi kata sandi tidak cocok')
      }

      if (!termsAccepted) {
        throw new Error('Anda harus menyetujui syarat dan ketentuan')
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if email already exists
      const profilesRaw = localStorage.getItem(PROFILE_KEY)
      let profiles = []
      if (profilesRaw) {
        try {
          profiles = JSON.parse(profilesRaw)
        } catch {
          profiles = []
        }
      }

      if (profiles.some((p) => p.email === email)) {
        throw new Error('Email sudah terdaftar. Silakan masuk.')
      }

      // Create new user profile
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        userType: userType || 'Young Professional',
        avatar: null,
        createdAt: new Date().toISOString(),
      }

      profiles.push(newUser)
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles))

      // Auto-login after signup
      const session = {
        user: newUser,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        createdAt: Date.now(),
      }

      localStorage.setItem(AUTH_KEY, JSON.stringify(session))
      setUser(newUser)

      return { success: true, user: newUser }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
    setError(null)
  }, [])

  const updateProfile = useCallback((updates) => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)

    // Update session
    const sessionRaw = localStorage.getItem(AUTH_KEY)
    if (sessionRaw) {
      try {
        const session = JSON.parse(sessionRaw)
        session.user = updatedUser
        localStorage.setItem(AUTH_KEY, JSON.stringify(session))
      } catch {
        // Ignore
      }
    }

    // Update profile in profiles list
    const profilesRaw = localStorage.getItem(PROFILE_KEY)
    if (profilesRaw) {
      try {
        let profiles = JSON.parse(profilesRaw)
        profiles = profiles.map((p) => (p.id === user.id ? updatedUser : p))
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles))
      } catch {
        // Ignore
      }
    }
  }, [user])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
