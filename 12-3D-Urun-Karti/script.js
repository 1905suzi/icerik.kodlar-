
const kart = document.querySelector('.kart');
const kartAlani = document.querySelector('.kart-alani');

kartAlani.addEventListener('mousemove', (e) => {
    let xAxis = (window.innerWidth / 2 - e.pageX) / 15;
    let yAxis = (window.innerHeight / 2 - e.pageY) / 15;
    kart.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

kartAlani.addEventListener('mouseleave', () => {
    kart.style.transition = 'all 0.5s ease';
    kart.style.transform = `rotateY(0deg) rotateX(0deg)`;
});


kartAlani.addEventListener('mouseenter', () => {
    kart.style.transition = 'none';
});