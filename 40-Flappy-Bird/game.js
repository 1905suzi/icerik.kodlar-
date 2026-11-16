// Flappy Dino - Mavi-Turuncu Çizgili Dinozor ve Renk Değiştiren Ağaçlar
const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('scoreDisplay');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const gameOverlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayDesc = document.getElementById('overlayDesc');
const startBtn = document.getElementById('startBtn');

let isRunning = false;
let score = 0;
let highScore = localStorage.getItem('flappyDinoHighScore') || 0;
highScoreDisplay.innerText = highScore;

let animationId;
let frames = 0;

// 1. DİNOZOR FİZİĞİ & ÖZELLİKLERİ
const dino = {
  x: 75,
  y: canvas.height / 2,
  radius: 17,
  velocity: 0,
  gravity: 0.29,
  jumpStrength: -6.5,
  rotation: 0
};

// 2. AĞAÇ ENGEL RENK PALETLERİ (Her 2 ağaçta bir değişir)
const TREE_THEMES = [
  { trunk: '#22c55e', trunkDark: '#15803d', leaves: '#16a34a', border: '#14532d', name: 'Zümrüt Ormanı' },
  { trunk: '#a855f7', trunkDark: '#7e22ce', leaves: '#9333ea', border: '#581c87', name: 'Mor Sihir Ağaçları' },
  { trunk: '#f97316', trunkDark: '#c2410c', leaves: '#ea580c', border: '#7c2d12', name: 'Kızıl Sonbahar' },
  { trunk: '#06b6d4', trunkDark: '#0e7490', leaves: '#0891b2', border: '#155e75', name: 'Mavi Kristal Koru' },
  { trunk: '#eab308', trunkDark: '#a16207', leaves: '#ca8a04', border: '#713f12', name: 'Altın Vadi' },
  { trunk: '#ec4899', trunkDark: '#be185d', leaves: '#db2777', border: '#831843', name: 'Kiraz Çiçeği (Sakura)' }
];

// 3. AĞAÇLAR (ENGEL LİSTESİ)
let trees = [];
const TREE_WIDTH = 58;
const TREE_GAP = 148; // Geçiş açıklığı
let treeCounter = 0;  // Ağaç sayacı (Her 2 ağaçta bir renk değişimi için)

// 4. ARKA PLAN BULUTLARI & SÜZÜLEN YAPRAKLAR
const clouds = [
  { x: 30, y: 70, size: 45, speed: 0.4 },
  { x: 190, y: 120, size: 35, speed: 0.3 },
  { x: 320, y: 55, size: 50, speed: 0.5 }
];

function jump() {
  if (!isRunning) return;
  dino.velocity = dino.jumpStrength;
}

// Kontroller
canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  jump();
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    if (isRunning) jump();
    else if (gameOverlay.classList.contains('active')) startGame();
  }
});

// ==========================================================
// ÇİZİM FONKSİYONLARI
// ==========================================================

// 1. Arka Plan Gökyüzü & Doğa Zemin
function drawBackground() {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGrad.addColorStop(0, '#081726');
  skyGrad.addColorStop(0.6, '#132b40');
  skyGrad.addColorStop(1, '#1b3d4f');

  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bulutlar
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

  // Orman Zemin Çizgisi
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, canvas.height - 35, canvas.width, 35);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(0, canvas.height - 35, canvas.width, 4);
}

