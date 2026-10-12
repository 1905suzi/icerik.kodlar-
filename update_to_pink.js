const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), '29-Kuafor-Randevu-Sistemi');

// 1. data.js
const dataJs = `
const staffList = [
    { id: 1, name: 'Seda Yılmaz', role: 'Kreatif Saç Tasarımcısı & Ombre Uzmanı', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop' },
    { id: 2, name: 'Melis Kaya', role: 'Nail Art, Manikür & Protez Tırnak', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop' },
    { id: 3, name: 'Ece Demir', role: 'Profesyonel Makyaj & Cilt Bakımı', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop' }
];

const servicesList = [
    { id: 's1', name: 'Saç Kesimi, Yıkama & Fön', duration: '45 dk', price: 350, icon: 'fa-scissors' },
    { id: 's2', name: 'Nail Art & Kalıcı Oje / Manikür', duration: '60 dk', price: 400, icon: 'fa-hand-sparkles' },
    { id: 's3', name: 'Sombre / Ombre & Saç Bakımı', duration: '120 dk', price: 1200, icon: 'fa-wand-magic-sparkles' },
    { id: 's4', name: 'Gelin & Özel Gün Makyajı', duration: '90 dk', price: 850, icon: 'fa-heart' },
    { id: 's5', name: 'Lifting & İpek Kirpik', duration: '50 dk', price: 500, icon: 'fa-eye' }
];

const timeSlots = [
    '10:00', '11:00', '12:00', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30'
];

function getAppointments() {
    const data = localStorage.getItem('beauty_appointments');
    return data ? JSON.parse(data) : [];
}

function saveAppointments(appts) {
    localStorage.setItem('beauty_appointments', JSON.stringify(appts));
}
`;
fs.writeFileSync(path.join(dir, 'data.js'), dataJs);

