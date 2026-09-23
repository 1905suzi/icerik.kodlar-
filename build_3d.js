const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '12-3D-Urun-Karti');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Ürün Kartı</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="kart-alani">
        <div class="kart">
            <!-- Arka plandaki dairesel neon ışık -->
            <div class="neon-halka"></div>
            
            <h1 class="baslik">NIKE AIR</h1>
            
            <!-- Şeffaf arka planlı ayakkabı görseli (Ekrana fırlayacak olan kısım) -->
            <img class="ayakkabi" src="https://parspng.com/wp-content/uploads/2022/10/shoespng.parspng.com-1.png" alt="Nike Ayakkabı">
            
            <button class="satin-al-btn">Satın Al</button>
        </div>
    </div>

    <!-- Tıklama ile eğim vermek için minik JS (İsteğe bağlı, videoda sadece CSS gösterilebilir) -->
    <script src="script.js"></script>
</body>
</html>`;

const css = `body {
    margin: 0;
    height: 100vh;
    background-color: #121212;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Arial', sans-serif;
    /* Kameranın derinliği - 3D efektin anahtarı */
    perspective: 1000px; 
}

/* Bu alan kartın 3D olarak hareket edeceği sahnedir */
.kart-alani {
    transform-style: preserve-3d;
}

.kart {
    width: 320px;
    height: 450px;
    background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.05);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* İçindeki elemanların da 3D olmasını sağlar */
    transform-style: preserve-3d; 
    transition: transform 0.5s ease-out;
}

/* Karta dokunulduğunda arkaya yatsın */
.kart:hover {
    transform: rotateX(20deg) rotateY(10deg);
    box-shadow: -20px 30px 50px rgba(0,0,0,0.6);
}

.neon-halka {
    width: 150px;
    height: 150px;
    background-color: #ff3e3e;
    border-radius: 50%;
    position: absolute;
    top: 30%;
    filter: blur(40px);
    opacity: 0.6;
    /* Halka arkada kalmalı */
    transform: translateZ(-50px); 
}

.baslik {
    color: rgba(255, 255, 255, 0.2);
    font-size: 5rem;
    font-weight: 900;
    position: absolute;
    top: 50px;
    letter-spacing: 5px;
    /* Başlık kart zeminine yapışık */
    transform: translateZ(0px); 
}

.ayakkabi {
    width: 120%;
    position: absolute;
    top: 25%;
    left: -10%;
    filter: drop-shadow(0 20px 20px rgba(0,0,0,0.8));
    transition: transform 0.6s cubic-bezier(0.2, 1, 0.2, 1);
    /* Başlangıçta hafif önde */
    transform: translateZ(30px) rotate(-15deg); 
}

/* EN CAN ALICI KISIM: Kart hover olunca ayakkabı 3D olarak ekrana fırlasın */
.kart:hover .ayakkabi {
    transform: translateZ(150px) rotate(-25deg) scale(1.1);
}

.satin-al-btn {
    position: absolute;
    bottom: 40px;
    padding: 12px 30px;
    background-color: #ff3e3e;
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.5s;
    /* Buton da hafif önde dursun */
    transform: translateZ(20px);
}

.kart:hover .satin-al-btn {
    transform: translateZ(60px);
}`;

const js = `// Kartın fareyi takip ederek 3D dönmesi için sihirli kod
const kart = document.querySelector('.kart');
const kartAlani = document.querySelector('.kart-alani');

kartAlani.addEventListener('mousemove', (e) => {
    let xAxis = (window.innerWidth / 2 - e.pageX) / 15;
    let yAxis = (window.innerHeight / 2 - e.pageY) / 15;
    kart.style.transform = \`rotateY(\${xAxis}deg) rotateX(\${yAxis}deg)\`;
});

// Fare karttan çıkınca eski haline dönsün
kartAlani.addEventListener('mouseleave', () => {
    kart.style.transition = 'all 0.5s ease';
    kart.style.transform = \`rotateY(0deg) rotateX(0deg)\`;
});

// Fare karta girince geçişi (transition) iptal et ki anında tepki versin
kartAlani.addEventListener('mouseenter', () => {
    kart.style.transition = 'none';
});`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('12-3D-Urun-Karti created successfully!');
