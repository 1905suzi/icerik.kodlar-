
function renderKasaOrders() {
    const grid = document.getElementById('kasaGrid');
    grid.innerHTML = '';
    const orders = getOrders();

    if(orders.length === 0) {
        grid.innerHTML = '<p>Hiç aktif sipariş yok.</p>';
        return;
    }

    orders.forEach(order => {
        let itemsHTML = '';
        order.items.forEach(i => {
            itemsHTML += `<li>${i.quantity}x ${i.name} (${i.price * i.quantity} ₺)</li>`;
        });

        const statusClass = order.status === 'Hazır' ? 'status-ready' : 'status-new';

        const card = document.createElement('div');
        card.className = 'order-card';
        card.innerHTML = `
            <div class="order-header">
                <span>Masa ${order.tableNo} <span class="status-badge ${statusClass}">${order.status}</span></span>
                <span>#${order.id}</span>
            </div>
            <ul class="order-items">
                ${itemsHTML}
            </ul>
            <div class="order-header" style="margin-top: 15px; font-size:1.2rem; color:var(--primary);">
                <span>Toplam Tutar:</span>
                <span>${order.total} ₺</span>
            </div>
            <div class="order-actions">
                <button class="action-btn" style="background:#eccc68; color:black;" onclick="deleteOrder(${order.id})">Ödeme Al & Kapat</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.deleteOrder = (id) => {
    if(confirm('Ödeme alındı ve masa kapatılıyor. Emin misiniz?')) {
        let orders = getOrders();
        orders = orders.filter(o => o.id !== id);
        saveOrders(orders);
        renderKasaOrders();
    }
};

// Başlangıçta yükle
renderKasaOrders();

// Başka sekmeden veri değişirse anında tetiklenir (GERÇEK ZAMANLI)
window.addEventListener('storage', () => {
    renderKasaOrders();
});
