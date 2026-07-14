import { Paperclip, Send, X, FileText } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EmptyState from '../../components/dashboard/EmptyState'
import MessageCard from '../../components/dashboard/MessageCard'
import Avatar from '../../components/dashboard/Avatar'
import ChatBubble from '../../components/dashboard/ChatBubble'
import { formatBadgeCount } from '../../utils/dashboardUtils'
import { useSpecialist } from '../../hooks/useSpecialist'
import { useAuth } from '../../hooks/useAuth'

const MAX_FILE_SIZE = 10 * 1024 * 1024

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('خطا در خواندن فایل'))
    reader.readAsDataURL(file)
  })
}

export default function SpecialistMessagesPage() {
  const {
    conversations,
    stats,
    getMessages,
    markMessageRead,
    markAllConversationsRead,
    sendMessage,
  } = useSpecialist()

  const { user } = useAuth()

  const [searchParams] = useSearchParams()
  const paramConversation = Number(searchParams.get('conversation'))
  const initialId = paramConversation || conversations[0]?.id || null

  const [activeId, setActiveId] = useState(initialId)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const [chatScrollRoot, setChatScrollRoot] = useState(null)
  const fileInputRef = useRef(null)
  const [attachedFile, setAttachedFile] = useState(null)
  const [fileError, setFileError] = useState('')

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

  useEffect(() => {
    if (!activeId) return
    const id = setInterval(() => {
      reloadMessages(activeId)
      window.dispatchEvent(new CustomEvent('dashboard-data-change'))
    }, 5000)
    return () => clearInterval(id)
  }, [activeId, reloadMessages])

  const activeConversation = conversations.find((c) => c.id === activeId)

  const handleAttach = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileError('')
    if (file.size > MAX_FILE_SIZE) {
      setFileError('حجم فایل باید کمتر از ۱۰ مگابایت باشد')
      e.target.value = ''
      return
    }
    try {
      const data = await fileToBase64(file)
      setAttachedFile({ name: file.name, data, size: file.size })
    } catch {
      setFileError('خطا در خواندن فایل')
    }
    e.target.value = ''
  }

  const removeAttachedFile = () => {
    setAttachedFile(null)
    setFileError('')
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if ((!input.trim() && !attachedFile) || !activeId) return
    const fileInfo = attachedFile ? { name: attachedFile.name, data: attachedFile.data, size: attachedFile.size } : undefined
    await sendMessage(activeId, input.trim(), fileInfo)
    reloadMessages(activeId)
    setInput('')
    setAttachedFile(null)
    setFileError('')
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
                    ownerId={user?.profile?.id || user?.id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="dash-chat-input" onSubmit={handleSend}>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={handleFileSelect}
                />
                <button type="button" className="dash-chat-attach" onClick={handleAttach} aria-label="پیوست">
                  <Paperclip size={20} />
                </button>
                <div className="dash-chat-input-main">
                  {attachedFile && (
                    <div className="dash-chat-input-file">
                      <FileText size={14} />
                      <span className="dash-chat-input-file-name">{attachedFile.name}</span>
                      <button type="button" onClick={removeAttachedFile} className="dash-chat-input-file-remove">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {fileError && <div className="dash-chat-input-error">{fileError}</div>}
                  <input
                    type="text"
                    className="dash-chat-input-field"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="پیام خود را بنویسید..."
                  />
                </div>
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
