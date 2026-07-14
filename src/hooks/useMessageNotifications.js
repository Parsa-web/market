import { useCallback, useEffect, useMemo, useState } from 'react'
import { messageService } from '../services/messageService'
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

    async function load() {
      try {
        const unreadCount = await messageService.getUnreadCount(user.id)
        const previews = await messageService.getUnreadPreviews(user.id)

        if (!cancelled) {
          setNotifications({ unreadCount, previews, enabled: true, userId: user.id })
        }
      } catch {
        if (!cancelled) {
          setNotifications({ unreadCount: 0, previews: [], enabled: true, userId: user.id })
        }
      }
    }

    load()
    const pollId = setInterval(load, 10000)
    return () => { cancelled = true; clearInterval(pollId) }
  }, [user, version])

  const markMessageRead = useCallback(async (conversationId) => {
    if (!user?.id) return false
    await messageService.markAsRead(conversationId)
    refresh()
    return true
  }, [user, refresh])

  return { ...notifications, refresh, markMessageRead }
}
