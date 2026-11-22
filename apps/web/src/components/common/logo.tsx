import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  subtitle?: string
  tone?: 'default' | 'light'
}

export function Logo({
  className,
  showText = true,
  subtitle = 'CRM для бизнеса',
  tone = 'default',
}: LogoProps) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div
        className={cn(
          'relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#5B8CFF] to-[#1E4FD8] shadow-sm shadow-primary/30',
          className,
        )}
      >
        <span className="size-3.5 rounded-full border-2 border-white" />
      </div>
      {showText && (
        <div className="min-w-0 leading-tight">
          <div
            className={cn(
              'truncate text-[15px] font-semibold tracking-[-0.01em]',
              tone === 'light' && 'text-white',
            )}
          >
            Сфера
          </div>
          <div
            className={cn(
              'truncate text-[10px] font-medium tracking-[0.08em] uppercase',
              tone === 'light' ? 'text-white/55' : 'text-muted-foreground',
            )}
          >
            {subtitle}
          </div>
        </div>
      )}
    </div>
  )
}
