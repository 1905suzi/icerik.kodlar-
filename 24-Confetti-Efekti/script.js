document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    const btn = document.getElementById('confettiBtn');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const colors = ['#f94144','#f3722c','#f8961e','#f9c74f','#90be6d','#43aa8b','#577590','#277da1','#f093fb','#f5576c','#00f5d4','#fee440'];

    let particles = [];
    let animationId;

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 10 + 5;
            this.speedX = (Math.random() - 0.5) * 20;
            this.speedY = Math.random() * -18 - 5;
            this.gravity = 0.5;
            this.friction = 0.98;
            this.opacity = 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 15;
            // Rastgele şekil: 0 = dikdörtgen, 1 = daire, 2 = üçgen
            this.shape = Math.floor(Math.random() * 3);
        }

        update() {
            this.speedY += this.gravity;
            this.speedX *= this.friction;
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.008;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            if (this.shape === 0) {
                // Dikdörtgen (konfeti şeridi)
                ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            } else if (this.shape === 1) {
                // Daire
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Üçgen
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.fill();
            }

            ctx.restore();
        }
    }

    function createConfetti() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < 150; i++) {
            particles.push(new Particle(centerX, centerY));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();
            if (p.opacity <= 0) {
                particles.splice(index, 1);
            }
        });

        if (particles.length > 0) {
            animationId = requestAnimationFrame(animate);
        }
    }

    btn.addEventListener('click', () => {
        createConfetti();
        if (!animationId || particles.length === 0) {
            animate();
        }
    });
});
