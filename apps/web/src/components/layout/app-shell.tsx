import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Sidebar, SidebarContent } from './sidebar'
import { Topbar } from './topbar'

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-svh">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pt-5 pb-10 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetTitle className="sr-only">Навигация</SheetTitle>
          <SidebarContent
            collapsed={false}
            onNavigate={() => setMobileOpen(false)}
            showToggle={false}
          />
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  )
}
