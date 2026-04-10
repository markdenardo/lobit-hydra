// CH_08: SINE INTERFERENCE
// Category: Chiptune
// Vibe: Two sine waves interfering like NES triangle channel. Moire patterns.
// Live tweak: freq1, freq2, speed, pixLevel

let freq1 = 30
let freq2 = 31
let speed = 0.2
let pixLevel = 64

osc(freq1, speed, 0)
  .diff(osc(freq2, speed, Math.PI / 4))
  .pixelate(pixLevel, pixLevel)
  .color(0.8, 0.2, 1.0)
  .contrast(3)
  .brightness(0.1)
  .out(o0)
