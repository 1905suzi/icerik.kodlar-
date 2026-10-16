const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const N = 20, S = cv.width / N;
const ov = document.getElementById('ov');
let snake, dir, nextDir, food, score, best = +localStorage.getItem('yilanRekor') || 0, timer, running = false, paused = false;
document.getElementById('best').textContent = best;

function speed() { return Math.max(60, 150 - Math.floor(score / 5) * 10); }
function level() { return Math.floor(score / 5) + 1; }

function reset() {
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  dir = nextDir = { x: 1, y: 0 };
  score = 0; placeFood(); updateHud();
}
function placeFood() {
  do { food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; }
  while (snake.some(s => s.x === food.x && s.y === food.y));
}
function updateHud() {
  document.getElementById('score').textContent = score;
  document.getElementById('best').textContent = best;
  document.getElementById('lvl').textContent = level();
}
function setDir(x, y) {
  if (x === -dir.x && y === -dir.y) return; // ters yöne dönme
  nextDir = { x, y };
}
function loop() {
  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || snake.some(s => s.x === head.x && s.y === head.y)) return gameOver();
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++; if (score > best) { best = score; localStorage.setItem('yilanRekor', best); }
    placeFood(); updateHud();
    clearInterval(timer); timer = setInterval(loop, speed());
  } else snake.pop();
  draw();
}
function draw() {
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.strokeStyle = '#13261a';
  for (let i = 1; i < N; i++) { ctx.beginPath(); ctx.moveTo(i * S, 0); ctx.lineTo(i * S, cv.height); ctx.moveTo(0, i * S); ctx.lineTo(cv.width, i * S); ctx.stroke(); }
  ctx.fillStyle = '#f87171'; ctx.beginPath(); ctx.arc(food.x * S + S / 2, food.y * S + S / 2, S / 2 - 2, 0, 7); ctx.fill();
  const col = COLORS[colorIdx];
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? col.head : (i % 2 ? col.body : col.alt);
    ctx.beginPath(); ctx.roundRect(s.x * S + 1, s.y * S + 1, S - 2, S - 2, i === 0 ? 8 : 5); ctx.fill();
  });
  // Gözler: yılanın baktığı yöne göre konumlanır
  const h = snake[0], cx = h.x * S + S / 2, cy = h.y * S + S / 2;
  const px = -dir.y, py = dir.x; // yanlara doğru dik vektör
  [-1, 1].forEach(side => {
    const ex = cx + dir.x * S * .18 + px * side * S * .22, ey = cy + dir.y * S * .18 + py * side * S * .22;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex, ey, S * .17, 0, 7); ctx.fill();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(ex + dir.x * 2, ey + dir.y * 2, S * .08, 0, 7); ctx.fill();
  });
}

// --- Renk seçimi ---
const COLORS = [
  { name: 'Yeşil', head: '#86efac', body: '#22c55e', alt: '#16a34a' },
  { name: 'Mavi', head: '#93c5fd', body: '#3b82f6', alt: '#2563eb' },
  { name: 'Pembe', head: '#f9a8d4', body: '#ec4899', alt: '#db2777' },
  { name: 'Turuncu', head: '#fdba74', body: '#f97316', alt: '#ea580c' },
  { name: 'Mor', head: '#d8b4fe', body: '#a855f7', alt: '#9333ea' },
  { name: 'Sarı', head: '#fde68a', body: '#eab308', alt: '#ca8a04' }
];
let colorIdx = Math.min(+localStorage.getItem('yilanRenk') || 0, COLORS.length - 1);
const sw = document.getElementById('swatches');
COLORS.forEach((c, i) => {
  const b = document.createElement('button');
  b.className = 'sw' + (i === colorIdx ? ' on' : ''); b.title = c.name;
  b.style.background = c.body;
  b.onclick = () => {
    colorIdx = i; localStorage.setItem('yilanRenk', i);
    sw.querySelectorAll('.sw').forEach(x => x.classList.remove('on')); b.classList.add('on');
    draw();
  };
  sw.appendChild(b);
});
function startGame() {
  reset(); draw(); ov.classList.add('hide'); running = true; paused = false;
  clearInterval(timer); timer = setInterval(loop, speed());
}
function gameOver() {
  clearInterval(timer); running = false;
  document.getElementById('ovt').textContent = 'Oyun Bitti 💀';
  document.getElementById('ovp').innerHTML = 'Skor: <b>' + score + '</b> • Rekor: <b>' + best + '</b>';
  document.getElementById('start').textContent = 'Tekrar Oyna';
  ov.classList.remove('hide');
}
function togglePause() {
  if (!running) return;
  paused = !paused;
  if (paused) { clearInterval(timer); document.getElementById('ovt').textContent = 'Duraklatıldı'; document.getElementById('ovp').textContent = 'Devam etmek için boşluk'; document.getElementById('start').style.display = 'none'; ov.classList.remove('hide'); }
  else { ov.classList.add('hide'); document.getElementById('start').style.display = ''; timer = setInterval(loop, speed()); }
}

document.getElementById('start').onclick = startGame;
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  const m = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] };
  if (m[k]) { e.preventDefault(); if (!running) return; setDir(...m[k]); }
  else if (k === ' ') { e.preventDefault(); running ? togglePause() : startGame(); }
});
document.querySelectorAll('.pad [data-d]').forEach(b => b.onclick = () => {
  if (!running) return;
  ({ up: () => setDir(0, -1), down: () => setDir(0, 1), left: () => setDir(-1, 0), right: () => setDir(1, 0) })[b.dataset.d]();
});
// Mobilde kaydırma ile yön
let tx, ty;
cv.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
cv.addEventListener('touchend', e => {
  if (!running) return;
  const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0); else setDir(0, dy > 0 ? 1 : -1);
});

reset(); draw();
