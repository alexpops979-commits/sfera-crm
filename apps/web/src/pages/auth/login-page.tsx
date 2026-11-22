import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from './auth-layout'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.info('Вход по email подключится на следующем этапе. Пока доступен демо-режим.')
  }

  return (
    <AuthLayout
      title="Вход в Сферу"
      description="Продолжите работу с клиентами и сделками"
      footer={
        <>
          Нет аккаунта?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Создать компанию
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Рабочий email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.ru"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Пароль</Label>
            <button
              type="button"
              className="text-[12px] text-muted-foreground transition-colors hover:text-primary"
              onClick={() => toast.info('Восстановление пароля появится вместе с аутентификацией')}
            >
              Забыли пароль?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Войти
        </Button>

        <Button
          type="button"
          size="lg"
          variant="outline"
          className="w-full"
          onClick={() => navigate('/dashboard')}
        >
          Открыть демо-режим
        </Button>

        <p className="text-center text-[11.5px] leading-relaxed text-muted-foreground">
          Аутентификация подключается на следующем этапе. Сейчас интерфейс работает в демо-режиме без
          сохранения данных.
        </p>
      </form>
    </AuthLayout>
  )
}
