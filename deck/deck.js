// deck.js — browser-side logic for the lobit hydra deck
// Loaded after hydra-synth.js (sets up window globals: osc, o0, s0, src, time, ...)
// and tools/init_video.js (defines the initVideo() helper).
//
// WIP — not yet performance-ready, needs more testing before relying on it live.

const LIBRARY_URL = 'http://localhost:3001'

const canvas = document.getElementById('hydra-canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

new Hydra({
  canvas,
  makeGlobal: true,
  detectAudio: false,
  width: canvas.width,
  height: canvas.height,
})

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

const editor = document.getElementById('editor')
const currentName = document.getElementById('current-name')

// Some sketches (tk_03, jd_02, jd_09) drive their animation with a raw
// setInterval that's never cleared. Track every interval a sketch starts
// so switching patches doesn't leave old loops silently overwriting o0.
const activeIntervals = new Set()
const nativeSetInterval = window.setInterval.bind(window)
window.setInterval = (...args) => {
  const id = nativeSetInterval(...args)
  activeIntervals.add(id)
  return id
}

function clearActiveIntervals() {
  activeIntervals.forEach((id) => clearInterval(id))
  activeIntervals.clear()
}

function runCode(code) {
  clearActiveIntervals()
  try {
    ;(0, eval)(code)
  } catch (err) {
    console.error('Sketch error:', err)
  }
}

document.getElementById('run-btn').addEventListener('click', () => runCode(editor.value))
document.getElementById('clear-btn').addEventListener('click', () => {
  editor.value = 'solid(0, 0, 0, 1).out(o0)'
  currentName.textContent = '—'
  runCode(editor.value)
})

editor.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    runCode(editor.value)
  }
})

async function loadSketch(sketch) {
  const res = await fetch(sketch.path)
  const code = await res.text()
  editor.value = code
  currentName.textContent = sketch.title
  runCode(code)
}

async function buildSketchTabs() {
  try {
    const res = await fetch('/api/sketches')
    const sketches = await res.json()
    document.getElementById('deck-status').classList.add('ok')

    const mounts = {
      chiptune: document.getElementById('sketch-list-chiptune'),
      techno: document.getElementById('sketch-list-techno'),
      jungle_idm: document.getElementById('sketch-list-jungle_idm'),
    }

    sketches.forEach((s) => {
      const btn = document.createElement('button')
      btn.className = 'patch-btn'
      btn.textContent = s.file.replace(/\.js$/, '')
      btn.title = s.title
      btn.addEventListener('click', () => loadSketch(s))
      mounts[s.category]?.appendChild(btn)
    })
  } catch (err) {
    console.error('Could not load sketch list:', err)
  }
}

async function refreshLibrary() {
  const list = document.getElementById('library-list')
  try {
    const res = await fetch(LIBRARY_URL + '/')
    const files = await res.json()
    document.getElementById('lib-status').classList.add('ok')
    list.innerHTML = ''

    if (files.length === 0) {
      list.innerHTML = '<p class="empty">No videos yet.<br>Run: node tools/nasa_gif.js download &lt;url&gt; &lt;name&gt;</p>'
      return
    }

    files.forEach((f) => {
      const name = f.replace(/\.mp4$/, '')
      const btn = document.createElement('button')
      btn.className = 'patch-btn'
      btn.textContent = name
      btn.addEventListener('click', () => {
        const code = `initVideo('${name}').out(o0)`
        editor.value = code
        currentName.textContent = name + ' (video)'
        runCode(code)
      })
      list.appendChild(btn)
    })
  } catch (err) {
    document.getElementById('lib-status').classList.remove('ok')
    list.innerHTML = '<p class="empty">Library server unreachable.<br>Run: npm run library:serve</p>'
  }
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'))
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'))
    tab.classList.add('active')
    document.querySelector(`.tab-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active')
  })
})

document.getElementById('toggle-panel').addEventListener('click', () => {
  document.getElementById('panel').classList.toggle('collapsed')
})

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'h' && document.activeElement !== editor) {
    document.getElementById('panel').classList.toggle('collapsed')
  }
})

buildSketchTabs()
refreshLibrary()
setInterval(refreshLibrary, 15000) // pick up new downloads mid-set without a page reload
