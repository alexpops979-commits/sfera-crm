import { chromium } from 'playwright-core'

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } })
const errors = []

page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text())
})
page.on('pageerror', (error) => errors.push(String(error)))

await page.goto('http://localhost:5173/clients', { waitUntil: 'networkidle' })
await page.getByText('Автомойка «Блеск»').first().click()
await page.waitForTimeout(500)
await page.screenshot({ path: 'shots/demo-client-sheet.png' })
await page.keyboard.press('Escape')
await page.waitForTimeout(300)

await page.goto('http://localhost:5173/pipeline', { waitUntil: 'networkidle' })
await page.getByText('Лендинг для автомойки').first().click()
await page.waitForTimeout(500)
await page.screenshot({ path: 'shots/demo-deal-sheet.png' })
await page.keyboard.press('Escape')
await page.waitForTimeout(300)

const card = page.getByText('Лендинг для автомойки').first()
const column = page.getByText('Контакт', { exact: true }).first()
await card.dragTo(column)
await page.waitForTimeout(700)
const toast = await page.getByText(/Сделка перемещена/).count()
await page.screenshot({ path: 'shots/demo-pipeline-after-drag.png' })

console.log(JSON.stringify({ errors, toast }, null, 2))
await browser.close()
