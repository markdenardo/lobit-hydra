# lobit-hydra

A Hydra livecoding visual pack for a 6-hour chiptune / techno / jungle IDM event. Three artists, one screen, zero boredom.

---

## What's in here

```
hydra/              Hydra web editor — cloned for offline use (Vite dev server)
library/            MP4 video library for Hydra's initVideo() — built from NASA downloads
sketches/
  chiptune/         10 patches — pixel grids, scanlines, CRT glow, spectrum bars
  techno/           10 patches — industrial geometry, acid trails, feedback loops
  jungle_idm/       10 patches — chaos glitch, Amen cuts, IDM feedback, polyrhythms
tools/
  nasa_gif.js       Node.js CLI — search NASA, download to library as MP4
  nasa_gif.py       Python version — same search + terminal ASCII art via chafa
  nasa-core.js      Pure URL builders + response parsers (imported by CLI + tests)
  library.js        Library management — MP4 conversion via ffmpeg, index.json
  library_server.js Static HTTP server (port 3001) with CORS for Hydra's initVideo()
  init_video.js     Hydra snippet — paste into editor to use initVideo()
test/
  hydra-mock.js     Mock Hydra context for node:vm
  sketches.test.js  Contract tests for all 30 sketches
  nasa.test.js      Unit tests for URL building + response parsing
```

---

## Running Hydra locally (offline)

```bash
# One-time setup (requires internet + Node.js)
npm run install-hydra

# Start local Hydra editor
npm run hydra
# → URL shown in terminal (Vite dev server, typically http://localhost:5173)
```

Once deps are installed, the editor works offline.

---

## Sketch categories

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

---

## NASA tools

Find and pull NASA imagery into the video library for use in Hydra sketches.

```bash
# Search
node tools/nasa_gif.js search "galaxy"
node tools/nasa_gif.js gif "nebula"     # video/animation results only
node tools/nasa_gif.js apod             # today's Astronomy Picture of the Day
node tools/nasa_gif.js apod 2024-03-01  # specific date
node tools/nasa_gif.js random           # random APOD (good for VJ drops)

# Download to library (converts to MP4 via ffmpeg — required)
node tools/nasa_gif.js download <url> <name>
#   <name> becomes the Hydra handle: initVideo('name')
#   Example: node tools/nasa_gif.js download "https://..." "nebula_blue"

# List what's in the library
node tools/nasa_gif.js list             # or: npm run library:list

# Python version (includes ASCII preview with `brew install chafa`)
python3 tools/nasa_gif.py search "nebula"
python3 tools/nasa_gif.py ascii <url>
```

Set `NASA_API_KEY` env var for higher rate limits (default: DEMO_KEY, 30 req/hr).

**Requires ffmpeg** for MP4 conversion: `brew install ffmpeg`

---

## Video library

Downloaded assets are stored in `library/` as MP4 and tracked in `library/index.json`. The library server exposes them over HTTP with CORS headers so Hydra can load them via `initVideo()`.

```bash
# Start the library server (keep running alongside Hydra)
npm run library:serve
# → http://localhost:3001/
```

In the Hydra editor, paste the contents of `tools/init_video.js` once, then:

```javascript
// Load a library video into s0 and use it as a source
initVideo('nebula_blue').colorama(0.4).out(o0)

// Load into a specific buffer
initVideo('apod_2024-03-01', s1)
src(s1).modulate(noise(3), 0.2).out(o0)
```

---

## Using patches during a set

1. Start Hydra (`npm run hydra`) and the library server (`npm run library:serve`) in separate terminals
2. Open the Hydra URL shown in the terminal
3. Paste `tools/init_video.js` into the editor once to enable `initVideo()`
4. Open any `.js` file in `sketches/`, paste into the editor
5. `Ctrl+Enter` on a line to execute that block; `Ctrl+Shift+Enter` for the whole sketch
6. Tweak `let` variables at the top live — change value → `Ctrl+Enter`

Each patch has a `// Live tweak:` comment listing the variables worth touching mid-set.

---

## Tests

```bash
npm test               # all 101 tests
npm run test:sketches  # Hydra API contract only (all 30 sketches)
npm run test:nasa      # NASA URL + parser unit tests (no network)
```

---

## Event notes

- 6 hours, 3 artists
- Genres: chiptune, techno, jungle/IDM
- ⚠ `tk_03_strobe_bw.js` — keep `strobeRate` at or below 2hz for public safety
- `tk_06_4x4_pulse.js` — manually bump `pulseScale = 1.2` on kick hits, it decays automatically
- `jd_04_idm_glitch_feedback.js` — let it run 20-30 seconds before it gets interesting
- `jd_09_breakbeat_rhythm.js` — set `bpm` to match the artist's tempo

---

## License

MIT
