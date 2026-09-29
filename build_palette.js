const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '22-Renk-Paleti-Uretici');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Color Palette Generator</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    
    <div class="palette-container">
        <!-- 5 Adet Renk Sütunu -->
        <div class="color-col">
            <h2 class="hex-text" title="Tıkla ve Kopyala">#FFFFFF</h2>
            <div class="controls">
                <button class="btn-lock" title="Kilitle"><i class="fa-solid fa-lock-open"></i></button>
                <button class="btn-copy" title="Kopyala"><i class="fa-regular fa-copy"></i></button>
            </div>
        </div>
        <div class="color-col">
            <h2 class="hex-text" title="Tıkla ve Kopyala">#FFFFFF</h2>
            <div class="controls">
                <button class="btn-lock" title="Kilitle"><i class="fa-solid fa-lock-open"></i></button>
                <button class="btn-copy" title="Kopyala"><i class="fa-regular fa-copy"></i></button>
            </div>
        </div>
        <div class="color-col">
            <h2 class="hex-text" title="Tıkla ve Kopyala">#FFFFFF</h2>
            <div class="controls">
                <button class="btn-lock" title="Kilitle"><i class="fa-solid fa-lock-open"></i></button>
                <button class="btn-copy" title="Kopyala"><i class="fa-regular fa-copy"></i></button>
            </div>
        </div>
        <div class="color-col">
            <h2 class="hex-text" title="Tıkla ve Kopyala">#FFFFFF</h2>
            <div class="controls">
                <button class="btn-lock" title="Kilitle"><i class="fa-solid fa-lock-open"></i></button>
                <button class="btn-copy" title="Kopyala"><i class="fa-regular fa-copy"></i></button>
            </div>
        </div>
        <div class="color-col">
            <h2 class="hex-text" title="Tıkla ve Kopyala">#FFFFFF</h2>
            <div class="controls">
                <button class="btn-lock" title="Kilitle"><i class="fa-solid fa-lock-open"></i></button>
                <button class="btn-copy" title="Kopyala"><i class="fa-regular fa-copy"></i></button>
            </div>
        </div>
    </div>

    <!-- Alt Kısım Bilgi Kutusu -->
    <div class="info-panel">
        <p>Press <strong>Spacebar</strong> to generate colors</p>
        <button id="generateBtn" class="mobile-gen-btn"><i class="fa-solid fa-wand-magic-sparkles"></i> Generate</button>
    </div>

    <!-- Kopyalandı Bildirimi (Toast) -->
    <div class="toast" id="toast">
        <i class="fa-solid fa-circle-check"></i> Color copied to clipboard!
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
    overflow: hidden;
    background: #111;
}

/* =========================================
   PALET SÜTUNLARI (FLEXBOX)
========================================= */
.palette-container {
    display: flex;
    width: 100vw;
    height: 100vh;
}

.color-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: background-color 0.4s ease; /* Renk değişiminde yumuşak geçiş */
    position: relative;
}

/* HEX Metni */
.hex-text {
    font-size: 2.5rem;
    font-weight: bold;
    letter-spacing: 2px;
    margin-bottom: 30px;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.3s;
    text-transform: uppercase;
}
.hex-text:hover {
    transform: scale(1.1);
}
.hex-text:active {
    transform: scale(0.95);
}

/* Kontrol Butonları (Kilit ve Kopyala) */
.controls {
    display: flex;
    gap: 20px;
    opacity: 0.7;
    transition: opacity 0.3s;
}
.color-col:hover .controls {
    opacity: 1;
}

.controls button {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    transition: transform 0.2s;
    outline: none;
    color: inherit; /* Rengi JS ile atayacağız (Siyah veya Beyaz) */
}
.controls button:hover {
    transform: scale(1.2);
}
.controls button:active {
    transform: scale(0.9);
}

/* =========================================
   BİLGİ PANELİ & TOAST
========================================= */
.info-panel {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(15px);
    padding: 15px 30px;
    border-radius: 30px;
    color: #fff;
    font-size: 1.1rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    display: flex;
    align-items: center;
    gap: 20px;
    z-index: 10;
}
.info-panel strong {
    background: rgba(0,0,0,0.3);
    padding: 5px 12px;
    border-radius: 8px;
    letter-spacing: 1px;
}
.mobile-gen-btn {
    display: none;
    background: #fff;
    color: #111;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
}

