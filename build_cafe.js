const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '28-Akilli-Kafe-Sistemi');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// 1. Ortak Veri ve Stil Dosyaları
const dataJs = `
const menuData = [
    { id: 1, category: 'Sıcak İçecekler', name: 'Çay', price: 25, img: 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd4?w=500&auto=format&fit=crop' },
    { id: 2, category: 'Kahveler', name: 'Latte', price: 95, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop' },
    { id: 3, category: 'Kahveler', name: 'Americano', price: 80, img: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500&auto=format&fit=crop' },
    { id: 4, category: 'Soğuk İçecekler', name: 'Iced Caramel Macchiato', price: 115, img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop' },
    { id: 5, category: 'Soğuk İçecekler', name: 'Limonata', price: 75, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop' },
    { id: 6, category: 'Mixler', name: 'Orman Meyveli Smoothie', price: 125, img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop' },
    { id: 7, category: 'Tatlılar', name: 'San Sebastian Cheesecake', price: 140, img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop' },
    { id: 8, category: 'Tatlılar', name: 'Tiramisu', price: 120, img: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&auto=format&fit=crop' },
    { id: 9, category: 'Atıştırmalıklar', name: 'Kruvasan', price: 65, img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop' },
    { id: 10, category: 'Atıştırmalıklar', name: 'Izgara Peynirli Tost', price: 90, img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop' }
];

// Benzersiz sipariş ID'si üretmek için
function generateOrderId() {
    return Math.floor(1000 + Math.random() * 9000); // 4 haneli kod
}

// LocalStorage'dan siparişleri al
function getOrders() {
    const orders = localStorage.getItem('cafeOrders');
    return orders ? JSON.parse(orders) : [];
}

// LocalStorage'a sipariş kaydet
function saveOrders(orders) {
    localStorage.setItem('cafeOrders', JSON.stringify(orders));
}
`;

const styleCss = `
:root {
    --bg-color: #Fdfbf7;
    --primary: #D4A373; /* Bal köpüğü */
    --secondary: #FAEDCD; /* Açık Bal */
    --text-dark: #4a3b2c;
    --white: #ffffff;
    --shadow: 0 10px 20px rgba(212, 163, 115, 0.15);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background-color: var(--bg-color);
    color: var(--text-dark);
}

/* Header & Logo */
header {
    background: var(--white);
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    position: sticky;
    top: 0;
    z-index: 100;
}

.logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.logo i {
    font-size: 2.5rem;
    color: var(--primary);
}

.logo h1 {
    font-size: 1.5rem;
    letter-spacing: 2px;
}

/* Navigasyon Paneli (Sekmeler) */
.admin-nav {
    display: flex;
    justify-content: center;
    gap: 20px;
    background: var(--primary);
    padding: 10px;
}
.admin-nav a {
    color: var(--white);
    text-decoration: none;
    font-weight: bold;
    padding: 5px 15px;
    border-radius: 20px;
    background: rgba(255,255,255,0.2);
}
.admin-nav a:hover {
    background: var(--white);
    color: var(--primary);
}

/* Kategori Butonları */
.categories {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding: 20px;
    justify-content: center;
    scrollbar-width: none;
}
.categories::-webkit-scrollbar { display: none; }

.cat-btn {
    background: var(--white);
    border: 2px solid var(--secondary);
    color: var(--text-dark);
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.3s;
}

.cat-btn.active, .cat-btn:hover {
    background: var(--primary);
    color: var(--white);
    border-color: var(--primary);
}

/* Ürün Grid'i */
.menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
    padding: 20px 5vw;
}

.product-card {
    background: var(--white);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: transform 0.3s;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    transform: translateY(-5px);
}

.product-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.product-info {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.product-title {
    font-size: 1.2rem;
    margin-bottom: 10px;
}

.product-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
}

.price {
    font-weight: bold;
    font-size: 1.3rem;
    color: var(--primary);
}

.add-btn {
    background: var(--primary);
    color: var(--white);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(212, 163, 115, 0.4);
    transition: transform 0.2s;
}

.add-btn:active { transform: scale(0.9); }

/* Sepet Yüzen Butonu */
.cart-fab {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: var(--text-dark);
    color: var(--white);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    z-index: 101;
}

.cart-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff4757;
    color: white;
    font-size: 0.8rem;
    font-weight: bold;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Modallar */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-overlay.active { display: flex; }

.modal {
    background: var(--white);
    width: 90%;
    max-width: 400px;
    border-radius: 20px;
    padding: 30px;
    position: relative;
    max-height: 80vh;
    overflow-y: auto;
}

.close-modal {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-dark);
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid var(--secondary);
}

.cart-total {
    font-size: 1.3rem;
    font-weight: bold;
    text-align: right;
    margin: 20px 0;
    color: var(--primary);
}

.checkout-btn {
    width: 100%;
    background: var(--primary);
    color: var(--white);
    border: none;
    padding: 15px;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
}

/* Sipariş Ekranları (Kasa & Mutfak) */
.dashboard {
    padding: 30px;
    max-width: 1200px;
    margin: 0 auto;
}

.order-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.order-card {
    background: var(--white);
    border: 2px solid var(--secondary);
    border-radius: 15px;
    padding: 20px;
}

.order-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px dashed var(--secondary);
    padding-bottom: 10px;
    margin-bottom: 15px;
    font-weight: bold;
}

.order-items li {
    margin-bottom: 8px;
    list-style: none;
}

.order-actions {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.action-btn {
    padding: 8px 15px;
    border: none;
    border-radius: 8px;
    background: var(--primary);
    color: white;
    cursor: pointer;
    font-weight: bold;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    color: white;
}
.status-new { background: #ff4757; }
.status-ready { background: #2ed573; }
`;

