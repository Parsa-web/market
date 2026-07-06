export default function Button({
  variant = 'primary',
  size,
  fullWidth = false,
  auth = false,
  loading = false,
  loadingText,
  className = '',
  children,
  disabled,
  type = 'button',
  ...props
}) {
  if (auth) {
    const authClass = ['auth-btn', 'auth-btn-primary', className].filter(Boolean).join(' ')

    return (
      <button type={type} className={authClass} disabled={disabled || loading} {...props}>
        {loading ? (
          <span className="auth-btn-loader">
            <span className="auth-spinner" />
            {loadingText}
          </span>
        ) : (
          children
        )}
      </button>
    )
  }

  const classes = [
    'btn',
    variant === 'primary' && 'btn-primary',
    variant === 'ghost' && 'btn-ghost',
    variant === 'outline' && 'btn-outline',
    variant === 'white' && 'btn-white',
    size === 'lg' && 'btn-lg',
    fullWidth && 'btn-full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <span className="auth-btn-loader">
          <span className="auth-spinner" />
          {loadingText || children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
