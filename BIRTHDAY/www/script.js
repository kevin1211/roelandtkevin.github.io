import CelebrationManager from './node_modules/balloon-confetti-celebration/managers/celebrationManager.js';

// Configuration centrale
const confettiOptions = {
    containerId: 'balloon-confetti-celebration',
    modalUrl: 'https://cdn.pixabay.com/photo/2023/11/29/12/29/cartoon-8419487_1280.jpg',
    balloonCount: 40,
    modalDelay: 500,
    confettiColors: [{ front: "#FEDB37", back: "#FDB931" }],
    confettiParams: {
        delay: 1700,
        number: 120,
        size: { x: [10, 30], y: [15, 25] },
        initSpeed: 35,
        gravity: 0.65,
        drag: 0.08,
        terminalVelocity: 6,
        flipSpeed: 0.017,
    },
    confettiId: "confetti"
};

// Gère la célébration au clic
const celebrateButton = document.getElementById("celebrate");

celebrateButton.addEventListener('click', () => {
    const celebrationManager = new ConfettiManager(confettiOptions);
    celebrationManager.setupConfettiCanvas();
    celebrationManager.startConfettiLoop();

    // Ajouter les confettis à intervalles
    const addConfettiInterval = setInterval(() => {
        celebrationManager.addConfetti();
    }, 100);

    // Arrêter après 2 secondes pour éviter une surcharge
    setTimeout(() => clearInterval(addConfettiInterval), 2000);
}, false);

// ==============================
// Classe Confetti
// ==============================
class Confetti {
    constructor(colors, confettiParams, container, clickPosition) {
        this.container = container;
        this.clickPosition = clickPosition;
        this.confettiParams = confettiParams;
        this.randomModifier = this.rand(-1, 1);
        this.colorPair = colors[Math.floor(this.rand(0, colors.length))];
        this.dimensions = {
            x: this.rand(confettiParams.size.x[0], confettiParams.size.x[1]),
            y: this.rand(confettiParams.size.y[0], confettiParams.size.y[1]),
        };
        this.position = { x: clickPosition[0], y: clickPosition[1] };
        this.rotation = this.rand(0, 2 * Math.PI);
        this.scale = { x: 1, y: 1 };
        this.velocity = {
            x: this.rand(-confettiParams.initSpeed, confettiParams.initSpeed) * 0.4,
            y: this.rand(-confettiParams.initSpeed, confettiParams.initSpeed),
        };
        this.flipSpeed = this.rand(0.2, 1.5) * confettiParams.flipSpeed;

        if (this.position.y <= container.h) {
            this.velocity.y = -Math.abs(this.velocity.y);
        }

        this.terminalVelocity = this.rand(1, 1.5) * confettiParams.terminalVelocity;
    }

    rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    update() {
        this.velocity.x *= 0.98;
        this.position.x += this.velocity.x;

        this.velocity.y += this.randomModifier * this.confettiParams.drag;
        this.velocity.y += this.confettiParams.gravity;
        this.velocity.y = Math.min(this.velocity.y, this.terminalVelocity);
        this.position.y += this.velocity.y;

        this.scale.y = Math.cos((this.position.y + this.randomModifier) * this.flipSpeed);
        this.color = this.scale.y > 0 ? this.colorPair.front : this.colorPair.back;
    }
}

// ==============================
// ConfettiManager
// ==============================
class ConfettiManager {
    constructor(options) {
        this.confettiElements = [];
        this.confettiParams = options.confettiParams;
        this.confettiColors = options.confettiColors;
        this.confetti = document.getElementById(options.confettiId);
        this.confettiCtx = this.confetti.getContext("2d");
        this.container = {
            w: this.confetti.clientWidth,
            h: this.confetti.clientHeight
        };
        this.confetti.width = this.container.w;
        this.confetti.height = this.container.h;
        this.isAnimationActive = true;
    }

    addConfetti(e) {
        const canvasBox = this.confetti.getBoundingClientRect();
        const clickPosition = e
            ? [e.clientX - canvasBox.left, e.clientY - canvasBox.top]
            : [canvasBox.width * Math.random(), canvasBox.height * Math.random()];

        for (let i = 0; i < this.confettiParams.number; i++) {
            this.confettiElements.push(
                new Confetti(this.confettiColors, this.confettiParams, this.container, clickPosition)
            );
        }
    }

    startConfettiLoop() {
        this.addConfetti();
        setTimeout(() => this.startConfettiLoop(), this.confettiParams.delay + Math.random() * 1700);
    }

    updateConfetti() {
        if (!this.isAnimationActive) return;

        this.confettiCtx.clearRect(0, 0, this.container.w, this.container.h);
        this.confettiElements.forEach((c) => {
            c.update();
            this.confettiCtx.translate(c.position.x, c.position.y);
            this.confettiCtx.rotate(c.rotation);
            const width = c.dimensions.x * c.scale.x;
            const height = c.dimensions.y * c.scale.y;
            this.confettiCtx.fillStyle = c.color;
            this.confettiCtx.fillRect(-0.5 * width, -0.5 * height, width, height);
            this.confettiCtx.setTransform(1, 0, 0, 1, 0, 0);
        });

        window.requestAnimationFrame(() => this.updateConfetti());
    }
}
