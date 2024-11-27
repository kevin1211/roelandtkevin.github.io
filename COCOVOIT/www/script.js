const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

class Trajet {
    constructor(pilote, depart, destination, places, departureDate, departureTime, fuelType, fuelConsumption) {
        this.pilote = pilote;
        this.depart = depart;
        this.destination = destination;
        this.places = places;
        this.departureDate = departureDate;
        this.departureTime = departureTime;
        this.fuelType = fuelType;
        this.fuelConsumption = fuelConsumption;
        this.distance = 0;
        this.duree = 0;
        this.covoitureurs = [];
        this.arrivalTime = '';
        this.itinerary = [];
        this.routeLayer = null;
    }

    async validate() {
        return this.pilote && this.depart && this.destination && this.places > 0 && this.departureDate && this.departureTime && this.fuelType && this.fuelConsumption > 0;
    }

    async calculateRoute() {
        await this.calculateRouteInternal(this.depart, this.destination);
    }

    async calculateRouteWithStop(stopAddress) {
        const stop = await this.convertAddress(stopAddress);
        await this.calculateRouteInternal(this.depart, stop, this.destination);
    }

    async calculateRouteInternal(...points) {
        const apiKey = 'dbd951e0-11ea-47a2-9da1-881646f25478';
        const locations = await Promise.all(points.map(point => this.convertAddress(point)));
        const queryParams = locations.map(location => `point=${location}`).join('&');
        const response = await fetch(`https://graphhopper.com/api/1/route?${queryParams}&profile=car&points_encoded=false&locale=fr&calc_points=true&key=${apiKey}`);
        const data = await response.json();

        if (data.paths && data.paths.length > 0) {
            const path = data.paths[0];
            this.distance = path.distance;
            this.duree = path.time / 60000; // Convert duration to minutes
            this.itinerary = path.points.coordinates;
            this.calculateArrivalTime();
            this.drawRouteOnMap(this.itinerary);
        } else {
            throw new Error('Aucun trajet trouvé');
        }
    }

    async convertAddress(address) {
        const apiKey = 'dbd951e0-11ea-47a2-9da1-881646f25478';
        const response = await fetch(`https://graphhopper.com/api/1/geocode?q=${address}&locale=fr&limit=1&key=${apiKey}`);
        const data = await response.json();
        if (data.hits && data.hits.length > 0) {
            const point = data.hits[0].point;
            return `${point.lat},${point.lng}`;
        } else {
            throw new Error('Adresse non trouvée');
        }
    }

    drawRouteOnMap(itinerary) {
        const route = itinerary.map(point => [point[1], point[0]]); // Inverser lat/lng pour Leaflet
        if (this.routeLayer) {
            this.routeLayer.remove(); // Supprimer l'itinéraire précédent si nécessaire
        }
        this.routeLayer = L.polyline(route, {color: 'blue'}).addTo(map);
        map.fitBounds(this.routeLayer.getBounds()); // Adapter la vue à l'itinéraire
    }

    addPassager(nom, places, address) {
        if (this.places >= places) {
            this.covoitureurs.push({nom, places, address});
            this.places -= places;
        } else {
            throw new Error('Pas assez de places disponibles');
        }
    }

    async addPassagerWithStop(nom, places, address, stopAddress) {
        if (this.places >= places) {
            await this.calculateRouteWithStop(stopAddress);
            this.covoitureurs.push({nom, places, address, stopAddress});
            this.places -= places;
        } else {
            throw new Error('Pas assez de places disponibles');
        }
    }

    calculateArrivalTime() {
        const departureDateTime = new Date(`${this.departureDate}T${this.departureTime}`);
        const arrivalDateTime = new Date(departureDateTime.getTime() + this.duree * 60000);
        this.arrivalTime = arrivalDateTime.toISOString().substring(11, 16);
    }
}

const trajets = [];

function register(role) {
    if (role === 'pilote') {
        showSection('pilotForm');
    } else if (role === 'covoitureur') {
        showSection('covoitureurView');
        populateTrajetList();
    }
}

function goBack() {
    document.getElementById('pilotForm').style.display = 'none';
    document.getElementById('covoitureurView').style.display = 'none';
    document.getElementById('trajetListSection').style.display = 'none';
    document.getElementById('inscritsSection').style.display = 'none';
    document.getElementById('registration').style.display = 'block';
    clearInputs();
}

