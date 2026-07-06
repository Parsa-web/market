import { createContext, createElement, useCallback, useContext, useMemo, useState } from 'react'
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

  const refresh = useCallback(() => {
    setVersion((v) => v + 1)
    emitDashboardDataChange()
  }, [])

  const userId = user?.id

  const data = useMemo(() => {
    if (!userId) return null

    const stats = marketStats.getFactoryStats(userId)
    const requests = marketRequests.getByUserId(userId)
    const applications = marketApplications.getForFactory(userId)
    const conversations = marketConversations.getForUser(userId)
    const settings = {
      emailNotifications: true,
      smsNotifications: true,
      newMessageAlert: true,
      requestUpdateAlert: true,
    }
    const unreadPreviews = marketConversations.getUnreadPreviews(userId)

    return {
      stats,
      requests,
      applications,
      conversations,
      settings,
      unreadPreviews,
    }
  }, [userId, version])

  const addRequest = useCallback((requestData) => {
    const result = marketRequests.add({ ...requestData, userId })
    refresh()
    return result
  }, [userId, refresh])

  const updateRequest = useCallback((id, updates) => {
    const result = marketRequests.update(id, updates)
    refresh()
    return result
  }, [refresh])

  const deleteRequest = useCallback((id) => {
    marketRequests.remove(id)
    refresh()
  }, [refresh])

  const updateApplicationStatus = useCallback((applicationId, status) => {
    const result = marketApplications.updateStatus(applicationId, status)
    refresh()
    return result
  }, [refresh])

  const markApplicationsSeen = useCallback(() => {
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
    const result = marketMessages.add(conversationId, userId, user?.company || 'کارخانه', content)
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
      ...data,
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
    userId,
    data,
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
