import { useCallback, useEffect, useMemo, useState } from 'react'
import { marketConversations, marketMessages, marketStats } from '../services/marketCore'
import { emitDashboardDataChange } from '../utils/dashboardEvents'
import { useAuth } from './useAuth'

export function useMessageNotifications() {
  const { user } = useAuth()
  const [version, setVersion] = useState(0)
  const refresh = useCallback(() => setVersion((v) => v + 1), [])

  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('dashboard-data-change', handler)
    window.addEventListener('factory-data-change', handler)
    return () => {
      window.removeEventListener('dashboard-data-change', handler)
      window.removeEventListener('factory-data-change', handler)
    }
  }, [refresh])

  const notifications = useMemo(() => {
    if (!user?.id) {
      return { unreadCount: 0, previews: [], enabled: false }
    }

    if (user.role === 'factory') {
      marketConversations.getForUser(user.id)
      const stats = marketStats.getFactoryStats(user.id)
      const previews = marketConversations.getUnreadPreviews(user.id)
      return {
        unreadCount: stats.unreadMessages,
        previews,
        enabled: true,
        userId: user.id,
      }
    }

    if (user.role === 'specialist') {
      marketConversations.getForUser(user.id)
      const stats = marketStats.getSpecialistStats(user.id, user)
      const previews = marketConversations.getUnreadPreviews(user.id)
      return {
        unreadCount: stats.unreadMessages,
        previews,
        enabled: true,
        userId: user.id,
      }
    }

    return { unreadCount: 0, previews: [], enabled: false }
  }, [user, version])

  const markMessageRead = useCallback((conversationId, messageId) => {
    if (!user?.id) return false
    const result = marketMessages.markRead(conversationId, messageId, user.id)
    if (result) emitDashboardDataChange()
    return result
  }, [user])

  return { ...notifications, refresh, markMessageRead }
}
