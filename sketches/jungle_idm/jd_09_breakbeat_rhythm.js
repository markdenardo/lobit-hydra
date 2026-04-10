// JD_09: BREAKBEAT RHYTHM
// Category: Jungle/IDM
// Vibe: Syncopated geometry. Shapes fire on 8th/16th offgrid positions.
// Live tweak: bpm, patternLength

let bpm = 170
let interval = Math.round(60000 / bpm / 4)  // 16th note ms
let step = 0
// 16-step pattern: 1 = shape fires, 0 = off
let pattern = [1,0,0,1,0,1,0,0, 1,0,1,0,0,1,0,1]
let colors = [
  [1,0,0], [0,1,0.5], [0.5,0,1], [1,0.8,0]
]

setInterval(() => {
  let idx = step % pattern.length
  if (pattern[idx]) {
    let ci = Math.floor(step / 4) % colors.length
    let c = colors[ci]
    osc(16, 0, 0)
      .diff(osc(16, 0, 0).rotate(Math.PI / 2))
      .thresh(0.1)
      .pixelate(32, 32)
      .color(c[0], c[1], c[2])
      .contrast(3)
      .scale(1 + (idx * 0.05))
      .out(o0)
  }
  step++
}, interval)
