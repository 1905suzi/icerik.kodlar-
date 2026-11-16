// Giriş Sayfası Etkileşimleri
document.addEventListener('DOMContentLoaded', () => {
  const btnEdevlet = document.getElementById('btnEdevlet');
  const btnEnabiz = document.getElementById('btnEnabiz');
  const btnNeyimvar = document.querySelector('.btn-neyimvar');

  function handleLogin(serviceName) {
    // Görsel geri bildirim efekti
    const originalText = event.currentTarget.querySelector('.btn-main') 
      ? event.currentTarget.querySelector('.btn-main').innerText 
      : 'Giriş';

    alert(`🏥 [MHRS Redesign Prototip]\n${serviceName} güvenli kimlik doğrulama simülasyonu başlatıldı.\n\nBir sonraki adım: Randevu Arama & Hekim Seçim Ekranı!`);
  }

  if (btnEdevlet) {
    btnEdevlet.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogin('e-Devlet Kapısı');
    });
  }

  if (btnEnabiz) {
    btnEnabiz.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogin('e-Nabız Sağlık Sistemi');
    });
  }

  if (btnNeyimvar) {
    btnNeyimvar.addEventListener('click', () => {
      alert('✨ [NeyimVar? Yapay Zeka Asistanı]\nŞikayet analizi ve doğru poliklinik yönlendirme modülü açılıyor...');
    });
  }
});