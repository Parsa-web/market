import { Bell, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DropdownPortal from './DropdownPortal'
import { useAuth } from '../../hooks/useAuth'
import { useFactory } from '../../hooks/useFactory'
import { useSpecialist } from '../../hooks/useSpecialist'
import { useMessageNotifications } from '../../hooks/useMessageNotifications'
import { formatPersianTime, formatBadgeCount } from '../../utils/dashboardUtils'

function NotificationBellUI({
  variant,
  messagesPath,
  unreadCount,
  previews,
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClick = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const bellClass = variant === 'dashboard' ? 'dash-header-notif' : 'header-bell'
  const badgeClass = variant === 'dashboard' ? 'dash-header-notif-badge' : 'header-bell-badge header-bell-badge--count'

  const handleItemClick = (conversationId) => {
    setOpen(false)
    navigate(`${messagesPath}?conversation=${conversationId}`)
  }

  return (
    <div className={variant === 'dashboard' ? 'dash-header-notif-wrap' : 'header-notif'} ref={triggerRef}>
      <button
        type="button"
        className={bellClass}
        aria-label="پیام‌های جدید"
        onClick={() => setOpen((p) => !p)}
      >
        <Bell size={variant === 'dashboard' ? 20 : 18} />
        {unreadCount > 0 && (
          <span className={badgeClass}>{formatBadgeCount(unreadCount)}</span>
        )}
      </button>

      <DropdownPortal
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={triggerRef}
        align="end"
        width={variant === 'home' ? 260 : 360}
        offset={variant === 'home' ? 20 : 28}
      >
        <div className="dash-notif-panel">
          <div className="dash-notif-panel-header">
            <h3>
              پیام‌های جدید
              {unreadCount > 0 && <span className="dash-notif-panel-count">{formatBadgeCount(unreadCount)}</span>}
            </h3>
            <button type="button" className="dash-notif-panel-close" onClick={() => setOpen(false)} aria-label="بستن">
              <X size={16} />
            </button>
          </div>

          <div className="dash-notif-panel-body">
            {previews.length === 0 ? (
              <p className="dash-notif-panel-empty">پیام خوانده‌نشده‌ای ندارید</p>
            ) : (
              previews.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="dash-notif-item"
                  onClick={() => handleItemClick(item.conversationId)}
                >
                  <div className="dash-notif-item-top">
                    <span className="dash-notif-item-name">{item.senderName}</span>
                    <span className="dash-notif-item-time">{formatPersianTime(item.timestamp)}</span>
                  </div>
                  <p className="dash-notif-item-text">{item.content}</p>
                </button>
              ))
            )}
          </div>

          <Link to={messagesPath} className="dash-notif-panel-footer" onClick={() => setOpen(false)}>
            مشاهده همه پیام‌ها
          </Link>
        </div>
      </DropdownPortal>
    </div>
  )
}

function FactoryDashboardBell(props) {
  const { stats, unreadPreviews } = useFactory()
  return (
    <NotificationBellUI
      {...props}
      unreadCount={stats.unreadMessages}
      previews={unreadPreviews}
    />
  )
}

function SpecialistDashboardBell(props) {
  const { stats, unreadPreviews } = useSpecialist()
  return (
    <NotificationBellUI
      {...props}
      unreadCount={stats.unreadMessages}
      previews={unreadPreviews}
    />
  )
}

function HomeMessageBell({ messagesPath, ...props }) {
  const { unreadCount, previews, enabled } = useMessageNotifications()
  if (!enabled) return null
  return (
    <NotificationBellUI
      {...props}
      variant="home"
      messagesPath={messagesPath}
      unreadCount={unreadCount}
      previews={previews}
    />
  )
}

export default function MessageNotificationBell({ variant = 'dashboard', messagesPath = '/factory/messages' }) {
  const { user } = useAuth()

  if (!user) return null

  if (variant === 'home') {
    return <HomeMessageBell variant={variant} messagesPath={messagesPath} />
  }

  if (user.role === 'specialist') {
    return <SpecialistDashboardBell variant={variant} messagesPath={messagesPath} />
  }

  if (user.role === 'factory') {
    return <FactoryDashboardBell variant={variant} messagesPath={messagesPath} />
  }

  return null
}
