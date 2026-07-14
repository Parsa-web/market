import { FileText, Image, Music, Film, FileArchive } from 'lucide-react'
import Avatar from './Avatar'
import { formatPersianTime, formatBadgeCount } from '../../utils/dashboardUtils'

function getFileType(fileName) {
  if (!fileName) return 'unknown'
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) return 'image'
  if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'].includes(ext)) return 'audio'
  if (['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) return 'video'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive'
  return 'file'
}

const fileIcons = {
  image: Image,
  audio: Music,
  video: Film,
  archive: FileArchive,
  file: FileText,
  unknown: File,
}

const fileLabels = {
  image: 'تصویر',
  audio: 'فایل صوتی',
  video: 'ویدیو',
  archive: 'فایل فشرده',
  file: 'فایل',
  unknown: 'فایل',
}

export default function MessageCard({ conversation, active, onClick }) {
  const isFileMsg = !conversation.lastMessage && conversation.lastFile
  const fileType = isFileMsg && conversation.lastFile ? getFileType(conversation.lastFile) : null
  const FileIcon = fileType ? fileIcons[fileType] || FileText : null
  const fileLabel = fileType ? fileLabels[fileType] || 'فایل' : ''

  return (
    <button
      type="button"
      className={`dash-message-card${active ? ' dash-message-card--active' : ''}`}
      onClick={onClick}
    >
      <Avatar name={conversation.participantName} size="md" />
      <div className="dash-message-card-content">
        <div className="dash-message-card-top">
          <span className="dash-message-card-name">{conversation.participantName}</span>
          <span className="dash-message-card-time">{formatPersianTime(conversation.lastMessageAt)}</span>
        </div>
        <p className="dash-message-card-preview">
          {isFileMsg ? (
            <span className="dash-message-card-file">
              <FileIcon size={12} />
              <span>{fileLabel}</span>
            </span>
          ) : (
            conversation.lastMessage
          )}
        </p>
      </div>
      {conversation.unreadCount > 0 && (
        <span className="dash-message-unread">{formatBadgeCount(conversation.unreadCount)}</span>
      )}
    </button>
  )
}