document.addEventListener('DOMContentLoaded', () => {
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
                
                // Animasyonu anlık durdur (GIF olduğu için eğilme animasyonunu CSS scale ile veriyoruz)
                character.classList.add('bending');
                
                setTimeout(() => {
                    // Yerdeki çanta kaybolur (Sanki GIF karakter onu almış gibi)
                    floorBriefcase.classList.add('hidden');
                    
                    // Doğrul
                    character.classList.remove('bending');
                    
                    setTimeout(() => {
                        // Forma doğru hızla koş
                        step = 3;
                    }, 300);
                }, 600);
            }
        } 
        else if(step === 3) { // Forma koşuyor
            charX += 8;
            character.style.left = charX + 'px';
            
            if(charX >= formPos) {
                step = 4; // Forma çarptı!
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

});