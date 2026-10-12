const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '29-Kuafor-Randevu-Sistemi');
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

// 1. data.js
const dataJs = `
const staffList = [
    { id: 1, name: 'Burak Usta', role: 'Baş Berber & Saç Tasarım', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop' },
    { id: 2, name: 'Emre Keskin', role: 'Sakal & Klasik Tıraş Uzmanı', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop' },
    { id: 3, name: 'Can Demir', role: 'Cilt Bakımı & Renklendirme', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop' }
];

const servicesList = [
    { id: 's1', name: 'Modern Saç Kesimi & Yıkama', duration: '40 dk', price: 250, icon: 'fa-scissors' },
    { id: 's2', name: 'Sakal Tasarımı & Sıcak Havlu', duration: '25 dk', price: 150, icon: 'fa-razor' },
    { id: 's3', name: 'Saç + Sakal Full Bakım', duration: '60 dk', price: 350, icon: 'fa-crown' },
    { id: 's4', name: 'Cilt Bakımı & Siyah Maske', duration: '30 dk', price: 200, icon: 'fa-spa' }
];

const timeSlots = [
    '10:00', '11:00', '12:00', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30'
];

function getAppointments() {
    const data = localStorage.getItem('barber_appointments');
    return data ? JSON.parse(data) : [];
}

function saveAppointments(appts) {
    localStorage.setItem('barber_appointments', JSON.stringify(appts));
}
`;

