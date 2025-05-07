import CelebrationManager from './node_modules/balloon-confetti-celebration/managers/celebrationManager.js';

const confettiOptions = {
    containerId: 'balloon-confetti-celebration',
    modalUrl: 'https://cdn.pixabay.com/photo/2023/11/29/12/29/cartoon-8419487_1280.jpg',
    balloonCount: 40,
    modalDelay: 500,
    confettiColors: [{front: "#FEDB37", back: "#FDB931"}],
    confettiParams: {
        delay: 1700,
        number: 120,
        size: {x: [10, 30], y: [15, 25]},
        initSpeed: 35,
        gravity: 0.65,
        drag: 0.08,
        terminalVelocity: 6,
        flipSpeed: 0.017
    },
    confettiId: "confetti",
};

const celebrateButton = document.getElementById("celebrate");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");

celebrateButton.addEventListener('click', () => {
    const manager = new CelebrationManager(confettiOptions);
    manager.setupConfettiCanvas();
    manager.startConfettiLoop();

    const interval = setInterval(() => manager.addConfetti(), 100);
    setTimeout(() => clearInterval(interval), 2000);

    setTimeout(() => {
        modal.style.display = "block";
    }, confettiOptions.modalDelay);
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = "none";
});