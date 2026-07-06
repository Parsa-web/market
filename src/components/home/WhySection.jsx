import { whyFeatures } from '../../data/homeData'

export default function WhySection() {
  return (
    <section className="section section-alt" id="why">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">چرا این پلتفرم؟</h2>
          <p className="section-desc">راهکاری تخصصی برای اتصال کارخانه به تکنسین واقعی</p>
        </div>

        <div className="trust-grid">
          {whyFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.id} className="trust-card">
                <div className="trust-icon">
                  <Icon size={26} />
                </div>
                <h3 className="trust-title">{feature.title}</h3>
                <p className="trust-desc">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
