import type { ClientStatus, DemoClient, DemoDeal, DemoStage, DemoTask } from './types'

/**
 * Перемещение сделки между этапами.
 * Закрытые этапы проставляют дату закрытия, возврат в работу её снимает.
 */
export function moveDealToStage(
  deals: DemoDeal[],
  stages: DemoStage[],
  dealId: string,
  stageId: string,
): DemoDeal[] {
  return deals.map((deal) =>
    deal.id === dealId && deal.stageId !== stageId
      ? withStage(deal, stageId, stages)
      : deal,
  )
}

export function toggleTaskStatus(tasks: DemoTask[], taskId: string): DemoTask[] {
  return tasks.map((task) =>
    task.id === taskId
      ? { ...task, status: task.status === 'OPEN' ? 'DONE' : 'OPEN' }
      : task,
  )
}

/**
 * Приводит сделку к выбранному этапу: закрытые этапы проставляют дату
 * закрытия, возврат в работу её снимает, проигрыш получает причину.
 */
export function withStage(
  deal: DemoDeal,
  stageId: string,
  stages: DemoStage[],
): DemoDeal {
  const stage = stages.find((item) => item.id === stageId)
  const closed = Boolean(stage?.isWon || stage?.isLost)

  return {
    ...deal,
    stageId,
    closedAt: closed ? (deal.closedAt ?? new Date().toISOString()) : undefined,
    lostReason: stage?.isLost ? (deal.lostReason || 'Не указана') : undefined,
  }
}

export function changeClientStatus(
  clients: DemoClient[],
  clientId: string,
  status: ClientStatus,
): DemoClient[] {
  return clients.map((client) => (client.id === clientId ? { ...client, status } : client))
}
