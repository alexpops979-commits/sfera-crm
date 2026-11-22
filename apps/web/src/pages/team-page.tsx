import { formatMoney, formatPercent, ROLE_LABELS } from '@crm/shared'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/common/page-header'
import { RoleMatrix } from '@/components/common/role-matrix'
import { UserChip } from '@/components/common/user-chip'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDemo } from '@/demo/store'

export function TeamPage() {
  const { users, deals, stages } = useDemo()

  const wonIds = new Set(stages.filter((stage) => stage.isWon).map((stage) => stage.id))
  const lostIds = new Set(stages.filter((stage) => stage.isLost).map((stage) => stage.id))

  return (
    <>
      <PageHeader
        title="Команда"
        description={`${users.length} сотрудников · роли и нагрузка`}
        actions={<Badge variant="outline">Приглашения — после подключения API</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => {
          const userDeals = deals.filter((deal) => deal.ownerId === user.id)
          const openDeals = userDeals.filter(
            (deal) => !wonIds.has(deal.stageId) && !lostIds.has(deal.stageId),
          ).length
          const wonDeals = userDeals.filter((deal) => wonIds.has(deal.stageId))
          const lostDeals = userDeals.filter((deal) => lostIds.has(deal.stageId))
          const revenue = wonDeals.reduce((total, deal) => total + deal.amount, 0)
          const winRate =
            wonDeals.length + lostDeals.length > 0
              ? (wonDeals.length / (wonDeals.length + lostDeals.length)) * 100
              : 0

          return (
            <Card key={user.id} className="p-5">
              <div className="flex items-start gap-3">
                <UserChip user={user} showPosition className="flex-1" />
                <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                  {ROLE_LABELS[user.role]}
                </Badge>
              </div>

              <div className="mt-1.5 truncate pl-8 text-[11.5px] text-muted-foreground">
                {user.email}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-3 text-center">
                <div>
                  <div className="text-[16px] font-semibold">{openDeals}</div>
                  <div className="text-[10.5px] text-muted-foreground">в работе</div>
                </div>
                <div>
                  <div className="text-[16px] font-semibold">{formatMoney(revenue)}</div>
                  <div className="text-[10.5px] text-muted-foreground">выручка</div>
                </div>
                <div>
                  <div className="text-[16px] font-semibold">{formatPercent(winRate)}</div>
                  <div className="text-[10.5px] text-muted-foreground">win rate</div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Права доступа</CardTitle>
          <CardDescription>Что может каждый сотрудник внутри компании</CardDescription>
        </CardHeader>
        <CardContent>
          <RoleMatrix />
        </CardContent>
      </Card>
    </>
  )
}
