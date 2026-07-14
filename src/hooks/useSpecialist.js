import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { specialistService } from '../services/specialistService'
import { requestService } from '../services/requestService'
import { applicationService } from '../services/applicationService'
import { messageService } from '../services/messageService'
import { notificationService } from '../services/notificationService'
import { factoryService } from '../services/factoryService'

const SpecialistContext = createContext(null)

export function SpecialistProvider({ children }) {
  const { user } = useAuth()
  const [version, setVersion] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const userId = user?.id

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    let cancelled = false

    async function load() {
      try {
        const profileData = await specialistService.getByUserId(userId) || {}
        const completion = await specialistService.getProfileCompletion(userId)
        const missingItems = await specialistService.getMissingItems(userId)
        const skills = await specialistService.getSkills(userId)
        const machines = await specialistService.getMachines(userId)
        const brands = await specialistService.getBrands(userId)
        const certificates = await specialistService.getCertificates(userId)
        const portfolio = await specialistService.getPortfolio(userId)
        const settings = await specialistService.getSettings(userId)

        const allRequests = await requestService.getAll()
        const specialistId = profileData?.id || userId
        const applications = await applicationService.getBySpecialistId(specialistId)
        const convUserId = profileData?.id || userId
        const conversations = await messageService.getConversationsForUser(convUserId)
        const unreadPreviews = await messageService.getUnreadPreviews(convUserId)
        const unreadMessageCount = await messageService.getUnreadCount(convUserId)

        const appliedRequestIds = new Set(applications.map(a => a.requestId))
        const allFactories = await factoryService.getAll()
        const factoryMap = {}
        allFactories.forEach(f => { factoryMap[f.id] = f.companyName })

        const enrichedConversations = await Promise.all(conversations.map(async conv => {
          const msgs = await messageService.getMessagesByConversationId(conv.id)
          const lastMsg = msgs[msgs.length - 1]
          const unreadCount = msgs.filter(m => String(m.senderId) !== String(convUserId) && !m.read).length
          const fName = factoryMap[conv.factoryId]
          return {
            ...conv,
            participantName: fName || 'کارخانه',
            participantRole: 'کارخانه',
            lastMessage: lastMsg?.text || '',
            lastMessageAt: lastMsg?.createdAt || conv.createdAt,
            unreadCount,
          }
        }))

        const opportunities = allRequests.map(req => ({
          ...req,
          score: 0,
          applied: appliedRequestIds.has(req.id),
          factoryName: factoryMap[req.factoryId] || 'کارخانه صنعتی',
          availableStartDate: '',
          additionalDescription: '',
        }))

        const userSkills = (skills || []).map(s => s.toLowerCase())
        const userBrands = (brands || []).map(b => b.toLowerCase())
        const matchedRequestIds = new Set()
        opportunities.forEach(o => {
          const reqSkills = (o.skillsRequired || []).map(s => s.toLowerCase())
          const reqBrand = (o.brand || '').toLowerCase()
          const skillMatch = reqSkills.some(s => userSkills.some(us => s.includes(us) || us.includes(s)))
          const brandMatch = userBrands.some(ub => reqBrand.includes(ub) || ub.includes(reqBrand))
          if (skillMatch || brandMatch) matchedRequestIds.add(o.id)
        })

        const recommended = opportunities.filter(o => o.status === 'published' || o.status === 'waiting_for_applications').slice(0, 4)

        const completedRequests = allRequests.filter(r => r.status === 'completed').length
        const totalApplications = applications.length
        const pendingApplications = applications.filter(a => a.status === 'pending').length
        const acceptedApplications = applications.filter(a => a.status === 'accepted').length
        const rejectedApplications = applications.filter(a => a.status === 'rejected').length

        if (cancelled) return

        setData({
          stats: {
            totalApplications,
            pendingApplications,
            acceptedApplications,
            rejectedApplications,
            activeRequests: allRequests.filter(r => (r.status === 'published' || r.status === 'waiting_for_applications') && !appliedRequestIds.has(r.id)).length,
            unreadMessages: unreadMessageCount,
            profileViews: profileData.profileViews || 0,
            completedProjects: completedRequests,
          },
          profileData: {
            ...profileData,
            profileCompletion: completion,
            missingItems,
          },
          skills,
          machines,
          brands,
          certificates,
          portfolio,
          opportunities,
          recommended,
          matchedRequestIds,
          applications,
          conversations: enrichedConversations,
          settings,
          unreadPreviews,
        })
      } catch (err) {
        if (!cancelled) setError(err.message || 'خطا در بارگذاری اطلاعات')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [userId, version])

  const refresh = useCallback(() => {
    setVersion(v => v + 1)
  }, [])

  const updateProfileFields = useCallback(async (fields) => {
    await specialistService.update(userId, fields)
    refresh()
  }, [userId, refresh])

  const addSkill = useCallback(async (skill) => {
    await specialistService.addSkill(userId, skill)
    refresh()
  }, [userId, refresh])

  const updateSkill = useCallback(async (index, newSkill) => {
    await specialistService.updateSkill(userId, index, newSkill)
    refresh()
  }, [userId, refresh])

  const removeSkill = useCallback(async (index) => {
    await specialistService.removeSkill(userId, index)
    refresh()
  }, [userId, refresh])

  const addMachine = useCallback(async (machine) => {
    await specialistService.addMachine(userId, machine)
    refresh()
  }, [userId, refresh])

  const updateMachine = useCallback(async (id, updates) => {
    await specialistService.updateMachine(userId, id, updates)
    refresh()
  }, [userId, refresh])

  const removeMachine = useCallback(async (id) => {
    await specialistService.removeMachine(userId, id)
    refresh()
  }, [userId, refresh])

  const addBrand = useCallback(async (brand) => {
    await specialistService.addBrand(userId, brand)
    refresh()
  }, [userId, refresh])

  const removeBrand = useCallback(async (index) => {
    await specialistService.removeBrand(userId, index)
    refresh()
  }, [userId, refresh])

  const addCertificate = useCallback(async (cert) => {
    await specialistService.addCertificate(userId, cert)
    refresh()
  }, [userId, refresh])

  const removeCertificate = useCallback(async (id) => {
    await specialistService.removeCertificate(userId, id)
    refresh()
  }, [userId, refresh])

  const addPortfolioItem = useCallback(async (item) => {
    await specialistService.addPortfolioItem(userId, item)
    refresh()
  }, [userId, refresh])

  const removePortfolioItem = useCallback(async (id) => {
    await specialistService.removePortfolioItem(userId, id)
    refresh()
  }, [userId, refresh])

  const applyToOpportunity = useCallback(async (requestId, message, availableStartDate, additionalDescription, attachments) => {
    const profile = await specialistService.getByUserId(userId)
    const request = await requestService.getById(requestId)
    if (!request) return

    await applicationService.add({
      requestId,
      factoryId: request.factoryId,
      specialistId: profile?.id || userId,
      message: message || '',
      availableStartDate: availableStartDate || '',
      additionalDescription: additionalDescription || '',
      attachments: attachments || [],
    })
    refresh()
  }, [userId, refresh])

  const markApplicationsSeen = useCallback(() => { refresh() }, [refresh])
  const markApplicationSeen = useCallback(() => { refresh() }, [refresh])

  const getMessages = useCallback(async (conversationId) => {
    return messageService.getMessagesByConversationId(conversationId)
  }, [])

  const markConversationRead = useCallback(async (conversationId) => {
    await messageService.markAsRead(conversationId)
    refresh()
  }, [refresh])

  const markAllConversationsRead = useCallback(async () => {
    const conversations = await messageService.getConversationsForUser(userId)
    await Promise.all(conversations.map(c => messageService.markAsRead(c.id)))
    refresh()
  }, [userId, refresh])

  const markMessageRead = useCallback(async (conversationId) => {
    await messageService.markAsRead(conversationId)
    refresh()
  }, [refresh])

  const sendMessage = useCallback(async (conversationId, content, file) => {
    const profileId = user?.profile?.id || userId
    await messageService.addMessage(conversationId, profileId, content, file)
    refresh()
  }, [userId, user, refresh])

  const updateSettings = useCallback(async (updates) => {
    await specialistService.updateSettings(userId, updates)
    refresh()
  }, [userId, refresh])

  const value = useMemo(() => {
    if (!userId) return null
    return {
      ...(data || {
        stats: {}, profileData: {}, skills: [], machines: [], brands: [],
        certificates: [], portfolio: [], opportunities: [], recommended: [],
        applications: [], conversations: [], settings: {}, unreadPreviews: [],
        matchedRequestIds: new Set(),
      }),
      loading,
      error,
      refresh,
      updateProfileFields,
      addSkill, updateSkill, removeSkill,
      addMachine, updateMachine, removeMachine,
      addBrand, removeBrand,
      addCertificate, removeCertificate,
      addPortfolioItem, removePortfolioItem,
      applyToOpportunity,
      markApplicationsSeen, markApplicationSeen,
      getMessages, markConversationRead, markAllConversationsRead, markMessageRead,
      sendMessage, updateSettings,
    }
  }, [userId, data, loading, error, refresh, updateProfileFields, addSkill, updateSkill,
    removeSkill, addMachine, updateMachine, removeMachine, addBrand,
    removeBrand, addCertificate, removeCertificate, addPortfolioItem,
    removePortfolioItem, applyToOpportunity, markApplicationsSeen,
    markApplicationSeen, getMessages, markConversationRead,
    markAllConversationsRead, markMessageRead, sendMessage, updateSettings])

  return createElement(SpecialistContext.Provider, { value }, children)
}

export function useSpecialist() {
  const context = useContext(SpecialistContext)
  if (!context) {
    throw new Error('useSpecialist must be used within SpecialistProvider')
  }
  return context
}
