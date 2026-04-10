// CH_03: MAZE GEO
// Category: Chiptune
// Vibe: Pac-man/Galaga era maze geometry. Repeating tiled corridors.
// Live tweak: tiles, rotSpeed, col

let tiles = 8
let rotSpeed = 0.1

shape(4, 0.4, 0.01)
  .repeat(tiles, tiles, 0.5, 0.5)
  .rotate(0, rotSpeed)
  .color(0, 0.8, 1)
  .diff(
    shape(4, 0.2, 0.01)
      .repeat(tiles, tiles, 0.5, 0.5)
      .rotate(0, -rotSpeed)
      .color(1, 0, 0.5)
  )
  .pixelate(128, 128)
  .contrast(3)
  .out(o0)
