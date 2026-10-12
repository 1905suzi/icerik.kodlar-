const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '30-Sinema-Bilet-Rezervasyon');
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

// 1. data.js
const dataJs = `
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
`;

// 2. style.css
const styleCss = `
:root {
    --bg-main: #0c0d14;
    --card-surface: #151824;
    --accent-red: #e50914;
    --accent-glow: rgba(229, 9, 20, 0.4);
    --gold: #f5c518;
    --seat-available: #282e42;
    --seat-selected: #e50914;
    --seat-occupied: #475069;
    --seat-vip: #d4af37;
    --text-primary: #ffffff;
    --text-secondary: #8e95a5;
    --border-color: #232838;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
    background: var(--bg-main);
    color: var(--text-primary);
    min-height: 100vh;
}

header {
    background: rgba(21, 24, 36, 0.95);
    backdrop-filter: blur(15px);
    border-bottom: 1px solid var(--border-color);
    padding: 16px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand-icon {
    color: var(--accent-red);
    font-size: 1.8rem;
    text-shadow: 0 0 20px var(--accent-glow);
}

.brand h1 {
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: 1.5px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
}

/* Movie Cards */
.movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    margin-bottom: 30px;
}

.movie-card {
    background: var(--card-surface);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
}

.movie-card:hover {
    transform: translateY(-6px);
    border-color: var(--accent-red);
    box-shadow: 0 12px 30px rgba(229, 9, 20, 0.25);
}

.movie-poster-wrap {
    height: 240px;
    position: relative;
    overflow: hidden;
}

.movie-poster-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.movie-badge-rating {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    color: var(--gold);
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.85rem;
    border: 1px solid rgba(245, 197, 24, 0.3);
}

.movie-body {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.movie-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 6px;
}

.movie-genre {
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin-bottom: 16px;
}

.session-pills {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 12px;
}

.session-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
}

.session-btn:hover {
    background: var(--accent-red);
    border-color: var(--accent-red);
}

/* Booking View Modal / Screen */
.booking-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(12, 13, 20, 0.95);
    backdrop-filter: blur(10px);
    z-index: 200;
    display: none;
    overflow-y: auto;
    padding: 20px;
}

.booking-modal.active {
    display: block;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.98); }
    to { opacity: 1; transform: scale(1); }
}

.modal-content {
    max-width: 900px;
    margin: 40px auto;
    background: var(--card-surface);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 32px;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 24px;
    right: 24px;
    background: rgba(255, 255, 255, 0.08);
    border: none;
    color: #fff;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    transition: 0.2s;
}

.close-btn:hover {
    background: var(--accent-red);
}

/* Cinema Screen */
.screen-area {
    margin: 30px 0 40px;
    text-align: center;
    perspective: 500px;
}

.cinema-screen {
    height: 12px;
    background: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.2));
    border-radius: 50%;
    box-shadow: 0 15px 40px rgba(255, 255, 255, 0.4);
    transform: rotateX(-30deg);
    margin-bottom: 12px;
}

.screen-label {
    font-size: 0.75rem;
    letter-spacing: 4px;
    color: var(--text-secondary);
    text-transform: uppercase;
}

/* Seat Grid */
.seats-layout {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    margin-bottom: 30px;
}

.seat-row {
    display: flex;
    gap: 10px;
    align-items: center;
}

.row-label {
    width: 24px;
    font-weight: 700;
    color: var(--text-secondary);
    font-size: 0.85rem;
    text-align: center;
}

.seat {
    width: 34px;
    height: 34px;
    border-radius: 8px 8px 4px 4px;
    background: var(--seat-available);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
}

.seat:hover:not(.occupied) {
    transform: scale(1.15);
    background: #3e4866;
}

.seat.selected {
    background: var(--seat-selected);
    color: #fff;
    box-shadow: 0 0 14px var(--accent-glow);
    border-color: var(--accent-red);
}

.seat.occupied {
    background: var(--seat-occupied);
    opacity: 0.35;
    cursor: not-allowed;
    border-color: transparent;
}

.seat.vip {
    border-color: var(--gold);
    color: var(--gold);
}

.seat.vip.selected {
    background: var(--gold);
    color: #000;
}

/* Legend */
.seat-legend {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.legend-box {
    width: 18px;
    height: 18px;
    border-radius: 4px;
}

/* Checkout Bar */
.checkout-bar {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
}

.total-sum {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--accent-red);
}

.btn-book {
    background: var(--accent-red);
    color: #fff;
    border: none;
    padding: 14px 28px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 8px 24px var(--accent-glow);
    transition: 0.25s;
}

.btn-book:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(229, 9, 20, 0.6);
}

.btn-book:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* Ticket Modal (E-Bilet) */
.ticket-card {
    background: linear-gradient(135deg, #1f2334 0%, #151824 100%);
    border: 2px dashed rgba(229, 9, 20, 0.6);
    border-radius: 20px;
    padding: 24px;
    max-width: 420px;
    margin: 20px auto 0;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    text-align: center;
}

.ticket-barcode {
    font-family: 'Courier New', monospace;
    letter-spacing: 5px;
    font-size: 1.4rem;
    font-weight: 800;
    margin: 16px 0;
    color: #fff;
    padding: 10px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 8px;
}

/* Gise Ekranı (gise.html) */
.gise-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.gise-card {
    background: var(--card-surface);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 20px;
}

.ticket-row {
    background: var(--card-surface);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
}
`;

