import { formatDate, formatMoney } from '@crm/shared'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { StageBadge } from '@/components/common/stage-badge'
import { UserChip } from '@/components/common/user-chip'
import { DealSheet } from '@/components/deals/deal-sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useDemo } from '@/demo/store'

const PAGE_SIZE = 10

type SortKey = 'new' | 'amount' | 'close'

export function DealsPage() {
  const { deals, clients, stages, users } = useDemo()
  const [search, setSearch] = useState('')
  const [stageId, setStageId] = useState('all')
  const [ownerId, setOwnerId] = useState('all')
  const [sort, setSort] = useState<SortKey>('new')
  const [page, setPage] = useState(1)
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null)

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase()

    return deals
      .filter((deal) => {
        if (stageId !== 'all' && deal.stageId !== stageId) return false
        if (ownerId !== 'all' && deal.ownerId !== ownerId) return false
        if (!query) return true
        const client = clients.find((item) => item.id === deal.clientId)
        return (
          deal.title.toLowerCase().includes(query) ||
          (client?.name.toLowerCase().includes(query) ?? false)
        )
      })
      .map((deal) => ({
        deal,
        client: clients.find((item) => item.id === deal.clientId),
        stage: stages.find((item) => item.id === deal.stageId),
        owner: users.find((item) => item.id === deal.ownerId),
      }))
      .sort((a, b) => {
        if (sort === 'amount') return b.deal.amount - a.deal.amount
        if (sort === 'close') {
          return (
            new Date(a.deal.closedAt ?? a.deal.expectedCloseAt).getTime() -
            new Date(b.deal.closedAt ?? b.deal.expectedCloseAt).getTime()
          )
        }
        return new Date(b.deal.createdAt).getTime() - new Date(a.deal.createdAt).getTime()
      })
  }, [deals, clients, stages, users, search, stageId, ownerId, sort])

  const totalAmount = rows.reduce((total, row) => total + row.deal.amount, 0)
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = rows.slice(start, start + PAGE_SIZE)

  return (
    <>
      <PageHeader
        title="Сделки"
        description="Все сделки компании: суммы, этапы и ответственные"
        actions={
          <Badge variant="outline">
            {rows.length} сделок · {formatMoney(totalAmount)}
          </Badge>
        }
      />

      <Card className="mb-4 flex flex-col gap-2 p-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-[320px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Сделка или клиент"
            className="border-transparent bg-secondary/60 pl-9 focus-visible:bg-card"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex">
          <Select
            value={stageId}
            onChange={(event) => {
              setStageId(event.target.value)
              setPage(1)
            }}
            className="lg:w-[160px]"
          >
            <option value="all">Все этапы</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </Select>
          <Select
            value={ownerId}
            onChange={(event) => {
              setOwnerId(event.target.value)
              setPage(1)
            }}
            className="lg:w-[170px]"
          >
            <option value="all">Все ответственные</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
          <Select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="col-span-2 sm:col-span-1 lg:w-[170px]"
          >
            <option value="new">Сначала новые</option>
            <option value="amount">По сумме</option>
            <option value="close">По дате закрытия</option>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b bg-secondary/30 text-[10.5px] tracking-[0.06em] text-muted-foreground uppercase">
                <th scope="col" className="px-5 py-2.5 font-medium">Сделка</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Этап</th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">Сумма</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Ответственный</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Клиент</th>
                <th scope="col" className="px-5 py-2.5 font-medium">Закрытие</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageRows.map(({ deal, client, stage, owner }) => (
                <tr
                  key={deal.id}
                  onClick={() => setSelectedDeal(deal.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedDeal(deal.id)
                    }
                  }}
                  tabIndex={0}
                  className="cursor-pointer transition-colors hover:bg-secondary/40 focus-visible:bg-secondary/60 focus-visible:outline-none"
                >
                  <td className="px-5 py-3">
                    <div className="text-[13px] font-medium">{deal.title}</div>
                    {deal.lostReason && (
                      <div className="mt-0.5 text-[11px] text-red-600">{deal.lostReason}</div>
                    )}
                  </td>
                  <td className="px-3 py-3">{stage && <StageBadge stage={stage} />}</td>
                  <td className="px-3 py-3 text-right text-[13px] font-semibold">
                    {formatMoney(deal.amount)}
                  </td>
                  <td className="px-3 py-3">{owner && <UserChip user={owner} />}</td>
                  <td className="px-3 py-3 text-[12px] text-muted-foreground">{client?.name}</td>
                  <td className="px-5 py-3 text-[12px] text-muted-foreground">
                    {formatDate(deal.closedAt ?? deal.expectedCloseAt)}
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[13px] text-muted-foreground">
                    Сделок не найдено.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t px-5 py-3">
          <span className="text-[12px] text-muted-foreground">
            {rows.length > 0
              ? `Показано ${start + 1}–${Math.min(start + PAGE_SIZE, rows.length)} из ${rows.length}`
              : 'Нет записей'}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft className="size-3.5" />
              Назад
            </Button>
            <span className="text-[12px] tabular-nums text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Вперёд
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      <DealSheet dealId={selectedDeal} onOpenChange={(open) => !open && setSelectedDeal(null)} />
    </>
  )
}
