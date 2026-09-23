const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '16-Robot-Login');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robot Giriş Paneli</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

    <div class="login-container">
        
        <!-- Sevimli Robot -->
        <div class="robot" id="robot">
            <div class="anten">
                <div class="anten-top"></div>
                <div class="anten-cubuk"></div>
            </div>
            <div class="kafa">
                <div class="goz sol-goz">
                    <div class="goz-bebegi"></div>
                </div>
                <div class="goz sag-goz">
                    <div class="goz-bebegi"></div>
                </div>
                <div class="agiz"></div>
            </div>
            <!-- Sadece kafası ve elleri kartın üstünden görünecek şekilde tasarlandı -->
            <div class="eller">
                <div class="el sol-el"></div>
                <div class="el sag-el"></div>
            </div>
        </div>

        <!-- Giriş Kartı -->
        <div class="login-card">
            <h2>Hoş Geldin! 👋</h2>
            <p>Seni tanıyalım, lütfen giriş yap.</p>

            <form id="loginForm">
                <div class="input-group">
                    <i class="fa-regular fa-user icon"></i>
                    <input type="text" id="username" placeholder="Kullanıcı Adı" autocomplete="off">
                </div>

                <div class="input-group">
                    <i class="fa-solid fa-lock icon"></i>
                    <input type="password" id="password" placeholder="Şifre" autocomplete="off">
                    <i class="fa-regular fa-eye-slash toggle-password" id="togglePassword"></i>
                </div>

                <div class="options">
                    <label><input type="checkbox"> Beni Hatırla</label>
                    <a href="#">Şifremi Unuttum?</a>
                </div>

                <button type="submit" class="submit-btn">Devam <i class="fa-solid fa-arrow-right"></i></button>
            </form>
        </div>

    </div>

    <script src="script.js"></script>
</body>
</html>`;

const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    width: 100vw;
    height: 100vh;
    /* 3. görseldeki açık mavi bulutlu gökyüzü renk tonu */
    background: linear-gradient(135deg, #dceef9 0%, #a8cce6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.login-container {
    position: relative;
    width: 400px;
    margin-top: 100px; /* Robot için üstte boşluk */
}

/* ================= ROBOT TASARIMI ================= */
.robot {
    position: absolute;
    top: -110px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Anten */
.anten {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: -2px;
}
.anten-top {
    width: 16px;
    height: 16px;
    background: #f39c12; /* Turuncu lamba */
    border-radius: 50%;
    box-shadow: 0 0 10px #f39c12;
}
.anten-cubuk {
    width: 6px;
    height: 15px;
    background: #9abce3;
}

/* Kafa */
.kafa {
    width: 130px;
    height: 100px;
    background: linear-gradient(135deg, #eef5fc, #d0e4f5);
    border-radius: 35px;
    border: 4px solid #ffffff;
    box-shadow: 0 15px 25px rgba(0,0,0,0.1), inset 0 -10px 20px rgba(154, 188, 227, 0.5);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
}

/* Gözler */
.goz {
    width: 30px;
    height: 40px;
    background: #1e3a5f;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.goz-bebegi {
    width: 12px;
    height: 16px;
    background: #ffffff;
    border-radius: 50%;
    position: absolute;
    top: 6px;
    left: 8px;
    transition: all 0.2s ease;
}

.goz::after {
    content: '';
    position: absolute;
    bottom: 6px;
    right: 8px;
    width: 6px;
    height: 8px;
    background: #ffffff;
    border-radius: 50%;
    opacity: 0.6;
}

/* Şifre yazılırken gözlerin düşüp pörtlemesi */
.robot.sifre-yaziyor .goz {
    transform: translateY(15px) scale(1.4);
    background: #1e3a5f;
    border-radius: 40%;
}
.robot.sifre-yaziyor .goz-bebegi {
    top: 15px;
    left: 9px;
    width: 15px;
    height: 15px;
}

/* Kullanıcı adı yazılırken gözler fareyi/yazıyı takip eder gibi (sağa sola bakar) */
.robot.kullanici-yaziyor .goz-bebegi {
    transform: translateX(5px) translateY(5px);
}

/* Ağız */
.agiz {
    position: absolute;
    bottom: 20px;
    width: 30px;
    height: 15px;
    border-bottom: 4px solid #1e3a5f;
    border-radius: 0 0 20px 20px;
    transition: all 0.3s;
}

/* Giriş yapıldığında robot zıplar ve güler */
.robot.giris-basarili {
    animation: robotZipla 0.6s ease-in-out infinite alternate;
}
.robot.giris-basarili .agiz {
    height: 25px;
    background: #1e3a5f;
    border-bottom: none;
    border-radius: 0 0 30px 30px;
}
.robot.giris-basarili .goz {
    height: 30px;
    border-radius: 50% 50% 10% 10%;
    transform: translateY(-5px);
}

@keyframes robotZipla {
    0% { transform: translateX(-50%) translateY(0); }
    100% { transform: translateX(-50%) translateY(-30px); }
}

/* Kartın üstünden tutunan eller */
.eller {
    position: absolute;
    bottom: -15px;
    width: 140px;
    display: flex;
    justify-content: space-between;
    z-index: 15;
}
.el {
    width: 28px;
    height: 35px;
    background: #eef5fc;
    border: 3px solid #ffffff;
    border-radius: 15px;
    box-shadow: 0 5px 10px rgba(0,0,0,0.1);
}

/* ================= GİRİŞ KARTI ================= */
.login-card {
    background: #ffffff;
    border-radius: 24px;
    padding: 50px 40px 40px;
    box-shadow: 0 20px 40px rgba(30, 58, 95, 0.15);
    position: relative;
    z-index: 5;
}

.login-card h2 {
    color: #1e3a5f;
    font-size: 24px;
    margin-bottom: 8px;
}

.login-card p {
    color: #7a94b5;
    font-size: 14px;
    margin-bottom: 30px;
}

.input-group {
    position: relative;
    margin-bottom: 20px;
}

.input-group .icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #9abce3;
    font-size: 18px;
    transition: color 0.3s;
}

.input-group input {
    width: 100%;
    height: 55px;
    background: #f4f9fd;
    border: 2px solid #e2edf6;
    border-radius: 14px;
    padding: 0 45px;
    font-size: 15px;
    color: #1e3a5f;
    outline: none;
    transition: all 0.3s;
}

.input-group input:focus {
    border-color: #f39c12; /* Turuncu focus */
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(243, 156, 18, 0.1);
}

.input-group input:focus + .icon,
.input-group input:not(:placeholder-shown) + .icon {
    color: #f39c12;
}

.toggle-password {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #9abce3;
    cursor: pointer;
    font-size: 18px;
}
.toggle-password:hover {
    color: #1e3a5f;
}

.options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    font-size: 13px;
    color: #7a94b5;
}

.options input[type="checkbox"] {
    accent-color: #f39c12;
    margin-right: 6px;
    vertical-align: middle;
}

.options a {
    color: #f39c12;
    text-decoration: none;
    font-weight: 600;
}

.submit-btn {
    width: 100%;
    height: 55px;
    background: #f39c12; /* 3. görseldeki turuncu/sarı buton tonu */
    color: #ffffff;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 20px rgba(243, 156, 18, 0.3);
}

.submit-btn:hover {
    background: #e67e22;
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(243, 156, 18, 0.4);
}

.submit-btn:active {
    transform: translateY(0);
}`;

