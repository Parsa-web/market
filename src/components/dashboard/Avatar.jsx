export default function Avatar({ name, initials, size = 'md', className = '' }) {
  const display = initials || (name ? name.slice(0, 2) : '؟')
  const classes = ['dash-avatar', `dash-avatar--${size}`, className].filter(Boolean).join(' ')

  return (
    <div className={classes} title={name}>
      {display}
    </div>
  )
}
