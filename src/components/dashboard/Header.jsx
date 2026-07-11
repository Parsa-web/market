import { ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import DropdownPortal from './DropdownPortal'
import MessageNotificationBell from './MessageNotificationBell'
import { useAuth } from '../../hooks/useAuth'
import { PAGE_TITLES } from '../../utils/dashboardUtils'

function FactoryHeaderContent({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const pageTitle = PAGE_TITLES[location.pathname] || 'داشبورد'

  useEffect(() => {
    setProfileOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="dash-header">
      <div className="dash-header-start">
        <button type="button" className="dash-header-menu" onClick={onMenuToggle} aria-label="منو">
          <Menu size={22} />
        </button>
        <h1 className="dash-header-title">{pageTitle}</h1>
      </div>

      <div className="dash-header-end">
        <MessageNotificationBell variant="dashboard" messagesPath="/factory/messages" />

        <div className="dash-header-profile" ref={profileRef}>
          <button
            type="button"
            className="dash-header-profile-btn"
            onClick={() => setProfileOpen((p) => !p)}
            aria-expanded={profileOpen}
          >
            <Avatar name={user?.company} initials={user?.company?.slice(0, 2)} size="sm" />
            <ChevronDown size={14} className={`dash-header-chevron${profileOpen ? ' open' : ''}`} />
          </button>

          <DropdownPortal
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            anchorRef={profileRef}
            align="end"
            width={220}
            offset={28}
          >
            <div className="dash-header-dropdown">
              <div className="dash-header-dropdown-info">
                <p className="dash-header-dropdown-name">{user?.company || 'کارخانه'}</p>
                <span className="dash-header-dropdown-role">کارخانه</span>
              </div>
              <Link to="/factory/settings" className="dash-header-dropdown-item" onClick={() => setProfileOpen(false)}>
                <Settings size={16} />
                تنظیمات حساب
              </Link>
              <Link to="/factory/profile" className="dash-header-dropdown-item" onClick={() => setProfileOpen(false)}>
                <User size={16} />
                پروفایل کارخانه
              </Link>
              <button type="button" className="dash-header-dropdown-item dash-header-dropdown-item--danger" onClick={handleLogout}>
                <LogOut size={16} />
                خروج
              </button>
            </div>
          </DropdownPortal>
        </div>
      </div>
    </header>
  )
}

function SpecialistHeaderContent({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const pageTitle = PAGE_TITLES[location.pathname] || 'داشبورد'

  useEffect(() => {
    setProfileOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = user?.fullName?.split(' ').map((w) => w[0]).join('').slice(0, 2)

  return (
    <header className="dash-header">
      <div className="dash-header-start">
        <button type="button" className="dash-header-menu" onClick={onMenuToggle} aria-label="منو">
          <Menu size={22} />
        </button>
        <h1 className="dash-header-title">{pageTitle}</h1>
      </div>

      <div className="dash-header-end">
        <MessageNotificationBell variant="dashboard" messagesPath="/specialist/messages" />

        <div className="dash-header-profile" ref={profileRef}>
          <button
            type="button"
            className="dash-header-profile-btn"
            onClick={() => setProfileOpen((p) => !p)}
            aria-expanded={profileOpen}
          >
            <Avatar name={user?.fullName} initials={initials} size="sm" />
            <ChevronDown size={14} className={`dash-header-chevron${profileOpen ? ' open' : ''}`} />
          </button>

          <DropdownPortal
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            anchorRef={profileRef}
            align="end"
            width={220}
            offset={28}
          >
            <div className="dash-header-dropdown">
              <div className="dash-header-dropdown-info">
                <p className="dash-header-dropdown-name">{user?.fullName || 'متخصص'}</p>
                <span className="dash-header-dropdown-role">متخصص فنی</span>
              </div>
              <Link to="/specialist/settings" className="dash-header-dropdown-item" onClick={() => setProfileOpen(false)}>
                <Settings size={16} />
                تنظیمات حساب
              </Link>
              <Link to="/specialist/profile" className="dash-header-dropdown-item" onClick={() => setProfileOpen(false)}>
                <User size={16} />
                پروفایل تخصصی
              </Link>
              <button type="button" className="dash-header-dropdown-item dash-header-dropdown-item--danger" onClick={handleLogout}>
                <LogOut size={16} />
                خروج
              </button>
            </div>
          </DropdownPortal>
        </div>
      </div>
    </header>
  )
}

export default function DashboardHeader({ onMenuToggle }) {
  const { user } = useAuth()

  if (user?.role === 'specialist') {
    return <SpecialistHeaderContent onMenuToggle={onMenuToggle} />
  }

  return <FactoryHeaderContent onMenuToggle={onMenuToggle} />
}
