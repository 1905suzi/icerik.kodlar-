document.addEventListener('DOMContentLoaded', () => {
    const bg = document.getElementById('bg');
    const text = document.getElementById('text');
    const trees = document.getElementById('trees');

    window.addEventListener('scroll', () => {
        let value = window.scrollY;

        // Arka plan resmi yavaşça aşağı kaysın
        bg.style.top = value * 0.5 + 'px';
        
        // Yazı biraz daha hızlı aşağı ve sağa kaysın
        text.style.marginTop = value * 1.5 + 'px';
        
        // Ağaçlar hafifçe yukarı kaysın
        trees.style.top = value * -0.15 + 'px';
    });
});
