import { createContext, createElement, useCallback, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'
import { specialistService } from '../services/specialistService'
import { factoryService } from '../services/factoryService'

const AuthContext = createContext(null)

async function buildEnrichedUser(session) {
  if (!session) return null
  const { userId, role, profileId } = session
  const userBase = { id: userId, role }

  if (role === 'specialist') {
    const profile = await specialistService.getByUserId(userId)
    if (profile) {
      return {
        ...userBase,
        fullName: profile.fullName,
        specialty: profile.specialties?.[0] || '',
        specialties: profile.specialties || [],
        experience: profile.experience || '',
        city: profile.city || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        profile,
      }
    }
  } else {
    const profile = await factoryService.getByUserId(userId)
    if (profile) {
      return {
        ...userBase,
        fullName: profile.companyName,
        company: profile.companyName,
        companyName: profile.companyName,
        industry: profile.industry || '',
        city: profile.city || '',
        phone: profile.phone || '',
        profile,
      }
    }
  }
  return userBase
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function loadSession() {
      try {
        const session = authService.getSession()
        if (session && session.userId != null) {
          const enriched = await buildEnrichedUser(session)
          if (!cancelled) setUser(enriched)
        } else {
          authService.logout()
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadSession()
    return () => { cancelled = true }
  }, [])

  const login = useCallback(async (credentials) => {
    setIsAuthenticating(true)
    try {
      await authService.login(credentials.identifier, credentials.password)
      const session = authService.getSession()
      const enriched = await buildEnrichedUser(session)
      setUser(enriched)
      return enriched
    } catch (err) {
      throw err
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  const register = useCallback(async (data) => {
    setIsAuthenticating(true)
    try {
      await authService.register(data)
      const session = authService.getSession()
      const enriched = await buildEnrichedUser(session)
      setUser(enriched)
      return enriched
    } catch (err) {
      throw err
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const deleteAccount = useCallback(async () => {
    if (!user) return
    await authService.deleteAccount(user.id, user.role)
    setUser(null)
  }, [user])

  const updateUser = useCallback(async (updates) => {
    if (!user) return null
    if (user.role === 'specialist') {
      const profileUpdates = { ...updates }
      if (updates.specialty !== undefined) {
        profileUpdates.specialties = [updates.specialty]
        delete profileUpdates.specialty
      }
      await specialistService.update(user.id, profileUpdates)
    } else {
      await factoryService.update(user.id, updates)
    }
    const session = authService.getSession()
    const enriched = await buildEnrichedUser(session)
    setUser(enriched)
    return enriched
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
    deleteAccount,
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
