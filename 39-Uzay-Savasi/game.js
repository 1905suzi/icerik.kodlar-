// Uzay Savaşı - Gelişmiş Düşmanlar, Ateş Eden Gemiler ve Can Paketi Motoru
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('scoreDisplay');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const healthFill = document.getElementById('healthFill');
const healthText = document.getElementById('healthText');
const gameOverlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayDesc = document.getElementById('overlayDesc');
const startBtn = document.getElementById('startBtn');

let isRunning = false;
let score = 0;
let highScore = localStorage.getItem('spaceShooterHighScore') || 0;
highScoreDisplay.innerText = highScore;

let animationId;
let lastShotTime = 0;
let shotInterval = 170; // ms

// 1. DERİN UZAY YILDIZLARI (Akan & Parlayan)
const stars = [];
const STAR_COUNT = 90;

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.8 + 0.5,
    speed: Math.random() * 2 + 0.6,
    brightness: Math.random() * 0.8 + 0.2,
    twinkleSpeed: Math.random() * 0.05 + 0.01
  });
}

// 2. OYUNCU UZAY GEMİSİ (Gri Gövde + Mavi Neon)
const player = {
  x: canvas.width / 2,
  y: canvas.height - 90,
  width: 44,
  height: 54,
  targetX: canvas.width / 2,
  speed: 0.18,
  health: 100,
  maxHealth: 100,
  powerLevel: 1 // 1: Tek, 2: Çift Lazer
};

// Varlık Havuzları
let lasers = [];            // Oyuncunun sıktığı mavi lazerler
let enemyLasers = [];       // Düşman gemilerinin sıktığı kırmızı plazmalar
let enemies = [];           // Meteorlar, Avcılar, Zırhlı Gemiler
let particles = [];         // Patlama parçacıkları
let items = [];             // Can Paketi (Yeşil) ve 2X Lazer (Mavi)

// ==========================================================
// KONTROLLER
// ==========================================================
function updatePlayerPosition(clientX) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const relativeX = (clientX - rect.left) * scaleX;
  player.targetX = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, relativeX));
}

canvas.addEventListener('mousemove', (e) => {
  if (isRunning) updatePlayerPosition(e.clientX);
});

canvas.addEventListener('touchmove', (e) => {
  if (isRunning && e.touches.length > 0) {
    e.preventDefault();
    updatePlayerPosition(e.touches[0].clientX);
  }
}, { passive: false });

canvas.addEventListener('touchstart', (e) => {
  if (isRunning && e.touches.length > 0) {
    updatePlayerPosition(e.touches[0].clientX);
  }
}, { passive: true });

window.addEventListener('keydown', (e) => {
  if (!isRunning) return;
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    player.targetX = Math.max(player.width / 2, player.targetX - 28);
  } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    player.targetX = Math.min(canvas.width - player.width / 2, player.targetX + 28);
  }
});

// ==========================================================
// ÇİZİM FONKSİYONLARI
// ==========================================================

function drawStars() {
  ctx.fillStyle = '#020408';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    star.brightness += star.twinkleSpeed;
    if (star.brightness > 1 || star.brightness < 0.2) {
      star.twinkleSpeed = -star.twinkleSpeed;
    }

    ctx.fillStyle = `rgba(224, 242, 254, ${Math.max(0.1, Math.min(1, star.brightness))})`;
    ctx.shadowBlur = star.size > 1.2 ? 4 : 0;
    ctx.shadowColor = '#38bdf8';
    
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();

    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });

  ctx.shadowBlur = 0;
}

