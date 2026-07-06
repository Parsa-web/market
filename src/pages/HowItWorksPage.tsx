import Header from '../components/home/Header'
import Footer from '../components/home/Footer'
import HeroSection from '../components/how-it-works/HeroSection'
import AudienceCards from '../components/how-it-works/AudienceCards'
import FactoryTimeline from '../components/how-it-works/FactoryTimeline'
import SpecialistTimeline from '../components/how-it-works/SpecialistTimeline'
import MatchingDiagram from '../components/how-it-works/MatchingDiagram'
import BenefitsSection from '../components/how-it-works/BenefitsSection'
import FaqAccordion from '../components/how-it-works/FaqAccordion'
import CTASection from '../components/how-it-works/CTASection'

export default function HowItWorksPage() {
  return (
    <div className="app">
      <Header />
      <main>
        <HeroSection />
        <AudienceCards />
        <FactoryTimeline />
        <SpecialistTimeline />
        <MatchingDiagram />
        <BenefitsSection />
        <FaqAccordion />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
