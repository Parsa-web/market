import { createContext, createElement, useCallback, useContext, useEffect, useState } from 'react'
import { authApi } from '../services/api'
import { migrateSeedData } from '../services/marketCore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    const session = authApi.getSession()
    if (session) {
      setUser(session)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    setIsAuthenticating(true)
    try {
      const result = await authApi.login(credentials)
      setUser(result)
      return result
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  const register = useCallback(async (data) => {
    setIsAuthenticating(true)
    try {
      const result = await authApi.register(data)
      setUser(result)
      return result
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
  }, [])

  const updateUser = useCallback((updates) => {
    if (!user) return null
    const result = authApi.updateUser(user.id, updates)
    setUser(result)
    return result
  }, [user])

  const value = {
    user,
    isLoading,
    isAuthenticating,
    login,
    register,
    logout,
    setUser,
    updateUser,
  }

  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
