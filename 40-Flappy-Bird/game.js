// Flappy Bird - Fizik Motoru ve Akıcı Oynanış
const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('scoreDisplay');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const gameOverlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayDesc = document.getElementById('overlayDesc');
const startBtn = document.getElementById('startBtn');
const previewBird = document.getElementById('previewBird');
const themeBtns = document.querySelectorAll('.theme-btn');

let isRunning = false;
let score = 0;
let highScore = localStorage.getItem('flappyBirdHighScore') || 0;
highScoreDisplay.innerText = highScore;

let animationId;
let frames = 0;

// Renk Seçenekleri
let birdColor = '#facc15'; // Varsayılan: Sarı
const colorEmjis = {
  '#facc15': '🐥',
  '#38bdf8': '🐦',
  '#ec4899': '🦩',
  '#4ade80': '🦜'
};

themeBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    birdColor = btn.dataset.color;
    previewBird.innerText = colorEmjis[birdColor] || '🐥';
  });
});

// 1. KUŞ FİZİĞİ
const bird = {
  x: 75,
  y: canvas.height / 2,
  radius: 16,
  velocity: 0,
  gravity: 0.28,    // Çok sert düşmesin, akıcı olsun
  jumpStrength: -6.4, // Zıplama gücü
  rotation: 0
};

// 2. BORULAR (Engeller)
let pipes = [];
const PIPE_WIDTH = 58;
const PIPE_GAP = 145; // Geçiş aralığı (mobil için adil ve dengeli)
let pipeInterval = 115; // Yeni boru gelme sıklığı (frame)

// 3. ARKA PLAN BULUTLARI & ŞEHİR SİLUETİ
const clouds = [
  { x: 30, y: 70, size: 45, speed: 0.4 },
  { x: 190, y: 120, size: 35, speed: 0.3 },
  { x: 320, y: 55, size: 50, speed: 0.5 }
];

// Zıplama Fonksiyonu
function flap() {
  if (!isRunning) return;
  bird.velocity = bird.jumpStrength;
}

// Kontroller (Dokunmatik + Mouse + Klavye)
canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  flap();
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    if (isRunning) flap();
    else if (gameOverlay.classList.contains('active')) startGame();
  }
});

// ==========================================================
// ÇİZİM FONKSİYONLARI
// ==========================================================

// 1. Gökyüzü ve Gece Şehri Arka Planı
function drawBackground() {
  // Gece Gökyüzü Gradyanı
  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGrad.addColorStop(0, '#0c1a30');
  skyGrad.addColorStop(0.7, '#162b4c');
  skyGrad.addColorStop(1, '#1e3a5f');

  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Süzülen Gece Bulutları
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  clouds.forEach(cloud => {
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
    ctx.arc(cloud.x + cloud.size * 0.6, cloud.y - 10, cloud.size * 0.8, 0, Math.PI * 2);
    ctx.arc(cloud.x + cloud.size * 1.2, cloud.y, cloud.size * 0.9, 0, Math.PI * 2);
    ctx.fill();

    cloud.x -= cloud.speed;
    if (cloud.x + cloud.size * 2 < 0) {
      cloud.x = canvas.width + 50;
    }
  });

  // Arka Plan Şehir Binaları Silueti
  ctx.fillStyle = 'rgba(7, 14, 26, 0.45)';
  const bWidth = 40;
  for (let i = 0; i < canvas.width / bWidth + 2; i++) {
    const bHeight = 45 + (Math.sin(i * 1.5) * 20 + 20);
    ctx.fillRect(i * bWidth, canvas.height - bHeight - 35, bWidth - 4, bHeight);
  }

  // Zemin Çizgisi
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, canvas.height - 35, canvas.width, 35);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(0, canvas.height - 35, canvas.width, 4);
}

