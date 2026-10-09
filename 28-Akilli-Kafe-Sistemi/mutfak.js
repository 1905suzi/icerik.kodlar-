
function renderMutfakOrders() {
    const grid = document.getElementById('mutfakGrid');
    grid.innerHTML = '';
    const orders = getOrders().filter(o => o.status !== 'Hazır'); // Hazır olanları mutfaktan gizle

    if(orders.length === 0) {
        grid.innerHTML = '<p>Bekleyen sipariş yok.</p>';
        return;
    }

    orders.forEach(order => {
        let itemsHTML = '';
        order.items.forEach(i => {
            itemsHTML += `<li>${i.quantity}x ${i.name}</li>`;
        });

        const card = document.createElement('div');
        card.className = 'order-card';
        card.innerHTML = `
            <div class="order-header">
                <span>Masa ${order.tableNo} <span class="status-badge status-new">${order.time}</span></span>
                <span>#${order.id}</span>
            </div>
            <ul class="order-items">
                ${itemsHTML}
            </ul>
            <div class="order-actions">
                <button class="action-btn" style="background:#2ed573;" onclick="markAsReady(${order.id})">Hazırlandı Seç</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.markAsReady = (id) => {
    const orders = getOrders();
    const order = orders.find(o => o.id === id);
    if(order) {
        order.status = 'Hazır';
        saveOrders(orders);
        renderMutfakOrders();
    }
};

// Başlangıçta yükle
renderMutfakOrders();

// Başka sekmeden veri değişirse anında tetiklenir (GERÇEK ZAMANLI)
window.addEventListener('storage', () => {
    renderMutfakOrders();
});
