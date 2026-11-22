import { CLIENT_STATUS_CLASSES, CLIENT_STATUS_LABELS } from '@/demo/labels'
import type { ClientStatus } from '@/demo/types'
import { cn } from '@/lib/utils'

export function ClientStatusBadge({
  status,
  className,
}: {
  status: ClientStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium whitespace-nowrap',
        CLIENT_STATUS_CLASSES[status],
        className,
      )}
    >
      {CLIENT_STATUS_LABELS[status]}
    </span>
  )
}
