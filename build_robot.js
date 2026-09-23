const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '13-Robot-Kalp-Firlatma');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robot Kalp Fırlatma</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Sevimli Robot -->
    <div class="robot">
        <!-- Anten -->
        <div class="anten">
            <div class="anten-top"></div>
            <div class="anten-cubuk"></div>
        </div>
        <!-- Kafa -->
        <div class="kafa">
            <div class="goz sol-goz">
                <div class="goz-bebegi"></div>
            </div>
            <div class="goz sag-goz">
                <div class="goz-bebegi"></div>
            </div>
            <div class="agiz"></div>
        </div>
        <!-- Gövde -->
        <div class="govde">
            <div class="kalp-logo">❤️</div>
        </div>
        <!-- Kollar -->
        <div class="kol sol-kol"></div>
        <div class="kol sag-kol"></div>
        <!-- Ayaklar -->
        <div class="ayak sol-ayak"></div>
        <div class="ayak sag-ayak"></div>
    </div>

    <!-- Büyük kalp şekli burada oluşacak -->
    <div class="kalp-alani" id="kalpAlani"></div>

    <!-- Uçuşan kalpler buraya eklenecek -->
    <div id="ucusanKalpler"></div>

    <script src="script.js"></script>
</body>
</html>`;

const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    width: 100vw;
    height: 100vh;
    background: #0a0a1a;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

/* ============ SEVİMLİ ROBOT ============ */
.robot {
    position: absolute;
    left: 12%;
    bottom: 25%;
    z-index: 10;
    animation: robotZipla 1.5s ease-in-out infinite;
}

@keyframes robotZipla {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}

/* Anten */
.anten {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.anten-top {
    width: 14px;
    height: 14px;
    background: #ff4d6d;
    border-radius: 50%;
    box-shadow: 0 0 12px #ff4d6d, 0 0 25px #ff4d6d;
    animation: antenParlama 1s ease-in-out infinite alternate;
}

@keyframes antenParlama {
    0% { box-shadow: 0 0 8px #ff4d6d; }
    100% { box-shadow: 0 0 20px #ff4d6d, 0 0 40px #ff4d6d; }
}

.anten-cubuk {
    width: 4px;
    height: 15px;
    background: #b0b0b0;
    border-radius: 2px;
}

/* Kafa */
.kafa {
    width: 90px;
    height: 70px;
    background: linear-gradient(135deg, #c0c0c0, #8a8a8a);
    border-radius: 18px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    border: 2px solid #a0a0a0;
}

.goz {
    width: 22px;
    height: 26px;
    background: #1a1a2e;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.goz-bebegi {
    width: 10px;
    height: 10px;
    background: #00e5ff;
    border-radius: 50%;
    box-shadow: 0 0 8px #00e5ff;
    animation: gozKirp 3s ease-in-out infinite;
}

@keyframes gozKirp {
    0%, 45%, 55%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.1); }
}

.agiz {
    position: absolute;
    bottom: 12px;
    width: 28px;
    height: 12px;
    border-bottom: 3px solid #00e5ff;
    border-radius: 0 0 14px 14px;
}

/* Gövde */
.govde {
    width: 70px;
    height: 65px;
    background: linear-gradient(135deg, #b0b0b0, #7a7a7a);
    border-radius: 12px;
    margin: 4px auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #909090;
    position: relative;
}

.kalp-logo {
    font-size: 22px;
    animation: kalpAt 1s ease-in-out infinite;
}

@keyframes kalpAt {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); }
}

/* Kollar */
.kol {
    width: 14px;
    height: 40px;
    background: linear-gradient(135deg, #b0b0b0, #8a8a8a);
    border-radius: 8px;
    position: absolute;
    border: 2px solid #909090;
}

.sol-kol {
    left: -10px;
    top: 115px;
    transform-origin: top center;
    animation: solKolSalla 2s ease-in-out infinite;
}

@keyframes solKolSalla {
    0%, 100% { transform: rotate(5deg); }
    50% { transform: rotate(-5deg); }
}

.sag-kol {
    right: -10px;
    top: 105px;
    transform-origin: top center;
    animation: sagKolFirlat 2s ease-in-out infinite;
}

@keyframes sagKolFirlat {
    0%, 60% { transform: rotate(-5deg); }
    75% { transform: rotate(-45deg); }
    100% { transform: rotate(-5deg); }
}

/* Ayaklar */
.ayak {
    width: 24px;
    height: 14px;
    background: linear-gradient(135deg, #909090, #707070);
    border-radius: 6px 6px 10px 10px;
    position: absolute;
    bottom: -14px;
    border: 2px solid #808080;
}

.sol-ayak { left: 10px; }
.sag-ayak { right: 10px; }

/* ============ KALP ALANI (Büyük Kalp Şekli) ============ */
.kalp-alani {
    position: absolute;
    right: 12%;
    top: 50%;
    transform: translateY(-50%);
    width: 280px;
    height: 280px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
}

/* Her bir mini kalp */
.mini-kalp {
    position: absolute;
    font-size: 18px;
    opacity: 0;
    filter: drop-shadow(0 0 4px rgba(255, 77, 109, 0.6));
}

.mini-kalp.gorunur {
    animation: kalpBelir 0.5s ease-out forwards;
}

@keyframes kalpBelir {
    0% {
        opacity: 0;
        transform: scale(0) rotate(-20deg);
    }
    60% {
        transform: scale(1.3) rotate(5deg);
    }
    100% {
        opacity: 1;
        transform: scale(1) rotate(0deg);
    }
}

/* Robottan çıkan uçuşan kalpler */
.ucusan-kalp {
    position: absolute;
    font-size: 16px;
    pointer-events: none;
    z-index: 5;
    animation: ucus 1.2s ease-out forwards;
}

@keyframes ucus {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    80% {
        opacity: 0.8;
    }
    100% {
        opacity: 0;
        transform: scale(0.5);
    }
}

/* Arka plan parıltıları */
body::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 30% 50%, rgba(255, 77, 109, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 75% 45%, rgba(255, 77, 109, 0.08) 0%, transparent 40%);
    pointer-events: none;
}`;