// 2. style.css
const styleCss = `
:root {
    --bg-dark: #12151c;
    --card-bg: #1c212c;
    --accent: #d4af37; /* Klasik Berber Altın Sarısı */
    --accent-hover: #b89628;
    --text: #f0f2f5;
    --text-muted: #9ba3af;
    --border: #2b3242;
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
    color: var(--text);
    min-height: 100vh;
}

/* Header */
header {
    background: rgba(28, 33, 44, 0.95);
    backdrop-filter: blur(10px);
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
}

.brand h1 {
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: #fff;
}

.badge-tag {
    background: rgba(212, 175, 55, 0.15);
    color: var(--accent);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

/* Container */
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

/* Step Bar */
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
    color: #000;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
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

/* Sections */
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

/* Grid Cards */
.grid-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.selection-card {
    background: var(--card-bg);
    border: 2px solid var(--border);
    border-radius: 16px;
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
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.selection-card.selected {
    border-color: var(--accent);
    background: rgba(212, 175, 55, 0.08);
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
}

.selection-card.selected::after {
    content: '✓';
    position: absolute;
    top: 12px;
    right: 12px;
    width: 22px;
    height: 22px;
    background: var(--accent);
    color: #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.75rem;
}

.card-img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--accent);
}

.card-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background: rgba(212, 175, 55, 0.15);
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
    font-size: 1rem;
    margin-top: 4px;
}

/* Time Slot Grid */
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
    border-radius: 12px;
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
    color: #000;
    border-color: var(--accent);
    font-weight: 700;
}

.slot-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    text-decoration: line-through;
    border-color: rgba(255,255,255,0.05);
}

/* Form */
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
    border-radius: 12px;
    color: #fff;
    font-size: 1rem;
    outline: none;
    transition: 0.2s;
}

.form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
}

/* Navigation Buttons */
.btn-nav-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 30px;
}

.btn {
    padding: 14px 28px;
    border-radius: 12px;
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
    background: var(--accent);
    color: #000;
}

.btn-primary:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.btn-secondary {
    background: var(--card-bg);
    color: var(--text);
    border: 1px solid var(--border);
}

.btn-secondary:hover {
    background: #252b3a;
}

/* Summary Card */
.summary-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.summary-row:last-child {
    border-bottom: none;
    padding-top: 16px;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--accent);
}

/* Admin Panel (admin.html) */
.admin-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 30px;
}

.stat-box {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
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

/* Appointment Table / Cards */
.appt-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.appt-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    transition: 0.2s;
}

.appt-card:hover {
    border-color: rgba(212, 175, 55, 0.4);
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
.status-chair { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
.status-done { background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); }
.status-cancelled { background: rgba(239, 68, 68, 0.15); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); }

.appt-actions {
    display: flex;
    gap: 8px;
}

.act-btn {
    padding: 8px 14px;
    border-radius: 8px;
    border: none;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
}

.act-chair { background: #3b82f6; color: #fff; }
.act-done { background: var(--success); color: #fff; }
.act-cancel { background: rgba(239, 68, 68, 0.2); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.4); }

.act-btn:hover { opacity: 0.85; transform: scale(1.03); }

/* Live Pulse */
.live-dot {
    width: 8px;
    height: 8px;
    background: var(--success);
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0 0 10px var(--success);
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
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

// 3. index.html (Müşteri Ekranı)
const indexHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Suzi's Barber & Lounge - Online Randevu</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <div class="brand">
            <i class="fa-solid fa-scissors"></i>
            <div>
                <h1>SUZI'S BARBER</h1>
                <div style="font-size: 0.75rem; color: var(--accent); letter-spacing: 2px;">LUXURY GROOMING</div>
            </div>
        </div>
        <div class="badge-tag"><i class="fa-solid fa-clock"></i> 10:00 - 20:00</div>
    </header>

    <div class="container">
        <!-- Step Indicator -->
        <div class="step-bar">
            <div class="step-item active" id="stepIndicator1">
                <div class="step-num">1</div>
                <div class="step-text">Hizmet</div>
            </div>
            <div class="step-item" id="stepIndicator2">
                <div class="step-num">2</div>
                <div class="step-text">Uzman</div>
            </div>
            <div class="step-item" id="stepIndicator3">
                <div class="step-num">3</div>
                <div class="step-text">Tarih & Saat</div>
            </div>
            <div class="step-item" id="stepIndicator4">
                <div class="step-num">4</div>
                <div class="step-text">Bilgiler</div>
            </div>
        </div>

        <!-- Adım 1: Hizmet Seçimi -->
        <div class="booking-section active" id="step1">
            <h2 class="page-title">Hangi Hizmeti Almak İstiyorsunuz?</h2>
            <p class="page-subtitle">Usta ellerde kendinize bir mola verin.</p>
            <div class="grid-cards" id="servicesGrid"></div>
            <div class="btn-nav-row">
                <div></div>
                <button class="btn btn-primary" id="toStep2Btn" disabled>İleri: Uzman Seç <i class="fa-solid fa-arrow-right"></i></button>
            </div>
        </div>

        <!-- Adım 2: Uzman Berber Seçimi -->
        <div class="booking-section" id="step2">
            <h2 class="page-title">Uzmanınızı Seçin</h2>
            <p class="page-subtitle">Tarzınızı en iyi yansıtan berberimizle eşleşin.</p>
            <div class="grid-cards" id="staffGrid"></div>
            <div class="btn-nav-row">
                <button class="btn btn-secondary" onclick="goToStep(1)"><i class="fa-solid fa-arrow-left"></i> Geri</button>
                <button class="btn btn-primary" id="toStep3Btn" disabled>İleri: Tarih & Saat <i class="fa-solid fa-arrow-right"></i></button>
            </div>
        </div>

        <!-- Adım 3: Tarih & Saat Seçimi -->
        <div class="booking-section" id="step3">
            <h2 class="page-title">Randevu Saatinizi Belirleyin</h2>
            <p class="page-subtitle">Seçilen tarihteki müsait koltuk saatleri:</p>

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
            <h2 class="page-title">Randevu Özeti & Onay</h2>
            <p class="page-subtitle">Bilgilerinizi doldurun ve koltuğunuzu ayırtın.</p>

            <div class="summary-card" id="summaryCard"></div>

            <div style="background: var(--card-bg); padding: 24px; border-radius: 16px; border: 1px solid var(--border);">
                <div class="form-group">
                    <label><i class="fa-solid fa-user"></i> Adınız & Soyadınız</label>
                    <input type="text" id="clientName" class="form-input" placeholder="Örn: Suzi Yılmaz">
                </div>
                <div class="form-group">
                    <label><i class="fa-solid fa-phone"></i> Telefon Numaranız</label>
                    <input type="tel" id="clientPhone" class="form-input" placeholder="05XX XXX XX XX">
                </div>
                <div class="form-group">
                    <label><i class="fa-solid fa-note-sticky"></i> Özel Not (Opsiyonel)</label>
                    <input type="text" id="clientNote" class="form-input" placeholder="İçecek ikramı, özel saç modeli talebi vb.">
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
                <div style="width: 80px; height: 80px; background: rgba(16, 185, 129, 0.15); color: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 20px;">
                    <i class="fa-solid fa-check"></i>
                </div>
                <h2 style="font-size: 1.8rem; margin-bottom: 8px;">Randevunuz Alındı!</h2>
                <p style="color: var(--text-muted); max-width: 450px; margin: 0 auto 24px;">Randevunuz ustamızın paneline anında düşmüştür. Sizi ağırlamaktan mutluluk duyacağız.</p>
                <div style="background: var(--card-bg); max-width: 400px; margin: 0 auto; padding: 20px; border-radius: 12px; border: 1px solid var(--border); text-align: left;" id="ticketInfo"></div>
                <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 24px;"><i class="fa-solid fa-rotate-right"></i> Yeni Randevu Al</button>
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
    let currentStep = 1;
    let selectedService = null;
    let selectedStaff = null;
    let selectedDate = new Date().toISOString().split('T')[0];
    let selectedTime = null;

    const dateInput = document.getElementById('apptDate');
    dateInput.value = selectedDate;
    dateInput.min = selectedDate;

    // 1. Render Hizmetler
    const servicesGrid = document.getElementById('servicesGrid');
    servicesList.forEach(s => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.innerHTML = \`
            <div class="card-icon"><i class="fa-solid \${s.icon}"></i></div>
            <div class="card-info">
                <h3>\${s.name}</h3>
                <p><i class="fa-regular fa-clock"></i> \${s.duration}</p>
                <div class="card-price">\${s.price} ₺</div>
            </div>
        \`;
        card.onclick = () => {
            document.querySelectorAll('#servicesGrid .selection-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedService = s;
            document.getElementById('toStep2Btn').disabled = false;
        };
        servicesGrid.appendChild(card);
    });

    // 2. Render Uzmanlar
    const staffGrid = document.getElementById('staffGrid');
    staffList.forEach(staff => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.innerHTML = \`
            <img src="\${staff.img}" class="card-img" alt="\${staff.name}">
            <div class="card-info">
                <h3>\${staff.name}</h3>
                <p>\${staff.role}</p>
            </div>
        \`;
        card.onclick = () => {
            document.querySelectorAll('#staffGrid .selection-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedStaff = staff;
            document.getElementById('toStep3Btn').disabled = false;
        };
        staffGrid.appendChild(card);
    });

    // 3. Render Saat Slotları
    function renderSlots() {
        const slotsContainer = document.getElementById('slotsContainer');
        slotsContainer.innerHTML = '';
        selectedTime = null;
        document.getElementById('toStep4Btn').disabled = true;

        const currentAppts = getAppointments();
        // Bu berber + bu tarihte alınmış randevuları filtrele
        const bookedTimes = currentAppts
            .filter(a => a.staffId === selectedStaff.id && a.date === selectedDate && a.status !== 'İptal Edildi')
            .map(a => a.time);

        timeSlots.forEach(time => {
            const btn = document.createElement('button');
            btn.className = 'slot-btn';
            btn.innerText = time;

            if (bookedTimes.includes(time)) {
                btn.disabled = true;
                btn.title = 'Bu saat dolu';
            } else {
                btn.onclick = () => {
                    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    selectedTime = time;
                    document.getElementById('toStep4Btn').disabled = false;
                };
            }
            slotsContainer.appendChild(btn);
        });
    }

    dateInput.addEventListener('change', (e) => {
        selectedDate = e.target.value;
        renderSlots();
    });

    // 4. Render Özet
    function renderSummary() {
        const summaryCard = document.getElementById('summaryCard');
        summaryCard.innerHTML = \`
            <div class="summary-row"><span>Hizmet:</span><strong>\${selectedService.name} (\${selectedService.duration})</strong></div>
            <div class="summary-row"><span>Uzman Berber:</span><strong>\${selectedStaff.name}</strong></div>
            <div class="summary-row"><span>Randevu Tarihi:</span><strong>\${selectedDate}</strong></div>
            <div class="summary-row"><span>Randevu Saati:</span><strong>\${selectedTime}</strong></div>
            <div class="summary-row"><span>Toplam Ücret:</span><span>\${selectedService.price} ₺</span></div>
        \`;
    }

    // Step Navigasyon
    window.goToStep = (step) => {
        document.querySelectorAll('.booking-section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.step-item').forEach((item, index) => {
            item.classList.remove('active');
            if (index + 1 < step) item.classList.add('done');
            else item.classList.remove('done');
        });

        document.getElementById('step' + step).classList.add('active');
        document.getElementById('stepIndicator' + step).classList.add('active');
        currentStep = step;

        if (step === 3) renderSlots();
        if (step === 4) renderSummary();
    };

    document.getElementById('toStep2Btn').onclick = () => goToStep(2);
    document.getElementById('toStep3Btn').onclick = () => goToStep(3);
    document.getElementById('toStep4Btn').onclick = () => goToStep(4);

    // Randevuyu Onayla & Kaydet
    document.getElementById('confirmBookingBtn').onclick = () => {
        const name = document.getElementById('clientName').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const note = document.getElementById('clientNote').value.trim();

        if (!name || !phone) {
            alert('Lütfen adınızı ve telefon numaranızı girin!');
            return;
        }

        const newAppt = {
            id: 'RND-' + Math.floor(1000 + Math.random() * 9000),
            clientName: name,
            clientPhone: phone,
            note: note,
            service: selectedService.name,
            price: selectedService.price,
            duration: selectedService.duration,
            staffId: selectedStaff.id,
            staffName: selectedStaff.name,
            date: selectedDate,
            time: selectedTime,
            status: 'Bekliyor', // Bekliyor, Koltukta, Tamamlandı, İptal Edildi
            createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };

        const appts = getAppointments();
        appts.push(newAppt);
        saveAppointments(appts);

        // Başarı Ekranı
        document.querySelectorAll('.booking-section').forEach(s => s.classList.remove('active'));
        document.getElementById('successSection').classList.add('active');
        document.getElementById('ticketInfo').innerHTML = \`
            <div><strong>Randevu No:</strong> \${newAppt.id}</div>
            <div style="margin-top:4px;"><strong>Müşteri:</strong> \${newAppt.clientName}</div>
            <div style="margin-top:4px;"><strong>Hizmet:</strong> \${newAppt.service}</div>
            <div style="margin-top:4px;"><strong>Uzman:</strong> \${newAppt.staffName}</div>
            <div style="margin-top:4px;"><strong>Tarih / Saat:</strong> \${newAppt.date} @ \${newAppt.time}</div>
        \`;
    };
});
`;

