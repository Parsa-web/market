import { useEffect, useRef } from 'react'
import { formatPersianTime } from '../../utils/dashboardUtils'

export default function ChatBubble({ msg, conversationId, onRead, scrollRoot, ownerId }) {
  const ref = useRef(null)
  const isUnread = !msg.read && msg.senderId !== ownerId

  useEffect(() => {
    if (!isUnread || !ref.current) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onRead(conversationId, msg.id)
          observer.disconnect()
        }
      },
      {
        threshold: 0.6,
        root: scrollRoot || null,
        rootMargin: '0px',
      }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isUnread, conversationId, msg.id, onRead, scrollRoot])

  return (
    <div
      ref={ref}
      className={`dash-chat-bubble${msg.senderId === ownerId ? ' dash-chat-bubble--sent' : ''}${isUnread ? ' dash-chat-bubble--unread' : ''}`}
    >
      <p>{msg.content}</p>
      <span className="dash-chat-time">{formatPersianTime(msg.timestamp)}</span>
    </div>
  )
}
