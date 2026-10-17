const N = 4;
const boardEl = document.getElementById('board'), ov = document.getElementById('ov');
let grid, score, best = +localStorage.getItem('rekor2048') || 0, prev = null, won = false, keepGoing = false;
let newPos = null, mergedPos = [];

const $ = id => document.getElementById(id);
$('best').textContent = best;

function empty() { return Array.from({ length: N }, () => Array(N).fill(0)); }

function init() {
  grid = empty(); score = 0; prev = null; won = false; keepGoing = false;
  addRandom(); addRandom(); newPos = null; mergedPos = [];
  ov.classList.add('hide'); render();
}
function addRandom() {
  const free = [];
  grid.forEach((r, y) => r.forEach((v, x) => { if (!v) free.push([y, x]); }));
  if (!free.length) return;
  const [y, x] = free[Math.floor(Math.random() * free.length)];
  grid[y][x] = Math.random() < .9 ? 2 : 4;
  newPos = y + ',' + x;
}
// Bir satırı sola doğru kaydır ve birleştir
function slideRow(row) {
  const vals = row.filter(v => v), out = [], merged = [];
  let gain = 0;
  for (let i = 0; i < vals.length; i++) {
    if (vals[i] === vals[i + 1]) { out.push(vals[i] * 2); merged.push(out.length - 1); gain += vals[i] * 2; i++; }
    else out.push(vals[i]);
  }
  while (out.length < N) out.push(0);
  return { out, merged, gain };
}
function move(dir) { // 0 sol, 1 yukarı, 2 sağ, 3 aşağı
  const before = JSON.stringify(grid), snapshot = { grid: grid.map(r => [...r]), score };
  const g = grid.map(r => [...r]); mergedPos = []; let gain = 0;
  for (let i = 0; i < N; i++) {
    const line = [];
    for (let j = 0; j < N; j++) line.push(dir === 0 ? g[i][j] : dir === 2 ? g[i][N - 1 - j] : dir === 1 ? g[j][i] : g[N - 1 - j][i]);
    const { out, merged, gain: gn } = slideRow(line); gain += gn;
    for (let j = 0; j < N; j++) {
      const yy = dir === 1 ? j : dir === 3 ? N - 1 - j : i;
      const xx = dir === 0 ? j : dir === 2 ? N - 1 - j : i;
      g[yy][xx] = out[j];
      if (merged.includes(j)) mergedPos.push(yy + ',' + xx);
    }
  }
  if (JSON.stringify(g) === before) return;
  prev = snapshot; grid = g; score += gain;
  if (score > best) { best = score; localStorage.setItem('rekor2048', best); }
  addRandom(); render(); check();
}
function canMove() {
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (!grid[y][x]) return true;
    if (x < N - 1 && grid[y][x] === grid[y][x + 1]) return true;
    if (y < N - 1 && grid[y][x] === grid[y + 1][x]) return true;
  }
  return false;
}
function check() {
  if (!keepGoing && grid.flat().includes(2048)) {
    won = true; $('ovt').textContent = '🎉 2048! Kazandın'; $('ovb').textContent = 'Devam Et';
    ov.classList.remove('hide'); ov.dataset.mode = 'win';
  } else if (!canMove()) {
    $('ovt').textContent = 'Oyun Bitti 😢'; $('ovb').textContent = 'Tekrar Dene';
    ov.classList.remove('hide'); ov.dataset.mode = 'lose';
  }
}
function render() {
  boardEl.querySelectorAll('.cell').forEach(c => c.remove());
  grid.forEach((r, y) => r.forEach((v, x) => {
    const c = document.createElement('div');
    const key = y + ',' + x;
    c.className = 'cell' + (v ? ' v' + (v > 2048 ? 'big' : v) : '');
    if (v) c.textContent = v;
    if (key === newPos) c.classList.add('new');
    else if (mergedPos.includes(key)) c.classList.add('pop');
    boardEl.appendChild(c);
  }));
  $('score').textContent = score; $('best').textContent = best;
  $('undo').disabled = !prev;
}
function undo() {
  if (!prev) return;
  grid = prev.grid; score = prev.score; prev = null; newPos = null; mergedPos = [];
  ov.classList.add('hide'); render();
}

$('undo').onclick = undo;
$('new').onclick = init;
$('ovb').onclick = () => { if (ov.dataset.mode === 'win') { keepGoing = true; ov.classList.add('hide'); } else init(); };

document.addEventListener('keydown', e => {
  const m = { arrowleft: 0, a: 0, arrowup: 1, w: 1, arrowright: 2, d: 2, arrowdown: 3, s: 3 };
  const k = e.key.toLowerCase();
  if (k in m) { e.preventDefault(); if (ov.classList.contains('hide')) move(m[k]); }
  else if (k === 'z' && (e.ctrlKey || e.metaKey)) undo();
});
// Mobil kaydırma
let sx, sy;
document.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', e => {
  if (sx == null || !ov.classList.contains('hide')) return;
  const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
  move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 2 : 0) : (dy > 0 ? 3 : 1));
  sx = null;
});

init();
