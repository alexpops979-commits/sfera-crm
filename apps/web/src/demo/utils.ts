import { plural } from '@crm/shared'
import type { DemoTask } from './types'

const DAY = 86_400_000

export function startOfDay(value: Date | string): Date {
  const date = value instanceof Date ? new Date(value) : new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export function calendarDaysDiff(iso: string): number {
  const today = startOfDay(new Date()).getTime()
  const target = startOfDay(iso).getTime()
  return Math.round((target - today) / DAY)
}

export type TaskBucket = 'overdue' | 'today' | 'week' | 'later' | 'done'

export function taskBucket(task: DemoTask): TaskBucket {
  if (task.status === 'DONE') return 'done'
  const diff = calendarDaysDiff(task.dueAt)
  if (diff < 0) return 'overdue'
  if (diff === 0) return 'today'
  if (diff <= 7) return 'week'
  return 'later'
}

const weekday = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' })
const dayMonth = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })

export function dueLabel(iso: string): string {
  const diff = calendarDaysDiff(iso)

  if (diff < 0) {
    const days = Math.abs(diff)
    return `просрочено на ${days} ${plural(days, 'день', 'дня', 'дней')}`
  }
  if (diff === 0) return 'сегодня'
  if (diff === 1) return 'завтра'
  if (diff <= 7) return weekday.format(new Date(iso))
  return dayMonth.format(new Date(iso))
}

export const TASK_BUCKET_LABELS: Record<TaskBucket, string> = {
  overdue: 'Просроченные',
  today: 'Сегодня',
  week: 'На этой неделе',
  later: 'Позже',
  done: 'Выполненные',
}
