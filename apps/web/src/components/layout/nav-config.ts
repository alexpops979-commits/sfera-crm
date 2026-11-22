import {
  Briefcase,
  CheckSquare,
  Columns3,
  History,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  adminOnly?: boolean
}

export const MAIN_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { to: '/pipeline', label: 'Воронка', icon: Columns3 },
  { to: '/clients', label: 'Клиенты', icon: Users },
  { to: '/deals', label: 'Сделки', icon: Briefcase },
  { to: '/tasks', label: 'Задачи', icon: CheckSquare },
]

export const ADMIN_NAV: NavItem[] = [
  { to: '/team', label: 'Команда', icon: UserCog, adminOnly: true },
  { to: '/audit', label: 'Журнал действий', icon: History, adminOnly: true },
]

export const FOOTER_NAV: NavItem[] = [{ to: '/settings', label: 'Настройки', icon: Settings }]

export const HELP_NAV: NavItem = { to: '/guide', label: 'Помощь', icon: LifeBuoy }

export const ALL_NAV: NavItem[] = [...MAIN_NAV, ...ADMIN_NAV, ...FOOTER_NAV, HELP_NAV]
