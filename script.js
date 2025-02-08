document.addEventListener("DOMContentLoaded", function () {
    const nameContainer = document.getElementById("name-container");
    const changeBarButton = document.getElementById("change-bar-button");
    let pubs = []; // Stores fetched pubs
    let userLocation = "your area"; // Stores user's city/town name
    const radius = 20000; // 20km search radius
    const apiKey = "AIzaSyDLStNUKDdSceRxEUAx-JNzG2q6efosqzQ"; // Use a single API key

    // Create a loading spinner
    function showLoading() {
        nameContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading...</p>
            </div>
        `;
    }

    // Function to fetch city/town name from coordinates using Geocoding API
    function fetchLocationName(latitude, longitude) {
        const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        showLoading(); // Show loading indicator

        fetch(geoUrl)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
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
        const type = "bar"; // Define type
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;

        showLoading(); // Show loading indicator

        fetch(placesUrl)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
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
            showLoading(); // Show loading indicator before fetching location

            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    fetchLocationName(latitude, longitude);
                    fetchPubs(latitude, longitude);
                },
                error => {
                    console.error("Geolocation error:", error);
                    nameContainer.innerHTML = "Could not get location. Please enable location services and try again.";
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
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
            showLoading(); // Show loading if no pubs found yet
        }
    }

    // Event listener for button click
    changeBarButton.addEventListener("click", changeBar);

    // Fetch user's location and pubs on page load
    getLocation();
});



