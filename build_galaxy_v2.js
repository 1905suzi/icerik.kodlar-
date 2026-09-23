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
    <title>Galaxy Gallery 3D</title>
    <link rel="stylesheet" href="style.css">
    <!-- Three.js ve OrbitControls kütüphaneleri -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body>

    <!-- 3D Sahne -->
    <div id="canvas-container"></div>

    <!-- Başlangıç Kartı -->
    <div class="card-container" id="startCard">
        <h1 class="title">Galaxy Gallery</h1>
        
        <div class="gif-container">
            <!-- Yer tutucu GIF linki, internetten çeker. Çevrimdışı kullanım için 'ayi.gif' yapabilirsiniz -->
            <img src="https://media.tenor.com/zO4f_sQ4TtcAAAAi/milk-and-mocha-bear-hug.gif" alt="Sarılma" class="hugging-bears">
        </div>
        
        <p class="subtitle">PARA MI PRINCESITA</p>
        
        <!-- İçi dolan buton -->
        <div class="hold-btn-wrapper">
            <button id="iniciarBtn" class="btn">
                <div class="btn-fill" id="btnFill"></div>
                <span class="btn-text">BASILI TUT</span>
            </button>
        </div>
    </div>

    <!-- Final Yazısı -->
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
    user-select: none;
}

body {
    width: 100vw;
    height: 100vh;
    background: #000000; /* Derin uzay siyahı */
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

#canvas-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

/* ================= KART TASARIMI ================= */
.card-container {
    position: relative;
    z-index: 10;
    background: rgba(15, 5, 25, 0.7);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 50px 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.03);
    transition: opacity 1s ease, transform 1s ease;
}

.card-container.fade-out {
    opacity: 0;
    transform: scale(0.9);
    pointer-events: none;
}

.title {
    color: #fff;
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 25px;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 182, 255, 0.6);
    letter-spacing: 2px;
}

.gif-container {
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.hugging-bears {
    width: 100%;
    height: auto;
    border-radius: 12px;
    mix-blend-mode: screen; 
}

.subtitle {
    color: #e0c2ff;
    font-size: 12px;
    letter-spacing: 4px;
    margin-bottom: 40px;
    text-shadow: 0 0 10px rgba(224, 194, 255, 0.5);
}

/* ================= BASILI TUT BUTONU ================= */
.hold-btn-wrapper {
    position: relative;
    width: 200px;
    height: 50px;
    border-radius: 30px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    overflow: hidden;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
    cursor: pointer;
}

.btn {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    position: relative;
    outline: none;
    cursor: pointer;
}

.btn-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #b829d6, #ff00ff);
    box-shadow: 0 0 20px #ff00ff;
    transition: width 0.1s linear;
    z-index: 1;
}

.btn-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 14px;
    letter-spacing: 2px;
    font-weight: bold;
    z-index: 2;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    white-space: nowrap;
}

/* ================= FİNAL YAZISI ================= */
#finalText {
    position: absolute;
    z-index: 5;
    color: #fff;
    font-size: 70px;
    font-weight: bold;
    text-align: center;
    letter-spacing: 8px;
    opacity: 0;
    transform: translateY(30px) scale(0.9);
    transition: opacity 2.5s ease, transform 2.5s ease;
    text-shadow: 0 0 20px #ff00ff, 0 0 50px #ff00ff, 0 0 100px #ff00ff;
    pointer-events: none;
}

