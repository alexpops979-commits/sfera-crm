import { Info } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useDemo } from '@/demo/store'
import { cn } from '@/lib/utils'

export function ExampleNotice({ className }: { className?: string }) {
  const { resetExample } = useDemo()
  const [confirming, setConfirming] = useState(false)

  function handleReset() {
    if (!confirming) {
      setConfirming(true)
      return
    }

    resetExample()
    setConfirming(false)
    toast.success('Пример восстановлен в исходном виде')
  }

  return (
    <div
      className={cn(
        'mb-4 flex flex-col gap-2.5 rounded-xl border border-primary/15 bg-accent/60 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-slate-600 sm:flex-row sm:items-center',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          <span className="font-medium text-foreground">Это пример данных.</span> Клиентов, сделки
          и задачи можно менять — создавать, редактировать и удалять. Изменения сохраняются в этом
          браузере.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 pl-6 sm:ml-auto sm:pl-0">
        <Button variant={confirming ? 'destructive' : 'outline'} size="sm" onClick={handleReset}>
          {confirming ? 'Точно сбросить?' : 'Сбросить пример'}
        </Button>
        {confirming && (
          <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
            Отмена
          </Button>
        )}
      </div>
    </div>
  )
}
