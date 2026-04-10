/**
 * sketches.test.js — Verify all 30 Hydra sketch files against the mock Hydra API.
 *
 * What this tests:
 *   1. Every sketch is syntactically valid JavaScript
 *   2. Every sketch calls .out() at least once (Hydra's render contract)
 *   3. Every sketch has the required header comment fields
 *   4. Chained Hydra API calls survive the full pipeline without throwing
 *   5. Lambda arguments (() => value) work inside the vm context
 *   6. Interval-based sketches (jd_02, jd_09, tk_03) fire .out() on first tick
 *
 * Run: node --test test/sketches.test.js
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHydraContext, runSketch } from './hydra-mock.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SKETCHES_DIR = join(__dirname, '..', 'sketches')

// ── sketch discovery ──────────────────────────────────────────────────────────

function discoverSketches() {
  const sketches = []
  for (const category of readdirSync(SKETCHES_DIR).sort()) {
    const catDir = join(SKETCHES_DIR, category)
    for (const file of readdirSync(catDir).sort()) {
      if (file.endsWith('.js')) {
        sketches.push({ category, name: file.replace('.js', ''), path: join(catDir, file) })
      }
    }
  }
  return sketches
}

const ALL_SKETCHES = discoverSketches()

// ── suite ─────────────────────────────────────────────────────────────────────

describe('Sketch inventory', () => {
  it('finds exactly 30 sketch files across 3 categories', () => {
    assert.equal(ALL_SKETCHES.length, 30, `Expected 30 sketches, found ${ALL_SKETCHES.length}`)
  })

  it('has 10 sketches per category', () => {
    const counts = {}
    for (const s of ALL_SKETCHES) counts[s.category] = (counts[s.category] ?? 0) + 1
    for (const [cat, count] of Object.entries(counts)) {
      assert.equal(count, 10, `Category "${cat}" has ${count} sketches, expected 10`)
    }
  })

  it('categories are: chiptune, jungle_idm, techno', () => {
    const cats = [...new Set(ALL_SKETCHES.map(s => s.category))].sort()
    assert.deepEqual(cats, ['chiptune', 'jungle_idm', 'techno'])
  })
})

describe('Sketch header conventions', () => {
  for (const sketch of ALL_SKETCHES) {
    it(`${sketch.category}/${sketch.name} has required header fields`, () => {
      const code = readFileSync(sketch.path, 'utf8')
      const missing = []
      if (!code.startsWith('// ')) missing.push('header comment')
      if (!code.includes('// Category:')) missing.push('// Category:')
      if (!code.includes('// Vibe:')) missing.push('// Vibe:')
      if (!code.includes('// Live tweak:')) missing.push('// Live tweak:')
      assert.equal(
        missing.length, 0,
        `${sketch.name}: missing header fields: ${missing.join(', ')}`
      )
    })
  }
})

describe('Hydra API contract — each sketch must call .out()', () => {
  for (const sketch of ALL_SKETCHES) {
    it(`${sketch.category}/${sketch.name} runs without error and calls .out()`, () => {
      const code = readFileSync(sketch.path, 'utf8')
      const { ctx, wasOutCalled, outCalls } = createHydraContext()

      // Must not throw synchronously
      assert.doesNotThrow(
        () => runSketch(code, ctx),
        `${sketch.name}: threw a synchronous error`
      )

      // Must call .out() — Hydra's render contract
      assert.ok(
        wasOutCalled(),
        `${sketch.name}: never called .out(). Calls recorded: ${JSON.stringify(outCalls())}`
      )
    })
  }
})

describe('Hydra API contract — chain integrity', () => {
  it('osc() source is chainable through all color + geometry transforms', () => {
    const { ctx, wasOutCalled } = createHydraContext()
    const code = `
      osc(10, 0.3, 0)
        .rotate(0.5)
        .scale(1.2)
        .pixelate(32, 32)
        .kaleid(6)
        .color(1, 0, 0.5)
        .colorama(0.1)
        .saturate(2)
        .contrast(1.5)
        .brightness(0.1)
        .out(o0)
    `
    assert.doesNotThrow(() => runSketch(code, ctx))
    assert.ok(wasOutCalled())
  })

  it('modulate() accepts a texture as its first argument', () => {
    const { ctx, wasOutCalled } = createHydraContext()
    const code = `
      osc(10, 0.3, 0)
        .modulate(noise(3, 0.5), 0.2)
        .out(o0)
    `
    assert.doesNotThrow(() => runSketch(code, ctx))
    assert.ok(wasOutCalled())
  })

  it('src(o0) feedback loop pattern runs without infinite recursion', () => {
    const { ctx, wasOutCalled } = createHydraContext()
    const code = `
      src(o0)
        .scale(1.002)
        .rotate(0.001)
        .brightness(-0.005)
        .out(o0)
    `
    assert.doesNotThrow(() => runSketch(code, ctx))
    assert.ok(wasOutCalled())
  })

  it('lambda () => value arguments are accepted by all source functions', () => {
    const { ctx, wasOutCalled } = createHydraContext()
    const code = `
      osc(() => 10 + Math.sin(time) * 5, () => 0.3, 0)
        .rotate(() => time * 0.1)
        .scale(() => 1 + Math.sin(time) * 0.05)
        .out(o0)
    `
    assert.doesNotThrow(() => runSketch(code, ctx))
    assert.ok(wasOutCalled())
  })

  it('diff() accepts a full chained texture as argument', () => {
    const { ctx, wasOutCalled } = createHydraContext()
    const code = `
      osc(8, 0, 0)
        .diff(
          osc(8, 0, 0)
            .rotate(Math.PI / 2)
            .color(1, 0, 0)
        )
        .thresh(0.1)
        .out(o0)
    `
    assert.doesNotThrow(() => runSketch(code, ctx))
    assert.ok(wasOutCalled())
  })

  it('multiple .out() calls in one sketch are all recorded', () => {
    const { ctx, outCalls } = createHydraContext()
    const code = `
      osc(10, 0.3, 0).out(o0)
      noise(3, 0.5).out(o1)
    `
    runSketch(code, ctx)
    assert.equal(outCalls().length, 2)
    assert.equal(outCalls()[0].buffer, 'o0')
    assert.equal(outCalls()[1].buffer, 'o1')
  })

  it('interval-based sketches fire .out() on first tick', () => {
    // Verifies that setInterval mock calls callback once so timed sketches
    // are testable — this is how jd_02, jd_09, tk_03 work
    const { ctx, wasOutCalled } = createHydraContext()
    const code = `
      let fired = false
      setInterval(() => {
        osc(8, 0, 0).color(1, 0, 0).out(o0)
        fired = true
      }, 100)
    `
    assert.doesNotThrow(() => runSketch(code, ctx))
    assert.ok(wasOutCalled(), 'interval callback did not fire .out()')
  })
})
