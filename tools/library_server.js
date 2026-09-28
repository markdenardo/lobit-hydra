#!/usr/bin/env node
// library_server.js — Static file server for library/ on port 3001
// Serves MP4s with CORS headers so Hydra's initVideo() can load them.
//
// Usage: npm run library:serve  (or: node tools/library_server.js)

import { createReadStream, statSync, existsSync, readdirSync } from 'fs'
import { createServer } from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LIBRARY_DIR = path.resolve(__dirname, '../library')
const PORT = 3001

const MIME = {
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.json': 'application/json',
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  }
}

createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders())
    res.end()
    return
  }

  // GET / → list available MP4s
  if (req.url === '/' || req.url === '') {
    const files = existsSync(LIBRARY_DIR)
      ? readdirSync(LIBRARY_DIR).filter(f => f.endsWith('.mp4')).sort()
      : []
    res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders() })
    res.end(JSON.stringify(files, null, 2))
    return
  }

  // Prevent path traversal
  const filePath = path.join(LIBRARY_DIR, path.normalize(req.url).replace(/^\/+/, ''))
  if (!filePath.startsWith(LIBRARY_DIR + path.sep) && filePath !== LIBRARY_DIR) {
    res.writeHead(403); res.end(); return
  }

  if (!existsSync(filePath)) {
    res.writeHead(404, corsHeaders())
    res.end('Not found')
    return
  }

  const ext = path.extname(filePath).toLowerCase()
  const stat = statSync(filePath)

  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Content-Length': stat.size,
    ...corsHeaders(),
  })

  createReadStream(filePath).pipe(res)
}).listen(PORT, () => {
  console.log(`\nLibrary server → http://localhost:${PORT}/`)
  console.log(`Serving: ${LIBRARY_DIR}`)
  console.log(`\nHydra usage: initVideo('name')  — see tools/init_video.js\n`)
})
