// =====================================
// BOOKING JAVASCRIPT
// =====================================


// =====================================
// GET HOTEL ID
// =====================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const hotelId =
    urlParams.get("hotel");


// =====================================
// ELEMENTS
// =====================================

const hotelSummary =
    document.getElementById(
        "hotelSummary"
    );

const bookingForm =
    document.getElementById(
        "bookingForm"
    );

const checkIn =
    document.getElementById(
        "checkIn"
    );

const checkOut =
    document.getElementById(
        "checkOut"
    );

const nightlyPrice =
    document.getElementById(
        "nightlyPrice"
    );

const numberOfNights =
    document.getElementById(
        "numberOfNights"
    );

const totalPrice =
    document.getElementById(
        "totalPrice"
    );


// Store current hotel

let currentHotel = null;


// =====================================
// LOAD HOTEL
// =====================================

async function loadHotel() {

    if (!hotelId) {

        hotelSummary.innerHTML = `
            <p>
                Hotel information is missing.
            </p>
        `;

        bookingForm.style.display =
            "none";

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

            throw new Error(
                "Hotel not found."
            );

        }


        currentHotel =
            data.hotel;


        displayHotelSummary();


    } catch (error) {

        console.error(
            error
        );


        hotelSummary.innerHTML = `
            <p>
                Unable to load hotel information.
            </p>
        `;

    }

}


// =====================================
// HOTEL SUMMARY
// =====================================

function displayHotelSummary() {

    hotelSummary.innerHTML = `

        <div class="summary-content">

            <img
                src="${currentHotel.image}"
                alt="${currentHotel.name}"
            >

            <div class="summary-info">

                <h2>
                    ${currentHotel.name}
                </h2>

                <p>
                    📍 ${currentHotel.location}
                </p>

                <p>
                    ⭐ ${currentHotel.rating} / 5
                </p>

                <p>
                    $${currentHotel.price} / night
                </p>

            </div>

        </div>

    `;


    nightlyPrice.textContent =
        `$${currentHotel.price}`;

}


// =====================================
// DATE VALIDATION
// =====================================

function calculatePrice() {

    if (
        !checkIn.value ||
        !checkOut.value ||
        !currentHotel
    ) {

        numberOfNights.textContent =
            "0";

        totalPrice.textContent =
            "$0";

        return;

    }


    const startDate =
        new Date(
            checkIn.value
        );


    const endDate =
        new Date(
            checkOut.value
        );


    const difference =
        endDate - startDate;


    const nights =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    if (nights <= 0) {

        numberOfNights.textContent =
            "0";

        totalPrice.textContent =
            "$0";

        return;

    }


    numberOfNights.textContent =
        nights;


    const total =
        nights *
        currentHotel.price;


    totalPrice.textContent =
        `$${total}`;

}


// =====================================
// DATE EVENTS
// =====================================

checkIn.addEventListener(
    "change",
    function() {

        if (checkIn.value) {

            checkOut.min =
                checkIn.value;

        }

        calculatePrice();

    }
);


checkOut.addEventListener(
    "change",
    function() {

        calculatePrice();

    }
);


// =====================================
// BOOKING SUBMISSION
// =====================================

bookingForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const guestName =
            document.getElementById(
                "guestName"
            ).value.trim();


        const email =
            document.getElementById(
                "email"
            ).value.trim();


        const guests =
            Number(
                document.getElementById(
                    "guests"
                ).value
            );


        if (
            !guestName ||
            !email ||
            !checkIn.value ||
            !checkOut.value
        ) {

            alert(
                "Please complete all required fields."
            );

            return;

        }


        const startDate =
            new Date(
                checkIn.value
            );


        const endDate =
            new Date(
                checkOut.value
            );


        if (endDate <= startDate) {

            alert(
                "Check-out date must be after check-in date."
            );

            return;

        }


        const difference =
            endDate - startDate;


        const nights =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );


        const total =
            nights *
            currentHotel.price;


        const bookingData = {

            hotel_id:
                Number(hotelId),

            guest_name:
                guestName,

            email:
                email,

            check_in:
                checkIn.value,

            check_out:
                checkOut.value,

            guests:
                guests,

            total_price:
                total

        };


        try {

            const response =
                await fetch(
                    "/api/bookings",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                bookingData
                            )

                    }
                );


            const data =
                await response.json();


            if (!data.success) {

                alert(
                    data.message ||
                    "Booking failed."
                );

                return;

            }


            // Save confirmation information

            localStorage.setItem(
                "bookingConfirmation",
                JSON.stringify({
                    booking:
                        data.booking,

                    hotel:
                        currentHotel,

                    total:
                        total,

                    nights:
                        nights
                })
            );


            // Go to confirmation page

            window.location.href =
                "confirmation.html";

        }

        catch (error) {

            console.error(
                "Booking error:",
                error
            );


            alert(
                "Unable to complete booking. Please try again."
            );

        }

    }
);


// =====================================
// START
// =====================================

loadHotel();