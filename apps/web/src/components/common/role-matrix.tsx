import { ROLE_LABELS } from '@crm/shared'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

const ROLES = ['ADMIN', 'MANAGER', 'EMPLOYEE'] as const

interface MatrixRow {
  action: string
  access: Record<(typeof ROLES)[number], boolean>
}

const ROWS: MatrixRow[] = [
  { action: 'Дашборд и аналитика', access: { ADMIN: true, MANAGER: true, EMPLOYEE: true } },
  { action: 'Клиенты: создание и редактирование', access: { ADMIN: true, MANAGER: true, EMPLOYEE: false } },
  { action: 'Сделки: все сделки компании', access: { ADMIN: true, MANAGER: true, EMPLOYEE: false } },
  { action: 'Сделки: только свои', access: { ADMIN: true, MANAGER: false, EMPLOYEE: true } },
  { action: 'Задачи команды', access: { ADMIN: true, MANAGER: true, EMPLOYEE: false } },
  { action: 'Экспорт в CSV / Excel', access: { ADMIN: true, MANAGER: true, EMPLOYEE: false } },
  { action: 'Сотрудники и роли', access: { ADMIN: true, MANAGER: false, EMPLOYEE: false } },
  { action: 'Журнал действий', access: { ADMIN: true, MANAGER: false, EMPLOYEE: false } },
]

export function RoleMatrix() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left">
        <thead>
          <tr className="border-b text-[10.5px] tracking-[0.06em] text-muted-foreground uppercase">
            <th className="py-2 pr-3 font-medium">Действие</th>
            {ROLES.map((role) => (
              <th key={role} className="w-[110px] px-2 py-2 text-center font-medium">
                {ROLE_LABELS[role]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {ROWS.map((row) => (
            <tr key={row.action}>
              <td className="py-2.5 pr-3 text-[12.5px] text-slate-600">{row.action}</td>
              {ROLES.map((role) => (
                <td key={role} className="px-2 py-2.5 text-center">
                  {row.access[role] ? (
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  ) : (
                    <span
                      className={cn(
                        'inline-flex size-5 items-center justify-center rounded-full bg-secondary text-muted-foreground/60',
                      )}
                    >
                      <Minus className="size-3" />
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
