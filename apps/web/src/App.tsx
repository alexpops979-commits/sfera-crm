import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { AuditPage } from '@/pages/audit-page'
import { ClientsPage } from '@/pages/clients-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { DealsPage } from '@/pages/deals-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { PipelinePage } from '@/pages/pipeline-page'
import { SettingsPage } from '@/pages/settings-page'
import { TasksPage } from '@/pages/tasks-page'
import { TeamPage } from '@/pages/team-page'
import { GuidePage } from '@/pages/guide-page'
import { LoginPage } from '@/pages/auth/login-page'
import { RegisterPage } from '@/pages/auth/register-page'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
