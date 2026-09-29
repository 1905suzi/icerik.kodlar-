const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '23-Hava-Durumu-App');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Hava Durumu</title>
    <link rel="stylesheet" href="style.css">
    <!-- FontAwesome Yüklüyoruz (İkonlar için) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    
    <div class="app-wrap default-bg" id="appWrap">
        
        <div class="weather-card">
            <!-- Arama Alanı -->
            <div class="search-box">
                <i class="fa-solid fa-location-dot location-icon"></i>
                <input type="text" id="cityInput" placeholder="Şehir adı girin (Örn: Istanbul)...">
                <button id="searchBtn"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>

            <!-- Yükleniyor veya Hata Mesajı -->
            <div class="message" id="message"></div>

            <!-- Hava Durumu Sonuç Alanı (Başlangıçta Gizli) -->
            <div class="weather-info" id="weatherInfo" style="display: none;">
                <div class="weather-main">
                    <i class="fa-solid fa-cloud weather-icon" id="weatherIcon"></i>
                    <h1 class="temperature" id="temp">--°C</h1>
                    <h2 class="city-name" id="cityName">Şehir</h2>
                    <p class="description" id="description">Açık</p>
                </div>

                <div class="weather-details">
                    <div class="detail">
                        <i class="fa-solid fa-water"></i>
                        <div>
                            <span class="detail-title">Nem</span>
                            <span class="detail-value" id="humidity">--%</span>
                        </div>
                    </div>
                    <div class="detail">
                        <i class="fa-solid fa-wind"></i>
                        <div>
                            <span class="detail-title">Rüzgar</span>
                            <span class="detail-value" id="windSpeed">-- km/s</span>
                        </div>
                    </div>
                </div>
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
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Dinamik Arkaplan Sınıfları */
.app-wrap {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.8s ease;
}

.default-bg {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}
.sunny-bg {
    background: linear-gradient(135deg, #f2994a 0%, #f2c94c 100%);
}
.cloudy-bg {
    background: linear-gradient(135deg, #757f9a 0%, #d7dde8 100%);
}
.rainy-bg {
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
}
.snowy-bg {
    background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
}
.storm-bg {
    background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
}

/* iOS Stili Glassmorphism Kart */
.weather-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 40px; /* İstenen Oval Kenarlar */
    padding: 40px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 30px 60px rgba(0,0,0,0.2), inset 0 0 10px rgba(255,255,255,0.2);
    color: white;
    text-align: center;
    transition: all 0.4s ease;
}

/* Arama Çubuğu */
.search-box {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 30px;
    padding: 10px 20px;
    margin-bottom: 30px;
}
.location-icon {
    font-size: 1.2rem;
    margin-right: 15px;
}
.search-box input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 1.1rem;
}
.search-box input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}
.search-box button {
    background: white;
    color: #1e3c72;
    border: none;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: transform 0.2s, background 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
}
.search-box button:hover {
    transform: scale(1.1);
}

/* Hata ve Bilgi Mesajı */
.message {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 20px;
    min-height: 25px;
}

