import { ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { categories } from '../../data/homeData'

export default function CategoriesSection() {
  const navigate = useNavigate()

  return (
    <section className="section" id="categories">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">متخصص مناسب برای تجهیزات خود را پیدا کنید</h2>
          <p className="section-desc">جستجوی تخصصی بر اساس حوزه مهارت و نوع دستگاه</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                type="button"
                className="category-card"
                onClick={() => navigate('/register?role=factory')}
              >
                <div className="category-icon">
                  <Icon size={26} />
                </div>
                <div className="category-info">
                  <h3 className="category-title">{category.title}</h3>
                  <p className="category-desc">{category.desc}</p>
                  <span className="category-count">{category.count} متخصص</span>
                </div>
                <ArrowUpRight size={18} className="category-arrow" />
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