// 5. admin.html (Kuaför / Yönetici Ekranı)
const adminHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yönetici & Kuaför Randevu Takip Paneli</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <div class="brand">
            <i class="fa-solid fa-scissors"></i>
            <div>
                <h1>SUZI'S BARBER</h1>
                <div style="font-size: 0.75rem; color: var(--accent); letter-spacing: 2px;">KUAFÖR & YÖNETİM PANELİ</div>
            </div>
        </div>
        <div class="badge-tag" style="background: rgba(16, 185, 129, 0.15); color: var(--success);"><span class="live-dot"></span> Canlı Takip</div>
    </header>

    <div class="container">
        <!-- Canlı İstatistikler -->
        <div class="admin-stats">
            <div class="stat-box">
                <div class="stat-icon" style="background: rgba(212, 175, 55, 0.15); color: var(--accent);"><i class="fa-solid fa-calendar-check"></i></div>
                <div>
                    <div class="stat-val" id="totalApptCount">0</div>
                    <div class="stat-lbl">Toplam Randevu</div>
                </div>
            </div>
            <div class="stat-box">
                <div class="stat-icon" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa;"><i class="fa-solid fa-chair"></i></div>
                <div>
                    <div class="stat-val" id="inChairCount">0</div>
                    <div class="stat-lbl">Şu An Koltukta</div>
                </div>
            </div>
            <div class="stat-box">
                <div class="stat-icon" style="background: rgba(16, 185, 129, 0.15); color: var(--success);"><i class="fa-solid fa-turkish-lira-sign"></i></div>
                <div>
                    <div class="stat-val" id="totalRevenue">0 ₺</div>
                    <div class="stat-lbl">Tahmini Ciro</div>
                </div>
            </div>
        </div>

        <!-- Filtreler -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
            <h2 class="page-title" style="margin-bottom: 0;">Gelen Randevular</h2>
            <div style="display: flex; gap: 10px;">
                <select id="filterStaff" class="form-input" style="padding: 8px 14px; width: auto;">
                    <option value="all">Tüm Berberler</option>
                    <option value="1">Burak Usta</option>
                    <option value="2">Emre Keskin</option>
                    <option value="3">Can Demir</option>
                </select>
                <button class="btn btn-secondary" onclick="clearAllData()" style="padding: 8px 16px; font-size: 0.85rem;"><i class="fa-solid fa-trash"></i> Verileri Temizle</button>
            </div>
        </div>

        <!-- Randevu Listesi -->
        <div class="appt-list" id="adminApptList">
            <!-- JS ile dolacak -->
        </div>
    </div>

    <script src="data.js"></script>
    <script src="admin.js"></script>
