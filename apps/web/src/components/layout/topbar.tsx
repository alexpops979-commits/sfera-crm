import { ROLE_LABELS, initials } from '@crm/shared'
import { useQueryClient } from '@tanstack/react-query'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Settings,
  UserRound,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DEMO_USER } from '@/lib/demo'

interface TopbarProps {
  onOpenMobileNav: () => void
}

export function Topbar({ onOpenMobileNav }: TopbarProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-card/85 px-4 backdrop-blur-md lg:px-6">
      <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onOpenMobileNav}>
        <Menu className="size-[18px]" />
        <span className="sr-only">Открыть меню</span>
      </Button>

      <div className="relative hidden w-full max-w-[360px] md:block">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchRef}
          placeholder="Поиск клиентов, сделок, задач…"
          className="h-9 border-transparent bg-secondary/70 pr-14 pl-9 focus-visible:border-transparent focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring/20"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          Ctrl K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                void queryClient.invalidateQueries()
                toast.success('Данные обновлены')
              }}
            >
              <RefreshCw className="size-4" />
              <span className="sr-only">Обновить данные</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Обновить данные</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative"
              onClick={() =>
                toast.info('Центр уведомлений появится вместе с задачами и напоминаниями')
              }
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive ring-2 ring-card" />
              <span className="sr-only">Уведомления</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Уведомления</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1.5 h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <Avatar className="size-8">
                <AvatarFallback>{initials(DEMO_USER.name)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block max-w-[160px] truncate text-[13px] font-medium">
                  {DEMO_USER.name}
                </span>
                <span className="block text-[10.5px] text-muted-foreground">
                  {ROLE_LABELS[DEMO_USER.role]}
                </span>
              </span>
              <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <span className="block truncate text-[12.5px] font-medium text-foreground">
                {DEMO_USER.name}
              </span>
              <span className="block truncate text-[11px] font-normal">{DEMO_USER.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('/settings')}>
              <UserRound />
              Профиль
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate('/settings')}>
              <Settings />
              Настройки
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:bg-red-50 focus:text-destructive"
              onSelect={() => navigate('/login')}
            >
              <LogOut />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
