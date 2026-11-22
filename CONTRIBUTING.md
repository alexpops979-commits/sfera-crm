# Как участвовать в разработке

Спасибо за интерес к проекту! Сфера CRM — открытый проект, и мы рады любым
улучшениям: баг-репортам, документации, дизайну и коду.

## Требования

- Node.js 22 или новее
- npm 10+
- Windows 10/11 для локального PostgreSQL-скрипта (на Linux/macOS можно
  поднять PostgreSQL вручную и указать `DATABASE_URL`)

## Локальный запуск

```bash
npm install
copy apps\api\.env.example apps\api\.env   # macOS/Linux: cp
npm run db:start                            # локальный PostgreSQL на :55432
npm run dev                                 # API :3000 + Web :5173
```

Подробности и особенности Windows — в [README](README.md).

## Перед pull request

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run smoke:ui   # нужен запущенный dev-сервер
```

Все пять команд должны проходить без ошибок.

## Ветки и коммиты

- Ветка от `main`: `feat/global-search`, `fix/pipeline-drag`, `docs/readme`.
- Коммиты в стиле [Conventional Commits](https://www.conventionalcommits.org/ru/):
  - `feat: добавить глобальный поиск`
  - `fix: не терять сделку при отмене перетаскивания`
  - `test: покрыть метрики дашборда`
  - `docs: описать установщик`

## Код-стайл

- TypeScript strict, без `any` без необходимости.
- ESLint + Prettier: `npm run lint`, `npm run format`.
- Компоненты — в `apps/web/src/components`, страницы — в `pages`,
  переиспользуемая логика — в `demo` (до подключения API).
- Новые проверки добавляйте в Vitest (`*.test.ts`) или в `scripts/ui-smoke.mjs`.

## Архитектурные договорённости

- Сейчас UI работает на примере данных в `apps/web/src/demo`. При подключении API
  экраны должны ходить через TanStack Query, а не напрямую в `localStorage`.
- Мультитенантность: `companyId` берётся только из JWT, никогда из тела запроса.
- Роли: `ADMIN`, `MANAGER`, `EMPLOYEE`. Права проверяются на сервере.
- Всё, что меняет данные, должно попадать в журнал действий (этап 8).

## Что можно взять

Смотрите issues с метками `good first issue` и `help wanted`, а также раздел
«Дорожная карта» в README. Если хотите взяться за крупную задачу — напишите в
issue, чтобы мы не дублировали работу.

## Лицензия

Отправляя pull request, вы соглашаетесь, что ваш вклад распространяется под
лицензией [MIT](LICENSE).
