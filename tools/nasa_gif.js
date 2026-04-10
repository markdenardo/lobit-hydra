#!/usr/bin/env node
// nasa_gif.js — Terminal tool for finding NASA imagery for live event use
// Uses NASA Images & Video Library API (no key required for basic use)
// and APOD (Astronomy Picture of the Day)
//
// Usage:
//   node nasa_gif.js search <query>           Search NASA image/video library
//   node nasa_gif.js apod                     Get today's Astronomy Picture of the Day
//   node nasa_gif.js apod <YYYY-MM-DD>        Get APOD for specific date
//   node nasa_gif.js download <url> <file>    Download an asset
//   node nasa_gif.js random                   Random space image (great for VJ drops)
//
// API key: uses DEMO_KEY (1000 req/day, 30/hr). Set NASA_API_KEY env var for more.

import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { pipeline } from 'stream/promises'
import https from 'https'
import http from 'http'
import path from 'path'
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

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DOWNLOAD_DIR = path.join(__dirname, 'downloads')
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

function downloadFile(url, dest) {
  if (!existsSync(DOWNLOAD_DIR)) mkdirSync(DOWNLOAD_DIR, { recursive: true })
  const filePath = path.join(DOWNLOAD_DIR, dest)
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
      const writer = createWriteStream(filePath)
      pipeline(res, writer).then(() => resolve(filePath)).catch(reject)
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

  if (!items.length) {
    console.log('No results found.')
    return
  }

  items.forEach((item, idx) => printItem(item, idx))
  printDivider()
  console.log(`\n${items.length} results. Download with: node nasa_gif.js download <url> <filename>`)
}

async function apod(dateStr) {
  const url = buildApodUrl(dateStr, NASA_API_KEY)
  console.log(`\nFetching APOD${dateStr ? ` for ${dateStr}` : ' (today)'}...\n`)

  const data = await fetchJSON(url)
  const assetUrl = extractApodAssetUrl(data)

  printDivider()
  console.log(`Title: ${data.title}`)
  console.log(`Date:  ${data.date}`)
  console.log(`Type:  ${data.media_type}`)
  console.log(`URL:   ${assetUrl}`)
  if (data.thumbnail_url) console.log(`Thumb: ${data.thumbnail_url}`)
  printDivider()
  console.log(`\n${data.explanation?.slice(0, 300)}...\n`)
  console.log(`Download: node nasa_gif.js download "${assetUrl}" "${formatApodFilename(data)}"`)
}

async function random() {
  const dateStr = randomApodDate()
  console.log(`Random APOD date: ${dateStr}`)
  await apod(dateStr)
}

async function download(url, filename) {
  if (!url || !filename) {
    console.error('Usage: node nasa_gif.js download <url> <filename>')
    process.exit(1)
  }
  console.log(`Downloading ${filename}...`)
  const dest = await downloadFile(url, filename)
  console.log(`Saved to: ${dest}`)
}

async function searchGifs(query) {
  // NASA doesn't have a GIF endpoint, but their video library has animations.
  // This searches for videos + images tagged with the query.
  console.log('Note: NASA Images API does not index GIFs directly.')
  console.log('Searching for videos and animated content instead.\n')
  await search(query, 'video')
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
  case 'gifs':
  case 'gif':
    await searchGifs(args.join(' ') || 'space')
    break
  default:
    console.log(`
lobit-hydra :: NASA image tool

  node nasa_gif.js search <query>           Search NASA image library
  node nasa_gif.js gif <query>              Search NASA video/animation library
  node nasa_gif.js apod                     Today's Astronomy Picture of the Day
  node nasa_gif.js apod <YYYY-MM-DD>        APOD for a specific date
  node nasa_gif.js random                   Random space image (random APOD)
  node nasa_gif.js download <url> <file>    Download an asset to ./downloads/

Set NASA_API_KEY env var to use your own key (default: DEMO_KEY, 30 req/hr).
`)
}