// 2. Müşteri (index.html ve customer.js)
const customerHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Müşteri Sipariş Ekranı - Akıllı Kafe</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="admin-nav">
        <a href="index.html">☕ Müşteri (Menü)</a>
        <a href="mutfak.html">🍳 Mutfak Ekranı</a>
        <a href="kasa.html">💳 Kasa Ekranı</a>
    </div>

    <header>
        <div class="logo">
            <i class="fa-solid fa-mug-hot"></i>
            <h1>KAFE BAL KÖPÜĞÜ</h1>
            <p style="font-size: 0.9rem; color: var(--primary);">Masa No: <span id="tableNo"></span></p>
        </div>
    </header>

    <div class="categories" id="categoryContainer">
        <!-- Kategoriler JS ile gelecek -->
    </div>

    <div class="menu-grid" id="menuGrid">
        <!-- Ürünler JS ile gelecek -->
    </div>

    <div class="cart-fab" id="cartFab">
        <i class="fa-solid fa-basket-shopping"></i>
        <div class="cart-count" id="cartCount">0</div>
    </div>

    <!-- Sepet Modalı -->
    <div class="modal-overlay" id="cartModal">
        <div class="modal">
            <i class="fa-solid fa-xmark close-modal" id="closeModal"></i>
            <h2>Sepetiniz</h2>
            <div id="cartItemsContainer"></div>
            <div class="cart-total">Toplam: <span id="cartTotal">0</span> ₺</div>
            <button class="checkout-btn" id="checkoutBtn">Siparişi Onayla</button>
        </div>
    </div>

    <script src="data.js"></script>
    <script src="customer.js"></script>
