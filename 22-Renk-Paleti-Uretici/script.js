document.addEventListener('DOMContentLoaded', () => {
    const paletteContainer = document.getElementById('paletteContainer');
    const toast = document.getElementById('toast');
    const mobileGenBtn = document.getElementById('generateBtn');

    // 15 adet sütun oluştur
    const COLUMN_COUNT = 15;
    for (let i = 0; i < COLUMN_COUNT; i++) {
        const col = document.createElement('div');
        col.className = 'color-col';
        col.innerHTML = \`
            <h2 class="hex-text" title="Tıkla ve Kopyala">#FFFFFF</h2>
            <div class="controls">
                <button class="btn-lock" title="Kilitle"><i class="fa-solid fa-lock-open"></i></button>
                <button class="btn-copy" title="Kopyala"><i class="fa-regular fa-copy"></i></button>
            </div>
        \`;
        paletteContainer.appendChild(col);
    }

    const cols = document.querySelectorAll('.color-col');

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
    function checkLuminance(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    }

    // 3. Ana Fonksiyon: Sütunlara Renkleri Dağıt
    function setColors() {
        cols.forEach(col => {
            if (col.classList.contains('locked')) return;

            const randomColor = generateRandomHex();
            col.style.backgroundColor = randomColor;
            
            const hexText = col.querySelector('.hex-text');
            hexText.innerText = randomColor;

            const contrastColor = checkLuminance(randomColor);
            hexText.style.color = contrastColor;
            col.style.color = contrastColor; 
        });
    }

    // 4. Clipboard'a Kopyalama
    function copyToClipboard(hex) {
        navigator.clipboard.writeText(hex).then(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000);
        });
    }

    // --- EVENT LISTENERS ---

    // Sütun içindeki tıklamalar
    cols.forEach(col => {
        const hexText = col.querySelector('.hex-text');
        const lockBtn = col.querySelector('.btn-lock');
        const copyBtn = col.querySelector('.btn-copy');

        hexText.addEventListener('click', () => copyToClipboard(hexText.innerText));
        copyBtn.addEventListener('click', () => copyToClipboard(hexText.innerText));

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

    // Space ile renk üretimi ve Ok tuşları ile yatay kaydırma
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault(); 
            setColors();
        } else if (e.code === 'ArrowRight') {
            paletteContainer.scrollBy({ left: 300, behavior: 'smooth' });
        } else if (e.code === 'ArrowLeft') {
            paletteContainer.scrollBy({ left: -300, behavior: 'smooth' });
        }
    });

    mobileGenBtn.addEventListener('click', setColors);

    setColors();
});