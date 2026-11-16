// MHRS Dashboard & Randevu Motoru Mantığı
document.addEventListener('DOMContentLoaded', () => {
  const doctorList = document.getElementById('doctorList');
  const btnSearch = document.getElementById('btnSearch');
  const selectClinic = document.getElementById('selectClinic');
  const selectDistrict = document.getElementById('selectDistrict');
  const selectCity = document.getElementById('selectCity');
  const dateChips = document.querySelectorAll('.date-chip');
  const resultsTitle = document.getElementById('resultsTitle');

  // Modal Elemanları
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');
  const modalHospital = document.getElementById('modalHospital');
  const modalClinic = document.getElementById('modalClinic');
  const modalDoctor = document.getElementById('modalDoctor');
  const modalDateTime = document.getElementById('modalDateTime');

  let selectedAppointment = null;
  let activeDatePreference = 'Bugün';

  // Gerçekçi Örnek Doktor ve Randevu Verisi
  const mockDoctors = [
    {
      id: 1,
      name: 'Doç. Dr. Emre Çetin',
      title: 'Uzman Hekim',
      clinic: 'Göz Hastalıkları',
      hospital: 'İstanbul Haydarpaşa Numune E.A. Hastanesi',
      district: 'Kadıköy',
      city: 'İstanbul',
      room: 'Poliklinik B-204',
      slots: ['09:15', '09:45', '11:15', '14:30', '15:45']
    },
    {
      id: 2,
      name: 'Uzm. Dr. Zeynep Kaya',
      title: 'Klinik Şefi',
      clinic: 'Göz Hastalıkları',
      hospital: 'İstanbul Göztepe Prof. Dr. Süleyman Yalçın Şehir Hastanesi',
      district: 'Kadıköy',
      city: 'İstanbul',
      room: 'Poliklinik A-102',
      slots: ['10:00', '10:30', '13:45', '16:00']
    },
    {
      id: 3,
      name: 'Prof. Dr. Ahmet Demir',
      title: 'Klinik Eğiticisi',
      clinic: 'Dahiliye (İç Hastalıkları)',
      hospital: 'İstanbul Şişli Hamidiye Etfal E.A. Hastanesi',
      district: 'Şişli',
      city: 'İstanbul',
      room: 'Poliklinik D-301',
      slots: ['09:30', '11:00', '14:15', '15:30']
    },
    {
      id: 4,
      name: 'Uzm. Dr. Ayşe Yurt',
      title: 'Uzman Hekim',
      clinic: 'Kulak Burun Boğaz (KBB)',
      hospital: 'İstanbul Bakırköy Dr. Sadi Konuk E.A. Hastanesi',
      district: 'Bakırköy',
      city: 'İstanbul',
      room: 'Poliklinik C-110',
      slots: ['10:45', '11:30', '15:15']
    },
    {
      id: 5,
      name: 'Doç. Dr. Burak Sezgin',
      title: 'Ortopedi Uzmanı',
      clinic: 'Ortopedi ve Travmatoloji',
      hospital: 'İstanbul Üsküdar Devlet Hastanesi',
      district: 'Üsküdar',
      city: 'İstanbul',
      room: 'Poliklinik Z-04',
      slots: ['09:00', '10:15', '14:45']
    }
  ];

  // Tarih butonları
  dateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dateChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeDatePreference = chip.dataset.date;
      filterDoctors();
    });
  });

  // Arama Butonu
  btnSearch.addEventListener('click', filterDoctors);
  selectClinic.addEventListener('change', filterDoctors);
  selectDistrict.addEventListener('change', filterDoctors);

  function filterDoctors() {
    const clinic = selectClinic.value;
    const district = selectDistrict.value;

    let filtered = mockDoctors.filter(d => {
      const matchClinic = d.clinic === clinic;
      const matchDistrict = (district === 'Tümü') || (d.district === district);
      return matchClinic && matchDistrict;
    });

    if (filtered.length === 0) {
      // Eğer spesifik ilçede yoksa branştaki tüm doktorları gösterelim
      filtered = mockDoctors.filter(d => d.clinic === clinic);
    }

    renderDoctorCards(filtered);
  }

  function renderDoctorCards(doctors) {
    doctorList.innerHTML = '';
    resultsTitle.innerText = `Uygun Hekim ve Saatler (${doctors.length} Randevu Bulundu)`;

    if (doctors.length === 0) {
      doctorList.innerHTML = `
        <div style="text-align:center; padding:30px; color:#4e6b62; background:#fafdfc; border-radius:14px; border:1px solid #e2ede8;">
          <p style="font-size:1.4rem; margin-bottom:6px;">🔍</p>
          <b>Seçilen kriterlerde uygun randevu bulunamadı.</b>
          <p style="font-size:0.8rem; margin-top:4px;">Lütfen ilçe filtrelerini genişleterek tekrar deneyiniz.</p>
        </div>`;
      return;
    }

    doctors.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'doc-card';

      // Saat butonları
      const slotsHtml = doc.slots.map(time => `
        <button class="slot-btn" onclick="openBookingModal('${doc.id}', '${time}')">${time}</button>
      `).join('');

      card.innerHTML = `
        <div class="doc-header">
          <div class="doc-info">
            <h4>${doc.name}</h4>
            <p>${doc.hospital} • <b>${doc.room}</b></p>
          </div>
          <span class="hospital-badge">${doc.district}</span>
        </div>
        <div class="slots-container">
          <span class="slots-title">📅 ${activeDatePreference} İçin Boş Muayene Saatleri:</span>
          <div class="slots-grid">
            ${slotsHtml}
          </div>
        </div>
      `;

      doctorList.appendChild(card);
    });
  }

  // Randevu Modalını Açma
  window.openBookingModal = function(docId, time) {
    const doc = mockDoctors.find(d => d.id == docId);
    if (!doc) return;

    selectedAppointment = {
      doc,
      time,
      date: activeDatePreference === 'Bugün' ? '17 Kasım 2026' : (activeDatePreference === 'Yarın' ? '18 Kasım 2026' : '19 Kasım 2026')
    };

    modalHospital.innerText = doc.hospital;
    modalClinic.innerText = doc.clinic;
    modalDoctor.innerText = `${doc.name} (${doc.room})`;
    modalDateTime.innerText = `${selectedAppointment.date} - Saat: ${time}`;

    bookingModal.classList.add('active');
  };

  function closeModal() {
    bookingModal.classList.remove('active');
    selectedAppointment = null;
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalCancelBtn.addEventListener('click', closeModal);

  // Randevuyu Onayla
  modalConfirmBtn.addEventListener('click', () => {
    if (!selectedAppointment) return;

    // Sağ taraftaki bileti güncelle
    const ticketCard = document.getElementById('ticketCard');
    const emptyAppState = document.getElementById('emptyAppState');
    const appCount = document.getElementById('appCount');

    ticketCard.querySelector('.ticket-date').innerText = `${selectedAppointment.date} • ${selectedAppointment.time}`;
    ticketCard.querySelector('.ticket-body h4').innerText = selectedAppointment.doc.clinic;
    ticketCard.querySelector('.hospital-name').innerText = selectedAppointment.doc.hospital;
    ticketCard.querySelector('.doc-name').innerText = `👨‍⚕️ ${selectedAppointment.doc.name} (${selectedAppointment.doc.room})`;

    ticketCard.style.display = 'flex';
    emptyAppState.style.display = 'none';
    appCount.innerText = '1';

    closeModal();
    alert(`🎉 Randevunuz Başarıyla Oluşturuldu!\n\n🏥 ${selectedAppointment.doc.hospital}\n👨‍⚕️ ${selectedAppointment.doc.name}\n🕒 ${selectedAppointment.date} - ${selectedAppointment.time}\n\nBilgiler sağ taraftaki "Yaklaşan Randevularım" kartınıza eklendi.`);
  });

  // Randevu İptal Simülasyonu
  window.cancelDemoAppointment = function() {
    if (confirm('Bu randevuyu iptal etmek istediğinize emin misiniz?')) {
      document.getElementById('ticketCard').style.display = 'none';
      document.getElementById('emptyAppState').style.display = 'block';
      document.getElementById('appCount').innerText = '0';
      alert('Randevunuz iptal edildi. Boşalan saat diğer vatandaşlarımızın kullanımına açıldı.');
    }
  };

  // İlk yüklemede doktorları listele
  filterDoctors();
});