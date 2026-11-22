import type { Role } from '@crm/shared'

/**
 * Заглушка сессии до этапа 1 (аутентификация).
 * После подключения API эти данные придут из GET /auth/me.
 */
export const DEMO_COMPANY = {
  name: 'Демо-компания',
  plan: 'Trial',
}

export const DEMO_USER: { name: string; email: string; role: Role } = {
  name: 'Демо-администратор',
  email: 'admin@demo.ru',
  role: 'ADMIN',
}
