import type { ActivityType, ClientStatus, TaskPriority } from './types'

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  LEAD: 'Лид',
  CONTACT: 'В работе',
  CUSTOMER: 'Клиент',
  ARCHIVE: 'Архив',
}

export const CLIENT_STATUS_CLASSES: Record<ClientStatus, string> = {
  LEAD: 'bg-sky-50 text-sky-700',
  CONTACT: 'bg-amber-50 text-amber-700',
  CUSTOMER: 'bg-emerald-50 text-emerald-700',
  ARCHIVE: 'bg-slate-100 text-slate-500',
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  CALL: 'Звонок',
  EMAIL: 'Письмо',
  MEETING: 'Встреча',
  NOTE: 'Заметка',
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Низкий',
  NORMAL: 'Обычный',
  HIGH: 'Высокий',
}

export const TASK_PRIORITY_CLASSES: Record<TaskPriority, string> = {
  LOW: 'bg-slate-100 text-slate-500',
  NORMAL: 'bg-sky-50 text-sky-700',
  HIGH: 'bg-red-50 text-red-600',
}

export const SOURCES = ['Сайт', 'Рекомендация', 'Звонок', 'Соцсети', 'Выставка'] as const
