const addParcelApi = 'http://localhost:4000/parcel/add'
const allParcels = 'http://localhost:4000/parcel/all'
const viewParcel = 'http://localhost:4000/parcel/view'
const updateParcel = 'http://localhost:4000/parcel/update'
const deleteParcelApi = 'http://localhost:4000/parcel/delete'
const apiKey = 'AIzaSyAe86afBcUSKOOHeXmaqy3kgR1OHHcfvEY'

const logout = document.getElementById('logout')
const openParcelForm = document.getElementById('openParcelForm')
const closeParcelFrom = document.querySelector('.close-btn')
const parcelForm = document.querySelector('.parcel-form')
const formErrorMsg = document.getElementById("form-error");
const formSuccess = document.querySelector(".formSuccess");
const tableBody = document.querySelector(".items table tbody");


logout.addEventListener("click", () => {
    alert('Are you sure you want to log out?')

    localStorage.clear();
    window.location.href = "http://127.0.0.1:5502/sendIt-fe/index.html";
})

openParcelForm.addEventListener('click', () => {
    parcelForm.style.display = "block"
})

closeParcelFrom.addEventListener('click', () => {
    parcelForm.style.display = 'none'
})

const userRole = JSON.parse(localStorage.getItem('is_admin'));

const formBtn = document.querySelector('.add-btn');
const editBtns = document.querySelectorAll('.edit-btn')

// if (!userRole) {
//     formBtn.style.display = 'none'
//     editBtns.forEach(editBtn => {
//         editBtn.style.display = 'none';
//     });
// }


document.addEventListener("DOMContentLoaded", () => {
    const locations = {
        mombasa: { lat: -4.0435, lng: 39.6682 },
        nairobi: { lat: -1.286389, lng: 36.817223 },
        nyeri: { lat: -0.4167, lng: 36.9500 },
        nakuru: { lat: -0.3031, lng: 36.0800 }
    };

    const recipientLocation = document.getElementById("recipientLocation");
    const senderLocation = document.getElementById("senderLocation");

    function updateCoordinates(selectElement, latInputId, lngInputId, sessionLatKey, sessionLngKey) {
        const selectedValue = selectElement.value;
        if (locations[selectedValue]) {
            const lat = locations[selectedValue].lat;
            const lng = locations[selectedValue].lng;

            document.getElementById(latInputId).value = lat;
            document.getElementById(lngInputId).value = lng;

            sessionStorage.setItem(sessionLatKey, lat);
            sessionStorage.setItem(sessionLngKey, lng);
        }
    }

    recipientLocation.addEventListener("change", () => {
        updateCoordinates(recipientLocation, "recipientLatitude", "recipientLongitude", "receiverLat", "receiverLng");
    });

    senderLocation.addEventListener("change", () => {
        updateCoordinates(senderLocation, "senderLatitude", "senderLongitude", "senderLat", "senderLng");
    });

    updateCoordinates(recipientLocation, "recipientLatitude", "recipientLongitude", "receiverLat", "receiverLng");
    updateCoordinates(senderLocation, "senderLatitude", "senderLongitude", "senderLat", "senderLng");
});

