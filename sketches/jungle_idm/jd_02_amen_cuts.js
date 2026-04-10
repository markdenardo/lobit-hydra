// JD_02: AMEN CUTS
// Category: Jungle/IDM
// Vibe: Rapid rhythmic cuts like the Amen break. Stutter + chop visuals.
// Live tweak: cutRate, steps, colorCycle
// Tip: Sync cutRate to 1/16th notes at your BPM

let cutRate = 175   // bpm equivalent
let steps = 16
let frame = 0
let patches = [
  () => osc(8, 0, 0).diff(osc(8, 0, 0).rotate(Math.PI / 2)).thresh(0.1).color(1, 0, 0),
  () => noise(4, 1).thresh(0.5).color(0, 1, 0.5),
  () => osc(32, 0, 0).pixelate(32, 32).color(0.5, 0, 1),
  () => shape(3, 0.6, 0.01).rotate(frame * 0.1).color(1, 1, 0),
]

setInterval(() => {
  frame++
  let idx = frame % patches.length
  patches[idx]().contrast(3).out(o0)
}, Math.round(60000 / cutRate / 4))
