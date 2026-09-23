const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '20-Stream-Duygu-Analizi-UI');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Stream Sentiment Dashboard</title>
    <link rel="stylesheet" href="style.css">
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

    <div class="dashboard">
        <!-- HEADER -->
        <header class="header">
            <div class="logo">
                <i class="fa-solid fa-waveform"></i> Sentiment<span>AI</span>
            </div>
            <div class="stream-info">
                <div class="live-badge"><div class="dot"></div> LIVE</div>
                <div class="viewers"><i class="fa-solid fa-users"></i> <span id="viewerCount">14,208</span></div>
            </div>
        </header>

        <!-- MAIN GRID -->
        <div class="grid-container">
            
            <!-- LEFT: CHAT FEED -->
            <div class="panel chat-panel">
                <div class="panel-header">
                    <h3><i class="fa-regular fa-comments"></i> Live Chat Feed</h3>
                </div>
                <div class="chat-box" id="chatBox">
                    <!-- Messages will be injected here via JS -->
                </div>
            </div>

            <!-- CENTER: REAL-TIME CHART -->
            <div class="panel chart-panel">
                <div class="panel-header">
                    <h3><i class="fa-solid fa-chart-line"></i> Emotion Fluctuation (Real-time)</h3>
                </div>
                <div class="chart-container">
                    <canvas id="sentimentChart"></canvas>
                </div>
                <div class="chart-legend">
                    <span class="legend-item"><div class="color-box pos"></div> Joy / Hype</span>
                    <span class="legend-item"><div class="color-box neu"></div> Neutral / Info</span>
                    <span class="legend-item"><div class="color-box neg"></div> Anger / Toxic</span>
                </div>
            </div>

            <!-- RIGHT: STATS & OVERALL VIBE -->
            <div class="panel stats-panel">
                <div class="panel-header">
                    <h3><i class="fa-solid fa-bolt"></i> Stream Vibe</h3>
                </div>
                
                <div class="vibe-score">
                    <div class="score-circle" id="scoreCircle">
                        <span id="overallScore">85%</span>
                        <p>HYPE</p>
                    </div>
                </div>

                <div class="progress-bars">
                    <div class="bar-group">
                        <div class="bar-label">Positive (Joy/Hype) <span id="posPercent">60%</span></div>
                        <div class="bar-track"><div class="bar-fill pos-fill" id="posBar" style="width: 60%;"></div></div>
                    </div>
                    <div class="bar-group">
                        <div class="bar-label">Neutral <span id="neuPercent">30%</span></div>
                        <div class="bar-track"><div class="bar-fill neu-fill" id="neuBar" style="width: 30%;"></div></div>
                    </div>
                    <div class="bar-group">
                        <div class="bar-label">Negative (Toxic/Anger) <span id="negPercent">10%</span></div>
                        <div class="bar-track"><div class="bar-fill neg-fill" id="negBar" style="width: 10%;"></div></div>
                    </div>
                </div>
                
                <div class="alerts">
                    <h4>AI Alerts</h4>
                    <ul id="alertList">
                        <li class="alert-item pos-alert"><i class="fa-solid fa-arrow-trend-up"></i> High engagement detected!</li>
                    </ul>
                </div>
            </div>
            
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>`;

const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', 'Segoe UI', sans-serif;
}

body {
    background: #0f0f16; /* Derin Gece Mavisi */
    color: #e2e2e9;
    height: 100vh;
    overflow: hidden;
}

/* Kök Renk Değişkenleri */
:root {
    --pos-color: #00E5FF; /* Turkuaz / Neon Mavi */
    --neg-color: #FF0055; /* Neon Pembe/Kırmızı */
    --neu-color: #B721FF; /* Parlak Mor */
    --panel-bg: rgba(22, 22, 35, 0.7);
    --border-color: rgba(255, 255, 255, 0.05);
}

.dashboard {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 20px;
    gap: 20px;
}

/* HEADER */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background: var(--panel-bg);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    border: 1px solid var(--border-color);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.logo {
    font-size: 24px;
    font-weight: 800;
    color: #fff;
    letter-spacing: 1px;
}
.logo span {
    color: var(--pos-color);
    text-shadow: 0 0 10px var(--pos-color);
}
.stream-info {
    display: flex;
    gap: 20px;
    align-items: center;
    font-weight: bold;
}
.live-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 0, 85, 0.15);
    color: var(--neg-color);
    padding: 5px 12px;
    border-radius: 20px;
    border: 1px solid rgba(255, 0, 85, 0.3);
}
.dot {
    width: 10px;
    height: 10px;
    background: var(--neg-color);
    border-radius: 50%;
    animation: pulseRed 1.5s infinite;
}
@keyframes pulseRed {
    0% { box-shadow: 0 0 0 0 rgba(255, 0, 85, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(255, 0, 85, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 0, 85, 0); }
}

/* GRID LAYOUT */
.grid-container {
    display: grid;
    grid-template-columns: 280px 1fr 320px;
    gap: 20px;
    flex: 1;
    overflow: hidden;
}

.panel {
    background: var(--panel-bg);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    border: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.panel-header {
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color);
    background: rgba(0, 0, 0, 0.2);
}
.panel-header h3 {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #888c99;
}
.panel-header i {
    margin-right: 8px;
    color: #fff;
}

/* CHAT PANEL */
.chat-box {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.chat-box::-webkit-scrollbar { width: 4px; }
.chat-box::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

.chat-msg {
    background: rgba(255, 255, 255, 0.03);
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.4;
    animation: slideInUp 0.3s ease forwards;
    border-left: 3px solid transparent;
}
@keyframes slideInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.msg-user {
    font-weight: bold;
    color: #a4a9b8;
    margin-right: 5px;
}
.chat-msg.positive { border-left-color: var(--pos-color); }
.chat-msg.negative { border-left-color: var(--neg-color); }
.chat-msg.neutral { border-left-color: var(--neu-color); }

/* CHART PANEL */
.chart-container {
    flex: 1;
    padding: 20px;
    position: relative;
    width: 100%;
}
.chart-legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 15px;
    font-size: 12px;
    color: #888c99;
}
.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
}
.color-box {
    width: 12px;
    height: 12px;
    border-radius: 3px;
}
.pos { background: var(--pos-color); box-shadow: 0 0 8px var(--pos-color); }
.neg { background: var(--neg-color); box-shadow: 0 0 8px var(--neg-color); }
.neu { background: var(--neu-color); box-shadow: 0 0 8px var(--neu-color); }

/* STATS PANEL */
.stats-panel {
    padding-bottom: 20px;
}
.vibe-score {
    display: flex;
    justify-content: center;
    padding: 30px 0;
}
.score-circle {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 4px solid var(--pos-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.4), inset 0 0 20px rgba(0, 229, 255, 0.4);
    transition: all 0.5s ease;
}
.score-circle span {
    font-size: 36px;
    font-weight: 800;
    color: #fff;
    text-shadow: 0 0 10px rgba(255,255,255,0.5);
}
.score-circle p {
    font-size: 12px;
    color: var(--pos-color);
    font-weight: bold;
    letter-spacing: 2px;
}

.progress-bars {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.bar-group {
    width: 100%;
}
.bar-label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 5px;
    color: #a4a9b8;
}
.bar-label span {
    font-weight: bold;
    color: #fff;
}
.bar-track {
    width: 100%;
    height: 8px;
    background: rgba(0,0,0,0.5);
    border-radius: 4px;
    overflow: hidden;
}
.bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.pos-fill { background: var(--pos-color); box-shadow: 0 0 10px var(--pos-color); }
.neu-fill { background: var(--neu-color); box-shadow: 0 0 10px var(--neu-color); }
.neg-fill { background: var(--neg-color); box-shadow: 0 0 10px var(--neg-color); }

.alerts {
    padding: 20px;
    margin-top: auto;
}
.alerts h4 {
    font-size: 12px;
    color: #888c99;
    margin-bottom: 10px;
    text-transform: uppercase;
}
.alert-item {
    list-style: none;
    font-size: 12px;
    padding: 10px;
    border-radius: 8px;
    background: rgba(0, 229, 255, 0.1);
    color: var(--pos-color);
    border: 1px solid rgba(0, 229, 255, 0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: flash 2s infinite alternate;
}
.alert-item.neg-alert {
    background: rgba(255, 0, 85, 0.1);
    color: var(--neg-color);
    border-color: rgba(255, 0, 85, 0.2);
}
@keyframes flash {
    0% { opacity: 0.8; }
    100% { opacity: 1; box-shadow: 0 0 10px currentColor; }
}
`;

