const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '14-3D-Acan-Gul');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Açan Gül</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Gül Sahnesi (3D Perspektif Alanı) -->
    <div class="scene">
        <!-- Tüm gül yapısı -->
        <div class="rose-container">
            
            <!-- Gülün baş kısmı (Yaprakların ekleneceği yer) -->
            <div class="flower-head" id="flowerHead">
                <!-- Yapraklar JS ile buraya eklenecek -->
            </div>
            
            <!-- Gülün sapı -->
            <div class="stem">
                <!-- Dikenler / Yapraklar -->
                <div class="leaf leaf-left"></div>
                <div class="leaf leaf-right"></div>
            </div>
            
        </div>
    </div>

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
    background: #050002;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    /* Kırmızımsı arka plan ambiyansı (fotoğraftaki gibi) */
    background-image: radial-gradient(circle at center, rgba(120, 10, 20, 0.4) 0%, transparent 60%);
}

/* Yukarıdan süzülen kırmızı ışık parçacıkları (isteğe bağlı estetik) */
body::after {
    content: '';
    position: absolute;
    top: 20%;
    width: 10px; height: 10px;
    background: rgba(255, 0, 50, 0.5);
    border-radius: 50%;
    filter: blur(4px);
    box-shadow: 100px -50px 20px rgba(255, 0, 50, 0.3), -80px -100px 15px rgba(255, 0, 50, 0.4);
}

.scene {
    perspective: 1200px; /* 3D derinlik */
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.rose-container {
    position: relative;
    transform-style: preserve-3d;
    transform: rotateX(15deg) rotateY(0deg);
    animation: roseRotate 15s linear infinite;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Gülün kendi etrafında yavaşça dönmesi */
@keyframes roseRotate {
    from { transform: rotateX(15deg) rotateY(0deg); }
    to { transform: rotateX(15deg) rotateY(360deg); }
}

/* Çiçek başı (Yaprakların merkezi) */
.flower-head {
    position: relative;
    width: 0;
    height: 0;
    transform-style: preserve-3d;
    z-index: 10;
}

/* Taç Yapraklar (Petals) Ortak Stilleri */
.petal {
    position: absolute;
    bottom: 0;
    left: -50%;
    transform-origin: bottom center;
    background: linear-gradient(to top, #6b0000 0%, #d4001c 40%, #ff1c3b 100%);
    border-radius: 50% 50% 20% 20% / 60% 60% 20% 20%;
    box-shadow: inset 0 0 15px rgba(0,0,0,0.5), 0 0 10px rgba(255,0,0,0.3);
    /* Başlangıçta tamamen kapalı (gonca) */
    transform: rotateY(var(--angle)) rotateX(5deg) scale(0);
    opacity: 0;
}

/* Yaprağın dışa doğru bükülmesi (Bloom Animasyonu) */
@keyframes bloomAnim {
    0% {
        transform: rotateY(var(--angle)) rotateX(5deg) scale(0);
        opacity: 0;
    }
    20% {
        opacity: 1;
    }
    100% {
        transform: rotateY(var(--angle)) rotateX(var(--curl)) scale(var(--scale));
        opacity: 1;
    }
}

/* Sap (Gövde) */
.stem {
    position: absolute;
    top: -10px; /* Çiçek başının hemen altına hizala */
    width: 12px;
    height: 250px;
    background: linear-gradient(to right, #0a3314, #1b5e20, #0a3314);
    border-radius: 6px;
    transform-style: preserve-3d;
    z-index: 1;
}

/* Saptaki Yeşil Yapraklar */
.leaf {
    position: absolute;
    width: 40px;
    height: 20px;
    background: linear-gradient(to right, #1b5e20, #2e7d32);
    border-radius: 0 20px 0 20px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
}

.leaf-left {
    top: 60px;
    left: -35px;
    transform-origin: right center;
    transform: rotate(-30deg) rotateY(-30deg);
}

.leaf-right {
    top: 120px;
    right: -35px;
    transform-origin: left center;
    transform: rotate(30deg) rotateY(30deg);
}`;

const js = `document.addEventListener('DOMContentLoaded', () => {
    const flowerHead = document.getElementById('flowerHead');

    // Yaprak katmanlarının ayarları
    // Merkezden dışa doğru: w=genişlik, h=yükseklik, count=yaprak sayısı, curlBase=dışa yatma açısı, delayBase=animasyon gecikmesi
    const PETAL_LAYERS = [
        { count: 3, w: 40, h: 50, curlBase: 15, scaleBase: 0.8, delayBase: 0 },       // En içteki gonca
        { count: 5, w: 60, h: 75, curlBase: 25, scaleBase: 0.9, delayBase: 0.4 },     // İkinci katman
        { count: 7, w: 75, h: 90, curlBase: 40, scaleBase: 1.0, delayBase: 0.8 },     // Üçüncü katman
        { count: 9, w: 90, h: 105, curlBase: 55, scaleBase: 1.1, delayBase: 1.2 },    // Dördüncü katman
        { count: 11, w: 105, h: 115, curlBase: 70, scaleBase: 1.2, delayBase: 1.6 }   // En dıştaki büyük yapraklar
    ];

    function createPetals() {
        PETAL_LAYERS.forEach((layer, li) => {
            const angleStep = 360 / layer.count;
            // Her katmanı bir öncekinden biraz kaydır ki aralara denk gelsin
            const layerOffset = li * (360 / layer.count / 2) + (Math.random() - 0.5) * 10;
            
            for (let i = 0; i < layer.count; i++) {
                const petal = document.createElement('div');
                petal.className = 'petal';
                
                // Matematiksel hesaplamalar (görseldeki koda benzer yapı)
                const angle = layerOffset + i * angleStep + (Math.random() - 0.5) * 8; // Y ekseninde dönüş (dağılım)
                const delay = layer.delayBase + (Math.random() * 0.2); // Açılma sırası
                const curl = layer.curlBase + (Math.random() - 0.5) * 8; // X ekseninde dışa bükülme (organik görünüm)
                const scale = layer.scaleBase + (Math.random() - 0.5) * 0.1; // Hafif büyüklük farkları
                const bloomDur = 2.5 + Math.random() * 0.5; // Animasyon süresi
                
                // CSS değişkenleri (var) ataması
                petal.style.setProperty('--angle', \`\${angle}deg\`);
                petal.style.setProperty('--curl', \`\${curl}deg\`);
                petal.style.setProperty('--scale', scale);
                
                // Boyutlar
                petal.style.width = \`\${layer.w}px\`;
                petal.style.height = \`\${layer.h}px\`;
                // Genişliğin yarısı kadar eksi margin veriyoruz ki tam merkezde dursun
                petal.style.marginLeft = \`-\${layer.w / 2}px\`; 
                
                // Animasyon tetikleyici
                petal.style.animation = \`bloomAnim \${bloomDur}s cubic-bezier(0.17, 0.89, 0.32, 1.15) \${delay}s forwards\`;
                
                flowerHead.appendChild(petal);
            }
        });
    }

    // Kısa bir beklemeden sonra gülü oluştur
    setTimeout(createPetals, 500);
});`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('14-3D-Acan-Gul created successfully!');
