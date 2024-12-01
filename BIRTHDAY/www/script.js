// Initialisation de la fonction confetti
const confettiDefaults = {
    origin: {y: 0.7}
};

function fire(particleRatio, opts) {
    confetti({
        ...confettiDefaults,
        ...opts,
        particleCount: Math.floor(200 * particleRatio)
    });
}

// Lancer les confettis
fire(0.25, {spread: 26, startVelocity: 55});
fire(0.2, {spread: 60});
fire(0.35, {spread: 100, decay: 0.91, scalar: 0.8});
fire(0.1, {spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2});
fire(0.1, {spread: 120, startVelocity: 45});

// Animation répétée pour la durée de 15 secondes
const duration = 15 * 1000;
const animationEnd = Date.now() + duration;
const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 50 * (timeLeft / duration);
    confetti({particleCount, origin: {x: Math.random(), y: Math.random() - 0.2}});
}, 250);

// Animation des ballons (code à adapter si une bibliothèque dédiée est trouvée ou si un script personnalisé est nécessaire)
// Fonction pour générer des ballons
function createBalloon() {
    const balloonContainer = document.getElementById('balloon-container');
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');

    // Définir une couleur aléatoire
    balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

    // Définir une position aléatoire
    balloon.style.left = `${Math.random() * 100}vw`;

    // Durée aléatoire pour l'animation
    balloon.style.animationDuration = `${5 + Math.random() * 5}s`;

    // Ajouter le ballon au conteneur
    balloonContainer.appendChild(balloon);

    // Supprimer le ballon après l'animation
    balloon.addEventListener('animationend', () => {
        balloonContainer.removeChild(balloon);
    });
}

// Créer des ballons à intervalles réguliers
setInterval(createBalloon, 500);
