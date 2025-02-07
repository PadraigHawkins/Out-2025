document.addEventListener("DOMContentLoaded", function () {
    const nameContainer = document.getElementById("name-container");
    const changeBarButton = document.getElementById("change-bar-button");
    let pubs = []; // Stores fetched pubs

    // Function to fetch pubs from Google Places API
    function fetchPubs(latitude, longitude) {
        const apiKey = "AIzaSyAFbKHEHoYUAOTsqaOu1ZuRleo4IT0AZ34";
        const radius = 100000; // Search radius in meters
        const type = "bar";
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    pubs = data.results.map(pub => pub.name);
                    changeBar(); // Show first random pub immediately
                } else {
                    nameContainer.innerHTML = "No pubs found nearby.";
                }
            })
            .catch(error => {
                console.error("Error fetching pubs:", error);
                nameContainer.innerHTML = "Error fetching pubs. Try again later.";
            });
    }

   // Function to get user location
   function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                fetchPubs(position.coords.latitude, position.coords.longitude);
            },
            error => {
                console.error("Geolocation error:", error);
                nameContainer.innerHTML = "Could not get location. Please enable location services and try again.";
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        nameContainer.innerHTML = "Geolocation is not supported by this browser.";
    }
}

    // Function to randomly change bar
    function changeBar() {
        if (pubs.length > 0) {
            const randomIndex = Math.floor(Math.random() * pubs.length);
            nameContainer.innerHTML = `<h2>${pubs[randomIndex]}</h2>`;
        } else {
            nameContainer.innerHTML = "Fetching bars...";
        }
    }

    // Event listener for button click
    changeBarButton.addEventListener("click", changeBar);

    // Fetch user's location and pubs on page load
    getLocation();
});





