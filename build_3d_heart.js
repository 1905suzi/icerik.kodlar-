const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '18-3D-Asik-Kalp');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Volumetric Heart</title>
    <link rel="stylesheet" href="style.css">
    <!-- Three.js ve OrbitControls CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body>
    
    <!-- Neon Başlık -->
    <div class="header">
        <h1 class="neon-text">I Love You <span class="heart-icon">❤️</span></h1>
    </div>

    <!-- 3D Canvas Konteyneri -->
    <div id="canvas-container"></div>

    <script src="script.js"></script>
</body>
</html>`;

const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    user-select: none;
}

body {
    width: 100vw;
    height: 100vh;
    background: #050505; /* Derin Uzay */
    overflow: hidden;
}

#canvas-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.header {
    position: absolute;
    top: 30px;
    width: 100%;
    text-align: center;
    z-index: 10;
    pointer-events: none; /* Tıklamalar canvas'a geçsin */
}

.neon-text {
    color: #fff;
    font-size: 42px;
    font-weight: 800;
    letter-spacing: 2px;
    text-shadow: 
        0 0 10px rgba(255, 20, 147, 0.8), 
        0 0 20px rgba(255, 20, 147, 0.8), 
        0 0 40px rgba(255, 20, 147, 0.8),
        0 0 80px rgba(255, 20, 147, 0.6);
    animation: pulseText 2s infinite alternate;
}

.heart-icon {
    display: inline-block;
    animation: beat 1s infinite alternate;
}

@keyframes pulseText {
    0% { text-shadow: 0 0 10px rgba(255, 20, 147, 0.8), 0 0 20px rgba(255, 20, 147, 0.8); transform: scale(1); }
    100% { text-shadow: 0 0 20px rgba(255, 20, 147, 1), 0 0 40px rgba(255, 20, 147, 0.8), 0 0 80px rgba(255, 20, 147, 0.8); transform: scale(1.02); }
}

@keyframes beat {
    0% { transform: scale(1); }
    100% { transform: scale(1.15); }
}
`;

