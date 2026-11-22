import { Construction, History } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { PageHeader } from '@/components/common/page-header'
import { Badge } from '@/components/ui/badge'

export function AuditPage() {
  return (
    <>
      <PageHeader
        title="Журнал действий"
        description="Кто и когда изменил данные компании"
        actions={
          <Badge variant="secondary" className="h-7 gap-1.5 px-2.5">
            <Construction className="size-3" /> В разработке
          </Badge>
        }
      />

      <EmptyState
        icon={History}
        title="Аудит в разработке"
        description="Журнал появится на этапе 8: каждое изменение клиента, сделки и задачи с diff-ом до и после."
        points={[
          'Кто, когда и что изменил — с прежними и новыми значениями',
          'События входа, приглашений и экспорта',
          'Фильтры по сотруднику, сущности и периоду',
          'Доступ только для администраторов компании',
        ]}
      />
    </>
  )
}
