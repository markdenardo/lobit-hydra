/**
 * hydra-mock.js — Reusable mock Hydra environment for running sketch files in Node.
 *
 * Creates a vm context that exposes all Hydra globals (osc, noise, shape, etc.)
 * as chainable no-ops. Tracks whether .out() was called, which is the minimum
 * contract every sketch must satisfy to produce output.
 *
 * Usage:
 *   import { createHydraContext, runSketch } from './hydra-mock.js'
 *   const { ctx, outCalls } = createHydraContext()
 *   runSketch(code, ctx)
 *   assert(outCalls().length > 0)
 */

import vm from 'node:vm'

// All transform / color / blend / modulate method names in the Hydra API.
const CHAIN_METHODS = [
  // Geometry
  'rotate', 'scale', 'pixelate', 'repeat', 'kaleid', 'scroll',
  // Color
  'color', 'colorama', 'saturate', 'hue', 'brightness', 'contrast',
  'posterize', 'thresh', 'invert', 'luma',
  // Blend
  'blend', 'add', 'diff', 'mult', 'layer', 'mask',
  // Modulate
  'modulate', 'modulateScale', 'modulateRotate', 'modulatePixelate',
  'modulateHue', 'modulateScrollX', 'modulateScrollY', 'modulateKaleid',
]

/**
 * Create a fresh Hydra vm context.
 * Returns the context object and accessor functions for inspecting calls.
 *
 * @returns {{ ctx: vm.Context, outCalls: () => Array, wasOutCalled: () => boolean }}
 */
export function createHydraContext() {
  const _outCalls = []

  /** Build a chainable mock texture. Every method returns a new mock texture. */
  function makeTex(label = 'source') {
    const t = {}
    for (const m of CHAIN_METHODS) {
      // Each chain method returns a new texture so calls can continue chaining.
      // Arguments are accepted but ignored — the mock only tracks structure.
      t[m] = (..._args) => makeTex(`${label}.${m}`)
    }
    t.out = (buffer) => {
      _outCalls.push({
        chain: label,
        buffer: buffer?._bufferName ?? 'o0',
      })
    }
    return t
  }

  /** Build a named output buffer that is itself a chainable texture. */
  function makeBuffer(name) {
    const b = makeTex(name)
    b._bufferName = name
    return b
  }

  // setInterval: run the callback once synchronously so interval-based sketches
  // (jd_02, jd_09, tk_03, tk_06) call .out() during the test rather than deferring.
  const ctx = vm.createContext({
    // ── sources ──
    osc:      (..._) => makeTex('osc'),
    noise:    (..._) => makeTex('noise'),
    shape:    (..._) => makeTex('shape'),
    voronoi:  (..._) => makeTex('voronoi'),
    gradient: (..._) => makeTex('gradient'),
    solid:    (..._) => makeTex('solid'),
    src:      (..._) => makeTex('src'),

    // ── system ──
    render:        () => {},
    setResolution: () => {},
    setFps:        () => {},
    time: 42,    // non-zero so lambda args like () => Math.sin(time) don't NaN

    // ── math ──
    Math,

    // ── timers — run callback once so interval-based patches complete ──
    setInterval: (fn) => { try { fn() } catch (_) {} return 0 },
    clearInterval: () => {},
    setTimeout:  (fn) => { try { fn() } catch (_) {} return 0 },
    clearTimeout: () => {},

    // ── console — suppress sketch output during tests ──
    console: { log: () => {}, warn: () => {}, error: () => {} },

    // ── output buffers ──
    o0: makeBuffer('o0'),
    o1: makeBuffer('o1'),
    o2: makeBuffer('o2'),
    o3: makeBuffer('o3'),
    s0: makeBuffer('s0'),
    s1: makeBuffer('s1'),
    s2: makeBuffer('s2'),
    s3: makeBuffer('s3'),
  })

  return {
    ctx,
    outCalls:    () => _outCalls,
    wasOutCalled: () => _outCalls.length > 0,
  }
}

/**
 * Run a sketch source string inside a Hydra context.
 * Throws if there is a synchronous error in the sketch code.
 *
 * @param {string} code  - raw .js sketch source
 * @param {vm.Context} ctx - from createHydraContext().ctx
 */
export function runSketch(code, ctx) {
  vm.runInContext(code, ctx, { filename: 'sketch' })
}