// 2. style.css (Lüks Pembe / Glam Barbie Rose Gold)
const styleCss = `
:root {
    --bg-dark: #120910;
    --card-bg: #20101c;
    --accent: #ff5e97; /* Barbie / Glam Pembe */
    --accent-hover: #ff3b80;
    --accent-light: rgba(255, 94, 151, 0.15);
    --gold: #fcc2d7;
    --text: #fff5f8;
    --text-muted: #b89ca9;
    --border: #3b1933;
    --success: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
    background: var(--bg-dark);
    background-image: radial-gradient(circle at 10% 20%, rgba(255, 94, 151, 0.12) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(252, 194, 215, 0.08) 0%, transparent 40%);
    color: var(--text);
    min-height: 100vh;
}

header {
    background: rgba(32, 16, 28, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 18px 24px;
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
    color: var(--accent);
    filter: drop-shadow(0 0 10px rgba(255, 94, 151, 0.6));
}

.brand h1 {
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    background: linear-gradient(135deg, #fff 0%, #ffc9db 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.badge-tag {
    background: var(--accent-light);
    color: var(--accent);
    border: 1px solid rgba(255, 94, 151, 0.3);
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px;
}

.page-title {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 6px;
    color: #fff;
}

.page-subtitle {
    color: var(--text-muted);
    font-size: 0.95rem;
    margin-bottom: 28px;
}

.step-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    position: relative;
    padding: 0 10px;
}

.step-bar::before {
    content: '';
    position: absolute;
    top: 18px;
    left: 20px;
    right: 20px;
    height: 2px;
    background: var(--border);
    z-index: 1;
}

.step-item {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.step-num {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--card-bg);
    border: 2px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-muted);
    transition: 0.3s;
}

.step-item.active .step-num {
    border-color: var(--accent);
    background: var(--accent);
    color: #fff;
    box-shadow: 0 0 18px rgba(255, 94, 151, 0.6);
}

.step-item.done .step-num {
    border-color: var(--success);
    background: var(--success);
    color: #fff;
}

.step-text {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-weight: 500;
}

.booking-section {
    display: none;
    animation: fadeIn 0.3s ease;
}

.booking-section.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.grid-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.selection-card {
    background: var(--card-bg);
    border: 2px solid var(--border);
    border-radius: 20px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
}

.selection-card:hover {
    border-color: var(--accent);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(255, 94, 151, 0.25);
}

.selection-card.selected {
    border-color: var(--accent);
    background: rgba(255, 94, 151, 0.12);
    box-shadow: 0 0 24px rgba(255, 94, 151, 0.3);
}

.selection-card.selected::after {
    content: '✓';
    position: absolute;
    top: 12px;
    right: 12px;
    width: 24px;
    height: 24px;
    background: var(--accent);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.8rem;
    box-shadow: 0 0 10px rgba(255, 94, 151, 0.5);
}

.card-img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--accent);
    box-shadow: 0 0 12px rgba(255, 94, 151, 0.3);
}

.card-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: var(--accent-light);
    color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
}

.card-info h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 4px;
    color: #fff;
}

.card-info p {
    font-size: 0.85rem;
    color: var(--text-muted);
}

.card-price {
    color: var(--accent);
    font-weight: 700;
    font-size: 1.05rem;
    margin-top: 4px;
}

.slots-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 12px;
    margin-bottom: 24px;
}

.slot-btn {
    background: var(--card-bg);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 14px 10px;
    border-radius: 14px;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.95rem;
    transition: 0.2s;
    text-align: center;
}

.slot-btn:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--accent);
}

.slot-btn.selected {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
    font-weight: 700;
    box-shadow: 0 0 15px rgba(255, 94, 151, 0.5);
}

.slot-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    text-decoration: line-through;
}

.form-group {
    margin-bottom: 18px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 500;
}

.form-input {
    width: 100%;
    padding: 14px 16px;
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 14px;
    color: #fff;
    font-size: 1rem;
    outline: none;
    transition: 0.2s;
}

.form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 12px rgba(255, 94, 151, 0.3);
}

.btn-nav-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 30px;
}

.btn {
    padding: 14px 28px;
    border-radius: 30px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: 0.25s;
}

.btn-primary {
    background: linear-gradient(135deg, #ff5e97 0%, #ff3b80 100%);
    color: #fff;
    box-shadow: 0 8px 20px rgba(255, 94, 151, 0.4);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 26px rgba(255, 94, 151, 0.6);
}

.btn-secondary {
    background: var(--card-bg);
    color: var(--text);
    border: 1px solid var(--border);
}

.btn-secondary:hover {
    background: #31182a;
}

.summary-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-row:last-child {
    border-bottom: none;
    padding-top: 16px;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--accent);
}

.admin-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 30px;
}

.stat-box {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
}

.stat-val {
    font-size: 1.6rem;
    font-weight: 700;
    color: #fff;
}

.stat-lbl {
    font-size: 0.8rem;
    color: var(--text-muted);
}

.appt-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.appt-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    transition: 0.2s;
}

.appt-card:hover {
    border-color: rgba(255, 94, 151, 0.5);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.appt-client h3 {
    font-size: 1.1rem;
    margin-bottom: 4px;
    color: #fff;
}

.appt-meta {
    font-size: 0.85rem;
    color: var(--text-muted);
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
}

.appt-meta span {
    display: flex;
    align-items: center;
    gap: 6px;
}

.status-badge {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.status-pending { background: rgba(245, 158, 11, 0.15); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.3); }
.status-chair { background: rgba(255, 94, 151, 0.2); color: var(--accent); border: 1px solid rgba(255, 94, 151, 0.4); }
.status-done { background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); }
.status-cancelled { background: rgba(239, 68, 68, 0.15); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); }

.appt-actions {
    display: flex;
    gap: 8px;
}

.act-btn {
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
}

.act-chair { background: var(--accent); color: #fff; }
.act-done { background: var(--success); color: #fff; }
.act-cancel { background: rgba(239, 68, 68, 0.2); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.4); }

.act-btn:hover { opacity: 0.9; transform: scale(1.04); }

.live-dot {
    width: 8px;
    height: 8px;
    background: var(--accent);
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0 0 10px var(--accent);
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 94, 151, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(255, 94, 151, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 94, 151, 0); }
}

@media(max-width: 768px) {
    .appt-card {
        flex-direction: column;
        align-items: flex-start;
    }
    .appt-actions {
        width: 100%;
        justify-content: flex-end;
    }
}
`;
fs.writeFileSync(path.join(dir, 'style.css'), styleCss);

