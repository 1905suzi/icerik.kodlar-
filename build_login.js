const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '15-OGM-Login');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resepsiyon Girişi</title>
    <link rel="stylesheet" href="style.css">
    <!-- FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="login-container">
        <!-- Logo -->
        <div class="logo-container">
            <div class="logo-circle">
                <img src="https://upload.wikimedia.org/wikipedia/tr/5/5f/Orman_Genel_M%C3%BCd%C3%BCrl%C3%BC%C4%9F%C3%BC_logo.png" alt="OGM Logo" class="logo">
            </div>
        </div>

        <!-- Başlıklar -->
        <h1 class="title">Resepsiyon Girişi</h1>
        <p class="subtitle">İşlemlerinize devam edebilmeniz için yönetici girişi yapın</p>

        <!-- Hata Mesajı -->
        <div class="error-message">
            Geçersiz e-posta veya şifre.
        </div>

        <!-- Form Alanı -->
        <form class="login-form">
            <div class="input-group">
                <div class="input-icon">
                    <i class="fa-regular fa-envelope"></i>
                </div>
                <input type="email" placeholder="E-posta" value="resepsiyon@ogm.gov.tr" required>
            </div>

            <div class="input-group">
                <div class="input-icon">
                    <i class="fa-solid fa-lock"></i>
                </div>
                <input type="password" placeholder="Şifre" value="123456" required>
            </div>

            <button type="submit" class="submit-btn">GİRİŞ YAP</button>
        </form>
    </div>
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
    /* Koyu yeşil arka plan (Orman yeşili) */
    background-color: #112d16;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    /* Ağaç deseni için arka plan efekti (Opsiyonel ağaç dokusu eklenebilir) */
    background-image: radial-gradient(circle at center, rgba(30, 75, 40, 0.4) 0%, transparent 70%);
}

.login-container {
    background-color: #f7f9f7;
    width: 450px;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Logo Stilleri */
.logo-container {
    margin-bottom: 20px;
}

.logo-circle {
    width: 80px;
    height: 80px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    overflow: hidden;
}

.logo {
    width: 85%;
    height: auto;
}

/* Başlık Stilleri */
.title {
    color: #112d16;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
}

.subtitle {
    color: #888;
    font-size: 13px;
    margin-bottom: 25px;
}

/* Hata Mesajı Stili */
.error-message {
    width: 100%;
    background-color: #fff0f0;
    color: #e53935;
    padding: 12px;
    border: 1px solid #ffcdd2;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 25px;
}

/* Form Stilleri */
.login-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.input-group {
    display: flex;
    width: 100%;
    height: 48px;
}

.input-icon {
    width: 50px;
    background-color: white;
    border: 1px solid #ddd;
    border-right: none;
    border-radius: 6px 0 0 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
}

.input-group input {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 0 6px 6px 0;
    padding: 0 15px;
    font-size: 15px;
    color: #333;
    outline: none;
    transition: border-color 0.3s;
    background-color: #fafafa;
}

.input-group input:focus {
    border-color: #1a4a23;
}

/* Buton Stili */
.submit-btn {
    width: 100%;
    height: 50px;
    background-color: #1a4a23;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.3s, transform 0.1s;
    letter-spacing: 0.5px;
}

.submit-btn:hover {
    background-color: #112d16;
}

.submit-btn:active {
    transform: scale(0.98);
}`;

fs.writeFileSync(path.join(dirPath, 'index.html'), html);
fs.writeFileSync(path.join(dirPath, 'style.css'), css);
console.log('15-OGM-Login created successfully!');
