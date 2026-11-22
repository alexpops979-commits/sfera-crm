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

# 4. База данных (кластер в %USERPROFILE%\.devtools\pgdata, порт 55432)
npm run db:start

# 5. Разработка: API :3000 + Web :5173
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:3000/api/v1/health
- Swagger: http://localhost:3000/docs
- PostgreSQL: `localhost:55432` (базы `crm_dev`, `crm_test`, `crm_shadow`)

> Порт 55432 выбран, чтобы не конфликтовать с уже установленной службой PostgreSQL на 5432.
> Если порт свободен, его можно изменить в `scripts/db.ps1` и `apps/api/.env`.

### Ярлык на рабочем столе

```bash
npm run shortcut   # создаёт «Сфера CRM» на рабочем столе
npm run app        # поднимает БД и серверы, открывает окно приложения
```

Ярлык запускает `scripts/app.ps1`: проверяет PostgreSQL, при необходимости поднимает
dev-серверы в фоне (логи в `.logs/`) и открывает приложение в Chrome/Edge в режиме
`--app` — отдельное окно без вкладок и адресной строки, со своим профилем
(`%LOCALAPPDATA%\SferaCRM\Profile`). Иконка — `assets/app.ico`, генерируется из
логотипа командой `npm run icon`.

### Особенность Windows с кириллицей в имени пользователя

`initdb` подставляет имя пользователя ОС в ANSI-кодировке. При кириллице в имени
(`C:\Users\Искандер`) UTF8-кластер не создаётся:
`invalid byte sequence for encoding "UTF8"`.

`scripts/db.ps1` обходит это автоматически: создаёт кластер в WIN1251 и рабочие базы
UTF8 (+ ICU `ru-RU`) из `template0`. На машинах с ASCII-именем пользователя скрипт
создаёт обычный UTF8-кластер.

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
| `npm run shot <url> <file> [w] [h]` | Скриншот страницы через системный Chrome |

## Переменные окружения

`apps/api/.env` — см. `apps/api/.env.example`. Ключевые:

- `DATABASE_URL` — строка подключения к PostgreSQL
- `SHADOW_DATABASE_URL` — база для `prisma migrate dev`
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