// 3. index.html
const indexHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Suzi's Beauty Lounge - Kadın Kuaförü & Güzellik Randevusu</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <div class="brand">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <div>
                <h1>SUZI'S BEAUTY</h1>
                <div style="font-size: 0.75rem; color: var(--accent); letter-spacing: 2px;">HAIR & BEAUTY LOUNGE</div>
            </div>
        </div>
        <div class="badge-tag"><i class="fa-solid fa-clock"></i> 10:00 - 20:00</div>
    </header>

    <div class="container">
        <!-- Step Indicator -->
        <div class="step-bar">
            <div class="step-item active" id="stepIndicator1">
                <div class="step-num">1</div>
                <div class="step-text">Bakım & Hizmet</div>
            </div>
            <div class="step-item" id="stepIndicator2">
                <div class="step-num">2</div>
                <div class="step-text">Uzman Seçimi</div>
            </div>
            <div class="step-item" id="stepIndicator3">
                <div class="step-num">3</div>
                <div class="step-text">Tarih & Saat</div>
            </div>
            <div class="step-item" id="stepIndicator4">
                <div class="step-num">4</div>
                <div class="step-text">Onay</div>
            </div>
        </div>

        <!-- Adım 1: Hizmet Seçimi -->
        <div class="booking-section active" id="step1">
            <h2 class="page-title">Hangi Hizmeti Almak İstiyorsunuz? ✨</h2>
            <p class="page-subtitle">Işıltınızı ortaya çıkaracak profesyonel bakım ve tasarım hizmetlerimiz:</p>
            <div class="grid-cards" id="servicesGrid"></div>
            <div class="btn-nav-row">
                <div></div>
                <button class="btn btn-primary" id="toStep2Btn" disabled>İleri: Uzman Seç <i class="fa-solid fa-arrow-right"></i></button>
            </div>
        </div>

        <!-- Adım 2: Uzman Seçimi -->
        <div class="booking-section" id="step2">
            <h2 class="page-title">Güzellik Uzmanınızı Seçin 💖</h2>
            <p class="page-subtitle">Alanında usta stilistlerimizle kendinizi şımartın.</p>
            <div class="grid-cards" id="staffGrid"></div>
            <div class="btn-nav-row">
                <button class="btn btn-secondary" onclick="goToStep(1)"><i class="fa-solid fa-arrow-left"></i> Geri</button>
                <button class="btn btn-primary" id="toStep3Btn" disabled>İleri: Tarih & Saat <i class="fa-solid fa-arrow-right"></i></button>
            </div>
        </div>

        <!-- Adım 3: Tarih & Saat Seçimi -->
        <div class="booking-section" id="step3">
            <h2 class="page-title">Randevu Saatinizi Belirleyin 📅</h2>
            <p class="page-subtitle">Seçilen günde salonumuzdaki müsait randevu saatleri:</p>

            <div class="form-group" style="max-width: 250px;">
                <label><i class="fa-regular fa-calendar"></i> Tarih Seçin</label>
                <input type="date" id="apptDate" class="form-input">
            </div>

            <div class="slots-grid" id="slotsContainer"></div>

            <div class="btn-nav-row">
                <button class="btn btn-secondary" onclick="goToStep(2)"><i class="fa-solid fa-arrow-left"></i> Geri</button>
                <button class="btn btn-primary" id="toStep4Btn" disabled>İleri: Bilgiler <i class="fa-solid fa-arrow-right"></i></button>
            </div>
        </div>

        <!-- Adım 4: İletişim & Onay -->
        <div class="booking-section" id="step4">
            <h2 class="page-title">Randevu Özeti & Onay 🌸</h2>
            <p class="page-subtitle">Bilgilerinizi onaylayarak yerinizi ayırtın.</p>

            <div class="summary-card" id="summaryCard"></div>

            <div style="background: var(--card-bg); padding: 24px; border-radius: 20px; border: 1px solid var(--border);">
                <div class="form-group">
                    <label><i class="fa-solid fa-user"></i> Adınız & Soyadınız</label>
                    <input type="text" id="clientName" class="form-input" placeholder="Örn: Merve Yıldız">
                </div>
                <div class="form-group">
                    <label><i class="fa-solid fa-phone"></i> Telefon Numaranız</label>
                    <input type="tel" id="clientPhone" class="form-input" placeholder="05XX XXX XX XX">
                </div>
                <div class="form-group">
                    <label><i class="fa-solid fa-note-sticky"></i> Özel Not (Opsiyonel)</label>
                    <input type="text" id="clientNote" class="form-input" placeholder="Özel tırnak modeli, saç rengi tercihi vb.">
                </div>
            </div>

            <div class="btn-nav-row">
                <button class="btn btn-secondary" onclick="goToStep(3)"><i class="fa-solid fa-arrow-left"></i> Geri</button>
                <button class="btn btn-primary" id="confirmBookingBtn"><i class="fa-solid fa-check"></i> Randevuyu Tamamla</button>
            </div>
        </div>

        <!-- Başarı Ekranı -->
        <div class="booking-section" id="successSection">
            <div style="text-align: center; padding: 60px 20px;">
                <div style="width: 80px; height: 80px; background: rgba(255, 94, 151, 0.15); color: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 20px;">
                    <i class="fa-solid fa-heart"></i>
                </div>
                <h2 style="font-size: 1.8rem; margin-bottom: 8px;">Randevunuz Başarıyla Alındı! 💖</h2>
                <p style="color: var(--text-muted); max-width: 450px; margin: 0 auto 24px;">Randevunuz güzellik uzmanımızın paneline iletildi. Sizi ağırlamaktan büyük mutluluk duyacağız.</p>
                <div style="background: var(--card-bg); max-width: 420px; margin: 0 auto; padding: 20px; border-radius: 16px; border: 1px solid var(--border); text-align: left;" id="ticketInfo"></div>
                <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 24px;"><i class="fa-solid fa-rotate-right"></i> Yeni Randevu Al</button>
            </div>
        </div>
    </div>

    <script src="data.js"></script>
    <script src="customer.js"></script>
