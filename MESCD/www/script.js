// Sélectionner les éléments nécessaires
const likeButtons = document.querySelectorAll('.like-button');
const dislikeButtons = document.querySelectorAll('.dislike-button');

// Fonction pour mettre à jour les compteurs et les sauvegarder dans localStorage
function updateCounter(button, counterId) {
    const counter = document.getElementById(counterId);
    let count = parseInt(counter.textContent);

    // Incrémenter ou décrémenter selon le type de bouton
    if (button.classList.contains('like-button')) {
        count += 1;
    } else if (button.classList.contains('dislike-button')) {
        count -= 1;
    }

    // Mettre à jour le compteur
    counter.textContent = count;

    // Sauvegarder le nouveau compteur dans localStorage
    const cdId = button.getAttribute('data-cd');
    if (button.classList.contains('like-button')) {
        localStorage.setItem(`like-count-${cdId}`, count);  // Enregistrer le compteur de "like"
    } else if (button.classList.contains('dislike-button')) {
        localStorage.setItem(`dislike-count-${cdId}`, count);  // Enregistrer le compteur de "dislike"
    }
}

// Ajouter des événements de clic aux boutons Like et Dislike
likeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.stopPropagation();  // Empêcher l'événement de propagation
        const cdId = event.target.getAttribute('data-cd'); // Récupérer l'id du CD
        const counterId = `like-count-${cdId}`; // Identifier le compteur du CD
        updateCounter(event.target, counterId);
    });
});

dislikeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.stopPropagation();  // Empêcher l'événement de propagation
        const cdId = event.target.getAttribute('data-cd'); // Récupérer l'id du CD
        const counterId = `dislike-count-${cdId}`; // Identifier le compteur du CD
        updateCounter(event.target, counterId);
    });
});

// Fonction pour charger les compteurs depuis localStorage
function loadCounters() {
    const cds = document.querySelectorAll('.cd-item');

    cds.forEach(cd => {
        const cdId = cd.getAttribute('data-cd');

        // Charger les compteurs de like et dislike depuis localStorage
        const likeCount = localStorage.getItem(`like-count-${cdId}`);
        const dislikeCount = localStorage.getItem(`dislike-count-${cdId}`);

        // Si les valeurs existent, les afficher dans les compteurs respectifs
        if (likeCount !== null) {
            document.getElementById(`like-count-${cdId}`).textContent = likeCount;
        }
        if (dislikeCount !== null) {
            document.getElementById(`dislike-count-${cdId}`).textContent = dislikeCount;
        }
    });
}

// Charger les compteurs lors du chargement de la page
window.addEventListener('load', loadCounters);

// Sélection des éléments CD
const cds = document.querySelectorAll('.cd-item');
const cdTitle = document.getElementById('cdTitle');
const cdLyrics = document.getElementById('cdLyrics');
const cdVideo = document.getElementById('cdVideo');
const cdAudioSource = document.getElementById('cdAudioSource');
const videoError = document.getElementById('videoError');

// Ajouter des événements de clic pour chaque CD
cds.forEach(cd => {
    cd.addEventListener('click', () => {
        const cdId = cd.getAttribute('data-cd'); // Récupérer l'identifiant

        // Mettre à jour le titre
        cdTitle.textContent = `🎶 ${cdId.toUpperCase()} 🎶`;

        // Masquer temporairement les paroles et l'erreur vidéo
        cdLyrics.classList.remove('show');
        videoError.style.display = 'none';
        cdVideo.style.display = 'block';

        // Arrêter toute vidéo et réinitialiser la source
        if (!cdVideo.paused) {
            cdVideo.pause();
            cdVideo.currentTime = 0;  // Réinitialiser la vidéo à 0 pour éviter que l'ancienne vidéo continue de tourner.
        }

        // Charger les paroles
        fetch(`../doc/${cdId}.txt`)
            .then(response => response.text())
            .then(lyrics => {
                cdLyrics.textContent = lyrics;
                setTimeout(() => cdLyrics.classList.add('show'), 100);
            })
            .catch(err => {
                cdLyrics.textContent = "Impossible de charger les paroles.";
                console.error(err);
            });

        // Charger l'audio/vidéo
        const videoSource = `../doc/${cdId}.mp4`;

        // Vérifier si la vidéo existe
        fetch(videoSource, {method: 'HEAD'})
            .then(response => {
                if (response.ok) {
                    cdAudioSource.src = videoSource;
                    cdVideo.load();
                    cdVideo.play();
                } else {
                    // Si la vidéo n'est pas trouvée, afficher le message d'erreur
                    cdVideo.style.display = 'none';
                    videoError.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Erreur de chargement vidéo:', error);
                cdVideo.style.display = 'none';
                videoError.style.display = 'block';
            });
    });
});
