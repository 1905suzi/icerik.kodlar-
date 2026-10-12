
document.addEventListener('DOMContentLoaded', () => {
    const courierIcon = document.getElementById('courierIcon');
    const statusText = document.getElementById('statusText');
    const etaTime = document.getElementById('etaTime');
    const timelineBar = document.getElementById('timelineBar');

    // Harita Noktaları (X, Y yüzde cinsinden simülasyon)
    const positions = {
        1: { left: '8%', top: '78%' },    // Mağaza / Restoran
        2: { left: '38%', top: '56%' },   // Yola Çıktı
        3: { left: '68%', top: '42%' },   // Yaklaştı
        4: { left: '88%', top: '22%' }    // Kapıda
    };

    function updateTrackingUI() {
        const deliveries = getDeliveries();
        const current = deliveries[0]; // İlk teslimatı izliyoruz
        if (!current) return;

        statusText.innerText = current.status;
        etaTime.innerText = current.estimatedMin > 0 ? `${current.estimatedMin} dk` : 'Teslim Edildi';

        // Marker animasyonu
        const pos = positions[current.stepIndex] || positions[1];
        courierIcon.style.left = pos.left;
        courierIcon.style.top = pos.top;

        // Timeline Çubuğu
        const progressPercent = ((current.stepIndex - 1) / 3) * 100;
        timelineBar.style.width = `${progressPercent}%`;

        // Step Nodes
        for (let i = 1; i <= 4; i++) {
            const node = document.getElementById('stepNode' + i);
            node.classList.remove('active', 'passed');
            if (i < current.stepIndex) node.classList.add('passed');
            if (i === current.stepIndex) node.classList.add('active');
        }
    }

    updateTrackingUI();

    // Kurye panelinden durum değiştiğinde anında haritada hareket ettir
    window.addEventListener('storage', () => {
        updateTrackingUI();
    });
});
