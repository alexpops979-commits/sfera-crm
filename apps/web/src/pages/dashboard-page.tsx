import { BriefcaseBusiness, Info, Target, TrendingUp, Wallet } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const kpis = [
  { label: 'Выручка', hint: 'Сумма выигранных сделок за период', icon: Wallet },
  { label: 'Выигранные сделки', hint: 'Количество успешных сделок', icon: Target },
  { label: 'Средний win rate', hint: 'Доля успешных сделок', icon: TrendingUp },
  { label: 'Активная воронка', hint: 'Сумма сделок в работе', icon: BriefcaseBusiness },
]

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Дашборд"
        description="Показатели бизнеса: выручка, сделки и эффективность команды"
        actions={<Badge variant="muted">Демо-данные появятся на этапе 5</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, hint, icon: Icon }) => (
          <Card key={label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-slate-500">
                  <Icon className="size-3.5" strokeWidth={1.9} />
                </span>
                {label}
              </div>
              <Info className="mt-0.5 size-3.5 text-muted-foreground/40" />
            </div>
            <div className="mt-3.5 text-[28px] leading-none font-semibold tracking-[-0.03em] text-slate-300">
              —
            </div>
            <p className="mt-2.5 text-[11.5px] text-muted-foreground">{hint}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>Динамика выручки</CardTitle>
              <CardDescription>Факт и план по неделям</CardDescription>
            </div>
            <Badge variant="outline">Месяц</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex h-[248px] flex-col items-center justify-center rounded-xl border border-dashed bg-secondary/30">
              <div className="flex items-end gap-2">
                {[28, 44, 36, 56, 48, 64, 52].map((height, index) => (
                  <div
                    key={index}
                    className="w-5 rounded-t-sm bg-secondary"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
              <p className="mt-4 text-[12.5px] text-muted-foreground">
                График построится, когда появятся сделки
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Сделки по этапам</CardTitle>
            <CardDescription>Распределение активной воронки</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {['Новые', 'Контакт', 'Предложение', 'Переговоры', 'Успешно'].map((stage, index) => (
              <div key={stage} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-[12px] text-muted-foreground">{stage}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary/25"
                    style={{ width: `${88 - index * 14}%` }}
                  />
                </div>
                <span className="w-6 text-right text-[12px] tabular-nums text-slate-300">—</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader className="flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>Лучшие менеджеры</CardTitle>
            <CardDescription>Рейтинг по закрытым сделкам и выручке</CardDescription>
          </div>
          <Badge variant="outline">За месяц</Badge>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-3 w-36" />
                <Skeleton className="ml-auto h-3 w-16" />
                <Skeleton className="hidden h-3 w-20 sm:block" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
