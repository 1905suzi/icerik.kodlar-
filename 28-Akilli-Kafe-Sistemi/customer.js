
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
                        <small>${item.price} ₺ x ${item.quantity}</small>
                    </div>
                    <button onclick="removeFromCart(${index})" style="background:none;border:none;color:red;cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
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
