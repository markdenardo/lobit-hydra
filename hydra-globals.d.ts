/**
 * Hydra global type stubs for WebStorm IntelliSense.
 * Covers the Hydra synth API as used in sketches/*.
 * Reference: https://hydra.ojack.xyz/api/
 */

type HydraValue = number | (() => number)

interface HydraTexture {
  // ── geometry ───────────────────────────────────────────────────────────────
  rotate(angle?: HydraValue, speed?: HydraValue): HydraTexture
  scale(amount?: HydraValue, xMult?: HydraValue, yMult?: HydraValue): HydraTexture
  pixelate(pixelX?: HydraValue, pixelY?: HydraValue): HydraTexture
  repeat(repeatX?: HydraValue, repeatY?: HydraValue, offsetX?: HydraValue, offsetY?: HydraValue): HydraTexture
  kaleid(nSides?: HydraValue): HydraTexture
  scroll(scrollX?: HydraValue, scrollY?: HydraValue, speedX?: HydraValue, speedY?: HydraValue): HydraTexture

  // ── color ─────────────────────────────────────────────────────────────────
  color(r?: HydraValue, g?: HydraValue, b?: HydraValue, a?: HydraValue): HydraTexture
  colorama(amount?: HydraValue): HydraTexture
  saturate(amount?: HydraValue): HydraTexture
  hue(hueShift?: HydraValue): HydraTexture
  brightness(amount?: HydraValue): HydraTexture
  contrast(amount?: HydraValue): HydraTexture
  posterize(bins?: HydraValue, gamma?: HydraValue): HydraTexture
  thresh(threshold?: HydraValue, tolerance?: HydraValue): HydraTexture
  invert(amount?: HydraValue): HydraTexture
  luma(threshold?: HydraValue, tolerance?: HydraValue): HydraTexture

  // ── blend ─────────────────────────────────────────────────────────────────
  blend(texture: HydraTexture, amount?: HydraValue): HydraTexture
  add(texture: HydraTexture, amount?: HydraValue): HydraTexture
  diff(texture: HydraTexture): HydraTexture
  mult(texture: HydraTexture, amount?: HydraValue): HydraTexture
  layer(texture: HydraTexture): HydraTexture
  mask(texture: HydraTexture, reps?: HydraValue, offset?: HydraValue): HydraTexture

  // ── modulate ──────────────────────────────────────────────────────────────
  modulate(texture: HydraTexture, amount?: HydraValue): HydraTexture
  modulateScale(texture: HydraTexture, multiple?: HydraValue, offset?: HydraValue): HydraTexture
  modulateRotate(texture: HydraTexture, multiple?: HydraValue, offset?: HydraValue): HydraTexture
  modulatePixelate(texture: HydraTexture, multiple?: HydraValue, offset?: HydraValue): HydraTexture
  modulateHue(texture: HydraTexture, amount?: HydraValue): HydraTexture
  modulateScrollX(texture: HydraTexture, scrollX?: HydraValue, speed?: HydraValue): HydraTexture
  modulateScrollY(texture: HydraTexture, scrollY?: HydraValue, speed?: HydraValue): HydraTexture
  modulateKaleid(texture: HydraTexture, nSides?: HydraValue): HydraTexture

  // ── output ────────────────────────────────────────────────────────────────
  out(buffer?: HydraBuffer): void
}

interface HydraBuffer extends HydraTexture {}

// ── sources ───────────────────────────────────────────────────────────────────

/** Oscillator source */
declare function osc(frequency?: HydraValue, sync?: HydraValue, offset?: HydraValue): HydraTexture
/** Noise source */
declare function noise(scale?: HydraValue, offset?: HydraValue): HydraTexture
/** Geometric shape source */
declare function shape(sides?: HydraValue, radius?: HydraValue, smoothing?: HydraValue): HydraTexture
/** Voronoi source */
declare function voronoi(scale?: HydraValue, speed?: HydraValue, blending?: HydraValue): HydraTexture
/** Gradient source */
declare function gradient(speed?: HydraValue): HydraTexture
/** Solid color source */
declare function solid(r?: HydraValue, g?: HydraValue, b?: HydraValue, a?: HydraValue): HydraTexture
/** Read from a render buffer */
declare function src(buffer: HydraBuffer): HydraTexture

// ── buffers ───────────────────────────────────────────────────────────────────

declare const o0: HydraBuffer
declare const o1: HydraBuffer
declare const o2: HydraBuffer
declare const o3: HydraBuffer
declare const s0: HydraBuffer
declare const s1: HydraBuffer
declare const s2: HydraBuffer
declare const s3: HydraBuffer

// ── globals ───────────────────────────────────────────────────────────────────

/** Elapsed time in seconds */
declare const time: number
/** Render all 4 output buffers in a 2x2 grid */
declare function render(buffer?: HydraBuffer): void
/** Set the output resolution */
declare function setResolution(width: number, height: number): void
/** Set the frame rate */
declare function setFps(fps: number): void
