import { useNavigate } from 'react-router-dom'
import { Star, Briefcase, CheckCircle, Eye, Award } from 'lucide-react'
import { specialists } from '../../data/homeData'

const starIcons = [1, 2, 3, 4, 5]

export default function SpecialistsSection() {
  const navigate = useNavigate()

  return (
    <section className="section" id="specialists">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">برترین متخصصان</h2>
          <p className="section-desc">تکنسین‌های تأیید شده با تجربه واقعی روی تجهیزات صنعتی</p>
        </div>

        <div className="spec-grid">
          {specialists.map((specialist) => (
            <div key={specialist.id} className="spec-card">
              <div className="spec-card-glow" />

              <div className="spec-card-top">
                <div className="spec-verified-pill">
                  <CheckCircle size={12} />
                  <span>تأیید شده</span>
                </div>
                <div className="spec-rating-badge">
                  <Star size={12} fill="currentColor" />
                  <span>{specialist.rating}</span>
                </div>
              </div>

              <div className="spec-avatar-wrap">
                <div className="spec-avatar" style={{ background: specialist.bg }}>
                  {specialist.initials}
                </div>
              </div>

              <h3 className="spec-name">{specialist.name}</h3>
              <p className="spec-role">{specialist.role}</p>

              <div className="spec-stars">
                {starIcons.map((i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`spec-star${i <= Math.round(specialist.rating) ? ' spec-star--filled' : ''}`}
                    fill={i <= Math.round(specialist.rating) ? 'var(--primary)' : 'none'}
                  />
                ))}
              </div>

              <div className="spec-skills">
                {specialist.skills.map((skill) => (
                  <span key={skill} className="spec-skill">{skill}</span>
                ))}
              </div>

              <div className="spec-stats">
                <div className="spec-stat">
                  <Briefcase size={14} className="spec-stat-icon" />
                  <span>{specialist.experience}</span>
                </div>
                <div className="spec-stat-dot" />
                <div className="spec-stat">
                  <Award size={14} className="spec-stat-icon" />
                  <span>{specialist.jobs} پروژه</span>
                </div>
              </div>

              <button
                className="spec-btn"
                onClick={() => navigate('/specialists')}
              >
                <Eye size={15} />
                مشاهده پروفایل
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}