import { createContext, createElement, useCallback, useContext, useMemo, useState } from 'react'
import {
  marketRequests,
  marketApplications,
  marketConversations,
  marketMessages,
  marketStats,
  marketProfile,
} from '../services/marketCore'
import { emitDashboardDataChange } from '../utils/dashboardEvents'
import { useAuth } from './useAuth'

const SpecialistContext = createContext(null)

export function SpecialistProvider({ children }) {
  const { user } = useAuth()
  const [version, setVersion] = useState(0)

  const refresh = useCallback(() => {
    setVersion((v) => v + 1)
    emitDashboardDataChange()
  }, [])

  const userId = user?.id

  const data = useMemo(() => {
    if (!userId) return null

    const stats = marketStats.getSpecialistStats(userId, user)
    const profileData = marketProfile.getProfileData(userId, user)
    const skills = marketProfile.getSkills(userId)
    const machines = marketProfile.getMachines(userId)
    const brands = marketProfile.getBrands(userId)
    const certificates = marketProfile.getCertificates(userId)
    const portfolio = marketProfile.getPortfolio(userId)

    const allRequests = marketRequests.getActive()
    const opportunities = allRequests.map((req) => ({
      ...req,
      score: 0,
      applied: marketApplications.hasSpecialistApplied(userId, req.id),
    }))
    const recommended = opportunities.slice(0, 4)

    const applications = marketApplications.getForSpecialist(userId)
    const conversations = marketConversations.getForUser(userId)
    const settings = marketProfile.getSettings(userId)
    const unreadPreviews = marketConversations.getUnreadPreviews(userId)

    return {
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
    }
  }, [userId, user, version])

  const updateProfileFields = useCallback((fields) => {
    const result = marketProfile.updateProfileFields(userId, fields)
    refresh()
    return result
  }, [userId, refresh])

  const addSkill = useCallback((skill) => {
    const result = marketProfile.addSkill(userId, skill)
    refresh()
    return result
  }, [userId, refresh])

  const updateSkill = useCallback((index, newSkill) => {
    const result = marketProfile.updateSkill(userId, index, newSkill)
    refresh()
    return result
  }, [userId, refresh])

  const removeSkill = useCallback((index) => {
    marketProfile.removeSkill(userId, index)
    refresh()
  }, [userId, refresh])

  const addMachine = useCallback((machine) => {
    const result = marketProfile.addMachine(userId, machine)
    refresh()
    return result
  }, [userId, refresh])

  const updateMachine = useCallback((id, updates) => {
    const result = marketProfile.updateMachine(userId, id, updates)
    refresh()
    return result
  }, [userId, refresh])

  const removeMachine = useCallback((id) => {
    marketProfile.removeMachine(userId, id)
    refresh()
  }, [userId, refresh])

  const addBrand = useCallback((brand) => {
    const result = marketProfile.addBrand(userId, brand)
    refresh()
    return result
  }, [userId, refresh])

  const removeBrand = useCallback((index) => {
    marketProfile.removeBrand(userId, index)
    refresh()
  }, [userId, refresh])

  const addCertificate = useCallback((cert) => {
    const result = marketProfile.addCertificate(userId, cert)
    refresh()
    return result
  }, [userId, refresh])

  const removeCertificate = useCallback((id) => {
    marketProfile.removeCertificate(userId, id)
    refresh()
  }, [userId, refresh])

  const addPortfolioItem = useCallback((item) => {
    const result = marketProfile.addPortfolioItem(userId, item)
    refresh()
    return result
  }, [userId, refresh])

  const removePortfolioItem = useCallback((id) => {
    marketProfile.removePortfolioItem(userId, id)
    refresh()
  }, [userId, refresh])

  const applyToOpportunity = useCallback((requestId, message) => {
    marketApplications.add({
      requestId,
      specialistId: userId,
      specialistName: user?.fullName || 'متخصص',
      message: message || '',
      factoryName: 'کارخانه',
      requestTitle: 'درخواست صنعتی',
    })
    refresh()
  }, [userId, user, refresh])

  const markApplicationsSeen = useCallback(() => {
    refresh()
  }, [refresh])

  const markApplicationSeen = useCallback(() => {
    refresh()
  }, [refresh])

  const getMessages = useCallback((conversationId) => {
    return marketMessages.getByConversationId(conversationId)
  }, [])

  const markConversationRead = useCallback((conversationId) => {
    marketConversations.markRead(conversationId, userId)
    refresh()
  }, [userId, refresh])

  const markAllConversationsRead = useCallback(() => {
    marketConversations.markAllRead(userId)
    refresh()
  }, [userId, refresh])

  const markMessageRead = useCallback((conversationId, messageId) => {
    marketMessages.markRead(conversationId, messageId, userId)
    refresh()
  }, [userId, refresh])

  const sendMessage = useCallback((conversationId, content) => {
    const result = marketMessages.add(conversationId, userId, user?.fullName || 'متخصص', content)
    refresh()
    return result
  }, [userId, user, refresh])

  const updateSettings = useCallback((updates) => {
    const result = marketProfile.updateSettings(userId, updates)
    refresh()
    return result
  }, [userId, refresh])

  const value = useMemo(() => {
    if (!userId) return null
    return {
      ...data,
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
    userId,
    data,
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
