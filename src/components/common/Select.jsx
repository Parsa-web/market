import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'

export default function Select({
  label,
  icon: Icon,
  iconSize = 18,
  error,
  required = false,
  fullWidth = false,
  className = '',
  value,
  onChange,
  onClearError,
  options = [],
  placeholder = 'انتخاب کنید',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusIdx, setFocusIdx] = useState(-1)
  const wrapperRef = useRef(null)
  const dropdownRef = useRef(null)
  const listRef = useRef(null)
  const triggerRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })

  const selected = options.find((o) => o.value === value)
  const selectedIdx = selected ? options.indexOf(selected) : -1

  // --- close on outside click (ignores clicks inside portal dropdown) ---
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (
        wrapperRef.current && !wrapperRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  // --- position portal dropdown ---
  const measure = useCallback(() => {
    if (!wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 6, left: rect.left, width: rect.width })
  }, [])

  useLayoutEffect(() => {
    if (isOpen) measure()
  }, [isOpen, measure])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [isOpen, measure])

  // --- scroll focused option into view ---
  useEffect(() => {
    if (!isOpen || focusIdx < 0 || !listRef.current) return
    const el = listRef.current.children[focusIdx]
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [focusIdx, isOpen])

  const open = () => {
    if (!isOpen) {
      const idx = selectedIdx >= 0 ? selectedIdx : 0
      setFocusIdx(idx)
    }
    setIsOpen((o) => !o)
  }

  const select = (opt) => {
    onChange?.(opt.value)
    onClearError?.()
    setIsOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (isOpen && focusIdx >= 0 && options[focusIdx]) {
        select(options[focusIdx])
      } else {
        open()
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      return
    }
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        open()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusIdx((prev) => (prev < options.length - 1 ? prev + 1 : 0))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusIdx((prev) => (prev > 0 ? prev - 1 : options.length - 1))
      return
    }
  }

  const dropdown = (
    <div
      ref={dropdownRef}
      className={`sel-dropdown${isOpen ? ' sel-dropdown--open' : ''}`}
      style={{ top: pos.top, left: pos.left, width: Math.max(pos.width, 260) }}
    >
      <div className="sel-dropdown-inner">
        <div className="sel-options" ref={listRef} role="listbox">
          {options.map((opt, i) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              className={`sel-option${opt.value === value ? ' sel-option--selected' : ''}${i === focusIdx ? ' sel-option--focused' : ''}`}
              onClick={() => select(opt)}
              onMouseEnter={() => setFocusIdx(i)}
            >
              <span className="sel-option-text">
                <span className="sel-option-label">{opt.label}</span>
                {opt.description && (
                  <span className="sel-option-desc">{opt.description}</span>
                )}
              </span>
              {opt.value === value && (
                <span className="sel-option-check">
                  <Check size={16} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div
      className={`auth-field${fullWidth ? ' rg-full' : ''}${className ? ` ${className}` : ''}`}
      ref={wrapperRef}
    >
      {label && (
        <label className="auth-field-label">
          {label}
          {required && <span className="rg-required">*</span>}
        </label>
      )}
      <button
        type="button"
        ref={triggerRef}
        className={`sel-trigger${error ? ' sel-trigger--error' : ''}${isOpen ? ' sel-trigger--open' : ''}`}
        onClick={open}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {Icon && <Icon className="sel-trigger-icon" size={iconSize} />}
        <span className={`sel-trigger-value${!selected ? ' sel-trigger-value--placeholder' : ''}`}>
          {selected ? (
            <>
              {selected.icon && <selected.icon size={16} className="sel-trigger-inline-icon" />}
              {selected.label}
            </>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown size={16} className={`sel-chevron${isOpen ? ' sel-chevron--open' : ''}`} />
      </button>
      {error && <p className="auth-error-text">{error}</p>}
      {isOpen && createPortal(dropdown, document.body)}
    </div>
  )
}
