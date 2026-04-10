// CH_06: BITCRUSH NOISE
// Category: Chiptune
// Vibe: Bitcrushed static, like a badly sampled drum machine. Harsh + grainy.
// Live tweak: crush, noiseScale, colorize

let crush = 8
let noiseScale = 4

noise(noiseScale, 0.6)
  .posterize(crush, 1)
  .pixelate(crush * 8, crush * 8)
  .contrast(4)
  .saturate(0)
  .brightness(-0.1)
  .blend(
    noise(noiseScale * 2, 1.2)
      .posterize(4, 1)
      .color(0, 1, 0.3)
      .pixelate(crush * 4, crush * 4)
    , 0.4
  )
  .out(o0)
