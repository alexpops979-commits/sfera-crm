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
  const stage = stages.find((item) => item.id === stageId)

  return deals.map((deal) => {
    if (deal.id !== dealId || deal.stageId === stageId) return deal

    const closed = Boolean(stage?.isWon || stage?.isLost)

    return {
      ...deal,
      stageId,
      closedAt: closed ? new Date().toISOString() : undefined,
      lostReason: stage?.isLost ? (deal.lostReason ?? 'Не указана') : undefined,
    }
  })
}

export function toggleTaskStatus(tasks: DemoTask[], taskId: string): DemoTask[] {
  return tasks.map((task) =>
    task.id === taskId
      ? { ...task, status: task.status === 'OPEN' ? 'DONE' : 'OPEN' }
      : task,
  )
}

export function changeClientStatus(
  clients: DemoClient[],
  clientId: string,
  status: ClientStatus,
): DemoClient[] {
  return clients.map((client) => (client.id === clientId ? { ...client, status } : client))
}
