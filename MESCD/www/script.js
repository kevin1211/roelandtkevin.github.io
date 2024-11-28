// Sélection des éléments
const cds = document.querySelectorAll('.cd-item');
const cdTitle = document.getElementById('cdTitle');
const cdLyrics = document.getElementById('cdLyrics');
const cdVideo = document.getElementById('cdVideo');
const cdAudioSource = document.getElementById('cdAudioSource');

// Ajouter des événements de clic pour chaque CD
cds.forEach(cd => {
    cd.addEventListener('click', () => {
        const cdId = cd.getAttribute('data-cd'); // Récupérer l'identifiant

        // Mettre à jour le titre
        cdTitle.textContent = `🎶 ${cdId.toUpperCase()} 🎶`;

        // Masquer temporairement les paroles
        cdLyrics.classList.remove('show');

        // Charger les paroles
        fetch(`../doc/${cdId}.txt`)
            .then(response => response.text())
            .then(lyrics => {
                cdLyrics.textContent = lyrics;

                // Afficher avec animation
                setTimeout(() => cdLyrics.classList.add('show'), 100);
            })
            .catch(err => {
                cdLyrics.textContent = "Impossible de charger les paroles.";
                console.error(err);
            });

        // Charger la vidéo
        cdAudioSource.src = `../doc/${cdId}.mp4`;
        cdVideo.load();
    });
});
