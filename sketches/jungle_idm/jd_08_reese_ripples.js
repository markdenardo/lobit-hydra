// JD_08: REESE RIPPLES
// Category: Jungle/IDM
// Vibe: Dark rippling waveforms. Visual analogue of a detuned Reese bass.
// Live tweak: detune, speed, darkAmt

let detune = 0.03
let speed = 0.6
let darkAmt = 0.3

osc(10, speed, 0)
  .mult(osc(10 + detune, speed, 0))
  .modulate(
    osc(3, speed * 0.2, 0).rotate(Math.PI / 4), 0.2
  )
  .color(0.4, 0, 0.8)
  .brightness(-darkAmt)
  .contrast(2.5)
  .add(
    src(o0).scale(0.999).brightness(-0.01), 0.6
  )
  .out(o0)
