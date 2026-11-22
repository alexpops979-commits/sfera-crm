import {
  BarChart3,
  Briefcase,
  CheckSquare,
  Columns3,
  MessageSquare,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/page-header'
import { RoleMatrix } from '@/components/common/role-matrix'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Step {
  icon: LucideIcon
  title: string
  text: string
}

const STEPS: Step[] = [
  {
    icon: Settings,
    title: 'Настройте компанию',
    text: 'Укажите название, пригласите сотрудников и выберите роли: администратор, менеджер или сотрудник.',
  },
  {
    icon: Users,
    title: 'Заведите клиента',
    text: 'Добавьте контакт, телефон и источник. Поиск и фильтры помогут быстро найти нужную карточку.',
  },
  {
    icon: Briefcase,
    title: 'Создайте сделку',
    text: 'Укажите сумму, ответственного и ожидаемую дату закрытия. Сделка появится в воронке.',
  },
  {
    icon: Columns3,
    title: 'Ведите воронку',
    text: 'Перетаскивайте карточки между этапами. Суммы колонок и метрики дашборда пересчитываются сразу.',
  },
  {
    icon: MessageSquare,
    title: 'Фиксируйте общение',
    text: 'Звонки, письма и встречи сохраняются в истории клиента. Ставьте задачи на следующий шаг.',
  },
  {
    icon: BarChart3,
    title: 'Смотрите результат',
    text: 'Дашборд покажет выручку, win rate, активную воронку и лучших менеджеров за период.',
  },
]

export function GuidePage() {
  return (
    <>
      <PageHeader
        title="Как работать в Сфере"
        description="Короткий сценарий для команды и клиентов. Данные — пример, их можно менять"
        actions={<Badge variant="outline">5 минут на освоение</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon

          return (
            <Card key={step.title} className="p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="size-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                      Шаг {index + 1}
                    </span>
                  </div>
                  <h2 className="mt-1 text-[14px] font-semibold tracking-[-0.01em]">{step.title}</h2>
                </div>
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">{step.text}</p>
            </Card>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Кто что может</CardTitle>
            <CardDescription>Права по ролям внутри одной компании</CardDescription>
          </CardHeader>
          <CardContent>
            <RoleMatrix />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Полезные мелочи</CardTitle>
            <CardDescription>Ускоряют ежедневную работу</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-[12.5px] text-slate-600">
            <div className="flex items-start gap-2.5">
              <kbd className="rounded border bg-secondary px-1.5 py-0.5 text-[10.5px] font-medium whitespace-nowrap">
                Ctrl K
              </kbd>
              <span>Быстрый переход к поиску клиентов, сделок и задач.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Columns3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>Карточку сделки можно перетащить в другой этап прямо на доске.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckSquare className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>Задачи группируются: просроченные, сегодня, неделя и позже.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Users className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>Карточка клиента собирает сделки, историю и задачи в одном окне.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
        <div>
          <div className="text-[13.5px] font-semibold">Готовы попробовать?</div>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Откройте воронку, перетащите сделку и посмотрите, как изменится дашборд.
          </p>
        </div>
        <Button asChild>
          <Link to="/pipeline">Перейти в воронку</Link>
        </Button>
      </Card>
    </>
  )
}
