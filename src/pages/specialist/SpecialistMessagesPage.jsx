import { Paperclip, Send } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EmptyState from '../../components/dashboard/EmptyState'
import MessageCard from '../../components/dashboard/MessageCard'
import Avatar from '../../components/dashboard/Avatar'
import ChatBubble from '../../components/dashboard/ChatBubble'
import { formatBadgeCount } from '../../utils/dashboardUtils'
import { useSpecialist } from '../../hooks/useSpecialist'

export default function SpecialistMessagesPage() {
  const {
    conversations,
    stats,
    getMessages,
    markMessageRead,
    markAllConversationsRead,
    sendMessage,
  } = useSpecialist()

  const [searchParams] = useSearchParams()
  const paramConversation = Number(searchParams.get('conversation'))
  const initialId = paramConversation || conversations[0]?.id || null

  const [activeId, setActiveId] = useState(initialId)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const [chatScrollRoot, setChatScrollRoot] = useState(null)

  const reloadMessages = useCallback(async (id) => {
    if (id) {
      const msgs = await getMessages(id)
      setMessages(msgs)
    }
  }, [getMessages])

  const selectConversation = (id) => {
    setActiveId(id)
    reloadMessages(id)
  }

  useEffect(() => {
    if (!paramConversation) return
    if (conversations.some((c) => c.id === paramConversation)) {
      setActiveId(paramConversation)
      reloadMessages(paramConversation)
    }
  }, [paramConversation, conversations, reloadMessages])

  useEffect(() => {
    if (activeId) reloadMessages(activeId)
  }, [activeId, conversations, stats.unreadMessages, reloadMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, activeId])

  const handleRead = useCallback((conversationId, messageId) => {
    markMessageRead(conversationId, messageId)
  }, [markMessageRead])

  const activeConversation = conversations.find((c) => c.id === activeId)

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim() || !activeId) return
    sendMessage(activeId, input.trim())
    reloadMessages(activeId)
    setInput('')
  }

  if (conversations.length === 0) {
    return (
      <div className="dash-page">
        <EmptyState title="پیامی ندارید" description="وقتی کارخانه‌ها با شما تماس بگیرند، پیام‌ها اینجا نمایش داده می‌شوند." />
      </div>
    )
  }

  return (
    <div className="dash-page dash-page--flush">
      <div className="dash-messages-layout">
        <aside className="dash-messages-sidebar">
          <div className="dash-messages-sidebar-header">
            <h3>مکالمات</h3>
            {stats.unreadMessages > 0 && (
              <span className="dash-messages-unread-total">{formatBadgeCount(stats.unreadMessages)} خوانده نشده</span>
            )}
          </div>
          <div className="dash-messages-list">
            {conversations.map((conv) => (
              <MessageCard
                key={conv.id}
                conversation={conv}
                active={conv.id === activeId}
                onClick={() => selectConversation(conv.id)}
              />
            ))}
          </div>
        </aside>

        <div className="dash-chat">
          {activeConversation ? (
            <>
              <div className="dash-chat-header">
                <Avatar name={activeConversation.participantName} size="md" />
                <div>
                  <h3>{activeConversation.participantName}</h3>
                  <span>{activeConversation.participantRole}</span>
                </div>
              </div>

              <div className="dash-chat-messages" ref={setChatScrollRoot}>
                {messages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    msg={msg}
                    conversationId={activeId}
                    onRead={handleRead}
                    scrollRoot={chatScrollRoot}
                    ownerId="specialist"
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="dash-chat-input" onSubmit={handleSend}>
                <button type="button" className="dash-chat-attach" aria-label="پیوست">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="پیام خود را بنویسید..."
                />
                <button type="submit" className="dash-chat-send" aria-label="ارسال">
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="dash-chat-empty">یک مکالمه را انتخاب کنید</div>
          )}
        </div>
      </div>
    </div>
  )
}
