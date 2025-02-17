document.addEventListener("DOMContentLoaded", function () {
    const nameContainer = document.getElementById("name-container");
    const changeBarButton = document.getElementById("change-bar-button");
    let pubs = [];
    let userLocation = "your area";

    // Function to show loading indicator
    function showLoading(message) {
        nameContainer.innerHTML = `<h2>${message}</h2><div class="loader"></div>`;
    }

    // Function to fetch nearby pubs using Google Places API (via Google Maps SDK)
    function fetchPubs(latitude, longitude) {
        const service = new google.maps.places.PlacesService(document.createElement("div"));

        const request = {
            location: new google.maps.LatLng(latitude, longitude),
            radius: 3000, // Adjust radius as needed
            type: ["bar"],
        };

        showLoading("Fetching nearby bars...");

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                pubs = results.map(pub => pub.name);
                nameContainer.innerHTML = `<h2>Bars found near you:</h2><ul>${pubs.map(pub => `<li>${pub}</li>`).join('')}</ul>`;
            } else {
                nameContainer.innerHTML = "No pubs found near you.";
            }
        });
    }




    if ("geolocation" in navigator) {
        console.log("Geolocation is supported.");
    } else {
        console.log("Geolocation is not supported.");
    }

    // Function to get the user's location
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    fetchPubs(position.coords.latitude, position.coords.longitude);
                },
                error => {
                    console.error("Geolocation error:", error);
                    fetchIPLocation(); // Use IP-based location as a fallback
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 } // Increased timeout and cache age
            );
        } else {
            fetchIPLocation(); // Fallback for browsers that don't support geolocation
        }
    }

    // Function to fetch location using IP-based geolocation (fallback)
    function fetchIPLocation() {
        fetch("https://ipapi.co/json/")
            .then(response => response.json())
            .then(data => {
                if (data.latitude && data.longitude) {
                    fetchPubs(data.latitude, data.longitude);
                } else {
                    nameContainer.innerHTML = "Could not determine location.";
                }
            })
            .catch(error => {
                console.error("IP-based location error:", error);
                nameContainer.innerHTML = "Could not determine location.";
            });
    }

    // Function to randomly change the displayed bar
    function changeBar() {
        if (pubs.length > 0) {
            const randomIndex = Math.floor(Math.random() * pubs.length);
            nameContainer.innerHTML = `<h2>${pubs[randomIndex]}</h2>`;
        } else {
            showLoading("Fetching bars...");
        }
    }

    // Event listener for "Change Bar" button
    changeBarButton.addEventListener("click", changeBar);

    // Fetch the user's location and nearby pubs on page load
    getLocation();
});
