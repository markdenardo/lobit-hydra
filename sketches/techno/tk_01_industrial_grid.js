// TK_01: INDUSTRIAL GRID
// Category: Techno
// Vibe: Hard metal grid pulse. Actuate on the kick. Cold and mechanical.
// Live tweak: gridFreq, pulseAmt, speed

let gridFreq = 20
let pulseAmt = 0.5
let speed = 0.05

osc(gridFreq, speed, 0)
  .thresh(0.5)
  .rotate(Math.PI / 4)
  .diff(
    osc(gridFreq, speed, 0).thresh(0.5)
  )
  .mult(
    noise(2, 0.1)
      .thresh(0.7)
      .contrast(10)
  )
  .color(0.9, 0.9, 0.9)
  .brightness(-0.3)
  .contrast(4)
  .out(o0)