/* Toast (Kopyalandı Bildirimi) */
.toast {
    position: fixed;
    top: -100px; /* Ekranda gizli */
    left: 50%;
    transform: translateX(-50%);
    background: #111;
    color: #fff;
    padding: 15px 30px;
    border-radius: 50px;
    font-weight: bold;
    font-size: 1.2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    gap: 10px;
    transition: top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 20;
}
.toast.show {
    top: 40px; /* Ekrana düşer */
}
.toast i {
    color: #00E5FF; /* Yeşil/Turkuaz check ikonu */
}

/* =========================================
   RESPONSIVE (Mobil)
========================================= */
@media (max-width: 800px) {
    .palette-container {
        flex-direction: column; /* Mobilde sütunlar alt alta yığılır */
    }
    .hex-text {
        font-size: 1.8rem;
        margin-bottom: 10px;
    }
    .controls {
        opacity: 1; /* Mobilde hep görünsün */
    }
    .info-panel p {
        display: none; /* Mobilde space yazısını gizle */
    }
    .mobile-gen-btn {
        display: block; /* Mobilde buton göster */
    }
}
`;

const js = `document.addEventListener('DOMContentLoaded', () => {
    const cols = document.querySelectorAll('.color-col');
    const toast = document.getElementById('toast');
    const mobileGenBtn = document.getElementById('generateBtn');

    // 1. Rastgele HEX Kod Üretici
    function generateRandomHex() {
        const hexChars = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += hexChars[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // 2. Renk Parlaklığı (Luminance) Hesaplayıcı
    // Eğer üretilen renk çok açıksa (örneğin açık sarı), üzerindeki yazı siyah olmalı. Koyuysa beyaz olmalı.
    function checkLuminance(hex) {
        // Hex'i RGB'ye çevir
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        // YIQ Formülü ile parlaklık hesaplama
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        
        // Eşik değeri 128
        return (yiq >= 128) ? 'black' : 'white';
    }

    // 3. Ana Fonksiyon: Sütunlara Renkleri Dağıt
    function setColors() {
        cols.forEach(col => {
            const hexText = col.querySelector('.hex-text');
            const lockIcon = col.querySelector('.btn-lock i');
            
            // Eğer sütun kilitliyse (locked) bu sütunu es geç
            if (col.classList.contains('locked')) {
                return;
            }

            const randomColor = generateRandomHex();
            
            // Arka plan rengini değiştir
            col.style.backgroundColor = randomColor;
            
            // Metni güncelle
            hexText.innerText = randomColor;

            // Kontrast (Parlaklık) kontrolü yap ve metin/ikon renklerini ayarla
            const contrastColor = checkLuminance(randomColor);
            hexText.style.color = contrastColor;
            col.style.color = contrastColor; 
        });
    }

    // 4. Clipboard'a Kopyalama ve Toast Bildirimi
    function copyToClipboard(hex) {
        navigator.clipboard.writeText(hex).then(() => {
            // Başarılı kopyalama animasyonu
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000); // 2 saniye sonra geri gizle
        });
    }

    // --- EVENT LISTENERS ---

    // Sütun içindeki tıklamalar (Kilitleme ve Kopyalama)
    cols.forEach(col => {
        const hexText = col.querySelector('.hex-text');
        const lockBtn = col.querySelector('.btn-lock');
        const copyBtn = col.querySelector('.btn-copy');

        // Hex metnine veya kopyala butonuna basılınca kopyala
        hexText.addEventListener('click', () => {
            copyToClipboard(hexText.innerText);
        });
        copyBtn.addEventListener('click', () => {
            copyToClipboard(hexText.innerText);
        });

        // Kilitleme butonuna basılınca durumu (locked class'ını) toggle et
        lockBtn.addEventListener('click', () => {
            col.classList.toggle('locked');
            const icon = lockBtn.querySelector('i');
            if (col.classList.contains('locked')) {
                icon.classList.remove('fa-lock-open');
                icon.classList.add('fa-lock');
            } else {
                icon.classList.remove('fa-lock');
                icon.classList.add('fa-lock-open');
            }
        });
    });

    // Space (Boşluk) tuşuna basıldığında yeni renkler üret
    document.addEventListener('keydown', (e) => {
        // e.code === 'Space'
        if (e.keyCode === 32) {
            e.preventDefault(); // Sayfanın aşağı kaymasını engelle
            setColors();
        }
    });

    // Mobilde buton ile üretim
    mobileGenBtn.addEventListener('click', setColors);

    // İlk açılışta renkleri doldur
    setColors();
});`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('22-Renk-Paleti-Uretici created successfully!');
