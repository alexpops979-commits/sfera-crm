import { formatDate, formatMoneyCompact } from '@crm/shared'
import { Search } from 'lucide-react'
import { useMemo, useState, type DragEvent } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/page-header'
import { UserAvatar } from '@/components/common/user-chip'
import { DealSheet } from '@/components/deals/deal-sheet'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useDemo } from '@/demo/store'
import { cn } from '@/lib/utils'

export function PipelinePage() {
  const { deals, stages, clients, users, moveDeal } = useDemo()
  const [search, setSearch] = useState('')
  const [ownerId, setOwnerId] = useState('all')
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overStage, setOverStage] = useState<string | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null)

  const filteredDeals = useMemo(() => {
    const query = search.trim().toLowerCase()

    return deals.filter((deal) => {
      if (ownerId !== 'all' && deal.ownerId !== ownerId) return false
      if (!query) return true
      const client = clients.find((item) => item.id === deal.clientId)
      return (
        deal.title.toLowerCase().includes(query) ||
        (client?.name.toLowerCase().includes(query) ?? false)
      )
    })
  }, [deals, clients, ownerId, search])

  const activeValue = filteredDeals
    .filter((deal) => {
      const stage = stages.find((item) => item.id === deal.stageId)
      return !stage?.isWon && !stage?.isLost
    })
    .reduce((total, deal) => total + deal.amount, 0)

  function handleDrop(event: DragEvent, stageId: string) {
    event.preventDefault()
    const dealId = event.dataTransfer.getData('text/plain') || draggingId
    const stage = stages.find((item) => item.id === stageId)

    if (dealId && stage) {
      moveDeal(dealId, stageId)
      toast.success(`Сделка перемещена в «${stage.name}»`)
    }

    setDraggingId(null)
    setOverStage(null)
  }

  return (
    <>
      <PageHeader
        title="Воронка продаж"
        description="Перетаскивайте карточки между этапами — показатели обновятся сразу"
        actions={<Badge variant="outline">В работе: {formatMoneyCompact(activeValue)}</Badge>}
      />

      <Card className="mb-4 flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-[300px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск по сделке или клиенту"
            className="border-transparent bg-secondary/60 pl-9 focus-visible:bg-card"
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={ownerId} onChange={(event) => setOwnerId(event.target.value)}>
            <option value="all">Все ответственные</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </div>
        <span className="text-[12px] text-muted-foreground sm:ml-auto">
          {filteredDeals.length} сделок
        </span>
      </Card>

      <div className="flex gap-3 overflow-x-auto pb-3">
        {stages.map((stage) => {
          const stageDeals = filteredDeals.filter((deal) => deal.stageId === stage.id)
          const sum = stageDeals.reduce((total, deal) => total + deal.amount, 0)

          return (
            <div
              key={stage.id}
              onDragOver={(event) => {
                event.preventDefault()
                setOverStage(stage.id)
              }}
              onDragLeave={() => setOverStage(null)}
              onDrop={(event) => handleDrop(event, stage.id)}
              className={cn(
                'flex w-[276px] shrink-0 flex-col rounded-xl border border-transparent bg-secondary/40 p-2 transition-colors',
                overStage === stage.id && 'border-primary/40 bg-accent/60',
              )}
            >
              <div className="px-1.5 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-[12.5px] font-semibold">{stage.name}</span>
                  <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="mt-0.5 pl-4 text-[11px] text-muted-foreground">
                  {formatMoneyCompact(sum)}
                </div>
              </div>

              <div className="flex min-h-[140px] flex-1 flex-col gap-2">
                {stageDeals.map((deal) => {
                  const client = clients.find((item) => item.id === deal.clientId)
                  const owner = users.find((item) => item.id === deal.ownerId)

                  return (
                    <article
                      key={deal.id}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData('text/plain', deal.id)
                        event.dataTransfer.effectAllowed = 'move'
                        setDraggingId(deal.id)
                      }}
                      onDragEnd={() => {
                        setDraggingId(null)
                        setOverStage(null)
                      }}
                      onClick={() => setSelectedDeal(deal.id)}
                      className={cn(
                        'cursor-pointer rounded-xl border bg-card p-3 shadow-xs transition-all hover:border-primary/25 hover:shadow-sm',
                        draggingId === deal.id && 'opacity-40',
                      )}
                    >
                      <div className="text-[13px] leading-snug font-medium">{deal.title}</div>
                      <div className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                        {client?.name ?? 'Клиент не указан'}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-[13px] font-semibold">
                          {formatMoneyCompact(deal.amount)}
                        </span>
                        {owner && <UserAvatar user={owner} />}
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10.5px] text-muted-foreground">
                        <span>
                          {formatDate(deal.closedAt ?? deal.expectedCloseAt)}
                        </span>
                        {stage.isWon ? (
                          <Badge variant="success">Успешно</Badge>
                        ) : stage.isLost ? (
                          <Badge variant="destructive">Проиграно</Badge>
                        ) : null}
                      </div>
                    </article>
                  )
                })}

                {stageDeals.length === 0 && (
                  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed text-center text-[11px] text-muted-foreground">
                    Перетащите сделку сюда
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <DealSheet dealId={selectedDeal} onOpenChange={(open) => !open && setSelectedDeal(null)} />
    </>
  )
}
