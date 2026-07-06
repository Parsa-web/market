import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div
        className={`dash-modal dash-modal--${size}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="dash-modal-header">
          <h2 className="dash-modal-title">{title}</h2>
          <button type="button" className="dash-modal-close" onClick={onClose} aria-label="بستن">
            <X size={20} />
          </button>
        </div>
        <div className="dash-modal-body">{children}</div>
      </div>
    </div>
  )
}
