// Mersin İli Gerçek Hastane ve Hekim Veritabanı (MHRS Redesign)
document.addEventListener('DOMContentLoaded', () => {
  const doctorList = document.getElementById('doctorList');
  const btnSearch = document.getElementById('btnSearch');
  const selectClinic = document.getElementById('selectClinic');
  const selectDistrict = document.getElementById('selectDistrict');
  const selectHospital = document.getElementById('selectHospital');
  const selectCity = document.getElementById('selectCity');
  const liveSearchInput = document.getElementById('liveSearchInput');
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

  // MERSİN İLİ GERÇEK HASTANELERİ VE DOKTORLARI
  const mersinDoctors = [
    // 1. Mersin Şehir Hastanesi (Toroslar)
    {
      id: 1,
      name: 'Doç. Dr. Caner Yıldız',
      clinic: 'Göz Hastalıkları',
      hospital: 'Mersin Şehir Eğitim ve Araştırma Hastanesi',
      district: 'Toroslar',
      room: 'Ana Bina B Blok Zemin Kat - Göz Polikliniği 2',
      slots: ['09:10', '09:40', '10:20', '11:15', '14:00', '15:30']
    },
    {
      id: 2,
      name: 'Uzm. Dr. Elif Aksoy',
      clinic: 'Göz Hastalıkları',
      hospital: 'Mersin Şehir Eğitim ve Araştırma Hastanesi',
      district: 'Toroslar',
      room: 'B Blok 1. Kat - Poliklinik 5',
      slots: ['10:00', '10:30', '11:45', '13:50', '16:15']
    },
    {
      id: 3,
      name: 'Prof. Dr. Hakan Özdemir',
      clinic: 'Kardiyoloji',
      hospital: 'Mersin Şehir Eğitim ve Araştırma Hastanesi',
      district: 'Toroslar',
      room: 'Kalp Damar Merkezi - Poliklinik 1',
      slots: ['09:30', '11:00', '14:15', '15:45']
    },
    {
      id: 4,
      name: 'Uzm. Dr. Ayşe Gökçen',
      clinic: 'Dahiliye (İç Hastalıkları)',
      hospital: 'Mersin Şehir Eğitim ve Araştırma Hastanesi',
      district: 'Toroslar',
      room: 'Dahiliye Kliniği - Oda 12',
      slots: ['08:45', '09:15', '10:45', '14:30', '16:00']
    },

    // 2. Mersin Toros Devlet Hastanesi (Akdeniz)
    {
      id: 5,
      name: 'Op. Dr. Serkan Bulut',
      clinic: 'Kulak Burun Boğaz (KBB)',
      hospital: 'Mersin Toros Devlet Hastanesi',
      district: 'Akdeniz',
      room: 'Poliklinik B-04 (Ana Bina)',
      slots: ['09:15', '10:30', '11:15', '13:45']
    },
    {
      id: 6,
      name: 'Uzm. Dr. Mehmet Fatih Çelik',
      clinic: 'Dahiliye (İç Hastalıkları)',
      hospital: 'Mersin Toros Devlet Hastanesi',
      district: 'Akdeniz',
      room: 'Zemin Kat - Dahiliye 3',
      slots: ['09:00', '10:15', '11:30', '14:00', '15:15']
    },
    {
      id: 7,
      name: 'Op. Dr. Burak Sezgin',
      clinic: 'Ortopedi ve Travmatoloji',
      hospital: 'Mersin Toros Devlet Hastanesi',
      district: 'Akdeniz',
      room: 'Ortopedi Polikliniği 2',
      slots: ['10:00', '11:20', '14:40']
    },

    // 3. Tarsus Devlet Hastanesi (Tarsus)
    {
      id: 8,
      name: 'Uzm. Dr. Zeynep Karaca',
      clinic: 'Cildiye (Dermatoloji)',
      hospital: 'Tarsus Devlet Hastanesi',
      district: 'Tarsus',
      room: 'Yeni Hizmet Binası 2. Kat',
      slots: ['09:20', '10:00', '11:40', '14:20']
    },
    {
      id: 9,
      name: 'Op. Dr. Ali Kemal Taş',
      clinic: 'Göz Hastalıkları',
      hospital: 'Tarsus Devlet Hastanesi',
      district: 'Tarsus',
      room: 'Göz Polikliniği 1',
      slots: ['08:50', '09:30', '11:10', '15:00']
    },
    {
      id: 10,
      name: 'Uzm. Dr. Murat Yılmaz',
      clinic: 'Ortopedi ve Travmatoloji',
      hospital: 'Tarsus Devlet Hastanesi',
      district: 'Tarsus',
      room: 'Poliklinik 7',
      slots: ['10:15', '11:00', '13:30', '16:00']
    },

    // 4. Erdemli Devlet Hastanesi (Erdemli)
    {
      id: 11,
      name: 'Uzm. Dr. Fatma Şen',
      clinic: 'Nöroloji',
      hospital: 'Erdemli Devlet Hastanesi',
      district: 'Erdemli',
      room: 'Zemin Kat - Nöroloji 1',
      slots: ['09:30', '10:45', '14:00', '15:30']
    },
    {
      id: 12,
      name: 'Uzm. Dr. Emre Koç',
      clinic: 'Çocuk Sağlığı ve Hastalıkları',
      hospital: 'Erdemli Devlet Hastanesi',
      district: 'Erdemli',
      room: 'Çocuk Polikliniği 3',
      slots: ['09:00', '10:30', '11:30', '14:15']
    },

    // 5. Silifke Devlet Hastanesi (Silifke)
    {
      id: 13,
      name: 'Op. Dr. Barış Güler',
      clinic: 'Genel Cerrahi',
      hospital: 'Silifke Devlet Hastanesi',
      district: 'Silifke',
      room: 'Cerrahi Polikliniği 2',
      slots: ['09:40', '11:15', '13:50']
    },
    {
      id: 14,
      name: 'Uzm. Dr. Kemal Vural',
      clinic: 'Dahiliye (İç Hastalıkları)',
      hospital: 'Silifke Devlet Hastanesi',
      district: 'Silifke',
      room: 'Dahiliye 1',
      slots: ['10:10', '11:00', '14:30', '15:45']
    },

    // 6. Mersin Üniversitesi Tıp Fakültesi (Mezitli / Yenişehir)
    {
      id: 15,
      name: 'Prof. Dr. Selin Doğan',
      clinic: 'Göz Hastalıkları',
      hospital: 'Mersin Üniversitesi Tıp Fakültesi Hastanesi',
      district: 'Mezitli',
      room: 'Üniversite Hastanesi Çiftlikköy Kampüsü - Göz Kliniği',
      slots: ['10:00', '11:30', '14:00', '15:00']
    },
    {
      id: 16,
      name: 'Doç. Dr. Ozan Kurt',
      clinic: 'Kardiyoloji',
      hospital: 'Mersin Üniversitesi Tıp Fakültesi Hastanesi',
      district: 'Yenişehir',
      room: 'Poliklinik Binası Kat 2',
      slots: ['09:15', '11:00', '14:30']
    }
  ];

  // Tarih Butonları Etkileşimi
  dateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dateChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeDatePreference = chip.dataset.date;
      performFilter();
    });
  });

  // Filtreleme Dinleyicileri
  btnSearch.addEventListener('click', performFilter);
  selectDistrict.addEventListener('change', performFilter);
  selectHospital.addEventListener('change', performFilter);
  selectClinic.addEventListener('change', performFilter);
  liveSearchInput.addEventListener('input', performFilter);

  // Akıllı Arama & Filtreleme Motoru
  function performFilter() {
    const selectedDist = selectDistrict.value;
    const selectedHosp = selectHospital.value;
    const selectedClin = selectClinic.value;
    const query = liveSearchInput.value.toLowerCase().trim();

    const filtered = mersinDoctors.filter(doc => {
      // 1. İlçe Kontrolü
      const matchDistrict = (selectedDist === 'Tümü') || (doc.district === selectedDist);

      // 2. Hastane Kontrolü
      const matchHospital = (selectedHosp === 'Tümü') || (doc.hospital === selectedHosp);

      // 3. Branş Kontrolü
      const matchClinic = (selectedClin === 'Tümü') || (doc.clinic === selectedClin);

      // 4. Canlı Metin Araması (Doktor adı, klinik adı, hastane adı, oda)
      const textToSearch = `${doc.name} ${doc.hospital} ${doc.clinic} ${doc.district} ${doc.room}`.toLowerCase();
      const matchQuery = !query || textToSearch.includes(query);

      return matchDistrict && matchHospital && matchClinic && matchQuery;
    });

    renderDoctors(filtered);
  }

  function renderDoctors(doctors) {
    doctorList.innerHTML = '';
    resultsTitle.innerText = `Mersin İçin Uygun Randevular (${doctors.length} Hekim Bulundu)`;

    if (doctors.length === 0) {
      doctorList.innerHTML = `
        <div style="text-align:center; padding:36px 20px; color:#4e6b62; background:#fafdfc; border-radius:16px; border:1px solid #e2ede8;">
          <p style="font-size:1.8rem; margin-bottom:8px;">🔍</p>
          <b style="color:#192e27; font-size:1rem;">Aradığınız kriterlere uygun randevu bulunamadı.</b>
          <p style="font-size:0.82rem; margin-top:6px; color:#7b998f;">
            Filtreleri "Tümü" olarak değiştirerek Mersin genelindeki diğer hastaneleri listeleyebilirsiniz.
          </p>
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
            <p>${doc.hospital} • <b>${doc.district}</b></p>
            <small style="color:#7b998f; font-size:0.75rem; display:block; margin-top:2px;">📍 ${doc.room}</small>
          </div>
          <span class="hospital-badge">${doc.clinic}</span>
        </div>
        <div class="slots-container">
          <span class="slots-title">📅 ${activeDatePreference} İçin Boş Saatler:</span>
          <div class="slots-grid">
            ${slotsHtml}
          </div>
        </div>
      `;

      doctorList.appendChild(card);
    });
  }

  // Randevu Onay Modalı
  window.openBookingModal = function(docId, time) {
    const doc = mersinDoctors.find(d => d.id == docId);
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
    ticketCard.querySelector('.doc-name').innerText = `👨‍⚕️ ${selectedAppointment.doc.name} (${selectedAppointment.doc.district})`;

    ticketCard.style.display = 'flex';
    emptyAppState.style.display = 'none';
    appCount.innerText = '1';

    closeModal();
    alert(`🎉 Randevunuz Başarıyla Alındı!\n\n🏥 ${selectedAppointment.doc.hospital}\n👨‍⚕️ ${selectedAppointment.doc.name}\n🕒 ${selectedAppointment.date} - ${selectedAppointment.time}\n\nRandevu onayınız sağ taraftaki biletinize kaydedildi.`);
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

  // İlk açılışta Mersin randevularını getir
  performFilter();
});