// 3. index.html (Müşteri Bilet Rezervasyon Ekranı)
const indexHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Suzi CineVerse - Vizyondaki Filmler & Koltuk Seçimi</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header>
        <div class="brand">
            <i class="fa-solid fa-film brand-icon"></i>
            <div>
                <h1>SUZI CINEVERSE</h1>
                <div style="font-size: 0.7rem; color: var(--accent-red); letter-spacing: 2px;">PREMIUM CINEMA EXPERIENCE</div>
            </div>
        </div>
        <div style="font-size: 0.9rem; color: var(--text-secondary);"><i class="fa-solid fa-location-dot"></i> Salon: İstanbul Galataport</div>
    </header>

    <div class="container">
        <div style="margin-bottom: 24px;">
            <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 6px;">Vizyondaki Filmler</h2>
            <p style="color: var(--text-secondary);">İzlemek istediğiniz filmi ve seansı seçin, yerinizi hemen ayırtın.</p>
        </div>

        <div class="movies-grid" id="moviesGrid"></div>
    </div>

    <!-- Koltuk Seçim Modalı -->
    <div class="booking-modal" id="bookingModal">
        <div class="modal-content">
            <button class="close-btn" id="closeModalBtn"><i class="fa-solid fa-xmark"></i></button>

            <div style="margin-bottom: 20px;">
                <h2 id="modalMovieTitle" style="font-size: 1.6rem; font-weight: 800;">Film Adı</h2>
                <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;" id="modalMovieMeta">Salon & Seans Bilgisi</div>
            </div>

            <!-- Sinema Perdesi -->
            <div class="screen-area">
                <div class="cinema-screen"></div>
                <div class="screen-label">SİNEMA PERDESİ (SCREEN)</div>
            </div>

            <!-- Koltuk Düzeni -->
            <div class="seats-layout" id="seatsLayout"></div>

            <!-- Bilgilendirme -->
            <div class="seat-legend">
                <div class="legend-item"><div class="legend-box" style="background: var(--seat-available);"></div> Boş Koltuk (160 ₺)</div>
                <div class="legend-item"><div class="legend-box" style="background: var(--seat-selected);"></div> Seçilen Koltuk</div>
                <div class="legend-item"><div class="legend-box" style="background: var(--seat-vip);"></div> VIP Koltuk (220 ₺)</div>
                <div class="legend-item"><div class="legend-box" style="background: var(--seat-occupied); opacity: 0.35;"></div> Dolu Koltuk</div>
            </div>

            <!-- Ödeme & Onay Barı -->
            <div class="checkout-bar">
                <div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary);">Seçilen Koltuklar: <strong id="selectedSeatsLabel" style="color:#fff;">Henüz seçilmedi</strong></div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top:4px;">Toplam Tutar:</div>
                    <div class="total-sum" id="totalPriceLabel">0 ₺</div>
                </div>
                <button class="btn-book" id="confirmBookingBtn" disabled><i class="fa-solid fa-ticket"></i> Bileti Onayla & Al</button>
            </div>

            <!-- Bilet Çıktısı (E-Ticket) -->
            <div id="eTicketBox" style="display: none;">
                <div class="ticket-card">
                    <div style="color: var(--accent-red); font-size: 0.85rem; font-weight: 800; letter-spacing: 2px;">E-BİLET GİRİŞ KARTI</div>
                    <h3 id="tktMovie" style="margin: 10px 0 6px; font-size: 1.3rem;">Film</h3>
                    <p id="tktMeta" style="color: var(--text-secondary); font-size: 0.85rem;">Tarih / Salon</p>
                    <div class="ticket-barcode" id="tktBarcode">CINE-88219</div>
                    <div style="font-size: 1.1rem; font-weight: 700; color: var(--gold); margin-bottom: 6px;">Koltuklar: <span id="tktSeats"></span></div>
                    <p style="font-size: 0.8rem; color: var(--text-secondary);">Bu bilet gişe ekranına ve kapı kontrol görevlisine anında iletilmiştir.</p>
                </div>
            </div>
        </div>
    </div>

    <script src="data.js"></script>
    <script src="cinema.js"></script>
