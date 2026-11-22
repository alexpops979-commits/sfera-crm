import { ROLE_LABELS } from '@crm/shared'
import {
  Building2,
  ChevronDown,
  ChevronsUpDown,
  LifeBuoy,
  PanelLeftClose,
  Sparkles,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Logo } from '@/components/common/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DEMO_COMPANY, DEMO_USER } from '@/lib/demo'
import { ADMIN_NAV, FOOTER_NAV, MAIN_NAV, type NavItem } from './nav-config'

interface SidebarContentProps {
  collapsed: boolean
  onToggle?: () => void
  onNavigate?: () => void
  showToggle?: boolean
}

function NavItemLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem
  collapsed: boolean
  onNavigate?: () => void
}) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'group flex h-10 items-center gap-3 rounded-lg px-3 text-[13.5px] font-medium text-slate-600 transition-colors',
          'hover:bg-secondary hover:text-slate-900',
          isActive && 'bg-accent text-primary hover:bg-accent hover:text-primary',
          collapsed && 'justify-center px-0',
        )
      }
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={1.9} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  )
}

export function SidebarContent({
  collapsed,
  onToggle,
  onNavigate,
  showToggle = true,
}: SidebarContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b px-4',
          collapsed ? 'justify-center px-0' : 'justify-between',
        )}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg p-1 transition-opacity hover:opacity-80"
            aria-label="Развернуть меню"
          >
            <Logo showText={false} />
          </button>
        ) : (
          <>
            <Logo />
            {showToggle && onToggle && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onToggle}
                aria-label="Свернуть меню"
              >
                <PanelLeftClose className="size-4" />
              </Button>
            )}
          </>
        )}
      </div>

      <div className="px-3 pt-3">
        {collapsed ? (
          <Button
            variant="outline"
            size="icon-sm"
            className="mx-auto flex border-dashed text-muted-foreground"
            title={DEMO_COMPANY.name}
          >
            <Building2 className="size-4" />
          </Button>
        ) : (
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-xl border bg-card px-3 py-2.5 text-left transition-colors hover:bg-secondary/50"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
              <Building2 className="size-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">{DEMO_COMPANY.name}</span>
              <span className="block text-[10.5px] text-muted-foreground">
                Тариф {DEMO_COMPANY.plan}
              </span>
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
        )}
      </div>

      <nav className="no-scrollbar flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <div className="px-3 pb-1 text-[10.5px] font-semibold tracking-[0.08em] text-muted-foreground/80 uppercase">
            Основное
          </div>
        )}
        {MAIN_NAV.map((item) => (
          <NavItemLink key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}

        {!collapsed && (
          <div className="px-3 pt-4 pb-1 text-[10.5px] font-semibold tracking-[0.08em] text-muted-foreground/80 uppercase">
            Управление
          </div>
        )}
        {collapsed && <div className="my-2 h-px bg-border" />}
        {ADMIN_NAV.map((item) => (
          <NavItemLink key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </nav>

      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3B74FF] to-[#1B4BD6] p-4 text-white shadow-lg shadow-primary/25">
            <div className="absolute -top-10 -right-8 size-24 rounded-full bg-white/10" />
            <div className="absolute -right-2 -bottom-10 size-20 rounded-full bg-white/10" />
            <div className="relative">
              <Sparkles className="size-4" />
              <p className="mt-2 text-[13px] font-semibold">Больше возможностей</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-white/75">
                Автоматизация, интеграции и расширенная аналитика в тарифе Pro.
              </p>
              <Button
                size="sm"
                className="mt-3 w-full bg-white text-[#1B4BD6] shadow-none hover:bg-white/90"
              >
                Перейти на Pro
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="shrink-0 border-t px-3 py-3">
        {FOOTER_NAV.map((item) => (
          <NavItemLink key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
        <a
          href="#help"
          onClick={onNavigate}
          title={collapsed ? 'Помощь' : undefined}
          className={cn(
            'group flex h-10 items-center gap-3 rounded-lg px-3 text-[13.5px] font-medium text-slate-600 transition-colors hover:bg-secondary hover:text-slate-900',
            collapsed && 'justify-center px-0',
          )}
        >
          <LifeBuoy className="size-[18px] shrink-0" strokeWidth={1.9} />
          {!collapsed && <span className="truncate">Помощь</span>}
        </a>

        {!collapsed && (
          <div className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-slate-600">
              ДА
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-medium">{DEMO_USER.name}</div>
              <div className="truncate text-[10.5px] text-muted-foreground">
                {ROLE_LABELS[DEMO_USER.role]}
              </div>
            </div>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  )
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-svh shrink-0 border-r bg-card transition-[width] duration-200 lg:flex',
        collapsed ? 'w-[76px]' : 'w-[264px]',
      )}
    >
      <SidebarContent collapsed={collapsed} onToggle={onToggle} />
    </aside>
  )
}
