document.addEventListener('DOMContentLoaded', () => {
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
});