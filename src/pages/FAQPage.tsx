import { useState, useMemo } from 'react'
import Header from '../components/home/Header'
import Footer from '../components/home/Footer'
import HeroSection from '../components/shared/HeroSection'
import CTASection from '../components/shared/CTASection'
import Accordion from '../components/shared/Accordion'
import CategoryTabs from '../components/faq/CategoryTabs'
import SearchInput from '../components/faq/SearchInput'
import { useFaq } from '../hooks/useFaq'
import styles from './FAQPage.module.css'

export default function FAQPage() {
  const { data, loading, error } = useFaq()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')

  if (loading) return <div className={styles.app}><Header /><div className={styles.loading}>در حال بارگذاری...</div><Footer /></div>
  if (error || !data) return <div className={styles.app}><Header /><div className={styles.error}>خطا در بارگذاری اطلاعات</div><Footer /></div>

  const filteredFaqs = useMemo(() => {
    let list = data.faqs
    if (activeCategory) {
      list = list.filter((faq: { category: string }) => faq.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((faq: { question: string; answer: string }) =>
        faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
      )
    }
    return list
  }, [data.faqs, activeCategory, search])

  return (
    <div className={styles.app}>
      <Header />

      <HeroSection title={data.hero.title} subtitle={data.hero.subtitle} />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.controls}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="جستجو در سوالات..."
            />
            <CategoryTabs
              categories={data.categories}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>

          {filteredFaqs.length === 0 ? (
            <div className={styles.empty}>
              <p>سوالی با جستجوی شما یافت نشد.</p>
            </div>
          ) : (
            <Accordion items={filteredFaqs} />
          )}
        </div>
      </section>

      <CTASection
        title={data.cta.title}
        subtitle={data.cta.subtitle}
        factoryBtn={data.cta.factoryBtn}
        specialistBtn={data.cta.specialistBtn}
      />

      <Footer />
    </div>
  )
}
