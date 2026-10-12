
const initialDeliveries = [
    {
        id: 'KRG-9482',
        customer: 'Suzi Yılmaz',
        address: 'Kadıköy Moda Cad. No:42/B, İstanbul',
        items: '2x Soğuk Kahve, 1x San Sebastian Cheesecake',
        courier: 'Ahmet Şimşek (Motorlu Kurye)',
        phone: '0532 999 88 77',
        status: 'Hazırlanıyor', // 'Hazırlanıyor', 'Yola Çıktı', 'Yaklaştı (2 dk)', 'Teslim Edildi'
        stepIndex: 1, // 1 to 4
        estimatedMin: 18,
        createdAt: '16:45'
    }
];

function getDeliveries() {
    const d = localStorage.getItem('courier_deliveries');
    return d ? JSON.parse(d) : initialDeliveries;
}

function saveDeliveries(data) {
    localStorage.setItem('courier_deliveries', JSON.stringify(data));
}
