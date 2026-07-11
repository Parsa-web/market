import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  marketRequests,
  marketApplications,
  marketConversations,
  marketMessages,
  marketStats,
  marketProfile,
} from '../services/marketCore'
import { api } from '../services/marketCore/storage'
import { emitDashboardDataChange } from '../utils/dashboardEvents'
import { useAuth } from './useAuth'

const SpecialistContext = createContext(null)

export function SpecialistProvider({ children }) {
  const { user } = useAuth()
  const [version, setVersion] = useState(0)
  const [data, setData] = useState(null)

  const userId = user?.id

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    ;(async () => {
      const [
        stats,
        profileData,
        skills,
        machines,
        brands,
        certificates,
        portfolio,
        allRequests,
        applications,
        conversations,
        settings,
        unreadPreviews,
      ] = await Promise.all([
        marketStats.getSpecialistStats(userId, user),
        marketProfile.getProfileData(userId, user),
        marketProfile.getSkills(userId),
        marketProfile.getMachines(userId),
        marketProfile.getBrands(userId),
        marketProfile.getCertificates(userId),
        marketProfile.getPortfolio(userId),
        marketRequests.getActive(),
        marketApplications.getForSpecialist(userId),
        marketConversations.getForUser(userId),
        marketProfile.getSettings(userId),
        marketConversations.getUnreadPreviews(userId),
      ])
      if (cancelled) return
      const appliedRequests = new Set(applications.map(a => a.requestId))
      const allFactories = api.get('factories')
      const factoryMap = {}
      allFactories.forEach(f => { factoryMap[f.id] = f.companyName })
      const opportunities = allRequests.map(req => ({
        ...req,
        score: 0,
        applied: appliedRequests.has(req.id),
        factoryName: factoryMap[req.factoryId] || 'کارخانه صنعتی',
      }))
      const recommended = opportunities.slice(0, 4)
      setData({
        stats,
        profileData,
        skills,
        machines,
        brands,
        certificates,
        portfolio,
        opportunities,
        recommended,
        applications,
        conversations,
        settings,
        unreadPreviews,
      })
    })()
    return () => { cancelled = true }
  }, [userId, user, version])

  const refresh = useCallback(() => {
    setVersion((v) => v + 1)
    emitDashboardDataChange()
  }, [])

  const updateProfileFields = useCallback(async (fields) => {
    const result = await marketProfile.updateProfileFields(userId, fields)
    refresh()
    return result
  }, [userId, refresh])

  const addSkill = useCallback(async (skill) => {
    const result = await marketProfile.addSkill(userId, skill)
    refresh()
    return result
  }, [userId, refresh])

  const updateSkill = useCallback(async (index, newSkill) => {
    const result = await marketProfile.updateSkill(userId, index, newSkill)
    refresh()
    return result
  }, [userId, refresh])

  const removeSkill = useCallback(async (index) => {
    await marketProfile.removeSkill(userId, index)
    refresh()
  }, [userId, refresh])

  const addMachine = useCallback(async (machine) => {
    const result = await marketProfile.addMachine(userId, machine)
    refresh()
    return result
  }, [userId, refresh])

  const updateMachine = useCallback(async (id, updates) => {
    const result = await marketProfile.updateMachine(userId, id, updates)
    refresh()
    return result
  }, [userId, refresh])

  const removeMachine = useCallback(async (id) => {
    await marketProfile.removeMachine(userId, id)
    refresh()
  }, [userId, refresh])

  const addBrand = useCallback(async (brand) => {
    const result = await marketProfile.addBrand(userId, brand)
    refresh()
    return result
  }, [userId, refresh])

  const removeBrand = useCallback(async (index) => {
    await marketProfile.removeBrand(userId, index)
    refresh()
  }, [userId, refresh])

  const addCertificate = useCallback(async (cert) => {
    const result = await marketProfile.addCertificate(userId, cert)
    refresh()
    return result
  }, [userId, refresh])

  const removeCertificate = useCallback(async (id) => {
    await marketProfile.removeCertificate(userId, id)
    refresh()
  }, [userId, refresh])

  const addPortfolioItem = useCallback(async (item) => {
    const result = await marketProfile.addPortfolioItem(userId, item)
    refresh()
    return result
  }, [userId, refresh])

  const removePortfolioItem = useCallback(async (id) => {
    await marketProfile.removePortfolioItem(userId, id)
    refresh()
  }, [userId, refresh])

  const applyToOpportunity = useCallback(async (requestId, message, availableStartDate, additionalDescription) => {
    const specialistProfile = await marketProfile.getProfileData(userId, user)
    await marketApplications.add({
      requestId,
      specialistId: specialistProfile?.id || userId,
      message: message || '',
      availableStartDate: availableStartDate || '',
      additionalDescription: additionalDescription || '',
    })
    refresh()
  }, [userId, user, refresh])

  const markApplicationsSeen = useCallback(() => {
    refresh()
  }, [refresh])

  const markApplicationSeen = useCallback(() => {
    refresh()
  }, [refresh])

  const getMessages = useCallback(async (conversationId) => {
    return marketMessages.getByConversationId(conversationId)
  }, [])

  const markConversationRead = useCallback(async (conversationId) => {
    await marketConversations.markRead(conversationId, userId)
    refresh()
  }, [userId, refresh])

  const markAllConversationsRead = useCallback(async () => {
    await marketConversations.markAllRead(userId)
    refresh()
  }, [userId, refresh])

  const markMessageRead = useCallback(async (conversationId, messageId) => {
    await marketMessages.markRead(conversationId, messageId, userId)
    refresh()
  }, [userId, refresh])

  const sendMessage = useCallback(async (conversationId, content) => {
    const result = await marketMessages.add(conversationId, userId, user?.fullName || 'متخصص', content)
    refresh()
    return result
  }, [userId, user, refresh])

  const updateSettings = useCallback(async (updates) => {
    const result = await marketProfile.updateSettings(userId, updates)
    refresh()
    return result
  }, [userId, refresh])

  const value = useMemo(() => {
    if (!userId) return null
    return {
      ...(data || {
        stats: {}, profileData: {}, skills: [], machines: [], brands: [],
        certificates: [], portfolio: [], opportunities: [], recommended: [],
        applications: [], conversations: [], settings: {}, unreadPreviews: [],
      }),
      refresh,
      updateProfileFields,
      addSkill,
      updateSkill,
      removeSkill,
      addMachine,
      updateMachine,
      removeMachine,
      addBrand,
      removeBrand,
      addCertificate,
      removeCertificate,
      addPortfolioItem,
      removePortfolioItem,
      applyToOpportunity,
      markApplicationsSeen,
      markApplicationSeen,
      getMessages,
      markConversationRead,
      markAllConversationsRead,
      markMessageRead,
      sendMessage,
      updateSettings,
    }
  }, [
    userId, data, refresh, updateProfileFields, addSkill, updateSkill,
    removeSkill, addMachine, updateMachine, removeMachine, addBrand,
    removeBrand, addCertificate, removeCertificate, addPortfolioItem,
    removePortfolioItem, applyToOpportunity, markApplicationsSeen,
    markApplicationSeen, getMessages, markConversationRead,
    markAllConversationsRead, markMessageRead, sendMessage, updateSettings,
  ])

  return createElement(SpecialistContext.Provider, { value }, children)
}

export function useSpecialist() {
  const context = useContext(SpecialistContext)
  if (!context) {
    throw new Error('useSpecialist must be used within SpecialistProvider')
  }
  return context
}
