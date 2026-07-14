import { createPortal } from 'react-dom'
import { useEffect, useLayoutEffect, useState } from 'react'

export default function DropdownPortal({ open, onClose, anchorRef, children, align = 'start', width = 240, offset = 22 }) {
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return

    const update = () => {
      const rect = anchorRef.current.getBoundingClientRect()
      let left = align === 'end' ? rect.right - width : rect.left

      if (left + width > window.innerWidth - 12) {
        left = window.innerWidth - width - 12
      }
      if (left < 12) left = 12

      setPos({ top: rect.bottom + offset, left })
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, anchorRef, align, width, offset])

  if (!open) return null

  return createPortal(
    <>
      <div className="dash-dropdown-overlay" onClick={onClose} aria-hidden="true" />
      <div
        className="dash-dropdown-portal"
        style={{ top: pos.top, left: pos.left, width }}
        role="menu"
      >
        {children}
      </div>
    </>,
    document.body
  )
}
