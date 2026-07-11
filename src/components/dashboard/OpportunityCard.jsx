import { Building2, MapPin, Send } from 'lucide-react'
import Button from '../common/Button'
import Badge from './Badge'

export default function OpportunityCard({ opportunity, onView, onApply, compact = false }) {
  return (
    <article className={`dash-opportunity-card${compact ? ' dash-opportunity-card--compact' : ''}`}>
      <div className="dash-opportunity-card-top">
        <div className="dash-opportunity-factory">
          <div className="dash-opportunity-factory-icon">
            <Building2 size={18} />
          </div>
          <div>
            <h3 className="dash-opportunity-factory-name">{opportunity.factoryName || 'کارخانه صنعتی'}</h3>
            <span className="dash-opportunity-industry">{opportunity.industry || ''}</span>
          </div>
        </div>
        {opportunity.applied && <Badge variant="completed">درخواست ارسال شده</Badge>}
      </div>

      <h4 className="dash-opportunity-title">{opportunity.title}</h4>

      <div className="dash-opportunity-details">
        <div className="dash-opportunity-detail">
          <span className="dash-opportunity-detail-label">صنعت</span>
          <span>{opportunity.industry || opportunity.specialty}</span>
        </div>
        <div className="dash-opportunity-detail">
          <span className="dash-opportunity-detail-label">دستگاه</span>
          <span>{opportunity.machine || opportunity.equipment}</span>
        </div>
        <div className="dash-opportunity-detail">
          <span className="dash-opportunity-detail-label">برند</span>
          <span>{opportunity.brand}</span>
        </div>
        {!compact && (
          <div className="dash-opportunity-detail">
            <span className="dash-opportunity-detail-label">محل</span>
            <span><MapPin size={12} /> {opportunity.location || opportunity.city}</span>
          </div>
        )}
      </div>

      <div className="dash-opportunity-footer">
        <div className="dash-opportunity-actions">
          {onView && (
            <Button variant="ghost" className="dash-btn-sm" onClick={() => onView(opportunity)}>
              مشاهده درخواست
            </Button>
          )}
          {onApply && !opportunity.applied && (
            <Button variant="primary" className="dash-btn-sm" onClick={() => onApply(opportunity)}>
              <Send size={14} />
              ارسال درخواست همکاری
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
