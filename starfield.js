/* ==========================================================================
   CONTROL OBJECTS
   ========================================================================== */
const EngineConfig = {
    starfield_animation: 'on',
    color_shifting: 'on'
};

/* ==========================================================================
   CANVAS CONFIGURATION SETUP
   ========================================================================== */
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function setCanvasDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasDimensions();

/* ==========================================================================
   STELLAR ANIMATION CONTROLLERS
   ========================================================================== */
class StellarParticle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; 
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.size = Math.random() * 1.5 + 0.2;
        this.speed = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.5 ? '#A5C9FF' : '#D1B3FF';
        this.alpha = Math.random() * 0.5 + 0.3;
        this.fadeDirection = Math.random() > 0.5 ? 0.01 : -0.01;
    }

    update() {
        if (EngineConfig.starfield_animation === 'on') {
            this.y += this.speed;
            this.alpha += this.fadeDirection;

            if (this.alpha >= 0.8 || this.alpha <= 0.2) {
                this.fadeDirection = -this.fadeDirection;
            }

            if (this.y > canvas.height) {
                this.reset();
            }
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* ==========================================================================
   ENGINE LOOP & LIFECYCLE MANAGEMENT
   ========================================================================== */
function buildStellarMap() {
    stars = [];
    const density = Math.floor((canvas.width * canvas.height) / 4000);
    for (let i = 0; i < density; i++) {
        stars.push(new StellarParticle());
    }
}

function runEngineLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    requestAnimationFrame(runEngineLoop);
}

window.addEventListener('resize', () => {
    setCanvasDimensions();
    buildStellarMap();
});

buildStellarMap();
runEngineLoop();
