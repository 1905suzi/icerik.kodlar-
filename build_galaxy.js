const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '17-Galaksi-Kalp');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galaxy Gallery</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Arka plandaki dev uzay/tuval (Canvas) -->
    <canvas id="galaxyCanvas"></canvas>

    <!-- İlk açılan giriş ekranı -->
    <div class="card-container" id="startCard">
        <h1 class="title">Galaxy Gallery</h1>
        
        <!-- İnternetten çekilen Milk & Mocha sarılma GIF'i -->
        <div class="gif-container">
            <img src="https://media.tenor.com/zO4f_sQ4TtcAAAAi/milk-and-mocha-bear-hug.gif" alt="Sarılma" class="hugging-bears">
        </div>
        
        <p class="subtitle">PARA MI PRINCESITA</p>
        
        <button id="iniciarBtn" class="btn">INICIAR</button>
    </div>

    <!-- Finalde çıkacak devasa parlayan I LOVE YOU yazısı -->
    <div id="finalText" class="hidden">
        I love you
    </div>

    <script src="script.js"></script>
</body>
</html>`;

const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle at center, #1a0b2e 0%, #000000 100%);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
}

/* ================= KART TASARIMI ================= */
.card-container {
    position: relative;
    z-index: 10;
    background: rgba(20, 10, 40, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 40px 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 15px 35px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.05);
    transition: opacity 1s ease, transform 1s ease;
}

.card-container.fade-out {
    opacity: 0;
    transform: scale(0.9);
    pointer-events: none;
}

.title {
    color: #fff;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 20px;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 182, 255, 0.6);
    letter-spacing: 1px;
}

.gif-container {
    width: 180px;
    height: 180px;
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.hugging-bears {
    width: 100%;
    height: auto;
    border-radius: 10px;
    mix-blend-mode: screen; /* Siyah arkaplanlı GIF'ler için çok kullanışlıdır */
}

.subtitle {
    color: #e0c2ff;
    font-size: 11px;
    letter-spacing: 3px;
    margin-bottom: 30px;
    text-shadow: 0 0 5px rgba(224, 194, 255, 0.5);
}

.btn {
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 30px;
    padding: 10px 40px;
    font-size: 14px;
    letter-spacing: 2px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.btn:hover {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
    border-color: #fff;
}

/* ================= FİNAL YAZISI ================= */
#finalText {
    position: absolute;
    z-index: 5;
    color: #fff;
    font-size: 60px;
    font-weight: bold;
    text-align: center;
    letter-spacing: 5px;
    opacity: 0;
    transform: translateY(20px) scale(0.9);
    transition: opacity 2s ease, transform 2s ease;
    text-shadow: 0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 80px #ff00ff;
}

#finalText.show {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.hidden {
    display: none;
}`;

