const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '31-Kurye-Canli-Takip');
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

// 1. data.js
const dataJs = `
const initialDeliveries = [
    {
        id: 'KRG-9482',
        customer: 'Suzi Yılmaz',
        address: 'Kadıköy Moda Cad. No:42/B, İstanbul',
        items: '2x Soğuk Kahve, 1x San Sebastian Cheesecake',
        courier: 'Ahmet Şimşek (Motorlu Kurye)',
        phone: '0532 999 88 77',
        status: 'Hazırlanıyor', // 'Hazırlanıyor', 'Yola Çıktı', 'Yaklaştı (2 dk)', 'Teslim Edildi'
        stepIndex: 1, // 1 to 4
        estimatedMin: 18,
        createdAt: '16:45'
    }
];

function getDeliveries() {
    const d = localStorage.getItem('courier_deliveries');
    return d ? JSON.parse(d) : initialDeliveries;
}

function saveDeliveries(data) {
    localStorage.setItem('courier_deliveries', JSON.stringify(data));
}
`;

// 2. style.css
const styleCss = `
:root {
    --bg-app: #0e131f;
    --card-surface: #182032;
    --accent-teal: #00e5a3;
    --accent-cyan: #00c0fa;
    --text-light: #ffffff;
    --text-muted: #8b99b5;
    --border: #232f48;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
    background: var(--bg-app);
    color: var(--text-light);
    min-height: 100vh;
}

header {
    background: rgba(24, 32, 50, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand i {
    font-size: 1.8rem;
    color: var(--accent-teal);
}

.brand h1 {
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: 1px;
}

.container {
    max-width: 960px;
    margin: 0 auto;
    padding: 24px;
}

/* Map Simulation Box */
.map-simulation {
    background: #131927;
    border: 1px solid var(--border);
    border-radius: 24px;
    height: 320px;
    position: relative;
    overflow: hidden;
    margin-bottom: 24px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.4);
}

/* Simulated Map Roads */
.road-network {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
        radial-gradient(circle at 20% 30%, rgba(0, 229, 163, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(0, 192, 250, 0.08) 0%, transparent 40%);
}

.svg-map {
    position: absolute;
    width: 100%;
    height: 100%;
}

.courier-marker {
    position: absolute;
    width: 50px;
    height: 50px;
    background: var(--accent-teal);
    color: #0e131f;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    box-shadow: 0 0 25px var(--accent-teal);
    transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translate(-50%, -50%);
    z-index: 10;
}

.target-marker {
    position: absolute;
    right: 60px;
    top: 50px;
    color: #ef4444;
    font-size: 2.2rem;
    transform: translate(50%, -50%);
    filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.6));
    z-index: 5;
    text-align: center;
}

.target-label {
    font-size: 0.75rem;
    color: #fff;
    background: rgba(0,0,0,0.7);
    padding: 2px 8px;
    border-radius: 10px;
    margin-top: 4px;
    font-weight: 600;
}

/* Live Status Tracker Box */
.status-card {
    background: var(--card-surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 24px;
}

.delivery-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
    padding-bottom: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 12px;
}

.status-badge-lg {
    background: rgba(0, 229, 163, 0.15);
    color: var(--accent-teal);
    padding: 8px 18px;
    border-radius: 30px;
    font-weight: 700;
    font-size: 0.95rem;
    border: 1px solid rgba(0, 229, 163, 0.3);
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

/* Step Progression */
.timeline {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin: 30px 10px;
}

.timeline::before {
    content: '';
    position: absolute;
    top: 18px;
    left: 20px;
    right: 20px;
    height: 3px;
    background: var(--border);
    z-index: 1;
}

.timeline-progress {
    position: absolute;
    top: 18px;
    left: 20px;
    height: 3px;
    background: var(--accent-teal);
    z-index: 2;
    transition: width 0.6s ease;
    box-shadow: 0 0 10px var(--accent-teal);
}

.time-step {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 80px;
    text-align: center;
}

.step-circle {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--card-surface);
    border: 2px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-size: 0.9rem;
    transition: 0.3s;
}

.time-step.active .step-circle {
    border-color: var(--accent-teal);
    background: var(--accent-teal);
    color: #0e131f;
    box-shadow: 0 0 18px var(--accent-teal);
}

.time-step.passed .step-circle {
    border-color: var(--accent-teal);
    background: var(--accent-teal);
    color: #0e131f;
}

.step-title {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-weight: 600;
}

.time-step.active .step-title {
    color: #fff;
}

/* Courier Info Bar */
.courier-info-row {
    background: rgba(0, 0, 0, 0.25);
    border-radius: 16px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}

.courier-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    color: var(--accent-cyan);
}

/* Driver Screen */
.action-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin-top: 20px;
}

.btn-status {
    padding: 16px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--card-surface);
    color: #fff;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.btn-status i {
    font-size: 1.4rem;
}

.btn-status:hover {
    border-color: var(--accent-teal);
    transform: translateY(-2px);
    background: rgba(0, 229, 163, 0.1);
}

.btn-status.current {
    background: var(--accent-teal);
    color: #0e131f;
    border-color: var(--accent-teal);
    box-shadow: 0 0 20px var(--accent-teal);
}
`;

