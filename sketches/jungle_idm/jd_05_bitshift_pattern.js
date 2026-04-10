// JD_05: BITSHIFT PATTERN
// Category: Jungle/IDM
// Vibe: Bitwise XOR aesthetic. Sierpinski triangle emergent from ops.
// Live tweak: xFreq, yFreq, shift

let xFreq = 12
let yFreq = 12
let shift = 0.5

osc(xFreq, 0, 0)
  .diff(osc(xFreq, 0, 0).scroll(shift, 0))
  .diff(
    osc(yFreq, 0, 0)
      .rotate(Math.PI / 2)
      .diff(osc(yFreq, 0, 0).rotate(Math.PI / 2).scroll(0, shift))
  )
  .thresh(0.05)
  .pixelate(xFreq * 4, yFreq * 4)
  .colorama(() => Math.sin(time * 0.3) * 0.1)
  .contrast(5)
  .out(o0)
