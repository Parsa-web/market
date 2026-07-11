import { Briefcase, CheckCircle, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import { specialists } from '../../data/homeData'

export default function SpecialistsSection() {
  const navigate = useNavigate()

  return (
    <section className="section section-alt" id="specialists">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">متخصصان صنعتی فعال</h2>
          <p className="section-desc">تکنسین‌های تأیید شده با تجربه واقعی روی تجهیزات صنعتی</p>
        </div>

        <div className="specialists-grid">
          {specialists.map((specialist) => (
            <div key={specialist.id} className="specialist-card">
              <div className="specialist-top">
                {specialist.verified && (
                  <div className="verified-badge" title="تأیید شده">
                    <CheckCircle size={16} />
                  </div>
                )}
                <div className="specialist-avatar">{specialist.initials}</div>
              </div>
              <h3 className="specialist-name">{specialist.name}</h3>
              <p className="specialist-role">{specialist.role}</p>
              <div className="specialist-skills">
                {specialist.skills.map((skill) => (
                  <span key={skill} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="specialist-experience">
                <Briefcase size={13} />
                <span>{specialist.experience}</span>
              </div>
              <Button variant="primary" fullWidth onClick={() => navigate('/specialists')}>
                <Eye size={16} />
                مشاهده پروفایل
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
