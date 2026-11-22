/**
 * Скриншот страницы через системный Chrome (без скачивания браузеров).
 *
 *   node scripts/screenshot.mjs <url> <out.png> [width] [height] [--full]
 *
 * Пример: node scripts/screenshot.mjs http://localhost:5173/dashboard shots/dashboard.png 1440 900
 */
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-core'

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

const args = process.argv.slice(2)
const fullPage = args.includes('--full')
const [url = 'http://localhost:5173/dashboard', out = 'shots/page.png', width = '1440', height = '900'] =
  args.filter((arg) => arg !== '--full')

const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({
  viewport: { width: Number(width), height: Number(height) },
  deviceScaleFactor: 1,
})

const errors = []
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text())
})
page.on('pageerror', (error) => errors.push(String(error)))

await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1800)

const outPath = path.resolve(out)
fs.mkdirSync(path.dirname(outPath), { recursive: true })
await page.screenshot({ path: outPath, fullPage })

console.log(JSON.stringify({ url, out: outPath, fullPage, errors }, null, 2))
await browser.close()
