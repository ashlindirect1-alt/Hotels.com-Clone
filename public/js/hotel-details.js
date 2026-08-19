// =====================================
// HOTEL DETAILS JAVASCRIPT
// =====================================


// Get hotel ID from URL

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const hotelId =
    urlParams.get("id");


// Get container

const hotelDetails =
    document.getElementById(
        "hotelDetails"
    );


// =====================================
// LOAD HOTEL
// =====================================

async function loadHotel() {


    if (!hotelId) {

        showError(
            "Hotel ID was not provided."
        );

        return;

    }


    try {


        const response =
            await fetch(
                `/api/hotels/${hotelId}`
            );


        const data =
            await response.json();


        if (!data.success) {

            showError(
                "Hotel not found."
            );

            return;

        }


        displayHotel(
            data.hotel
        );


    }

    catch (error) {

        console.error(
            "Error loading hotel:",
            error
        );


        showError(
            "Unable to load hotel details."
        );

    }

}


// =====================================
// DISPLAY HOTEL
// =====================================

function displayHotel(hotel) {


    const amenities =
        hotel.amenities
            .split(",")
            .map(
                amenity =>
                    `<span class="amenity">
                        ✓ ${amenity.trim()}
                    </span>`
            )
            .join("");


    hotelDetails.innerHTML = `

        <div class="details-image">

            <img
                src="${hotel.image}"
                alt="${hotel.name}"
            >

        </div>


        <div class="details-content">


            <span class="details-type">

                ${hotel.type}

            </span>


            <h1>

                ${hotel.name}

            </h1>


            <p class="details-location">

                📍 ${hotel.location}

            </p>


            <div class="details-rating">

                ⭐ ${hotel.rating} / 5

            </div>


            <p class="details-description">

                ${hotel.description}

            </p>


            <h2>
                Amenities
            </h2>


            <div class="amenities">

                ${amenities}

            </div>


            <div class="booking-box">


                <div>

                    <p>
                        Price per night
                    </p>


                    <strong>
                        $${hotel.price}
                    </strong>

                </div>


                <button
                    class="book-now-btn"
                    onclick="bookHotel(${hotel.id})"
                >
                    Book Now
                </button>


            </div>

        </div>

    `;

}


// =====================================
// BOOK HOTEL
// =====================================

function bookHotel(id) {


    window.location.href =
        `booking.html?hotel=${id}`;

}


// =====================================
// ERROR
// =====================================

function showError(message) {


    hotelDetails.innerHTML = `

        <div class="details-error">

            <h2>
                ${message}
            </h2>

            <button
                onclick="window.location.href='hotels.html'"
            >
                Back to Hotels
            </button>

        </div>

    `;

}


// =====================================
// START
// =====================================

loadHotel();