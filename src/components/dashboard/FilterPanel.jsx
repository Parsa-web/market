import Select from '../common/Select'

export default function FilterPanel({ filters, onChange, onReset }) {
  return (
    <div className="dash-filter-panel">
      {filters.map((filter) => (
        <div key={filter.key} className="dash-filter-field">
          <label className="dash-filter-label">{filter.label}</label>
          {filter.type === 'select' ? (
            <Select
              value={filter.value}
              onChange={(value) => onChange(filter.key, value)}
              options={filter.options}
              placeholder={filter.placeholder}
              fullWidth
            />
          ) : (
            <input
              type="text"
              className="dash-filter-input"
              value={filter.value}
              onChange={(e) => onChange(filter.key, e.target.value)}
              placeholder={filter.placeholder}
            />
          )}
        </div>
      ))}
      {onReset && (
        <button type="button" className="dash-filter-reset" onClick={onReset}>
          پاک کردن فیلترها
        </button>
      )}
    </div>
  )
}