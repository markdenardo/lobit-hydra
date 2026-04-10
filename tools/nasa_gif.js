#!/usr/bin/env node
// nasa_gif.js — Terminal tool for finding NASA imagery for live event use
// Downloads are rendered as MP4 and saved to the project library.
//
// Usage:
//   node nasa_gif.js search <query>           Search NASA image/video library
//   node nasa_gif.js apod                     Get today's Astronomy Picture of the Day
//   node nasa_gif.js apod <YYYY-MM-DD>        Get APOD for specific date
//   node nasa_gif.js download <url> <name>    Download + render to library as <name>.mp4
//   node nasa_gif.js random                   Random space image (great for VJ drops)
//   node nasa_gif.js list                     Show all videos in the library
//
// API key: uses DEMO_KEY (1000 req/day, 30/hr). Set NASA_API_KEY env var for more.

import { createWriteStream, existsSync, mkdirSync, rmSync } from 'fs'
import { pipeline } from 'stream/promises'
import https from 'https'
import http from 'http'
import path from 'path'
import { tmpdir } from 'os'
import { fileURLToPath } from 'url'
import {
  buildSearchUrl,
  buildApodUrl,
  randomApodDate,
  parseSearchItems,
  extractApodAssetUrl,
  formatApodFilename,
  extractPreviewUrl,
} from './nasa-core.js'
import { saveToLibrary, readIndex } from './library.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY'

// ── helpers ───────────────────────────────────────────────────────────────────

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(new Error(`JSON parse failed: ${e.message}\n${data.slice(0, 200)}`)) }
      })
    }).on('error', reject)
  })
}

function downloadToPath(url, destPath) {
  const dir = path.dirname(destPath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadToPath(res.headers.location, destPath).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
      const writer = createWriteStream(destPath)
      pipeline(res, writer).then(() => resolve(destPath)).catch(reject)
    }).on('error', reject)
  })
}

function printDivider() { console.log('─'.repeat(60)) }

function printItem(item, idx) {
  const data = item.data?.[0] ?? {}
  const mediaType = data.media_type || 'image'
  const preview = extractPreviewUrl(item) ?? '(no preview)'

  printDivider()
  console.log(`[${idx + 1}] ${data.title || 'Untitled'}`)
  console.log(`    Type: ${mediaType} | Date: ${data.date_created?.slice(0, 10) || 'unknown'}`)
  console.log(`    ${(data.description || '').slice(0, 120).replace(/\n/g, ' ')}...`)
  console.log(`    Preview: ${preview}`)
  console.log(`    NASA ID: ${data.nasa_id || 'n/a'}`)
}

// ── commands ──────────────────────────────────────────────────────────────────

async function search(query, mediaType = '') {
  const url = buildSearchUrl(query, mediaType)
  console.log(`\nSearching NASA library for: "${query}"\n`)

  const data = await fetchJSON(url)
  const items = parseSearchItems(data)

  if (!items.length) { console.log('No results found.'); return }

  items.forEach((item, idx) => printItem(item, idx))
  printDivider()
  console.log(`\n${items.length} results.`)
  console.log(`Add to library: node nasa_gif.js download <url> <name>`)
}

async function apod(dateStr) {
  const url = buildApodUrl(dateStr, NASA_API_KEY)
  console.log(`\nFetching APOD${dateStr ? ` for ${dateStr}` : ' (today)'}...\n`)

  const data = await fetchJSON(url)
  const assetUrl = extractApodAssetUrl(data)
  const suggestedName = formatApodFilename(data).replace(/\.[^.]+$/, '')

  printDivider()
  console.log(`Title: ${data.title}`)
  console.log(`Date:  ${data.date}`)
  console.log(`Type:  ${data.media_type}`)
  console.log(`URL:   ${assetUrl}`)
  if (data.thumbnail_url) console.log(`Thumb: ${data.thumbnail_url}`)
  printDivider()
  console.log(`\n${data.explanation?.slice(0, 300)}...\n`)
  console.log(`Add to library: node nasa_gif.js download "${assetUrl}" "${suggestedName}"`)
}

async function random() {
  const dateStr = randomApodDate()
  console.log(`Random APOD date: ${dateStr}`)
  await apod(dateStr)
}

async function download(url, name) {
  if (!url || !name) {
    console.error('Usage: node nasa_gif.js download <url> <name>')
    console.error('  name: library entry name (no extension) — used in initVideo()')
    process.exit(1)
  }

  const rawExt = path.extname(url.split('?')[0]).toLowerCase() || '.jpg'
  const tmpPath = path.join(tmpdir(), `lobit_${Date.now()}${rawExt}`)

  console.log(`\nDownloading...`)
  await downloadToPath(url, tmpPath)

  console.log(`Rendering as MP4 → library...`)
  const dest = await saveToLibrary(tmpPath, name, { source: url })
  rmSync(tmpPath, { force: true })

  console.log(`\nSaved: ${dest}`)
  console.log(`Hydra: initVideo('${name}')`)
}

async function list() {
  const entries = readIndex()
  if (!entries.length) {
    console.log('\nLibrary is empty.')
    console.log('Add a video: node nasa_gif.js download <url> <name>\n')
    return
  }

  printDivider()
  entries.forEach((e, i) => {
    const name = e.filename.replace(/\.mp4$/, '')
    console.log(`[${i}] ${name}`)
    if (e.added) console.log(`    Added: ${e.added.slice(0, 10)}`)
    if (e.source) console.log(`    ${e.source.slice(0, 72)}`)
  })
  printDivider()
  console.log(`\n${entries.length} video${entries.length === 1 ? '' : 's'} in library`)
  console.log(`Hydra: initVideo('name')  — see tools/init_video.js\n`)
}

// ── main ──────────────────────────────────────────────────────────────────────

const [,, cmd, ...args] = process.argv

switch (cmd) {
  case 'search':
    await search(args.join(' ') || 'nebula')
    break
  case 'apod':
    await apod(args[0])
    break
  case 'random':
    await random()
    break
  case 'download':
    await download(args[0], args[1])
    break
  case 'list':
    await list()
    break
  case 'gifs':
  case 'gif':
    await search(args.join(' ') || 'space', 'video')
    break
  default:
    console.log(`
lobit-hydra :: NASA image tool

  node nasa_gif.js search <query>           Search NASA image library
  node nasa_gif.js gif <query>              Search NASA video/animation library
  node nasa_gif.js apod                     Today's Astronomy Picture of the Day
  node nasa_gif.js apod <YYYY-MM-DD>        APOD for a specific date
  node nasa_gif.js random                   Random space image (random APOD)
  node nasa_gif.js download <url> <name>    Download + render to library as <name>.mp4
  node nasa_gif.js list                     List all videos in the library

Set NASA_API_KEY env var to use your own key (default: DEMO_KEY, 30 req/hr).
Start library server:  npm run library:serve  → http://localhost:3001
Hydra usage:           initVideo('name')      — see tools/init_video.js
`)
}
