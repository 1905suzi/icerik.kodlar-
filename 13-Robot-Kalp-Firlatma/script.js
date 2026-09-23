document.addEventListener("DOMContentLoaded", () => {
    const kalpAlani = document.getElementById('kalpAlani');
    const ucusanDiv = document.getElementById('ucusanKalpler');
    const karakter = document.querySelector('.karakter');

    const kalpNoktalari = [];
    const merkezX = 140;
    const merkezY = 130;
    const olcek = 9;

    //
    function kalpIcindeMi(px, py) {
        const nx = (px - merkezX) / (olcek * 16);
        const ny = -(py - merkezY) / (olcek * 13);
        const deger = Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * ny * ny * ny;
        return deger <= 0;
    }


    const adim = 22;

    for (let satir = 0; satir < 280; satir += adim) {
        const kayma = (Math.floor(satir / adim) % 2 === 0) ? 0 : adim / 2;
        for (let sutun = kayma; sutun < 280; sutun += adim) {
            if (kalpIcindeMi(sutun, satir)) {
                kalpNoktalari.push({ x: sutun, y: satir });
            }
        }
    }

    kalpNoktalari.sort((a, b) => {
        const mesafeA = Math.sqrt(Math.pow(a.x - merkezX, 2) + Math.pow(a.y - merkezY, 2));
        const mesafeB = Math.sqrt(Math.pow(b.x - merkezX, 2) + Math.pow(b.y - merkezY, 2));
        return mesafeA - mesafeB;
    });

    const tonlar = ['ton-1', 'ton-2', 'ton-3'];
    let siradakiKalp = 0;

    function kalpFirlat() {
        if (siradakiKalp >= kalpNoktalari.length) {
            setTimeout(() => {
                kalpAlani.innerHTML = '';
                siradakiKalp = 0;
                kalpFirlat();
            }, 3000);
            return;
        }

        const nokta = kalpNoktalari[siradakiKalp];

        const ucusan = document.createElement('div');
        ucusan.className = 'ucusan-kalp';
        ucusan.textContent = '💕';

        const karakterRect = karakter.getBoundingClientRect();
        const startX = karakterRect.right - 10;
        const startY = karakterRect.top + 30;

        const alanRect = kalpAlani.getBoundingClientRect();
        const hedefX = alanRect.left + nokta.x;
        const hedefY = alanRect.top + nokta.y;

        ucusan.style.left = startX + 'px';
        ucusan.style.top = startY + 'px';

        ucusan.animate([
            { left: startX + 'px', top: startY + 'px', opacity: 1, transform: 'scale(1)' },
            { left: hedefX + 'px', top: hedefY + 'px', opacity: 0.2, transform: 'scale(0.4)' }
        ], {
            duration: 400,
            easing: 'ease-out',
            fill: 'forwards'
        });

        ucusanDiv.appendChild(ucusan);

        setTimeout(() => {
            ucusan.remove();

            
            const miniKalp = document.createElement('div');
            miniKalp.className = 'mini-kalp ' + tonlar[Math.floor(Math.random() * tonlar.length)];
            miniKalp.style.left = nokta.x + 'px';
            miniKalp.style.top = nokta.y + 'px';
 
            kalpAlanı.appendChild(miniKalp);

            requestAnimationFrame(() =>{ 
                miniKalp.classList.add('gorunur');

            });
        },
    350);
    siradakiKalp++;
    setTimeout(kalpFirlat, 100);
    }
    setTimeout(kalpFirlat, 80);
});
