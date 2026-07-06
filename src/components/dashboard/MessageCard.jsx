import Avatar from './Avatar'
import { formatPersianTime, formatBadgeCount } from '../../utils/dashboardUtils'

export default function MessageCard({ conversation, active, onClick }) {
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
        <p className="dash-message-card-preview">{conversation.lastMessage}</p>
      </div>
      {conversation.unreadCount > 0 && (
        <span className="dash-message-unread">{formatBadgeCount(conversation.unreadCount)}</span>
      )}
    </button>
  )
}
