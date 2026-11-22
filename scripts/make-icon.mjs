/**
 * Рендерит логотип из apps/web/public/favicon.svg в assets/app.ico (256x256).
 * Использует системный Chrome/Edge через playwright-core, без скачивания браузеров.
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

const root = path.resolve(import.meta.dirname, '..')
const svg = fs.readFileSync(path.join(root, 'apps/web/public/favicon.svg'), 'utf8')
const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
const html = `<!doctype html><html><body style="margin:0;background:transparent">
<img src="${dataUrl}" width="256" height="256" style="display:block" alt="" />
</body></html>`

const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({
  viewport: { width: 256, height: 256 },
  deviceScaleFactor: 1,
})
await page.setContent(html, { waitUntil: 'load' })
const png = await page.screenshot({ omitBackground: true })
await browser.close()

// ICO с одной PNG-записью 256x256 (поддерживается Windows Vista+).
const ico = Buffer.alloc(22 + png.length)
ico.writeUInt16LE(0, 0) // reserved
ico.writeUInt16LE(1, 2) // type: icon
ico.writeUInt16LE(1, 4) // count
ico[6] = 0 // width 256
ico[7] = 0 // height 256
ico[8] = 0 // palette
ico[9] = 0 // reserved
ico.writeUInt16LE(1, 10) // planes
ico.writeUInt16LE(32, 12) // bit depth
ico.writeUInt32LE(png.length, 14)
ico.writeUInt32LE(22, 18)
png.copy(ico, 22)

const outPath = path.join(root, 'assets/app.ico')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, ico)
fs.writeFileSync(path.join(root, 'assets/app.png'), png)

console.log(JSON.stringify({ out: outPath, bytes: ico.length }, null, 2))
