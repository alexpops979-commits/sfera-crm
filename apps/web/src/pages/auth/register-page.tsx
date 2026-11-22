import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from './auth-layout'

export function RegisterPage() {
  const [company, setCompany] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.info('Регистрация компании подключится на следующем этапе')
  }

  return (
    <AuthLayout
      title="Создать компанию"
      description="Бесплатный доступ на время настройки. Карта не нужна"
      footer={
        <>
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Войти
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="company">Название компании</Label>
          <Input
            id="company"
            placeholder="Стоматология «Улыбка»"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name">Ваше имя</Label>
          <Input
            id="name"
            placeholder="Иван Петров"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

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
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            placeholder="Минимум 8 символов"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Создать компанию
        </Button>

        <p className="text-center text-[11.5px] leading-relaxed text-muted-foreground">
          Регистрация подключится на следующем этапе. Затем приложение создаст компанию,
          администратора и стартовую воронку.
        </p>
      </form>
    </AuthLayout>
  )
}
