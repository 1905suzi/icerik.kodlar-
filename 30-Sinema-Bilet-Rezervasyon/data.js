
const moviesData = [
    {
        id: 'm1',
        title: 'Oppenheimer',
        genre: 'Biyografi / Dram / Tarih',
        duration: '180 dk',
        rating: '8.9',
        price: 180,
        poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop',
        hall: 'Salon 1 (IMAX)',
        sessions: ['13:00', '16:30', '20:00', '23:30']
    },
    {
        id: 'm2',
        title: 'Interstellar: Yeniden Vizyonda',
        genre: 'Bilim Kurgu / Macera',
        duration: '169 dk',
        rating: '8.7',
        price: 160,
        poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&auto=format&fit=crop',
        hall: 'Salon 3 (Dolby Atmos)',
        sessions: ['14:15', '17:45', '21:15']
    },
    {
        id: 'm3',
        title: 'Cyberpunk: Neon Gece',
        genre: 'Aksiyon / Gerilim',
        duration: '125 dk',
        rating: '8.2',
        price: 150,
        poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop',
        hall: 'Salon 2',
        sessions: ['12:30', '15:15', '18:30', '21:45']
    }
];

const snacksMenu = [
    { id: 'snk1', name: 'Büyük Boy Patlamış Mısır', price: 90, icon: 'fa-bowl-rice' },
    { id: 'snk2', name: 'Kutu İçecek (Kola / Gazoz)', price: 45, icon: 'fa-bottle-water' },
    { id: 'snk3', name: 'Mısır + İçecek Sinema Menüsü', price: 120, icon: 'fa-ticket' }
];

function getCinemaBookings() {
    const data = localStorage.getItem('cinema_bookings');
    return data ? JSON.parse(data) : [];
}

function saveCinemaBookings(data) {
    localStorage.setItem('cinema_bookings', JSON.stringify(data));
}
