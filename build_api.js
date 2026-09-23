const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '11-Rastgele-Kullanici-API');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>İlk API Projem</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="profil-karti">
        <div class="resim-cercevesi">
            <!-- Başlangıçta boş bir resim (Yükleniyor animasyonu göreceğiz) -->
            <img id="profil-resmi" src="https://via.placeholder.com/150" alt="Profil">
        </div>
        
        <h2 id="isim">Yükleniyor...</h2>
        <p id="ulke">Lütfen Bekleyin</p>
        
        <button id="yeni-kisi-btn">Yeni Kişi Getir 🔄</button>
    </div>

    <script src="script.js"></script>
</body>
</html>`;

const css = `body {
    margin: 0;
    height: 100vh;
    background-color: #2c3e50;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.profil-karti {
    background-color: #ecf0f1;
    width: 300px;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
    text-align: center;
    transition: transform 0.3s;
}

.profil-karti:hover {
    transform: translateY(-5px);
}

.resim-cercevesi {
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
    border-radius: 50%;
    padding: 5px;
    background: linear-gradient(45deg, #3498db, #9b59b6);
}

#profil-resmi {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #ecf0f1;
    transition: opacity 0.5s;
}

h2 {
    color: #2c3e50;
    margin: 0 0 5px 0;
    font-size: 1.5rem;
}

p {
    color: #7f8c8d;
    margin: 0 0 25px 0;
    font-size: 1rem;
}

button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
    transition: 0.3s;
}

button:hover {
    background-color: #2980b9;
    box-shadow: 0 8px 20px rgba(52, 152, 219, 0.6);
}

button:active {
    transform: scale(0.95);
}`;

const js = `const btn = document.getElementById('yeni-kisi-btn');
const isimText = document.getElementById('isim');
const ulkeText = document.getElementById('ulke');
const resim = document.getElementById('profil-resmi');

// İnternetten (API'den) rastgele bir insan verisi çeken sihirli fonksiyon
async function rastgeleKisiGetir() {
    // Yükleniyor efekti vermek için yazıları değiştiriyoruz
    isimText.innerText = "Aranıyor...";
    ulkeText.innerText = "...";
    resim.style.opacity = "0.5";

    try {
        // Bedava ve açık bir API olan randomuser.me adresine istek (fetch) atıyoruz
        const cevap = await fetch('https://randomuser.me/api/');
        const veri = await cevap.json();
        
        // Gelen verinin içinden bize lazım olanları (isim, ülke, fotoğraf) ayıklıyoruz
        const kisi = veri.results[0];
        const tamIsim = \`\${kisi.name.first} \${kisi.name.last}\`;
        const ulke = kisi.location.country;
        const fotograf = kisi.picture.large;

        // Ekrana (HTML'e) bu yeni bilgileri yazdırıyoruz
        isimText.innerText = tamIsim;
        ulkeText.innerText = ulke;
        resim.src = fotograf;
        resim.style.opacity = "1";

    } catch (hata) {
        isimText.innerText = "Bir Hata Oluştu!";
        console.log("İnternet bağlantısında veya API'de sorun var: ", hata);
    }
}

// Sayfa ilk açıldığında otomatik olarak 1 kişi getirsin
rastgeleKisiGetir();

// Butona her tıklandığında yeni bir kişi getirsin
btn.addEventListener('click', rastgeleKisiGetir);`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('11-Rastgele-Kullanici-API created successfully!');
