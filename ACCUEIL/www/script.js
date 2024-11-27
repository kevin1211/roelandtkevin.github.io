document.getElementById('redirectButton1').addEventListener('click', function() {
    this.classList.add('clicked');
    setTimeout(function () {
        window.location.href = '../../INFORMATIONS/www/index.html';
    }, 300); // délai pour l'animation
});

document.getElementById('redirectButton2').addEventListener('click', function() {
    this.classList.add('clicked');
    setTimeout(function () {
        window.location.href = '../../MAINTENANCE/www/index.html';
    }, 300);
});

document.getElementById('redirectButton3').addEventListener('click', function () {
    this.classList.add('clicked');
    setTimeout(function () {
        window.location.href = '../../MAINTENANCE/www/index.html';
    }, 300);
});
