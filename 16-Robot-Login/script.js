document.addEventListener('DOMContentLoaded', () => {
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
});