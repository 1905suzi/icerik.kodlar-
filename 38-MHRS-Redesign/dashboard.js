// MHRS - Özel Arama & Seçim (Custom Searchable Dropdown) Motoru
document.addEventListener('DOMContentLoaded', () => {
  const doctorList = document.getElementById('doctorList');
  const btnSearch = document.getElementById('btnSearch');
  const btnSearchText = document.getElementById('btnSearchText');
  const liveSearchInput = document.getElementById('liveSearchInput');
  const dateChips = document.querySelectorAll('.date-chip');
  const resultsTitle = document.getElementById('resultsTitle');

  // Input ve Dropdown Grupları
  const groupCity = document.getElementById('groupCity');
  const inputCity = document.getElementById('inputCity');
  const dropCity = document.getElementById('dropCity');

  const groupDistrict = document.getElementById('groupDistrict');
  const inputDistrict = document.getElementById('inputDistrict');
  const dropDistrict = document.getElementById('dropDistrict');

  const groupHospital = document.getElementById('groupHospital');
  const inputHospital = document.getElementById('inputHospital');
  const dropHospital = document.getElementById('dropHospital');

  const groupClinic = document.getElementById('groupClinic');
  const inputClinic = document.getElementById('inputClinic');
  const dropClinic = document.getElementById('dropClinic');

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

  // 81 İL LİSTESİ
  const CITIES_81 = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
    "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
    "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
    "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
    "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
    "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
    "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
    "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
  ];

  // KLİNİK LİSTESİ
  const CLINICS = [
    "Tüm Branşlar",
    "Göz Hastalıkları",
    "Dahiliye (İç Hastalıkları)",
    "Kardiyoloji",
    "Kulak Burun Boğaz (KBB)",
    "Ortopedi ve Travmatoloji",
    "Cildiye (Dermatoloji)",
    "Nöroloji",
    "Çocuk Sağlığı ve Hastalıkları",
    "Genel Cerrahi",
    "Kadın Hastalıkları ve Doğum",
    "Üroloji"
  ];

  // İL VE İLÇE/HASTANE VERİTABANI
  const CITY_DATA = {
    "Mersin": {
      districts: ["Tüm İlçeler (Fark Etmez)", "Toroslar", "Akdeniz", "Tarsus", "Erdemli", "Silifke", "Mezitli", "Yenişehir", "Anamur", "Mut"],
      hospitals: [
        "Tüm Hastaneler (Fark Etmez)",
        "Mersin Şehir Eğitim ve Araştırma Hastanesi",
        "Mersin Toros Devlet Hastanesi",
        "Tarsus Devlet Hastanesi",
        "Erdemli Devlet Hastanesi",
        "Silifke Devlet Hastanesi",
        "Mersin Üniversitesi Tıp Fakültesi Hastanesi"
      ]
    },
    "Bolu": {
      districts: ["Tüm İlçeler (Fark Etmez)", "Merkez", "Gerede", "Mengen", "Göynük", "Mudurnu"],
      hospitals: [
        "Tüm Hastaneler (Fark Etmez)",
        "Bolu İzzet Baysal Devlet Hastanesi",
        "Bolu Abant İzzet Baysal Üniversitesi E.A. Hastanesi",
        "Gerede Devlet Hastanesi"
      ]
    },
    "Adana": {
      districts: ["Tüm İlçeler (Fark Etmez)", "Seyhan", "Yüreğir", "Çukurova", "Sarıçam", "Ceyhan"],
      hospitals: [
        "Tüm Hastaneler (Fark Etmez)",
        "Adana Şehir Eğitim ve Araştırma Hastanesi",
        "Çukurova Devlet Hastanesi",
        "Seyhan Devlet Hastanesi"
      ]
    },
    "Ankara": {
      districts: ["Tüm İlçeler (Fark Etmez)", "Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Altındağ"],
      hospitals: [
        "Tüm Hastaneler (Fark Etmez)",
        "Ankara Bilkent Şehir Hastanesi",
        "Ankara Etlik Şehir Hastanesi",
        "Gazi Üniversitesi Tıp Fakültesi Hastanesi"
      ]
    },
    "İstanbul": {
      districts: ["Tüm İlçeler (Fark Etmez)", "Kadıköy", "Şişli", "Bakırköy", "Üsküdar", "Başakşehir"],
      hospitals: [
        "Tüm Hastaneler (Fark Etmez)",
        "Başakşehir Çam ve Sakura Şehir Hastanesi",
        "İstanbul Haydarpaşa Numune E.A. Hastanesi",
        "İstanbul Şişli Hamidiye Etfal E.A. Hastanesi"
      ]
    }
  };

  // DOKTOR VERİTABANI
  const allDoctors = [
    // Mersin
    { id: 1, name: 'Doç. Dr. Caner Yıldız', clinic: 'Göz Hastalıkları', hospital: 'Mersin Şehir Eğitim ve Araştırma Hastanesi', district: 'Toroslar', city: 'Mersin', room: 'B Blok Zemin Kat - Göz 2', slots: ['09:10', '09:40', '10:20', '11:15', '14:00', '15:30'] },
    { id: 2, name: 'Uzm. Dr. Elif Aksoy', clinic: 'Göz Hastalıkları', hospital: 'Mersin Şehir Eğitim ve Araştırma Hastanesi', district: 'Toroslar', city: 'Mersin', room: 'B Blok 1. Kat - Poliklinik 5', slots: ['10:00', '10:30', '11:45', '13:50', '16:15'] },
    { id: 3, name: 'Prof. Dr. Hakan Özdemir', clinic: 'Kardiyoloji', hospital: 'Mersin Şehir Eğitim ve Araştırma Hastanesi', district: 'Toroslar', city: 'Mersin', room: 'Kalp Damar Merkezi - Oda 1', slots: ['09:30', '11:00', '14:15', '15:45'] },
    { id: 4, name: 'Uzm. Dr. Ayşe Gökçen', clinic: 'Dahiliye (İç Hastalıkları)', hospital: 'Mersin Şehir Eğitim ve Araştırma Hastanesi', district: 'Toroslar', city: 'Mersin', room: 'Dahiliye Kliniği - Oda 12', slots: ['08:45', '09:15', '10:45', '14:30', '16:00'] },
    { id: 5, name: 'Op. Dr. Serkan Bulut', clinic: 'Kulak Burun Boğaz (KBB)', hospital: 'Mersin Toros Devlet Hastanesi', district: 'Akdeniz', city: 'Mersin', room: 'Ana Bina - KBB Poliklinik 4', slots: ['09:15', '10:30', '11:15', '13:45'] },
    { id: 6, name: 'Uzm. Dr. Mehmet Fatih Çelik', clinic: 'Dahiliye (İç Hastalıkları)', hospital: 'Mersin Toros Devlet Hastanesi', district: 'Akdeniz', city: 'Mersin', room: 'Zemin Kat - Dahiliye 3', slots: ['09:00', '10:15', '11:30', '14:00', '15:15'] },
    { id: 7, name: 'Op. Dr. Burak Sezgin', clinic: 'Ortopedi ve Travmatoloji', hospital: 'Mersin Toros Devlet Hastanesi', district: 'Akdeniz', city: 'Mersin', room: 'Ortopedi Polikliniği 2', slots: ['10:00', '11:20', '14:40'] },
    { id: 8, name: 'Uzm. Dr. Zeynep Karaca', clinic: 'Cildiye (Dermatoloji)', hospital: 'Tarsus Devlet Hastanesi', district: 'Tarsus', city: 'Mersin', room: 'Hizmet Binası 2. Kat', slots: ['09:20', '10:00', '11:40', '14:20'] },
    { id: 9, name: 'Op. Dr. Ali Kemal Taş', clinic: 'Göz Hastalıkları', hospital: 'Tarsus Devlet Hastanesi', district: 'Tarsus', city: 'Mersin', room: 'Göz Polikliniği 1', slots: ['08:50', '09:30', '11:10', '15:00'] },
    { id: 10, name: 'Uzm. Dr. Fatma Şen', clinic: 'Nöroloji', hospital: 'Erdemli Devlet Hastanesi', district: 'Erdemli', city: 'Mersin', room: 'Zemin Kat - Nöroloji 1', slots: ['09:30', '10:45', '14:00', '15:30'] },
    { id: 11, name: 'Op. Dr. Barış Güler', clinic: 'Genel Cerrahi', hospital: 'Silifke Devlet Hastanesi', district: 'Silifke', city: 'Mersin', room: 'Cerrahi Polikliniği 2', slots: ['09:40', '11:15', '13:50'] },
    { id: 12, name: 'Prof. Dr. Selin Doğan', clinic: 'Göz Hastalıkları', hospital: 'Mersin Üniversitesi Tıp Fakültesi Hastanesi', district: 'Mezitli', city: 'Mersin', room: 'Çiftlikköy Kampüsü - Göz', slots: ['10:00', '11:30', '14:00', '15:00'] },

    // Bolu
    { id: 25, name: 'Doç. Dr. Selim Bolat', clinic: 'Dahiliye (İç Hastalıkları)', hospital: 'Bolu İzzet Baysal Devlet Hastanesi', district: 'Merkez', city: 'Bolu', room: 'Ana Bina Kat 1 - Dahiliye 2', slots: ['09:00', '10:30', '11:15', '14:00', '15:30'] },
    { id: 26, name: 'Uzm. Dr. Esra Yılmaz', clinic: 'Göz Hastalıkları', hospital: 'Bolu Abant İzzet Baysal Üniversitesi E.A. Hastanesi', district: 'Merkez', city: 'Bolu', room: 'Göz Polikliniği 3', slots: ['09:45', '11:00', '13:45', '16:00'] },
    { id: 27, name: 'Op. Dr. Kaan Özcan', clinic: 'Ortopedi ve Travmatoloji', hospital: 'Bolu İzzet Baysal Devlet Hastanesi', district: 'Merkez', city: 'Bolu', room: 'Poliklinik 5', slots: ['10:15', '11:30', '14:30'] },

    // Adana
    { id: 13, name: 'Prof. Dr. Tarık Yılmaz', clinic: 'Kardiyoloji', hospital: 'Adana Şehir Eğitim ve Araştırma Hastanesi', district: 'Yüreğir', city: 'Adana', room: 'Kalp Merkezi A-10', slots: ['09:00', '10:30', '13:30', '15:00'] },
    { id: 14, name: 'Uzm. Dr. Derya Korkmaz', clinic: 'Göz Hastalıkları', hospital: 'Adana Şehir Eğitim ve Araştırma Hastanesi', district: 'Yüreğir', city: 'Adana', room: 'Göz Kliniği 4', slots: ['09:20', '11:00', '14:15'] }
  ];

  // ==========================================================
  // ÖZEL DROPDOWN KURULUM VE YÖNETİMİ
  // ==========================================================

  function setupCustomSelect(groupEl, inputEl, dropEl, getItemsFn, onSelectFn) {
    function renderList(query = '') {
      const allItems = getItemsFn();
      const q = query.toLowerCase().trim();
      const filtered = q ? allItems.filter(item => item.toLowerCase().includes(q)) : allItems;

      dropEl.innerHTML = '';
      if (filtered.length === 0) {
        dropEl.innerHTML = '<div class="cs-empty">Sonuç bulunamadı</div>';
        return;
      }

      filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cs-item' + (inputEl.value === item ? ' selected' : '');
        div.innerText = item;
        div.addEventListener('click', (e) => {
          e.stopPropagation();
          inputEl.value = item;
          closeAllDropdowns();
          if (onSelectFn) onSelectFn(item);
        });
        dropEl.appendChild(div);
      });
    }

    // Tıklayınca Aç / Kapat
    inputEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = groupEl.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) {
        groupEl.classList.add('open');
        renderList(''); // Tıklayınca tüm listeyi açar!
      }
    });

    // Yazarken Filtrele
    inputEl.addEventListener('input', () => {
      if (!groupEl.classList.contains('open')) {
        groupEl.classList.add('open');
      }
      renderList(inputEl.value);
      if (onSelectFn) onSelectFn(inputEl.value);
    });
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.custom-select-group').forEach(g => g.classList.remove('open'));
  }

  // Dışarı tıklayınca tüm açılır menüleri kapat
  document.addEventListener('click', closeAllDropdowns);

  // 1. Şehir Dropdown
  setupCustomSelect(groupCity, inputCity, dropCity, () => CITIES_81, (selectedCity) => {
    // Şehir değişince ilçe ve hastaneyi sıfırla/güncelle
    inputDistrict.value = '';
    inputHospital.value = '';
    btnSearchText.innerText = `${selectedCity || 'Mersin'} İçin Randevu Ara`;
    performFilter();
  });

  // 2. İlçe Dropdown
  setupCustomSelect(groupDistrict, inputDistrict, dropDistrict, () => {
    const curCity = inputCity.value.trim() || 'Mersin';
    const data = CITY_DATA[curCity] || { districts: ["Tüm İlçeler (Fark Etmez)", "Merkez", "1. Bölge"] };
    return data.districts;
  }, () => performFilter());

  // 3. Hastane Dropdown
  setupCustomSelect(groupHospital, inputHospital, dropHospital, () => {
    const curCity = inputCity.value.trim() || 'Mersin';
    const data = CITY_DATA[curCity] || { hospitals: ["Tüm Hastaneler (Fark Etmez)", `${curCity} Devlet Hastanesi`] };
    return data.hospitals;
  }, () => performFilter());

  // 4. Klinik Dropdown
  setupCustomSelect(groupClinic, inputClinic, dropClinic, () => CLINICS, () => performFilter());

  // Canlı Arama Inputu
  liveSearchInput.addEventListener('input', performFilter);
  btnSearch.addEventListener('click', performFilter);

  // Tarih Butonları
  dateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dateChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeDatePreference = chip.dataset.date;
      performFilter();
    });
  });

  // FİLTRELEME & LİSTELEME
  function performFilter() {
    const curCity = inputCity.value.trim().toLowerCase();
    const curDist = inputDistrict.value.trim().toLowerCase();
    const curHosp = inputHospital.value.trim().toLowerCase();
    const curClin = inputClinic.value.trim().toLowerCase();
    const searchQ = liveSearchInput.value.trim().toLowerCase();

    const matchedCityExact = CITIES_81.find(c => c.toLowerCase() === curCity) || (inputCity.value.trim() || 'Mersin');

    let filtered = allDoctors.filter(doc => {
      const matchCity = !curCity || doc.city.toLowerCase().includes(curCity) || curCity.includes(doc.city.toLowerCase());
      if (!matchCity) return false;

      const matchDist = !curDist || curDist.includes('tüm') || doc.district.toLowerCase().includes(curDist);
      const matchHosp = !curHosp || curHosp.includes('tüm') || doc.hospital.toLowerCase().includes(curHosp);
      const matchClin = !curClin || curClin.includes('tüm') || doc.clinic.toLowerCase().includes(curClin);

      const allText = `${doc.name} ${doc.hospital} ${doc.clinic} ${doc.district} ${doc.room}`.toLowerCase();
      const matchSearch = !searchQ || allText.includes(searchQ);

      return matchDist && matchHosp && matchClin && matchSearch;
    });

    if (filtered.length === 0 && curCity) {
      filtered = generateFallbackDoctors(matchedCityExact, inputClinic.value.trim());
    }

    renderDoctors(filtered, matchedCityExact);
  }

  function generateFallbackDoctors(cityName, clinicChoice) {
    const clinic = (!clinicChoice || clinicChoice.toLowerCase().includes('tüm')) ? 'Dahiliye (İç Hastalıkları)' : clinicChoice;
    return [
      {
        id: 881,
        name: `Uzm. Dr. Selim ${cityName}li`,
        clinic: clinic,
        hospital: `${cityName} Devlet Hastanesi`,
        district: 'Merkez',
        city: cityName,
        room: 'Zemin Kat - Dahiliye 2',
        slots: ['09:15', '10:00', '11:30', '14:15', '15:45']
      },
      {
        id: 882,
        name: `Op. Dr. Merve Kaya`,
        clinic: (!clinicChoice || clinicChoice.toLowerCase().includes('tüm')) ? 'Göz Hastalıkları' : clinicChoice,
        hospital: `${cityName} Eğitim ve Araştırma Hastanesi`,
        district: 'Merkez',
        city: cityName,
        room: 'Göz Polikliniği 1',
        slots: ['09:45', '10:30', '13:50', '16:00']
      }
    ];
  }

  function renderDoctors(doctors, cityName) {
    doctorList.innerHTML = '';
    resultsTitle.innerText = `${cityName} İçin Uygun Randevular (${doctors.length} Hekim Bulundu)`;

    if (doctors.length === 0) {
      doctorList.innerHTML = `
        <div style="text-align:center; padding:36px 20px; color:#4e6b62; background:#fafdfc; border-radius:16px; border:1px solid #e2ede8;">
          <p style="font-size:1.8rem; margin-bottom:8px;">🔍</p>
          <b style="color:#192e27; font-size:1rem;">Arama kriterlerine uygun hekim bulunamadı.</b>
        </div>`;
      return;
    }

    doctors.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'doc-card';

      const slotsHtml = doc.slots.map(time => `
        <button class="slot-btn" onclick="openBookingModal('${doc.id}', '${time}', '${doc.name}', '${doc.hospital}', '${doc.clinic}', '${doc.room}')">${time}</button>
      `).join('');

      card.innerHTML = `
        <div class="doc-header">
          <div class="doc-info">
            <h4>${doc.name}</h4>
            <p>${doc.hospital} • <b>${doc.district} / ${doc.city}</b></p>
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
  window.openBookingModal = function(docId, time, docName, hospital, clinic, room) {
    selectedAppointment = {
      name: docName,
      hospital: hospital,
      clinic: clinic,
      room: room,
      time: time,
      date: activeDatePreference === 'Bugün' ? '17 Kasım 2026' : (activeDatePreference === 'Yarın' ? '18 Kasım 2026' : '19 Kasım 2026')
    };

    modalHospital.innerText = selectedAppointment.hospital;
    modalClinic.innerText = selectedAppointment.clinic;
    modalDoctor.innerText = `${selectedAppointment.name} (${selectedAppointment.room})`;
    modalDateTime.innerText = `${selectedAppointment.date} - Saat: ${time}`;

    bookingModal.classList.add('active');
  };

  function closeModal() {
    bookingModal.classList.remove('active');
    selectedAppointment = null;
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalCancelBtn.addEventListener('click', closeModal);

  modalConfirmBtn.addEventListener('click', () => {
    if (!selectedAppointment) return;

    const ticketCard = document.getElementById('ticketCard');
    const emptyAppState = document.getElementById('emptyAppState');
    const appCount = document.getElementById('appCount');

    ticketCard.querySelector('.ticket-date').innerText = `${selectedAppointment.date} • ${selectedAppointment.time}`;
    ticketCard.querySelector('.ticket-body h4').innerText = selectedAppointment.clinic;
    ticketCard.querySelector('.hospital-name').innerText = selectedAppointment.hospital;
    ticketCard.querySelector('.doc-name').innerText = `👨‍⚕️ ${selectedAppointment.name}`;

    ticketCard.style.display = 'flex';
    emptyAppState.style.display = 'none';
    appCount.innerText = '1';

    closeModal();
    alert(`🎉 Randevunuz Başarıyla Alındı!\n\n🏥 ${selectedAppointment.hospital}\n👨‍⚕️ ${selectedAppointment.name}\n🕒 ${selectedAppointment.date} - ${selectedAppointment.time}\n\nRandevu onayınız sağ taraftaki biletinize kaydedildi.`);
  });

  window.cancelDemoAppointment = function() {
    if (confirm('Bu randevuyu iptal etmek istediğinize emin misiniz?')) {
      document.getElementById('ticketCard').style.display = 'none';
      document.getElementById('emptyAppState').style.display = 'block';
      document.getElementById('appCount').innerText = '0';
      alert('Randevunuz iptal edildi. Boşalan saat diğer vatandaşlarımızın kullanımına açıldı.');
    }
  };

  performFilter();
});