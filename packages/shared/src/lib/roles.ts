export const ROLES = ['ADMIN', 'MANAGER', 'EMPLOYEE'] as const
export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Администратор',
  MANAGER: 'Менеджер',
  EMPLOYEE: 'Сотрудник',
}

export const ROLE_HINTS: Record<Role, string> = {
  ADMIN: 'Полный доступ: настройки компании, сотрудники, журнал действий',
  MANAGER: 'Клиенты, сделки и задачи всей команды',
  EMPLOYEE: 'Только свои клиенты, сделки и задачи',
}

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}
