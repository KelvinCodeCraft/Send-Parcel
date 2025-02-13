const apiKey = "AIzaSyAe86afBcUSKOOHeXmaqy3kgR1OHHcfvEY"; // Replace with your actual API key

document.addEventListener("DOMContentLoaded", () => {
    loadGoogleMaps();
});

function loadGoogleMaps() {
    if (!document.getElementById("google-maps-script")) {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=fetchParcelDetails&libraries=marker&loading=async`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    } else {
        fetchParcelDetails(); // If already loaded, fetch data
    }
}

function fetchParcelDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const parcelId = urlParams.get("id");

    if (!parcelId) {
        console.error("No parcel ID found in URL");
        return;
    }

    fetch(`http://localhost:4000/parcel/view/${parcelId}`)
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                console.error("No parcel data received!");
                return;
            }

            const parcel = data[0]; // API returns an array

            const senderLat = parseFloat(parcel.senderLat);
            const senderLng = parseFloat(parcel.senderLng);
            const receiverLat = parseFloat(parcel.receiverLat);
            const receiverLng = parseFloat(parcel.receiverLng);

            if (isNaN(senderLat) || isNaN(senderLng) || isNaN(receiverLat) || isNaN(receiverLng)) {
                console.error("Invalid coordinates detected!", { senderLat, senderLng, receiverLat, receiverLng });
                return;
            }

            console.log("Valid coordinates:", { senderLat, senderLng, receiverLat, receiverLng });

            displayParcelDetails(parcel);
            initMap(senderLat, senderLng, receiverLat, receiverLng);
        })
        .catch(error => console.error("Error fetching parcel details:", error));
}

function displayParcelDetails(parcel) {
    document.getElementById("senderName").textContent = parcel.senderName;
    document.getElementById("senderEmail").textContent = parcel.senderEmail;
    document.getElementById("receiverName").textContent = parcel.receiverName;
    document.getElementById("receiverEmail").textContent = parcel.receiverEmail;
    document.getElementById("parcelWeight").textContent = parcel.parcelWeight + " kg";
    document.getElementById("price").textContent = "Ksh " + parcel.price;
    document.getElementById("deliveryStatus").textContent = parcel.deliveryStatus;
    document.getElementById("dispatchedDate").textContent = new Date(parcel.dispatchedDate).toLocaleDateString();
    document.getElementById("deliveryDate").textContent = new Date(parcel.deliveryDate).toLocaleDateString();
}

function initMap(senderLat, senderLng, receiverLat, receiverLng) {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: senderLat, lng: senderLng }, // Default to sender location
        mapId: "DEMO_MAP_ID",
    });

    new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: { lat: senderLat, lng: senderLng },
        title: "Sender Location",
    });

    new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: { lat: receiverLat, lng: receiverLng },
        title: "Receiver Location",
    });
}
