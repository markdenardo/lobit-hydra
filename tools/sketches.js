// sketches.js — Sketch catalog. Scans sketches/ and returns metadata
// (category, file, title, path). Imported by library_server.js (HTTP)
// and list_sketches.js (CLI) so both stay in sync with one source of truth.

import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const SKETCH_DIR = path.resolve(__dirname, '../sketches')
export const SKETCH_CATEGORIES = ['chiptune', 'techno', 'jungle_idm']

export function listSketches() {
  const out = []
  for (const category of SKETCH_CATEGORIES) {
    const dir = path.join(SKETCH_DIR, category)
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
