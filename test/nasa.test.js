/**
 * nasa.test.js — Unit tests for NASA tool URL building and response parsing.
 * No network calls. All logic tested against nasa-core.js exports.
 *
 * Run: node --test test/nasa.test.js
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildSearchUrl,
  buildApodUrl,
  randomApodDate,
  parseSearchItems,
  extractPreviewUrl,
  extractApodAssetUrl,
  formatApodFilename,
  isValidApodDate,
  NASA_IMAGES_BASE,
  NASA_APOD_BASE,
} from '../tools/nasa-core.js'

// ── URL builders ──────────────────────────────────────────────────────────────

describe('buildSearchUrl', () => {
  it('includes the query in the URL', () => {
    const url = buildSearchUrl('nebula')
    assert.ok(url.includes('q=nebula'), `Expected q=nebula in ${url}`)
  })

  it('URL-encodes spaces in the query', () => {
    const url = buildSearchUrl('black hole')
    assert.ok(url.includes('black%20hole'), `Expected encoded space in ${url}`)
  })

  it('includes media_type param when provided', () => {
    const url = buildSearchUrl('galaxy', 'video')
    assert.ok(url.includes('media_type=video'), `Expected media_type=video in ${url}`)
  })

  it('omits media_type param when empty', () => {
    const url = buildSearchUrl('galaxy', '')
    assert.ok(!url.includes('media_type'), `media_type should be absent when empty`)
  })

  it('points to the NASA Images API base', () => {
    const url = buildSearchUrl('stars')
    assert.ok(url.startsWith(NASA_IMAGES_BASE), `Expected URL to start with ${NASA_IMAGES_BASE}`)
  })

  it('requests 12 results per page', () => {
    const url = buildSearchUrl('moon')
    assert.ok(url.includes('page_size=12'))
  })
})

describe('buildApodUrl', () => {
  it('includes the api_key', () => {
    const url = buildApodUrl('', 'DEMO_KEY')
    assert.ok(url.includes('api_key=DEMO_KEY'))
  })

  it('uses a custom api_key when provided', () => {
    const url = buildApodUrl('', 'MY_KEY_123')
    assert.ok(url.includes('api_key=MY_KEY_123'))
  })

  it('includes date param when a date is provided', () => {
    const url = buildApodUrl('2024-03-01', 'DEMO_KEY')
    assert.ok(url.includes('date=2024-03-01'), `Expected date=2024-03-01 in ${url}`)
  })

  it('omits date param for today (empty dateStr)', () => {
    const url = buildApodUrl('', 'DEMO_KEY')
    assert.ok(!url.includes('&date='), `date param should be absent for empty dateStr`)
  })

  it('points to the APOD base', () => {
    const url = buildApodUrl('', 'DEMO_KEY')
    assert.ok(url.startsWith(NASA_APOD_BASE))
  })
})

// ── Date utilities ────────────────────────────────────────────────────────────

describe('randomApodDate', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const d = randomApodDate()
    assert.match(d, /^\d{4}-\d{2}-\d{2}$/, `Expected YYYY-MM-DD, got ${d}`)
  })

  it('is not before the first APOD (1995-06-16)', () => {
    const d = new Date(randomApodDate())
    const firstApod = new Date('1995-06-16')
    assert.ok(d >= firstApod, `Date ${d.toISOString()} is before first APOD`)
  })

  it('is not in the future', () => {
    const d = new Date(randomApodDate())
    assert.ok(d <= new Date(), `Date ${d.toISOString()} is in the future`)
  })

  it('produces different values on repeated calls (probabilistic)', () => {
    const dates = new Set(Array.from({ length: 10 }, randomApodDate))
    assert.ok(dates.size > 1, 'randomApodDate should not always return the same date')
  })
})

describe('isValidApodDate', () => {
  it('accepts a valid ISO date', () => {
    assert.ok(isValidApodDate('2024-03-01'))
  })

  it('rejects a date with wrong format', () => {
    assert.ok(!isValidApodDate('03-01-2024'))
    assert.ok(!isValidApodDate('2024/03/01'))
    assert.ok(!isValidApodDate('20240301'))
  })

  it('rejects empty string', () => {
    assert.ok(!isValidApodDate(''))
  })
})

// ── Response parsers ──────────────────────────────────────────────────────────

describe('parseSearchItems', () => {
  it('extracts items from a valid search response', () => {
    const data = { collection: { items: [{ data: [{ title: 'Test' }] }] } }
    assert.equal(parseSearchItems(data).length, 1)
  })

  it('returns empty array when items is missing', () => {
    assert.deepEqual(parseSearchItems({ collection: {} }), [])
    assert.deepEqual(parseSearchItems({}), [])
    assert.deepEqual(parseSearchItems(null), [])
  })

  it('returns empty array for an empty items list', () => {
    assert.deepEqual(parseSearchItems({ collection: { items: [] } }), [])
  })
})

describe('extractPreviewUrl', () => {
  it('returns the preview link when rel=preview exists', () => {
    const item = { links: [{ rel: 'preview', href: 'http://preview.jpg' }, { href: 'http://other.jpg' }] }
    assert.equal(extractPreviewUrl(item), 'http://preview.jpg')
  })

  it('falls back to first link when no rel=preview', () => {
    const item = { links: [{ href: 'http://first.jpg' }] }
    assert.equal(extractPreviewUrl(item), 'http://first.jpg')
  })

  it('returns null when no links', () => {
    assert.equal(extractPreviewUrl({ links: [] }), null)
    assert.equal(extractPreviewUrl({}), null)
  })
})

describe('extractApodAssetUrl', () => {
  it('prefers hdurl over url', () => {
    const data = { hdurl: 'http://hd.jpg', url: 'http://sd.jpg' }
    assert.equal(extractApodAssetUrl(data), 'http://hd.jpg')
  })

  it('falls back to url when hdurl is absent', () => {
    const data = { url: 'http://sd.jpg' }
    assert.equal(extractApodAssetUrl(data), 'http://sd.jpg')
  })

  it('returns empty string when neither exists', () => {
    assert.equal(extractApodAssetUrl({}), '')
    assert.equal(extractApodAssetUrl(null), '')
  })
})

describe('formatApodFilename', () => {
  it('produces apod_DATE.EXT from a normal APOD response', () => {
    const data = { date: '2024-03-01', hdurl: 'https://nasa.gov/image.jpg' }
    assert.equal(formatApodFilename(data), 'apod_2024-03-01.jpg')
  })

  it('strips query params from the extension', () => {
    const data = { date: '2024-03-01', url: 'https://nasa.gov/image.png?v=2' }
    assert.equal(formatApodFilename(data), 'apod_2024-03-01.png')
  })

  it('handles missing date gracefully', () => {
    const data = { hdurl: 'https://nasa.gov/img.gif' }
    assert.equal(formatApodFilename(data), 'apod_unknown.gif')
  })

  it('defaults to .jpg when URL has no extension', () => {
    const data = { date: '2024-03-01', url: 'https://nasa.gov/image' }
    assert.equal(formatApodFilename(data), 'apod_2024-03-01.jpg')
  })
})
