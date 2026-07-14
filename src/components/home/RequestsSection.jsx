import { useEffect, useState, useMemo } from 'react'
import { MapPin, Building2 } from 'lucide-react'
import { formatBudget } from '../../utils/dashboardUtils'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function toCardData(req, factoryMap) {
  const deadline = req.applicationDeadline || ''
  return {
    id: req.id,
    title: req.title,
    factoryName: factoryMap[req.factoryId] || 'کارخانه صنعتی',
    industry: req.industry || '',
    machine: req.machine || '',
    brand: req.brand || '',
    city: req.location || '',
    skills: req.skillsRequired || [],
    budget: req.budget || '',
    deadline,
    deadlineTime: new Date(deadline).getTime() || Infinity,
  }
}

export default function RequestsSection() {
  const [cards, setCards] = useState([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [reqs, factories] = await Promise.all([
          fetch(`${API_BASE}/industrialRequests`).then(r => r.json()),
          fetch(`${API_BASE}/factories`).then(r => r.json()),
        ])
        if (cancelled) return
        const fMap = {}
        factories.forEach(f => { fMap[f.id] = f.companyName })
        const open = (reqs || []).filter(r => r.status === 'published' || r.status === 'waiting_for_applications')
        const mapped = open.map(r => toCardData(r, fMap))
        mapped.sort((a, b) => (a.deadlineTime || Infinity) - (b.deadlineTime || Infinity))
        setCards(mapped.slice(0, 6))
      } catch { /* ignore */ }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (cards.length === 0) return null

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">نیازهای جدید کارخانه‌ها</h2>
          <p className="section-desc">درخواست‌های ثبت شده برای تعمیر و نگهداری تخصصی</p>
        </div>

        <div className="requests-grid">
          {cards.map((r) => (
            <div key={r.id} className="home-req-card">
              <div className="home-req-accent" />
              <div className="home-req-header">
                <div className="home-req-title-row">
                  <div className="home-req-icon"><Building2 size={15} /></div>
                  <div className="home-req-title-info">
                    <h3 className="home-req-title">{r.title}</h3>
                    <div className="home-req-factory">{r.factoryName}</div>
                  </div>
                </div>
              </div>

              {r.skills.length > 0 && (
                <div className="home-req-skills">
                  {r.skills.slice(0, 4).map(s => (
                    <span key={s} className="home-req-skill">{s}</span>
                  ))}
                  {r.skills.length > 4 && <span className="home-req-skill">+{r.skills.length - 4}</span>}
                </div>
              )}

              <div className="home-req-footer">
                <div className="home-req-meta">
                  <span className="home-req-meta-item">
                    <MapPin size={11} className="home-req-meta-icon" />
                    {r.city || '—'}
                  </span>
                  {r.budget && <><span className="home-req-meta-dot" /><span className="home-req-budget">{formatBudget(r.budget)}</span></>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
