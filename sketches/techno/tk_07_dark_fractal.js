// TK_07: DARK FRACTAL
// Category: Techno
// Vibe: Recursive dark noise. Void-like. Pairs with deep reverb techno sets.
// Live tweak: depth, noiseScale, speed

let noiseScale = 3
let speed = 0.15

noise(noiseScale, speed)
  .mult(noise(noiseScale * 1.5, speed * 1.3))
  .modulate(
    noise(noiseScale * 0.5, speed * 0.5), 0.3
  )
  .brightness(-0.2)
  .contrast(3)
  .saturate(0.5)
  .color(0.3, 0.1, 0.8)
  .mult(
    noise(noiseScale * 3, speed * 2).thresh(0.6).invert()
  )
  .out(o0)