const js = `document.addEventListener('DOMContentLoaded', () => {
    const startCard = document.getElementById('startCard');
    const iniciarBtn = document.getElementById('iniciarBtn');
    const canvas = document.getElementById('galaxyCanvas');
    const ctx = canvas.getContext('2d');
    const finalText = document.getElementById('finalText');

    let w, h;
    let particles = [];
    let animationPhase = 0; // 0: Bekleme, 1: Patlama, 2: Galaksi Dönüşü, 3: Kalp Çıkışı
    let time = 0;

    // Ekran boyutunu ayarla
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Butona tıklandığında
    iniciarBtn.addEventListener('click', () => {
        startCard.classList.add('fade-out');
        setTimeout(() => {
            startCard.style.display = 'none';
            baslatAnimasyon();
        }, 1000);
    });

    function baslatAnimasyon() {
        animationPhase = 1;
        // Başlangıç parçacıklarını oluştur (Merkezden patlayan ilk yıldızlar)
        for (let i = 0; i < 500; i++) {
            particles.push(new Particle(1)); // Type 1: Patlama
        }
        loop();

        // 3 saniye sonra galaksi sarmalına geç
        setTimeout(() => {
            animationPhase = 2;
            for (let i = 0; i < 1500; i++) {
                particles.push(new Particle(2)); // Type 2: Galaksi
            }
        }, 3000);

        // 8 saniye sonra kalbi çıkar
        setTimeout(() => {
            animationPhase = 3;
            for (let i = 0; i < 800; i++) {
                particles.push(new Particle(3)); // Type 3: Kalp
            }
            
            // Yazıyı göster
            setTimeout(() => {
                finalText.classList.remove('hidden');
                setTimeout(() => {
                    finalText.classList.add('show');
                }, 50);
            }, 3000);
            
        }, 8000);
    }

    // Parçacık Sınıfı
    class Particle {
        constructor(type) {
            this.type = type;
            this.x = 0;
            this.y = 0;
            this.z = 0; // 3D Derinlik
            
            if (this.type === 1) {
                // Patlama tipi (küre şeklinde yayılım)
                const radius = Math.random() * 5 + 1;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                this.vx = radius * Math.sin(phi) * Math.cos(theta);
                this.vy = radius * Math.sin(phi) * Math.sin(theta);
                this.vz = radius * Math.cos(phi);
                this.color = \`hsl(\${Math.random() * 360}, 80%, 60%)\`;
                this.size = Math.random() * 3 + 1;
                this.life = 1;
            } 
            else if (this.type === 2) {
                // Galaksi sarmalı (spiral kollar)
                this.angle = Math.random() * Math.PI * 2;
                this.radius = Math.random() * 400 + 20; // Merkeze uzaklık
                this.speed = (200 / this.radius) * 0.01 + 0.002; // İçerisi daha hızlı döner
                
                // Spiral kollara dağılım
                const armOffset = (this.radius * 0.02);
                this.angle += (Math.random() > 0.5 ? armOffset : -armOffset);
                
                this.yOffset = (Math.random() - 0.5) * 20; // Disk kalınlığı
                
                // Mor, pembe, altın sarısı tonları
                const hue = 280 + Math.random() * 80; // 280 (mor) - 360 (kırmızı/pembe)
                this.color = \`hsl(\${hue}, 80%, \${Math.random() * 40 + 40}%)\`;
                this.size = Math.random() * 1.5 + 0.5;
            }
            else if (this.type === 3) {
                // 3D Kalp (Merkezden fışkıran)
                const t = Math.random() * Math.PI * 2;
                // Kalp formülü
                const hx = 16 * Math.pow(Math.sin(t), 3);
                const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
                
                // Dağılım ve hedef
                const scale = Math.random() * 8 + 8;
                this.targetX = hx * scale;
                this.targetY = hy * scale - 150; // Biraz yukarıda olsun
                this.targetZ = (Math.random() - 0.5) * 100;
                
                // Başlangıç noktası galaksi merkezi
                this.x = (Math.random() - 0.5) * 50;
                this.y = 0;
                this.z = (Math.random() - 0.5) * 50;
                
                this.color = '#ff1493'; // Canlı pembe
                this.size = Math.random() * 2 + 1;
                this.speed = Math.random() * 0.02 + 0.01;
            }
        }

        update() {
            if (this.type === 1) {
                this.x += this.vx;
                this.y += this.vy;
                this.z += this.vz;
                this.life -= 0.01;
                this.size *= 0.98;
            } 
            else if (this.type === 2) {
                this.angle += this.speed;
                this.x = Math.cos(this.angle) * this.radius;
                this.z = Math.sin(this.angle) * this.radius;
                this.y = this.yOffset + Math.sin(time + this.radius * 0.05) * 10; // Dalgalanma
            }
            else if (this.type === 3) {
                // Merkeze doğru yavaşça git (Interpolasyon - Lerp)
                this.x += (this.targetX - this.x) * this.speed;
                this.y += (this.targetY - this.y) * this.speed;
                this.z += (this.targetZ - this.z) * this.speed;
                
                // Kendi etrafında da yavaşça dönsün
                const cos = Math.cos(0.01);
                const sin = Math.sin(0.01);
                const nx = this.targetX * cos - this.targetZ * sin;
                const nz = this.targetZ * cos + this.targetX * sin;
                this.targetX = nx;
                this.targetZ = nz;
            }
        }

        draw() {
            if (this.type === 1 && this.life <= 0) return;

            // 3D Projeksiyon (Sihir burada)
            const fov = 350; // Görüş açısı (Yakınlaştırma/Uzaklaştırma)
            const viewZ = this.z + 400; // Kameradan uzaklık
            
            if (viewZ < 0) return; // Arkada kalanları çizme
            
            const scale = fov / viewZ;
            
            // Ekrana 2D olarak yansıt
            // Galaksi için Y eksenini basık gösteriyoruz (3D zemin efekti için)
            let projectedX = (this.x * scale) + w / 2;
            let projectedY;
            
            if(this.type === 2) {
                projectedY = (this.y * scale) + h / 2 + (this.z * 0.4); // Y'yi basıklaştırıp Z derinliği verdik
            } else {
                projectedY = (this.y * scale) + h / 2;
            }

            const projectedSize = this.size * scale;

            ctx.beginPath();
            ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            if (this.type === 1) {
                ctx.globalAlpha = this.life;
            } else {
                // Merkezdeki ve çok arkadaki parçacıkların parlaklığı
                ctx.globalAlpha = Math.min(1, scale * 1.5);
            }
            ctx.fill();
        }
    }

    function loop() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // Kuyruklu iz bırakmak için tam siyah yerine %15 siyah boyuyoruz
        ctx.fillRect(0, 0, w, h);

        time += 0.05;

        // Merkezde bir karadelik/parlama efekti
        if (animationPhase >= 2) {
            const glowSize = Math.sin(time) * 10 + 30;
            const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, glowSize);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.2, 'rgba(255, 105, 180, 0.5)'); // Pembe
            gradient.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.arc(w/2, h/2, glowSize, 0, Math.PI*2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        requestAnimationFrame(loop);
    }
});`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('17-Galaksi-Kalp created successfully!');
