document.addEventListener('DOMContentLoaded', () => {
    // Ses dosyalarının URL'leri (örnek olarak harici kaynaklar kullanıyoruz)
    const sounds = {
        'kick': 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
        'snare': 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3',
        'hihat': 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
        'tom1': 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3',
        'tom2': 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3',
        'crash': 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3',
        'ride': 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
        'clap': 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
    };

    function playSound(soundName) {
        if (sounds[soundName]) {
            const audio = new Audio(sounds[soundName]);
            audio.currentTime = 0;
            audio.play();
        }
    }

    function triggerDrum(keyElement) {
        const soundName = keyElement.getAttribute('data-sound');
        playSound(soundName);

        // Animasyon ekle
        keyElement.classList.add('playing');
        
        // Animasyonu kaldır
        setTimeout(() => {
            keyElement.classList.remove('playing');
        }, 100);
    }

    // Tıklama event'i
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.addEventListener('click', () => {
            triggerDrum(key);
        });
    });

    // Klavye event'i
    window.addEventListener('keydown', (e) => {
        const keyChar = e.key.toLowerCase();
        const keyElement = document.querySelector(`.key[data-key="${keyChar}"]`);
        
        if (keyElement) {
            triggerDrum(keyElement);
        }
    });
});
