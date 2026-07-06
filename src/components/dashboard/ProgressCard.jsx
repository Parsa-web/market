import { Link } from 'react-router-dom'
import Button from '../common/Button'

export default function ProgressCard({ percentage, missingItems = [], onComplete }) {
  return (
    <div className="dash-progress-card">
      <div className="dash-progress-header">
        <div>
          <h3 className="dash-progress-title">تکمیل پروفایل</h3>
          <p className="dash-progress-desc">پروفایل کامل‌تر، شانس بیشتر برای همکاری با کارخانه‌ها</p>
        </div>
        <span className="dash-progress-percent">{percentage}٪</span>
      </div>

      <div className="dash-progress-bar-wrap">
        <div className="dash-progress-bar" style={{ width: `${percentage}%` }} />
      </div>

      {missingItems.length > 0 && (
        <div className="dash-progress-missing">
          <span className="dash-progress-missing-label">موارد باقی‌مانده:</span>
          <ul className="dash-progress-missing-list">
            {missingItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {onComplete && (
        <Button variant="primary" className="dash-progress-btn" onClick={onComplete}>
          تکمیل پروفایل
        </Button>
      )}
    </div>
  )
}
