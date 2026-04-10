/**
 * nasa-core.js — Pure URL building and response parsing for the NASA Images API.
 * No side effects, no I/O. Imported by both nasa_gif.js (CLI) and the test suite.
 */

export const NASA_IMAGES_BASE = 'https://images-api.nasa.gov'
export const NASA_APOD_BASE   = 'https://api.nasa.gov/planetary/apod'

// ── URL builders ──────────────────────────────────────────────────────────────

/**
 * Build a NASA Images Library search URL.
 * @param {string} query
 * @param {string} [mediaType] - 'image' | 'video' | '' (any)
 * @returns {string}
 */
export function buildSearchUrl(query, mediaType = '') {
  const typeParam = mediaType ? `&media_type=${mediaType}` : ''
  return `${NASA_IMAGES_BASE}/search?q=${encodeURIComponent(query)}${typeParam}&page_size=12`
}

/**
 * Build a NASA APOD URL.
 * @param {string} [dateStr] - ISO date string YYYY-MM-DD, or '' for today
 * @param {string} [apiKey]
 * @returns {string}
 */
export function buildApodUrl(dateStr = '', apiKey = 'DEMO_KEY') {
  const dateParam = dateStr ? `&date=${dateStr}` : ''
  return `${NASA_APOD_BASE}?api_key=${apiKey}${dateParam}`
}

// ── Response parsers ──────────────────────────────────────────────────────────

/**
 * Extract items array from a NASA Images search response.
 * @param {object} data - raw API response
 * @returns {Array}
 */
export function parseSearchItems(data) {
  return data?.collection?.items ?? []
}

/**
 * Extract the preview URL from a single search result item.
 * @param {object} item
 * @returns {string|null}
 */
export function extractPreviewUrl(item) {
  const links = item?.links ?? []
  return links.find(l => l.rel === 'preview')?.href ?? links[0]?.href ?? null
}

/**
 * Extract the primary asset URL from an APOD response.
 * Prefers hdurl over url, returns '' if neither exists.
 * @param {object} apodData
 * @returns {string}
 */
export function extractApodAssetUrl(apodData) {
  return apodData?.hdurl || apodData?.url || ''
}

/**
 * Derive a download filename from an APOD response.
 * e.g. { date: '2024-03-01', hdurl: '...jpg' } → 'apod_2024-03-01.jpg'
 * @param {object} apodData
 * @returns {string}
 */
export function formatApodFilename(apodData) {
  const url = extractApodAssetUrl(apodData)
  // Extract only the path segment (no domain dots), then match a file extension
  const pathname = url.split('?')[0].split('/').pop() ?? ''
  const extMatch = pathname.match(/\.([a-z0-9]+)$/i)
  const ext = extMatch ? extMatch[1] : 'jpg'
  return `apod_${apodData?.date ?? 'unknown'}.${ext}`
}

/**
 * Generate a random date string between 1995-06-16 (first APOD) and yesterday.
 * @returns {string} YYYY-MM-DD
 */
export function randomApodDate() {
  const start = new Date('1995-06-16').getTime()
  const end   = Date.now() - 86_400_000   // yesterday
  return new Date(start + Math.random() * (end - start)).toISOString().slice(0, 10)
}

/**
 * Validate that a date string is in YYYY-MM-DD format.
 * @param {string} str
 * @returns {boolean}
 */
export function isValidApodDate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str)
}
