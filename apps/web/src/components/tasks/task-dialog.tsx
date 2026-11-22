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
import { TASK_PRIORITY_LABELS } from '@/demo/labels'
import { useDemo } from '@/demo/store'
import type { DemoTask, TaskInput, TaskPriority } from '@/demo/types'

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: DemoTask
}

export function TaskDialog({ open, onOpenChange, task }: TaskDialogProps) {
  const { clients, deals, users, currentUser, createTask, updateTask, deleteTask } = useDemo()

  const [form, setForm] = useState({
    title: task?.title ?? '',
    dueAt: toDateInputValue(task?.dueAt ?? new Date()),
    priority: task?.priority ?? ('NORMAL' as TaskPriority),
    assigneeId: task?.assigneeId ?? currentUser.id,
    clientId: task?.clientId ?? '',
    dealId: task?.dealId ?? '',
  })
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const clientDeals = form.clientId
    ? deals.filter((deal) => deal.clientId === form.clientId)
    : deals

  function patch(values: Partial<typeof form>) {
    setForm((current) => ({ ...current, ...values }))
  }

  function handleClientChange(clientId: string) {
    const currentDeal = deals.find((deal) => deal.id === form.dealId)
    const keepDeal = !clientId || currentDeal?.clientId === clientId
    patch({ clientId, dealId: keepDeal ? form.dealId : '' })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.title.trim()) return setError('Укажите название задачи')
    if (!form.dueAt) return setError('Укажите срок')

    const payload: TaskInput = {
      title: form.title.trim(),
      dueAt: new Date(`${form.dueAt}T12:00:00`).toISOString(),
      priority: form.priority,
      assigneeId: form.assigneeId,
      clientId: form.clientId || undefined,
      dealId: form.dealId || undefined,
    }

    if (task) {
      updateTask(task.id, payload)
      toast.success('Задача сохранена')
    } else {
      createTask(payload)
      toast.success('Задача добавлена')
    }

    onOpenChange(false)
  }

  function handleDelete() {
    if (!task) return
    deleteTask(task.id)
    toast.success('Задача удалена')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Редактировать задачу' : 'Новая задача'}</DialogTitle>
          <DialogDescription>
            Пример данных: задачу можно изменить или удалить в любой момент.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Название *</Label>
            <Input
              id="task-title"
              value={form.title}
              onChange={(event) => patch({ title: event.target.value })}
              placeholder="Позвонить клиенту"
              autoFocus
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="task-due">Срок *</Label>
              <Input
                id="task-due"
                type="date"
                value={form.dueAt}
                onChange={(event) => patch({ dueAt: event.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-priority">Приоритет</Label>
              <Select
                id="task-priority"
                value={form.priority}
                onChange={(event) => patch({ priority: event.target.value as TaskPriority })}
              >
                {(Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[]).map((priority) => (
                  <option key={priority} value={priority}>
                    {TASK_PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-assignee">Исполнитель</Label>
              <Select
                id="task-assignee"
                value={form.assigneeId}
                onChange={(event) => patch({ assigneeId: event.target.value })}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-client">Клиент</Label>
              <Select
                id="task-client"
                value={form.clientId}
                onChange={(event) => handleClientChange(event.target.value)}
              >
                <option value="">Без клиента</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-deal">Сделка</Label>
            <Select
              id="task-deal"
              value={form.dealId}
              onChange={(event) => patch({ dealId: event.target.value })}
            >
              <option value="">Без сделки</option>
              {clientDeals.map((deal) => (
                <option key={deal.id} value={deal.id}>
                  {deal.title}
                </option>
              ))}
            </Select>
          </div>

          {error && <p className="text-[12px] text-red-600">{error}</p>}

          {confirmDelete && (
            <div className="rounded-lg border border-red-100 bg-red-50/60 p-3 text-[12px] text-red-700">
              Удалить задачу?
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
              {task && !confirmDelete && (
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
