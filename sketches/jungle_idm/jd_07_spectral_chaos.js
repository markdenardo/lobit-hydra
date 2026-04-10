// JD_07: SPECTRAL CHAOS
// Category: Jungle/IDM
// Vibe: Full spectrum explosion. RGB separated planes in collision.
// Live tweak: speed, separation, noiseAmt

let speed = 0.7
let separation = 0.02

let r = noise(3, speed).thresh(0.4)
let g = noise(3, speed * 1.1).thresh(0.4).scroll(separation, 0)
let b = noise(3, speed * 0.9).thresh(0.4).scroll(-separation, separation)

r.color(1, 0, 0)
  .add(g.color(0, 1, 0))
  .add(b.color(0, 0, 1))
  .modulatePixelate(noise(6, speed * 2), 32, 32)
  .colorama(() => Math.sin(time * 0.5) * 0.15)
  .contrast(2.5)
  .out(o0)
