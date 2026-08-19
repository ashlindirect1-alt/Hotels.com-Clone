// =====================================
// CONFIRMATION PAGE
// =====================================


// Get confirmation data

const confirmationData =
    localStorage.getItem(
        "bookingConfirmation"
    );


// Get page container

const bookingInformation =
    document.getElementById(
        "bookingInformation"
    );


// =====================================
// CHECK DATA
// =====================================

if (!confirmationData) {

    bookingInformation.innerHTML = `

        <div style="padding: 30px; text-align: center;">

            <h2>
                No booking information found.
            </h2>

            <p>
                Please make a booking first.
            </p>

        </div>

    `;

}
else {

    try {

        const data =
            JSON.parse(
                confirmationData
            );


        const booking =
            data.booking;


        const hotel =
            data.hotel;


        const total =
            data.total;


        const nights =
            data.nights;


        // =====================================
        // DISPLAY INFORMATION
        // =====================================

        bookingInformation.innerHTML = `

            <div class="confirmation-hotel">

                <img
                    src="${hotel.image}"
                    alt="${hotel.name}"
                >


                <div>

                    <h2>
                        ${hotel.name}
                    </h2>


                    <p>
                        📍 ${hotel.location}
                    </p>


                    <p>
                        ⭐ ${hotel.rating} / 5
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

    catch (error) {

        console.error(
            "Confirmation error:",
            error
        );


        bookingInformation.innerHTML = `

            <div style="padding: 30px; text-align: center;">

                <h2>
                    Unable to display booking.
                </h2>

                <p>
                    Please try again.
                </p>

            </div>

        `;

    }

}