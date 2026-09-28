#!/usr/bin/env node
// deck_server.js — static server for the browser-based Hydra deck (deck/)
// Serves deck/, sketches/, and the local hydra-synth bundle on port 8080.
// The video library is served separately by library_server.js (port 3001) —
// the deck fetches that directly (CORS is already enabled there).
//
// Usage: npm run deck  (or: node tools/deck_server.js)

import { createReadStream, existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { createServer } from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SKETCH_ROOT = path.join(ROOT, 'sketches')
const CATEGORIES = ['chiptune', 'techno', 'jungle_idm']
const PORT = 8088

const MIME = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
}

function listSketches() {
  const out = []
  for (const category of CATEGORIES) {
    const dir = path.join(SKETCH_ROOT, category)
    if (!existsSync(dir)) continue
    for (const file of readdirSync(dir).filter(f => f.endsWith('.js')).sort()) {
      const firstLine = readFileSync(path.join(dir, file), 'utf8').split('\n')[0]
      out.push({
        category,
        file,
        title: firstLine.replace(/^\/\/\s*/, '').trim() || file,
        path: `/sketches/${category}/${file}`,
      })
    }
  }
  return out
}

createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0])

  if (urlPath === '/api/sketches') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(listSketches()))
    return
  }

  const relPath = urlPath === '/' ? '/deck/index.html' : urlPath
  const filePath = path.join(ROOT, path.normalize(relPath))

  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    res.writeHead(403); res.end(); return
  }
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    res.writeHead(404); res.end('Not found'); return
  }

  const ext = path.extname(filePath).toLowerCase()
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
  createReadStream(filePath).pipe(res)
}).listen(PORT, () => {
  console.log(`\nHydra deck → http://localhost:${PORT}/`)
  console.log(`Serving repo root: ${ROOT}`)
  console.log(`Make sure the video library server is also running: npm run library:serve\n`)
})