// Oyuncu Gemisi
function drawPlayer() {
  player.x += (player.targetX - player.x) * player.speed;

  ctx.save();
  ctx.translate(player.x, player.y);

  // Mavi Roket Ateşi
  const flameH = Math.random() * 14 + 16;
  const flameGrad = ctx.createLinearGradient(0, 20, 0, 20 + flameH);
  flameGrad.addColorStop(0, '#38bdf8');
  flameGrad.addColorStop(0.6, '#0284c7');
  flameGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = flameGrad;
  ctx.beginPath();
  ctx.moveTo(-7, 22);
  ctx.lineTo(0, 22 + flameH);
  ctx.lineTo(7, 22);
  ctx.closePath();
  ctx.fill();

  // Titanyum Gri Gövde
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.moveTo(0, -26);
  ctx.lineTo(16, 12);
  ctx.lineTo(22, 22);
  ctx.lineTo(10, 22);
  ctx.lineTo(6, 16);
  ctx.lineTo(-6, 16);
  ctx.lineTo(-10, 22);
  ctx.lineTo(-22, 22);
  ctx.lineTo(-16, 12);
  ctx.closePath();
  ctx.fill();

  // Açık Gri Zırh Plakaları
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(9, 10);
  ctx.lineTo(-9, 10);
  ctx.closePath();
  ctx.fill();

  // Neon Mavi Detaylar & Kokpit
  ctx.fillStyle = '#38bdf8';
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#00f0ff';

  ctx.beginPath();
  ctx.ellipse(0, -4, 4, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillRect(-18, 16, 3, 6);
  ctx.fillRect(15, 16, 3, 6);

  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-6, 2);
  ctx.lineTo(-12, 14);
  ctx.moveTo(6, 2);
  ctx.lineTo(12, 14);
  ctx.stroke();

  // Kalkan Dairesi
  ctx.strokeStyle = player.health < 35 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.25)';
  ctx.beginPath();
  ctx.arc(0, 0, 29, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// Oyuncu Mavi Lazerleri
function drawLasers() {
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00f0ff';

  lasers.forEach((l, idx) => {
    l.y -= l.speed;

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(l.x - 2, l.y - 10, 4, 18);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(l.x - 1, l.y - 7, 2, 12);

    if (l.y < -20) lasers.splice(idx, 1);
  });

  ctx.shadowBlur = 0;
}

// Düşman Kırmızı Lazerleri
function drawEnemyLasers() {
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#ef4444';

  enemyLasers.forEach((el, idx) => {
    el.y += el.speed;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(el.x, el.y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef2f2';
    ctx.beginPath();
    ctx.arc(el.x, el.y, 2, 0, Math.PI * 2);
    ctx.fill();

    if (el.y > canvas.height + 20) enemyLasers.splice(idx, 1);
  });

  ctx.shadowBlur = 0;
}

// Çeşitli Düşmanlar (Meteor, Hızlı Avcı, Ateş Eden Ağır Kruvazör)
function drawEnemies() {
  enemies.forEach((enemy, idx) => {
    enemy.y += enemy.speed;

    // Ateş Eden Düşman Gemisi Mantığı
    if (enemy.canShoot) {
      enemy.shootTimer++;
      if (enemy.shootTimer >= enemy.shootInterval) {
        enemy.shootTimer = 0;
        enemyLasers.push({
          x: enemy.x,
          y: enemy.y + enemy.radius + 4,
          speed: 4.8
        });
      }
    }

    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    if (enemy.type === 'meteor') {
      // 1. DÖNEN DEV METEOR TAŞI
      enemy.rotation += 0.015;
      ctx.rotate(enemy.rotation);

      ctx.fillStyle = '#52525b';
      ctx.beginPath();
      ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
      ctx.fill();

      // Kraterler
      ctx.fillStyle = '#27272a';
      ctx.beginPath();
      ctx.arc(-enemy.radius * 0.35, -enemy.radius * 0.2, enemy.radius * 0.28, 0, Math.PI * 2);
      ctx.arc(enemy.radius * 0.25, enemy.radius * 0.3, enemy.radius * 0.22, 0, Math.PI * 2);
      ctx.arc(enemy.radius * 0.1, -enemy.radius * 0.4, enemy.radius * 0.18, 0, Math.PI * 2);
      ctx.fill();

    } else if (enemy.type === 'fighter') {
      // 2. HIZLI AVCI GEMİ (Mor/Kırmızı Çift Kanatlı)
      ctx.fillStyle = '#dc2626';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#f87171';

      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.lineTo(16, -12);
      ctx.lineTo(0, -6);
      ctx.lineTo(-16, -12);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-2, -2, 4, 6);

    } else if (enemy.type === 'cruiser') {
      // 3. ATEŞ EDEN AĞIR SAVAŞ KRUVAZÖRÜ (Kırmızı Zırhlı & Çift Toplu)
      ctx.fillStyle = '#991b1b';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ef4444';

      ctx.beginPath();
      ctx.moveTo(0, 22);
      ctx.lineTo(22, -8);
      ctx.lineTo(14, -18);
      ctx.lineTo(-14, -18);
      ctx.lineTo(-22, -8);
      ctx.closePath();
      ctx.fill();

      // Lazer Namluları
      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(-12, 10, 4, 8);
      ctx.fillRect(8, 10, 4, 8);
    }

    ctx.restore();

    if (enemy.y > canvas.height + 50) {
      enemies.splice(idx, 1);
    }
  });
}

// Düşen Eşyalar (Yeşil Can Paketi + Mavi Çift Lazer)
function drawItems() {
  items.forEach((item, idx) => {
    item.y += 1.8;

    ctx.save();
    ctx.translate(item.x, item.y);

    if (item.type === 'heal') {
      // YEŞİL CAN PAKETİ (+)
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#22c55e';
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();

      // Beyaz Artı
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2, -7, 4, 14);
      ctx.fillRect(-7, -2, 14, 4);

    } else {
      // MAVİ 2X ÇİFT LAZER KÜPÜ
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#00f0ff';
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-11, -11, 22, 22);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('2X', 0, 0);
    }

    ctx.restore();

    if (item.y > canvas.height + 30) {
      items.splice(idx, 1);
    }
  });
}

