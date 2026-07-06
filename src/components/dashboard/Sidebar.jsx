import {
  Award,
  Building2,
  ClipboardList,
  Cpu,
  FolderOpen,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PlusCircle,
  Send,
  Settings,
  Tag,
  User,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo'
import { useAuth } from '../../hooks/useAuth'
import { useFactory } from '../../hooks/useFactory'
import { useSpecialist } from '../../hooks/useSpecialist'
import { FACTORY_MENU, SPECIALIST_MENU, formatBadgeCount } from '../../utils/dashboardUtils'

const ICONS = {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Users,
  Send,
  MessageSquare,
  Building2,
  Settings,
  User,
  Wrench,
  Cpu,
  Tag,
  Award,
  FolderOpen,
  Home,
}

function FactorySidebarContent({ open, onClose }) {
  const { user, logout } = useAuth()
  const { stats } = useFactory()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    onClose?.()
  }

  const getBadge = (path) => {
    if (path === '/factory/applications' && stats.unreadApplications > 0) return stats.unreadApplications
    if (path === '/factory/messages' && stats.unreadMessages > 0) return stats.unreadMessages
    return null
  }

  return (
    <>
      <aside className={`dash-sidebar${open ? ' dash-sidebar--open' : ''}`}>
        <div className="dash-sidebar-top">
          <div className="dash-sidebar-brand-row">
            <div className="dash-sidebar-brand">
              <Logo variant="register" to="/factory" onClick={onClose} />
            </div>
            <button type="button" className="dash-sidebar-close" onClick={onClose} aria-label="بستن منو">
              <X size={20} />
            </button>
          </div>

          <div className="dash-sidebar-company">
            <div className="dash-sidebar-company-icon">
              <Building2 size={18} />
            </div>
            <div>
              <p className="dash-sidebar-company-name">{user?.company || 'کارخانه'}</p>
              <span className="dash-sidebar-role">کارخانه</span>
            </div>
          </div>
        </div>

        <nav className="dash-sidebar-nav">
          {FACTORY_MENU.map((item) => {
            const Icon = ICONS[item.icon]
            const badge = getBadge(item.path)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `dash-sidebar-link${isActive ? ' dash-sidebar-link--active' : ''}`
                }
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {badge !== null && <span className="dash-sidebar-badge">{formatBadgeCount(badge)}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="dash-sidebar-bottom">
          <Link to="/" className="dash-sidebar-home" onClick={onClose}>
            <Home size={20} />
            <span>بازگشت به صفحه اصلی</span>
          </Link>
          <button type="button" className="dash-sidebar-logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>خروج از حساب</span>
          </button>
        </div>
      </aside>

      {open && <div className="dash-sidebar-overlay" onClick={onClose} aria-hidden="true" />}
    </>
  )
}

function SpecialistSidebarContent({ open, onClose }) {
  const { user, logout } = useAuth()
  const { stats } = useSpecialist()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    onClose?.()
  }

  const getBadge = (path) => {
    if (path === '/specialist/applications' && stats.unreadApplicationUpdates > 0) return stats.unreadApplicationUpdates
    if (path === '/specialist/messages' && stats.unreadMessages > 0) return stats.unreadMessages
    return null
  }

  return (
    <>
      <aside className={`dash-sidebar${open ? ' dash-sidebar--open' : ''}`}>
        <div className="dash-sidebar-top">
          <div className="dash-sidebar-brand-row">
            <div className="dash-sidebar-brand">
              <Logo variant="register" to="/specialist" onClick={onClose} />
            </div>
            <button type="button" className="dash-sidebar-close" onClick={onClose} aria-label="بستن منو">
              <X size={20} />
            </button>
          </div>

          <div className="dash-sidebar-company">
            <div className="dash-sidebar-company-icon dash-sidebar-company-icon--specialist">
              <User size={18} />
            </div>
            <div>
              <p className="dash-sidebar-company-name">{user?.fullName || 'متخصص'}</p>
              <span className="dash-sidebar-role">متخصص فنی</span>
            </div>
          </div>
        </div>

        <nav className="dash-sidebar-nav">
          {SPECIALIST_MENU.map((item) => {
            const Icon = ICONS[item.icon]
            const badge = getBadge(item.path)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `dash-sidebar-link${isActive ? ' dash-sidebar-link--active' : ''}`
                }
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {badge !== null && <span className="dash-sidebar-badge">{formatBadgeCount(badge)}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="dash-sidebar-bottom">
          <Link to="/" className="dash-sidebar-home" onClick={onClose}>
            <Home size={20} />
            <span>بازگشت به صفحه اصلی</span>
          </Link>
          <button type="button" className="dash-sidebar-logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>خروج از حساب</span>
          </button>
        </div>
      </aside>

      {open && <div className="dash-sidebar-overlay" onClick={onClose} aria-hidden="true" />}
    </>
  )
}

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth()

  if (user?.role === 'specialist') {
    return <SpecialistSidebarContent open={open} onClose={onClose} />
  }

  return <FactorySidebarContent open={open} onClose={onClose} />
}
