import {
  Building2,
  ChevronsUpDown,
  PanelLeftClose,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Logo } from '@/components/common/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDemo } from '@/demo/store'
import { ADMIN_NAV, FOOTER_NAV, HELP_NAV, MAIN_NAV, type NavItem } from './nav-config'

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
  const { company } = useDemo()

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
            title={company.name}
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
              <span className="block truncate text-[13px] font-medium">{company.name}</span>
              <span className="block text-[10.5px] text-muted-foreground">
                Рабочее пространство
              </span>
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
        )}
      </div>

      <nav className="no-scrollbar flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <div className="px-3 pb-1 text-[10.5px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            Основное
          </div>
        )}
        {MAIN_NAV.map((item) => (
          <NavItemLink key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}

        {!collapsed && (
          <div className="px-3 pt-4 pb-1 text-[10.5px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            Управление
          </div>
        )}
        {collapsed && <div className="my-2 h-px bg-border" />}
        {ADMIN_NAV.map((item) => (
          <NavItemLink key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="shrink-0 border-t px-3 py-3">
        {FOOTER_NAV.map((item) => (
          <NavItemLink key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
        <NavItemLink item={HELP_NAV} collapsed={collapsed} onNavigate={onNavigate} />
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
