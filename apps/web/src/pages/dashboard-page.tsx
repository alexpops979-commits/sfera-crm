import { formatMoney, formatMoneyCompact, formatPercent } from '@crm/shared'
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Target,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ExampleNotice } from '@/components/common/example-notice'
import { PageHeader } from '@/components/common/page-header'
import { UserChip } from '@/components/common/user-chip'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { computeDashboard } from '@/demo/metrics'
import { useDemo } from '@/demo/store'
import { cn } from '@/lib/utils'

interface KpiProps {
  icon: LucideIcon
  label: string
  value: string
  hint: string
  trend: number | null
}

function Kpi({ icon: Icon, label, value, hint, trend }: KpiProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground">
        <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-slate-500">
          <Icon className="size-3.5" strokeWidth={1.9} />
        </span>
        {label}
      </div>
      <div className="mt-3.5 text-[28px] leading-none font-semibold tracking-[-0.03em]">
        {value}
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 text-[11.5px]">
        {trend !== null && (
          <span
            className={cn(
              'flex items-center gap-0.5 font-medium',
              trend >= 0 ? 'text-emerald-700' : 'text-red-600',
            )}
          >
            {trend >= 0 ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {formatPercent(Math.abs(trend), 1)}
          </span>
        )}
        <span className="text-muted-foreground">{hint}</span>
      </div>
    </Card>
  )
}

export function DashboardPage() {
  const { deals, stages, users } = useDemo()
  const metrics = useMemo(() => computeDashboard(deals, stages, users), [deals, stages, users])

  return (
    <>
      <PageHeader
        title="Дашборд"
        description="Показатели бизнеса: выручка, сделки и эффективность команды"
        actions={<Badge variant="outline">Последние 30 дней</Badge>}
      />

      <ExampleNotice />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={Wallet}
          label="Выручка"
          value={formatMoneyCompact(metrics.revenue)}
          hint="к прошлому периоду"
          trend={metrics.revenueTrend}
        />
        <Kpi
          icon={Target}
          label="Выигранные сделки"
          value={String(metrics.wonCount)}
          hint="к прошлому периоду"
          trend={metrics.wonTrend}
        />
        <Kpi
          icon={TrendingUp}
          label="Средний win rate"
          value={formatPercent(metrics.winRate)}
          hint="к прошлому периоду"
          trend={metrics.winRateTrend}
        />
        <Kpi
          icon={BriefcaseBusiness}
          label="Активная воронка"
          value={formatMoneyCompact(metrics.pipelineValue)}
          hint={`${metrics.pipelineCount} сделок в работе`}
          trend={null}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>Динамика выручки</CardTitle>
              <CardDescription>Факт и план по неделям, тыс. ₽</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" /> Факт
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary/30" /> План
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2F6BF6" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#2F6BF6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#EEF2F8" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    dy={6}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={52}
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    tickFormatter={(value: number) => `${Math.round(value / 1000)}`}
                  />
                  <Tooltip
                    formatter={(value) => formatMoney(Number(value))}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #E5EAF3',
                      fontSize: 12,
                      boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="plan"
                    stroke="#B9CDFF"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="transparent"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#2F6BF6"
                    strokeWidth={2.5}
                    fill="url(#revenueActual)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Сделки по этапам</CardTitle>
            <CardDescription>Количество и сумма по воронке</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {metrics.stageStats.map(({ stage, count, amount }) => (
              <div key={stage.id}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">{stage.name}</span>
                  <span className="font-medium tabular-nums">{count}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(4, (count / Math.max(...metrics.stageStats.map((item) => item.count), 1)) * 100)}%`,
                      backgroundColor: stage.color,
                    }}
                  />
                </div>
                <div className="mt-1 text-[10.5px] text-muted-foreground">
                  {formatMoneyCompact(amount)}
                </div>
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
          <Badge variant="outline">За всё время</Badge>
        </CardHeader>
        <CardContent>
          <div className="mb-1 flex items-center gap-3 border-b pb-2 text-[10.5px] tracking-[0.06em] text-muted-foreground uppercase">
            <span className="w-4">#</span>
            <span className="flex-1">Сотрудник</span>
            <span>Сделки</span>
            <span className="w-28 text-right">Выручка</span>
            <span className="hidden w-16 text-right sm:block">Win rate</span>
          </div>
          <div className="divide-y">
            {metrics.topReps.map((rep, index) => (
              <div key={rep.user.id} className="flex items-center gap-3 py-3 last:pb-0">
                <span className="w-4 text-[12px] tabular-nums text-muted-foreground">
                  {index + 1}
                </span>
                <UserChip user={rep.user} className="flex-1" />
                <span className="text-[12px] text-muted-foreground">{rep.wonCount}</span>
                <span className="w-28 text-right text-[13px] font-semibold">
                  {formatMoney(rep.revenue)}
                </span>
                <span className="hidden w-16 text-right text-[12px] sm:block">
                  {formatPercent(rep.winRate)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
