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

        // Arrêter et réinitialiser la vidéo existante
        cdVideo.pause();
        cdVideo.currentTime = 0;  // Réinitialiser la vidéo au début
        cdAudioSource.src = '';  // Vider la source de la vidéo pour éviter qu'elle persiste

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
                    videoError.style.display = 'none';  // Masquer le message d'erreur si la vidéo existe
                } else {
                    cdVideo.style.display = 'none';  // Cacher l'élément vidéo si elle est absente
                    videoError.style.display = 'block';  // Afficher le message d'erreur
                }
            })
            .catch(err => {
                cdVideo.style.display = 'none';  // Cacher la vidéo en cas d'erreur
                videoError.style.display = 'block'; // Afficher le message d'erreur si un problème se produit
                console.error(err);
            });
    });
});