function showSection(sectionId) {
    document.getElementById('registration').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
    if (sectionId === 'trajetListSection') {
        displayTrajetList();
    } else if (sectionId === 'inscritsSection') {
        displayInscritsList();
    }
}

function clearInputs() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
}

async function addTrajet() {
    const pilote = document.getElementById('usernamePilot').value;
    const depart = document.getElementById('depart').value;
    const destination = document.getElementById('destination').value;
    const places = document.getElementById('places').value;
    const departureDate = document.getElementById('departureDate').value;
    const departureTime = document.getElementById('departureTime').value;
    const fuelType = document.getElementById('fuelType').value;
    const fuelConsumption = document.getElementById('fuelConsumption').value;
    const trajet = new Trajet(pilote, depart, destination, places, departureDate, departureTime, fuelType, fuelConsumption);
    try {
        await trajet.validate();
        await trajet.calculateRoute();
        trajets.push(trajet);
        alert('Trajet ajouté avec succès');
        goBack();
    } catch (error) {
        alert(`Erreur: ${error.message}`);
    }
}

function populateTrajetList() {
    const trajetSelect = document.getElementById('trajetSelect');
    trajetSelect.innerHTML = '';

    trajets.forEach((trajet, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = `${trajet.depart} à ${trajet.destination} - Départ : ${trajet.departureDate} ${trajet.departureTime}`;
        trajetSelect.add(option);
    });

    displaySelectedTrajetDetails();
}

function displaySelectedTrajetDetails() {
    const trajetSelect = document.getElementById('trajetSelect');
    const selectedIndex = trajetSelect.value;
    const selectedTrajet = trajets[selectedIndex];
    const trajetDetails = document.getElementById('trajetDetails');
    if (selectedTrajet) {
        trajetDetails.innerHTML = `
                <p>Pilote: ${selectedTrajet.pilote}</p>
                <p>Départ: ${selectedTrajet.depart}</p>
                <p>Destination: ${selectedTrajet.destination}</p>
                <p>Places disponibles: ${selectedTrajet.places}</p>
                <p>Date et heure de départ : ${selectedTrajet.departureDate} ${selectedTrajet.departureTime}</p>
                <p>Type de carburant: ${selectedTrajet.fuelType}</p>
                <p>Consommation de carburant : ${selectedTrajet.fuelConsumption} L/100km</p>
                <p>Distance : ${(selectedTrajet.distance / 1000).toFixed(2)} km</p>
                <p>Durée : ${selectedTrajet.duree.toFixed(2)} minutes</p>
                <p>Heure d'arrivée : ${selectedTrajet.arrivalTime}</p>
            `;
    } else {
        trajetDetails.innerHTML = 'Sélectionnez un trajet pour voir les détails';
    }
}

function updateTrajetDetails() {
    const trajetSelect = document.getElementById('trajetSelect');
    trajetSelect.addEventListener('change', displaySelectedTrajetDetails);
}

async function registerUserAndReserve() {
    const trajetIndex = document.getElementById('trajetSelect').value;
    const username = document.getElementById('usernameCopilot').value;
    const seats = document.getElementById('seats').value;
    const adresseReservation = document.getElementById('adresseReservation').value;
    const adresseArret = document.getElementById('adresseArret').value;

    const selectedTrajet = trajets[trajetIndex];

    try {
        if (adresseArret) {
            await selectedTrajet.addPassagerWithStop(username, seats, adresseReservation, adresseArret);
        } else {
            selectedTrajet.addPassager(username, seats, adresseReservation);
        }
        alert('Réservation effectuée avec succès');
        goBack();
    } catch (error) {
        alert(`Erreur: ${error.message}`);
    }
}

function displayTrajetList() {
    const trajetList = document.getElementById('trajetList');
    trajetList.innerHTML = '';

    trajets.forEach((trajet, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${trajet.depart} à ${trajet.destination} - Départ : ${trajet.departureDate} ${trajet.departureTime}`;
        trajetList.appendChild(listItem);
    });
}

function displayInscritsList() {
    const inscritsList = document.getElementById('inscritsList');
    inscritsList.innerHTML = '';
    trajets.forEach((trajet, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>Trajet: ${trajet.depart} à ${trajet.destination}</strong> <br> Pilote: ${trajet.pilote} <br> Passagers: ${trajet.covoitureurs.map(c => `${c.nom} (${c.places} places, ${c.address})`).join(', ')}`;
        inscritsList.appendChild(listItem);
    });
}

updateTrajetDetails();