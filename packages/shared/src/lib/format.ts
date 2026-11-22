export type Currency = 'RUB' | 'USD' | 'EUR'

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
}

const compactNumber = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 })

export function formatMoney(
  value: number | string | null | undefined,
  currency: Currency = 'RUB',
): string {
  const amount = toNumber(value)
  if (amount === null) return '—'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Компактная запись для KPI: 142 500 → 142,5 тыс. ₽ */
export function formatMoneyCompact(
  value: number | string | null | undefined,
  currency: Currency = 'RUB',
): string {
  const amount = toNumber(value)
  if (amount === null) return '—'
  const sign = amount < 0 ? '−' : ''
  const abs = Math.abs(amount)
  const symbol = CURRENCY_SYMBOLS[currency]

  if (abs < 10_000) return `${sign}${compactNumber.format(abs)} ${symbol}`
  if (abs < 1_000_000) return `${sign}${compactNumber.format(abs / 1_000)} тыс. ${symbol}`
  return `${sign}${compactNumber.format(abs / 1_000_000)} млн ${symbol}`
}

export function formatNumber(value: number | string | null | undefined): string {
  const amount = toNumber(value)
  if (amount === null) return '—'
  return new Intl.NumberFormat('ru-RU').format(amount)
}

export function formatPercent(value: number | string | null | undefined, fractionDigits = 0): string {
  const amount = toNumber(value)
  if (amount === null) return '—'
  return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: fractionDigits }).format(amount)}%`
}

export function formatDate(value: Date | string | null | undefined): string {
  const date = toDate(value)
  if (!date) return '—'
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatDateLong(value: Date | string | null | undefined): string {
  const date = toDate(value)
  if (!date) return '—'
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(value: Date | string | null | undefined): string {
  const date = toDate(value)
  if (!date) return '—'
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/** Значение для <input type="date"> */
export function toDateInputValue(value: Date | string | null | undefined): string {
  const date = toDate(value)
  if (!date) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** Русское склонение: 1 клиент, 2 клиента, 5 клиентов */
export function plural(count: number, one: string, few: string, many: string): string {
  const abs = Math.abs(count) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return many
  if (last === 1) return one
  if (last >= 2 && last <= 4) return few
  return many
}

export function initials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part.charAt(0).toUpperCase()).join('') || '?'
}

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const parsed = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(parsed) ? parsed : null
}

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}