const js = `document.addEventListener("DOMContentLoaded", () => {
    const kalpAlani = document.getElementById('kalpAlani');
    const ucusanDiv = document.getElementById('ucusanKalpler');
    const robot = document.querySelector('.robot');

    // Kalp şeklinin matematiksel koordinatları (küçük kalplerin dizilim noktaları)
    const kalpNoktalari = [];

    // Parametrik kalp denklemi ile noktaları hesaplayalım
    const merkezX = 140;
    const merkezY = 130;
    const olcek = 9;

    for (let t = 0; t < Math.PI * 2; t += 0.15) {
        const x = olcek * 16 * Math.pow(Math.sin(t), 3);
        const y = -olcek * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        kalpNoktalari.push({ x: merkezX + x, y: merkezY + y });
    }

    // İç kısma da kalpler ekleyelim (daha küçük ölçekle)
    for (let s = 0.45; s <= 0.8; s += 0.35) {
        for (let t = 0; t < Math.PI * 2; t += 0.25) {
            const x = olcek * s * 16 * Math.pow(Math.sin(t), 3);
            const y = -olcek * s * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            kalpNoktalari.push({ x: merkezX + x, y: merkezY + y });
        }
    }

    let siradakiKalp = 0;

    // Robottan kalp fırlatma ve büyük kalbe yerleştirme
    function kalpFirlat() {
        if (siradakiKalp >= kalpNoktalari.length) {
            // Hepsi yerleşti, birkaç saniye bekle ve tekrar başla
            setTimeout(() => {
                // Eski kalpleri sil
                kalpAlani.innerHTML = '';
                siradakiKalp = 0;
                kalpFirlat();
            }, 3000);
            return;
        }

        const nokta = kalpNoktalari[siradakiKalp];

        // 1. Robotun elinden çıkan uçuşan kalp efekti
        const ucusan = document.createElement('div');
        ucusan.className = 'ucusan-kalp';
        ucusan.textContent = '❤️';

        // Robotun sağ kolunun konumundan başlasın
        const robotRect = robot.getBoundingClientRect();
        const startX = robotRect.right - 10;
        const startY = robotRect.top + 60;

        // Kalp alanının konumu
        const alanRect = kalpAlani.getBoundingClientRect();
        const hedefX = alanRect.left + nokta.x;
        const hedefY = alanRect.top + nokta.y;

        ucusan.style.left = startX + 'px';
        ucusan.style.top = startY + 'px';

        // Uçuş animasyonu (robottan hedefe)
        ucusan.animate([
            { left: startX + 'px', top: startY + 'px', opacity: 1, transform: 'scale(1)' },
            { left: hedefX + 'px', top: hedefY + 'px', opacity: 0.3, transform: 'scale(0.6)' }
        ], {
            duration: 600,
            easing: 'ease-out',
            fill: 'forwards'
        });

        ucusanDiv.appendChild(ucusan);

        // Uçuş bitince uçuşan kalbi sil ve hedefte mini kalbi göster
        setTimeout(() => {
            ucusan.remove();

            // 2. Hedef noktada mini kalp belirsin
            const miniKalp = document.createElement('div');
            miniKalp.className = 'mini-kalp';
            miniKalp.textContent = '❤️';
            miniKalp.style.left = nokta.x + 'px';
            miniKalp.style.top = nokta.y + 'px';

            kalpAlani.appendChild(miniKalp);

            // Animasyonu tetikle
            requestAnimationFrame(() => {
                miniKalp.classList.add('gorunur');
            });
        }, 550);

        siradakiKalp++;

        // Bir sonraki kalbi fırlat (hız ayarı)
        setTimeout(kalpFirlat, 120);
    }

    // Başlat!
    setTimeout(kalpFirlat, 1000);
});`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('13-Robot-Kalp-Firlatma created successfully!');
