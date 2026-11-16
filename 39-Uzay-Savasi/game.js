// Uzay Savaşı - HTML5 Canvas Motoru
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

// Oyun Durum Değişkenleri
let isRunning = false;
let score = 0;
let highScore = localStorage.getItem('spaceShooterHighScore') || 0;
highScoreDisplay.innerText = highScore;

let animationId;
let lastShotTime = 0;
let shotInterval = 180; // ms cinsinden ateşleme aralığı

// 1. DERİN UZAY YILDIZLARI (Derinlik ve Titreşen Işıklar)
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

// 2. OYUNCU UZAY GEMİSİ (Gri Gövde + Mavi Neon Detaylar)
const player = {
  x: canvas.width / 2,
  y: canvas.height - 90,
  width: 44,
  height: 54,
  targetX: canvas.width / 2,
  speed: 0.18, // Yumuşak takip (lerp)
  health: 100,
  maxHealth: 100,
  powerLevel: 1 // 1: Tek Lazer, 2: Çift Lazer
};

// Mermiler, Düşmanlar ve Patlama Parçacıkları
let lasers = [];
let enemies = [];
let particles = [];
let powerups = [];

// ==========================================================
// KONTROLLER (Mobil Dokunmatik + Masaüstü Fare & Klavye)
// ==========================================================
function updatePlayerPosition(clientX) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const relativeX = (clientX - rect.left) * scaleX;
  player.targetX = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, relativeX));
}

// Masaüstü Fare
canvas.addEventListener('mousemove', (e) => {
  if (isRunning) updatePlayerPosition(e.clientX);
});

// Mobil Dokunmatik
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

// Klavye Desteği
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

// 1. Yıldızlı Gökyüzü Çizimi (Sonsuz Akan Uzay Boşluğu)
function drawStars() {
  ctx.fillStyle = '#020408';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    // Parlama titreşimi
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

    // Yıldızları aşağı doğru kaydır
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });

  ctx.shadowBlur = 0;
}

// 2. Uzay Gemisi Çizimi (Gri Zırh & Mavi Işık/Neon Detaylar)
function drawPlayer() {
  // Yumuşak pozisyon geçişi (lerp)
  player.x += (player.targetX - player.x) * player.speed;

  const cx = player.x;
  const cy = player.y;

  ctx.save();
  ctx.translate(cx, cy);

  // Roket İtki Alevi (Mavi Plazma Parıltısı)
  const flameHeight = Math.random() * 14 + 16;
  const flameGrad = ctx.createLinearGradient(0, 20, 0, 20 + flameHeight);
  flameGrad.addColorStop(0, '#38bdf8');
  flameGrad.addColorStop(0.6, '#0284c7');
  flameGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = flameGrad;
  ctx.beginPath();
  ctx.moveTo(-7, 22);
  ctx.lineTo(0, 22 + flameHeight);
  ctx.lineTo(7, 22);
  ctx.closePath();
  ctx.fill();

  // Geminin Ana Gri Gövdesi (Titanyum Plaka)
  ctx.fillStyle = '#64748b'; // Orta Gri
  ctx.beginPath();
  ctx.moveTo(0, -26); // Burun
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

  // İç Gövde Katmanı (Daha Açık Metalik Gri)
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(9, 10);
  ctx.lineTo(-9, 10);
  ctx.closePath();
  ctx.fill();

  // MAVİ NEON DEKORLAR & KOKPİT (İstediğin Mavi Çizgiler)
  ctx.fillStyle = '#38bdf8';
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#00f0ff';

  // Kokpit Camı (Mavi Kristal)
  ctx.beginPath();
  ctx.ellipse(0, -4, 4, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Kanat Ucu Mavi Enerji Şeritleri
  ctx.fillRect(-18, 16, 3, 6);
  ctx.fillRect(15, 16, 3, 6);

  // Yan Mavi Paneller
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-6, 2);
  ctx.lineTo(-12, 14);
  ctx.moveTo(6, 2);
  ctx.lineTo(12, 14);
  ctx.stroke();

  // Kalkan Efekti (Hasar Alındığında veya Güçlü Durumda)
  if (player.health < 40) {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

// 3. Ateşlenen Mavi Lazerler
function drawLasers() {
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00f0ff';

  lasers.forEach((laser, index) => {
    laser.y -= laser.speed;

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(laser.x - 2, laser.y - 10, 4, 18);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(laser.x - 1, laser.y - 7, 2, 12);

    // Ekran dışına çıkanları sil
    if (laser.y < -20) {
      lasers.splice(index, 1);
    }
  });

  ctx.shadowBlur = 0;
}

// 4. Düşmanlar (Meteorlar ve Düşman Gemileri)
function drawEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;

    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    if (enemy.type === 'meteor') {
      // Dönen Kraterli Meteor
      enemy.rotation += 0.02;
      ctx.rotate(enemy.rotation);

      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
      ctx.fill();

      // Krater Detayı
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(-enemy.radius * 0.3, -enemy.radius * 0.2, enemy.radius * 0.25, 0, Math.PI * 2);
      ctx.arc(enemy.radius * 0.3, enemy.radius * 0.3, enemy.radius * 0.2, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Düşman Savaş Kruvazörü (Kırmızı Neon)
      ctx.fillStyle = '#e11d48';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#f43f5e';

      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.lineTo(16, -12);
      ctx.lineTo(0, -6);
      ctx.lineTo(-16, -12);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffe4e6';
      ctx.fillRect(-2, -4, 4, 8);
    }

    ctx.restore();

    // Ekranın altına geçen düşman
    if (enemy.y > canvas.height + 40) {
      enemies.splice(index, 1);
    }
  });
}

