import { Construction, Users } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { PageHeader } from '@/components/common/page-header'
import { Badge } from '@/components/ui/badge'

export function ClientsPage() {
  return (
    <>
      <PageHeader
        title="Клиенты"
        description="Единая база клиентов с историей коммуникаций"
        actions={
          <Badge variant="secondary" className="h-7 gap-1.5 px-2.5">
            <Construction className="size-3" /> В разработке
          </Badge>
        }
      />

      <EmptyState
        icon={Users}
        title="База клиентов в разработке"
        description="Раздел клиентов появится на этапе 2: таблица с поиском, фильтрами, сортировкой и карточкой клиента."
        points={[
          'Поиск по имени, телефону и email — с учётом морфологии',
          'Фильтры по статусу, источнику и ответственному',
          'Пагинация и настраиваемая сортировка',
          'Карточка клиента: сделки, коммуникации и задачи в одном месте',
        ]}
      />
    </>
  )
}
