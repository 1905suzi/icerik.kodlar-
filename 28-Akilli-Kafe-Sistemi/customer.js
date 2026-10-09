
document.addEventListener('DOMContentLoaded', () => {
    const tableNo = Math.floor(Math.random() * 20) + 1;
    document.getElementById('tableNo').innerText = tableNo;

    let cart = [];
    let currentOrderId = null;
    let cancelTimer = null;
    
    const menuGrid = document.getElementById('menuGrid');
    const categoryContainer = document.getElementById('categoryContainer');
    const cartCount = document.getElementById('cartCount');
    const cartFab = document.getElementById('cartFab');
    const cartModal = document.getElementById('cartModal');
    const closeModal = document.getElementById('closeModal');
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const activeOrderContainer = document.getElementById('activeOrderContainer');

    const categories = [...new Set(menuData.map(item => item.category))];

    function renderCategories() {
        categories.forEach((cat, index) => {
            const btn = document.createElement('button');
            btn.className = 'cat-btn' + (index === 0 ? ' active' : '');
            btn.innerText = cat;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderMenu(cat);
            });
            categoryContainer.appendChild(btn);
        });
    }

    function renderMenu(filterCat) {
        menuGrid.innerHTML = '';
        const filtered = menuData.filter(item => item.category === filterCat);

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="product-img">
                <div class="product-info">
                    <div>
                        <span style="font-size:0.8rem; color:var(--primary); font-weight:bold;">${item.category}</span>
                        <h3 class="product-title">${item.name}</h3>
                    </div>
                    <div class="product-bottom">
                        <span class="price">${item.price} ₺</span>
                        <button class="add-btn" onclick="addToCart(${item.id})"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            `;
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
        
        // Sepete eklenince modalı aç (isteğe bağlı, "sepete git" hissi için)
        cartModal.classList.add('active');
    };

    window.changeQty = (index, delta) => {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
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
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>${item.price} ₺</small>
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </div>
            `;
        });
        
        cartTotal.innerText = total;
    }

    // Modal İşlemleri
    cartFab.addEventListener('click', () => cartModal.classList.add('active'));
    closeModal.addEventListener('click', () => cartModal.classList.remove('active'));
    backToMenuBtn.addEventListener('click', () => cartModal.classList.remove('active'));

    // Sipariş Verme
    checkoutBtn.addEventListener('click', () => {
        if(cart.length === 0) return alert('Sepetiniz boş!');
        if(currentOrderId) return alert('Zaten aktif bir siparişiniz var. Lütfen bekleyin veya iptal edin.');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        currentOrderId = generateOrderId();
        
        const newOrder = {
            id: currentOrderId,
            tableNo: tableNo,
            items: cart,
            total: total,
            status: 'Yeni Sipariş',
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };

        const currentOrders = getOrders();
        currentOrders.push(newOrder);
        saveOrders(currentOrders);

        cart = [];
        updateCartUI();
        cartModal.classList.remove('active');

        startCancelTimer(300); // 5 dakika = 300 saniye
    });

    function startCancelTimer(seconds) {
        let timeLeft = seconds;
        
        const renderTimer = () => {
            const m = Math.floor(timeLeft / 60);
            const s = timeLeft % 60;
            activeOrderContainer.innerHTML = `
                <div class="active-order-box">
                    <h3>Siparişiniz Alındı! Mutfakta Hazırlanıyor 👩‍🍳</h3>
                    <p>Siparişinizi ${m}:${s < 10 ? '0'+s : s} dakika içerisinde iptal edebilirsiniz.</p>
                    <button class="cancel-btn" onclick="cancelCurrentOrder()">Siparişi İptal Et</button>
                </div>
            `;
        };

        renderTimer();
        cancelTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(cancelTimer);
                activeOrderContainer.innerHTML = `
                    <div class="active-order-box" style="background:#d4edda; color:#155724; border-color:#c3e6cb;">
                        <h3>Siparişiniz Onaylandı ✅</h3>
                        <p>Artık iptal edilemez. Afiyet olsun!</p>
                    </div>
                `;
            } else {
                renderTimer();
            }
        }, 1000);
    }

    window.cancelCurrentOrder = () => {
        if (confirm("Siparişinizi iptal etmek istediğinize emin misiniz?")) {
            let orders = getOrders();
            // Siparişi local storage'dan tamamen sil
            orders = orders.filter(o => o.id !== currentOrderId);
            saveOrders(orders);
            
            clearInterval(cancelTimer);
            activeOrderContainer.innerHTML = '';
            currentOrderId = null;
            alert("Siparişiniz başarıyla iptal edildi.");
        }
    };

    renderCategories();
    renderMenu(categories[0]);

    // Splash ekranı kapatma
    document.getElementById('enterMenuBtn').addEventListener('click', () => {
        const splash = document.getElementById('splashScreen');
        splash.style.opacity = '0';
        setTimeout(() => splash.style.visibility = 'hidden', 500);
    });
});
