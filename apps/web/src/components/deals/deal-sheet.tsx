import { formatDate, formatMoney } from '@crm/shared'
import { CalendarDays } from 'lucide-react'
import { toast } from 'sonner'
import { ActivityIcon } from '@/components/common/activity-icon'
import { StageBadge } from '@/components/common/stage-badge'
import { UserChip } from '@/components/common/user-chip'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useDemo } from '@/demo/store'
import { dueLabel } from '@/demo/utils'

interface DealSheetProps {
  dealId: string | null
  onOpenChange: (open: boolean) => void
}

export function DealSheet({ dealId, onOpenChange }: DealSheetProps) {
  const { deals, clients, users, stages, tasks, activities, moveDeal, toggleTask } = useDemo()

  const deal = dealId ? (deals.find((item) => item.id === dealId) ?? null) : null
  const client = deal ? clients.find((item) => item.id === deal.clientId) : undefined
  const owner = deal ? users.find((item) => item.id === deal.ownerId) : undefined
  const stage = deal ? stages.find((item) => item.id === deal.stageId) : undefined

  const dealTasks = tasks.filter((task) => task.dealId === deal?.id)
  const clientActivities = activities
    .filter((activity) => activity.clientId === deal?.clientId)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 4)

  function handleStageChange(nextStageId: string) {
    if (!deal) return
    const next = stages.find((item) => item.id === nextStageId)
    moveDeal(deal.id, nextStageId)
    toast.success(`Сделка перемещена в «${next?.name ?? 'этап'}»`)
  }

  return (
    <Sheet open={Boolean(deal)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-[460px]">
        <SheetTitle className="sr-only">{deal?.title ?? 'Сделка'}</SheetTitle>

        {deal && client && (
          <div className="flex flex-col gap-5 p-5 pt-6">
            <div className="pr-8">
              {stage && <StageBadge stage={stage} />}
              <h2 className="mt-2 text-[19px] leading-snug font-semibold tracking-[-0.01em]">
                {deal.title}
              </h2>
              <p className="mt-0.5 text-[13px] text-muted-foreground">{client.name}</p>
            </div>

            <div className="rounded-xl border bg-secondary/40 p-4">
              <div className="text-[11.5px] text-muted-foreground">Сумма сделки</div>
              <div className="mt-1 text-[26px] leading-none font-semibold tracking-[-0.02em]">
                {formatMoney(deal.amount)}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {deal.closedAt
                  ? `Закрыта ${formatDate(deal.closedAt)}`
                  : `Ожидаемое закрытие ${formatDate(deal.expectedCloseAt)}`}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`deal-stage-${deal.id}`}>Этап сделки</Label>
              <Select
                id={`deal-stage-${deal.id}`}
                value={deal.stageId}
                onChange={(event) => handleStageChange(event.target.value)}
              >
                {stages.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
              <p className="text-[11.5px] text-muted-foreground">
                Перемещение сразу обновляет воронку и показатели дашборда.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-muted-foreground">Клиент</div>
                <div className="mt-1 text-[13px] font-medium">{client.name}</div>
                <div className="text-[11.5px] text-muted-foreground">{client.phone}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Ответственный</div>
                {owner ? (
                  <UserChip user={owner} className="mt-1.5" showPosition />
                ) : (
                  <div className="mt-1 text-[13px]">—</div>
                )}
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Создана</div>
                <div className="mt-1 text-[13px]">{formatDate(deal.createdAt)}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Вероятность</div>
                <div className="mt-1 text-[13px]">{stage?.probability ?? 0}%</div>
              </div>
            </div>

            {deal.lostReason && (
              <div className="rounded-lg border border-red-100 bg-red-50/60 px-3 py-2 text-[12.5px] text-red-700">
                Причина проигрыша: {deal.lostReason}
              </div>
            )}

            {deal.tags?.length ? (
              <div className="flex flex-wrap gap-1.5">
                {deal.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}

            <section>
              <h3 className="text-[13px] font-semibold">Задачи по сделке</h3>
              {dealTasks.length > 0 ? (
                <div className="mt-2 divide-y rounded-xl border">
                  {dealTasks.map((task) => (
                    <label
                      key={task.id}
                      className="flex cursor-pointer items-start gap-2.5 px-3 py-2.5"
                    >
                      <input
                        type="checkbox"
                        checked={task.status === 'DONE'}
                        onChange={() => toggleTask(task.id)}
                        aria-label={task.title}
                        className="mt-0.5 size-4 accent-[#2F6BF6]"
                      />
                      <span className="min-w-0">
                        <span
                          className={
                            task.status === 'DONE'
                              ? 'block text-[12.5px] text-muted-foreground line-through'
                              : 'block text-[12.5px]'
                          }
                        >
                          {task.title}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">
                          {dueLabel(task.dueAt)}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mt-1.5 text-[12px] text-muted-foreground">
                  По этой сделке задач пока нет.
                </p>
              )}
            </section>

            <section>
              <h3 className="text-[13px] font-semibold">Последние коммуникации</h3>
              <div className="mt-2 space-y-3">
                {clientActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-2.5">
                    <ActivityIcon type={activity.type} />
                    <div className="min-w-0">
                      <div className="text-[12.5px] leading-snug">{activity.subject}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatDate(activity.occurredAt)}
                      </div>
                    </div>
                  </div>
                ))}
                {clientActivities.length === 0 && (
                  <p className="text-[12px] text-muted-foreground">Коммуникаций пока нет.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