</body>
</html>`;
fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);

// 4. admin.html
const adminHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Suzi's Beauty - Salon Randevu & Koltuk Yönetimi</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <div class="brand">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <div>
                <h1>SUZI'S BEAUTY</h1>
                <div style="font-size: 0.75rem; color: var(--accent); letter-spacing: 2px;">SALON & KOLTUK TAKİP PANELİ</div>
            </div>
        </div>
        <div class="badge-tag" style="background: rgba(255, 94, 151, 0.15); color: var(--accent);"><span class="live-dot"></span> Canlı Panel</div>
    </header>

    <div class="container">
        <!-- İstatistikler -->
        <div class="admin-stats">
            <div class="stat-box">
                <div class="stat-icon" style="background: rgba(255, 94, 151, 0.15); color: var(--accent);"><i class="fa-solid fa-calendar-check"></i></div>
                <div>
                    <div class="stat-val" id="totalApptCount">0</div>
                    <div class="stat-lbl">Toplam Randevu</div>
                </div>
            </div>
            <div class="stat-box">
                <div class="stat-icon" style="background: rgba(252, 194, 215, 0.15); color: var(--gold);"><i class="fa-solid fa-couch"></i></div>
                <div>
                    <div class="stat-val" id="inChairCount">0</div>
                    <div class="stat-lbl">Şu An Bakımda / Koltukta</div>
                </div>
            </div>
            <div class="stat-box">
                <div class="stat-icon" style="background: rgba(16, 185, 129, 0.15); color: var(--success);"><i class="fa-solid fa-turkish-lira-sign"></i></div>
                <div>
                    <div class="stat-val" id="totalRevenue">0 ₺</div>
                    <div class="stat-lbl">Günlük Ciro</div>
                </div>
            </div>
        </div>

        <!-- Filtre Barı -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
            <h2 class="page-title" style="margin-bottom: 0;">Gelen Randevular</h2>
            <div style="display: flex; gap: 10px;">
                <select id="filterStaff" class="form-input" style="padding: 8px 14px; width: auto;">
                    <option value="all">Tüm Uzmanlar</option>
                    <option value="1">Seda Yılmaz (Saç / Ombre)</option>
                    <option value="2">Melis Kaya (Nail Art)</option>
                    <option value="3">Ece Demir (Makyaj & Bakım)</option>
                </select>
                <button class="btn btn-secondary" onclick="clearAllData()" style="padding: 8px 16px; font-size: 0.85rem;"><i class="fa-solid fa-trash"></i> Verileri Sıfırla</button>
            </div>
        </div>

        <!-- Randevu Listesi -->
        <div class="appt-list" id="adminApptList"></div>
    </div>

    <script src="data.js"></script>
    <script src="admin.js"></script>
</body>
</html>`;
fs.writeFileSync(path.join(dir, 'admin.html'), adminHtml);

console.log('Pink Beauty Lounge files updated perfectly!');
