// Importation de la classe CelebrationManager du package balloon-confetti-celebration
import CelebrationManager
    from 'kevin1211.github.io/MYBIRTDAY/www/node_modules/balloon-confetti-celebration/managers/celebrationManager.js';

// Configuration des options pour l'animation des ballons et des confettis
const options = {
    containerId: 'balloon-confetti-celebration',  // ID du conteneur pour les ballons
    modalUrl: 'https://cdn.pixabay.com/photo/2023/11/29/12/29/cartoon-8419487_1280.jpg', // Image de fond optionnelle pour la modalité
    balloonCount: 40,  // Nombre de ballons
    modalDelay: 1000,  // Délai avant d'afficher la modalité (image)
    confettiColors: [{front: "#FEDB37", back: "#FDB931"}],  // Couleurs des confettis
    confettiParams: {
        delay: 1700,  // Délai avant de commencer les confettis
        number: 120,  // Nombre de confettis par émission
        size: {x: [10, 30], y: [15, 25]},  // Taille des confettis
        initSpeed: 35,  // Vitesse initiale des confettis
        gravity: 0.65,  // Gravité des confettis
        drag: 0.08,  // Résistance de l'air pour les confettis
        terminalVelocity: 6,  // Vitesse terminale des confettis
        flipSpeed: 0.017,  // Vitesse de rotation des confettis
    }
};

// Initialisation du gestionnaire de célébration
const celebrationManager = new CelebrationManager(options);

// Configuration du canvas pour les confettis
celebrationManager.setupConfettiCanvas();

// Démarrage de l'animation des ballons
celebrationManager.startCelebration();

// Fonction pour lancer les confettis avec un délai entre chaque groupe d'émissions
var count = 200;
var defaults = {
    origin: {y: 0.7}
};

// Fonction pour lancer les confettis
function fire(particleRatio, opts) {
    confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
    });
}

// Fonction pour démarrer l'animation des confettis avec un délai
function startConfettiAnimations() {
    // Animation des confettis avec délai entre chaque émission
    setTimeout(() => fire(0.25, {spread: 26, startVelocity: 55}), 0);
    setTimeout(() => fire(0.2, {spread: 60}), 1000);  // Délai de 1 seconde
    setTimeout(() => fire(0.35, {spread: 100, decay: 0.91, scalar: 0.8}), 2000);  // Délai de 2 secondes
    setTimeout(() => fire(0.1, {spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2}), 3000);  // Délai de 3 secondes
    setTimeout(() => fire(0.1, {spread: 120, startVelocity: 45}), 4000);  // Délai de 4 secondes
}

// Lancer les animations de confettis après que les ballons aient démarré
startConfettiAnimations();

// Animation continue des confettis avec une durée de 15 secondes
var duration = 15 * 1000;
var animationEnd = Date.now() + duration;
var defaults = {startVelocity: 30, spread: 360, ticks: 60, zIndex: 0};

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

var interval = setInterval(function () {
    var timeLeft = animationEnd - Date.now();

    // Si le temps est écoulé, arrêter l'intervalle
    if (timeLeft <= 0) {
        return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // Lancer des confettis à gauche et à droite
    confetti({...defaults, particleCount, origin: {x: randomInRange(0.1, 0.3), y: Math.random() - 0.2}});
    confetti({...defaults, particleCount, origin: {x: randomInRange(0.7, 0.9), y: Math.random() - 0.2}});
}, 250);

// Fonction pour ajouter des confettis en forme d'étoile et de cercle
var defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
};

function shoot() {
    // Confettis en forme d'étoile
    confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star']
    });

    // Confettis en forme de cercle
    confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle']
    });
}

// Lancer les confettis en forme d'étoile et de cercle avec un délai
setTimeout(shoot, 0);
setTimeout(shoot, 100);
setTimeout(shoot, 200);

// Configuration de l'animation du canvas pour les confettis
var canvas = document.getElementById('my-canvas');
canvas.confetti = canvas.confetti || confetti.create(canvas, {resize: true});

canvas.confetti({
    spread: 70,
    origin: {y: 1.2}
});