const js = `document.addEventListener('DOMContentLoaded', () => {
    
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

        div.className = \`chat-msg \${typeClass}\`;
        div.innerHTML = \`<span class="msg-user">\${user}:</span> \${text}\`;
        
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
            
            alertList.innerHTML = \`<li class="alert-item pos-alert"><i class="fa-solid fa-fire"></i> Chat is extremely positive!</li>\`;
        } else if (nPer >= pPer && nPer > 30) {
            circle.style.borderColor = '#FF0055';
            circle.style.boxShadow = '0 0 20px rgba(255, 0, 85, 0.4), inset 0 0 20px rgba(255, 0, 85, 0.4)';
            vibeText.style.color = '#FF0055';
            scoreText.innerText = nPer + '%';
            vibeText.innerText = 'TOXIC';

            alertList.innerHTML = \`<li class="alert-item neg-alert"><i class="fa-solid fa-triangle-exclamation"></i> Toxicity spike detected!</li>\`;
        } else {
            circle.style.borderColor = '#B721FF';
            circle.style.boxShadow = '0 0 20px rgba(183, 33, 255, 0.4), inset 0 0 20px rgba(183, 33, 255, 0.4)';
            vibeText.style.color = '#B721FF';
            scoreText.innerText = uPer + '%';
            vibeText.innerText = 'CHILL';

            alertList.innerHTML = \`<li class="alert-item" style="color: #B721FF; border-color: rgba(183,33,255,0.2); background: rgba(183,33,255,0.1);"><i class="fa-solid fa-mug-hot"></i> Normal stream vibe.</li>\`;
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
});`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('20-Stream-Duygu-Analizi-UI created successfully!');
