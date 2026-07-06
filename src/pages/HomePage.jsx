import CategoriesSection from '../components/home/CategoriesSection'
import CtaSection from '../components/home/CtaSection'
import Footer from '../components/home/Footer'
import Header from '../components/home/Header'
import Hero from '../components/home/Hero'
import RequestsSection from '../components/home/RequestsSection'
import SpecialistsSection from '../components/home/SpecialistsSection'
import WhySection from '../components/home/WhySection'

export default function HomePage() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <CategoriesSection />
      <SpecialistsSection />
      <RequestsSection />
      <WhySection />
      <CtaSection />
      <Footer />
    </div>
  )
}
