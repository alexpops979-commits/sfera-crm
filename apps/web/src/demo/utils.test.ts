import { describe, expect, it } from 'vitest'
import type { DemoTask } from './types'
import { calendarDaysDiff, dueLabel, taskBucket } from './utils'

const DAY = 86_400_000

function at(offsetDays: number): string {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  return new Date(date.getTime() + offsetDays * DAY).toISOString()
}

function task(overrides: Partial<DemoTask> = {}): DemoTask {
  return {
    id: 'task',
    title: 'Тестовая задача',
    dueAt: at(0),
    priority: 'NORMAL',
    status: 'OPEN',
    assigneeId: 'u1',
    ...overrides,
  }
}

describe('calendarDaysDiff', () => {
  it('считает разницу по календарным дням', () => {
    expect(calendarDaysDiff(at(0))).toBe(0)
    expect(calendarDaysDiff(at(1))).toBe(1)
    expect(calendarDaysDiff(at(-2))).toBe(-2)
  })
})

describe('taskBucket', () => {
  it('распределяет задачи по группам', () => {
    expect(taskBucket(task({ dueAt: at(-1) }))).toBe('overdue')
    expect(taskBucket(task({ dueAt: at(0) }))).toBe('today')
    expect(taskBucket(task({ dueAt: at(3) }))).toBe('week')
    expect(taskBucket(task({ dueAt: at(10) }))).toBe('later')
    expect(taskBucket(task({ status: 'DONE', dueAt: at(-5) }))).toBe('done')
  })
})

describe('dueLabel', () => {
  it('подписывает ближайшие сроки', () => {
    expect(dueLabel(at(0))).toBe('сегодня')
    expect(dueLabel(at(1))).toBe('завтра')
    expect(dueLabel(at(-1))).toBe('просрочено на 1 день')
    expect(dueLabel(at(-3))).toBe('просрочено на 3 дня')
  })

  it('для дальних дат возвращает дату, а не пустую строку', () => {
    expect(dueLabel(at(20)).length).toBeGreaterThan(0)
  })
})
