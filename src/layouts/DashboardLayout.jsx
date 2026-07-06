import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FactoryProvider } from '../hooks/useFactory'
import { SpecialistProvider } from '../hooks/useSpecialist'
import DashboardHeader from '../components/dashboard/Header'
import Sidebar from '../components/dashboard/Sidebar'

function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="dash-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dash-main">
        <DashboardHeader onMenuToggle={() => setSidebarOpen(true)} />
        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const { user } = useAuth()

  if (user?.role === 'specialist') {
    return (
      <SpecialistProvider>
        <DashboardShell />
      </SpecialistProvider>
    )
  }

  return (
    <FactoryProvider>
      <DashboardShell />
    </FactoryProvider>
  )
}