// 2. Kuş Çizimi (Gözler, Gaga, Kanat ve Renk)
function drawBird() {
  ctx.save();
  ctx.translate(bird.x, bird.y);

  // Zıplarken yukarı, düşerken aşağı yönelme
  bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 5, bird.velocity * 0.07));
  ctx.rotate(bird.rotation);

  // Kuş Gövdesi
  ctx.fillStyle = birdColor;
  ctx.shadowBlur = 10;
  ctx.shadowColor = birdColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, bird.radius, bird.radius * 0.88, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Sevimli Beyaz Göz & Gözbebeği
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(7, -4, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(8.5, -4, 2.8, 0, Math.PI * 2);
  ctx.fill();

  // Turuncu Gaga
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(11, -1);
  ctx.lineTo(21, 2);
  ctx.lineTo(11, 6);
  ctx.closePath();
  ctx.fill();

  // Kanat Çırpma Hareketi
  const wingOffset = Math.sin(frames * 0.25) * 4;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.ellipse(-5, 2 + wingOffset, 7, 5, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 3. Neon Yeşil Borular (Klasik Flappy Pipes)
function drawPipes() {
  pipes.forEach(pipe => {
    // Üst ve Alt Borunun Rengi
    const pipeGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
    pipeGrad.addColorStop(0, '#4ade80');
    pipeGrad.addColorStop(0.3, '#22c55e');
    pipeGrad.addColorStop(0.8, '#16a34a');
    pipeGrad.addColorStop(1, '#14532d');

    ctx.fillStyle = pipeGrad;
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 2.5;

    // Üst Boru
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
    ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.top);

    // Üst Boru Başlığı (Kapak)
    ctx.fillRect(pipe.x - 3, pipe.top - 20, PIPE_WIDTH + 6, 20);
    ctx.strokeRect(pipe.x - 3, pipe.top - 20, PIPE_WIDTH + 6, 20);

    // Alt Boru
    const bottomY = pipe.top + PIPE_GAP;
    const bottomHeight = canvas.height - bottomY - 35;
    ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, bottomHeight);
    ctx.strokeRect(pipe.x, bottomY, PIPE_WIDTH, bottomHeight);

    // Alt Boru Başlığı (Kapak)
    ctx.fillRect(pipe.x - 3, bottomY, PIPE_WIDTH + 6, 20);
    ctx.strokeRect(pipe.x - 3, bottomY, PIPE_WIDTH + 6, 20);
  });
}

// ==========================================================
// OYUN DÖNGÜSÜ & ÇARPIŞMA
// ==========================================================
function updateGame() {
  if (!isRunning) return;

  frames++;
  drawBackground();

  // Kuş Fizik Güncellemesi
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Yeni Boru Ekleme (Skor ilerledikçe hafifçe sıklaşır)
  if (frames % pipeInterval === 0) {
    const minTop = 50;
    const maxTop = canvas.height - PIPE_GAP - 90;
    const randomTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

    pipes.push({
      x: canvas.width,
      top: randomTop,
      passed: false
    });
  }

  // Boruları Sola Kaydırma & Kontrol
  const pipeSpeed = 2.3 + Math.min(1.2, score * 0.04); // Yavaşça hızlanır

  for (let i = pipes.length - 1; i >= 0; i--) {
    const p = pipes[i];
    p.x -= pipeSpeed;

    // Skoru Artır (Kuş boruyu geçtiğinde)
    if (!p.passed && p.x + PIPE_WIDTH < bird.x) {
      p.passed = true;
      score++;
      scoreDisplay.innerText = score;
    }

    // ÇARPIŞMA KONTROLÜ
    // Kuşun boru yatay eksenine girmesi
    if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + PIPE_WIDTH) {
      // Üst boruya çarpma veya Alt boruya çarpma
      if (bird.y - bird.radius < p.top || bird.y + bird.radius > p.top + PIPE_GAP) {
        gameOver();
        return;
      }
    }

    // Ekran dışına çıkan boruyu sil
    if (p.x + PIPE_WIDTH < -20) {
      pipes.splice(i, 1);
    }
  }

  // Zemin veya Tavan Çarpması
  if (bird.y + bird.radius >= canvas.height - 35 || bird.y - bird.radius <= 0) {
    gameOver();
    return;
  }

  drawPipes();
  drawBird();

  animationId = requestAnimationFrame(updateGame);
}

function startGame() {
  score = 0;
  scoreDisplay.innerText = '0';
  frames = 0;

  bird.y = canvas.height / 2;
  bird.velocity = 0;
  bird.rotation = 0;

  pipes = [];

  gameOverlay.classList.remove('active');
  isRunning = true;

  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(updateGame);
}

function gameOver() {
  isRunning = false;
  cancelAnimationFrame(animationId);

  // Rekor Kontrolü
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('flappyBirdHighScore', highScore);
    highScoreDisplay.innerText = highScore;
  }

  overlayTitle.innerText = 'OYUN BİTTİ';
  overlayDesc.innerHTML = `Boruya çarptın!<br><b>Skorun:</b> ${score} • <b>En Yüksek Rekorun:</b> ${highScore}`;
  startBtn.innerText = 'TEKRAR DENE';
  gameOverlay.classList.add('active');
}

startBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  startGame();
});

// İlk ekran çizimi
drawBackground();
drawBird();
