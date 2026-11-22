import type { Role } from '@crm/shared'

export type ClientStatus = 'LEAD' | 'CONTACT' | 'CUSTOMER' | 'ARCHIVE'
export type ActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE'
export type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH'
export type TaskStatus = 'OPEN' | 'DONE'

export interface DemoCompany {
  name: string
  domain: string
  createdAt: string
  employees: number
}

export interface DemoUser {
  id: string
  name: string
  email: string
  role: Role
  position: string
}

export interface DemoClient {
  id: string
  name: string
  contactName: string
  contactPosition?: string
  email: string
  phone: string
  city: string
  source: string
  status: ClientStatus
  ownerId: string
  tags: string[]
  notes?: string
  createdAt: string
}

export interface DemoStage {
  id: string
  name: string
  color: string
  probability: number
  isWon: boolean
  isLost: boolean
}

export interface DemoDeal {
  id: string
  title: string
  clientId: string
  stageId: string
  amount: number
  ownerId: string
  expectedCloseAt: string
  closedAt?: string
  lostReason?: string
  createdAt: string
  tags?: string[]
}

export interface DemoActivity {
  id: string
  clientId: string
  dealId?: string
  type: ActivityType
  subject: string
  body?: string
  occurredAt: string
  authorId: string
}

export interface DemoTask {
  id: string
  title: string
  dueAt: string
  priority: TaskPriority
  status: TaskStatus
  assigneeId: string
  clientId?: string
  dealId?: string
  createdAt?: string
}

export interface DemoAuditEntry {
  id: string
  actorId: string
  action: string
  entity: 'CLIENT' | 'DEAL' | 'TASK' | 'USER' | 'EXPORT' | 'AUTH'
  entityLabel: string
  createdAt: string
}
