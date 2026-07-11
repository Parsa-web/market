import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  marketRequests,
  marketApplications,
  marketConversations,
  marketMessages,
  marketStats,
} from '../services/marketCore'
import { emitDashboardDataChange } from '../utils/dashboardEvents'
import { useAuth } from './useAuth'

const FactoryContext = createContext(null)

export function FactoryProvider({ children }) {
  const { user } = useAuth()
  const [version, setVersion] = useState(0)
  const [data, setData] = useState(null)

  const userId = user?.id

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    ;(async () => {
      const [stats, requests, applications, conversations, unreadPreviews] = await Promise.all([
        marketStats.getFactoryStats(userId),
        marketRequests.getByUserId(userId),
        marketApplications.getForFactory(userId),
        marketConversations.getForUser(userId),
        marketConversations.getUnreadPreviews(userId),
      ])
      if (cancelled) return
      setData({
        stats,
        requests,
        applications,
        conversations,
        settings: {
          emailNotifications: true,
          smsNotifications: true,
          newMessageAlert: true,
          requestUpdateAlert: true,
        },
        unreadPreviews,
      })
    })()
    return () => { cancelled = true }
  }, [userId, version])

  const refresh = useCallback(() => {
    setVersion((v) => v + 1)
    emitDashboardDataChange()
  }, [])

  const addRequest = useCallback(async (requestData) => {
    const result = await marketRequests.add({ ...requestData, userId })
    refresh()
    return result
  }, [userId, refresh])

  const updateRequest = useCallback(async (id, updates) => {
    const result = await marketRequests.update(id, updates)
    refresh()
    return result
  }, [refresh])

  const deleteRequest = useCallback(async (id) => {
    await marketRequests.remove(id)
    refresh()
  }, [refresh])

  const updateApplicationStatus = useCallback(async (applicationId, status) => {
    const result = await marketApplications.updateStatus(applicationId, status)
    refresh()
    return result
  }, [refresh])

  const markApplicationsSeen = useCallback(() => {
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
    const result = await marketMessages.add(conversationId, userId, user?.company || 'کارخانه', content)
    refresh()
    return result
  }, [userId, user, refresh])

  const updateSettings = useCallback((updates) => {
    refresh()
    return updates
  }, [refresh])

  const value = useMemo(() => {
    if (!userId) return null
    return {
      ...(data || { stats: {}, requests: [], applications: [], conversations: [], settings: {}, unreadPreviews: [] }),
      refresh,
      addRequest,
      updateRequest,
      deleteRequest,
      updateApplicationStatus,
      markApplicationsSeen,
      getMessages,
      markConversationRead,
      markAllConversationsRead,
      markMessageRead,
      sendMessage,
      updateSettings,
    }
  }, [
    userId, data, refresh, addRequest, updateRequest, deleteRequest,
    updateApplicationStatus, markApplicationsSeen, getMessages,
    markConversationRead, markAllConversationsRead, markMessageRead,
    sendMessage, updateSettings,
  ])

  return createElement(FactoryContext.Provider, { value }, children)
}

export function useFactory() {
  const context = useContext(FactoryContext)
  if (!context) {
    throw new Error('useFactory must be used within FactoryProvider')
  }
  return context
}
