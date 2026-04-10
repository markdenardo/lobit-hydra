// TK_05: ACID TRAILS
// Category: Techno
// Vibe: 303 acid bassline visual. Squirming neon trails on black.
// Live tweak: trailLen, freq, acidColor r/g/b

let trailLen = 0.97
let freq = 6

src(o0)
  .scale(1.003)
  .rotate(0.002)
  .brightness(-0.01)
  .blend(
    osc(freq, 0.8, 0)
      .rotate(() => Math.sin(time * 0.4) * 0.3)
      .modulate(noise(3, 0.5), 0.4)
      .thresh(0.4)
      .color(0, 1, 0.4)
      .brightness(0.1)
    , 0.15
  )
  .mult(
    noise(2, 0.1).thresh(0.1).invert()
    , 0.97
  )
  .out(o0)
