import { Link } from 'react-router-dom'
import { Logo } from '@/components/common/logo'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <Logo />
      <div>
        <p className="text-[72px] leading-none font-semibold tracking-[-0.04em] text-primary/20">
          404
        </p>
        <h1 className="mt-2 text-xl font-semibold">Страница не найдена</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Возможно, ссылка устарела или раздел ещё не создан.
        </p>
      </div>
      <Button asChild>
        <Link to="/dashboard">Вернуться на дашборд</Link>
      </Button>
    </div>
  )
}
