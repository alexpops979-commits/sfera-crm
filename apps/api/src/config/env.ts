import { z } from 'zod'

const boolString = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true')

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL обязателен')
    .refine((value) => value.startsWith('postgres'), 'DATABASE_URL должен начинаться с postgresql://'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET должен быть не короче 32 символов'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET должен быть не короче 32 символов'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
  WEB_ORIGIN: z.string().url().default('http://localhost:5173'),
  COOKIE_SECURE: boolString,
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config)

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  • ${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join('\n')
    throw new Error(`Некорректные переменные окружения (.env):\n${details}`)
  }

  return result.data
}