// 2. MAVİ & TURUNCU ÇİZGİLİ SEVİMLİ DİNOZOR
function drawDino() {
  ctx.save();
  ctx.translate(dino.x, dino.y);

  // Hıza göre rotasyon
  dino.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 5, dino.velocity * 0.07));
  ctx.rotate(dino.rotation);

  // A. Dinozor Ana Gövdesi (Mavi Zemin)
  ctx.fillStyle = '#0284c7';
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#38bdf8';
  ctx.beginPath();
  ctx.ellipse(0, 0, 19, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // B. Dinozorun Arkasındaki Minik Kuyruk
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.moveTo(-15, 3);
  ctx.lineTo(-26, 0);
  ctx.lineTo(-17, 9);
  ctx.closePath();
  ctx.fill();

  // C. DİNOZORUN TURUNCU ÇİZGİLERİ (Tiger / Rex Stripes)
  ctx.fillStyle = '#f97316';
  // Çizgi 1
  ctx.beginPath();
  ctx.moveTo(-9, -14);
  ctx.lineTo(-4, 0);
  ctx.lineTo(-12, -4);
  ctx.closePath();
  ctx.fill();

  // Çizgi 2
  ctx.beginPath();
  ctx.moveTo(1, -15);
  ctx.lineTo(6, -2);
  ctx.lineTo(-3, -3);
  ctx.closePath();
  ctx.fill();

  // Çizgi 3
  ctx.beginPath();
  ctx.moveTo(10, -11);
  ctx.lineTo(14, 2);
  ctx.lineTo(7, 0);
  ctx.closePath();
  ctx.fill();

  // D. Sırt Dikeni (Turuncu Dinozor Dikenleri)
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.moveTo(-14, -10);
  ctx.lineTo(-11, -19);
  ctx.lineTo(-6, -12);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-4, -13);
  ctx.lineTo(0, -21);
  ctx.lineTo(4, -13);
  ctx.closePath();
  ctx.fill();

  // E. Dinozorun Sevimli Kafası ve Ağzı
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(14, -6, 12, 0, Math.PI * 2);
  ctx.fill();

  // F. Büyük Sevimli Göz
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(15, -9, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(16.5, -9, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Göz Parıltısı
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(17.5, -10, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // F. Minik Turuncu Yanak Allığı
  ctx.fillStyle = 'rgba(249, 115, 22, 0.7)';
  ctx.beginPath();
  ctx.arc(13, -1, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // G. Zıplayan Dinozor Minik Kolları
  const armOffset = Math.sin(frames * 0.28) * 3;
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.ellipse(4, 5 + armOffset, 4, 2.5, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 3. RENK DEĞİŞTİREN ORMAN AĞAÇLARI (Her 2 Ağaçta Bir Yeni Renk Paleti)
function drawTrees() {
  trees.forEach(tree => {
    const theme = tree.theme;

    // Gövde Gradyanı (Ağaç Dokusu)
    const treeGrad = ctx.createLinearGradient(tree.x, 0, tree.x + TREE_WIDTH, 0);
    treeGrad.addColorStop(0, theme.trunk);
    treeGrad.addColorStop(0.35, theme.leaves);
    treeGrad.addColorStop(0.8, theme.trunkDark);
    treeGrad.addColorStop(1, theme.border);

    ctx.fillStyle = treeGrad;
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 2.5;

    // --- ÜST AĞAÇ SARKITI ---
    ctx.fillRect(tree.x, 0, TREE_WIDTH, tree.top);
    ctx.strokeRect(tree.x, 0, TREE_WIDTH, tree.top);

    // Ağaç Uç Tacı / Çalı Yaprağı (Üst)
    ctx.fillStyle = theme.leaves;
    ctx.beginPath();
    ctx.arc(tree.x + TREE_WIDTH / 2, tree.top - 6, TREE_WIDTH * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Üst Kapak
    ctx.fillStyle = treeGrad;
    ctx.fillRect(tree.x - 3, tree.top - 18, TREE_WIDTH + 6, 18);
    ctx.strokeRect(tree.x - 3, tree.top - 18, TREE_WIDTH + 6, 18);

    // --- ALT AĞAÇ GÖVDESİ ---
    const bottomY = tree.top + TREE_GAP;
    const bottomHeight = canvas.height - bottomY - 35;

    ctx.fillRect(tree.x, bottomY, TREE_WIDTH, bottomHeight);
    ctx.strokeRect(tree.x, bottomY, TREE_WIDTH, bottomHeight);

    // Ağaç Uç Tacı / Çalı Yaprağı (Alt)
    ctx.fillStyle = theme.leaves;
    ctx.beginPath();
    ctx.arc(tree.x + TREE_WIDTH / 2, bottomY + 6, TREE_WIDTH * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Alt Kapak
    ctx.fillStyle = treeGrad;
    ctx.fillRect(tree.x - 3, bottomY, TREE_WIDTH + 6, 18);
    ctx.strokeRect(tree.x - 3, bottomY, TREE_WIDTH + 6, 18);
  });
}

// ==========================================================
// OYUN DÖNGÜSÜ & HIZLANMA
// ==========================================================
let spawnTimer = 0;

function updateGame() {
  if (!isRunning) return;

  frames++;
  drawBackground();

  // Dinozor Yerçekimi
  dino.velocity += dino.gravity;
  dino.y += dino.velocity;

  // DİNAMİK HIZLANMA (Skor arttıkça ağaçlar adım adım hızlanır!)
  const speedBoost = Math.min(1.8, (score * 0.055)); // Skora göre kademeli hızlanma
  const treeSpeed = 2.4 + speedBoost;

  // Ağaç Geliş Sıklığı (Hızlandıkça aralık da dengeli ayarlanır)
  spawnTimer++;
  const currentInterval = Math.max(90, Math.floor(120 - (speedBoost * 14)));

  if (spawnTimer >= currentInterval) {
    spawnTimer = 0;
    treeCounter++;

    // HER 2 AĞAÇTA BİR RENK DEĞİŞİMİ
    const themeIndex = Math.floor((treeCounter - 1) / 2) % TREE_THEMES.length;
    const currentTheme = TREE_THEMES[themeIndex];

    const minTop = 60;
    const maxTop = canvas.height - TREE_GAP - 95;
    const randomTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

    trees.push({
      x: canvas.width,
      top: randomTop,
      theme: currentTheme,
      passed: false
    });
  }

  // Ağaçları İlerlet ve Çarpışmaları Kontrol Et
  for (let i = trees.length - 1; i >= 0; i--) {
    const t = trees[i];
    t.x -= treeSpeed;

    // Skor Artışı (Ağaç geçildiğinde)
    if (!t.passed && t.x + TREE_WIDTH < dino.x) {
      t.passed = true;
      score++;
      scoreDisplay.innerText = score;
    }

    // Çarpışma Testi
    if (dino.x + dino.radius > t.x && dino.x - dino.radius < t.x + TREE_WIDTH) {
      // Üst ağaç veya Alt ağaca çarpma
      if (dino.y - dino.radius + 3 < t.top || dino.y + dino.radius - 3 > t.top + TREE_GAP) {
        gameOver();
        return;
      }
    }

    // Ekran dışına çıkan ağacı temizle
    if (t.x + TREE_WIDTH < -20) {
      trees.splice(i, 1);
    }
  }

  // Zemine veya Tavana Çarpma
  if (dino.y + dino.radius >= canvas.height - 35 || dino.y - dino.radius <= 0) {
    gameOver();
    return;
  }

  drawTrees();
  drawDino();

  animationId = requestAnimationFrame(updateGame);
}

function startGame() {
  score = 0;
  scoreDisplay.innerText = '0';
  frames = 0;
  spawnTimer = 0;
  treeCounter = 0;

  dino.y = canvas.height / 2;
  dino.velocity = 0;
  dino.rotation = 0;

  trees = [];

  gameOverlay.classList.remove('active');
  isRunning = true;

  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(updateGame);
}

function gameOver() {
  isRunning = false;
  cancelAnimationFrame(animationId);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('flappyDinoHighScore', highScore);
    highScoreDisplay.innerText = highScore;
  }

  overlayTitle.innerText = 'DİNO DÜŞTÜ!';
  overlayDesc.innerHTML = `Ormandaki ağaca çarptın!<br><b>Skorun:</b> ${score} • <b>Rekorun:</b> ${highScore}`;
  startBtn.innerText = 'TEKRAR DENE';
  gameOverlay.classList.add('active');
}

startBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  startGame();
});

drawBackground();
drawDino();
