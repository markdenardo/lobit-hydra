// CH_02: SCANLINES
// Category: Chiptune
// Vibe: CRT phosphor scanlines, old monitor artifact. Green tint by default.
// Live tweak: lineCount, speed, tint r/g/b

let lineCount = 240
let speed = 0.1

osc(lineCount, 0, 0.5)
  .thresh(0.4)
  .color(0.2, 1.0, 0.2)
  .mult(
    osc(4, speed, 0)
      .saturate(2)
      .pixelate(32, 32)
  )
  .contrast(1.8)
  .out(o0)
