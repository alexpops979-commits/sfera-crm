import { formatDate, formatMoney } from '@crm/shared'
import { Building2, CalendarDays, Mail, MapPin, Pencil, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ActivityIcon } from '@/components/common/activity-icon'
import { ClientStatusBadge } from '@/components/common/client-status-badge'
import { StageBadge } from '@/components/common/stage-badge'
import { UserChip } from '@/components/common/user-chip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { CLIENT_STATUS_LABELS } from '@/demo/labels'
import { useDemo } from '@/demo/store'
import type { ClientStatus } from '@/demo/types'
import { dueLabel } from '@/demo/utils'
import { cn } from '@/lib/utils'

type Tab = 'profile' | 'deals' | 'history' | 'tasks'

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Профиль' },
  { id: 'deals', label: 'Сделки' },
  { id: 'history', label: 'История' },
  { id: 'tasks', label: 'Задачи' },
]

interface ClientSheetProps {
  clientId: string | null
  onOpenChange: (open: boolean) => void
  onEdit?: (clientId: string) => void
}

export function ClientSheet({ clientId, onOpenChange, onEdit }: ClientSheetProps) {
  const { clients, deals, stages, users, activities, tasks, setClientStatus, toggleTask } = useDemo()
  const [tab, setTab] = useState<Tab>('profile')

  useEffect(() => {
    setTab('profile')
  }, [clientId])

  const client = clientId ? (clients.find((item) => item.id === clientId) ?? null) : null
  const owner = client ? users.find((item) => item.id === client.ownerId) : undefined

  const clientDeals = deals.filter((deal) => deal.clientId === client?.id)
  const clientActivities = activities
    .filter((activity) => activity.clientId === client?.id)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
  const clientTasks = tasks.filter((task) => task.clientId === client?.id)
  const totalAmount = clientDeals.reduce((total, deal) => total + deal.amount, 0)

  function handleStatusChange(status: ClientStatus) {
    if (!client) return
    setClientStatus(client.id, status)
    toast.success(`Статус: «${CLIENT_STATUS_LABELS[status]}»`)
  }

  return (
    <Sheet open={Boolean(client)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-[480px]">
        <SheetTitle className="sr-only">{client?.name ?? 'Клиент'}</SheetTitle>

        {client && (
          <div className="flex flex-col gap-4 p-5 pt-6">
            <div className="pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <ClientStatusBadge status={client.status} />
                {client.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h2 className="mt-2 text-[19px] leading-snug font-semibold tracking-[-0.01em]">
                {client.name}
              </h2>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                {client.contactName}
                {client.contactPosition ? ` · ${client.contactPosition}` : ''}
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm" onClick={() => onEdit?.(client.id)}>
                  <Pencil className="size-3.5" />
                  Редактировать
                </Button>
              </div>
            </div>

            <div className="flex gap-1 rounded-lg bg-secondary p-1">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    'flex-1 rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors',
                    tab === item.id
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {tab === 'profile' && (
              <div className="space-y-4">
                <div className="grid gap-3 rounded-xl border p-4">
                  <div className="flex items-center gap-2.5 text-[13px]">
                    <Phone className="size-4 shrink-0 text-muted-foreground" />
                    {client.phone}
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px]">
                    <Mail className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px]">
                    <MapPin className="size-4 shrink-0 text-muted-foreground" />
                    {client.city}
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px]">
                    <Building2 className="size-4 shrink-0 text-muted-foreground" />
                    Источник: {client.source}
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px]">
                    <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                    В базе с {formatDate(client.createdAt)}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] text-muted-foreground">Ответственный</div>
                    {owner && <UserChip user={owner} className="mt-1" showPosition />}
                  </div>
                  <div className="w-[150px] space-y-1">
                    <Label htmlFor={`client-status-${client.id}`} className="text-[11px]">
                      Статус
                    </Label>
                    <Select
                      id={`client-status-${client.id}`}
                      value={client.status}
                      onChange={(event) => handleStatusChange(event.target.value as ClientStatus)}
                      className="h-8 text-[12.5px]"
                    >
                      {(Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map((status) => (
                        <option key={status} value={status}>
                          {CLIENT_STATUS_LABELS[status]}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {client.notes && (
                  <div className="rounded-xl border bg-secondary/40 px-3.5 py-3 text-[12.5px] leading-relaxed text-slate-600">
                    {client.notes}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border p-3">
                    <div className="text-[11px] text-muted-foreground">Сделок</div>
                    <div className="mt-1 text-lg font-semibold">{clientDeals.length}</div>
                  </div>
                  <div className="rounded-xl border p-3">
                    <div className="text-[11px] text-muted-foreground">Сумма сделок</div>
                    <div className="mt-1 text-lg font-semibold">{formatMoney(totalAmount)}</div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'deals' && (
              <div className="space-y-2">
                {clientDeals.map((deal) => {
                  const stage = stages.find((item) => item.id === deal.stageId)
                  return (
                    <div
                      key={deal.id}
                      className="rounded-xl border px-3.5 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[13px] font-medium">{deal.title}</div>
                          <div className="mt-1 text-[11.5px] text-muted-foreground">
                            {deal.closedAt
                              ? `Закрыта ${formatDate(deal.closedAt)}`
                              : `Закрытие ${formatDate(deal.expectedCloseAt)}`}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-[13px] font-semibold">{formatMoney(deal.amount)}</div>
                          {stage && <StageBadge stage={stage} className="mt-1" />}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {clientDeals.length === 0 && (
                  <p className="text-[12.5px] text-muted-foreground">Сделок пока нет.</p>
                )}
              </div>
            )}

            {tab === 'history' && (
              <div className="space-y-3">
                {clientActivities.map((activity) => {
                  const author = users.find((item) => item.id === activity.authorId)
                  return (
                    <div key={activity.id} className="flex gap-2.5">
                      <ActivityIcon type={activity.type} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] leading-snug">{activity.subject}</div>
                        {activity.body && (
                          <div className="mt-0.5 text-[11.5px] text-muted-foreground">
                            {activity.body}
                          </div>
                        )}
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {formatDate(activity.occurredAt)}
                          {author ? ` · ${author.name}` : ''}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {clientActivities.length === 0 && (
                  <p className="text-[12.5px] text-muted-foreground">Коммуникаций пока нет.</p>
                )}
              </div>
            )}

            {tab === 'tasks' && (
              <div className="divide-y rounded-xl border">
                {clientTasks.map((task) => (
                  <label key={task.id} className="flex cursor-pointer items-start gap-2.5 px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={task.status === 'DONE'}
                      onChange={() => toggleTask(task.id)}
                      aria-label={task.title}
                      className="mt-0.5 size-4 accent-[#2F6BF6]"
                    />
                    <span className="min-w-0">
                      <span
                        className={cn(
                          'block text-[12.5px]',
                          task.status === 'DONE' && 'text-muted-foreground line-through',
                        )}
                      >
                        {task.title}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        {dueLabel(task.dueAt)}
                      </span>
                    </span>
                  </label>
                ))}
                {clientTasks.length === 0 && (
                  <p className="px-3 py-4 text-[12.5px] text-muted-foreground">
                    Задач по клиенту нет.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
