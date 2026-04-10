// CH_04: SPECTRUM BARS
// Category: Chiptune
// Vibe: Spectrum analyzer / frequency bar display. ZX Spectrum vibes.
// Live tweak: bars, speed, colorShift

let bars = 16
let speed = 0.5
let colorShift = 0.0

osc(bars, speed, 0)
  .thresh(0.5)
  .pixelate(bars * 2, bars)
  .mult(
    gradient(0.2)
      .hue(colorShift)
      .saturate(4)
  )
  .contrast(2.5)
  .posterize(bars, 1)
  .out(o0)
