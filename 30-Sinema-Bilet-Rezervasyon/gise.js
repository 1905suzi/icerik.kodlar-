
function renderGise() {
    const list = document.getElementById('ticketsList');
    list.innerHTML = '';
    const bookings = getCinemaBookings();

    // Stats
    let totalTicketsCount = 0;
    let enteredCount = 0;
    let totalRev = 0;

    bookings.forEach(b => {
        if (b.status !== 'İptal') {
            totalTicketsCount += b.seats.length;
            totalRev += b.totalPrice;
            if (b.status === 'Giriş Yapıldı') enteredCount += b.seats.length;
        }
    });

    document.getElementById('statTotalTickets').innerText = totalTicketsCount;
    document.getElementById('statEntered').innerText = enteredCount;
    document.getElementById('statRevenue').innerText = totalRev + ' ₺';

    if (bookings.length === 0) {
        list.innerHTML = '<div style="background:var(--card-surface); padding:30px; text-align:center; border-radius:16px; color:var(--text-secondary);">Henüz satılan bilet yok. Müşteri ekranından bilet alındığında buraya anında düşer!</div>';
        return;
    }

    bookings.slice().reverse().forEach(b => {
        const isEntered = b.status === 'Giriş Yapıldı';
        const card = document.createElement('div');
        card.className = 'ticket-row';
        card.innerHTML = `
            <div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <strong style="font-size:1.1rem; color:#fff;">${b.movieTitle}</strong>
                    <span style="font-size:0.8rem; padding:3px 10px; border-radius:12px; background:${isEntered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 197, 24, 0.2)'}; color:${isEntered ? '#10b981' : '#f5c518'}; font-weight:700;">${b.status}</span>
                </div>
                <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;">
                    ${b.hall} • Seans: ${b.session} • Koltuklar: <strong style="color:var(--gold);">${b.seats.join(', ')}</strong> • Saat: ${b.time}
                </div>
                <div style="font-size:0.85rem; color:var(--accent-red); font-weight:700; margin-top:2px;">Barkod: ${b.ticketCode} | Tutar: ${b.totalPrice} ₺</div>
            </div>
            <div>
                ${!isEntered ? `<button class="btn-book" style="padding:8px 16px; font-size:0.85rem; background:#10b981;" onclick="checkInTicket('${b.ticketCode}')"><i class="fa-solid fa-check"></i> Kapı Girişi Ver</button>` : '<span style="color:#10b981; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Salonda</span>'}
            </div>
        `;
        list.appendChild(card);
    });
}

window.checkInTicket = (code) => {
    const list = getCinemaBookings();
    const item = list.find(b => b.ticketCode === code);
    if (item) {
        item.status = 'Giriş Yapıldı';
        saveCinemaBookings(list);
        renderGise();
    }
};

window.verifyTicketByInput = () => {
    const code = document.getElementById('barcodeSearch').value.trim();
    if (!code) return alert('Lütfen barkod girin!');

    const list = getCinemaBookings();
    const item = list.find(b => b.ticketCode === code);
    if (!item) {
        alert('❌ Geçersiz bilet barkodu bulunamadı!');
    } else if (item.status === 'Giriş Yapıldı') {
        alert('⚠️ Bu bilet ile zaten salona giriş yapılmış!');
    } else {
        item.status = 'Giriş Yapıldı';
        saveCinemaBookings(list);
        renderGise();
        alert(`✅ Bilet Onaylandı! Hoş geldiniz: ${item.movieTitle} - Koltuklar: ${item.seats.join(', ')}`);
        document.getElementById('barcodeSearch').value = '';
    }
};

window.resetAllCinemaData = () => {
    if (confirm('Tüm sinema bilet kayıtları sıfırlanacak. Emin misiniz?')) {
        localStorage.removeItem('cinema_bookings');
        renderGise();
    }
};

renderGise();

// Cross-tab real time
window.addEventListener('storage', () => {
    renderGise();
});
