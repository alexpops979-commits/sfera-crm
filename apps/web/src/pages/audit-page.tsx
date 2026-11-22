import { formatDateTime } from '@crm/shared'
import { History, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { UserChip } from '@/components/common/user-chip'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useDemo } from '@/demo/store'

const ENTITY_LABELS: Record<string, string> = {
  CLIENT: 'Клиент',
  DEAL: 'Сделка',
  TASK: 'Задача',
  USER: 'Сотрудник',
  EXPORT: 'Экспорт',
  AUTH: 'Вход',
}

const ENTITY_STYLES: Record<string, string> = {
  CLIENT: 'bg-sky-50 text-sky-700',
  DEAL: 'bg-violet-50 text-violet-700',
  TASK: 'bg-amber-50 text-amber-700',
  USER: 'bg-emerald-50 text-emerald-700',
  EXPORT: 'bg-slate-100 text-slate-600',
  AUTH: 'bg-slate-100 text-slate-600',
}

export function AuditPage() {
  const { audit, users } = useDemo()
  const [search, setSearch] = useState('')

  const entries = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return audit

    return audit.filter((entry) => {
      const actor = users.find((user) => user.id === entry.actorId)
      return (
        entry.action.toLowerCase().includes(query) ||
        (actor?.name.toLowerCase().includes(query) ?? false) ||
        (ENTITY_LABELS[entry.entity]?.toLowerCase().includes(query) ?? false)
      )
    })
  }, [audit, users, search])

  return (
    <>
      <PageHeader
        title="Журнал действий"
        description="Кто, когда и что изменил в компании"
        actions={<Badge variant="outline">Только для администраторов</Badge>}
      />

      <Card className="mb-4 flex items-center gap-2 p-3">
        <div className="relative w-full max-w-[360px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Сотрудник, действие, сущность"
            className="border-transparent bg-secondary/60 pl-9 focus-visible:bg-card"
          />
        </div>
        <span className="ml-auto text-[12px] text-muted-foreground">{entries.length} событий</span>
      </Card>

      <Card className="overflow-hidden">
        {entries.length > 0 ? (
          <div className="divide-y">
            {entries.map((entry) => {
              const actor = users.find((user) => user.id === entry.actorId)

              return (
                <div
                  key={entry.id}
                  className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-secondary/30 sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {actor && <UserChip user={actor} className="w-[170px] shrink-0" />}
                    <span className="min-w-0 text-[12.5px] text-slate-600">{entry.action}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 pl-9 sm:pl-0">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-[10.5px] font-medium ${ENTITY_STYLES[entry.entity] ?? 'bg-secondary text-muted-foreground'}`}
                    >
                      {ENTITY_LABELS[entry.entity] ?? entry.entity}
                    </span>
                    <span className="text-[11px] whitespace-nowrap text-muted-foreground">
                      {formatDateTime(entry.createdAt)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <History className="size-5" />
            </span>
            <p className="mt-3 text-[14px] font-medium">Событий не найдено</p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              Попробуйте изменить поисковый запрос.
            </p>
          </div>
        )}
      </Card>
    </>
  )
}