</body>
</html>`;

const customerJs = `
document.addEventListener('DOMContentLoaded', () => {
    // Rastgele Masa Numarası Ata (1-20 arası)
    const tableNo = Math.floor(Math.random() * 20) + 1;
    document.getElementById('tableNo').innerText = tableNo;

    let cart = [];
    
    const menuGrid = document.getElementById('menuGrid');
    const categoryContainer = document.getElementById('categoryContainer');
    const cartCount = document.getElementById('cartCount');
    const cartFab = document.getElementById('cartFab');
    const cartModal = document.getElementById('cartModal');
    const closeModal = document.getElementById('closeModal');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Kategorileri Çıkar
    const categories = ['Tümü', ...new Set(menuData.map(item => item.category))];

    function renderCategories() {
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'cat-btn' + (cat === 'Tümü' ? ' active' : '');
            btn.innerText = cat;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderMenu(cat);
            });
            categoryContainer.appendChild(btn);
        });
    }

    function renderMenu(filterCat = 'Tümü') {
        menuGrid.innerHTML = '';
        const filtered = filterCat === 'Tümü' ? menuData : menuData.filter(item => item.category === filterCat);

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = \`
                <img src="\${item.img}" alt="\${item.name}" class="product-img">
                <div class="product-info">
                    <div>
                        <span style="font-size:0.8rem; color:var(--primary); font-weight:bold;">\${item.category}</span>
                        <h3 class="product-title">\${item.name}</h3>
                    </div>
                    <div class="product-bottom">
                        <span class="price">\${item.price} ₺</span>
                        <button class="add-btn" onclick="addToCart(\${item.id})"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            \`;
            menuGrid.appendChild(card);
        });
    }

    window.addToCart = (id) => {
        const product = menuData.find(p => p.id === id);
        const existing = cart.find(i => i.id === id);
        
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();
    };

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems;

        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            cartItemsContainer.innerHTML += \`
                <div class="cart-item">
                    <div>
                        <strong>\${item.name}</strong><br>
                        <small>\${item.price} ₺ x \${item.quantity}</small>
                    </div>
                    <button onclick="removeFromCart(\${index})" style="background:none;border:none;color:red;cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                </div>
            \`;
        });
        
        cartTotal.innerText = total;
    }

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    // Modal İşlemleri
    cartFab.addEventListener('click', () => cartModal.classList.add('active'));
    closeModal.addEventListener('click', () => cartModal.classList.remove('active'));

    // Siparişi Kasa ve Mutfağa Gönder
    checkoutBtn.addEventListener('click', () => {
        if(cart.length === 0) return alert('Sepetiniz boş!');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const newOrder = {
            id: generateOrderId(),
            tableNo: tableNo,
            items: cart,
            total: total,
            status: 'Yeni Sipariş',
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };

        const currentOrders = getOrders();
        currentOrders.push(newOrder);
        saveOrders(currentOrders);

        alert('Siparişiniz başarıyla alındı! Teşekkür ederiz.');
        cart = [];
        updateCartUI();
        cartModal.classList.remove('active');
    });

    renderCategories();
    renderMenu();
});
`;

// 3. Mutfak Ekranı
const mutfakHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mutfak Ekranı - Akıllı Kafe</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="admin-nav">
        <a href="index.html">☕ Müşteri (Menü)</a>
        <a href="mutfak.html">🍳 Mutfak Ekranı</a>
        <a href="kasa.html">💳 Kasa Ekranı</a>
    </div>

    <div class="dashboard">
        <h2><i class="fa-solid fa-fire-burner"></i> MUTFAK SİPARİŞ EKRANI</h2>
        <p style="color: var(--primary);">Fiyatlar gizlidir. Sadece ürünler ve masalar görünür.</p>
        <div class="order-grid" id="mutfakGrid">
            <!-- Siparişler JS ile gelecek -->
        </div>
    </div>

    <script src="data.js"></script>
    <script src="mutfak.js"></script>
</body>
</html>`;

const mutfakJs = `
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
            itemsHTML += \`<li>\${i.quantity}x \${i.name}</li>\`;
        });

        const card = document.createElement('div');
        card.className = 'order-card';
        card.innerHTML = \`
            <div class="order-header">
                <span>Masa \${order.tableNo} <span class="status-badge status-new">\${order.time}</span></span>
                <span>#\${order.id}</span>
            </div>
            <ul class="order-items">
                \${itemsHTML}
            </ul>
            <div class="order-actions">
                <button class="action-btn" style="background:#2ed573;" onclick="markAsReady(\${order.id})">Hazırlandı Seç</button>
            </div>
        \`;
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
`;

// 4. Kasa Ekranı
const kasaHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kasa Ekranı - Akıllı Kafe</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="admin-nav">
        <a href="index.html">☕ Müşteri (Menü)</a>
        <a href="mutfak.html">🍳 Mutfak Ekranı</a>
        <a href="kasa.html">💳 Kasa Ekranı</a>
    </div>

    <div class="dashboard">
        <h2><i class="fa-solid fa-cash-register"></i> KASA SİPARİŞ EKRANI</h2>
        <p style="color: var(--primary);">Hesap tutarları ve mutfak durumu anlık görünür.</p>
        <div class="order-grid" id="kasaGrid">
            <!-- Siparişler JS ile gelecek -->
        </div>
    </div>

    <script src="data.js"></script>
    <script src="kasa.js"></script>
</body>
</html>`;

const kasaJs = `
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
            itemsHTML += \`<li>\${i.quantity}x \${i.name} (\${i.price * i.quantity} ₺)</li>\`;
        });

        const statusClass = order.status === 'Hazır' ? 'status-ready' : 'status-new';

        const card = document.createElement('div');
        card.className = 'order-card';
        card.innerHTML = \`
            <div class="order-header">
                <span>Masa \${order.tableNo} <span class="status-badge \${statusClass}">\${order.status}</span></span>
                <span>#\${order.id}</span>
            </div>
            <ul class="order-items">
                \${itemsHTML}
            </ul>
            <div class="order-header" style="margin-top: 15px; font-size:1.2rem; color:var(--primary);">
                <span>Toplam Tutar:</span>
                <span>\${order.total} ₺</span>
            </div>
            <div class="order-actions">
                <button class="action-btn" style="background:#eccc68; color:black;" onclick="deleteOrder(\${order.id})">Ödeme Al & Kapat</button>
            </div>
        \`;
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
`;

fs.writeFileSync(path.join(dirPath, 'data.js'), dataJs);
fs.writeFileSync(path.join(dirPath, 'style.css'), styleCss);
fs.writeFileSync(path.join(dirPath, 'index.html'), customerHtml);
fs.writeFileSync(path.join(dirPath, 'customer.js'), customerJs);
fs.writeFileSync(path.join(dirPath, 'mutfak.html'), mutfakHtml);
fs.writeFileSync(path.join(dirPath, 'mutfak.js'), mutfakJs);
fs.writeFileSync(path.join(dirPath, 'kasa.html'), kasaHtml);
fs.writeFileSync(path.join(dirPath, 'kasa.js'), kasaJs);

console.log('28-Akilli-Kafe-Sistemi created successfully!');
