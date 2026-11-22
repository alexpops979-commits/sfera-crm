import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
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
  ClientInput,
  ClientStatus,
  DealInput,
  DemoActivity,
  DemoAuditEntry,
  DemoClient,
  DemoCompany,
  DemoDeal,
  DemoStage,
  DemoTask,
  DemoUser,
  TaskInput,
} from './types'
import { changeClientStatus, moveDealToStage, toggleTaskStatus, withStage } from './transitions'

/** Ключ локального сохранения примера. Меняйте версию при изменении структуры данных. */
const STORAGE_KEY = 'sfera-example-v1'

interface ExampleData {
  clients: DemoClient[]
  deals: DemoDeal[]
  tasks: DemoTask[]
}

const initialData: ExampleData = {
  clients: demoClients,
  deals: demoDeals,
  tasks: demoTasks,
}

function loadData(): ExampleData | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<ExampleData>
    if (
      !Array.isArray(parsed.clients) ||
      !Array.isArray(parsed.deals) ||
      !Array.isArray(parsed.tasks)
    ) {
      return null
    }

    return { clients: parsed.clients, deals: parsed.deals, tasks: parsed.tasks }
  } catch {
    return null
  }
}

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

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
  createClient: (input: ClientInput) => DemoClient
  updateClient: (id: string, input: Partial<ClientInput>) => void
  deleteClient: (id: string) => void
  createDeal: (input: DealInput) => DemoDeal
  updateDeal: (id: string, input: Partial<DealInput>) => void
  deleteDeal: (id: string) => void
  createTask: (input: TaskInput) => DemoTask
  updateTask: (id: string, input: Partial<TaskInput>) => void
  deleteTask: (id: string) => void
  resetExample: () => void
  getUser: (id: string) => DemoUser | undefined
  getClient: (id: string) => DemoClient | undefined
  getStage: (id: string) => DemoStage | undefined
}

const DemoContext = createContext<DemoStore | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ExampleData>(() => loadData() ?? initialData)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Приватный режим или переполнение — пример продолжит работать без сохранения.
    }
  }, [data])

  const moveDeal = useCallback((dealId: string, stageId: string) => {
    setData((current) => ({
      ...current,
      deals: moveDealToStage(current.deals, demoStages, dealId, stageId),
    }))
  }, [])

  const toggleTask = useCallback((taskId: string) => {
    setData((current) => ({ ...current, tasks: toggleTaskStatus(current.tasks, taskId) }))
  }, [])

  const setClientStatus = useCallback((clientId: string, status: ClientStatus) => {
    setData((current) => ({
      ...current,
      clients: changeClientStatus(current.clients, clientId, status),
    }))
  }, [])

  const createClient = useCallback((input: ClientInput) => {
    const client: DemoClient = {
      ...input,
      id: newId('client'),
      createdAt: new Date().toISOString(),
    }

    setData((current) => ({ ...current, clients: [client, ...current.clients] }))
    return client
  }, [])

  const updateClient = useCallback((id: string, input: Partial<ClientInput>) => {
    setData((current) => ({
      ...current,
      clients: current.clients.map((client) =>
        client.id === id ? { ...client, ...input } : client,
      ),
    }))
  }, [])

  const deleteClient = useCallback((id: string) => {
    setData((current) => ({
      clients: current.clients.filter((client) => client.id !== id),
      deals: current.deals.filter((deal) => deal.clientId !== id),
      tasks: current.tasks.filter((task) => task.clientId !== id),
    }))
  }, [])

  const createDeal = useCallback((input: DealInput) => {
    const deal = withStage(
      {
        ...input,
        id: newId('deal'),
        createdAt: new Date().toISOString(),
        tags: input.tags?.filter(Boolean),
      },
      input.stageId,
      demoStages,
    )

    setData((current) => ({ ...current, deals: [deal, ...current.deals] }))
    return deal
  }, [])

  const updateDeal = useCallback((id: string, input: Partial<DealInput>) => {
    setData((current) => ({
      ...current,
      deals: current.deals.map((deal) => {
        if (deal.id !== id) return deal

        const merged = {
          ...deal,
          ...input,
          tags: input.tags ? input.tags.filter(Boolean) : deal.tags,
        }

        return withStage(merged, merged.stageId, demoStages)
      }),
    }))
  }, [])

  const deleteDeal = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      deals: current.deals.filter((deal) => deal.id !== id),
      tasks: current.tasks.map((task) =>
        task.dealId === id ? { ...task, dealId: undefined } : task,
      ),
    }))
  }, [])

  const createTask = useCallback((input: TaskInput) => {
    const task: DemoTask = {
      ...input,
      id: newId('task'),
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    }

    setData((current) => ({ ...current, tasks: [task, ...current.tasks] }))
    return task
  }, [])

  const updateTask = useCallback((id: string, input: Partial<TaskInput>) => {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === id ? { ...task, ...input } : task)),
    }))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== id),
    }))
  }, [])

  const resetExample = useCallback(() => {
    setData({
      clients: demoClients,
      deals: demoDeals,
      tasks: demoTasks,
    })
  }, [])

  const value = useMemo<DemoStore>(
    () => ({
      company: demoCompany,
      users: demoUsers,
      clients: data.clients,
      stages: demoStages,
      deals: data.deals,
      activities: demoActivities,
      tasks: data.tasks,
      audit: demoAudit,
      currentUser: demoUsers[0],
      moveDeal,
      toggleTask,
      setClientStatus,
      createClient,
      updateClient,
      deleteClient,
      createDeal,
      updateDeal,
      deleteDeal,
      createTask,
      updateTask,
      deleteTask,
      resetExample,
      getUser: (id) => demoUsers.find((user) => user.id === id),
      getClient: (id) => data.clients.find((client) => client.id === id),
      getStage: (id) => demoStages.find((stage) => stage.id === id),
    }),
    [
      data,
      moveDeal,
      toggleTask,
      setClientStatus,
      createClient,
      updateClient,
      deleteClient,
      createDeal,
      updateDeal,
      deleteDeal,
      createTask,
      updateTask,
      deleteTask,
      resetExample,
    ],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo(): DemoStore {
  const context = useContext(DemoContext)
  if (!context) throw new Error('useDemo должен использоваться внутри DemoProvider')
  return context
}