// 3. index.html (Müşteri Canlı Takip Ekranı)
const indexHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Suzi Express - Canlı Kurye Takip Ekranı</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header>
        <div class="brand">
            <i class="fa-solid fa-bolt-lightning"></i>
            <div>
                <h1>SUZI EXPRESS</h1>
                <div style="font-size: 0.7rem; color: var(--accent-teal); letter-spacing: 2px;">CANLI SİPARİŞ & KURYE TAKİP</div>
            </div>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-radar"></i> GPS Canlı Sinyal</div>
    </header>

    <div class="container">
        <!-- Harita Simülasyonu -->
        <div class="map-simulation">
            <div class="road-network"></div>
            <!-- SVG Yollar / Rota -->
            <svg class="svg-map">
                <path d="M 60 260 Q 250 200 450 180 T 800 60" fill="none" stroke="rgba(0, 229, 163, 0.3)" stroke-width="6" stroke-dasharray="8 8"/>
                <path id="activePath" d="M 60 260 Q 250 200 450 180 T 800 60" fill="none" stroke="var(--accent-teal)" stroke-width="6"/>
            </svg>

            <!-- Kurye Simgesi (Dinamik Pozisyon) -->
            <div class="courier-marker" id="courierIcon">
                <i class="fa-solid fa-motorcycle"></i>
            </div>

            <!-- Müşteri Evi -->
            <div class="target-marker">
                <i class="fa-solid fa-location-dot"></i>
                <div class="target-label">Teslimat Adresi</div>
            </div>
        </div>

        <!-- Takip Kartı -->
        <div class="status-card">
            <div class="delivery-header">
                <div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">Takip Kodu: <strong style="color:#fff;" id="trackId">KRG-9482</strong></div>
                    <h2 style="font-size: 1.4rem; margin-top: 4px;" id="statusText">Kurye Yola Çıktı</h2>
                </div>
                <div>
                    <div class="status-badge-lg" id="etaBadge">
                        <i class="fa-regular fa-clock"></i> Tahmini: <span id="etaTime">18 dk</span>
                    </div>
                </div>
            </div>

            <!-- Adım Çubuğu (Timeline) -->
            <div class="timeline">
                <div class="timeline-progress" id="timelineBar" style="width: 33%;"></div>

                <div class="time-step passed" id="stepNode1">
                    <div class="step-circle"><i class="fa-solid fa-store"></i></div>
                    <div class="step-title">Hazırlanıyor</div>
                </div>
                <div class="time-step active" id="stepNode2">
                    <div class="step-circle"><i class="fa-solid fa-motorcycle"></i></div>
                    <div class="step-title">Yola Çıktı</div>
                </div>
                <div class="time-step" id="stepNode3">
                    <div class="step-circle"><i class="fa-solid fa-location-crosshairs"></i></div>
                    <div class="step-title">Yaklaştı (2 dk)</div>
                </div>
                <div class="time-step" id="stepNode4">
                    <div class="step-circle"><i class="fa-solid fa-house-chimney-check"></i></div>
                    <div class="step-title">Teslim Edildi</div>
                </div>
            </div>

            <!-- Kurye & Detay -->
            <div class="courier-info-row">
                <div style="display: flex; align-items: center; gap: 14px;">
                    <div class="courier-avatar"><i class="fa-solid fa-helmet-safety"></i></div>
                    <div>
                        <div style="font-weight: 700;" id="courierName">Ahmet Şimşek</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">Suzi Express Hızlı Kurye • 4.9 ★</div>
                    </div>
                </div>
                <div>
                    <a href="tel:05329998877" style="background: rgba(0, 229, 163, 0.15); color: var(--accent-teal); border: 1px solid rgba(0, 229, 163, 0.4); text-decoration: none; padding: 10px 18px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-phone"></i> Kuryeyi Ara
                    </a>
                </div>
            </div>

            <div style="margin-top: 18px; font-size: 0.9rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 16px;">
                <div><i class="fa-solid fa-map-pin" style="color:var(--accent-teal);"></i> <strong>Adres:</strong> <span id="deliveryAddress">Kadıköy Moda Cad. No:42/B, İstanbul</span></div>
                <div style="margin-top: 6px;"><i class="fa-solid fa-box-open" style="color:var(--accent-cyan);"></i> <strong>İçerik:</strong> <span id="orderItems">2x Soğuk Kahve, 1x San Sebastian Cheesecake</span></div>
            </div>
        </div>
    </div>

    <script src="data.js"></script>
    <script src="customer.js"></script>