// 5. Patlama Parçacıkları (Neon Sparkles)
function drawParticles() {
  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.025;

    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    if (p.alpha <= 0) {
      particles.splice(index, 1);
    }
  });
  ctx.globalAlpha = 1.0;
}

// 6. Güçlendirme Küpleri (Power-up)
function drawPowerups() {
  powerups.forEach((pu, index) => {
    pu.y += 1.6;

    ctx.save();
    ctx.translate(pu.x, pu.y);
    ctx.fillStyle = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#00f0ff';

    ctx.fillRect(-10, -10, 20, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('2X', 0, 0);

    ctx.restore();

    if (pu.y > canvas.height + 20) {
      powerups.splice(index, 1);
    }
  });
}

// Patlama Efekti Oluşturucu
function createExplosion(x, y, color = '#38bdf8') {
  for (let i = 0; i < 18; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 3 + 1,
      color: Math.random() > 0.4 ? color : '#ffffff',
      alpha: 1.0
    });
  }
}

// ==========================================================
// OYUN DÖNGÜSÜ & MANTIK
// ==========================================================
let enemySpawnTimer = 0;

function updateGame(timestamp) {
  if (!isRunning) return;

  drawStars();

  // Otomatik Ateşleme Sistemi
  if (timestamp - lastShotTime > shotInterval) {
    if (player.powerLevel === 1) {
      lasers.push({ x: player.x, y: player.y - 20, speed: 11 });
    } else {
      // Çift Lazer
      lasers.push({ x: player.x - 12, y: player.y - 16, speed: 11 });
      lasers.push({ x: player.x + 12, y: player.y - 16, speed: 11 });
    }
    lastShotTime = timestamp;
  }

  // Düşman Üretimi (Zamanla Zorlaşan)
  enemySpawnTimer++;
  const spawnRate = Math.max(35, 75 - Math.floor(score / 80));
  if (enemySpawnTimer % spawnRate === 0) {
    const isMeteor = Math.random() > 0.35;
    enemies.push({
      x: Math.random() * (canvas.width - 60) + 30,
      y: -30,
      type: isMeteor ? 'meteor' : 'ship',
      radius: isMeteor ? (Math.random() * 12 + 16) : 18,
      speed: Math.random() * 2 + 2.2,
      rotation: 0
    });
  }

  // Çarpışma Testi (Lazer vs Düşman)
  lasers.forEach((laser, lIdx) => {
    enemies.forEach((enemy, eIdx) => {
      const dist = Math.hypot(laser.x - enemy.x, laser.y - enemy.y);
      if (dist < enemy.radius + 6) {
        // Vuruldu!
        createExplosion(enemy.x, enemy.y, enemy.type === 'meteor' ? '#94a3b8' : '#f43f5e');
        
        // Puan
        score += enemy.type === 'meteor' ? 10 : 25;
        scoreDisplay.innerText = score;

        // Şans eseri Power-up düşür
        if (Math.random() < 0.12) {
          powerups.push({ x: enemy.x, y: enemy.y });
        }

        lasers.splice(lIdx, 1);
        enemies.splice(eIdx, 1);
      }
    });
  });

  // Çarpışma Testi (Oyuncu vs Düşman)
  enemies.forEach((enemy, eIdx) => {
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist < enemy.radius + 18) {
      // Oyuncu hasar aldı!
      createExplosion(enemy.x, enemy.y, '#ef4444');
      enemies.splice(eIdx, 1);
      
      player.health -= 25;
      updateHealthUI();

      if (player.health <= 0) {
        gameOver();
      }
    }
  });

  // Çarpışma Testi (Oyuncu vs Power-up)
  powerups.forEach((pu, puIdx) => {
    const dist = Math.hypot(player.x - pu.x, player.y - pu.y);
    if (dist < 28) {
      createExplosion(pu.x, pu.y, '#00f0ff');
      player.powerLevel = 2; // Çift lazere geç
      powerups.splice(puIdx, 1);
      
      // 8 saniye sonra tek lazere dön
      setTimeout(() => {
        player.powerLevel = 1;
      }, 8000);
    }
  });

  drawPowerups();
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
  enemies = [];
  particles = [];
  powerups = [];

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

  // Rekor kontrolü
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('spaceShooterHighScore', highScore);
    highScoreDisplay.innerText = highScore;
  }

  overlayTitle.innerText = 'GÖREV BAŞARISIZ';
  overlayDesc.innerHTML = `Uzay gemisi imha edildi!<br><b>Skorun:</b> ${score} • <b>Rekorun:</b> ${highScore}`;
  startBtn.innerText = 'YENİDEN DENE';
  gameOverlay.classList.add('active');
}

startBtn.addEventListener('click', startGame);

// İlk ekran için arka planı bir kere çiz
drawStars();
