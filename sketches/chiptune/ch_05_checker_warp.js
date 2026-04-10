// CH_05: CHECKER WARP
// Category: Chiptune
// Vibe: Classic checkerboard with noise warping. Low-bit texture.
// Live tweak: size, warpAmt, speed

let size = 32
let warpAmt = 0.3
let speed = 0.4

osc(size, 0, 0)
  .diff(osc(size, 0, 0).rotate(Math.PI / 2))
  .thresh(0.1)
  .modulate(noise(3, speed), warpAmt)
  .pixelate(size * 2, size * 2)
  .color(1, 0.9, 0)
  .contrast(3)
  .out(o0)