</body>
</html>`;

// 6. admin.js
const adminJs = `
function renderAdmin() {
    const listContainer = document.getElementById('adminApptList');
    listContainer.innerHTML = '';
    const filterStaffId = document.getElementById('filterStaff').value;

    let appts = getAppointments();

    if (filterStaffId !== 'all') {
        appts = appts.filter(a => a.staffId == filterStaffId);
    }

    // İstatistikler
    const all = getAppointments();
    document.getElementById('totalApptCount').innerText = all.length;
    document.getElementById('inChairCount').innerText = all.filter(a => a.status === 'Koltukta').length;
    const rev = all.filter(a => a.status !== 'İptal Edildi').reduce((sum, a) => sum + (a.price || 0), 0);
    document.getElementById('totalRevenue').innerText = rev + ' ₺';

    if (appts.length === 0) {
        listContainer.innerHTML = '<div style="background:var(--card-bg); padding:30px; text-align:center; border-radius:16px; color:var(--text-muted);">Henüz randevu bulunmuyor. Müşteri ekranından randevu oluşturulduğunda buraya anında düşecektir!</div>';
        return;
    }

    // Sıralama: En yeni en üstte
    appts.slice().reverse().forEach(a => {
        let badgeClass = 'status-pending';
        if (a.status === 'Koltukta') badgeClass = 'status-chair';
        if (a.status === 'Tamamlandı') badgeClass = 'status-done';
        if (a.status === 'İptal Edildi') badgeClass = 'status-cancelled';

        const card = document.createElement('div');
        card.className = 'appt-card';
        card.innerHTML = \`
            <div class="appt-client">
                <div style="display:flex; align-items:center; gap:10px;">
                    <h3>\${a.clientName}</h3>
                    <span class="status-badge \${badgeClass}">\${a.status}</span>
                </div>
                <div class="appt-meta" style="margin-top:6px;">
                    <span><i class="fa-solid fa-phone"></i> \${a.clientPhone}</span>
                    <span><i class="fa-solid fa-scissors"></i> \${a.service} (\${a.duration})</span>
                    <span><i class="fa-solid fa-user-tie"></i> \${a.staffName}</span>
                    <span><i class="fa-regular fa-clock"></i> \${a.date} @ <strong>\${a.time}</strong></span>
                    <span style="color:var(--accent); font-weight:700;"><i class="fa-solid fa-tag"></i> \${a.price} ₺</span>
                </div>
                \${a.note ? \`<div style="font-size:0.8rem; color:#f59e0b; margin-top:6px;"><i class="fa-solid fa-circle-info"></i> Not: \${a.note}</div>\` : ''}
            </div>
            <div class="appt-actions">
                \${a.status === 'Bekliyor' ? \`<button class="act-btn act-chair" onclick="updateStatus('\${a.id}', 'Koltukta')"><i class="fa-solid fa-chair"></i> Koltuğa Al</button>\` : ''}
                \${a.status === 'Koltukta' ? \`<button class="act-btn act-done" onclick="updateStatus('\${a.id}', 'Tamamlandı')"><i class="fa-solid fa-check"></i> Tamamla</button>\` : ''}
                \${a.status !== 'İptal Edildi' && a.status !== 'Tamamlandı' ? \`<button class="act-btn act-cancel" onclick="updateStatus('\${a.id}', 'İptal Edildi')"><i class="fa-solid fa-xmark"></i> İptal</button>\` : ''}
            </div>
        \`;
        listContainer.appendChild(card);
    });
}

window.updateStatus = (id, newStatus) => {
    const appts = getAppointments();
    const item = appts.find(a => a.id === id);
    if (item) {
        item.status = newStatus;
        saveAppointments(appts);
        renderAdmin();
    }
};

window.clearAllData = () => {
    if (confirm('Tüm randevu verileri sıfırlanacak. Emin misiniz?')) {
        localStorage.removeItem('barber_appointments');
        renderAdmin();
    }
};

document.getElementById('filterStaff').addEventListener('change', renderAdmin);

// Başlangıçta yükle
renderAdmin();

// GERÇEK ZAMANLI: Müşteri sekmesinden yeni randevu geldiğinde anında güncelle
window.addEventListener('storage', () => {
    renderAdmin();
});
`;

fs.writeFileSync(path.join(dirPath, 'data.js'), dataJs);
fs.writeFileSync(path.join(dirPath, 'style.css'), styleCss);
fs.writeFileSync(path.join(dirPath, 'index.html'), indexHtml);
fs.writeFileSync(path.join(dirPath, 'customer.js'), customerJs);
fs.writeFileSync(path.join(dirPath, 'admin.html'), adminHtml);
fs.writeFileSync(path.join(dirPath, 'admin.js'), adminJs);

console.log('29-Kuafor-Randevu-Sistemi generated successfully!');
