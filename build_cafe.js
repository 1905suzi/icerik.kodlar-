const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '10-Kafe-Menusu');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lumina Cafe Menü</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Lumina Cafe</h1>
        <p>En taze kahveler ve el yapımı tatlılar</p>
    </header>

    <main>
        <!-- Kategori Butonları -->
        <nav class="kategoriler">
            <button class="kategori-btn aktif" data-kategori="tumu">Tümü</button>
            <button class="kategori-btn" data-kategori="kahve">Sıcak Kahveler</button>
            <button class="kategori-btn" data-kategori="soguk">Soğuk İçecekler</button>
            <button class="kategori-btn" data-kategori="tatli">Tatlılar</button>
        </nav>

        <!-- Menü Öğeleri -->
        <div class="menu-izgarasi" id="menuIzgarasi">
            <!-- Ürün 1 -->
            <div class="urun-karti" data-kategori="kahve">
                <div class="urun-resmi resim-1"></div>
                <div class="urun-bilgi">
                    <h3>Latte Macchiato</h3>
                    <p>Yumuşak içimli, bol süt köpüklü klasik lezzet.</p>
                    <span class="fiyat">85 ₺</span>
                </div>
            </div>

            <!-- Ürün 2 -->
            <div class="urun-karti" data-kategori="tatli">
                <div class="urun-resmi resim-2"></div>
                <div class="urun-bilgi">
                    <h3>San Sebastian</h3>
                    <p>Akışkan çikolata sosu ile sunulan efsanevi cheesecake.</p>
                    <span class="fiyat">140 ₺</span>
                </div>
            </div>

            <!-- Ürün 3 -->
            <div class="urun-karti" data-kategori="soguk">
                <div class="urun-resmi resim-3"></div>
                <div class="urun-bilgi">
                    <h3>Iced Americano</h3>
                    <p>Buz gibi ferahlatıcı sert kahve deneyimi.</p>
                    <span class="fiyat">75 ₺</span>
                </div>
            </div>

            <!-- Ürün 4 -->
            <div class="urun-karti" data-kategori="kahve">
                <div class="urun-resmi resim-4"></div>
                <div class="urun-bilgi">
                    <h3>Filtre Kahve</h3>
                    <p>Özel kavrulmuş taze çekirdeklerden filtre kahve.</p>
                    <span class="fiyat">60 ₺</span>
                </div>
            </div>

            <!-- Ürün 5 -->
            <div class="urun-karti" data-kategori="tatli">
                <div class="urun-resmi resim-5"></div>
                <div class="urun-bilgi">
                    <h3>Tiramisu</h3>
                    <p>İtalyan usulü, kahve aromalı hafif tatlı.</p>
                    <span class="fiyat">120 ₺</span>
                </div>
            </div>
            
            <!-- Ürün 6 -->
            <div class="urun-karti" data-kategori="soguk">
                <div class="urun-resmi resim-6"></div>
                <div class="urun-bilgi">
                    <h3>Hibiscus Çayı</h3>
                    <p>Buzlu, ferahlatıcı meyve notalı soğuk çay.</p>
                    <span class="fiyat">70 ₺</span>
                </div>
            </div>
        </div>
    </main>

    <script src="script.js"></script>
</body>
</html>`;

const css = `/* Renk Paleti: Krem, Espresso ve Yumuşak Turuncu */
:root {
    --krem-arkaplan: #fdfbf7;
    --espresso-koyu: #3e2723;
    --espresso-acik: #5d4037;
    --yumusak-turuncu: #ffb74d;
    --beyaz: #ffffff;
}

body {
    margin: 0;
    padding: 0;
    background-color: var(--krem-arkaplan);
    color: var(--espresso-koyu);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    -webkit-font-smoothing: antialiased;
}

/* Üst Kısım (Hero) */
header {
    text-align: center;
    padding: 60px 20px 30px;
}

header h1 {
    font-size: 3rem;
    margin: 0 0 10px 0;
    letter-spacing: 2px;
}

header p {
    font-size: 1.1rem;
    color: var(--espresso-acik);
    margin: 0;
}

/* Kategori Butonları */
.kategoriler {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 40px;
    padding: 0 20px;
}

.kategori-btn {
    background-color: var(--beyaz);
    color: var(--espresso-acik);
    border: none;
    padding: 12px 25px;
    border-radius: 30px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(62, 39, 35, 0.05);
    transition: all 0.3s ease;
}

.kategori-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(62, 39, 35, 0.08);
}

.kategori-btn.aktif {
    background-color: var(--yumusak-turuncu);
    color: var(--beyaz);
    box-shadow: 0 8px 20px rgba(255, 183, 77, 0.4);
}

/* Menü Izgarası */
.menu-izgarasi {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    padding: 0 40px 60px;
    max-width: 1200px;
    margin: 0 auto;
}

/* Ürün Kartı */
.urun-karti {
    background-color: var(--beyaz);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(62, 39, 35, 0.04);
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
}

.urun-karti:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(62, 39, 35, 0.08);
}

/* JS Animasyonu İçin Gizleme Sınıfı */
.gizli {
    display: none !important;
}

.urun-karti.goster-animasyon {
    animation: yumusakGiris 0.5s ease forwards;
}

@keyframes yumusakGiris {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Resim Alanları (Şimdilik renkli yer tutucular) */
.urun-resmi {
    height: 200px;
    width: 100%;
    background-size: cover;
    background-position: center;
}

.resim-1 { background-color: #d7ccc8; }
.resim-2 { background-color: #ffccbc; }
.resim-3 { background-color: #bcaaa4; }
.resim-4 { background-color: #efebe9; }
.resim-5 { background-color: #ffe0b2; }
.resim-6 { background-color: #ffcdd2; }

/* Bilgi Kısmı */
.urun-bilgi {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.urun-bilgi h3 {
    margin: 0 0 10px 0;
    font-size: 1.3rem;
}

.urun-bilgi p {
    margin: 0 0 20px 0;
    color: var(--espresso-acik);
    font-size: 0.95rem;
    line-height: 1.5;
    flex-grow: 1;
}

.fiyat {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--yumusak-turuncu);
    align-self: flex-start;
    padding: 8px 15px;
    background-color: rgba(255, 183, 77, 0.1);
    border-radius: 12px;
}`;

const js = `const kategoriButonlari = document.querySelectorAll('.kategori-btn');
const urunKartlari = document.querySelectorAll('.urun-karti');

kategoriButonlari.forEach(buton => {
    buton.addEventListener('click', () => {
        // 1. Tıklanan butona 'aktif' sınıfını ver, diğerlerinden kaldır
        kategoriButonlari.forEach(btn => btn.classList.remove('aktif'));
        buton.classList.add('aktif');

        // 2. Filtreleme işlemi
        const secilenKategori = buton.getAttribute('data-kategori');

        urunKartlari.forEach(kart => {
            // Animasyonu sıfırlamak için sınıfı kaldırıyoruz
            kart.classList.remove('goster-animasyon');
            
            const urunKategorisi = kart.getAttribute('data-kategori');

            if (secilenKategori === 'tumu' || secilenKategori === urunKategorisi) {
                kart.classList.remove('gizli');
                // Pürüzsüz giriş animasyonu için kısa bir gecikme ile sınıf ekliyoruz
                setTimeout(() => {
                    kart.classList.add('goster-animasyon');
                }, 10);
            } else {
                kart.classList.add('gizli');
            }
        });
    });
});`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('10-Kafe-Menusu created successfully!');