</body>
</html>`;

// 4. cinema.js
const cinemaJs = `
document.addEventListener('DOMContentLoaded', () => {
    let currentMovie = null;
    let currentSession = null;
    let selectedSeats = [];

    const moviesGrid = document.getElementById('moviesGrid');
    const modal = document.getElementById('bookingModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const seatsLayout = document.getElementById('seatsLayout');
    const selectedSeatsLabel = document.getElementById('selectedSeatsLabel');
    const totalPriceLabel = document.getElementById('totalPriceLabel');
    const confirmBookingBtn = document.getElementById('confirmBookingBtn');
    const eTicketBox = document.getElementById('eTicketBox');

    // 1. Render Filmler
    moviesData.forEach(m => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = \`
            <div class="movie-poster-wrap">
                <img src="\${m.poster}" alt="\${m.title}">
                <div class="movie-badge-rating"><i class="fa-solid fa-star"></i> \${m.rating}</div>
            </div>
            <div class="movie-body">
                <div>
                    <h3 class="movie-title">\${m.title}</h3>
                    <div class="movie-genre">\${m.genre} • \${m.duration}</div>
                    <div style="font-size:0.85rem; color:var(--text-secondary);"><i class="fa-solid fa-tv"></i> \${m.hall}</div>
                </div>
                <div>
                    <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:14px; font-weight:600;">SEANS SEÇİN:</div>
                    <div class="session-pills">
                        \${m.sessions.map(s => \`<button class="session-btn" onclick="openBooking('\${m.id}', '\${s}')">\${s}</button>\`).join('')}
                    </div>
                </div>
            </div>
        \`;
        moviesGrid.appendChild(card);
    });

    // 2. Koltuk Düzeni Açma
    window.openBooking = (movieId, session) => {
        currentMovie = moviesData.find(m => m.id === movieId);
        currentSession = session;
        selectedSeats = [];
        eTicketBox.style.display = 'none';

        document.getElementById('modalMovieTitle').innerText = currentMovie.title;
        document.getElementById('modalMovieMeta').innerText = \`\${currentMovie.hall} | Seans: \${currentSession} | Bilet: \${currentMovie.price} ₺\`;

        renderSeats();
        updateCheckoutUI();
        modal.classList.add('active');
    };

    closeModalBtn.onclick = () => modal.classList.remove('active');

    // 3. Render Koltuklar (5 sıra, 8 sütun)
    function renderSeats() {
        seatsLayout.innerHTML = '';
        const rows = ['A', 'B', 'C', 'D', 'E'];
        const cols = 8;

        const allBookings = getCinemaBookings();
        // Bu film + bu seans için satılmış koltukları bul
        const occupiedSeats = allBookings
            .filter(b => b.movieId === currentMovie.id && b.session === currentSession && b.status !== 'İptal')
            .flatMap(b => b.seats);

        rows.forEach(r => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'seat-row';

            const label = document.createElement('div');
            label.className = 'row-label';
            label.innerText = r;
            rowDiv.appendChild(label);

            for (let i = 1; i <= cols; i++) {
                const seatCode = \`\${r}\${i}\`;
                const seat = document.createElement('div');
                seat.className = 'seat';
                seat.innerText = i;
                seat.dataset.code = seatCode;

                if (r === 'E') {
                    seat.classList.add('vip'); // Son sıra VIP
                }

                if (occupiedSeats.includes(seatCode)) {
                    seat.classList.add('occupied');
                } else {
                    seat.onclick = () => toggleSeat(seatCode, seat, r === 'E');
                }
                rowDiv.appendChild(seat);
            }
            seatsLayout.appendChild(rowDiv);
        });
    }

    function toggleSeat(seatCode, seatEl, isVip) {
        if (selectedSeats.includes(seatCode)) {
            selectedSeats = selectedSeats.filter(s => s !== seatCode);
            seatEl.classList.remove('selected');
        } else {
            selectedSeats.push(seatCode);
            seatEl.classList.add('selected');
        }
        updateCheckoutUI();
    }

    function updateCheckoutUI() {
        if (selectedSeats.length === 0) {
            selectedSeatsLabel.innerText = 'Henüz seçilmedi';
            totalPriceLabel.innerText = '0 ₺';
            confirmBookingBtn.disabled = true;
            return;
        }

        selectedSeatsLabel.innerText = selectedSeats.join(', ');
        
        let total = 0;
        selectedSeats.forEach(code => {
            const isVip = code.startsWith('E');
            total += isVip ? 220 : currentMovie.price;
        });

        totalPriceLabel.innerText = total + ' ₺';
        confirmBookingBtn.disabled = false;
    }

    // 4. Bilet Onayı & Gişe Sistemine Kayıt
    confirmBookingBtn.onclick = () => {
        const ticketCode = 'CINE-' + Math.floor(10000 + Math.random() * 90000);
        let total = 0;
        selectedSeats.forEach(code => {
            total += code.startsWith('E') ? 220 : currentMovie.price;
        });

        const newBooking = {
            ticketCode: ticketCode,
            movieId: currentMovie.id,
            movieTitle: currentMovie.title,
            hall: currentMovie.hall,
            session: currentSession,
            seats: selectedSeats,
            totalPrice: total,
            status: 'Geçerli', // Geçerli, Giriş Yapıldı, İptal
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };

        const list = getCinemaBookings();
        list.push(newBooking);
        saveCinemaBookings(list);

        // Bilet çıktısını göster
        document.getElementById('tktMovie').innerText = newBooking.movieTitle;
        document.getElementById('tktMeta').innerText = \`\${newBooking.hall} • Seans: \${newBooking.session}\`;
        document.getElementById('tktBarcode').innerText = newBooking.ticketCode;
        document.getElementById('tktSeats').innerText = newBooking.seats.join(', ');

        eTicketBox.style.display = 'block';
        confirmBookingBtn.disabled = true;

        // Koltukları doldur
        renderSeats();
    };
});
`;

// 5. gise.html (Gişe / Kapı Kontrol Ekranı)
const giseHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sinema Gişe & Bilet Doğrulama Paneli</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header>
        <div class="brand">
            <i class="fa-solid fa-door-open brand-icon" style="color:#10b981;"></i>
            <div>
                <h1>SUZI CINEVERSE</h1>
                <div style="font-size: 0.7rem; color: #10b981; letter-spacing: 2px;">GİŞE & SALON KAPI KONTROLÜ</div>
            </div>
        </div>
        <div style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700;">
            <i class="fa-solid fa-signal"></i> Canlı Senkronize
        </div>
    </header>

    <div class="container">
        <!-- Canlı İstatistikler -->
        <div class="gise-stats">
            <div class="gise-card">
                <div style="color: var(--text-secondary); font-size: 0.85rem;">Satılan Toplam Bilet</div>
                <div style="font-size: 1.8rem; font-weight: 800; margin-top: 4px;" id="statTotalTickets">0</div>
            </div>
            <div class="gise-card">
                <div style="color: var(--text-secondary); font-size: 0.85rem;">Salona Giriş Yapanlar</div>
                <div style="font-size: 1.8rem; font-weight: 800; margin-top: 4px; color: #10b981;" id="statEntered">0</div>
            </div>
            <div class="gise-card">
                <div style="color: var(--text-secondary); font-size: 0.85rem;">Kasa Toplam Hasılat</div>
                <div style="font-size: 1.8rem; font-weight: 800; margin-top: 4px; color: var(--gold);" id="statRevenue">0 ₺</div>
            </div>
        </div>

        <!-- Hızlı Bilet Doğrulama -->
        <div style="background: var(--card-surface); padding: 20px; border-radius: 16px; border: 1px solid var(--border-color); margin-bottom: 24px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 250px;">
                <input type="text" id="barcodeSearch" placeholder="Bilet Barkod No Girin (Örn: CINE-12345)" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 10px; color:#fff; font-size: 1rem; outline: none;">
            </div>
            <button class="btn-book" onclick="verifyTicketByInput()"><i class="fa-solid fa-barcode"></i> Barkod Kontrol Et</button>
            <button class="btn-book" onclick="resetAllCinemaData()" style="background: #333;"><i class="fa-solid fa-trash"></i> Sıfırla</button>
        </div>

        <!-- Bilet Akışı -->
        <h3 style="margin-bottom: 14px;">Gelen Rezervasyonlar & Biletler</h3>
        <div id="ticketsList"></div>
    </div>

    <script src="data.js"></script>
    <script src="gise.js"></script>
</body>
</html>`;

// 6. gise.js
const giseJs = `
function renderGise() {
    const list = document.getElementById('ticketsList');
    list.innerHTML = '';
    const bookings = getCinemaBookings();

    // Stats
    let totalTicketsCount = 0;
    let enteredCount = 0;
    let totalRev = 0;

    bookings.forEach(b => {
        if (b.status !== 'İptal') {
            totalTicketsCount += b.seats.length;
            totalRev += b.totalPrice;
            if (b.status === 'Giriş Yapıldı') enteredCount += b.seats.length;
        }
    });

    document.getElementById('statTotalTickets').innerText = totalTicketsCount;
    document.getElementById('statEntered').innerText = enteredCount;
    document.getElementById('statRevenue').innerText = totalRev + ' ₺';

    if (bookings.length === 0) {
        list.innerHTML = '<div style="background:var(--card-surface); padding:30px; text-align:center; border-radius:16px; color:var(--text-secondary);">Henüz satılan bilet yok. Müşteri ekranından bilet alındığında buraya anında düşer!</div>';
        return;
    }

    bookings.slice().reverse().forEach(b => {
        const isEntered = b.status === 'Giriş Yapıldı';
        const card = document.createElement('div');
        card.className = 'ticket-row';
        card.innerHTML = \`
            <div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <strong style="font-size:1.1rem; color:#fff;">\${b.movieTitle}</strong>
                    <span style="font-size:0.8rem; padding:3px 10px; border-radius:12px; background:\${isEntered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 197, 24, 0.2)'}; color:\${isEntered ? '#10b981' : '#f5c518'}; font-weight:700;">\${b.status}</span>
                </div>
                <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;">
                    \${b.hall} • Seans: \${b.session} • Koltuklar: <strong style="color:var(--gold);">\${b.seats.join(', ')}</strong> • Saat: \${b.time}
                </div>
                <div style="font-size:0.85rem; color:var(--accent-red); font-weight:700; margin-top:2px;">Barkod: \${b.ticketCode} | Tutar: \${b.totalPrice} ₺</div>
            </div>
            <div>
                \${!isEntered ? \`<button class="btn-book" style="padding:8px 16px; font-size:0.85rem; background:#10b981;" onclick="checkInTicket('\${b.ticketCode}')"><i class="fa-solid fa-check"></i> Kapı Girişi Ver</button>\` : '<span style="color:#10b981; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Salonda</span>'}
            </div>
        \`;
        list.appendChild(card);
    });
}

window.checkInTicket = (code) => {
    const list = getCinemaBookings();
    const item = list.find(b => b.ticketCode === code);
    if (item) {
        item.status = 'Giriş Yapıldı';
        saveCinemaBookings(list);
        renderGise();
    }
};

window.verifyTicketByInput = () => {
    const code = document.getElementById('barcodeSearch').value.trim();
    if (!code) return alert('Lütfen barkod girin!');

    const list = getCinemaBookings();
    const item = list.find(b => b.ticketCode === code);
    if (!item) {
        alert('❌ Geçersiz bilet barkodu bulunamadı!');
    } else if (item.status === 'Giriş Yapıldı') {
        alert('⚠️ Bu bilet ile zaten salona giriş yapılmış!');
    } else {
        item.status = 'Giriş Yapıldı';
        saveCinemaBookings(list);
        renderGise();
        alert(\`✅ Bilet Onaylandı! Hoş geldiniz: \${item.movieTitle} - Koltuklar: \${item.seats.join(', ')}\`);
        document.getElementById('barcodeSearch').value = '';
    }
};

window.resetAllCinemaData = () => {
    if (confirm('Tüm sinema bilet kayıtları sıfırlanacak. Emin misiniz?')) {
        localStorage.removeItem('cinema_bookings');
        renderGise();
    }
};

renderGise();

// Cross-tab real time
window.addEventListener('storage', () => {
    renderGise();
});
`;

fs.writeFileSync(path.join(dirPath, 'data.js'), dataJs);
fs.writeFileSync(path.join(dirPath, 'style.css'), styleCss);
fs.writeFileSync(path.join(dirPath, 'index.html'), indexHtml);
fs.writeFileSync(path.join(dirPath, 'cinema.js'), cinemaJs);
fs.writeFileSync(path.join(dirPath, 'gise.html'), giseHtml);
fs.writeFileSync(path.join(dirPath, 'gise.js'), giseJs);

console.log('30-Sinema-Bilet-Rezervasyon generated successfully!');
