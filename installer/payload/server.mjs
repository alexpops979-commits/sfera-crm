import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'

const HOST = '127.0.0.1'
const PORT = Number(process.env.PORT ?? 4173)
const ROOT = path.join(import.meta.dirname, 'app')
const LOG_FILE = path.join(import.meta.dirname, 'server.log')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
}

function log(message) {
  try {
    fs.appendFileSync(LOG_FILE, `${new Date().toISOString()} ${message}\n`)
  } catch {
    // логи не должны ронять сервер
  }
}

function sendFile(response, filePath, status = 200) {
  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Not found')
      return
    }

    const extension = path.extname(filePath).toLowerCase()
    const isAsset = filePath.includes(`${path.sep}assets${path.sep}`)

    response.writeHead(status, {
      'Content-Type': MIME[extension] ?? 'application/octet-stream',
      'Content-Length': stats.size,
      'Cache-Control': isAsset ? 'public, max-age=31536000, immutable' : 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    })

    const stream = fs.createReadStream(filePath)
    stream.on('error', () => response.destroy())
    stream.pipe(response)
  })
}

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' })
    response.end()
    return
  }

  let pathname = '/'

  try {
    pathname = decodeURIComponent((request.url ?? '/').split('?')[0] ?? '/')
  } catch {
    response.writeHead(400)
    response.end('Bad request')
    return
  }

  const relative = pathname.replace(/\\/g, '/')
  const target = path.resolve(ROOT, `.${relative}`)

  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  const filePath = pathname === '/' ? path.join(ROOT, 'index.html') : target
  const hasExtension = Boolean(path.extname(filePath))

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(response, filePath)
      return
    }

    if (!hasExtension) {
      sendFile(response, path.join(ROOT, 'index.html'))
      return
    }

    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Not found')
  })
})

server.on('error', (error) => {
  log(`server error: ${error.message}`)
  process.exitCode = 1
})

process.on('uncaughtException', (error) => {
  log(`uncaught: ${error.stack ?? error.message}`)
})

server.listen(PORT, HOST, () => {
  log(`started on http://${HOST}:${PORT}`)
})
