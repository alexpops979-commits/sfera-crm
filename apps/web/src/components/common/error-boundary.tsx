import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Ошибка интерфейса:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-svh items-center justify-center bg-background p-6">
          <Card className="w-full max-w-md p-6 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              !
            </div>
            <h1 className="mt-4 text-[17px] font-semibold">Что-то пошло не так</h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              Интерфейс столкнулся с ошибкой. Обновите страницу — демо-данные восстановятся.
            </p>
            {this.state.error.message && (
              <p className="mt-3 overflow-hidden rounded-lg bg-secondary px-3 py-2 text-left text-[11px] break-words text-muted-foreground">
                {this.state.error.message}
              </p>
            )}
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Обновить страницу
            </Button>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
