import { formatDate, formatPercent, ROLE_LABELS } from '@crm/shared'
import { Building2, CalendarDays, ShieldCheck, Users } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { UserChip } from '@/components/common/user-chip'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDemo } from '@/demo/store'

export function SettingsPage() {
  const { company, stages, users, currentUser } = useDemo()

  return (
    <>
      <PageHeader
        title="Настройки"
        description="Компания, воронка продаж и профиль пользователя"
        actions={<Badge variant="outline">Редактирование — после подключения API</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Компания</CardTitle>
              <CardDescription>Основные данные рабочего пространства</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border bg-secondary/30 px-3.5 py-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary">
                  <Building2 className="size-4" />
                </span>
                <div>
                  <div className="text-[13.5px] font-medium">{company.name}</div>
                  <div className="text-[11.5px] text-muted-foreground">{company.domain}</div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2.5 text-[12.5px] text-slate-600">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  Создана {formatDate(company.createdAt)}
                </div>
                <div className="flex items-center gap-2.5 text-[12.5px] text-slate-600">
                  <Users className="size-4 text-muted-foreground" />
                  {company.employees} сотрудников
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Этапы воронки</CardTitle>
              <CardDescription>
                Название, цвет и вероятность настраиваются администратором
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {stages.map((stage, index) => (
                <div
                  key={stage.id}
                  className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
                >
                  <span className="w-4 text-[11px] tabular-nums text-muted-foreground">
                    {index + 1}
                  </span>
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="flex-1 text-[13px] font-medium">{stage.name}</span>
                  <span className="text-[11.5px] text-muted-foreground">
                    {formatPercent(stage.probability)}
                  </span>
                  <Badge
                    variant={stage.isWon ? 'success' : stage.isLost ? 'destructive' : 'secondary'}
                  >
                    {stage.isWon ? 'Успех' : stage.isLost ? 'Проигрыш' : 'В работе'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Профиль</CardTitle>
              <CardDescription>Ваша учётная запись</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <UserChip user={currentUser} className="flex-1" showPosition />
                <Badge>{ROLE_LABELS[currentUser.role]}</Badge>
              </div>
              <div className="space-y-2 text-[12.5px] text-slate-600">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Email</span>
                  <span className="truncate">{currentUser.email}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Должность</span>
                  <span>{currentUser.position}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Безопасность</CardTitle>
              <CardDescription>Доступ и защита аккаунта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2.5 rounded-lg border bg-secondary/30 px-3 py-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                  Двухфакторная аутентификация и смена пароля появятся вместе с авторизацией.
                </p>
              </div>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Сотрудников</span>
                  <span>{users.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Компаний</span>
                  <span>1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Изоляция данных</span>
                  <span className="font-medium text-emerald-700">включена</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