const js = `document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const robot = document.getElementById('robot');
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');

    // Kullanıcı adı yazılırken robot yazıyı takip ediyormuş gibi (sağa bakar)
    usernameInput.addEventListener('focus', () => {
        robot.classList.add('kullanici-yaziyor');
        robot.classList.remove('sifre-yaziyor');
        robot.classList.remove('giris-basarili');
    });

    usernameInput.addEventListener('blur', () => {
        robot.classList.remove('kullanici-yaziyor');
    });

    // Şifre alanına tıklandığında robotun gözleri pörtler/düşer
    passwordInput.addEventListener('focus', () => {
        robot.classList.add('sifre-yaziyor');
        robot.classList.remove('kullanici-yaziyor');
        robot.classList.remove('giris-basarili');
    });

    passwordInput.addEventListener('blur', () => {
        robot.classList.remove('sifre-yaziyor');
    });

    // Şifre göster/gizle ikonu
    togglePassword.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePassword.classList.remove('fa-eye-slash');
            togglePassword.classList.add('fa-eye');
            // Şifre görünür olunca robotun gözleri normale dönsün (bakabilsin)
            robot.classList.remove('sifre-yaziyor');
        } else {
            passwordInput.type = 'password';
            togglePassword.classList.remove('fa-eye');
            togglePassword.classList.add('fa-eye-slash');
            // Şifre gizlenince robot tekrar gözlerini pörtletsin
            if (document.activeElement === passwordInput) {
                robot.classList.add('sifre-yaziyor');
            }
        }
    });

    // Giriş butonuna basılınca
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Sayfa yenilenmesini engelle
        
        // Kutucuklardaki odağı kaldır
        usernameInput.blur();
        passwordInput.blur();
        
        // Zıplama ve sevinme animasyonunu başlat
        robot.classList.remove('sifre-yaziyor');
        robot.classList.remove('kullanici-yaziyor');
        robot.classList.add('giris-basarili');
        
        // Buton metnini değiştir
        const btn = document.querySelector('.submit-btn');
        const orjinalMetin = btn.innerHTML;
        btn.innerHTML = 'Giriş Yapılıyor... <i class="fa-solid fa-spinner fa-spin"></i>';
        
        // 3 saniye sonra animasyonu sıfırla (Gerçek bir sitede burada yönlendirme yapılır)
        setTimeout(() => {
            robot.classList.remove('giris-basarili');
            btn.innerHTML = orjinalMetin;
            usernameInput.value = '';
            passwordInput.value = '';
        }, 3000);
    });
});`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
fs.writeFileSync(path.join(dirPath, 'script.js'), js);
console.log('16-Robot-Login created successfully!');
