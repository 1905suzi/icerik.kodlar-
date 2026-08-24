const kategoriButonlari = document.querySelectorAll('.kategori-btn');
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
});