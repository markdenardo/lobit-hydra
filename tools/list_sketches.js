#!/usr/bin/env node
// list_sketches.js — Terminal listing of all sketches in sketches/
// Mirrors `nasa_gif.js list` but for the sketch catalog instead of the video library.
//
// Usage: node list_sketches.js   (or: npm run sketches:list)

import { listSketches, SKETCH_CATEGORIES } from './sketches.js'

function printDivider() {
  console.log('─'.repeat(64))
}

const sketches = listSketches()

if (!sketches.length) {
  console.log('\nNo sketches found under sketches/.\n')
  process.exit(0)
}

printDivider()
for (const category of SKETCH_CATEGORIES) {
  const inCategory = sketches.filter(s => s.category === category)
  if (!inCategory.length) continue
  console.log(category)
  inCategory.forEach(s => console.log(`  ${s.file.replace(/\.js$/, '')}  —  ${s.title}`))
}
printDivider()
console.log(`\n${sketches.length} sketches (${SKETCH_CATEGORIES.map(c => sketches.filter(s => s.category === c).length).join('/')})`)
console.log(`Paste from sketches/<category>/<file>.js, or fetch from the library server:`)
console.log(`  curl http://localhost:3001/sketches\n`)
