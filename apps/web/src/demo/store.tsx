import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  demoActivities,
  demoAudit,
  demoClients,
  demoCompany,
  demoDeals,
  demoStages,
  demoTasks,
  demoUsers,
} from './data'
import type {
  ClientStatus,
  DemoActivity,
  DemoAuditEntry,
  DemoClient,
  DemoCompany,
  DemoDeal,
  DemoStage,
  DemoTask,
  DemoUser,
} from './types'

interface DemoStore {
  company: DemoCompany
  users: DemoUser[]
  clients: DemoClient[]
  stages: DemoStage[]
  deals: DemoDeal[]
  activities: DemoActivity[]
  tasks: DemoTask[]
  audit: DemoAuditEntry[]
  currentUser: DemoUser
  moveDeal: (dealId: string, stageId: string) => void
  toggleTask: (taskId: string) => void
  setClientStatus: (clientId: string, status: ClientStatus) => void
  getUser: (id: string) => DemoUser | undefined
  getClient: (id: string) => DemoClient | undefined
  getStage: (id: string) => DemoStage | undefined
}

const DemoContext = createContext<DemoStore | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [deals, setDeals] = useState<DemoDeal[]>(demoDeals)
  const [tasks, setTasks] = useState<DemoTask[]>(demoTasks)
  const [clients, setClients] = useState<DemoClient[]>(demoClients)

  const moveDeal = useCallback((dealId: string, stageId: string) => {
    setDeals((current) =>
      current.map((deal) => {
        if (deal.id !== dealId) return deal
        const stage = demoStages.find((item) => item.id === stageId)
        const closed = Boolean(stage?.isWon || stage?.isLost)
        return {
          ...deal,
          stageId,
          closedAt: closed ? new Date().toISOString() : undefined,
          lostReason: stage?.isLost ? (deal.lostReason ?? 'Не указана') : undefined,
        }
      }),
    )
  }, [])

  const toggleTask = useCallback((taskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === 'OPEN' ? 'DONE' : 'OPEN' }
          : task,
      ),
    )
  }, [])

  const setClientStatus = useCallback((clientId: string, status: ClientStatus) => {
    setClients((current) =>
      current.map((client) => (client.id === clientId ? { ...client, status } : client)),
    )
  }, [])

  const value = useMemo<DemoStore>(
    () => ({
      company: demoCompany,
      users: demoUsers,
      clients,
      stages: demoStages,
      deals,
      activities: demoActivities,
      tasks,
      audit: demoAudit,
      currentUser: demoUsers[0],
      moveDeal,
      toggleTask,
      setClientStatus,
      getUser: (id) => demoUsers.find((user) => user.id === id),
      getClient: (id) => clients.find((client) => client.id === id),
      getStage: (id) => demoStages.find((stage) => stage.id === id),
    }),
    [clients, deals, tasks, moveDeal, toggleTask, setClientStatus],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo(): DemoStore {
  const context = useContext(DemoContext)
  if (!context) throw new Error('useDemo должен использоваться внутри DemoProvider')
  return context
}
