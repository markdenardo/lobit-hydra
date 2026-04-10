// CH_09: PIXEL KALEID
// Category: Chiptune
// Vibe: Pixelated kaleidoscope. Low-bit symmetry, gameboy palette energy.
// Live tweak: sides, pixSize, speed, hue

let sides = 6
let pixSize = 32
let speed = 0.15

osc(pixSize / 2, speed, 0.3)
  .color(0, 1, 0.5)
  .diff(osc(pixSize / 2, speed, 1.0).color(1, 0, 0.5))
  .pixelate(pixSize, pixSize)
  .kaleid(sides)
  .rotate(0, 0.05)
  .contrast(2)
  .out(o0)
