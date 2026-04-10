// TK_10: OSCILLOSCOPE
// Category: Techno
// Vibe: Oscilloscope waveform visualization. Vectorscope energy, no audio needed.
// Live tweak: freq, speed, lineColor r/g/b

let freq = 2
let speed = 1.0

osc(freq, speed, 0)
  .thresh(0.49, 0.01)   // thin line
  .color(0, 1, 0.5)
  .add(
    osc(freq * 1.5, speed * 0.7, Math.PI)
      .thresh(0.49, 0.01)
      .color(1, 0.3, 0)
    , 0.7
  )
  .rotate(Math.PI / 2)
  .modulate(
    osc(4, 0.2, 0).rotate(Math.PI / 3), 0.05
  )
  .contrast(3)
  .brightness(-0.4)
  .out(o0)
