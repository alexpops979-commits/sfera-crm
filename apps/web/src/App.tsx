import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'

const DashboardPage = lazy(() =>
  import('@/pages/dashboard-page').then((module) => ({ default: module.DashboardPage })),
)
const PipelinePage = lazy(() =>
  import('@/pages/pipeline-page').then((module) => ({ default: module.PipelinePage })),
)
const ClientsPage = lazy(() =>
  import('@/pages/clients-page').then((module) => ({ default: module.ClientsPage })),
)
const DealsPage = lazy(() =>
  import('@/pages/deals-page').then((module) => ({ default: module.DealsPage })),
)
const TasksPage = lazy(() =>
  import('@/pages/tasks-page').then((module) => ({ default: module.TasksPage })),
)
const TeamPage = lazy(() =>
  import('@/pages/team-page').then((module) => ({ default: module.TeamPage })),
)
const AuditPage = lazy(() =>
  import('@/pages/audit-page').then((module) => ({ default: module.AuditPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/settings-page').then((module) => ({ default: module.SettingsPage })),
)
const GuidePage = lazy(() =>
  import('@/pages/guide-page').then((module) => ({ default: module.GuidePage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/not-found-page').then((module) => ({ default: module.NotFoundPage })),
)
const LoginPage = lazy(() =>
  import('@/pages/auth/login-page').then((module) => ({ default: module.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/pages/auth/register-page').then((module) => ({ default: module.RegisterPage })),
)

function RouteFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
        <span className="size-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        Загрузка…
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
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
    </Suspense>
  )
}
