import { Link } from 'react-router-dom'

export default function CtaSection() {
  return (
    <section className="cta-section">
      <div className="container">
        <h2 className="cta-title">تجهیزات صنعتی شما، متخصص مناسب خودش را دارد</h2>
        <div className="cta-buttons">
          <Link to="/register?role=factory" className="btn btn-primary btn-lg">
            ثبت نیاز کارخانه
          </Link>
          <Link to="/register?role=specialist" className="btn btn-outline btn-lg btn-white">
            ساخت پروفایل متخصص
          </Link>
        </div>
      </div>
    </section>
  )
}
