// MHRS - 81 İl ve Dinamik İlçe / Hastane / Randevu Arama Motoru
document.addEventListener('DOMContentLoaded', () => {
  const doctorList = document.getElementById('doctorList');
  const btnSearch = document.getElementById('btnSearch');
  const btnSearchText = document.getElementById('btnSearchText');
  const selectCity = document.getElementById('selectCity');
  const selectDistrict = document.getElementById('selectDistrict');
  const selectHospital = document.getElementById('selectHospital');
  const selectClinic = document.getElementById('selectClinic');
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

  // TÜRKİYE 81 İL LİSTESİ
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

  // Şehirlere Göre Gerçekçi İlçe ve Hastane Haritası
  const CITY_DATA = {
    "Mersin": {
      districts: ["Tümü", "Toroslar", "Akdeniz", "Tarsus", "Erdemli", "Silifke", "Mezitli", "Yenişehir", "Anamur", "Mut", "Bozyazı", "Aydıncık", "Çamlıyayla", "Gülnar"],
      hospitals: [
        "Tümü",
        "Mersin Şehir Eğitim ve Araştırma Hastanesi",
        "Mersin Toros Devlet Hastanesi",
        "Tarsus Devlet Hastanesi",
        "Erdemli Devlet Hastanesi",
        "Silifke Devlet Hastanesi",
        "Mersin Üniversitesi Tıp Fakültesi Hastanesi",
        "Anamur Devlet Hastanesi",
        "Mut Devlet Hastanesi"
      ]
    },
    "Adana": {
      districts: ["Tümü", "Seyhan", "Yüreğir", "Çukurova", "Sarıçam", "Ceyhan", "Kozan"],
      hospitals: [
        "Tümü",
        "Adana Şehir Eğitim ve Araştırma Hastanesi",
        "Çukurova Devlet Hastanesi",
        "Seyhan Devlet Hastanesi",
        "Ceyhan Devlet Hastanesi",
        "Çukurova Üniversitesi Balcalı Hastanesi"
      ]
    },
    "Ankara": {
      districts: ["Tümü", "Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut", "Sincan", "Altındağ"],
      hospitals: [
        "Tümü",
        "Ankara Bilkent Şehir Hastanesi",
        "Ankara Etlik Şehir Hastanesi",
        "Ankara Eğitim ve Araştırma Hastanesi",
        "Gazi Üniversitesi Tıp Fakültesi Hastanesi",
        "Hacettepe Üniversitesi Hastaneleri"
      ]
    },
    "İstanbul": {
      districts: ["Tümü", "Kadıköy", "Şişli", "Bakırköy", "Üsküdar", "Fatih", "Başakşehir", "Kartal", "Beylikdüzü"],
      hospitals: [
        "Tümü",
        "Başakşehir Çam ve Sakura Şehir Hastanesi",
        "İstanbul Haydarpaşa Numune E.A. Hastanesi",
        "İstanbul Şişli Hamidiye Etfal E.A. Hastanesi",
        "Kartal Dr. Lütfi Kırdar Şehir Hastanesi",
        "Bakırköy Dr. Sadi Konuk E.A. Hastanesi"
      ]
    },
    "İzmir": {
      districts: ["Tümü", "Konak", "Karşıyaka", "Bornova", "Buca", "Bayraklı", "Çiğli"],
      hospitals: [
        "Tümü",
        "İzmir Bayraklı Şehir Hastanesi",
        "İzmir Tepecik E.A. Hastanesi",
        "İzmir Atatürk E.A. Hastanesi",
        "Ege Üniversitesi Tıp Fakültesi Hastanesi"
      ]
    },
    "Antalya": {
      districts: ["Tümü", "Muratpaşa", "Kepez", "Konyaaltı", "Alanya", "Manavgat"],
      hospitals: [
        "Tümü",
        "Antalya Şehir Hastanesi",
        "Antalya Eğitim ve Araştırma Hastanesi",
        "Alanya Alaaddin Keykubat Üniversitesi E.A. Hastanesi",
        "Akdeniz Üniversitesi Tıp Fakültesi Hastanesi"
      ]
    }
  };

  // Zengin Doktor ve Randevu Havuzu (İllere Göre Dağıtılmış)
  const allDoctors = [
    // --- MERSİN HEKİMLERİ ---
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

    // --- ADANA HEKİMLERİ ---
    { id: 13, name: 'Prof. Dr. Tarık Yılmaz', clinic: 'Kardiyoloji', hospital: 'Adana Şehir Eğitim ve Araştırma Hastanesi', district: 'Yüreğir', city: 'Adana', room: 'Kalp Merkezi A-10', slots: ['09:00', '10:30', '13:30', '15:00'] },
    { id: 14, name: 'Uzm. Dr. Derya Korkmaz', clinic: 'Göz Hastalıkları', hospital: 'Adana Şehir Eğitim ve Araştırma Hastanesi', district: 'Yüreğir', city: 'Adana', room: 'Göz Kliniği 4', slots: ['09:20', '11:00', '14:15'] },
    { id: 15, name: 'Doç. Dr. Sinan Öztürk', clinic: 'Dahiliye (İç Hastalıkları)', hospital: 'Çukurova Devlet Hastanesi', district: 'Seyhan', city: 'Adana', room: 'Dahiliye 2', slots: ['10:00', '11:30', '14:45', '16:00'] },

    // --- ANKARA HEKİMLERİ ---
    { id: 16, name: 'Prof. Dr. Ahmet Arslan', clinic: 'Göz Hastalıkları', hospital: 'Ankara Bilkent Şehir Hastanesi', district: 'Çankaya', city: 'Ankara', room: 'Göz Hastanesi Kat 2', slots: ['09:15', '10:45', '13:30', '15:15'] },
    { id: 17, name: 'Uzm. Dr. Melis Tekin', clinic: 'Dahiliye (İç Hastalıkları)', hospital: 'Ankara Etlik Şehir Hastanesi', district: 'Keçiören', city: 'Ankara', room: 'Dahiliye Poliklinik 8', slots: ['09:00', '10:15', '11:30', '14:00'] },

    // --- İSTANBUL HEKİMLERİ ---
    { id: 18, name: 'Uzm. Dr. Koray Altun', clinic: 'Göz Hastalıkları', hospital: 'Başakşehir Çam ve Sakura Şehir Hastanesi', district: 'Başakşehir', city: 'İstanbul', room: 'Göz Polikliniği 3', slots: ['09:30', '11:00', '14:20', '15:45'] },
    { id: 19, name: 'Doç. Dr. Emre Çetin', clinic: 'Kardiyoloji', hospital: 'İstanbul Haydarpaşa Numune E.A. Hastanesi', district: 'Kadıköy', city: 'İstanbul', room: 'Poliklinik B-204', slots: ['10:00', '11:15', '14:00'] },

    // --- DİĞER İLLER İÇİN JENERİK DOKTOR ÜRETİCİ ---
    { id: 20, name: 'Uzm. Dr. Kemal Vural', clinic: 'Dahiliye (İç Hastalıkları)', hospital: 'Antalya Şehir Hastanesi', district: 'Kepez', city: 'Antalya', room: 'Poliklinik 4', slots: ['09:00', '10:30', '14:15'] },
    { id: 21, name: 'Doç. Dr. Ozan Kurt', clinic: 'Ortopedi ve Travmatoloji', hospital: 'İzmir Bayraklı Şehir Hastanesi', district: 'Bayraklı', city: 'İzmir', room: 'Ortopedi 1', slots: ['09:30', '11:00', '15:00'] }
  ];

  // 1. 81 İli Doldur
  function populateCities() {
    selectCity.innerHTML = '';
    CITIES_81.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.innerText = city;
      if (city === 'Mersin') opt.selected = true; // Varsayılan örnek olarak Mersin seçili
      selectCity.appendChild(opt);
    });
  }

  // 2. Seçilen İle Göre İlçe ve Hastaneleri Güncelle
  function updateDistrictsAndHospitals() {
    const selectedCity = selectCity.value;
    const data = CITY_DATA[selectedCity] || {
      districts: ["Tümü", "Merkez", "1. Bölge", "2. Bölge"],
      hospitals: ["Tümü", `${selectedCity} Devlet Hastanesi`, `${selectedCity} Eğitim ve Araştırma Hastanesi`]
    };

    // İlçeleri doldur
    selectDistrict.innerHTML = '';
    data.districts.forEach(dist => {
      const opt = document.createElement('option');
      opt.value = dist;
      opt.innerText = dist === 'Tümü' ? `Tüm ${selectedCity} (Fark Etmez)` : dist;
      selectDistrict.appendChild(opt);
    });

    // Hastaneleri doldur
    selectHospital.innerHTML = '';
    data.hospitals.forEach(hosp => {
      const opt = document.createElement('option');
      opt.value = hosp;
      opt.innerText = hosp === 'Tümü' ? `Fark Etmez (Tüm Hastaneler)` : hosp;
      selectHospital.appendChild(opt);
    });

    // Buton metnini dinamik güncelle: "Adana Genelinde Randevu Ara", "Mersin Genelinde Randevu Ara"
    btnSearchText.innerText = `${selectedCity} İçin Randevu Ara`;
  }

  // 3. Tarih Butonları
  dateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dateChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeDatePreference = chip.dataset.date;
      performFilter();
    });
  });

  // 4. Dinleyiciler
  selectCity.addEventListener('change', () => {
    updateDistrictsAndHospitals();
    performFilter();
  });
  selectDistrict.addEventListener('change', performFilter);
  selectHospital.addEventListener('change', performFilter);
  selectClinic.addEventListener('change', performFilter);
  liveSearchInput.addEventListener('input', performFilter);
  btnSearch.addEventListener('click', performFilter);

  // 5. Akıllı Arama & Filtreleme Motoru
  function performFilter() {
    const currentCity = selectCity.value;
    const selectedDist = selectDistrict.value;
    const selectedHosp = selectHospital.value;
    const selectedClin = selectClinic.value;
    const query = liveSearchInput.value.toLowerCase().trim();

    // Filtreleme
    let filtered = allDoctors.filter(doc => {
      // İl Eşleşmesi
      const matchCity = doc.city === currentCity;
      if (!matchCity) return false;

      // İlçe
      const matchDistrict = (selectedDist === 'Tümü') || (doc.district === selectedDist);

      // Hastane
      const matchHospital = (selectedHosp === 'Tümü') || (doc.hospital === selectedHosp);

      // Branş
      const matchClinic = (selectedClin === 'Tümü') || (doc.clinic === selectedClin);

      // Canlı Arama (Doktor adı, klinik, hastane, ilçe vb.)
      const textToSearch = `${doc.name} ${doc.hospital} ${doc.clinic} ${doc.district} ${doc.room}`.toLowerCase();
      const matchQuery = !query || textToSearch.includes(query);

      return matchDistrict && matchHospital && matchClinic && matchQuery;
    });

    // Eğer o ilde henüz statik hekim eklenmemişse dinamik prototip doktor üret (böylece 81 ilin hepsi çalışır)
    if (filtered.length === 0 && (selectedDist === 'Tümü' || !selectedDist)) {
      filtered = generateCityFallbackDoctors(currentCity, selectedClin);
    }

    renderDoctors(filtered, currentCity);
  }

  // Diğer 81 il seçildiğinde kullanıcının boş ekran görmemesi için gerçekçi simülatör
  function generateCityFallbackDoctors(city, clinicChoice) {
    const clinic = clinicChoice === 'Tümü' ? 'Dahiliye (İç Hastalıkları)' : clinicChoice;
    return [
      {
        id: 991,
        name: `Uzm. Dr. Ahmet ${city}li`,
        clinic: clinic,
        hospital: `${city} Devlet Hastanesi`,
        district: 'Merkez',
        city: city,
        room: 'Poliklinik 2',
        slots: ['09:15', '10:00', '11:30', '14:15', '15:45']
      },
      {
        id: 992,
        name: `Op. Dr. Merve Kaya`,
        clinic: clinicChoice === 'Tümü' ? 'Göz Hastalıkları' : clinicChoice,
        hospital: `${city} Eğitim ve Araştırma Hastanesi`,
        district: 'Merkez',
        city: city,
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
          <b style="color:#192e27; font-size:1rem;">Seçilen kriterlere uygun randevu bulunamadı.</b>
          <p style="font-size:0.82rem; margin-top:6px; color:#7b998f;">
            Filtreleri "Tümü" olarak seçerek ${cityName} genelindeki diğer poliklinikleri görebilirsiniz.
          </p>
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

  // Randevuyu Onayla
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

  // Randevu İptal Simülasyonu
  window.cancelDemoAppointment = function() {
    if (confirm('Bu randevuyu iptal etmek istediğinize emin misiniz?')) {
      document.getElementById('ticketCard').style.display = 'none';
      document.getElementById('emptyAppState').style.display = 'block';
      document.getElementById('appCount').innerText = '0';
      alert('Randevunuz iptal edildi. Boşalan saat diğer vatandaşlarımızın kullanımına açıldı.');
    }
  };

  // Başlangıç: 81 İli kur, ilçeleri bağla ve ilk aramayı yap
  populateCities();
  updateDistrictsAndHospitals();
  performFilter();
});