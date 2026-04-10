/**
 * library.js — Project video library management.
 * Handles saving downloads as MP4, indexing, and conversion via ffmpeg.
 * Imported by nasa_gif.js (CLI) and library_server.js.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const LIBRARY_DIR = path.resolve(__dirname, '../library')
const INDEX_PATH = path.join(LIBRARY_DIR, 'index.json')

const STILL_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov', '.avi', '.mkv'])

export function ensureLibrary() {
  if (!existsSync(LIBRARY_DIR)) mkdirSync(LIBRARY_DIR, { recursive: true })
}

export function readIndex() {
  if (!existsSync(INDEX_PATH)) return []
  try { return JSON.parse(readFileSync(INDEX_PATH, 'utf8')) }
  catch { return [] }
}

function writeIndex(entries) {
  ensureLibrary()
  writeFileSync(INDEX_PATH, JSON.stringify(entries, null, 2))
}

export function addEntry(entry) {
  const entries = readIndex()
  const i = entries.findIndex(e => e.filename === entry.filename)
  if (i >= 0) entries[i] = entry
  else entries.push(entry)
  writeIndex(entries)
}

/**
 * Convert a file to MP4 using ffmpeg.
 * - Still image (.jpg/.png/etc)  → 5-second looping MP4
 * - GIF                          → MP4 (preserves animation timing)
 * - Other video                  → re-encode to H.264 MP4
 * @param {string} inputPath
 * @param {string} outputPath
 * @returns {Promise<void>}
 */
export function convertToMp4(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase()
  let args

  if (STILL_EXTS.has(ext)) {
    args = [
      '-loop', '1', '-i', inputPath,
      '-t', '5',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-y', outputPath,
    ]
  } else if (ext === '.gif' || VIDEO_EXTS.has(ext)) {
    args = [
      '-i', inputPath,
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-y', outputPath,
    ]
  } else {
    return Promise.reject(new Error(`Unsupported file type: ${ext}`))
  }

  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] })
    let stderr = ''
    proc.stderr.on('data', d => { stderr += d })
    proc.on('close', code => code === 0
      ? resolve()
      : reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-300)}`))
    )
    proc.on('error', e => reject(
      new Error(`ffmpeg not found — install with: brew install ffmpeg\n${e.message}`)
    ))
  })
}

/**
 * Save a downloaded file to the library as MP4.
 * Converts if the source is not already an MP4. Updates library/index.json.
 *
 * @param {string} srcPath   - path to the source file (temp download)
 * @param {string} basename  - desired name in the library (no extension)
 * @param {object} meta      - extra metadata stored in index.json
 * @returns {Promise<string>} - absolute path to the saved MP4
 */
export async function saveToLibrary(srcPath, basename, meta = {}) {
  ensureLibrary()
  const filename = `${basename}.mp4`
  const destPath = path.join(LIBRARY_DIR, filename)
  const ext = path.extname(srcPath).toLowerCase()

  if (ext === '.mp4') {
    copyFileSync(srcPath, destPath)
  } else {
    await convertToMp4(srcPath, destPath)
  }

  addEntry({ filename, added: new Date().toISOString(), ...meta })
  return destPath
}
