export default function Badge({ variant = 'default', children, className = '' }) {
  const classes = ['dash-badge', `dash-badge--${variant}`, className].filter(Boolean).join(' ')
  return <span className={classes}>{children}</span>
}
