// JD_10: POLYRHYTHM GEO
// Category: Jungle/IDM
// Vibe: Three shapes rotating at coprime speeds. Euclidean visual rhythm.
// Live tweak: speed1, speed2, speed3, col1/2/3

let speed1 = 0.11
let speed2 = 0.17
let speed3 = 0.23

shape(3, 0.6, 0.01)
  .rotate(0, speed1)
  .color(1, 0.2, 0)
  .diff(
    shape(5, 0.55, 0.01)
      .rotate(0, speed2)
      .color(0, 0.8, 1)
  )
  .diff(
    shape(7, 0.5, 0.01)
      .rotate(0, -speed3)
      .color(0.8, 0, 1)
  )
  .modulateRotate(
    noise(2, 0.3), 0.1
  )
  .contrast(3)
  .out(o0)
