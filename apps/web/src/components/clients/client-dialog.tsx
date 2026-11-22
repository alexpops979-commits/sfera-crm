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
import { CLIENT_STATUS_LABELS, SOURCES } from '@/demo/labels'
import { useDemo } from '@/demo/store'
import type { ClientInput, ClientStatus, DemoClient } from '@/demo/types'

interface ClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: DemoClient
}

export function ClientDialog({ open, onOpenChange, client }: ClientDialogProps) {
  const { users, currentUser, createClient, updateClient, deleteClient } = useDemo()

  const [form, setForm] = useState<ClientInput>({
    name: client?.name ?? '',
    contactName: client?.contactName ?? '',
    phone: client?.phone ?? '',
    email: client?.email ?? '',
    city: client?.city ?? '',
    source: client?.source ?? 'Сайт',
    status: client?.status ?? 'LEAD',
    ownerId: client?.ownerId ?? currentUser.id,
    tags: client?.tags ?? [],
    notes: client?.notes ?? '',
  })
  const [tagsInput, setTagsInput] = useState(client?.tags.join(', ') ?? '')
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  function patch(values: Partial<ClientInput>) {
    setForm((current) => ({ ...current, ...values }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('Укажите название клиента')
      return
    }

    const payload: ClientInput = {
      ...form,
      name: form.name.trim(),
      contactName: form.contactName.trim(),
      tags: tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    if (client) {
      updateClient(client.id, payload)
      toast.success('Клиент сохранён')
    } else {
      createClient(payload)
      toast.success('Клиент добавлен')
    }

    onOpenChange(false)
  }

  function handleDelete() {
    if (!client) return
    deleteClient(client.id)
    toast.success('Клиент удалён')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client ? 'Редактировать клиента' : 'Новый клиент'}</DialogTitle>
          <DialogDescription>
            Это пример данных — заполните поля так, как нужно вам.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="client-name">Название *</Label>
            <Input
              id="client-name"
              value={form.name}
              onChange={(event) => patch({ name: event.target.value })}
              placeholder="Стоматология «Улыбка»"
              autoFocus
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="client-contact">Контактное лицо</Label>
              <Input
                id="client-contact"
                value={form.contactName}
                onChange={(event) => patch({ contactName: event.target.value })}
                placeholder="Ольга Петрова"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-phone">Телефон</Label>
              <Input
                id="client-phone"
                value={form.phone}
                onChange={(event) => patch({ phone: event.target.value })}
                placeholder="+7 (999) 000-00-00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-email">Email</Label>
              <Input
                id="client-email"
                type="email"
                value={form.email}
                onChange={(event) => patch({ email: event.target.value })}
                placeholder="mail@company.ru"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-city">Город</Label>
              <Input
                id="client-city"
                value={form.city}
                onChange={(event) => patch({ city: event.target.value })}
                placeholder="Москва"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-source">Источник</Label>
              <Select
                id="client-source"
                value={form.source}
                onChange={(event) => patch({ source: event.target.value })}
              >
                {SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-status">Статус</Label>
              <Select
                id="client-status"
                value={form.status}
                onChange={(event) => patch({ status: event.target.value as ClientStatus })}
              >
                {(Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map((status) => (
                  <option key={status} value={status}>
                    {CLIENT_STATUS_LABELS[status]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-owner">Ответственный</Label>
              <Select
                id="client-owner"
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
              <Label htmlFor="client-tags">Теги</Label>
              <Input
                id="client-tags"
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
                placeholder="Медицина, VIP"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="client-notes">Заметки</Label>
            <Textarea
              id="client-notes"
              value={form.notes ?? ''}
              onChange={(event) => patch({ notes: event.target.value })}
              placeholder="Что важно помнить о клиенте"
            />
          </div>

          {error && <p className="text-[12px] text-red-600">{error}</p>}

          {confirmDelete && (
            <div className="rounded-lg border border-red-100 bg-red-50/60 p-3 text-[12px] text-red-700">
              Удалить клиента вместе с его сделками и задачами?
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
              {client && !confirmDelete && (
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
