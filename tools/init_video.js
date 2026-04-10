// init_video.js — Hydra helper snippet for the lobit video library
//
// PASTE THIS FUNCTION into the Hydra editor before using initVideo().
// The library server must be running: npm run library:serve
//
// ─── Usage ────────────────────────────────────────────────────────────────────
//
//   initVideo('nebula_2024')                 → loads into s0, returns src(s0)
//   initVideo('apod_2024-03-01', s1)         → loads into s1, returns src(s1)
//
//   // Chainable — src(sN) is returned so you can keep going:
//   initVideo('nebula_2024').colorama(0.4).out(o0)
//
//   // List available videos: node nasa_gif.js list
//   // Add a video:           node nasa_gif.js download <url> <name>
//
// ─── Snippet (copy from here) ─────────────────────────────────────────────────

function initVideo(name, buf) {
  const b = buf || s0
  b.initVideo(`http://localhost:3001/${name}.mp4`)
  return src(b)
}
