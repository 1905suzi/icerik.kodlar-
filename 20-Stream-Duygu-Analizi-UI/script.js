document.addEventListener('DOMContentLoaded', () => {
    
    // --- MOCK DATA GENERATOR ---
    const users = ["xGamer99", "LunaStream", "ShadowNinja", "KebabMaster", "TwitchLegend", "CozyCat", "PixelBoy", "NoobSlayer"];
    const messages = [
        { text: "YOOO THIS IS INSANE 🔥🔥🔥", sentiment: 1 },
        { text: "LMAOOOO NO WAY 😂", sentiment: 1 },
        { text: "I can't believe he just did that wtf", sentiment: 1 },
        { text: "PogChamp PogChamp", sentiment: 1 },
        { text: "What game is this?", sentiment: 0 },
        { text: "Can someone tell me the song name?", sentiment: 0 },
        { text: "Audio is slightly out of sync...", sentiment: 0 },
        { text: "Bro you suck at this game 🗑️", sentiment: -1 },
        { text: "This is so boring im leaving", sentiment: -1 },
        { text: "Ban that guy in chat pls", sentiment: -1 },
        { text: "LETS GOOOOOO 🚀", sentiment: 1 },
        { text: "W stream as always", sentiment: 1 }
    ];

    const chatBox = document.getElementById('chatBox');
    
    // Yüzdelik barlar ve vibe
    let stats = { pos: 60, neu: 30, neg: 10 };
    const maxDataPoints = 30; // Grafikte görünecek max veri noktası
    
    // --- CHART.JS SETUP ---
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    
    // Gradient oluşturma (Aşağı doğru sönen neon efekti)
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 229, 255, 0.5)'); // Turkuaz
    gradient.addColorStop(1, 'rgba(0, 229, 255, 0.0)');

    const chartData = {
        labels: Array(maxDataPoints).fill(''),
        datasets: [{
            label: 'Emotion Score',
            data: Array(maxDataPoints).fill(0), // Başlangıçta düz çizgi
            borderColor: '#00E5FF',
            backgroundColor: gradient,
            borderWidth: 3,
            tension: 0.4, // Kıvrımlı (smooth) çizgiler
            pointRadius: 0,
            pointHoverRadius: 5,
            fill: true
        }]
    };

    const config = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 400, // Akıcı akış animasyonu
                easing: 'linear'
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false }, // Alt ekseni gizle
                y: { 
                    display: true, 
                    min: -5, 
                    max: 5,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#888c99' }
                }
            }
        }
    };

    const sentimentChart = new Chart(ctx, config);

    // Güncel duygu skoru
    let currentScore = 0; 
    let history = []; // Son 20 mesajın duygu geçmişi (oran hesaplamak için)

    // --- SIMULATION LOOP ---
    setInterval(() => {
        // Rastgele mesaj seç
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        
        // Chat'e ekle
        addChatMessage(randomUser, randomMsg.text, randomMsg.sentiment);

        // Tarihçe güncelle (Progress Barlar için)
        history.push(randomMsg.sentiment);
        if(history.length > 20) history.shift();
        updateStats(history);

        // Grafik skoru hesapla (Smooth geçişler için yavaşça yaklaştır)
        // Sentiment: 1 (Pos), 0 (Neu), -1 (Neg)
        const targetScore = randomMsg.sentiment * (Math.random() * 3 + 2); // -5 ile 5 arası rastgele şiddet
        
        // Yumuşak geçiş (Lerp)
        currentScore += (targetScore - currentScore) * 0.3;

        // Grafiği güncelle
        chartData.datasets[0].data.shift(); // İlk veriyi at
        chartData.datasets[0].data.push(currentScore); // Sona yenisini ekle
        
        // Grafiğin rengini skora göre anlık değiştir
        updateChartColors(currentScore);

        sentimentChart.update();

        // Rastgele izleyici sayısı dalgalanması
        const viewerCount = document.getElementById('viewerCount');
        let currentV = parseInt(viewerCount.innerText.replace(',',''));
        currentV += Math.floor(Math.random() * 21) - 10;
        viewerCount.innerText = currentV.toLocaleString();

    }, 800); // Her 800ms'de bir yeni veri

    // Yardımcı Fonksiyonlar
    function addChatMessage(user, text, sentimentValue) {
        const div = document.createElement('div');
        let typeClass = "neutral";
        if (sentimentValue === 1) typeClass = "positive";
        if (sentimentValue === -1) typeClass = "negative";

        div.className = `chat-msg ${typeClass}`;
        div.innerHTML = `<span class="msg-user">${user}:</span> ${text}`;
        
        chatBox.appendChild(div);
        
        // Auto scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // Fazla mesaj birikmesini engelle (Performans)
        if (chatBox.children.length > 30) {
            chatBox.removeChild(chatBox.firstChild);
        }
    }

    function updateStats(hist) {
        let p=0, n=0, u=0;
        hist.forEach(val => {
            if(val === 1) p++;
            else if(val === -1) n++;
            else u++;
        });

        const total = hist.length;
        const pPer = Math.round((p/total)*100);
        const nPer = Math.round((n/total)*100);
        const uPer = Math.round((u/total)*100);

        // Update DOM
        document.getElementById('posPercent').innerText = pPer + '%';
        document.getElementById('posBar').style.width = pPer + '%';

        document.getElementById('neuPercent').innerText = uPer + '%';
        document.getElementById('neuBar').style.width = uPer + '%';

        document.getElementById('negPercent').innerText = nPer + '%';
        document.getElementById('negBar').style.width = nPer + '%';

        // Update Vibe Circle
        const circle = document.getElementById('scoreCircle');
        const scoreText = document.getElementById('overallScore');
        const vibeText = circle.querySelector('p');
        const alertList = document.getElementById('alertList');

        if (pPer >= nPer && pPer > 40) {
            circle.style.borderColor = '#00E5FF';
            circle.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.4), inset 0 0 20px rgba(0, 229, 255, 0.4)';
            vibeText.style.color = '#00E5FF';
            scoreText.innerText = pPer + '%';
            vibeText.innerText = 'HYPE';
            
            alertList.innerHTML = `<li class="alert-item pos-alert"><i class="fa-solid fa-fire"></i> Chat is extremely positive!</li>`;
        } else if (nPer >= pPer && nPer > 30) {
            circle.style.borderColor = '#FF0055';
            circle.style.boxShadow = '0 0 20px rgba(255, 0, 85, 0.4), inset 0 0 20px rgba(255, 0, 85, 0.4)';
            vibeText.style.color = '#FF0055';
            scoreText.innerText = nPer + '%';
            vibeText.innerText = 'TOXIC';

            alertList.innerHTML = `<li class="alert-item neg-alert"><i class="fa-solid fa-triangle-exclamation"></i> Toxicity spike detected!</li>`;
        } else {
            circle.style.borderColor = '#B721FF';
            circle.style.boxShadow = '0 0 20px rgba(183, 33, 255, 0.4), inset 0 0 20px rgba(183, 33, 255, 0.4)';
            vibeText.style.color = '#B721FF';
            scoreText.innerText = uPer + '%';
            vibeText.innerText = 'CHILL';

            alertList.innerHTML = `<li class="alert-item" style="color: #B721FF; border-color: rgba(183,33,255,0.2); background: rgba(183,33,255,0.1);"><i class="fa-solid fa-mug-hot"></i> Normal stream vibe.</li>`;
        }
    }

    function updateChartColors(score) {
        // Skora göre çizgi rengini neon yeşil/kırmızı yap
        if (score > 1.5) {
            chartData.datasets[0].borderColor = '#00E5FF'; // Pozitif
            gradient.addColorStop(0, 'rgba(0, 229, 255, 0.4)');
        } else if (score < -1.5) {
            chartData.datasets[0].borderColor = '#FF0055'; // Negatif
            gradient.addColorStop(0, 'rgba(255, 0, 85, 0.4)');
        } else {
            chartData.datasets[0].borderColor = '#B721FF'; // Nötr
            gradient.addColorStop(0, 'rgba(183, 33, 255, 0.4)');
        }
        chartData.datasets[0].backgroundColor = gradient;
    }
});