import { ChevronDown, Menu, User, X, LogOut } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo'
import MessageNotificationBell from '../dashboard/MessageNotificationBell'
import { useAuth } from '../../hooks/useAuth'
import { getDashboardPath } from '../../utils/dashboardUtils'

const NAV_ITEMS = [
  { label: 'خانه', path: '/' },
  { label: 'چطور کار می‌کند', path: '/how-it-works' },
  { label: 'متخصص‌ها', path: '/specialists' },
  { label: 'درخواست‌های صنعتی', path: '/requests' },
]

const DROPDOWN_ITEMS = [
  { label: 'درباره ما', path: '/about' },
  { label: 'سوالات متداول', path: '/faq' },
  { label: 'قوانین و مقررات', path: '/rules' },
  { label: 'حریم خصوصی', path: '/privacy' },
  { label: 'تماس با ما', path: '/contact' },
]

const GAP = 20

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

export default function Header() {
  const { user, isLoading, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const moreBtnRef = useRef(null)
  const profileBtnRef = useRef(null)
  const moreRef = useRef(null)
  const moreDropdownRef = useRef(null)
  const profileRef = useRef(null)
  const profileDropdownRef = useRef(null)
  const [moreStyle, setMoreStyle] = useState({})
  const [profileStyle, setProfileStyle] = useState({})
  const isMobile = useMediaQuery('(max-width: 767px)')

  const dashboardPath = user ? getDashboardPath(user.role) : '/login'
  const messagesPath = user?.role === 'specialist' ? '/specialist/messages' : '/factory/messages'
  const displayName = user?.fullName || user?.company || user?.manager || 'کاربر'
  const roleLabel = user?.role === 'specialist' ? 'متخصص فنی' : 'کارخانه'

  const closeMenu = () => setMenuOpen(false)
  const closeAll = () => { setProfileOpen(false); setMoreOpen(false) }

  function getDropdownStyle(btnRef, width, inlineEndMargin = 0) {
    if (!btnRef.current) return {}
    const rect = btnRef.current.getBoundingClientRect()
    const isRtl = document.documentElement.dir === 'rtl'
    let left
    if (isRtl) {
      left = rect.left - inlineEndMargin
      const maxLeft = window.innerWidth - width - 16
      if (left > maxLeft) left = maxLeft
      if (left < 16) left = 16
    } else {
      left = rect.right - width - inlineEndMargin
      const maxLeft = window.innerWidth - width - 16
      if (left > maxLeft) left = maxLeft
      if (left < 16) left = 16
    }
    return { top: rect.bottom + GAP, left }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target) && !(moreDropdownRef.current && moreDropdownRef.current.contains(e.target))) {
        setMoreOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target) && !(profileDropdownRef.current && profileDropdownRef.current.contains(e.target))) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (moreOpen && moreBtnRef.current && !isMobile) {
      setMoreStyle(getDropdownStyle(moreBtnRef, 190))
    }
  }, [moreOpen, isMobile])

  useEffect(() => {
    if (profileOpen && profileBtnRef.current) {
      setProfileStyle(getDropdownStyle(profileBtnRef, 200, 12))
    }
  }, [profileOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
    closeAll()
    closeMenu()
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const moreDropdownContent = (
    <>
      {DROPDOWN_ITEMS.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`header-dropdown-item${isActive(item.path) ? ' active' : ''}`}
          onClick={() => { closeMenu(); setMoreOpen(false) }}
        >
          {item.label}
        </Link>
      ))}
    </>
  )

  const profileDropdownContent = (
    <>
      <div className="header-user-menu-info">
        <div className="header-user-menu-avatar">{displayName.charAt(0)}</div>
        <div>
          <p className="header-user-menu-name">{displayName}</p>
          <span className="header-user-menu-role">{roleLabel}</span>
        </div>
      </div>
      <Link to={dashboardPath} className="header-dropdown-item" onClick={() => setProfileOpen(false)}>
        <User size={16} />
        پنل کاربری
      </Link>
      <div className="header-dropdown-divider" />
      <button type="button" className="header-dropdown-item header-dropdown-item--danger" onClick={handleLogout}>
        <LogOut size={16} />
        خروج
      </button>
    </>
  )

  return (
    <>
      <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
        <div className="header-inner">
          <Logo to="/" onClick={closeMenu} />

          <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={isActive(item.path) ? 'active' : ''}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}

            <div className={`header-nav-more${moreOpen ? ' open' : ''}`} ref={moreRef}>
              <button
                type="button"
                ref={moreBtnRef}
                className="header-nav-more-btn"
                onClick={() => setMoreOpen((prev) => !prev)}
              >
                بیشتر
                <ChevronDown size={14} className={`header-chevron${moreOpen ? ' open' : ''}`} />
              </button>

              {isMobile && moreOpen && (
                <div className="header-nav-more-inline">
                  {moreDropdownContent}
                </div>
              )}
            </div>

            {user && (
              <Link to={dashboardPath} className="header-nav-profile" onClick={closeMenu}>
                <User size={16} />
                پنل کاربری
              </Link>
            )}

            <div className="header-mobile-buttons">
              {user ? (
                <>
                  <Link to={dashboardPath} className="btn btn-primary" onClick={closeMenu}>
                    <User size={15} />
                    پنل کاربری
                  </Link>
                  <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                    <LogOut size={15} />
                    خروج
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-primary" onClick={closeMenu}>
                    ورود
                  </Link>
                  <Link to="/register" className="btn btn-outline" onClick={closeMenu}>
                    ثبت‌نام
                  </Link>
                </>
              )}
            </div>
          </nav>

          <div className="header-actions">
            {isLoading ? (
              <div className="header-actions-skeleton" />
            ) : user ? (
              <div className="header-user" ref={profileRef}>
                <MessageNotificationBell variant="home" messagesPath={messagesPath} />

                <button
                  type="button"
                  ref={profileBtnRef}
                  className="header-user-badge"
                  onClick={() => setProfileOpen((prev) => !prev)}
                >
                  <User size={15} />
                  <span className="header-user-name">{displayName}</span>
                  <ChevronDown size={13} className={`header-chevron${profileOpen ? ' open' : ''}`} />
                </button>
              </div>
            ) : (
              <div className="header-auth-buttons">
                <Link to="/register" className="btn btn-outline btn-sm">
                  ثبت‌نام
                </Link>
                <Link to="/login" className="btn btn-primary btn-sm">
                  ورود
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="منو"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {!isMobile && createPortal(
        <div ref={moreDropdownRef} className={`header-dropdown-layer${moreOpen ? ' open' : ''}`} style={moreStyle}>
          <div className="header-dropdown-inner">
            {moreDropdownContent}
          </div>
        </div>,
        document.body
      )}

      {createPortal(
        <div ref={profileDropdownRef} className={`header-dropdown-layer${profileOpen ? ' open' : ''}`} style={profileStyle}>
          <div className="header-dropdown-inner">
            {profileDropdownContent}
          </div>
        </div>,
        document.body
      )}

      {(moreOpen || profileOpen) && createPortal(
        <div className="header-overlay" onClick={closeAll} />,
        document.body
      )}
    </>
  )
}
