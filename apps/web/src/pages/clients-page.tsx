import { formatDate, formatMoney } from '@crm/shared'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ClientSheet } from '@/components/clients/client-sheet'
import { ClientStatusBadge } from '@/components/common/client-status-badge'
import { PageHeader } from '@/components/common/page-header'
import { UserChip } from '@/components/common/user-chip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { CLIENT_STATUS_LABELS } from '@/demo/labels'
import { computeClientMetrics } from '@/demo/metrics'
import { useDemo } from '@/demo/store'
import type { ClientStatus } from '@/demo/types'

const PAGE_SIZE = 8

type SortKey = 'new' | 'name' | 'amount' | 'activity'

export function ClientsPage() {
  const { clients, deals, activities, stages, users } = useDemo()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | ClientStatus>('all')
  const [ownerId, setOwnerId] = useState('all')
  const [sort, setSort] = useState<SortKey>('new')
  const [page, setPage] = useState(1)
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase()

    return clients
      .filter((client) => {
        if (status !== 'all' && client.status !== status) return false
        if (ownerId !== 'all' && client.ownerId !== ownerId) return false
        if (!query) return true
        return (
          client.name.toLowerCase().includes(query) ||
          client.contactName.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.phone.toLowerCase().includes(query)
        )
      })
      .map((client) => ({
        client,
        metrics: computeClientMetrics(client.id, deals, activities, stages),
        owner: users.find((user) => user.id === client.ownerId),
      }))
      .sort((a, b) => {
        if (sort === 'name') return a.client.name.localeCompare(b.client.name, 'ru')
        if (sort === 'amount') return b.metrics.dealsAmount - a.metrics.dealsAmount
        if (sort === 'activity') {
          return (
            new Date(b.metrics.lastActivityAt ?? 0).getTime() -
            new Date(a.metrics.lastActivityAt ?? 0).getTime()
          )
        }
        return new Date(b.client.createdAt).getTime() - new Date(a.client.createdAt).getTime()
      })
  }, [clients, users, deals, activities, stages, search, status, ownerId, sort])

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = rows.slice(start, start + PAGE_SIZE)

  return (
    <>
      <PageHeader
        title="Клиенты"
        description="Единая база клиентов с историей коммуникаций и сделками"
        actions={<Badge variant="outline">{rows.length} в выборке</Badge>}
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
            placeholder="Имя, телефон, email"
            className="border-transparent bg-secondary/60 pl-9 focus-visible:bg-card"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex">
          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as 'all' | ClientStatus)
              setPage(1)
            }}
            className="lg:w-[150px]"
          >
            <option value="all">Все статусы</option>
            {(Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map((key) => (
              <option key={key} value={key}>
                {CLIENT_STATUS_LABELS[key]}
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
            <option value="name">По названию</option>
            <option value="amount">По сумме сделок</option>
            <option value="activity">По активности</option>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b bg-secondary/30 text-[10.5px] tracking-[0.06em] text-muted-foreground uppercase">
                <th className="px-5 py-2.5 font-medium">Клиент</th>
                <th className="px-3 py-2.5 font-medium">Статус</th>
                <th className="px-3 py-2.5 font-medium">Ответственный</th>
                <th className="px-3 py-2.5 text-right font-medium">Сделки</th>
                <th className="px-3 py-2.5 font-medium">Активность</th>
                <th className="px-5 py-2.5 font-medium">В базе с</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageRows.map(({ client, metrics, owner }) => (
                <tr
                  key={client.id}
                  onClick={() => setSelectedClient(client.id)}
                  className="cursor-pointer transition-colors hover:bg-secondary/40"
                >
                  <td className="px-5 py-3">
                    <div className="text-[13px] font-medium">{client.name}</div>
                    <div className="mt-0.5 text-[11.5px] text-muted-foreground">
                      {client.contactName} · {client.phone}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <ClientStatusBadge status={client.status} />
                  </td>
                  <td className="px-3 py-3">
                    {owner && <UserChip user={owner} />}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="text-[12.5px] font-medium">{metrics.dealsCount}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {formatMoney(metrics.dealsAmount)}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[12px] text-muted-foreground">
                    {formatDate(metrics.lastActivityAt)}
                  </td>
                  <td className="px-5 py-3 text-[12px] text-muted-foreground">
                    {formatDate(client.createdAt)}
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[13px] text-muted-foreground">
                    Ничего не найдено. Измените поиск или фильтры.
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

      <ClientSheet
        clientId={selectedClient}
        onOpenChange={(open) => !open && setSelectedClient(null)}
      />
    </>
  )
}
