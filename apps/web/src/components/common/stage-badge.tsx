import type { DemoStage } from '@/demo/types'
import { cn } from '@/lib/utils'

export function StageBadge({ stage, className }: { stage: DemoStage; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-secondary-foreground',
        className,
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: stage.color }} />
      {stage.name}
    </span>
  )
}
