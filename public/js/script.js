// =====================================
// HOMEPAGE JAVASCRIPT
// =====================================

const searchForm =
    document.getElementById("searchForm");


// =====================================
// SEARCH FORM
// =====================================

if (searchForm) {

    searchForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const destination =
                document
                    .getElementById("destination")
                    .value
                    .trim();


            const checkIn =
                document
                    .getElementById("checkIn")
                    .value;


            const checkOut =
                document
                    .getElementById("checkOut")
                    .value;


            const guests =
                document
                    .getElementById("guests")
                    .value;


            // Validate destination

            if (!destination) {

                alert(
                    "Please enter a destination."
                );

                return;

            }


            // Validate dates

            if (!checkIn || !checkOut) {

                alert(
                    "Please select check-in and check-out dates."
                );

                return;

            }


            // Check-out must be after check-in

            if (
                new Date(checkOut) <=
                new Date(checkIn)
            ) {

                alert(
                    "Check-out date must be after check-in date."
                );

                return;

            }


            // Save search information

            const searchData = {

                destination:
                    destination,

                checkIn:
                    checkIn,

                checkOut:
                    checkOut,

                guests:
                    guests

            };


            localStorage.setItem(
                "hotelSearch",
                JSON.stringify(searchData)
            );


            // Go to hotel listing

            window.location.href =
                "hotels.html";

        }
    );

}


// =====================================
// VIEW HOTEL
// =====================================

function viewHotel(id) {

    window.location.href =
        `hotel-details.html?id=${id}`;

}