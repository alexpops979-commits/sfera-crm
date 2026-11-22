# Сфера CRM

Multi-tenant CRM для небольших компаний: стоматологии, агентства, автосервисы, риелторы.

**Стек:** React · TypeScript · NestJS · PostgreSQL · Prisma · TanStack Query · Recharts

## Структура

```
CRM/
├─ apps/
│  ├─ api/            NestJS + Prisma (REST, /api/v1)
│  └─ web/            React + Vite + Tailwind + shadcn/ui
├─ packages/
│  └─ shared/         Общие типы, enum'ы, форматтеры (@crm/shared)
├─ scripts/           Локальные инструменты (PostgreSQL, Git)
└─ package.json       npm workspaces
```

## Быстрый старт

Требуется Node.js >= 22. Права администратора не нужны.

```bash
# 1. Портативные PostgreSQL 17 и Git в %USERPROFILE%\.devtools
powershell -ExecutionPolicy Bypass -File scripts/setup-tools.ps1

# 2. Зависимости (соберёт @crm/shared)
npm install

# 3. Переменные окружения
copy apps\api\.env.example apps\api\.env

# 4. База данных (создаст кластер, crm_dev и crm_test)
npm run db:start

# 5. Разработка: API :3000 + Web :5173
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:3000/api/v1/health
- Swagger: http://localhost:3000/docs

## Команды

| Команда | Назначение |
| --- | --- |
| `npm run dev` | API + Web + watch `@crm/shared` |
| `npm run build` | Сборка всех пакетов |
| `npm run lint` | ESLint по монорепо |
| `npm run typecheck` | Проверка типов во всех пакетах |
| `npm test` | Тесты API (Jest) |
| `npm run db:start` / `db:stop` | Локальный PostgreSQL |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | Демо-данные |
| `npm run db:studio` | Prisma Studio |

## Переменные окружения

`apps/api/.env` — см. `apps/api/.env.example`. Ключевые:

- `DATABASE_URL` — строка подключения к PostgreSQL
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — не короче 32 символов
- `WEB_ORIGIN` — origin фронтенда для CORS

## Этапы

- [x] **0. Фундамент** — монорепо, PostgreSQL, каркас API и UI
- [ ] 1. Схема данных, аутентификация, multi-tenancy, инвайты
- [ ] 2. Клиенты: CRUD, поиск, фильтры, пагинация
- [ ] 3. Сделки и воронка (Kanban)
- [ ] 4. RBAC и управление сотрудниками
- [ ] 5. Дашборд и графики
- [ ] 6. Коммуникации, задачи и напоминания
- [ ] 7. Экспорт CSV / Excel
- [ ] 8. Журнал действий (audit log)
- [ ] 9. Интеграционные тесты
- [ ] 10. Деплой SaaS-версии
