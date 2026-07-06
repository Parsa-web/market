import { Route, Routes } from 'react-router-dom'

import HomePage from '../pages/HomePage'
import HowItWorksPage from '../pages/HowItWorksPage'
import SpecialistsPage from '../pages/SpecialistsPage'
import IndustrialRequestsPage from '../pages/IndustrialRequestsPage'
import AboutPage from '../pages/AboutPage'
import FAQPage from '../pages/FAQPage'
import TermsPage from '../pages/TermsPage'
import PrivacyPage from '../pages/PrivacyPage'
import ContactPage from '../pages/ContactPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import RegisterPage from '../pages/RegisterPage'

import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'

import FactoryDashboardPage from '../pages/factory/FactoryDashboardPage'
import NewRequestPage from '../pages/factory/NewRequestPage'
import RequestsPage from '../pages/factory/RequestsPage'
import FactoryApplicationsPage from '../pages/factory/FactoryApplicationsPage'
import MessagesPage from '../pages/factory/MessagesPage'
import FactoryProfilePage from '../pages/factory/FactoryProfilePage'
import SettingsPage from '../pages/factory/SettingsPage'

import SpecialistDashboardPage from '../pages/specialist/SpecialistDashboardPage'
import SpecialistProfilePage from '../pages/specialist/SpecialistProfilePage'
import MachineExperiencePage from '../pages/specialist/MachineExperiencePage'
import CertificatesPage from '../pages/specialist/CertificatesPage'
import PortfolioPage from '../pages/specialist/PortfolioPage'
import OpportunitiesPage from '../pages/specialist/OpportunitiesPage'
import SpecialistApplicationsPage from '../pages/specialist/SpecialistApplicationsPage'
import SpecialistMessagesPage from '../pages/specialist/SpecialistMessagesPage'
import SpecialistSettingsPage from '../pages/specialist/SpecialistSettingsPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/specialists" element={<SpecialistsPage />} />
      <Route path="/requests" element={<IndustrialRequestsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/rules" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/factory" element={<ProtectedRoute role="factory" />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<FactoryDashboardPage />} />
          <Route path="requests/new" element={<NewRequestPage />} />
          <Route path="requests/:id/edit" element={<NewRequestPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="applications" element={<FactoryApplicationsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="messages/:conversationId" element={<MessagesPage />} />
          <Route path="profile" element={<FactoryProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/specialist" element={<ProtectedRoute role="specialist" />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<SpecialistDashboardPage />} />
          <Route path="profile" element={<SpecialistProfilePage />} />
          <Route path="machines" element={<MachineExperiencePage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="opportunities" element={<OpportunitiesPage />} />
          <Route path="opportunities/:id" element={<OpportunitiesPage />} />
          <Route path="applications" element={<SpecialistApplicationsPage />} />
          <Route path="messages" element={<SpecialistMessagesPage />} />
          <Route path="messages/:conversationId" element={<SpecialistMessagesPage />} />
          <Route path="settings" element={<SpecialistSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
