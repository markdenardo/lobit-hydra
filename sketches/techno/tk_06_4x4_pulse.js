// TK_06: 4X4 PULSE
// Category: Techno
// Vibe: Grid that pulses on the 4/4. Manually sync to BPM via pulseScale.
// Live tweak: bpm, cols, accentColor

let bpm = 140
let cols = 4
let pulseScale = 1.0  // bump to 1.2 on kick then let it decay

// Decay loop — reduce pulseScale back to 1.0 after each kick hit
setInterval(() => {
  pulseScale = pulseScale + (1.0 - pulseScale) * 0.15
}, 16)

osc(cols * 4, 0, 0)
  .diff(osc(cols * 4, 0, 0).rotate(Math.PI / 2))
  .thresh(0.1)
  .scale(() => pulseScale)
  .pixelate(cols * 16, cols * 16)
  .color(1, 0.05, 0.3)
  .mult(
    gradient(bpm / 6000).saturate(3)
  )
  .contrast(2.5)
  .out(o0)
