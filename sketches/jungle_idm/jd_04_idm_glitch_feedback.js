// JD_04: IDM GLITCH FEEDBACK
// Category: Jungle/IDM
// Vibe: Aphex Twin / Autechre recursive instability. Needs 20-30s to evolve.
// Live tweak: fbAmt, glitchScale, rotDrift

let fbAmt = 0.88
let glitchScale = 3
let rotDrift = 0.004

src(o0)
  .scale(1.002)
  .rotate(rotDrift)
  .modulatePixelate(
    noise(glitchScale, 0.6), 24, 24
  )
  .mult(
    osc(8, 0.1).color(1, 0, 0.5)
  )
  .blend(src(o0), fbAmt)
  .out(o0)
