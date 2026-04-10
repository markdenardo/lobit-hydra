// CH_01: PIXEL GRID
// Category: Chiptune
// Vibe: Classic 8-bit oscillator grid. Hard pixel edges, color cycling.
// Live tweak: speed, cols, hueShift

let speed = 0.3
let cols = 64
let hueShift = 0.0

osc(cols, speed, 0)
  .pixelate(cols, cols / 2)
  .saturate(3)
  .contrast(2)
  .colorama(hueShift)
  .out(o0)
