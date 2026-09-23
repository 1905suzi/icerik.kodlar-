document.addEventListener('DOMContentLoaded', () => {
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
            holdProgress += 0.4; // Yaklaşık 3-4 saniyede dolar
        } else {
            holdProgress -= 1.0; // Bırakınca yavaşça geri düşer
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
});