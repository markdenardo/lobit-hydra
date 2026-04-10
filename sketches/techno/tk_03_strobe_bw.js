// TK_03: STROBE B/W
// Category: Techno
// Vibe: Black and white hard strobe. Use with caution on epilepsy concerns.
// Live tweak: strobeRate (hz), geometry

// WARNING: strobing visuals — keep strobeRate below 3 for public safety
let strobeRate = 2  // hz — DO NOT exceed 3 for public events

let frame = 0
setInterval(() => {
  frame++
  let on = (frame % Math.round(60 / strobeRate)) < Math.round(30 / strobeRate)

  if (on) {
    shape(4, 0.8, 0.01)
      .rotate(frame * 0.01)
      .diff(shape(4, 0.5, 0.01).rotate(-frame * 0.015))
      .color(1, 1, 1)
      .contrast(10)
      .out(o0)
  } else {
    solid(0, 0, 0).out(o0)
  }
}, 1000 / 60)
