// JD_01: CHAOS GLITCH
// Category: Jungle/IDM
// Vibe: Pure instability. Fast, random, unresolved. Opening patch.
// Live tweak: glitchAmt, speed, cutFreq

let glitchAmt = 0.8
let speed = 2.0

noise(8, speed)
  .modulatePixelate(
    noise(4, speed * 1.3), 64, 16
  )
  .diff(
    noise(16, speed * 0.7)
      .thresh(0.4)
  )
  .colorama(0.3)
  .contrast(5)
  .posterize(4, 0.5)
  .out(o0)
