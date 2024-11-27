function createBalloon() {
    const container = document.getElementById('container');
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');

    // Randomize the balloon color
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Randomize the horizontal position
    balloon.style.left = Math.random() * (window.innerWidth - 50) + 'px';

    container.appendChild(balloon);

    // Remove the balloon after it has floated out of view
    setTimeout(() => {
        container.removeChild(balloon);
    }, 5000);
}

// Create a new balloon every second
setInterval(createBalloon, 1000);
