// =====================================
// CONFIRMATION JAVASCRIPT
// =====================================


// =====================================
// GET BOOKING ID
// =====================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const bookingId =
    urlParams.get("booking");


// =====================================
// ELEMENT
// =====================================

const bookingInformation =
    document.getElementById(
        "bookingInformation"
    );


// =====================================
// LOAD BOOKING
// =====================================

async function loadBooking() {

    if (!bookingId) {

        showError(
            "Booking information is missing."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `/api/bookings/${bookingId}`
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Booking not found."
            );

        }


        displayBooking(
            data.booking
        );

    }

    catch (error) {

        console.error(
            "Booking error:",
            error
        );


        showError(
            "Unable to load your booking information."
        );

    }

}


// =====================================
// DISPLAY BOOKING
// =====================================

function displayBooking(booking) {

    // Calculate number of nights

    const startDate =
        new Date(
            booking.check_in
        );


    const endDate =
        new Date(
            booking.check_out
        );


    const difference =
        endDate - startDate;


    const nights =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    // Calculate total price

    const total =
        nights *
        Number(
            booking.hotel_price
        );


    bookingInformation.innerHTML = `

        <div class="confirmation-hotel">

            <img
                src="${booking.hotel_image}"
                alt="${booking.hotel_name}"
            >

            <div>

                <h2>
                    ${booking.hotel_name}
                </h2>

                <p>
                    📍 ${booking.hotel_location}
                </p>

                <p>
                    ⭐ ${booking.hotel_rating} / 5
                </p>

            </div>

        </div>


        <div class="booking-details">


            <div class="detail-row">

                <span class="detail-label">
                    Booking ID
                </span>

                <span class="detail-value booking-id">
                    #${booking.id}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Guest Name
                </span>

                <span class="detail-value">
                    ${booking.guest_name}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Email
                </span>

                <span class="detail-value">
                    ${booking.email}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Check-in
                </span>

                <span class="detail-value">
                    ${booking.check_in}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Check-out
                </span>

                <span class="detail-value">
                    ${booking.check_out}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Guests
                </span>

                <span class="detail-value">
                    ${booking.guests}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Number of Nights
                </span>

                <span class="detail-value">
                    ${nights}
                </span>

            </div>


            <div class="detail-row total-row">

                <span class="detail-label">
                    Total Price
                </span>

                <span class="detail-value">
                    $${total}
                </span>

            </div>


        </div>

    `;

}


// =====================================
// ERROR MESSAGE
// =====================================

function showError(message) {

    bookingInformation.innerHTML = `

        <div
            style="
                padding: 30px;
                text-align: center;
            "
        >

            <h2>
                Unable to display booking
            </h2>

            <p>
                ${message}
            </p>

            <br>

            <button
                onclick="window.location.href='index.html'"
                class="home-btn"
            >
                Back to Home
            </button>

        </div>

    `;

}


// =====================================
// START
// =====================================

loadBooking();