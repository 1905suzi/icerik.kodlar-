document.addEventListener('DOMContentLoaded', () => {
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
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=tr`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                showMessage('Şehir bulunamadı! Lütfen geçerli bir isim girin.');
                return;
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            // 2. ADIM: Forecast API ile koordinatlardan Hava Durumu verisini çek
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
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
        cityNameEl.innerText = `${name}, ${country}`;
        humidityEl.innerText = currentData.relative_humidity_2m + '%';
        windSpeedEl.innerText = Math.round(currentData.wind_speed_10m) + ' km/s';

        // WMO Koduna göre analiz
        const code = currentData.weather_code;
        // Eğer kod listede yoksa varsayılan olarak kapalı (3) al
        const condition = weatherCodes[code] || weatherCodes[3];

        descriptionEl.innerText = condition.desc;

        // İkonu Güncelle
        weatherIcon.className = `fa-solid ${condition.icon} weather-icon`;

        // Dinamik Arka Planı Güncelle
        appWrap.className = `app-wrap ${condition.bg}`;
    }
});