// Patlama Parçacıkları
function drawParticles() {
  particles.forEach((p, idx) => {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.025;

    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    if (p.alpha <= 0) particles.splice(idx, 1);
  });
  ctx.globalAlpha = 1.0;
}

function createExplosion(x, y, color = '#38bdf8', count = 18) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4.5 + 1;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 3 + 1,
      color: Math.random() > 0.35 ? color : '#ffffff',
      alpha: 1.0
    });
  }
}

// ==========================================================
// OYUN DÖNGÜSÜ
// ==========================================================
let spawnTimer = 0;

function updateGame(timestamp) {
  if (!isRunning) return;

  drawStars();

  // Otomatik Ateşleme
  if (timestamp - lastShotTime > shotInterval) {
    if (player.powerLevel === 1) {
      lasers.push({ x: player.x, y: player.y - 20, speed: 11 });
    } else {
      lasers.push({ x: player.x - 12, y: player.y - 16, speed: 11 });
      lasers.push({ x: player.x + 12, y: player.y - 16, speed: 11 });
    }
    lastShotTime = timestamp;
  }

  // Düşman Üretim Döngüsü (Meteor, Hızlı Avcı veya Ateş Eden Kruvazör)
  spawnTimer++;
  const spawnRate = Math.max(38, 70 - Math.floor(score / 90));
  if (spawnTimer % spawnRate === 0) {
    const roll = Math.random();
    let enemyType = 'meteor';
    let canShoot = false;
    let radius = 18;
    let speed = 2.4;

    if (roll < 0.45) {
      // Meteor
      enemyType = 'meteor';
      radius = Math.random() * 12 + 16;
      speed = Math.random() * 2 + 1.8;
    } else if (roll < 0.8) {
      // Hızlı Avcı Gemi
      enemyType = 'fighter';
      radius = 16;
      speed = Math.random() * 1.5 + 3.2;
    } else {
      // Ateş Eden Ağır Kruvazör
      enemyType = 'cruiser';
      canShoot = true;
      radius = 22;
      speed = 1.6;
    }

    enemies.push({
      x: Math.random() * (canvas.width - 60) + 30,
      y: -35,
      type: enemyType,
      radius: radius,
      speed: speed,
      rotation: 0,
      canShoot: canShoot,
      shootTimer: 0,
      shootInterval: Math.floor(Math.random() * 30 + 55)
    });
  }

  // Çarpışma: Oyuncu Lazeri vs Düşman
  lasers.forEach((laser, lIdx) => {
    enemies.forEach((enemy, eIdx) => {
      const dist = Math.hypot(laser.x - enemy.x, laser.y - enemy.y);
      if (dist < enemy.radius + 6) {
        createExplosion(enemy.x, enemy.y, enemy.type === 'meteor' ? '#a1a1aa' : '#ef4444');

        // Skor
        score += enemy.type === 'meteor' ? 10 : (enemy.canShoot ? 35 : 20);
        scoreDisplay.innerText = score;

        // EŞYA DÜŞME ŞANSI (%18)
        const dropRoll = Math.random();
        if (dropRoll < 0.08) {
          // Can Paketi Düşür!
          items.push({ x: enemy.x, y: enemy.y, type: 'heal' });
        } else if (dropRoll < 0.18) {
          // Çift Lazer Düşür!
          items.push({ x: enemy.x, y: enemy.y, type: 'power' });
        }

        lasers.splice(lIdx, 1);
        enemies.splice(eIdx, 1);
      }
    });
  });

  // Çarpışma: Düşman Kırmızı Lazeri vs Oyuncu
  enemyLasers.forEach((el, elIdx) => {
    const dist = Math.hypot(player.x - el.x, player.y - el.y);
    if (dist < 24) {
      createExplosion(el.x, el.y, '#ef4444', 12);
      enemyLasers.splice(elIdx, 1);

      player.health -= 15;
      updateHealthUI();

      if (player.health <= 0) gameOver();
    }
  });

  // Çarpışma: Düşman Gövdesi vs Oyuncu
  enemies.forEach((enemy, eIdx) => {
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist < enemy.radius + 18) {
      createExplosion(enemy.x, enemy.y, '#ef4444', 24);
      enemies.splice(eIdx, 1);

      player.health -= enemy.type === 'meteor' ? 25 : 30;
      updateHealthUI();

      if (player.health <= 0) gameOver();
    }
  });

  // Çarpışma: Oyuncu vs Eşyalar (Can veya Güç)
  items.forEach((item, iIdx) => {
    const dist = Math.hypot(player.x - item.x, player.y - item.y);
    if (dist < 26) {
      if (item.type === 'heal') {
        // Can Toplama (+35 Can)
        player.health = Math.min(100, player.health + 35);
        updateHealthUI();
        createExplosion(item.x, item.y, '#22c55e', 20);
      } else {
        // Çift Lazer (8 Saniye)
        player.powerLevel = 2;
        createExplosion(item.x, item.y, '#00f0ff', 20);
        setTimeout(() => { player.powerLevel = 1; }, 8000);
      }
      items.splice(iIdx, 1);
    }
  });

  drawItems();
  drawEnemyLasers();
  drawLasers();
  drawEnemies();
  drawParticles();
  drawPlayer();

  animationId = requestAnimationFrame(updateGame);
}