document.getElementById("parcelForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const parcelForm = document.getElementById("parcelForm");
    const parcelId = parcelForm.dataset.parcelId || null;

    const senderEmail = document.getElementById('senderEmail').value.trim();
    const senderNumber = document.getElementById('senderNumber').value.trim();
    const receiverEmail = document.getElementById('receipientEmail').value.trim(); 
    const receiverNumber = document.getElementById('receiverNumber').value.trim(); 
    const dispatchedDate = document.getElementById('dispatchDate').value.trim();
    const deliveryStatus = document.getElementById('status').value.trim();
    const receiverLat = sessionStorage.getItem('receiverLat') || null;
    const receiverLng = sessionStorage.getItem('receiverLng') || null;
    const senderLat = sessionStorage.getItem('senderLat') || null;
    const senderLng = sessionStorage.getItem('senderLng') || null;
    // const price = 0;
    const distance = calculateDistance(parseFloat(senderLat), parseFloat(senderLng), parseFloat(receiverLat), parseFloat(receiverLng));
    const price = distance.toFixed(2); // 1 dollar per kilometer
    console.log(`price ${price}`);

    if (!senderEmail || !senderNumber || !receiverEmail || !receiverNumber || !dispatchedDate) {
        console.log('Incomplete form submission.');

        const formErrorMsg = document.getElementById("form-error");
        formErrorMsg.textContent = 'Please fill in all the fields';
        formErrorMsg.style.display = "block";
        setTimeout(() => {
            formErrorMsg.style.display = "none";
        }, 4000);
        return;
    }

    try {
        const newParcel = {
            senderEmail,
            senderNumber,
            receiverEmail,
            receiverNumber,
            dispatchedDate,
            deliveryStatus,
            receiverLat,
            receiverLng,
            senderLat,
            senderLng,
            price
        };

        let response;
        if (parcelId) {
            console.log(`Updating parcel ID: ${parcelId}`);
            response = await fetch(`${updateParcel}/${parcelId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newParcel)
            });
        } else {
            console.log("Adding a new parcel");
            response = await fetch(addParcelApi, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newParcel)
            });
        }

        // Check if the response is JSON before parsing
        const contentType = response.headers.get('Content-Type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const responseText = await response.text(); // Log the raw response text
            console.error('Expected JSON but received:', responseText);
            throw new Error('Unexpected response format');
        }

        console.log(`Res data ${data}`);

        if (!response.ok) {
            console.error("API Error:", data);
            throw new Error(data.message || "Failed to process request.");
        }

        const stripeResponse = await fetch("http://localhost:4000/payment/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newParcel)
        });

        const stripeData = await stripeResponse.json();
        if (stripeData.url) {
            window.location.href = stripeData.url; // Redirect to Stripe Checkout
        } else {
            console.error("Error: No URL received from backend.");
        }

        formSuccess.textContent = parcelId ? "Parcel updated successfully!" : "Parcel added successfully!";
        formSuccess.style.display = "block";
        parcelForm.style.display = 'none';

        setTimeout(() => {
            formSuccess.style.display = "none";
            parcelForm.reset();
            sessionStorage.clear();
        }, 3000);

        getAllParcels();

    } catch (error) {
        console.error("Request Error:", error);
        const formErrorMsg = document.getElementById("form-error");
        formErrorMsg.textContent = error.message;
        formErrorMsg.style.display = "block";
        setTimeout(() => {
            formErrorMsg.style.display = "none";
        }, 4000);
    }
});


function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

const getLocationName = async (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
            return data.results[0].formatted_address; 
        } else {
            throw new Error("No results found");
        }
    } catch (error) {
        console.error("Geocoding error:", error.message);
        return "Unknown location";
    }
};

const itemsPerPage = 10;
let currentPage = 1;
let parcelsData = [];

// const tableBody = document.getElementById("table-body"); // Ensure this matches your table's tbody ID
const pageInfo = document.getElementById("page-info");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");

const renderTable = () => {
    tableBody.innerHTML = "";
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedParcels = parcelsData.slice(start, end);

    for (let parcel of paginatedParcels) {
        const senderLocation = parcel.senderLocation || "Loading...";
        const receiverLocation = parcel.receiverLocation || "Loading...";

        let fetchedParcel = document.createElement('tr');
        fetchedParcel.innerHTML = `
            <td>${parcel.senderEmail}</td>
            <td>${parcel.receiverEmail}</td>
            <td>${senderLocation}</td>
            <td>${receiverLocation}</td>
            <td>${parcel.dispatchedDate.split('T')[0]}</td>
            <td>${parcel.deliveryStatus}</td>
            <td>
                <div class="action-btns">
                    ${!userRole ? `<button class="parcelDetailsBtn" data-id="${parcel.id}">View</button>` : ""}
                    ${userRole ? `<button class="deleteParcel" data-id="${parcel.id}">Delete</button>` : ""}
                    ${userRole ? `<button class="edit-btn" data-id="${parcel.id}">Edit</button>` : ""}
                </div>
            </td>
        `;

        tableBody.appendChild(fetchedParcel);
    }

    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(parcelsData.length / itemsPerPage)}`;
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = end >= parcelsData.length;
};

const getAllParcels = async () => {
    if (userRole) {
        try {
            const response = await fetch(allParcels);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const parcels = await response.json();

            tableBody.innerHTML = "";
            for (let parcel of parcels) {
                const senderLocation = await getLocationName(parcel.senderLat, parcel.senderLng);
                const receiverLocation = await getLocationName(parcel.receiverLat, parcel.receiverLng);

                let fetchedParcel = document.createElement('tr');
                fetchedParcel.innerHTML = `
                    <td>${parcel.senderEmail}</td>
                    <td>${parcel.receiverEmail}</td>
                    <td>${senderLocation}</td>
                    <td>${receiverLocation}</td>
                    <td>${parcel.dispatchedDate.split('T')[0]}</td>
                    <td>${parcel.deliveryStatus}</td>
                    <td>
                        <div class="action-btns">
                            ${!userRole ? `<button class="parcelDetailsBtn" data-id="${parcel.id}">View</button>` : ""}
                            ${userRole ? `<button class="deleteParcel" data-id="${parcel.id}">Delete</button>` : ""}
                            ${userRole ? `<button id="edit-btn" class="edit-btn" data-id="${parcel.id}">Edit</button>` : ""}
                        </div>
                    </td>
                `;

                tableBody.appendChild(fetchedParcel);
            }

        } catch (error) {
            console.error(error.message);
        }
    } else {
        try {
            userEmail = sessionStorage.getItem('user_email');
            console.log("User Email:", userEmail);

            let sentParcels = `${allParcels}?senderEmail=${encodeURIComponent(userEmail)}`;
            let receivedParcels = `${allParcels}?receiverEmail=${encodeURIComponent(userEmail)}`;

            const sentResponse = await fetch(sentParcels);
            if (!sentResponse.ok) {
                throw new Error(`Response status: ${sentResponse.status}`);
            }
            const parcelsSent = await sentResponse.json();
            console.log("Parcels Sent:", parcelsSent);
            // if(parcelsSent.length == 0 || parcelsReceived.length == 0){
            //     const noParcel = document.getElementById('no-parcels')
            //     noParcel.style.display = 'none'
            // }
            if(parcelsSent.length > 0){
                tableBody.innerHTML = "";
                for(parcel of parcelsSent){
                    const senderLocation = await getLocationName(parcel.senderLat, parcel.senderLng);
                const receiverLocation = await getLocationName(parcel.receiverLat, parcel.receiverLng);

                let fetchedParcel = document.createElement('tr');
                fetchedParcel.innerHTML = `
                    <td>${parcel.senderEmail}</td>
                    <td>${parcel.receiverEmail}</td>
                    <td>${senderLocation}</td>
                    <td>${receiverLocation}</td>
                    <td>${parcel.dispatchedDate.split('T')[0]}</td>
                    <td>${parcel.deliveryStatus}</td>
                    <td>
                        <div class="action-btns">
                            <button class="parcelDetailsBtn" data-id="${parcel.id}">View</button>
                        </div>
                    </td>
                `;

                tableBody.appendChild(fetchedParcel);
                }
            }
            
            document.getElementById("incoming").addEventListener("click", async (event) => {
                event.preventDefault();
            
            const receivedResponse = await fetch(receivedParcels);
            if (!receivedResponse.ok) {
                throw new Error(`Response status: ${receivedResponse.status}`);
            }
            const parcelsReceived = await receivedResponse.json();
            if(parcelsReceived.length > 0){
                tableBody.innerHTML = "";

                for(parcel of parcelsReceived){
                    const senderLocation = await getLocationName(parcel.senderLat, parcel.senderLng);
                const receiverLocation = await getLocationName(parcel.receiverLat, parcel.receiverLng);

                let fetchedParcel = document.createElement('tr');
                fetchedParcel.innerHTML = `
                    <td>${parcel.senderEmail}</td>
                    <td>${parcel.receiverEmail}</td>
                    <td>${senderLocation}</td>
                    <td>${receiverLocation}</td>
                    <td>${parcel.dispatchedDate.split('T')[0]}</td>
                    <td>${parcel.deliveryDate.split('T')[0]}</td>
                    <td>${parcel.deliveryStatus}</td>
                    <td>
                        <div class="action-btns">
                            <button class="parcelDetailsBtn" data-id="${parcel.id}">View</button>
                        </div>
                    </td>
                `;

                tableBody.appendChild(fetchedParcel);
                }
            }
            console.log("Parcels Received:", parcelsReceived);
        })

        } catch (error) {
            console.error("Error fetching user parcels:", error);
        }
    }
};

prevPage.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

nextPage.addEventListener("click", () => {
    if ((currentPage * itemsPerPage) < parcelsData.length) {
        currentPage++;
        
        renderTable();
    }
});

getAllParcels()


document.addEventListener("click", function (event) {
    if (event.target.classList.contains("parcelDetailsBtn")) {
        const parcelId = event.target.getAttribute("data-id");

        window.location.href = `parcel-details.html?id=${parcelId}`;
    }
});

document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("edit-btn")) {
        const parcelId = event.target.getAttribute("data-id");
        editParcel(parcelId);
        parcelForm.style.display = 'block'
    }
});

