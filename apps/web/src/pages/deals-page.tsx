import { Briefcase, Construction } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { PageHeader } from '@/components/common/page-header'
import { Badge } from '@/components/ui/badge'

export function DealsPage() {
  return (
    <>
      <PageHeader
        title="Сделки"
        description="Реестр всех сделок компании"
        actions={
          <Badge variant="secondary" className="h-7 gap-1.5 px-2.5">
            <Construction className="size-3" /> В разработке
          </Badge>
        }
      />

      <EmptyState
        icon={Briefcase}
        title="Реестр сделок в разработке"
        description="Помимо канбана понадобится табличный вид: здесь появятся все сделки с суммами, этапами и ответственными."
        points={[
          'Список с пагинацией, поиском и фильтрами',
          'Изменение этапа прямо из таблицы',
          'Суммы воронки и конверсия по этапам',
          'Экспорт выбранной выборки в CSV и Excel',
        ]}
      />
    </>
  )
}
