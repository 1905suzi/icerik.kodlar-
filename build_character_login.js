const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '19-Karakter-Animasyonlu-Giris');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Character Interactive Login</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

    <div class="scene" id="scene">
        
        <!-- Yerde duran çanta -->
        <div class="floor-briefcase" id="floorBriefcase">
            <div class="handle"></div>
            <div class="case"></div>
        </div>

        <!-- CSS Karakterimiz -->
        <div class="character" id="character">
            <div class="head">
                <div class="hair"></div>
                <div class="eye"></div>
            </div>
            <div class="torso">
                <div class="arm arm-left"></div>
                <div class="leg leg-left"></div>
                <div class="leg leg-right"></div>
                <div class="arm arm-right">
                    <!-- Karakter çantayı eline alınca bu görünür olacak -->
                    <div class="hand-briefcase hidden" id="handBriefcase">
                        <div class="handle"></div>
                        <div class="case"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gizli Giriş Formu -->
        <div class="login-wrapper" id="loginWrapper">
            <div class="login-card">
                <h2>Register now</h2>
                <p>Secure your spot in our upcoming live webinar</p>
                
                <form id="loginForm">
                    <div class="input-group">
                        <i class="fa-regular fa-user"></i>
                        <input type="text" placeholder="Name" required>
                    </div>
                    <div class="input-group">
                        <i class="fa-regular fa-user"></i>
                        <input type="text" placeholder="Surname" required>
                    </div>
                    <div class="input-group">
                        <i class="fa-regular fa-envelope"></i>
                        <input type="email" placeholder="Email address" required>
                    </div>
                    
                    <button type="submit" class="submit-btn" id="submitBtn">Next</button>
                    
                    <div class="social-login">
                        <button type="button" class="google-btn"><i class="fa-brands fa-google"></i></button>
                    </div>
                </form>
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
    font-family: 'Segoe UI', sans-serif;
}

body {
    width: 100vw;
    height: 100vh;
    background: #417BFF; /* Videodaki mavi arka plan */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.scene {
    position: relative;
    width: 1000px;
    height: 600px;
    /* border: 2px solid rgba(255,255,255,0.2); */ /* Sınırları görmek isterseniz açabilirsiniz */
}

