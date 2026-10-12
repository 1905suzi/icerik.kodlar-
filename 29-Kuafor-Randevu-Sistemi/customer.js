
document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    let selectedService = null;
    let selectedStaff = null;
    let selectedDate = new Date().toISOString().split('T')[0];
    let selectedTime = null;

    const dateInput = document.getElementById('apptDate');
    dateInput.value = selectedDate;
    dateInput.min = selectedDate;

    // 1. Render Hizmetler
    const servicesGrid = document.getElementById('servicesGrid');
    servicesList.forEach(s => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.innerHTML = `
            <div class="card-icon"><i class="fa-solid ${s.icon}"></i></div>
            <div class="card-info">
                <h3>${s.name}</h3>
                <p><i class="fa-regular fa-clock"></i> ${s.duration}</p>
                <div class="card-price">${s.price} ₺</div>
            </div>
        `;
        card.onclick = () => {
            document.querySelectorAll('#servicesGrid .selection-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedService = s;
            document.getElementById('toStep2Btn').disabled = false;
        };
        servicesGrid.appendChild(card);
    });

    // 2. Render Uzmanlar
    const staffGrid = document.getElementById('staffGrid');
    staffList.forEach(staff => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.innerHTML = `
            <img src="${staff.img}" class="card-img" alt="${staff.name}">
            <div class="card-info">
                <h3>${staff.name}</h3>
                <p>${staff.role}</p>
            </div>
        `;
        card.onclick = () => {
            document.querySelectorAll('#staffGrid .selection-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedStaff = staff;
            document.getElementById('toStep3Btn').disabled = false;
        };
        staffGrid.appendChild(card);
    });

    // 3. Render Saat Slotları
    function renderSlots() {
        const slotsContainer = document.getElementById('slotsContainer');
        slotsContainer.innerHTML = '';
        selectedTime = null;
        document.getElementById('toStep4Btn').disabled = true;

        const currentAppts = getAppointments();
        // Bu berber + bu tarihte alınmış randevuları filtrele
        const bookedTimes = currentAppts
            .filter(a => a.staffId === selectedStaff.id && a.date === selectedDate && a.status !== 'İptal Edildi')
            .map(a => a.time);

        timeSlots.forEach(time => {
            const btn = document.createElement('button');
            btn.className = 'slot-btn';
            btn.innerText = time;

            if (bookedTimes.includes(time)) {
                btn.disabled = true;
                btn.title = 'Bu saat dolu';
            } else {
                btn.onclick = () => {
                    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    selectedTime = time;
                    document.getElementById('toStep4Btn').disabled = false;
                };
            }
            slotsContainer.appendChild(btn);
        });
    }

    dateInput.addEventListener('change', (e) => {
        selectedDate = e.target.value;
        renderSlots();
    });

    // 4. Render Özet
    function renderSummary() {
        const summaryCard = document.getElementById('summaryCard');
        summaryCard.innerHTML = `
            <div class="summary-row"><span>Hizmet:</span><strong>${selectedService.name} (${selectedService.duration})</strong></div>
            <div class="summary-row"><span>Uzman Berber:</span><strong>${selectedStaff.name}</strong></div>
            <div class="summary-row"><span>Randevu Tarihi:</span><strong>${selectedDate}</strong></div>
            <div class="summary-row"><span>Randevu Saati:</span><strong>${selectedTime}</strong></div>
            <div class="summary-row"><span>Toplam Ücret:</span><span>${selectedService.price} ₺</span></div>
        `;
    }

    // Step Navigasyon
    window.goToStep = (step) => {
        document.querySelectorAll('.booking-section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.step-item').forEach((item, index) => {
            item.classList.remove('active');
            if (index + 1 < step) item.classList.add('done');
            else item.classList.remove('done');
        });

        document.getElementById('step' + step).classList.add('active');
        document.getElementById('stepIndicator' + step).classList.add('active');
        currentStep = step;

        if (step === 3) renderSlots();
        if (step === 4) renderSummary();
    };

    document.getElementById('toStep2Btn').onclick = () => goToStep(2);
    document.getElementById('toStep3Btn').onclick = () => goToStep(3);
    document.getElementById('toStep4Btn').onclick = () => goToStep(4);

    // Randevuyu Onayla & Kaydet
    document.getElementById('confirmBookingBtn').onclick = () => {
        const name = document.getElementById('clientName').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const note = document.getElementById('clientNote').value.trim();

        if (!name || !phone) {
            alert('Lütfen adınızı ve telefon numaranızı girin!');
            return;
        }

        const newAppt = {
            id: 'RND-' + Math.floor(1000 + Math.random() * 9000),
            clientName: name,
            clientPhone: phone,
            note: note,
            service: selectedService.name,
            price: selectedService.price,
            duration: selectedService.duration,
            staffId: selectedStaff.id,
            staffName: selectedStaff.name,
            date: selectedDate,
            time: selectedTime,
            status: 'Bekliyor', // Bekliyor, Koltukta, Tamamlandı, İptal Edildi
            createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };

        const appts = getAppointments();
        appts.push(newAppt);
        saveAppointments(appts);

        // Başarı Ekranı
        document.querySelectorAll('.booking-section').forEach(s => s.classList.remove('active'));
        document.getElementById('successSection').classList.add('active');
        document.getElementById('ticketInfo').innerHTML = `
            <div><strong>Randevu No:</strong> ${newAppt.id}</div>
            <div style="margin-top:4px;"><strong>Müşteri:</strong> ${newAppt.clientName}</div>
            <div style="margin-top:4px;"><strong>Hizmet:</strong> ${newAppt.service}</div>
            <div style="margin-top:4px;"><strong>Uzman:</strong> ${newAppt.staffName}</div>
            <div style="margin-top:4px;"><strong>Tarih / Saat:</strong> ${newAppt.date} @ ${newAppt.time}</div>
        `;
    };
});
