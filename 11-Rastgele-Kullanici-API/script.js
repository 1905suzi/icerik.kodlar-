const btn = document.getElementById('yeni-kisi-btn');
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
        
        const cevap = await fetch('https://randomuser.me/api/');
        const veri = await cevap.json();
    
        const kisi = veri.results[0];
        const tamIsim = `${kisi.name.first} ${kisi.name.last}`;
        const ulke = kisi.location.country;
        const fotograf = kisi.picture.large;

     isimText.innerText=tamIsim;
     ulkeText.innerText=ulke;
     resim.innerText=fotograf;
     resim.src=fotograf;
     resim.style.opacity="1";
    }
     catch (hata) {
        isimText.innerText="Bir hata oluştu!";
        console.log("İnternet bağlantıaında veya API'de sorun var:", hata);
     }
     }
     rastgeleKisiGetir();
     btn.addEventListener('click', rastgeleKisiGetir);
