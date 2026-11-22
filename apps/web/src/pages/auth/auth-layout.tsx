import { Check, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { Logo } from '@/components/common/logo'
import { Badge } from '@/components/ui/badge'

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <Logo />

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[360px]">
            <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.025em]">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
            <div className="mt-7">{children}</div>
            {footer && (
              <div className="mt-6 text-center text-[13px] text-muted-foreground">{footer}</div>
            )}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">© 2026 Сфера CRM</p>
      </div>

      <BrandPanel />
    </div>
  )
}

function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-[#071022] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -top-40 -left-32 size-[480px] rounded-full bg-primary/35 blur-[130px]" />
      <div className="absolute -right-40 -bottom-24 size-[420px] rounded-full bg-violet-500/25 blur-[130px]" />

      <div className="relative">
        <Logo tone="light" subtitle="Sales CRM Platform" />
      </div>

      <div className="relative max-w-[440px]">
        <h2 className="text-[32px] leading-[1.15] font-semibold tracking-[-0.03em]">
          CRM, в которой сделки не теряются
        </h2>
        <p className="mt-3 text-[13.5px] leading-relaxed text-white/60">
          Клиенты, воронка, задачи и аналитика — в одном рабочем пространстве для небольшой
          команды.
        </p>

        <ul className="mt-7 grid gap-3">
          {[
            'Все клиенты и коммуникации в одном месте',
            'Гибкая воронка под ваш бизнес',
            'Роли и журнал действий из коробки',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[13px] text-white/80">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Check className="size-2.5" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-9 w-full max-w-[420px] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex items-center justify-between text-[11px] text-white/45">
            <span>Воронка · Продажи</span>
            <span>Сегодня</span>
          </div>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-medium">Стоматология «Улыбка»</div>
              <div className="mt-1 text-[12px] text-white/55">Имплантация · 4 зуба</div>
            </div>
            <Badge className="bg-emerald-400/15 text-emerald-300">Успешно</Badge>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div className="text-[24px] leading-none font-semibold tracking-[-0.02em]">
              145 000 ₽
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-300">
              <TrendingUp className="size-3.5" />
              +18% к плану
            </div>
          </div>
        </div>
      </div>

      <div className="relative text-[11px] text-white/35">
        Защищённое рабочее пространство · Данные компаний изолированы
      </div>
    </div>
  )
}
