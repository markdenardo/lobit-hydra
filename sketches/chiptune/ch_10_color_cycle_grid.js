// CH_10: COLOR CYCLE GRID
// Category: Chiptune
// Vibe: Fast cycling palette grid. Amiga demo scene color cycling.
// Live tweak: gridSize, cycleSpeed, posterBins

let gridSize = 16
let cycleSpeed = 0.8
let posterBins = 8

osc(gridSize, 0, 0)
  .diff(osc(gridSize, 0, 0).rotate(Math.PI / 2))
  .thresh(0.05)
  .colorama(cycleSpeed * 0.01)
  .add(
    gradient(cycleSpeed * 0.3)
      .saturate(5)
      .posterize(posterBins, 1)
    , 0.5
  )
  .pixelate(gridSize * 4, gridSize * 4)
  .contrast(2)
  .out(o0)

// Animate hue cycling
setInterval(() => {
  cycleSpeed += 0.001
}, 50)
