import { Columns3, Construction } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { PageHeader } from '@/components/common/page-header'
import { Badge } from '@/components/ui/badge'

export function PipelinePage() {
  return (
    <>
      <PageHeader
        title="Воронка продаж"
        description="Сделки по этапам — перетаскивайте карточки, чтобы менять статус"
        actions={
          <Badge variant="secondary" className="h-7 gap-1.5 px-2.5">
            <Construction className="size-3" /> В разработке
          </Badge>
        }
      />

      <EmptyState
        icon={Columns3}
        title="Канбан-доска на подходе"
        description="Здесь появится воронка с перетаскиванием сделок между этапами, суммами по колонкам и быстрыми действиями."
        points={[
          'Этапы настраиваются администратором компании: название, цвет, вероятность',
          'Drag & drop со мгновенным обновлением и откатом при ошибке',
          'Фильтры по ответственному, сумме и периоду',
          'Карточка сделки: клиент, сумма, следующий шаг и дата закрытия',
        ]}
      />
    </>
  )
}
