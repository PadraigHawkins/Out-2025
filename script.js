const itemLink = document.getElementById('itemLink');
const changeNameButton = document.querySelector('.change-name-button');
const nameContainer = document.querySelector('.name-container');


// Cookie Consent Popup Logic
const cookieConsentPopup = document.getElementById('cookieConsentPopup');
const acceptCookiesButton = document.getElementById('acceptCookiesButton');
const overlay = document.getElementById('overlay');

// Check if user has already accepted cookies
if (!localStorage.getItem('cookieConsent')) {
    // If not, show the cookie consent popup and overlay
    cookieConsentPopup.style.display = 'block';
    overlay.style.display = 'block';
}

// When user clicks on "Accept" button
acceptCookiesButton.addEventListener('click', () => {
    // Store user consent in localStorage
    localStorage.setItem('cookieConsent', 'true');
    
    // Hide the popup and overlay after acceptance
    cookieConsentPopup.style.display = 'none';
    overlay.style.display = 'none';

    // Initialize Google Analytics after consent
    gtag('config', 'G-3S5PMLPMEJ'); // Replace with your GA ID
});


document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getNearbyPubs, handleLocationError);
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

function getNearbyPubs(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const location = new google.maps.LatLng(lat, lng);

    const request = {
        location: location,
        radius: 1500, // Adjust search radius as needed
        type: ["bar"] // Can also try "pub"
    };

    const service = new google.maps.places.PlacesService(document.createElement("div"));
    service.nearbySearch(request, handleResults);
}

function handleResults(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        const pubListContainer = document.getElementById("pub-list");
        pubListContainer.innerHTML = ""; // Clear existing static list

        results.forEach((place) => {
            const pubElement = document.createElement("div");
            pubElement.classList.add("name-container");

            pubElement.innerHTML = `
                <h2>${place.name}</h2>
                <p>${place.vicinity}</p>
                <button class="change-name-button" onclick="calculateWalkingDistance(${place.geometry.location.lat()}, ${place.geometry.location.lng()})">
                    Get Distance
                </button>
            `;

            pubListContainer.appendChild(pubElement);
        });
    } else {
        alert("No pubs found nearby.");
    }
}

function handleLocationError(error) {
    console.error("Error getting location:", error);
    alert("Could not get location. Please enable location services and try again.");
}

function calculateWalkingDistance(lat, lng) {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        const destination = new google.maps.LatLng(lat, lng);

        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [userLocation],
                destinations: [destination],
                travelMode: "WALKING",
            },
            (response, status) => {
                if (status === "OK" && response.rows[0].elements[0].status === "OK") {
                    alert(`Walking distance: ${response.rows[0].elements[0].distance.text}`);
                } else {
                    alert("Could not calculate distance.");
                }
            }
        );
    });
}









