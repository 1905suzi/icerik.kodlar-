
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
        card.innerHTML = `
            <div class="movie-poster-wrap">
                <img src="${m.poster}" alt="${m.title}">
                <div class="movie-badge-rating"><i class="fa-solid fa-star"></i> ${m.rating}</div>
            </div>
            <div class="movie-body">
                <div>
                    <h3 class="movie-title">${m.title}</h3>
                    <div class="movie-genre">${m.genre} • ${m.duration}</div>
                    <div style="font-size:0.85rem; color:var(--text-secondary);"><i class="fa-solid fa-tv"></i> ${m.hall}</div>
                </div>
                <div>
                    <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:14px; font-weight:600;">SEANS SEÇİN:</div>
                    <div class="session-pills">
                        ${m.sessions.map(s => `<button class="session-btn" onclick="openBooking('${m.id}', '${s}')">${s}</button>`).join('')}
                    </div>
                </div>
            </div>
        `;
        moviesGrid.appendChild(card);
    });

    // 2. Koltuk Düzeni Açma
    window.openBooking = (movieId, session) => {
        currentMovie = moviesData.find(m => m.id === movieId);
        currentSession = session;
        selectedSeats = [];
        eTicketBox.style.display = 'none';

        document.getElementById('modalMovieTitle').innerText = currentMovie.title;
        document.getElementById('modalMovieMeta').innerText = `${currentMovie.hall} | Seans: ${currentSession} | Bilet: ${currentMovie.price} ₺`;

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
                const seatCode = `${r}${i}`;
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
        document.getElementById('tktMeta').innerText = `${newBooking.hall} • Seans: ${newBooking.session}`;
        document.getElementById('tktBarcode').innerText = newBooking.ticketCode;
        document.getElementById('tktSeats').innerText = newBooking.seats.join(', ');

        eTicketBox.style.display = 'block';
        confirmBookingBtn.disabled = true;

        // Koltukları doldur
        renderSeats();
    };
});