/* Hava Durumu Ana Alanı */
.weather-main {
    animation: fadeIn 0.8s ease;
}
.weather-icon {
    font-size: 6rem;
    margin-bottom: 15px;
    text-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
.temperature {
    font-size: 4rem;
    font-weight: 800;
    letter-spacing: -2px;
    text-shadow: 0 5px 10px rgba(0,0,0,0.2);
}
.city-name {
    font-size: 2rem;
    font-weight: 600;
    margin: 10px 0 5px 0;
}
.description {
    font-size: 1.2rem;
    text-transform: capitalize;
    margin-bottom: 30px;
    font-weight: 500;
    opacity: 0.9;
}

/* Alt Detaylar (Nem & Rüzgar) */
.weather-details {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.2);
}
.detail {
    display: flex;
    align-items: center;
    gap: 15px;
    text-align: left;
}
.detail i {
    font-size: 2rem;
}
.detail-title {
    display: block;
    font-size: 0.9rem;
    opacity: 0.8;
}
.detail-value {
    display: block;
    font-size: 1.2rem;
    font-weight: 600;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
`;

const js = `document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('cityInput');
    const message = document.getElementById('message');
    const weatherInfo = document.getElementById('weatherInfo');
    const appWrap = document.getElementById('appWrap');

    // UI Elementleri
    const weatherIcon = document.getElementById('weatherIcon');
    const tempEl = document.getElementById('temp');
    const cityNameEl = document.getElementById('cityName');
    const descriptionEl = document.getElementById('description');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('windSpeed');

    // Hava kodu sözlüğü (WMO Weather interpretation codes)
    const weatherCodes = {
        0: { desc: 'Açık / Güneşli', icon: 'fa-sun', bg: 'sunny-bg' },
        1: { desc: 'Çoğunlukla Açık', icon: 'fa-cloud-sun', bg: 'sunny-bg' },
        2: { desc: 'Parçalı Bulutlu', icon: 'fa-cloud-sun', bg: 'cloudy-bg' },
        3: { desc: 'Kapalı Bulutlu', icon: 'fa-cloud', bg: 'cloudy-bg' },
        45: { desc: 'Sisli', icon: 'fa-smog', bg: 'cloudy-bg' },
        48: { desc: 'Kırağılı Sis', icon: 'fa-smog', bg: 'cloudy-bg' },
        51: { desc: 'Hafif Çisenti', icon: 'fa-cloud-rain', bg: 'rainy-bg' },
        53: { desc: 'Çisenti', icon: 'fa-cloud-rain', bg: 'rainy-bg' },
        55: { desc: 'Yoğun Çisenti', icon: 'fa-cloud-rain', bg: 'rainy-bg' },
        61: { desc: 'Hafif Yağmur', icon: 'fa-cloud-showers-heavy', bg: 'rainy-bg' },
        63: { desc: 'Orta Şiddetli Yağmur', icon: 'fa-cloud-showers-heavy', bg: 'rainy-bg' },
        65: { desc: 'Şiddetli Yağmur', icon: 'fa-cloud-showers-heavy', bg: 'rainy-bg' },
        71: { desc: 'Hafif Kar', icon: 'fa-snowflake', bg: 'snowy-bg' },
        73: { desc: 'Orta Şiddetli Kar', icon: 'fa-snowflake', bg: 'snowy-bg' },
        75: { desc: 'Yoğun Kar', icon: 'fa-snowflake', bg: 'snowy-bg' },
        95: { desc: 'Gök Gürültülü Fırtına', icon: 'fa-cloud-bolt', bg: 'storm-bg' }
    };

    // Arama Butonu Eventi
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        } else {
            showMessage('Lütfen bir şehir adı girin.');
        }
    });

    // Enter tuşu desteği
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    function showMessage(text) {
        message.innerText = text;
        weatherInfo.style.display = 'none';
    }

    // Ana Asenkron Fonksiyon (Async / Await)
    async function getWeather(cityName) {
        try {
            showMessage('Aranıyor... 🔍');
            
            // 1. ADIM: Geocoding API ile şehir adından Koordinat (Enlem, Boylam) bul
            const geoRes = await fetch(\`https://geocoding-api.open-meteo.com/v1/search?name=\${cityName}&count=1&language=tr\`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                showMessage('Şehir bulunamadı! Lütfen geçerli bir isim girin.');
                return;
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            // 2. ADIM: Forecast API ile koordinatlardan Hava Durumu verisini çek
            const weatherRes = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${latitude}&longitude=\${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m\`);
            const weatherData = await weatherRes.json();

            const current = weatherData.current;
            
            // Verileri Arayüze İşle
            updateUI(name, country, current);

        } catch (error) {
            console.error(error);
            showMessage('Bağlantı hatası! İnternetinizi kontrol edin.');
        }
    }

    function updateUI(name, country, currentData) {
        // Hata mesajını temizle, sonucu göster
        message.innerText = '';
        weatherInfo.style.display = 'block';

        // Sıcaklık, Nem ve Rüzgar
        tempEl.innerText = Math.round(currentData.temperature_2m) + '°C';
        cityNameEl.innerText = \`\${name}, \${country}\`;
        humidityEl.innerText = currentData.relative_humidity_2m + '%';
        windSpeedEl.innerText = Math.round(currentData.wind_speed_10m) + ' km/s';

        // WMO Koduna göre analiz
        const code = currentData.weather_code;
        // Eğer kod listede yoksa varsayılan olarak kapalı (3) al
        const condition = weatherCodes[code] || weatherCodes[3];

        descriptionEl.innerText = condition.desc;

        // İkonu Güncelle
        weatherIcon.className = \`fa-solid \${condition.icon} weather-icon\`;

        // Dinamik Arka Planı Güncelle
        appWrap.className = \`app-wrap \${condition.bg}\`;
    }
});
`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('23-Hava-Durumu-App created successfully!');
