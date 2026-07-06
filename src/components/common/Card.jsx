export default function Card({ variant = 'default', className = '', children, ...props }) {
  const variantClass =
    variant === 'auth'
      ? 'auth-card'
      : variant === 'category'
        ? 'category-card'
        : variant === 'specialist'
          ? 'specialist-card'
          : variant === 'request'
            ? 'request-card'
            : variant === 'trust'
              ? 'trust-card'
              : variant === 'role'
                ? 'rg-role-card'
                : ''

  const classes = [variantClass, className].filter(Boolean).join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
