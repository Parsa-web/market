import { useCallback, useEffect, useMemo, useState } from 'react'
import { marketConversations, marketMessages, marketStats } from '../services/marketCore'
import { emitDashboardDataChange } from '../utils/dashboardEvents'
import { useAuth } from './useAuth'

export function useMessageNotifications() {
  const { user } = useAuth()
  const [version, setVersion] = useState(0)
  const [notifications, setNotifications] = useState({ unreadCount: 0, previews: [], enabled: false })
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

  useEffect(() => {
    if (!user?.id) {
      setNotifications({ unreadCount: 0, previews: [], enabled: false })
      return
    }
    let cancelled = false
    ;(async () => {
      if (user.role === 'factory') {
        const [stats, previews] = await Promise.all([
          marketStats.getFactoryStats(user.id),
          marketConversations.getUnreadPreviews(user.id),
        ])
        if (!cancelled) {
          setNotifications({ unreadCount: stats.unreadMessages, previews, enabled: true, userId: user.id })
        }
      } else {
        const [stats, previews] = await Promise.all([
          marketStats.getSpecialistStats(user.id, user),
          marketConversations.getUnreadPreviews(user.id),
        ])
        if (!cancelled) {
          setNotifications({ unreadCount: stats.unreadMessages, previews, enabled: true, userId: user.id })
        }
      }
    })()
    return () => { cancelled = true }
  }, [user, version])

  const markMessageRead = useCallback(async (conversationId, messageId) => {
    if (!user?.id) return false
    const result = await marketMessages.markRead(conversationId, messageId, user.id)
    if (result) emitDashboardDataChange()
    return result
  }, [user])

  return { ...notifications, refresh, markMessageRead }
}
