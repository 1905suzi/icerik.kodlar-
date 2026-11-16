// NeyimVar? Prototip Yapay Zeka Sohbet Motoru
document.addEventListener('DOMContentLoaded', () => {
  const btnNeyimvar = document.querySelector('.btn-neyimvar');
  const chatOverlay = document.getElementById('chatOverlay');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');
  const promptChips = document.querySelectorAll('.prompt-chip');

  // Modalı Aç / Kapat
  if (btnNeyimvar && chatOverlay) {
    btnNeyimvar.addEventListener('click', () => {
      chatOverlay.classList.add('active');
      setTimeout(() => chatInput.focus(), 300);
    });
  }

  if (closeChatBtn) {
    closeChatBtn.addEventListener('click', () => {
      chatOverlay.classList.remove('active');
    });
  }

  // Dışarı tıklayınca kapatma
  chatOverlay.addEventListener('click', (e) => {
    if (e.target === chatOverlay) {
      chatOverlay.classList.remove('active');
    }
  });

  // Hızlı öneri butonları
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.dataset.text;
      handleUserMessage(text);
    });
  });

  // Form gönderme
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    handleUserMessage(text);
    chatInput.value = '';
  });

  function handleUserMessage(text) {
    // 1. Kullanıcı Mesajını Ekle
    appendMessage(text, 'user');

    // 2. Bot Yazıyor Simülasyonu
    const typingRow = appendTypingIndicator();
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      typingRow.remove();
      const botResponse = analyzeSymptom(text);
      appendBotResponse(botResponse);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 900);
  }

  function appendMessage(text, sender) {
    const row = document.createElement('div');
    row.className = `msg-row ${sender}`;
    row.innerHTML = `<div class="msg-bubble"><p>${escapeHtml(text)}</p></div>`;
    chatBody.appendChild(row);
    chatBody.scrollTop = chatBody.scrollHeight;
    return row;
  }

  function appendTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'msg-row bot';
    row.innerHTML = `
      <div class="msg-bubble" style="display:flex; gap:4px; align-items:center; padding:12px 18px;">
        <span style="font-size:0.8rem; color:#4e6b62;">Belirtileriniz taranıyor...</span>
      </div>`;
    chatBody.appendChild(row);
    return row;
  }

  function appendBotResponse(res) {
    const row = document.createElement('div');
    row.className = 'msg-row bot';
    row.innerHTML = `
      <div class="msg-bubble">
        <p>${res.text}</p>
        <div class="clinic-result-card">
          <div class="clinic-result-header">Önerilen Poliklinik</div>
          <div class="clinic-name">🏥 ${res.clinic}</div>
          <div class="clinic-reason">${res.reason}</div>
          <button class="btn-book-direct" onclick="alert('✅ [Simülasyon] ${res.clinic} için uygun hekim ve saatler listeleniyor...')">
            <span>Bu Polikliniğe Randevu Ara</span>
            <span>→</span>
          </button>
        </div>
      </div>`;
    chatBody.appendChild(row);
  }

  // Basit Doğal Dil / Kural Tabanlı Poliklinik Eşleştirici
  function analyzeSymptom(query) {
    const q = query.toLowerCase();

    if (q.includes('baş') || q.includes('migren') || q.includes('başım') || q.includes('uyuşma')) {
      return {
        text: 'Belirttiğiniz şikayetler baş bölgesi ve nörolojik bulgularla ilişkili görünüyor.',
        clinic: 'Nöroloji (Beyin ve Sinir Hastalıkları)',
        reason: 'Sık tekrarlayan veya şiddetli baş ağrıları, bulantı eşliğinde nöroloji hekimlerince değerlendirilmelidir.'
      };
    } else if (q.includes('göz') || q.includes('görme') || q.includes('batma') || q.includes('yanma')) {
      return {
        text: 'Gözde kuruluk, batma ve görme rahatsızlıkları için en doğru birim:',
        clinic: 'Göz Hastalıkları',
        reason: 'Göz tansiyonu, enfeksiyon veya kornea kuruluğu şüphesine karşı detaylı biyomikroskop muayenesi önerilir.'
      };
    } else if (q.includes('boğaz') || q.includes('yutkun') || q.includes('kulak') || q.includes('burun')) {
      return {
        text: 'Üst solunum yolu enfeksiyonu ve boğaz hassasiyeti bulguları tespit edildi.',
        clinic: 'Kulak Burun Boğaz (KBB)',
        reason: 'Bademcik iltihabı veya farenjit durumlarında KBB uzmanı tarafından muayene edilmeniz tavsiye edilir.'
      };
    } else if (q.includes('diz') || q.includes('bacak') || q.includes('eklem') || q.includes('kemik') || q.includes('bel')) {
      return {
        text: 'Kas, iskelet ve eklem hareket kısıtlılığı şikayetleriniz için:',
        clinic: 'Ortopedi ve Travmatoloji',
        reason: 'Menisküs, kıkırdak veya eklem sıvı kaybı değerlendirmesi için ortopedi kliniğine yönlendiriliyorsunuz.'
      };
    } else if (q.includes('mide') || q.includes('karın') || q.includes('bağırsak') || q.includes('şişkinlik')) {
      return {
        text: 'Sindirim sistemi ve karın bölgesi rahatsızlıkları için:',
        clinic: 'Gastroenteroloji / Dahiliye (İç Hastalıkları)',
        reason: 'Mide yanması, gastrit veya sindirim problemleri için dahiliye muayenesi ilk adımdır.'
      };
    } else if (q.includes('diş') || q.includes('çene') || q.includes('dişim')) {
      return {
        text: 'Ağız ve diş sağlığı şikayetiniz için en uygun birim:',
        clinic: 'Ağız ve Diş Sağlığı Merkezi (Diş Hekimliği)',
        reason: 'Çürük, diş eti hassasiyeti ve dolgu işlemleri için diş hekimine başvurmalısınız.'
      };
    } else {
      return {
        text: 'Şikayetinizi genel bir değerlendirmeden geçirebilmek için başlangıç polikliniği:',
        clinic: 'İç Hastalıkları (Dahiliye)',
        reason: 'Şikayetlerinizin kökenini tespit etmek ve gerekirse ilgili yan dala sevk edilmek için ilk adım Dahiliye polikliniğidir.'
      };
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
});