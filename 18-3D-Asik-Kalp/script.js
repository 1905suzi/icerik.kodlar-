document.addEventListener('DOMContentLoaded', () => {
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
    // 4. ALT DÖNEN GALAKSİ (GALAXY BASE)
    // ==========================================
    const galaxyCount = 15000;
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPos = new Float32Array(galaxyCount * 3);
    const galaxyCol = new Float32Array(galaxyCount * 3);

    for(let i=0; i<galaxyCount; i++) {
        // Sarmal kollara dağılım
        const radius = Math.random() * 55; // Galaksi genişliği
        const branchAngle = ((i % 4) / 4) * Math.PI * 2; // 4 Kollu
        const spinAngle = radius * 0.3; // Sarmal kıvrımı
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 8;
        const randomY = (Math.random() - 0.5) * 3; // Hafif kalınlık
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 8;

        galaxyPos[i*3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        galaxyPos[i*3+1] = -18 + randomY; // Kalbin altında
        galaxyPos[i*3+2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Merkez daha parlak, dışlar mor/mavi/pembe
        const distRatio = radius / 55;
        galaxyCol[i*3] = 1.0 - (distRatio * 0.5); // R
        galaxyCol[i*3+1] = Math.random() * 0.3; // G
        galaxyCol[i*3+2] = 0.5 + Math.random() * 0.5; // B
    }

    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPos, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyCol, 3));
    const galaxyMat = new THREE.PointsMaterial({ ...particleMaterialTemplate, size: 0.25 });
    const galaxyBase = new THREE.Points(galaxyGeo, galaxyMat);
    scene.add(galaxyBase);

    // ==========================================
    // 4.5. YUKARI SÜZÜLEN RENKLİ TOZ TANELERİ (FLOATING DUST)
    // ==========================================
    const floatCount = 2000;
    const floatGeo = new THREE.BufferGeometry();
    const floatPos = new Float32Array(floatCount * 3);
    const floatCol = new Float32Array(floatCount * 3);
    const floatSpeeds = new Float32Array(floatCount);

    for(let i=0; i<floatCount; i++) {
        // Rastgele silindir/koni bir alanda dağılım
        const r = Math.random() * 45;
        const theta = Math.random() * Math.PI * 2;
        
        floatPos[i*3] = Math.cos(theta) * r; // X
        floatPos[i*3+1] = -20 + Math.random() * 100; // Y (Aşağıdan yukarıya dağılım)
        floatPos[i*3+2] = Math.sin(theta) * r; // Z

        floatSpeeds[i] = Math.random() * 0.15 + 0.05; // Yukarı çıkma hızı

        // Tamamen rastgele gökkuşağı neon renkler
        floatCol[i*3] = Math.random() * 0.5 + 0.5; // R
        floatCol[i*3+1] = Math.random() * 0.5 + 0.5; // G
        floatCol[i*3+2] = Math.random() * 0.5 + 0.5; // B
    }

    floatGeo.setAttribute('position', new THREE.BufferAttribute(floatPos, 3));
    floatGeo.setAttribute('color', new THREE.BufferAttribute(floatCol, 3));
    const floatMat = new THREE.PointsMaterial({ ...particleMaterialTemplate, size: 0.3 });
    const floatDust = new THREE.Points(floatGeo, floatMat);
    scene.add(floatDust);


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

        // Alt galaksinin dönmesi
        galaxyBase.rotation.y = -time * 0.1;

        // Yukarı süzülen renkli toz tanelerinin animasyonu
        const fPositions = floatGeo.attributes.position.array;
        for(let i=0; i<floatCount; i++) {
            fPositions[i*3+1] += floatSpeeds[i]; // Y ekseninde yukarı git
            
            // Eğer çok tepeye çıkarsa tekrar aşağı galaksiye gönder
            if(fPositions[i*3+1] > 60) {
                fPositions[i*3+1] = -20;
            }
        }
        floatGeo.attributes.position.needsUpdate = true;
        // Toz bulutunun bütünü de hafifçe dönsün
        floatDust.rotation.y = time * 0.05;

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
});