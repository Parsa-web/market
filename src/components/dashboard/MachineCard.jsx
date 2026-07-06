import { Calendar, Factory, Pencil, Trash2 } from 'lucide-react'
import Badge from './Badge'

export default function MachineCard({ machine, onEdit, onRemove }) {
  return (
    <article className="dash-machine-card">
      <div className="dash-machine-card-top">
        <div className="dash-machine-card-icon">
          <Factory size={20} />
        </div>
        <div className="dash-machine-card-info">
          <h3 className="dash-machine-card-name">{machine.name}</h3>
          <div className="dash-machine-card-meta">
            <Badge variant="brand">{machine.brand}</Badge>
            <span className="dash-machine-industry">{machine.industry}</span>
          </div>
        </div>
        <div className="dash-machine-card-actions">
          {onEdit && (
            <button type="button" className="dash-icon-btn" onClick={() => onEdit(machine)} aria-label="ویرایش">
              <Pencil size={16} />
            </button>
          )}
          {onRemove && (
            <button type="button" className="dash-icon-btn dash-icon-btn--danger" onClick={() => onRemove(machine)} aria-label="حذف">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      <p className="dash-machine-card-desc">{machine.description}</p>
      <div className="dash-machine-card-footer">
        <Calendar size={14} />
        <span>{machine.years} سال تجربه</span>
      </div>
    </article>
  )
}
