
const staffList = [
    { id: 1, name: 'Burak Usta', role: 'Baş Berber & Saç Tasarım', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop' },
    { id: 2, name: 'Emre Keskin', role: 'Sakal & Klasik Tıraş Uzmanı', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop' },
    { id: 3, name: 'Can Demir', role: 'Cilt Bakımı & Renklendirme', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop' }
];

const servicesList = [
    { id: 's1', name: 'Modern Saç Kesimi & Yıkama', duration: '40 dk', price: 250, icon: 'fa-scissors' },
    { id: 's2', name: 'Sakal Tasarımı & Sıcak Havlu', duration: '25 dk', price: 150, icon: 'fa-razor' },
    { id: 's3', name: 'Saç + Sakal Full Bakım', duration: '60 dk', price: 350, icon: 'fa-crown' },
    { id: 's4', name: 'Cilt Bakımı & Siyah Maske', duration: '30 dk', price: 200, icon: 'fa-spa' }
];

const timeSlots = [
    '10:00', '11:00', '12:00', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30'
];

function getAppointments() {
    const data = localStorage.getItem('barber_appointments');
    return data ? JSON.parse(data) : [];
}

function saveAppointments(appts) {
    localStorage.setItem('barber_appointments', JSON.stringify(appts));
}
