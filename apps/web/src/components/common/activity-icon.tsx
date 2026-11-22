import { Mail, Phone, StickyNote, Users } from 'lucide-react'
import type { ActivityType } from '@/demo/types'
import { cn } from '@/lib/utils'

const ICONS = {
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Users,
  NOTE: StickyNote,
} as const

const COLORS = {
  CALL: 'bg-sky-50 text-sky-600',
  EMAIL: 'bg-violet-50 text-violet-600',
  MEETING: 'bg-emerald-50 text-emerald-600',
  NOTE: 'bg-amber-50 text-amber-600',
} as const

export function ActivityIcon({
  type,
  className,
}: {
  type: ActivityType
  className?: string
}) {
  const Icon = ICONS[type]

  return (
    <span
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-lg',
        COLORS[type],
        className,
      )}
    >
      <Icon className="size-3.5" />
    </span>
  )
}
