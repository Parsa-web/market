import { useEffect, useRef } from 'react'
import { FileText, Download, Image, Music, Film, File, FileArchive } from 'lucide-react'
import { formatPersianTime } from '../../utils/dashboardUtils'

function getFileType(fileName) {
  if (!fileName) return 'unknown'
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) return 'image'
  if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'].includes(ext)) return 'audio'
  if (['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) return 'video'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive'
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv'].includes(ext)) return 'document'
  return 'unknown'
}

const fileIcons = {
  image: Image,
  audio: Music,
  video: Film,
  archive: FileArchive,
  document: FileText,
  unknown: File,
}

const fileLabels = {
  image: 'تصویر',
  audio: 'فایل صوتی',
  video: 'ویدیو',
  archive: 'فایل فشرده',
  document: 'مستند',
  unknown: 'فایل',
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export default function ChatBubble({ msg, conversationId, onRead, scrollRoot, ownerId }) {
  const ref = useRef(null)
  const isUnread = !msg.read && msg.senderId !== ownerId
  const isSent = msg.senderId === ownerId

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

  const renderFileContent = () => {
    if (!msg.fileData || !msg.fileName) return null

    const fileType = getFileType(msg.fileName)
    const Icon = fileIcons[fileType] || File
    const label = fileLabels[fileType] || 'فایل'
    const hasText = msg.text && msg.text.trim()

    if (fileType === 'image') {
      return (
        <div className={`dash-chat-image-wrap${hasText ? ' dash-chat-image-wrap--with-text' : ''}`}>
          <img
            src={msg.fileData}
            alt={msg.fileName}
            className="dash-chat-image"
            loading="lazy"
          />
          <a
            href={msg.fileData}
            download={msg.fileName}
            className="dash-chat-image-dl"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={14} />
          </a>
          <div className="dash-chat-image-info">
            <span className="dash-chat-image-name">{msg.fileName}</span>
            {msg.fileSize > 0 && <span className="dash-chat-image-size">{formatFileSize(msg.fileSize)}</span>}
          </div>
        </div>
      )
    }

    return (
      <a
        href={msg.fileData}
        download={msg.fileName}
        className={`dash-chat-file${hasText ? ' dash-chat-file--with-text' : ''}`}
      >
        <div className="dash-chat-file-icon-wrap">
          <Icon size={18} />
        </div>
        <div className="dash-chat-file-info">
          <span className="dash-chat-file-label">{label}</span>
          <span className="dash-chat-file-name">{msg.fileName}</span>
          {msg.fileSize > 0 && <span className="dash-chat-file-size">{formatFileSize(msg.fileSize)}</span>}
        </div>
        <Download size={14} className="dash-chat-file-dl-icon" />
      </a>
    )
  }

  return (
    <div
      ref={ref}
      className={`dash-chat-bubble${isSent ? ' dash-chat-bubble--sent' : ''}${isUnread ? ' dash-chat-bubble--unread' : ''}`}
    >
      {renderFileContent()}
      {msg.text && msg.text.trim() && <p className="dash-chat-text">{msg.text}</p>}
      <span className="dash-chat-time">{formatPersianTime(msg.createdAt)}</span>
    </div>
  )
}