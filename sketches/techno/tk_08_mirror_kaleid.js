// TK_08: MIRROR KALEID
// Category: Techno
// Vibe: Hard geometric kaleidoscope. Industrial symmetry.
// Live tweak: sides, rotSpeed, col1, col2

let sides = 8
let rotSpeed = 0.1

osc(20, 0.05, 0)
  .thresh(0.5)
  .color(1, 0.1, 0.1)
  .diff(
    osc(20, 0.05, Math.PI / 3)
      .thresh(0.5)
      .color(0.1, 0.1, 1)
  )
  .kaleid(sides)
  .rotate(0, rotSpeed)
  .scale(() => 1 + Math.sin(time * 0.5) * 0.05)
  .contrast(2)
  .out(o0)