#finalText.show {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.hidden {
    display: none;
}`;

const js = `document.addEventListener('DOMContentLoaded', () => {
    // --- UI ve Buton Mantığı ---
    const btn = document.getElementById('iniciarBtn');
    const btnFill = document.getElementById('btnFill');
    const btnText = document.querySelector('.btn-text');
    const startCard = document.getElementById('startCard');
    const finalText = document.getElementById('finalText');

    let isHolding = false;
    let holdProgress = 0;
    let isStarted = false;

    function handleStart(e) {
        if(isStarted) return;
        isHolding = true;
        btnText.innerText = "YÜKLENİYOR...";
    }

    function handleEnd(e) {
        if(isStarted) return;
        isHolding = false;
        btnText.innerText = "BASILI TUT";
    }

    btn.addEventListener('mousedown', handleStart);
    window.addEventListener('mouseup', handleEnd);
    btn.addEventListener('touchstart', handleStart);
    window.addEventListener('touchend', handleEnd);

    function updateButton() {
        if (isStarted) return;

        if (isHolding) {
            holdProgress += 1.5; // Dolum hızı
        } else {
            holdProgress -= 3; // Bırakınca geri düşme hızı
        }

        if (holdProgress < 0) holdProgress = 0;
        if (holdProgress > 100) holdProgress = 100;

        btnFill.style.width = holdProgress + '%';

        if (holdProgress === 100 && !isStarted) {
            isStarted = true;
            btnText.innerText = "HAZIR!";
            startCard.classList.add('fade-out');
            setTimeout(() => {
                startCard.style.display = 'none';
                baslatGalaksi();
            }, 1000);
        }

        requestAnimationFrame(updateButton);
    }
    requestAnimationFrame(updateButton);

    // --- THREE.JS 3D MOTORU ---
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    
    // Kamera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 30, 80); // Kuşbakışı çapraz açı

    // Renderer (Çizici)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Kontroller (Fare ile döndürme)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true; // Otomatik yavaş dönme
    controls.autoRotateSpeed = 1.0;

    // --- PARÇACIKLAR (GALAXY) ---
    const galaxyParticleCount = 20000;
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyPositions = new Float32Array(galaxyParticleCount * 3);
    const galaxyColors = new Float32Array(galaxyParticleCount * 3);

    const color1 = new THREE.Color('#ff00ff'); // Pembe/Mor
    const color2 = new THREE.Color('#00ffff'); // Turkuaz
    const color3 = new THREE.Color('#ffd700'); // Altın Sarı

    for(let i=0; i<galaxyParticleCount; i++) {
        // Sarmal kollara dağılım algoritması
        const radius = Math.random() * 50;
        const spinAngle = radius * 0.5; // Sarmal kıvrımı
        const branchAngle = ((i % 3) / 3) * Math.PI * 2; // 3 Kollu galaksi
        
        // Dağılma/toz efekti
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 8;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 8;

        const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
        const y = randomY;
        const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        galaxyPositions[i*3] = x;
        galaxyPositions[i*3+1] = y;
        galaxyPositions[i*3+2] = z;

        // Renk ataması (Merkez altın, dış kısımlar mor/mavi)
        const mixedColor = color1.clone();
        if(radius < 15) {
            mixedColor.lerp(color3, 1 - (radius/15)); // Merkez sarı
        } else {
            mixedColor.lerp(color2, (radius-15)/35); // Dışarı doğru mavi
        }
        
        galaxyColors[i*3] = mixedColor.r;
        galaxyColors[i*3+1] = mixedColor.g;
        galaxyColors[i*3+2] = mixedColor.b;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

    // Toz tanesi materyali (Parlayan, blend mode eklenmiş)
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.8
    });

    const galaxy = new THREE.Points(galaxyGeometry, particleMaterial);
    
    // --- PARÇACIKLAR (HEART) ---
    const heartParticleCount = 8000;
    const heartGeometry = new THREE.BufferGeometry();
    const heartPositions = new Float32Array(heartParticleCount * 3);
    const heartTargetPositions = new Float32Array(heartParticleCount * 3);
    const heartColors = new Float32Array(heartParticleCount * 3);

    for(let i=0; i<heartParticleCount; i++) {
        // Matematiksel 3D kalp formülü
        const t = Math.random() * Math.PI * 2;
        const scale = Math.random() * 0.8 + 0.8;
        
        const hx = 16 * Math.pow(Math.sin(t), 3) * scale;
        const hy = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * scale;
        
        const targetX = hx;
        const targetY = hy + 25; // Yukarıdan fırlaması için
        const targetZ = (Math.random() - 0.5) * 5;

        // Başlangıçta hepsi galaksi merkezinde gizli (0,0,0)
        heartPositions[i*3] = (Math.random() - 0.5);
        heartPositions[i*3+1] = (Math.random() - 0.5);
        heartPositions[i*3+2] = (Math.random() - 0.5);

        heartTargetPositions[i*3] = targetX;
        heartTargetPositions[i*3+1] = targetY;
        heartTargetPositions[i*3+2] = targetZ;

        // Parlak Pembe
        heartColors[i*3] = 1.0;
        heartColors[i*3+1] = 0.05;
        heartColors[i*3+2] = 0.6;
    }

    heartGeometry.setAttribute('position', new THREE.BufferAttribute(heartPositions, 3));
    heartGeometry.setAttribute('color', new THREE.BufferAttribute(heartColors, 3));
    
    const heartMaterial = new THREE.PointsMaterial({
        size: 0.25,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0
    });

    const heart = new THREE.Points(heartGeometry, heartMaterial);

    // Animasyon Durumları
    let galaxyActive = false;
    let heartActive = false;
    const clock = new THREE.Clock();

    function baslatGalaksi() {
        scene.add(galaxy);
        galaxyActive = true;

        // Galaksi bir süre döndükten sonra kalbi çıkar
        setTimeout(() => {
            scene.add(heart);
            heartActive = true;
            // Kalbi yavaşça görünür yap
            let fadeInterval = setInterval(() => {
                if(heartMaterial.opacity < 1) {
                    heartMaterial.opacity += 0.02;
                } else {
                    clearInterval(fadeInterval);
                }
            }, 50);

            // Yazıyı Göster
            setTimeout(() => {
                finalText.classList.remove('hidden');
                setTimeout(() => {
                    finalText.classList.add('show');
                }, 50);
            }, 4000);

        }, 5000); // 5 saniye sonra kalbe geç
    }

    // Render Döngüsü
    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        const elapsedTime = clock.getElapsedTime();

        if (galaxyActive) {
            galaxy.rotation.y = elapsedTime * 0.1; // Galaksi kendi etrafında yavaşça döner
        }

        if (heartActive) {
            // Kalp parçacıklarını merkezden hedeflerine doğru lerp (yumuşak geçiş) ile taşı
            const positions = heartGeometry.attributes.position.array;
            for(let i=0; i<heartParticleCount; i++) {
                const ix = i*3;
                const iy = i*3+1;
                const iz = i*3+2;

                positions[ix] += (heartTargetPositions[ix] - positions[ix]) * 0.02;
                positions[iy] += (heartTargetPositions[iy] - positions[iy]) * 0.02;
                positions[iz] += (heartTargetPositions[iz] - positions[iz]) * 0.02;
            }
            heartGeometry.attributes.position.needsUpdate = true;
            heart.rotation.y = elapsedTime * 0.5; // Kalp de kendi etrafında dönsün
        }

        renderer.render(scene, camera);
    }
    animate();

    // Responsive Ekran
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('17-Galaksi-Kalp (Three.js V2) created successfully!');
