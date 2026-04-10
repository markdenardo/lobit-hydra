// JD_03: JUNGLE TEXTURE
// Category: Jungle/IDM
// Vibe: Organic + digital hybrid. Like wet circuitry. Jungle's soul.
// Live tweak: organicAmt, digitalAmt, speed

let organicAmt = 0.4
let speed = 0.8

voronoi(5, speed, 0.3)
  .mult(
    noise(6, speed * 0.6).thresh(0.3)
  )
  .modulateScale(
    osc(8, 0.2, 0), 0.3
  )
  .color(0.1, 0.8, 0.3)
  .add(
    osc(16, 0.5, 0)
      .thresh(0.6)
      .pixelate(32, 32)
      .color(0.8, 0.2, 0)
    , 0.3
  )
  .contrast(2)
  .out(o0)
