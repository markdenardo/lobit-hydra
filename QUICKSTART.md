# Quickstart: `initVideo()`

Get NASA-sourced MP4s playing inside a Hydra sketch in under a minute.

## 1. Start the library server

```bash
npm run library:serve
# → http://localhost:3001
```

Keep this running in its own terminal alongside Hydra. It serves the MP4s in `library/` with CORS headers so the Hydra editor (a different origin) can fetch them.

## 2. Check what's available

```bash
npm run library:list
```

Each name printed here is the handle you'll pass to `initVideo()` — e.g. `nebula_2024` maps to `library/nebula_2024.mp4`, served at `http://localhost:3001/nebula_2024.mp4`.

Currently in the library (also visible under the "video library" tab in the deck, `npm run deck`):

| Name | `initVideo()` call | Source |
|---|---|---|
| `nebula_2024` | `initVideo('nebula_2024')` | apod.nasa.gov M31 |
| `galaxy_swirl` | `initVideo('galaxy_swirl')` | images-assets.nasa.gov PIA04921 |
| `aurora_glow` | `initVideo('aurora_glow')` | apod.nasa.gov M31 |

This table reflects `library/index.json` at time of writing — it will drift as videos are added/removed, so `npm run library:list` (or the deck's video library tab) is always the source of truth.

No videos yet? Pull one from NASA first:

```bash
node tools/nasa_gif.js search "nebula"
node tools/nasa_gif.js download "<url-from-search>" "nebula_2024"
```

## 3. Declare `initVideo()` in the Hydra editor

Open the Hydra editor (`npm run hydra`), then paste this once per session — it's not a module, just a function declaration in the same global scope as your sketches:

```javascript
function initVideo(name, buf) {
  const b = buf || s0
  b.initVideo(`http://localhost:3001/${name}.mp4`)
  return src(b)
}
```

(Same snippet lives in `tools/init_video.js` if you'd rather paste from the file.)

## 4. Execute it

```javascript
// Default buffer (s0) — returns src(s0), chainable
initVideo('nebula_2024').colorama(0.4).out(o0)

// Explicit buffer — load into s1, keep s0 free for something else
initVideo('apod_2024-03-01', s1)
src(s1).modulate(noise(3), 0.2).out(o0)
```

`Ctrl+Enter` on the `initVideo(...)` line first (it fires the load + returns), then `Ctrl+Enter` again if you add more chained calls below.

## All sketches

Any of these can be the `.out(o0)` pipeline you drop `initVideo()` into as a source. Full descriptions in the main [README](README.md#sketch-categories); paste from `sketches/<category>/<file>.js`.

### Chiptune (`sketches/chiptune/`)

| File | Vibe |
|------|------|
| ch_01_pixel_grid | 8-bit oscillator grid |
| ch_02_scanlines | CRT phosphor lines |
| ch_03_maze_geo | Pac-man/Galaga tile corridors |
| ch_04_spectrum_bars | ZX Spectrum frequency bars |
| ch_05_checker_warp | Checkerboard with noise distortion |
| ch_06_bitcrush_noise | Bitcrushed static |
| ch_07_crt_glow | Phosphor glow on grid |
| ch_08_sine_interference | NES triangle channel moire |
| ch_09_pixel_kaleid | Gameboy-palette kaleidoscope |
| ch_10_color_cycle_grid | Amiga demo scene color cycling |

### Techno (`sketches/techno/`)

| File | Vibe |
|------|------|
| tk_01_industrial_grid | Cold metal grid pulse |
| tk_02_hard_edge_rotate | Minimalist shape rotation |
| tk_03_strobe_bw | B/W strobe (⚠ 2hz max, epilepsy) |
| tk_04_dark_tunnel | Zoom tunnel |
| tk_05_acid_trails | 303 acid neon trails |
| tk_06_4x4_pulse | Kick-synced grid pulse |
| tk_07_dark_fractal | Recursive void noise |
| tk_08_mirror_kaleid | Industrial kaleidoscope |
| tk_09_feedback_dark | Slow-burn feedback loop |
| tk_10_oscilloscope | Vectorscope waveform |

### Jungle/IDM (`sketches/jungle_idm/`)

| File | Vibe |
|------|------|
| jd_01_chaos_glitch | Pure visual instability |
| jd_02_amen_cuts | Stutter chop like the Amen |
| jd_03_jungle_texture | Organic + digital hybrid |
| jd_04_idm_glitch_feedback | Aphex/Autechre recursion |
| jd_05_bitshift_pattern | XOR / Sierpinski emergent |
| jd_06_complex_warp | Domain warping |
| jd_07_spectral_chaos | RGB plane collision |
| jd_08_reese_ripples | Detuned Reese bass visual |
| jd_09_breakbeat_rhythm | Syncopated 16-step geometry |
| jd_10_polyrhythm_geo | Coprime rotation (Euclidean rhythm) |

## Boilerplate — start a new patch

Copy this into the Hydra editor as a starting point. It follows the required sketch header (see `CLAUDE.md`), declares live-tweak vars as `let`, and pulls in a library video as a modulation source via `initVideo()` — delete the `initVideo` lines if you don't need a video source.

```javascript
// UNTITLED PATCH
// Category: Chiptune | Techno | Jungle/IDM
// Vibe: one-line description
// Live tweak: speed, amount

let speed = 0.2
let amount = 0.5

initVideo('nebula_2024')     // swap for any name from `npm run library:list`
  .modulate(noise(3, speed), amount)
  .out(o0)
```

No video, just a bare sketch skeleton:

```javascript
// UNTITLED PATCH
// Category: Chiptune | Techno | Jungle/IDM
// Vibe: one-line description
// Live tweak: speed, amount

let speed = 0.2
let amount = 0.5

osc(30, 0.1, () => Math.sin(time))
  .rotate(0, speed)
  .out(o0)
```

## Troubleshooting

| Symptom | Cause |
|---|---|
| `initVideo is not defined` | Step 3 snippet wasn't pasted into this editor session yet |
| Video never appears / blank output | `library:serve` isn't running, or the `name` doesn't match a file in `library/` — check with `npm run library:list` |
| CORS error in browser console | You're hitting a different port than 3001, or `library_server.js` isn't the one serving — restart `npm run library:serve` |
| 404 on the `.mp4` request | Typo in `name`, or the file was never converted — re-run the `download` step |
