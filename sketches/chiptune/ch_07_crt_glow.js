// CH_07: CRT GLOW
// Category: Chiptune
// Vibe: CRT monitor phosphor glow effect. Blurry warmth on a hard grid.
// Live tweak: freq, glowAmt, tintR, tintG, tintB

let freq = 48
let glowAmt = 0.6
let tintR = 0.1
let tintG = 1.0
let tintB = 0.3

osc(freq, 0.15, 0)
  .pixelate(freq * 2, freq)
  .thresh(0.5)
  .color(tintR, tintG, tintB)
  .add(
    osc(freq, 0.15, 0)
      .pixelate(freq * 2, freq)
      .thresh(0.5)
      .color(tintR, tintG, tintB)
      .scale(1.02)
      .brightness(-0.3)
    , glowAmt
  )
  .contrast(1.5)
  .out(o0)
