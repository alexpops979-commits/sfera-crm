import { describe, expect, it } from 'vitest'
import { demoClients, demoDeals, demoStages, demoTasks } from './data'
import { changeClientStatus, moveDealToStage, toggleTaskStatus } from './transitions'

describe('moveDealToStage', () => {
  it('закрывает сделку при переносе в успешный этап', () => {
    const result = moveDealToStage(demoDeals, demoStages, 'd16', 's5')
    const deal = result.find((item) => item.id === 'd16')

    expect(deal?.stageId).toBe('s5')
    expect(deal?.closedAt).toBeTruthy()
    expect(deal?.lostReason).toBeUndefined()
  })

  it('снимает дату закрытия при возврате в работу', () => {
    const result = moveDealToStage(demoDeals, demoStages, 'd1', 's1')
    const deal = result.find((item) => item.id === 'd1')

    expect(deal?.stageId).toBe('s1')
    expect(deal?.closedAt).toBeUndefined()
  })

  it('проставляет причину при переносе в «Проиграно»', () => {
    const result = moveDealToStage(demoDeals, demoStages, 'd16', 's6')
    const deal = result.find((item) => item.id === 'd16')

    expect(deal?.stageId).toBe('s6')
    expect(deal?.lostReason).toBe('Не указана')
    expect(deal?.closedAt).toBeTruthy()
  })

  it('очищает причину проигрыша при возврате в работу', () => {
    const result = moveDealToStage(demoDeals, demoStages, 'd11', 's2')
    const deal = result.find((item) => item.id === 'd11')

    expect(deal?.lostReason).toBeUndefined()
    expect(deal?.closedAt).toBeUndefined()
  })

  it('не меняет сделку, если этап тот же', () => {
    const result = moveDealToStage(demoDeals, demoStages, 'd16', 's1')
    expect(result.find((item) => item.id === 'd16')).toBe(
      demoDeals.find((item) => item.id === 'd16'),
    )
  })

  it('не трогает остальные сделки', () => {
    const result = moveDealToStage(demoDeals, demoStages, 'd16', 's5')
    expect(result.filter((item) => item.id !== 'd16')).toEqual(
      demoDeals.filter((item) => item.id !== 'd16'),
    )
  })
})

describe('toggleTaskStatus', () => {
  it('переключает задачу между открытой и выполненной', () => {
    const done = toggleTaskStatus(demoTasks, 't1')
    expect(done.find((task) => task.id === 't1')?.status).toBe('DONE')

    const reopened = toggleTaskStatus(done, 't1')
    expect(reopened.find((task) => task.id === 't1')?.status).toBe('OPEN')
  })
})

describe('changeClientStatus', () => {
  it('меняет статус только указанному клиенту', () => {
    const result = changeClientStatus(demoClients, 'c2', 'CUSTOMER')
    expect(result.find((client) => client.id === 'c2')?.status).toBe('CUSTOMER')
    expect(result.find((client) => client.id === 'c1')?.status).toBe('CUSTOMER')
    expect(result.find((client) => client.id === 'c8')?.status).toBe('ARCHIVE')
  })
})
