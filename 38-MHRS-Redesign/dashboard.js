// MHRS - Yazarak & Seçerek Arama Destekli Akıllı Randevu Motoru
document.addEventListener('DOMContentLoaded', () => {
  const doctorList = document.getElementById('doctorList');
  const btnSearch = document.getElementById('btnSearch');
  const btnSearchText = document.getElementById('btnSearchText');
  const inputCity = document.getElementById('inputCity');
  const cityList = document.getElementById('cityList');
  const inputDistrict = document.getElementById('inputDistrict');
  const districtList = document.getElementById('districtList');
  const inputHospital = document.getElementById('inputHospital');
  const hospitalList = document.getElementById('hospitalList');
  const inputClinic = document.getElementById('inputClinic');
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

  const CITY_DATA = {
    "Mersin": {
      districts: ["Toroslar", "Akdeniz", "Tarsus", "Erdemli", "Silifke", "Mezitli", "Yenişehir", "Anamur", "Mut"],
      hospitals: [
        "Mersin Şehir Eğitim ve Araştırma Hastanesi",
        "Mersin Toros Devlet Hastanesi",
        "Tarsus Devlet Hastanesi",
        "Erdemli Devlet Hastanesi",
        "Silifke Devlet Hastanesi",
        "Mersin Üniversitesi Tıp Fakültesi Hastanesi"
      ]
    },
    "Bolu": {
      districts: ["Merkez", "Gerede", "Mengen", "Göynük", "Mudurnu"],
      hospitals: [
        "Bolu İzzet Baysal Devlet Hastanesi",
        "Bolu Abant İzzet Baysal Üniversitesi E.A. Hastanesi",
        "Gerede Devlet Hastanesi"
      ]
    },
    "Adana": {
      districts: ["Seyhan", "Yüreğir", "Çukurova", "Sarıçam", "Ceyhan"],
      hospitals: [
        "Adana Şehir Eğitim ve Araştırma Hastanesi",
        "Çukurova Devlet Hastanesi",
        "Seyhan Devlet Hastanesi"
      ]
    },
    "Ankara": {
      districts: ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Altındağ"],
      hospitals: [
        "Ankara Bilkent Şehir Hastanesi",
        "Ankara Etlik Şehir Hastanesi",
        "Gazi Üniversitesi Tıp Fakültesi Hastanesi"
      ]
    },
    "İstanbul": {
      districts: ["Kadıköy", "Şişli", "Bakırköy", "Üsküdar", "Başakşehir"],
      hospitals: [
        "Başakşehir Çam ve Sakura Şehir Hastanesi",
        "İstanbul Haydarpaşa Numune E.A. Hastanesi",
        "İstanbul Şişli Hamidiye Etfal E.A. Hastanesi"
      ]
    }
  };

  const allDoctors = [
    // --- MERSİN ---
    { id: 1, name: 'Doç. Dr. Caner Yıldız', clinic: 'Göz Hastalıkları', hospital: 'Mersin Şehir Eğitim ve Araştırma Hastanesi', district: 'Toroslar', city: 'Mersin', room: 'B Blok Zemin Kat - Göz 2', slots: ['09:10', '09:40', '10:20', '11:15', '14:00', '15:30'] },
    { id: 2, name: 'Uzm. Dr. Elif Aksoy', clinic: 'Göz Hastalıkları', hospital: 'Mersin Şehir Eğitim ve Araştırma Hastanesi', district: 'Toroslar', city: 'Mersin', room: 'B Blok 1. Kat - Poliklinik 5', slots: ['10:00', '10:30', '11:45', '13:50', '16:15'] },
    { id: 3, name: 'Prof. Dr. Hakan Özdemir', clinic: 'Kardiyoloji', hospital: 'Mersin Şehir Eğitim ve Araştırma Hastanesi', district: 'Toroslar', city: 'Mersin', room: 'Kalp Damar Merkezi - Oda 1', slots: ['09:30', '11:00', '14:15', '15:45'] },
    { id: 4, name: 'Uzm. Dr. Ayşe Gökçen', clinic: 'Dahiliye (İç Hastalıkları)', hospital: 'Mersin Şehir Eğitim ve Araştırma Hastanesi', district: 'Toroslar', city: 'Mersin', room: 'Dahiliye Kliniği - Oda 12', slots: ['08:45', '09:15', '10:45', '14:30', '16:00'] },
    { id: 5, name: 'Op. Dr. Serkan Bulut', clinic: 'Kulak Burun Boğaz (KBB)', hospital: 'Mersin Toros Devlet Hastanesi', district: 'Akdeniz', city: 'Mersin', room: 'Ana Bina - KBB Poliklinik 4', slots: ['09:15', '10:30', '11:15', '13:45'] },
    { id: 6, name: 'Uzm. Dr. Mehmet Fatih Çelik', clinic: 'Dahiliye (İç Hastalıkları)', hospital: 'Mersin Toros Devlet Hastanesi', district: 'Akdeniz', city: 'Mersin', room: 'Zemin Kat - Dahiliye 3', slots: ['09:00', '10:15', '11:30', '14:00', '15:15'] },
    { id: 7, name: 'Op. Dr. Burak Sezgin', clinic: 'Ortopedi ve Travmatoloji', hospital: 'Mersin Toros Devlet Hastanesi', district: 'Akdeniz', city: 'Mersin', room: 'Ortopedi Polikliniği 2', slots: ['10:00', '11:20', '14:40'] },
    { id: 8, name: 'Uzm. Dr. Zeynep Karaca', clinic: 'Cildiye (Dermatoloji)', hospital: 'Tarsus Devlet Hastanesi', district: 'Tarsus', city: 'Mersin', room: 'Hizmet Binası 2. Kat', slots: ['09:20', '10:00', '11:40', '14:20'] },

    // --- BOLU ---
    { id: 25, name: 'Doç. Dr. Selim Bolat', clinic: 'Dahiliye (İç Hastalıkları)', hospital: 'Bolu İzzet Baysal Devlet Hastanesi', district: 'Merkez', city: 'Bolu', room: 'Ana Bina Kat 1 - Dahiliye 2', slots: ['09:00', '10:30', '11:15', '14:00', '15:30'] },
    { id: 26, name: 'Uzm. Dr. Esra Yılmaz', clinic: 'Göz Hastalıkları', hospital: 'Bolu Abant İzzet Baysal Üniversitesi E.A. Hastanesi', district: 'Merkez', city: 'Bolu', room: 'Göz Polikliniği 3', slots: ['09:45', '11:00', '13:45', '16:00'] },
    { id: 27, name: 'Op. Dr. Kaan Özcan', clinic: 'Ortopedi ve Travmatoloji', hospital: 'Bolu İzzet Baysal Devlet Hastanesi', district: 'Merkez', city: 'Bolu', room: 'Poliklinik 5', slots: ['10:15', '11:30', '14:30'] },

    // --- ADANA ---
    { id: 13, name: 'Prof. Dr. Tarık Yılmaz', clinic: 'Kardiyoloji', hospital: 'Adana Şehir Eğitim ve Araştırma Hastanesi', district: 'Yüreğir', city: 'Adana', room: 'Kalp Merkezi A-10', slots: ['09:00', '10:30', '13:30', '15:00'] },
    { id: 14, name: 'Uzm. Dr. Derya Korkmaz', clinic: 'Göz Hastalıkları', hospital: 'Adana Şehir Eğitim ve Araştırma Hastanesi', district: 'Yüreğir', city: 'Adana', room: 'Göz Kliniği 4', slots: ['09:20', '11:00', '14:15'] },

    // --- ANKARA ---
    { id: 16, name: 'Prof. Dr. Ahmet Arslan', clinic: 'Göz Hastalıkları', hospital: 'Ankara Bilkent Şehir Hastanesi', district: 'Çankaya', city: 'Ankara', room: 'Göz Hastanesi Kat 2', slots: ['09:15', '10:45', '13:30', '15:15'] },
    { id: 17, name: 'Uzm. Dr. Melis Tekin', clinic: 'Dahiliye (İç Hastalıkları)', hospital: 'Ankara Etlik Şehir Hastanesi', district: 'Keçiören', city: 'Ankara', room: 'Dahiliye Poliklinik 8', slots: ['09:00', '10:15', '11:30', '14:00'] },

    // --- İSTANBUL ---
    { id: 18, name: 'Uzm. Dr. Koray Altun', clinic: 'Göz Hastalıkları', hospital: 'Başakşehir Çam ve Sakura Şehir Hastanesi', district: 'Başakşehir', city: 'İstanbul', room: 'Göz Polikliniği 3', slots: ['09:30', '11:00', '14:20', '15:45'] }
  ];

  // 1. 81 İli Datalist'e Doldur (Yazarken otomatik tamamlama)
  function populateCities() {
    cityList.innerHTML = '';
    CITIES_81.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      cityList.appendChild(opt);
    });
  }

  // 2. Şehre Göre İlçe ve Hastaneleri Doldur
  function updateSubOptions(cityName) {
    const matchedCity = CITIES_81.find(c => c.toLowerCase() === cityName.toLowerCase()) || cityName;
    const data = CITY_DATA[matchedCity] || {
      districts: ["Merkez", "1. Bölge", "2. Bölge"],
      hospitals: [`${matchedCity} Devlet Hastanesi`, `${matchedCity} Eğitim ve Araştırma Hastanesi`]
    };

    districtList.innerHTML = '';
    data.districts.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      districtList.appendChild(opt);
    });

    hospitalList.innerHTML = '';
    data.hospitals.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h;
      hospitalList.appendChild(opt);
    });

    btnSearchText.innerText = `${matchedCity} İçin Randevu Ara`;
  }

  // Şehir inputu değiştikçe
  inputCity.addEventListener('input', () => {
    const val = inputCity.value.trim();
    if (val) {
      updateSubOptions(val);
      performFilter();
    }
  });

  inputDistrict.addEventListener('input', performFilter);
  inputHospital.addEventListener('input', performFilter);
  inputClinic.addEventListener('input', performFilter);
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

  // Filtreleme Motoru
  function performFilter() {
    const curCity = inputCity.value.trim().toLowerCase();
    const curDist = inputDistrict.value.trim().toLowerCase();
    const curHosp = inputHospital.value.trim().toLowerCase();
    const curClin = inputClinic.value.trim().toLowerCase();
    const searchQ = liveSearchInput.value.trim().toLowerCase();

    const matchedCityExact = CITIES_81.find(c => c.toLowerCase() === curCity) || (inputCity.value.trim() || 'Mersin');

    let filtered = allDoctors.filter(doc => {
      // Şehir eşleşmesi
      const matchCity = !curCity || doc.city.toLowerCase().includes(curCity) || curCity.includes(doc.city.toLowerCase());
      if (!matchCity) return false;

      // İlçe eşleşmesi
      const matchDist = !curDist || curDist === 'tümü' || doc.district.toLowerCase().includes(curDist);

      // Hastane eşleşmesi
      const matchHosp = !curHosp || curHosp === 'tümü' || doc.hospital.toLowerCase().includes(curHosp);

      // Klinik eşleşmesi
      const matchClin = !curClin || curClin === 'tümü' || doc.clinic.toLowerCase().includes(curClin);

      // Canlı serbest arama
      const allText = `${doc.name} ${doc.hospital} ${doc.clinic} ${doc.district} ${doc.room}`.toLowerCase();
      const matchSearch = !searchQ || allText.includes(searchQ);

      return matchDist && matchHosp && matchClin && matchSearch;
    });

    // Eğer o şehirde doktor yoksa simülatör hekim üret (Bolu, Kars, Trabzon fark etmez)
    if (filtered.length === 0 && curCity) {
      filtered = generateFallbackDoctors(matchedCityExact, inputClinic.value.trim());
    }

    renderDoctors(filtered, matchedCityExact);
  }

  function generateFallbackDoctors(cityName, clinicChoice) {
    const clinic = (!clinicChoice || clinicChoice.toLowerCase() === 'tümü') ? 'Dahiliye (İç Hastalıkları)' : clinicChoice;
    return [
      {
        id: 881,
        name: `Uzm. Dr. Selim ${cityName}li`,
        clinic: clinic,
        hospital: `${cityName} Devlet Hastanesi`,
        district: 'Merkez',
        city: cityName,
        room: 'Zemin Kat - Dahiliye Polikliniği 2',
        slots: ['09:15', '10:00', '11:30', '14:15', '15:45']
      },
      {
        id: 882,
        name: `Op. Dr. Merve Kaya`,
        clinic: (!clinicChoice || clinicChoice.toLowerCase() === 'tümü') ? 'Göz Hastalıkları' : clinicChoice,
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
          <p style="font-size:0.82rem; margin-top:6px; color:#7b998f;">
            Filtre kutularını temizleyerek ${cityName} genelindeki tüm randevuları listeleyebilirsiniz.
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

  // Başlat
  populateCities();
  updateSubOptions("Mersin");
  performFilter();
});