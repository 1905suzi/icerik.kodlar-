
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
        card.innerHTML = `
            <div class="appt-client">
                <div style="display:flex; align-items:center; gap:10px;">
                    <h3>${a.clientName}</h3>
                    <span class="status-badge ${badgeClass}">${a.status}</span>
                </div>
                <div class="appt-meta" style="margin-top:6px;">
                    <span><i class="fa-solid fa-phone"></i> ${a.clientPhone}</span>
                    <span><i class="fa-solid fa-scissors"></i> ${a.service} (${a.duration})</span>
                    <span><i class="fa-solid fa-user-tie"></i> ${a.staffName}</span>
                    <span><i class="fa-regular fa-clock"></i> ${a.date} @ <strong>${a.time}</strong></span>
                    <span style="color:var(--accent); font-weight:700;"><i class="fa-solid fa-tag"></i> ${a.price} ₺</span>
                </div>
                ${a.note ? `<div style="font-size:0.8rem; color:#f59e0b; margin-top:6px;"><i class="fa-solid fa-circle-info"></i> Not: ${a.note}</div>` : ''}
            </div>
            <div class="appt-actions">
                ${a.status === 'Bekliyor' ? `<button class="act-btn act-chair" onclick="updateStatus('${a.id}', 'Koltukta')"><i class="fa-solid fa-chair"></i> Koltuğa Al</button>` : ''}
                ${a.status === 'Koltukta' ? `<button class="act-btn act-done" onclick="updateStatus('${a.id}', 'Tamamlandı')"><i class="fa-solid fa-check"></i> Tamamla</button>` : ''}
                ${a.status !== 'İptal Edildi' && a.status !== 'Tamamlandı' ? `<button class="act-btn act-cancel" onclick="updateStatus('${a.id}', 'İptal Edildi')"><i class="fa-solid fa-xmark"></i> İptal</button>` : ''}
            </div>
        `;
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