/* ================= EKRAN TİTREME (SHAKE) ================= */
.shake {
    animation: shakeEffect 0.4s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shakeEffect {
    10%, 90% { transform: translate3d(-2px, 0, 0); }
    20%, 80% { transform: translate3d(4px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
    40%, 60% { transform: translate3d(8px, 0, 0); }
}

/* ================= ÇANTA TASARIMI ================= */
.floor-briefcase, .hand-briefcase {
    position: absolute;
    width: 40px;
    height: 30px;
}
.floor-briefcase {
    bottom: 100px;
    left: 400px; /* Karakterin koşup duracağı yer */
    z-index: 5;
}
.hand-briefcase {
    bottom: -25px;
    left: -5px;
    transform: rotate(-15deg);
}
.hand-briefcase.hidden {
    display: none;
}
.floor-briefcase.hidden {
    display: none;
}

.case {
    width: 40px;
    height: 25px;
    background: #8B5A2B;
    border-radius: 4px;
    position: absolute;
    bottom: 0;
    box-shadow: inset 0 -4px 0 rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.2);
}
.case::after { /* Kilit kısmı */
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 6px; height: 4px;
    background: #FFD700;
}
.handle {
    width: 14px;
    height: 8px;
    border: 3px solid #6b4421;
    border-bottom: none;
    border-radius: 5px 5px 0 0;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
}

/* ================= KARAKTER TASARIMI ================= */
.character {
    position: absolute;
    bottom: 100px;
    left: -100px; /* Ekranın dışından başlayacak */
    width: 60px;
    height: 140px;
    z-index: 10;
    transition: transform 0.3s;
}

/* Kafa */
.head {
    width: 45px;
    height: 50px;
    background: #ffdbac; /* Ten rengi */
    border-radius: 40% 50% 40% 40%;
    position: absolute;
    top: 0;
    left: 5px;
    z-index: 5;
    transition: transform 0.3s;
}
.hair {
    width: 50px;
    height: 25px;
    background: #e5c158; /* Sarı saç */
    border-radius: 20px 20px 0 0;
    position: absolute;
    top: -5px;
    left: -2px;
}
.eye {
    width: 5px;
    height: 5px;
    background: #333;
    border-radius: 50%;
    position: absolute;
    top: 22px;
    right: 12px;
}

/* Gövde (Ceket) */
.torso {
    width: 35px;
    height: 55px;
    background: #b0b5b9; /* Gri Ceket */
    border-radius: 10px 10px 5px 5px;
    position: absolute;
    top: 45px;
    left: 10px;
    z-index: 4;
}
.torso::after { /* Gömlek detayı */
    content: '';
    position: absolute;
    top: 0; left: 10px;
    width: 15px; height: 55px;
    background: #fff;
    z-index: -1;
}

/* Kollar ve Bacaklar */
.arm, .leg {
    position: absolute;
    transform-origin: top center;
    border-radius: 10px;
}
.arm {
    width: 12px;
    height: 45px;
    background: #a0a5a9;
    top: 5px;
    z-index: 6;
}
.arm-left { left: 5px; z-index: 3; background: #8b8f93; }
.arm-right { right: 5px; }

/* El (Avuç içi) */
.arm::after {
    content: '';
    position: absolute;
    bottom: -8px; left: 0;
    width: 12px; height: 12px;
    background: #ffdbac;
    border-radius: 50%;
}

.leg {
    width: 14px;
    height: 50px;
    background: #2c3e50; /* Siyah pantolon */
    top: 50px;
}
.leg-left { left: 5px; z-index: 2; background: #1a252f; }
.leg-right { right: 5px; z-index: 3; }

/* Ayakkabı */
.leg::after {
    content: '';
    position: absolute;
    bottom: -5px; right: -5px;
    width: 20px; height: 10px;
    background: #fff; /* Beyaz ayakkabı */
    border-radius: 5px 10px 5px 5px;
}

/* ================= HAREKETLER (ANIMATIONS) ================= */

/* Koşma Durumu */
.character.running .leg-left { animation: runLeg 0.4s linear infinite alternate; }
.character.running .leg-right { animation: runLeg 0.4s linear infinite alternate-reverse; }
.character.running .arm-left { animation: runArm 0.4s linear infinite alternate-reverse; }
.character.running .arm-right { animation: runArm 0.4s linear infinite alternate; }

/* Hızlı Koşma (Çantayı aldıktan sonra) */
.character.running-fast .leg-left { animation: runLeg 0.25s linear infinite alternate; }
.character.running-fast .leg-right { animation: runLeg 0.25s linear infinite alternate-reverse; }
.character.running-fast .arm-left { animation: runArm 0.25s linear infinite alternate-reverse; }
.character.running-fast .arm-right { animation: runArm 0.25s linear infinite alternate; }
.character.running-fast .head { transform: rotate(10deg) translateX(5px); }
.character.running-fast { transform: rotate(5deg); }

@keyframes runLeg {
    0% { transform: rotate(-40deg); }
    100% { transform: rotate(40deg); }
}
@keyframes runArm {
    0% { transform: rotate(-30deg); }
    100% { transform: rotate(40deg); }
}

/* Eğilme (Çantayı alırken) */
.character.bending {
    transform: translateY(20px) rotate(20deg);
}
.character.bending .arm-right {
    transform: rotate(-60deg);
}

/* Çarpma (Güm!) */
.character.bumping {
    transform: rotate(-15deg) translateX(-10px);
}
.character.bumping .head {
    transform: rotate(-20deg) translateX(-10px);
}
.character.bumping .arm-right {
    transform: rotate(120deg); /* Çarpınca kol yukarı savrulur */
}

/* Başarılı Zıplama */
.character.jumping {
    animation: jumpJoy 1s ease-in-out;
}
.character.jumping .arm-left, .character.jumping .arm-right {
    transform: rotate(150deg); /* Kollar havaya */
}
.character.jumping .leg-left { transform: rotate(-20deg); }
.character.jumping .leg-right { transform: rotate(20deg); }

@keyframes jumpJoy {
    0% { transform: translateY(0); }
    40% { transform: translateY(-80px) rotate(10deg); }
    60% { transform: translateY(-80px) rotate(-10deg); }
    100% { transform: translateY(0); }
}

/* ================= GİRİŞ FORMU ================= */
.login-wrapper {
    position: absolute;
    right: 150px;
    bottom: 50px;
    width: 380px;
    opacity: 0;
    transform: translateX(50px) scale(0.9);
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 15;
}

.login-wrapper.revealed {
    opacity: 1;
    transform: translateX(0) scale(1);
    pointer-events: all;
}

.login-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.2);
    text-align: center;
}

.login-card h2 {
    color: #111;
    font-size: 24px;
    margin-bottom: 5px;
}
.login-card p {
    color: #666;
    font-size: 12px;
    margin-bottom: 25px;
}

.input-group {
    position: relative;
    margin-bottom: 15px;
}
.input-group i {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
}
.input-group input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    font-size: 14px;
    transition: border 0.3s;
}
.input-group input:focus {
    border-color: #069c56; /* Videodaki yeşil tonu */
}

.submit-btn {
    width: 100%;
    padding: 12px;
    background: #069c56;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.3s;
}
.submit-btn:hover {
    background: #048246;
}

.social-login {
    margin-top: 15px;
}
.google-btn {
    width: 100%;
    padding: 10px;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
}
.google-btn i {
    color: #DB4437;
}`;

const js = `document.addEventListener('DOMContentLoaded', () => {
    const character = document.getElementById('character');
    const floorBriefcase = document.getElementById('floorBriefcase');
    const handBriefcase = document.getElementById('handBriefcase');
    const loginWrapper = document.getElementById('loginWrapper');
    const scene = document.getElementById('scene');
    const loginForm = document.getElementById('loginForm');

    // Animasyon Koreografisi (Senaryo)
    
    // 1. Karakter sahneye koşarak girer
    character.classList.add('running');
    
    // JS ile X ekseninde hareket ettirelim
    let charX = -100;
    const bagPos = 350; // Çantanın yanına geleceği X pozisyonu
    const formPos = 480; // Forma çarpacağı X pozisyonu
    
    let isRunning = true;
    let step = 1;

    // Ana Döngü (Movement)
    function moveCharacter() {
        if(step === 1) { // Çantaya koşuyor
            charX += 5;
            character.style.left = charX + 'px';
            
            if(charX >= bagPos) {
                step = 2; // Çantaya ulaştı
                character.classList.remove('running');
                // Eğilip çantayı al
                character.classList.add('bending');
                
                setTimeout(() => {
                    // Çantayı aldı (Yerdeki gizlenir, eldeki görünür)
                    floorBriefcase.classList.add('hidden');
                    handBriefcase.classList.remove('hidden');
                    
                    // Doğrul
                    character.classList.remove('bending');
                    
                    setTimeout(() => {
                        // Forma doğru hızla koş
                        step = 3;
                        character.classList.add('running-fast');
                    }, 300);
                }, 600);
            }
        } 
        else if(step === 3) { // Forma koşuyor
            charX += 8;
            character.style.left = charX + 'px';
            
            if(charX >= formPos) {
                step = 4; // Forma çarptı!
                character.classList.remove('running-fast');
                character.classList.add('bumping');
                
                // Ekran titrer
                scene.classList.add('shake');
                
                // Form görünür olur
                setTimeout(() => {
                    loginWrapper.classList.add('revealed');
                    scene.classList.remove('shake');
                    
                    // Karakter kendine gelir ve formun yanında durur
                    setTimeout(() => {
                        character.classList.remove('bumping');
                        character.style.left = (formPos - 20) + 'px'; // Hafif geri çekilir
                    }, 400);
                    
                }, 200);
            }
        }

        if(step === 1 || step === 3) {
            requestAnimationFrame(moveCharacter);
        }
    }

    // Koreografiyi başlat
    setTimeout(() => {
        requestAnimationFrame(moveCharacter);
    }, 500);

    // Form Gönderildiğinde (Karakterin Zıplayıp Sevinmesi)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Kutlama zıplaması!
        character.classList.add('jumping');
        
        // Zıplama bitince tekrar normal dursun
        setTimeout(() => {
            character.classList.remove('jumping');
            // Buton metnini değiştir
            document.getElementById('submitBtn').innerHTML = "<i class='fa-solid fa-check'></i> Registered";
            document.getElementById('submitBtn').style.background = "#28a745";
        }, 1000);
    });

});`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('19-Karakter-Animasyonlu-Giris created successfully!');
