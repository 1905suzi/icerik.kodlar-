
const staffList = [
    { id: 1, name: 'Seda Yılmaz', role: 'Kreatif Saç Tasarımcısı & Ombre Uzmanı', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop' },
    { id: 2, name: 'Melis Kaya', role: 'Nail Art, Manikür & Protez Tırnak', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop' },
    { id: 3, name: 'Ece Demir', role: 'Profesyonel Makyaj & Cilt Bakımı', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop' }
];

const servicesList = [
    { id: 's1', name: 'Saç Kesimi, Yıkama & Fön', duration: '45 dk', price: 350, icon: 'fa-scissors' },
    { id: 's2', name: 'Nail Art & Kalıcı Oje / Manikür', duration: '60 dk', price: 400, icon: 'fa-hand-sparkles' },
    { id: 's3', name: 'Sombre / Ombre & Saç Bakımı', duration: '120 dk', price: 1200, icon: 'fa-wand-magic-sparkles' },
    { id: 's4', name: 'Gelin & Özel Gün Makyajı', duration: '90 dk', price: 850, icon: 'fa-heart' },
    { id: 's5', name: 'Lifting & İpek Kirpik', duration: '50 dk', price: 500, icon: 'fa-eye' }
];

const timeSlots = [
    '10:00', '11:00', '12:00', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30'
];

function getAppointments() {
    const data = localStorage.getItem('beauty_appointments');
    return data ? JSON.parse(data) : [];
}

function saveAppointments(appts) {
    localStorage.setItem('beauty_appointments', JSON.stringify(appts));
}
