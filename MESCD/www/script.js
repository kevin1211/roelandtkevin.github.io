// Sélection des éléments
const cds = document.querySelectorAll('.cd-item');
const cdTitle = document.getElementById('cdTitle');
const cdLyrics = document.getElementById('cdLyrics');
const cdVideo = document.getElementById('cdVideo');
const cdAudioSource = document.getElementById('cdAudioSource');
const videoError = document.getElementById('videoError');
const downloadButton = document.getElementById('downloadButton');
const pipButton = document.getElementById('pipButton');

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

// Gestion du téléchargement
downloadButton.addEventListener('click', () => {
    const currentVideoSource = cdAudioSource.src;
    const link = document.createElement('a');
    link.href = currentVideoSource;
    link.download = currentVideoSource.split('/').pop();
    link.click();
});

// Gestion du mode PiP
pipButton.addEventListener('click', () => {
    if (cdVideo !== document.pictureInPictureElement) {
        cdVideo.requestPictureInPicture().catch(error => {
            console.log('Erreur PiP :', error);
        });
    } else {
        document.exitPictureInPicture().catch(error => {
            console.log('Erreur PiP exit :', error);
        });
    }
});
