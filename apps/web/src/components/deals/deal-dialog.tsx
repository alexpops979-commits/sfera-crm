import { toDateInputValue } from '@crm/shared'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useDemo } from '@/demo/store'
import type { DealInput, DemoDeal } from '@/demo/types'

const DAY = 86_400_000

interface DealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deal?: DemoDeal
}

export function DealDialog({ open, onOpenChange, deal }: DealDialogProps) {
  const { clients, users, stages, currentUser, createDeal, updateDeal, deleteDeal } = useDemo()

  const [form, setForm] = useState({
    title: deal?.title ?? '',
    clientId: deal?.clientId ?? clients[0]?.id ?? '',
    stageId: deal?.stageId ?? stages[0]?.id ?? '',
    amount: deal ? String(deal.amount) : '',
    ownerId: deal?.ownerId ?? currentUser.id,
    expectedCloseAt: toDateInputValue(
      deal?.expectedCloseAt ?? new Date(Date.now() + 14 * DAY),
    ),
    lostReason: deal?.lostReason ?? '',
  })
  const [tagsInput, setTagsInput] = useState(deal?.tags?.join(', ') ?? '')
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const stage = stages.find((item) => item.id === form.stageId)

  function patch(values: Partial<typeof form>) {
    setForm((current) => ({ ...current, ...values }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const amount = Number(form.amount.replace(/\s/g, '').replace(',', '.'))

    if (!form.title.trim()) return setError('Укажите название сделки')
    if (!form.clientId) return setError('Выберите клиента')
    if (!form.expectedCloseAt) return setError('Укажите дату закрытия')
    if (!Number.isFinite(amount) || amount <= 0) return setError('Сумма должна быть больше нуля')

    const payload: DealInput = {
      title: form.title.trim(),
      clientId: form.clientId,
      stageId: form.stageId,
      amount,
      ownerId: form.ownerId,
      expectedCloseAt: new Date(`${form.expectedCloseAt}T12:00:00`).toISOString(),
      tags: tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      lostReason: stage?.isLost ? form.lostReason.trim() || 'Не указана' : undefined,
    }

    if (deal) {
      updateDeal(deal.id, payload)
      toast.success('Сделка сохранена')
    } else {
      createDeal(payload)
      toast.success('Сделка добавлена')
    }

    onOpenChange(false)
  }

  function handleDelete() {
    if (!deal) return
    deleteDeal(deal.id)
    toast.success('Сделка удалена')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{deal ? 'Редактировать сделку' : 'Новая сделка'}</DialogTitle>
          <DialogDescription>
            Пример данных: укажите свои значения — они сохранятся в этом браузере.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="deal-title">Название *</Label>
            <Input
              id="deal-title"
              value={form.title}
              onChange={(event) => patch({ title: event.target.value })}
              placeholder="Редизайн сайта"
              autoFocus
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="deal-client">Клиент *</Label>
              <Select
                id="deal-client"
                value={form.clientId}
                onChange={(event) => patch({ clientId: event.target.value })}
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deal-stage">Этап</Label>
              <Select
                id="deal-stage"
                value={form.stageId}
                onChange={(event) => patch({ stageId: event.target.value })}
              >
                {stages.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deal-amount">Сумма, ₽ *</Label>
              <Input
                id="deal-amount"
                inputMode="numeric"
                value={form.amount}
                onChange={(event) => patch({ amount: event.target.value })}
                placeholder="150000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deal-close">Ожидаемое закрытие</Label>
              <Input
                id="deal-close"
                type="date"
                value={form.expectedCloseAt}
                onChange={(event) => patch({ expectedCloseAt: event.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deal-owner">Ответственный</Label>
              <Select
                id="deal-owner"
                value={form.ownerId}
                onChange={(event) => patch({ ownerId: event.target.value })}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deal-tags">Теги</Label>
              <Input
                id="deal-tags"
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
                placeholder="Сайт, SEO"
              />
            </div>
          </div>

          {stage?.isLost && (
            <div className="space-y-1.5">
              <Label htmlFor="deal-lost">Причина проигрыша</Label>
              <Textarea
                id="deal-lost"
                value={form.lostReason}
                onChange={(event) => patch({ lostReason: event.target.value })}
                placeholder="Например: выбрали другого подрядчика"
              />
            </div>
          )}

          {error && <p className="text-[12px] text-red-600">{error}</p>}

          {confirmDelete && (
            <div className="rounded-lg border border-red-100 bg-red-50/60 p-3 text-[12px] text-red-700">
              Удалить сделку? Задачи останутся, но потеряют привязку к ней.
              <div className="mt-2 flex gap-2">
                <Button type="button" size="sm" variant="destructive" onClick={handleDelete}>
                  Удалить
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setConfirmDelete(false)}
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            <div>
              {deal && !confirmDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setConfirmDelete(true)}
                >
                  Удалить
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit">Сохранить</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
