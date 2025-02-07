document.addEventListener("DOMContentLoaded", function () {
    const nameContainer = document.getElementById("name-container");
    const changeBarButton = document.getElementById("change-bar-button");
    let pubs = []; // Stores fetched pubs
    let userLocation = "your area"; // Stores user's city/town name
    const radius = 100000; // Search radius in meters

    // Function to fetch city/town name from coordinates
    function fetchLocationName(latitude, longitude) {
        const apiKey = "AIzaSyDLStNUKDdSceRxEUAx-JNzG2q6efosqzQ";
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const addressComponents = data.results[0].address_components;
                    const cityComponent = addressComponents.find(comp => comp.types.includes("locality"));
                    userLocation = cityComponent ? cityComponent.long_name : "your area";
                    nameContainer.innerHTML = `Fetching bars in ${userLocation}...`;
                }
            })
            .catch(error => {
                console.error("Error fetching location name:", error);
                userLocation = "your area";
                nameContainer.innerHTML = `Fetching bars in ${userLocation}...`;
            });
    }

    // Function to fetch pubs from Google Places API
    function fetchPubs(latitude, longitude) {
        const apiKey = "AIzaSyAFbKHEHoYUAOTsqaOu1ZuRleo4IT0AZ34";
        const type = "bar";
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;

        nameContainer.innerHTML = `Fetching bars in ${userLocation}...`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    pubs = data.results.map(pub => pub.name);
                    nameContainer.innerHTML = `<h2>Bars found in ${userLocation}:</h2><ul>${pubs.map(pub => `<li>${pub}</li>`).join('')}</ul>`;
                } else {
                    nameContainer.innerHTML = `No pubs found in ${userLocation}.`;
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
                    fetchLocationName(position.coords.latitude, position.coords.longitude);
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
            nameContainer.innerHTML = `Fetching bars in ${userLocation}...`;
        }
    }

    // Event listener for button click
    changeBarButton.addEventListener("click", changeBar);

    // Fetch user's location and pubs on page load
    getLocation();
});






