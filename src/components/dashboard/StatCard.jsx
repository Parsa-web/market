import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, description, to, onClick }) {
  const content = (
    <>
      <div className="dash-stat-icon">
        <Icon size={22} />
      </div>
      <div className="dash-stat-content">
        <span className="dash-stat-value">{value}</span>
        <span className="dash-stat-label">{label}</span>
        {description && <span className="dash-stat-desc">{description}</span>}
      </div>
      <ArrowLeft size={16} className="dash-stat-arrow" />
    </>
  )

  if (to) {
    return (
      <Link to={to} className="dash-stat-card">
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className="dash-stat-card" onClick={onClick}>
      {content}
    </button>
  )
}
