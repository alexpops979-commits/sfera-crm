import { Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  points?: string[]
}

export function EmptyState({ icon: Icon, title, description, points }: EmptyStateProps) {
  return (
    <Card className="border-dashed bg-card/60 shadow-none">
      <CardContent className="flex flex-col items-center px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary ring-1 ring-primary/10">
          <Icon className="size-6" strokeWidth={1.8} />
        </div>
        <h2 className="mt-4 text-base font-semibold tracking-[-0.01em]">{title}</h2>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{description}</p>

        {points && points.length > 0 && (
          <ul className="mt-6 grid w-full max-w-md gap-2 text-left">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 rounded-lg border bg-card/80 px-3 py-2 text-[13px] text-muted-foreground"
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
