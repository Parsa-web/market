import { requests } from '../../data/homeData'

export default function RequestsSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">نیازهای جدید کارخانه‌ها</h2>
          <p className="section-desc">درخواست‌های ثبت شده برای تعمیر و نگهداری تخصصی</p>
        </div>

        <div className="requests-grid">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-top">
                <h3 className="request-title">{request.title}</h3>
                <span className={`request-badge ${request.status === 'فوری' ? 'urgent' : 'pending'}`}>
                  {request.status}
                </span>
              </div>
              <div className="request-details">
                <div className="request-detail">
                  <span className="detail-label">صنعت</span>
                  <span className="detail-value">{request.industry}</span>
                </div>
                <div className="request-detail">
                  <span className="detail-label">تجهیزات</span>
                  <span className="detail-value">{request.equipment}</span>
                </div>
                <div className="request-detail">
                  <span className="detail-label">برند</span>
                  <span className="detail-value brand">{request.brand}</span>
                </div>
              </div>
              <div className="request-skills">
                <span className="skills-label">مهارت:</span>
                <span className="skills-value">{request.skills}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
