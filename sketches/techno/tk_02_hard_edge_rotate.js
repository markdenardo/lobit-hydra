// TK_02: HARD EDGE ROTATE
// Category: Techno
// Vibe: Geometric shapes with hard edges, slow rotation. Minimalist club visuals.
// Live tweak: sides, rotSpeed, scaleAmt

let sides = 4
let rotSpeed = 0.3
let scaleAmt = 0.7

shape(sides, scaleAmt, 0.005)
  .rotate(0, rotSpeed)
  .diff(
    shape(sides, scaleAmt * 0.6, 0.005)
      .rotate(0, -rotSpeed)
  )
  .color(1, 1, 1)
  .mult(
    shape(sides * 2, scaleAmt * 0.3, 0.005)
      .rotate(0, rotSpeed * 2)
      .color(1, 0, 0.2)
  )
  .contrast(5)
  .out(o0)