const editParcel = async (parcelId) => {
    try {
        const response = await fetch(`${viewParcel}/${parcelId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch parcel details");
        }
        const parcel = await response.json();

        document.getElementById("senderEmail").value = parcel[0].senderEmail;
        document.getElementById("senderNumber").value = parcel[0].senderNumber;
        document.getElementById("receipientEmail").value = parcel[0].receiverEmail;
        document.getElementById("receiverNumber").value = parcel[0].receiverNumber;
        document.getElementById("dispatchDate").value = parcel[0].dispatchedDate.split('T')[0];
        document.getElementById("status").value = parcel[0].deliveryStatus;

        document.getElementById("parcelForm").dataset.parcelId = parcelId;

        document.querySelector(".parcel-form").style.display = "block";
    } catch (error) {
        console.error(error.message);
    }
};

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("deleteParcel")) {
            const parcelId = event.target.dataset.id; 
            confirmDelete(parcelId);
        }
    });
});

function confirmDelete(parcelId) {
    const isConfirmed = confirm("Are you sure you want to delete this parcel?");
    if (isConfirmed) {
        deleteParcel(parcelId);
    }
}

async function deleteParcel(parcelId) {
    try {
        const response = await fetch(`${deleteParcelApi}/${parcelId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete parcel.");
        }

        formSuccess.textContent = "Parcel deleted successfully!"
        formSuccess.style.display = "block";

        setTimeout(() => {
            formSuccess.style.display = "none";
        }, 3000);
        getAllParcels(); 

    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
}


