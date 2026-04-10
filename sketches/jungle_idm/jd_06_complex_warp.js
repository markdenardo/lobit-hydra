// JD_06: COMPLEX WARP
// Category: Jungle/IDM
// Vibe: Aggressive domain warping. Like a VHS melting in a microwave.
// Live tweak: warp1, warp2, speed

let warp1 = 0.5
let warp2 = 0.3
let speed = 0.4

noise(4, speed)
  .modulate(
    noise(2, speed * 0.5), warp1
  )
  .modulate(
    noise(6, speed * 0.8), warp2
  )
  .colorama(0.4)
  .contrast(2)
  .diff(
    noise(8, speed * 1.5)
      .thresh(0.5)
      .pixelate(16, 16)
      .color(1, 0, 0.3)
  )
  .out(o0)
