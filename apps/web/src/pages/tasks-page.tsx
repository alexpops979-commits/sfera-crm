import { CheckSquare, Construction } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { PageHeader } from '@/components/common/page-header'
import { Badge } from '@/components/ui/badge'

export function TasksPage() {
  return (
    <>
      <PageHeader
        title="Задачи"
        description="Напоминания, звонки и следующие шаги по сделкам"
        actions={
          <Badge variant="secondary" className="h-7 gap-1.5 px-2.5">
            <Construction className="size-3" /> В разработке
          </Badge>
        }
      />

      <EmptyState
        icon={CheckSquare}
        title="Задачи и напоминания в разработке"
        description="Раздел появится после коммуникаций: задачи с дедлайнами, приоритетами и уведомлениями."
        points={[
          'Список «Мои задачи» и «Вся команда»',
          'Дедлайны, приоритеты и привязка к клиенту или сделке',
          'Напоминания в приложении и на почту',
          'Просроченные задачи подсвечиваются в сайдбаре',
        ]}
      />
    </>
  )
}
