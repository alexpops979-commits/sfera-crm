import type { DemoDeal, DemoStage, DemoUser } from './types'

const DAY = 86_400_000

export interface RevenuePoint {
  label: string
  actual: number
  plan: number
}

export interface StageStat {
  stage: DemoStage
  count: number
  amount: number
}

export interface RepStat {
  user: DemoUser
  wonCount: number
  revenue: number
  winRate: number
}

export interface DashboardMetrics {
  revenue: number
  revenueTrend: number | null
  wonCount: number
  wonTrend: number | null
  winRate: number
  winRateTrend: number | null
  pipelineValue: number
  pipelineCount: number
  revenueSeries: RevenuePoint[]
  stageStats: StageStat[]
  topReps: RepStat[]
}

const PLAN_BY_WEEK = [120000, 140000, 110000, 160000, 150000, 170000, 160000, 180000]
const shortDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })

function sumAmount(deals: DemoDeal[]): number {
  return deals.reduce((total, deal) => total + deal.amount, 0)
}

function percentChange(current: number, previous: number): number | null {
  if (previous <= 0) return null
  return ((current - previous) / previous) * 100
}

function weekStart(offsetWeeks: number): Date {
  const date = new Date(Date.now() - offsetWeeks * 7 * DAY)
  date.setHours(0, 0, 0, 0)
  const mondayOffset = (date.getDay() + 6) % 7
  date.setDate(date.getDate() - mondayOffset)
  return date
}

export function computeDashboard(
  deals: DemoDeal[],
  stages: DemoStage[],
  users: DemoUser[],
  periodDays = 30,
): DashboardMetrics {
  const now = Date.now()
  const wonIds = new Set(stages.filter((stage) => stage.isWon).map((stage) => stage.id))
  const lostIds = new Set(stages.filter((stage) => stage.isLost).map((stage) => stage.id))

  const isWon = (deal: DemoDeal) => wonIds.has(deal.stageId)
  const isLost = (deal: DemoDeal) => lostIds.has(deal.stageId)

  const closedInPeriod = (deal: DemoDeal, fromDays: number, toDays: number): boolean => {
    if (!deal.closedAt) return false
    const time = new Date(deal.closedAt).getTime()
    return time > now - toDays * DAY && time <= now - fromDays * DAY
  }

  const wonDeals = deals.filter((deal) => isWon(deal) && deal.closedAt)
  const revenueDeals = wonDeals.filter((deal) => closedInPeriod(deal, 0, periodDays))
  const previousRevenueDeals = wonDeals.filter((deal) =>
    closedInPeriod(deal, periodDays, periodDays * 2),
  )

  const revenue = sumAmount(revenueDeals)
  const previousRevenue = sumAmount(previousRevenueDeals)

  const lostDeals = deals.filter((deal) => isLost(deal) && deal.closedAt)
  const winRate = wonDeals.length + lostDeals.length > 0
    ? (wonDeals.length / (wonDeals.length + lostDeals.length)) * 100
    : 0

  const currentWon = revenueDeals.length
  const currentLost = lostDeals.filter((deal) => closedInPeriod(deal, 0, periodDays)).length
  const previousWon = previousRevenueDeals.length
  const previousLost = lostDeals.filter((deal) =>
    closedInPeriod(deal, periodDays, periodDays * 2),
  ).length

  const currentRate = currentWon + currentLost > 0 ? (currentWon / (currentWon + currentLost)) * 100 : 0
  const previousRate =
    previousWon + previousLost > 0 ? (previousWon / (previousWon + previousLost)) * 100 : 0
  const periodRate = currentWon + currentLost > 0 ? currentRate : null

  const activeDeals = deals.filter((deal) => !isWon(deal) && !isLost(deal))
  const pipelineValue = sumAmount(activeDeals)

  const revenueSeries: RevenuePoint[] = PLAN_BY_WEEK.map((plan, index) => {
    const start = weekStart(7 - index)
    const end = new Date(start.getTime() + 7 * DAY)
    const actual = wonDeals
      .filter((deal) => {
        const time = new Date(deal.closedAt as string).getTime()
        return time >= start.getTime() && time < end.getTime()
      })
      .reduce((total, deal) => total + deal.amount, 0)

    return { label: shortDate.format(start), actual, plan }
  })

  const stageStats: StageStat[] = stages.map((stage) => {
    const stageDeals = deals.filter((deal) => deal.stageId === stage.id)
    return { stage, count: stageDeals.length, amount: sumAmount(stageDeals) }
  })

  const topReps: RepStat[] = users
    .map((user) => {
      const userWon = wonDeals.filter((deal) => deal.ownerId === user.id)
      const userLost = lostDeals.filter((deal) => deal.ownerId === user.id)
      const userRate =
        userWon.length + userLost.length > 0
          ? (userWon.length / (userWon.length + userLost.length)) * 100
          : 0

      return {
        user,
        wonCount: userWon.length,
        revenue: sumAmount(userWon),
        winRate: userRate,
      }
    })
    .filter((rep) => rep.wonCount > 0 || rep.winRate > 0)
    .sort((a, b) => b.revenue - a.revenue)

  return {
    revenue,
    revenueTrend: percentChange(revenue, previousRevenue),
    wonCount: currentWon,
    wonTrend: percentChange(currentWon, previousWon),
    winRate: periodRate ?? winRate,
    winRateTrend: periodRate !== null && previousWon + previousLost > 0 ? periodRate - previousRate : null,
    pipelineValue,
    pipelineCount: activeDeals.length,
    revenueSeries,
    stageStats,
    topReps,
  }
}

export interface ClientMetrics {
  dealsCount: number
  dealsAmount: number
  openDeals: number
  lastActivityAt: string | null
}

export function computeClientMetrics(
  clientId: string,
  deals: DemoDeal[],
  activities: { clientId: string; occurredAt: string }[],
  stages: DemoStage[],
): ClientMetrics {
  const lostIds = new Set(stages.filter((stage) => stage.isLost).map((stage) => stage.id))
  const wonIds = new Set(stages.filter((stage) => stage.isWon).map((stage) => stage.id))
  const clientDeals = deals.filter((deal) => deal.clientId === clientId)
  const openDeals = clientDeals.filter(
    (deal) => !wonIds.has(deal.stageId) && !lostIds.has(deal.stageId),
  )
  const lastActivity = activities
    .filter((activity) => activity.clientId === clientId)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())[0]

  return {
    dealsCount: clientDeals.length,
    dealsAmount: sumAmount(clientDeals),
    openDeals: openDeals.length,
    lastActivityAt: lastActivity?.occurredAt ?? null,
  }
}
