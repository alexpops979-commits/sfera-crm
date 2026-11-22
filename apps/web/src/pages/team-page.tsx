import { Construction, UserCog } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { PageHeader } from '@/components/common/page-header'
import { Badge } from '@/components/ui/badge'

export function TeamPage() {
  return (
    <>
      <PageHeader
        title="Команда"
        description="Сотрудники, роли и права доступа"
        actions={
          <Badge variant="secondary" className="h-7 gap-1.5 px-2.5">
            <Construction className="size-3" /> В разработке
          </Badge>
        }
      />

      <EmptyState
        icon={UserCog}
        title="Управление командой в разработке"
        description="Раздел появится вместе с RBAC: приглашения сотрудников и матрица прав."
        points={[
          'Роли: администратор, менеджер, сотрудник',
          'Приглашение по ссылке с выбором роли',
          'Деактивация сотрудника без удаления истории',
          'Ограничение видимости: сотрудник видит только свои сделки',
        ]}
      />
    </>
  )
}
