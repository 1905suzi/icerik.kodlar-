
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
