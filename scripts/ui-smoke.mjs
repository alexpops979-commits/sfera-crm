/**
 * UI smoke-проверка демо-интерфейса.
 *
 *   npm run smoke:ui        (нужен запущенный dev-сервер на :5173)
 *
 * Проверяет: все разделы открываются, пример данных помечен, клиента можно
 * создать и отредактировать, карточки и drag & drop работают, консоль чистая.
 */
import fs from 'node:fs'
import { chromium } from 'playwright-core'

const BASE_URL = process.env.APP_URL ?? 'http://localhost:5173'

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean)

const executablePath = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate))
if (!executablePath) {
  console.error('Chrome/Edge не найден. Укажите CHROME_PATH.')
  process.exit(1)
}

const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } })
const errors = []

page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text())
})
page.on('pageerror', (error) => errors.push(String(error)))

const routes = [
  ['/dashboard', 'Дашборд'],
  ['/pipeline', 'Воронка продаж'],
  ['/clients', 'Клиенты'],
  ['/deals', 'Сделки'],
  ['/tasks', 'Задачи'],
  ['/team', 'Команда'],
  ['/audit', 'Журнал действий'],
  ['/settings', 'Настройки'],
  ['/guide', 'Как работать в Сфере'],
]

const checks = []
let exampleNotice = 0

for (const [path, expected] of routes) {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' })
  const heading = ((await page.locator('h1').first().textContent()) ?? '').trim()
  checks.push({ path, heading, ok: heading.includes(expected) })
  if (path === '/dashboard') {
    exampleNotice = await page.getByText('Это пример данных').count()
  }
}

// Создание клиента
await page.goto(`${BASE_URL}/clients`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Добавить клиента' }).click()
await page.locator('#client-name').fill('Тестовая клиника «Пример»')
await page.getByRole('button', { name: 'Сохранить' }).click()
await page.waitForTimeout(450)
const createdClient = await page.getByText('Тестовая клиника «Пример»').count()

// Редактирование клиента
await page.getByText('Тестовая клиника «Пример»').first().click()
await page.waitForTimeout(350)
await page.getByRole('button', { name: 'Редактировать' }).click()
await page.waitForTimeout(350)
await page.locator('#client-name').fill('Тестовая клиника «Пример 2»')
await page.getByRole('button', { name: 'Сохранить' }).click()
await page.waitForTimeout(450)
const editedClient = await page.getByText('Тестовая клиника «Пример 2»').count()

// Карточка клиента и вкладка истории
await page.getByText('Автомойка «Блеск»').first().click()
await page.waitForTimeout(400)
const clientSheet = await page.getByRole('dialog').count()
const historyTab = await page.getByRole('button', { name: 'История' }).count()
await page.keyboard.press('Escape')
await page.waitForTimeout(250)

// Карточка сделки
await page.goto(`${BASE_URL}/pipeline`, { waitUntil: 'networkidle' })
await page.getByText('Лендинг для автомойки').first().click()
await page.waitForTimeout(350)
const dealSheet = await page.getByRole('dialog').count()
await page.keyboard.press('Escape')
await page.waitForTimeout(300)

// Drag & drop между этапами
await page
  .getByText('Лендинг для автомойки')
  .first()
  .dragTo(page.getByText('Контакт', { exact: true }).first())
await page.waitForTimeout(600)
const movedToast = await page.getByText(/Сделка перемещена/).count()

const failedRoutes = checks.filter((check) => !check.ok)
const passed =
  errors.length === 0 &&
  failedRoutes.length === 0 &&
  exampleNotice > 0 &&
  createdClient > 0 &&
  editedClient > 0 &&
  clientSheet > 0 &&
  historyTab > 0 &&
  dealSheet > 0 &&
  movedToast > 0

console.log(
  JSON.stringify(
    {
      passed,
      errors,
      routes: checks,
      exampleNotice,
      createdClient,
      editedClient,
      clientSheet,
      historyTab,
      dealSheet,
      movedToast,
    },
    null,
    2,
  ),
)

await browser.close()
if (!passed) process.exitCode = 1
