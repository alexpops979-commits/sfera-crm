export interface StageTemplate {
  name: string
  color: string
  probability: number
  isWon: boolean
  isLost: boolean
}

export const DEFAULT_PIPELINE_NAME = 'Продажи'

/**
 * Стартовая воронка. Этапы редактируются администратором компании,
 * поэтому в коде нет жёсткой привязки к их названиям — только флаги.
 */
export const DEFAULT_STAGES: StageTemplate[] = [
  { name: 'Новые', color: '#2F6BF6', probability: 10, isWon: false, isLost: false },
  { name: 'Контакт', color: '#8B5CF6', probability: 30, isWon: false, isLost: false },
  { name: 'Предложение', color: '#F59E0B', probability: 50, isWon: false, isLost: false },
  { name: 'Переговоры', color: '#F97316', probability: 70, isWon: false, isLost: false },
  { name: 'Успешно', color: '#16A34A', probability: 100, isWon: true, isLost: false },
  { name: 'Проиграно', color: '#EF4444', probability: 0, isWon: false, isLost: true },
]
