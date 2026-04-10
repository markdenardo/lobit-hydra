# lobit-hydra

A Hydra livecoding visual pack for a 6-hour chiptune / techno / jungle IDM event. Three artists, one screen, zero boredom.

---

## What's in here

```
hydra/              Hydra web editor — cloned for offline use
sketches/
  chiptune/         10 patches — pixel grids, scanlines, CRT glow, spectrum bars
  techno/           10 patches — industrial geometry, acid trails, feedback loops
  jungle_idm/       10 patches — chaos glitch, Amen cuts, IDM feedback, polyrhythms
tools/
  nasa_gif.js       Node.js CLI — search NASA image library, download APODs
  nasa_gif.py       Python version — same tool + terminal ASCII art via chafa
```

---

## Running Hydra locally (offline)

```bash
# One-time setup (requires internet + Node.js)
npm run install-hydra

# Start local Hydra server
npm run hydra
# → open http://localhost:8000
```

Once deps are installed, the full editor works offline.

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

```bash
# Node.js
node tools/nasa_gif.js search "galaxy"
node tools/nasa_gif.js apod
node tools/nasa_gif.js random
node tools/nasa_gif.js download <url> <filename>

# Python (+ ASCII art with `brew install chafa`)
python3 tools/nasa_gif.py search "nebula"
python3 tools/nasa_gif.py random
python3 tools/nasa_gif.py ascii <url>
```

Downloads land in `tools/downloads/`. Set `NASA_API_KEY` env var to raise rate limits above the default DEMO_KEY (30 req/hr).

---

## Using patches during a set

1. Open Hydra at `http://localhost:8000`
2. Open any `.js` file in `sketches/`
3. Copy the contents into the Hydra editor
4. `Ctrl+Enter` on a line to execute that block
5. `Ctrl+Shift+Enter` to run the whole sketch
6. Tweak `let` variables at the top live — change value → `Ctrl+Enter`

Each patch has a `// Live tweak:` comment listing the knobs worth touching mid-set.

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
