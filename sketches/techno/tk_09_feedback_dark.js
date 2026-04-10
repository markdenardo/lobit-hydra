// TK_09: FEEDBACK DARK
// Category: Techno
// Vibe: Dark feedback loop. Slow burn to chaos. Let it run 2-3 minutes.
// Live tweak: fbScale, fbRot, injectAmt

let fbScale = 1.004
let fbRot = 0.003
let injectAmt = 0.08

src(o0)
  .scale(fbScale)
  .rotate(fbRot)
  .brightness(-0.005)
  .add(
    shape(4, 0.05, 0.01)
      .color(1, 0.2, 0)
      .rotate(() => time * 0.3)
    , injectAmt
  )
  .contrast(1.1)
  .out(o0)
