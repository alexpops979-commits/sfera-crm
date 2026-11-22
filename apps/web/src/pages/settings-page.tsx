import { Construction, Settings } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { PageHeader } from '@/components/common/page-header'
import { Badge } from '@/components/ui/badge'

export function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Настройки"
        description="Компания, воронки и профиль пользователя"
        actions={
          <Badge variant="secondary" className="h-7 gap-1.5 px-2.5">
            <Construction className="size-3" /> В разработке
          </Badge>
        }
      />

      <EmptyState
        icon={Settings}
        title="Настройки в разработке"
        description="Здесь будут параметры компании, гибкий редактор воронки и личный профиль."
        points={[
          'Название и логотип компании',
          'Редактор этапов воронки: порядок, цвет, вероятность, успех/проигрыш',
          'Профиль пользователя и смена пароля',
          'Источники клиентов и пользовательские статусы',
        ]}
      />
    </>
  )
}
