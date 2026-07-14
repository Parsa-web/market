import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { factoryService } from '../services/factoryService'
import { requestService } from '../services/requestService'
import { applicationService } from '../services/applicationService'
import { messageService } from '../services/messageService'
import { notificationService } from '../services/notificationService'
import { specialistService } from '../services/specialistService'

const FactoryContext = createContext(null)

export function FactoryProvider({ children }) {
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
        const profile = await factoryService.getByUserId(userId)
        const profileCompletion = await factoryService.getProfileCompletion(userId)
        const missingItems = await factoryService.getMissingItems(userId)
        const requests = profile ? await requestService.getByFactoryId(profile.id) : []
        const applications = profile ? await applicationService.getByFactoryId(profile.id) : []
        const convUserId = profile?.id || userId
        const conversations = await messageService.getConversationsForUser(convUserId)
        const unreadPreviews = await messageService.getUnreadPreviews(convUserId)
        const unreadNotifications = await notificationService.getUnreadCount(userId)
        const unreadMessageCount = await messageService.getUnreadCount(convUserId)

        const enrichedApplications = await Promise.all(applications.map(async app => {
          const specialist = await specialistService.getById(app.specialistId)
          const req = await requestService.getById(app.requestId)
          return {
            ...app,
            specialistName: specialist?.fullName || 'متخصص',
            requestTitle: req?.title || '',
          }
        }))

        const allSpecialists = await specialistService.getAll()
        const specialistNameMap = {}
        allSpecialists.forEach(s => { specialistNameMap[String(s.id)] = s.fullName })

        const enrichedConversations = await Promise.all(conversations.map(async conv => {
          const msgs = await messageService.getMessagesByConversationId(conv.id)
          const lastMsg = msgs[msgs.length - 1]
          const unreadCount = msgs.filter(m => String(m.senderId) !== String(convUserId) && !m.read).length
          const sName = specialistNameMap[String(conv.specialistId)]
          return {
            ...conv,
            participantName: sName || 'متخصص',
            participantRole: 'متخصص',
            lastMessage: lastMsg?.text || '',
            lastMessageAt: lastMsg?.createdAt || conv.createdAt,
            unreadCount,
          }
        }))

        if (cancelled) return

        setData({
          profileCompletion,
          missingItems,
          stats: {
            totalRequests: requests.length,
            activeRequests: requests.filter(r => r.status === 'published' || r.status === 'waiting_for_applications' || r.status === 'in_progress').length,
            totalApplications: applications.length,
            totalProjects: requests.filter(r => r.status === 'completed').length,
            unreadMessages: unreadMessageCount,
            unreadNotifications,
            unreadApplications: applications.filter(a => a.status === 'pending').length,
            pendingApplications: applications.filter(a => a.status === 'pending').length,
          },
          requests,
          applications: enrichedApplications,
          conversations: enrichedConversations,
          messages: [],
          settings: {},
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
    await factoryService.update(userId, fields)
    refresh()
  }, [userId, refresh])

  const addRequest = useCallback(async (data) => {
    const profile = await factoryService.getByUserId(userId)
    if (!profile) throw new Error('پروفایل کارخانه یافت نشد')
    const result = await requestService.add({ ...data, factoryId: profile.id })
    refresh()
    return result
  }, [userId, refresh])

  const updateRequest = useCallback(async (id, updates) => {
    return requestService.update(id, updates)
  }, [])

  const removeRequest = useCallback(async (id) => {
    await requestService.remove(id)
    refresh()
  }, [refresh])

  const acceptApplication = useCallback(async (applicationId) => {
    await applicationService.updateStatus(applicationId, 'accepted')
    refresh()
  }, [refresh])

  const rejectApplication = useCallback(async (applicationId) => {
    await applicationService.updateStatus(applicationId, 'rejected')
    refresh()
  }, [refresh])

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
    await factoryService.update(userId, { settings: updates })
    refresh()
  }, [userId, refresh])

  const value = useMemo(() => {
    if (!userId) return null
    return {
      ...(data || {
        stats: {}, requests: [], applications: [], conversations: [],
        messages: [], settings: {}, unreadPreviews: [],
        profileCompletion: 0, missingItems: [],
      }),
      loading,
      error,
      refresh,
      updateProfileFields,
      addRequest, updateRequest, removeRequest,
      requestService: { add: addRequest, update: updateRequest, remove: removeRequest },
      acceptApplication, rejectApplication,
      markApplicationsSeen, markApplicationSeen,
      getMessages, markConversationRead, markAllConversationsRead, markMessageRead,
      sendMessage, updateSettings,
    }
  }, [userId, data, loading, error, refresh, updateProfileFields, addRequest, updateRequest,
    removeRequest, acceptApplication, rejectApplication, markApplicationsSeen,
    markApplicationSeen, getMessages, markConversationRead,
    markAllConversationsRead, markMessageRead, sendMessage, updateSettings])

  return createElement(FactoryContext.Provider, { value }, children)
}

export function useFactory() {
  const context = useContext(FactoryContext)
  if (!context) {
    throw new Error('useFactory must be used within FactoryProvider')
  }
  return context
}