</body>
</html>`;

// 4. customer.js
const customerJs = `
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
        etaTime.innerText = current.estimatedMin > 0 ? \`\${current.estimatedMin} dk\` : 'Teslim Edildi';

        // Marker animasyonu
        const pos = positions[current.stepIndex] || positions[1];
        courierIcon.style.left = pos.left;
        courierIcon.style.top = pos.top;

        // Timeline Çubuğu
        const progressPercent = ((current.stepIndex - 1) / 3) * 100;
        timelineBar.style.width = \`\${progressPercent}%\`;

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
`;

// 5. kurye.html (Kurye / Sürücü Paneli)
const kuryeHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Suzi Express - Kurye Sürücü Paneli</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header>
        <div class="brand">
            <i class="fa-solid fa-motorcycle" style="color:var(--accent-teal);"></i>
            <div>
                <h1>SUZI EXPRESS</h1>
                <div style="font-size: 0.7rem; color: var(--accent-teal); letter-spacing: 2px;">KURYE AKTİF GÖREV PANELİ</div>
            </div>
        </div>
        <div style="background: rgba(0, 229, 163, 0.15); color: var(--accent-teal); padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700;">
            <i class="fa-solid fa-satellite-dish"></i> GPS Açık
        </div>
    </header>

    <div class="container">
        <div class="status-card">
            <h2 style="font-size: 1.4rem; margin-bottom: 6px;">Aktif Görev: Paket #KRG-9482</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Durumu değiştirdiğinizde müşterinin haritasındaki kurye simgesi canlı hareket edecektir.</p>

            <div style="background: rgba(0,0,0,0.2); padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px solid var(--border);">
                <div><strong>Müşteri:</strong> Suzi Yılmaz (0532 999 88 77)</div>
                <div style="margin-top: 4px;"><strong>Adres:</strong> Kadıköy Moda Cad. No:42/B, İstanbul</div>
                <div style="margin-top: 4px;"><strong>Sipariş:</strong> 2x Soğuk Kahve, 1x San Sebastian Cheesecake</div>
            </div>

            <h3 style="font-size: 1.1rem; margin-bottom: 12px;">Durum Güncelle (Müşteriye Anlık İlet)</h3>
            <div class="action-grid">
                <button class="btn-status" id="btnStep1" onclick="setCourierStatus(1, 'Hazırlanıyor', 25)">
                    <i class="fa-solid fa-store"></i>
                    <span>1. Hazırlanıyor</span>
                </button>
                <button class="btn-status" id="btnStep2" onclick="setCourierStatus(2, 'Kurye Yola Çıktı', 15)">
                    <i class="fa-solid fa-motorcycle"></i>
                    <span>2. Yola Çıktım</span>
                </button>
                <button class="btn-status" id="btnStep3" onclick="setCourierStatus(3, 'Kapıya Yaklaştım (2 dk)', 2)">
                    <i class="fa-solid fa-location-crosshairs"></i>
                    <span>3. Yaklaştım (2 dk)</span>
                </button>
                <button class="btn-status" id="btnStep4" onclick="setCourierStatus(4, 'Teslim Edildi', 0)">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>4. Teslim Ettim</span>
                </button>
            </div>
        </div>
    </div>

    <script src="data.js"></script>
    <script src="kurye.js"></script>
</body>
</html>`;

// 6. kurye.js
const kuryeJs = `
function updateButtons() {
    const list = getDeliveries();
    const current = list[0];
    if (!current) return;

    for (let i = 1; i <= 4; i++) {
        const btn = document.getElementById('btnStep' + i);
        if (i === current.stepIndex) {
            btn.classList.add('current');
        } else {
            btn.classList.remove('current');
        }
    }
}

window.setCourierStatus = (stepIndex, statusName, eta) => {
    const list = getDeliveries();
    if (list[0]) {
        list[0].stepIndex = stepIndex;
        list[0].status = statusName;
        list[0].estimatedMin = eta;
        saveDeliveries(list);
        updateButtons();
    }
};

updateButtons();

window.addEventListener('storage', () => {
    updateButtons();
});
`;

fs.writeFileSync(path.join(dirPath, 'data.js'), dataJs);
fs.writeFileSync(path.join(dirPath, 'style.css'), styleCss);
fs.writeFileSync(path.join(dirPath, 'index.html'), indexHtml);
fs.writeFileSync(path.join(dirPath, 'customer.js'), customerJs);
fs.writeFileSync(path.join(dirPath, 'kurye.html'), kuryeHtml);
fs.writeFileSync(path.join(dirPath, 'kurye.js'), kuryeJs);

console.log('31-Kurye-Canli-Takip generated successfully!');
