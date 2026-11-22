import { initials } from '@crm/shared'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { DemoUser } from '@/demo/types'
import { cn } from '@/lib/utils'

const PALETTE = [
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
]

function colorFor(name: string): string {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % PALETTE.length
  return PALETTE[hash] ?? PALETTE[0]
}

export function UserAvatar({
  user,
  className,
}: {
  user: DemoUser
  className?: string
}) {
  return (
    <Avatar className={cn('size-7', className)} title={user.name}>
      <AvatarFallback className={cn('text-[10.5px] font-semibold', colorFor(user.name))}>
        {initials(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}

export function UserChip({
  user,
  className,
  showPosition = false,
}: {
  user: DemoUser
  className?: string
  showPosition?: boolean
}) {
  return (
    <span className={cn('flex min-w-0 items-center gap-2', className)}>
      <UserAvatar user={user} className="size-6" />
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[12.5px] font-medium text-foreground">
          {user.name}
        </span>
        {showPosition && (
          <span className="block truncate text-[10.5px] text-muted-foreground">{user.position}</span>
        )}
      </span>
    </span>
  )
}