function updateHealthUI() {
  const pct = Math.max(0, player.health);
  healthFill.style.width = pct + '%';
  healthText.innerText = pct + '% KALKAN';

  if (pct > 50) {
    healthFill.style.background = 'linear-gradient(90deg, #0284c7, #38bdf8)';
  } else if (pct > 25) {
    healthFill.style.background = 'linear-gradient(90deg, #d97706, #fbbf24)';
  } else {
    healthFill.style.background = 'linear-gradient(90deg, #b91c1c, #ef4444)';
  }
}

function startGame() {
  score = 0;
  player.health = 100;
  player.powerLevel = 1;
  player.x = canvas.width / 2;
  player.targetX = canvas.width / 2;

  lasers = [];
  enemyLasers = [];
  enemies = [];
  particles = [];
  items = [];

  scoreDisplay.innerText = '0';
  updateHealthUI();

  gameOverlay.classList.remove('active');
  isRunning = true;
  lastShotTime = performance.now();

  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(updateGame);
}

function gameOver() {
  isRunning = false;
  cancelAnimationFrame(animationId);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('spaceShooterHighScore', highScore);
    highScoreDisplay.innerText = highScore;
  }

  overlayTitle.innerText = 'GÖREV BAŞARISIZ';
  overlayDesc.innerHTML = `Uzay gemisi vuruldu!<br><b>Skorun:</b> ${score} • <b>Rekorun:</b> ${highScore}`;
  startBtn.innerText = 'TEKRAR DENE';
  gameOverlay.classList.add('active');
}

startBtn.addEventListener('click', startGame);

drawStars();
