# Claude Code — Project Instructions: lobit-hydra

Hydra livecode visual pack for a 6-hour chiptune / techno / jungle IDM event. Three artists, one screen, full offline capability. 30 patches + NASA image terminal tools.

---

## What this project is

A **performance-ready collection of Hydra sketches** grouped by genre, plus Node/Python CLI tools for pulling NASA imagery during sets. The project is designed to work completely offline after initial setup — no internet required on stage.

**The Hydra API contract** (enforced by the test suite):
- Every sketch must call `.out(o0)` (or another buffer) to produce output
- Sources (`osc`, `noise`, `shape`, etc.) return chainable textures
- All chain methods return new textures — the pipeline is immutable
- Function arguments (`() => value`) are accepted anywhere a number is

---

## Stack

- **Hydra** — `hydra/` submodule, run via `npm run hydra` (local server at localhost:8000)
- **Node.js ≥18** — `"type": "module"` throughout; uses ES module imports
- **`node:test`** — built-in test runner, zero extra deps
- **`node:vm`** — runs sketches in an isolated context for testing
- **NASA Images API** — no auth required for basic use (`DEMO_KEY`)
- **Python 3.8+** — alternative CLI with `chafa` ASCII art support

---

## Running the project

```bash
# One-time setup (needs internet)
npm run install-hydra

# Start Hydra editor (works offline after setup)
npm run hydra            # → http://localhost:8000

# Run all tests
npm test

# NASA tools
npm run nasa:apod        # Today's APOD
npm run nasa:random      # Random space image
npm run nasa:search      # Search (edit query in package.json scripts)
node tools/nasa_gif.js search "nebula"
```

---

## File map

| Path | Purpose |
|------|---------|
| `sketches/chiptune/` | 10 patches — pixel grid, scanlines, CRT, spectrum |
| `sketches/techno/` | 10 patches — industrial, acid, oscilloscope, feedback |
| `sketches/jungle_idm/` | 10 patches — glitch, Amen cuts, IDM feedback, polyrhythm |
| `tools/nasa-core.js` | Pure URL builders + response parsers — **the testable part** |
| `tools/nasa_gif.js` | CLI entry point — imports from nasa-core.js |
| `tools/nasa_gif.py` | Python version + `chafa` ASCII art renderer |
| `test/hydra-mock.js` | Mock Hydra context factory for `node:vm` |
| `test/sketches.test.js` | Tests all 30 sketches against the mock |
| `test/nasa.test.js` | Unit tests for URL building + response parsing |
| `hydra-globals.d.ts` | Hydra API type stubs — gives WebStorm IntelliSense |
| `hydra/` | Hydra web editor submodule (hydra-synth/hydra) |

---

## Sketch conventions

Every sketch file must:

1. **Start with a header block** — required fields:
   ```javascript
   // TITLE
   // Category: Chiptune | Techno | Jungle/IDM
   // Vibe: one-line description
   // Live tweak: comma-separated variable names
   ```

2. **Declare live-tweak variables as `let` at the top** so performers can change them mid-set with `Ctrl+Enter`

3. **End the pipeline with `.out(o0)`** — this is Hydra's render contract, enforced by `test/sketches.test.js`

4. **Be self-contained** — no imports, no external state. Sketches are copy-pasted into the Hydra editor

### Filename convention

```
{prefix}_{NN}_{description}.js
  ch_  = chiptune
  tk_  = techno
  jd_  = jungle/IDM
```

### Adding a new sketch

1. Create the file in the appropriate `sketches/` subdirectory
2. Follow the header convention above
3. Run `npm test` — the inventory test will fail if the count is not a multiple of 10, and the contract test will catch any sketch that doesn't call `.out()`

---

## Testing

Tests use `node:test` (built-in since Node 18) and `node:vm` — no Jest, no extra deps.

```bash
npm test                    # both suites
npm run test:sketches       # Hydra contract tests only
npm run test:nasa           # NASA URL/parser tests only
```

### How sketch testing works

`test/hydra-mock.js` builds a `vm.Context` with mock versions of every Hydra global. Each mock source function (`osc`, `noise`, etc.) returns a chainable object where every method returns a new mock texture. `.out()` records the call.

`test/sketches.test.js` runs each sketch inside this context via `vm.runInContext()` and asserts:
- No synchronous errors thrown
- `.out()` was called at least once
- Header fields are present

For interval-based sketches (`jd_02`, `jd_09`, `tk_03`), `setInterval` is mocked to run the callback once synchronously, so `.out()` fires during the test.

### NASA tests

`test/nasa.test.js` tests `tools/nasa-core.js` — URL construction, response parsing, date validation. **No network calls.** The CLI script (`nasa_gif.js`) is kept thin (imports + switch), with all testable logic in `nasa-core.js`.

---

## Hydra API quick reference

```javascript
// Sources — all return HydraTexture
osc(freq, sync, offset)        // oscillator
noise(scale, offset)           // noise field
shape(sides, radius, smooth)   // geometric shape
voronoi(scale, speed, blend)   // voronoi cells
gradient(speed)                // gradient
solid(r, g, b, a)              // solid color
src(buffer)                    // read o0/o1/o2/o3

// All methods chain and return HydraTexture
.rotate(angle, speed)
.scale(amount)
.pixelate(x, y)
.kaleid(sides)
.color(r, g, b)
.colorama(amount)
.thresh(threshold, tolerance)
.contrast(amount)
.modulate(texture, amount)     // first arg is a texture, not a number
.blend(texture, amount)
.diff(texture)
.mult(texture, amount)
.out(o0)                       // terminal — must be last

// Globals
time        // elapsed seconds — use in lambda args: () => Math.sin(time)
o0 … o3    // output buffers
```

---

## What not to do

- Do not add `import`/`export` to sketch files — they're paste-into-Hydra scripts, not modules
- Do not omit `.out(o0)` from a sketch — the test suite enforces this
- Do not write business logic in `nasa_gif.js` — keep it as CLI wiring only; logic goes in `nasa-core.js`
- Do not contact the NASA API from tests — keep tests pure/offline
- Do not commit `tools/downloads/` — it's gitignored
- Do not set `strobeRate` above 3hz in `tk_03_strobe_bw.js` — public safety
