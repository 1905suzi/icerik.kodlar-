document.addEventListener('DOMContentLoaded', () => {
    const flowerHead = document.getElementById('flowerHead');

    // Yaprak katmanlarının ayarları
    // Merkezden dışa doğru: w=genişlik, h=yükseklik, count=yaprak sayısı, curlBase=dışa yatma açısı, delayBase=animasyon gecikmesi
    const PETAL_LAYERS = [
        { count: 3, w: 40, h: 50, curlBase: 15, scaleBase: 0.8, delayBase: 0 },       // En içteki gonca
        { count: 5, w: 60, h: 75, curlBase: 25, scaleBase: 0.9, delayBase: 0.4 },     // İkinci katman
        { count: 7, w: 75, h: 90, curlBase: 40, scaleBase: 1.0, delayBase: 0.8 },     // Üçüncü katman
        { count: 9, w: 90, h: 105, curlBase: 55, scaleBase: 1.1, delayBase: 1.2 },    // Dördüncü katman
        { count: 11, w: 105, h: 115, curlBase: 70, scaleBase: 1.2, delayBase: 1.6 }   // En dıştaki büyük yapraklar
    ];

    function createPetals() {
        PETAL_LAYERS.forEach((layer, li) => {
            const angleStep = 360 / layer.count;
            // Her katmanı bir öncekinden biraz kaydır ki aralara denk gelsin
            const layerOffset = li * (360 / layer.count / 2) + (Math.random() - 0.5) * 10;
            
            for (let i = 0; i < layer.count; i++) {
                const petal = document.createElement('div');
                petal.className = 'petal';
                
               
                const angle = layerOffset + i * angleStep + (Math.random() - 0.5) * 8; // Y ekseninde dönüş (dağılım)
                const delay = layer.delayBase + (Math.random() * 0.2); // Açılma sırası
                const curl = layer.curlBase + (Math.random() - 0.5) * 8; // X ekseninde dışa bükülme (organik görünüm)
                const scale = layer.scaleBase + (Math.random() - 0.5) * 0.1; // Hafif büyüklük farkları
                const bloomDur = 2.5 + Math.random() * 0.5; // Animasyon süresi
                
                
                petal.style.setProperty('--angle', `${angle}deg`);
                petal.style.setProperty('--curl', `${curl}deg`);
                petal.style.setProperty('--scale', scale);
                
             
                petal.style.width = `${layer.w}px`;
                petal.style.height = `${layer.h}px`;
                
                petal.style.marginLeft = `-${layer.w / 2}px`; 
                
                petal.style.animation = `bloomAnim ${bloomDur}s cubic-bezier(0.17, 0.89, 0.32, 1.15) ${delay}s forwards`;
                
                flowerHead.appendChild(petal);
            }
        });
    }

    
    setTimeout(createPetals, 500);
});