const js = `document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');

    // 1. Sahne ve Kamera Kurulumu
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002); // Derinlik hissi için hafif sis

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 80); // Kamerayı kalbe bakacak şekilde ayarla

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Fare Kontrolleri (OrbitControls)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5; // Yavaşça etrafında dön
    controls.maxPolarAngle = Math.PI / 2 + 0.2; // Yerin çok altına inmeyi engelle
    controls.minDistance = 30;
    controls.maxDistance = 150;

    // Ortak Materyal Özellikleri
    const particleMaterialTemplate = {
        size: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    };

    // ==========================================
    // 3. YILDIZ ARKA PLANI (STARFIELD)
    // ==========================================
    const starsCount = 5000;
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(starsCount * 3);
    const starsCol = new Float32Array(starsCount * 3);

    for(let i=0; i<starsCount; i++) {
        starsPos[i*3] = (Math.random() - 0.5) * 400;
        starsPos[i*3+1] = (Math.random() - 0.5) * 400;
        starsPos[i*3+2] = (Math.random() - 0.5) * 400;

        // Beyaz ve çok hafif mavi/pembe yıldızlar
        const shade = Math.random();
        starsCol[i*3] = 0.8 + shade * 0.2; // R
        starsCol[i*3+1] = 0.8 + shade * 0.2; // G
        starsCol[i*3+2] = 0.9 + shade * 0.1; // B
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starsCol, 3));
    
    const starsMat = new THREE.PointsMaterial({ ...particleMaterialTemplate, size: 0.3 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // ==========================================
    // 4. ZEMİN HALKALARI (RIPPLES / BASE)
    // ==========================================
    const ringsCount = 10000;
    const ringsGeo = new THREE.BufferGeometry();
    const ringsPos = new Float32Array(ringsCount * 3);
    const ringsCol = new Float32Array(ringsCount * 3);

    let ringIdx = 0;
    // 4 adet konsantrik halka (Yarıçaplar: 15, 25, 35, 45)
    [15, 25, 35, 45].forEach((radius, rIndex) => {
        const pCount = radius * 70; // Büyük halkalarda daha çok parçacık
        for(let i=0; i<pCount && ringIdx < ringsCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const rOffset = (Math.random() - 0.5) * 2; // Halka kalınlığı
            const r = radius + rOffset;

            ringsPos[ringIdx*3] = Math.cos(angle) * r;
            ringsPos[ringIdx*3+1] = (Math.random() - 0.5) * 0.5 - 20; // Y = -20 (Kalbin altında)
            ringsPos[ringIdx*3+2] = Math.sin(angle) * r;

            // Halkalar pembe ve beyaz karışık
            ringsCol[ringIdx*3] = 1.0; // R
            ringsCol[ringIdx*3+1] = Math.random() * 0.5 + 0.2; // G
            ringsCol[ringIdx*3+2] = Math.random() * 0.5 + 0.5; // B

            ringIdx++;
        }
    });

    ringsGeo.setAttribute('position', new THREE.BufferAttribute(ringsPos, 3));
    ringsGeo.setAttribute('color', new THREE.BufferAttribute(ringsCol, 3));
    const ringsMat = new THREE.PointsMaterial({ ...particleMaterialTemplate, size: 0.2 });
    const rings = new THREE.Points(ringsGeo, ringsMat);
    scene.add(rings);


    // ==========================================
    // 5. HACİMLİ 3D KALP (VOLUMETRIC HEART)
    // ==========================================
    const heartPointCount = 40000;
    const heartGeo = new THREE.BufferGeometry();
    const heartPos = new Float32Array(heartPointCount * 3);
    const heartCol = new Float32Array(heartPointCount * 3);

    let count = 0;
    const scale = 12; // Kalbin büyüklüğü
    const offsetY = 5; // Kalbin Y eksenindeki konumu

    // Rejection Sampling Algoritması
    // Kalp formülü: (x^2 + 9/4 y^2 + z^2 - 1)^3 - x^2 z^3 - 9/80 y^2 z^3 <= 0
    while(count < heartPointCount) {
        // -1.5 ile 1.5 arasında rastgele koordinatlar üret
        let x = (Math.random() - 0.5) * 3;
        let y = (Math.random() - 0.5) * 3;
        let z = (Math.random() - 0.5) * 3;

        // Formülü uygula (Matematikte Z yukarıdır, bizde Y yukarı olacak)
        let equation = Math.pow(x*x + 2.25*y*y + z*z - 1, 3) - (x*x * z*z*z) - (0.1125 * y*y * z*z*z);

        if (equation <= 0) {
            // Nokta kalbin içindeyse kaydet
            // Three.js koordinatlarına çevir: Three.X = x, Three.Y = z, Three.Z = y
            heartPos[count*3] = x * scale;
            heartPos[count*3+1] = z * scale + offsetY;
            heartPos[count*3+2] = y * scale;

            // Renklendirme (Dış kısımlar daha parlak pembe/kırmızı)
            const distance = Math.sqrt(x*x + y*y + z*z);
            
            // Kırmızı ve canlı Pembe ağırlıklı neon renkler
            const isRed = Math.random() > 0.5;
            if(isRed) {
                heartCol[count*3] = 1.0; // R
                heartCol[count*3+1] = 0.1; // G
                heartCol[count*3+2] = 0.3; // B
            } else {
                heartCol[count*3] = 1.0; // R
                heartCol[count*3+1] = 0.4; // G
                heartCol[count*3+2] = 0.8; // B
            }

            count++;
        }
    }

    heartGeo.setAttribute('position', new THREE.BufferAttribute(heartPos, 3));
    heartGeo.setAttribute('color', new THREE.BufferAttribute(heartCol, 3));
    
    // Kalp parçacıkları daha iri ve parlak olsun
    const heartMat = new THREE.PointsMaterial({ ...particleMaterialTemplate, size: 0.35 });
    const heart = new THREE.Points(heartGeo, heartMat);
    scene.add(heart);


    // ==========================================
    // 6. ANİMASYON DÖNGÜSÜ
    // ==========================================
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        const time = clock.getElapsedTime();

        // Yıldızların yavaşça kendi etrafında dönmesi
        stars.rotation.y = time * 0.02;

        // Alt halkaların (Ripples) ters yönde yavaşça dönmesi
        rings.rotation.y = -time * 0.1;

        // Kalbin nabız (Pulse) gibi atması (Boyutunun hafifçe büyüyüp küçülmesi)
        const pulse = 1 + Math.sin(time * 3) * 0.05; // 3 hızında, %5 büyüklük değişimi
        heart.scale.set(pulse, pulse, pulse);
        
        // Kalp içindeki noktaların da kendi etrafında çok hafif süzülmesi
        heart.rotation.y = Math.sin(time * 0.5) * 0.2;

        renderer.render(scene, camera);
    }

    animate();

    // ==========================================
    // Ekran Boyutu Değişimi
    // ==========================================
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('18-3D-Asik-Kalp created successfully!');
