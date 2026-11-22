import { CheckSquare } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { UserAvatar } from '@/components/common/user-chip'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { TASK_PRIORITY_CLASSES, TASK_PRIORITY_LABELS } from '@/demo/labels'
import { useDemo } from '@/demo/store'
import type { DemoTask } from '@/demo/types'
import {
  TASK_BUCKET_LABELS,
  dueLabel,
  taskBucket,
  type TaskBucket,
} from '@/demo/utils'
import { cn } from '@/lib/utils'

const BUCKET_ORDER: TaskBucket[] = ['overdue', 'today', 'week', 'later', 'done']

const PRIORITY_ORDER: Record<DemoTask['priority'], number> = {
  HIGH: 0,
  NORMAL: 1,
  LOW: 2,
}

export function TasksPage() {
  const { tasks, clients, users, toggleTask } = useDemo()
  const [assigneeId, setAssigneeId] = useState('all')
  const [showDone, setShowDone] = useState(true)

  const filtered = useMemo(
    () => tasks.filter((task) => assigneeId === 'all' || task.assigneeId === assigneeId),
    [tasks, assigneeId],
  )

  const grouped = useMemo(() => {
    const map = new Map<TaskBucket, DemoTask[]>()
    for (const bucket of BUCKET_ORDER) map.set(bucket, [])

    for (const task of filtered) {
      const bucket = taskBucket(task)
      if (bucket === 'done' && !showDone) continue
      map.get(bucket)?.push(task)
    }

    for (const bucket of BUCKET_ORDER) {
      map.get(bucket)?.sort((a, b) => {
        const byPriority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        if (byPriority !== 0) return byPriority
        return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
      })
    }

    return map
  }, [filtered, showDone])

  const openCount = filtered.filter((task) => task.status === 'OPEN').length
  const overdueCount = grouped.get('overdue')?.length ?? 0
  const todayCount = grouped.get('today')?.length ?? 0
  const doneCount = filtered.filter((task) => task.status === 'DONE').length

  return (
    <>
      <PageHeader
        title="Задачи"
        description="Звонки, письма и следующие шаги по клиентам и сделкам"
        actions={<Badge variant="outline">{openCount} открытых</Badge>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Просрочено', value: overdueCount, accent: overdueCount > 0 },
          { label: 'На сегодня', value: todayCount, accent: false },
          { label: 'Открытых', value: openCount, accent: false },
          { label: 'Выполнено', value: doneCount, accent: false },
        ].map((item) => (
          <Card key={item.label} className="p-4">
            <div className="text-[11.5px] text-muted-foreground">{item.label}</div>
            <div
              className={cn(
                'mt-1 text-[24px] leading-none font-semibold tracking-[-0.02em]',
                item.accent ? 'text-red-600' : 'text-foreground',
              )}
            >
              {item.value}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mb-4 flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-[220px]">
          <Select value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)}>
            <option value="all">Все сотрудники</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-muted-foreground">
          <input
            type="checkbox"
            checked={showDone}
            onChange={(event) => setShowDone(event.target.checked)}
            className="size-4 accent-[#2F6BF6]"
          />
          Показывать выполненные
        </label>
      </Card>

      <div className="space-y-5">
        {BUCKET_ORDER.map((bucket) => {
          const bucketTasks = grouped.get(bucket) ?? []
          if (bucketTasks.length === 0) return null

          return (
            <section key={bucket}>
              <div className="mb-2 flex items-center gap-2">
                <h2
                  className={cn(
                    'text-[13px] font-semibold',
                    bucket === 'overdue' && 'text-red-600',
                  )}
                >
                  {TASK_BUCKET_LABELS[bucket]}
                </h2>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {bucketTasks.length}
                </span>
              </div>

              <Card className="divide-y overflow-hidden">
                {bucketTasks.map((task) => {
                  const assignee = users.find((user) => user.id === task.assigneeId)
                  const client = task.clientId
                    ? clients.find((item) => item.id === task.clientId)
                    : undefined
                  const done = task.status === 'DONE'
                  const overdue = bucket === 'overdue'

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/30',
                        overdue && 'bg-red-50/30',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggleTask(task.id)}
                        aria-label={task.title}
                        className="mt-0.5 size-4 shrink-0 accent-[#2F6BF6]"
                      />
                      <div className="min-w-0 flex-1">
                        <div
                          className={cn(
                            'text-[13px] font-medium',
                            done && 'text-muted-foreground line-through',
                          )}
                        >
                          {task.title}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                          {client && <span>{client.name}</span>}
                          {client && <span className="text-border">•</span>}
                          <span className={overdue ? 'font-medium text-red-600' : ''}>
                            {dueLabel(task.dueAt)}
                          </span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          'hidden rounded-md px-2 py-0.5 text-[10.5px] font-medium sm:inline-flex',
                          TASK_PRIORITY_CLASSES[task.priority],
                        )}
                      >
                        {TASK_PRIORITY_LABELS[task.priority]}
                      </span>
                      {assignee && <UserAvatar user={assignee} />}
                    </div>
                  )
                })}
              </Card>
            </section>
          )
        })}

        {openCount === 0 && doneCount === 0 && (
          <Card className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <CheckSquare className="size-5" />
            </span>
            <p className="mt-3 text-[14px] font-medium">Задач нет</p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              По выбранному сотруднику задач не найдено.
            </p>
          </Card>
        )}
      </div>
    </>
  )
}
