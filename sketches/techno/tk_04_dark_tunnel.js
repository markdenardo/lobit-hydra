// TK_04: DARK TUNNEL
// Category: Techno
// Vibe: Zooming tunnel into darkness. Classic club visual.
// Live tweak: speed, rings, col

let speed = 1.2
let rings = 12

osc(rings, speed * 0.01, 0)
  .kaleid(rings)
  .scale(() => 1 + Math.sin(time * speed) * 0.02)
  .mult(
    src(o0)
      .scale(1.01)
      .brightness(-0.02)
  )
  .diff(
    shape(3, 0.02, 0.01)
      .color(1, 0, 0)
  )
  .contrast(1.5)
  .out(o0)
