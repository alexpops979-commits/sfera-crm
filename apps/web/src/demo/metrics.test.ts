import { describe, expect, it } from 'vitest'
import { demoActivities, demoDeals, demoStages, demoUsers } from './data'
import { computeClientMetrics, computeDashboard } from './metrics'

describe('computeDashboard', () => {
  const metrics = computeDashboard(demoDeals, demoStages, demoUsers)

  it('считает выручку и количество выигранных сделок за период', () => {
    expect(metrics.revenue).toBe(1_025_000)
    expect(metrics.wonCount).toBe(6)
  })

  it('считает тренды к прошлому периоду', () => {
    expect(metrics.revenueTrend).toBe(25)
    expect(metrics.wonTrend).toBe(50)
  })

  it('считает win rate по закрытым сделкам периода', () => {
    expect(metrics.winRate).toBe(60)
    expect(metrics.winRateTrend).toBe(-20)
  })

  it('считает активную воронку без закрытых сделок', () => {
    expect(metrics.pipelineValue).toBe(4_890_000)
    expect(metrics.pipelineCount).toBe(15)
  })

  it('строит корректное распределение по этапам', () => {
    expect(metrics.stageStats).toHaveLength(6)

    const wonStage = metrics.stageStats.find((item) => item.stage.isWon)
    const lostStage = metrics.stageStats.find((item) => item.stage.isLost)
    const newStage = metrics.stageStats.find((item) => item.stage.id === 's1')

    expect(wonStage).toMatchObject({ count: 10, amount: 1_845_000 })
    expect(lostStage).toMatchObject({ count: 5, amount: 800_000 })
    expect(newStage).toMatchObject({ count: 5, amount: 1_440_000 })
  })

  it('строит 8 недельных точек с планом', () => {
    expect(metrics.revenueSeries).toHaveLength(8)
    expect(metrics.revenueSeries.every((point) => point.label.length > 0)).toBe(true)
    expect(metrics.revenueSeries.every((point) => point.plan > 0)).toBe(true)
    expect(metrics.revenueSeries.reduce((total, point) => total + point.actual, 0)).toBeGreaterThan(0)
  })

  it('сортирует менеджеров по выручке', () => {
    expect(metrics.topReps).toHaveLength(3)
    expect(metrics.topReps[0]).toMatchObject({
      user: expect.objectContaining({ id: 'u2' }),
      wonCount: 5,
      revenue: 1_090_000,
    })
    expect(metrics.topReps[1]?.user.id).toBe('u3')
  })
})

describe('computeClientMetrics', () => {
  it('считает сделки клиента и открытые сделки', () => {
    const metrics = computeClientMetrics('c1', demoDeals, demoActivities, demoStages)

    expect(metrics.dealsCount).toBe(3)
    expect(metrics.dealsAmount).toBe(710_000)
    expect(metrics.openDeals).toBe(1)
    expect(metrics.lastActivityAt).not.toBeNull()
  })

  it('возвращает нули для клиента без сделок', () => {
    const metrics = computeClientMetrics('c2', [], demoActivities, demoStages)

    expect(metrics.dealsCount).toBe(0)
    expect(metrics.dealsAmount).toBe(0)
    expect(metrics.openDeals).toBe(0)
  })
})
