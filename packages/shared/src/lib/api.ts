export interface PageMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface Paginated<T> {
  data: T[]
  meta: PageMeta
}

export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const

export type SortDirection = 'asc' | 'desc'

export interface ListParams {
  page?: number
  pageSize?: number
  search?: string
  sort?: string
}

/** Сериализует объект в query string, пропуская пустые значения. */
export function toSearchParams(input: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null || value === '') continue
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null && item !== '') params.append(key, String(item))
      }
      continue
    }
    params.set(key, String(value))
  }

  return params
}

export const API_PREFIX = '/api/v1'
