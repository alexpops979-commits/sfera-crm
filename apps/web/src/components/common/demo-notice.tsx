import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DemoNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mb-4 flex items-start gap-2.5 rounded-xl border border-primary/15 bg-accent/60 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-slate-600',
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        <span className="font-medium text-foreground">Демо-данные.</span> Клиенты, сделки и задачи
        — пример для знакомства с интерфейсом. Изменения сохраняются только в этой вкладке и
        сбрасываются при перезагрузке.
      </p>
    </div>
  )
}
