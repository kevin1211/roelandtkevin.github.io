// Récupération des éléments DOM
const video = document.getElementById("karaokeVideo");
const playPauseBtn = document.getElementById("playPause");
const stopBtn = document.getElementById("stop");
const downloadBtn = document.getElementById("download");
const pipBtn = document.getElementById("pip");
const castBtn = document.getElementById("cast");
const playbackRateSelector = document.getElementById("playbackRate");

// Play / Pause
playPauseBtn.addEventListener("click", () => {
    if (video.paused || video.ended) {
        video.play();
        playPauseBtn.textContent = "⏸️";
    } else {
        video.pause();
        playPauseBtn.textContent = "▶️";
    }
});

// Stop
stopBtn.addEventListener("click", () => {
    video.pause();
    video.currentTime = 0;
    playPauseBtn.textContent = "▶️";
});

// Télécharger
downloadBtn.addEventListener("click", () => {
    const url = video.querySelector("source").src;
    const a = document.createElement("a");
    a.href = url;
    a.download = "karaoke.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

// Mode Picture-in-Picture
pipBtn.addEventListener("click", async () => {
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else {
        await video.requestPictureInPicture();
    }
});

// Vitesse de lecture
playbackRateSelector.addEventListener("change", (e) => {
    video.playbackRate = parseFloat(e.target.value);
});

// Diffusion (Cast) - Place holder
castBtn.addEventListener("click", () => {
    alert("La fonctionnalité de diffusion dépend de la configuration du navigateur et du matériel.");
});
