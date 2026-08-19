// =====================================
// HOTELS LISTING JAVASCRIPT
// =====================================


// =====================================
// GLOBAL VARIABLES
// =====================================

let allHotels = [];

let filteredHotels = [];


// =====================================
// GET ELEMENTS
// =====================================

const hotelList =
    document.getElementById("hotelList");

const noResults =
    document.getElementById("noResults");

const priceFilter =
    document.getElementById("priceFilter");

const priceValue =
    document.getElementById("priceValue");

const ratingFilter =
    document.getElementById("ratingFilter");

const typeFilter =
    document.getElementById("typeFilter");

const sortSelect =
    document.getElementById("sortSelect");

const resetFilters =
    document.getElementById("resetFilters");

const searchSummary =
    document.getElementById("searchSummary");


// =====================================
// LOAD HOTELS
// =====================================

async function loadHotels() {

    try {

        const searchData =
            JSON.parse(
                localStorage.getItem("hotelSearch")
            );


        let url =
            "/api/hotels";


        // If user searched for a destination

        if (
            searchData &&
            searchData.destination
        ) {

            url =
                "/api/hotels/search?destination=" +
                encodeURIComponent(
                    searchData.destination
                );


            searchSummary.textContent =
                `Hotels in ${searchData.destination}`;

        }


        const response =
            await fetch(url);


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                "Unable to load hotels."
            );

        }


        allHotels =
            data.hotels;


        filteredHotels =
            [...allHotels];


        displayHotels(
            filteredHotels
        );

    }

    catch (error) {

        console.error(
            "Error:",
            error
        );


        hotelList.innerHTML = `

            <div class="no-results"
                 style="display:block">

                <h2>
                    Unable to load hotels
                </h2>

                <p>
                    Please make sure the server is running.
                </p>

            </div>

        `;

    }

}


// =====================================
// DISPLAY HOTELS
// =====================================

function displayHotels(hotels) {


    hotelList.innerHTML = "";


    if (hotels.length === 0) {

        noResults.style.display =
            "block";

        return;

    }


    noResults.style.display =
        "none";


    hotels.forEach((hotel) => {


        const card =
            document.createElement("div");


        card.className =
            "listing-card";


        card.innerHTML = `

            <img
                src="${hotel.image}"
                alt="${hotel.name}"
            >


            <div class="listing-info">

                <h3>
                    ${hotel.name}
                </h3>


                <p class="hotel-location">
                    📍 ${hotel.location}
                </p>


                <p class="hotel-description">
                    ${hotel.description}
                </p>


                <span class="hotel-type">
                    ${hotel.type}
                </span>


                <div class="hotel-rating">
                    ⭐ ${hotel.rating} / 5
                </div>


                <div class="hotel-bottom">

                    <div class="hotel-price">

                        $${hotel.price}

                        <span>
                            / night
                        </span>

                    </div>


                    <button
                        class="details-btn"
                        onclick="viewHotel(${hotel.id})"
                    >
                        View Hotel
                    </button>

                </div>

            </div>

        `;


        hotelList.appendChild(card);

    });

}


// =====================================
// APPLY FILTERS
// =====================================

function applyFilters() {


    const maxPrice =
        Number(
            priceFilter.value
        );


    const minRating =
        Number(
            ratingFilter.value
        );


    const selectedType =
        typeFilter.value;


    filteredHotels =
        allHotels.filter(
            (hotel) => {


                const priceMatch =
                    hotel.price <= maxPrice;


                const ratingMatch =
                    hotel.rating >= minRating;


                const typeMatch =
                    selectedType === "all" ||
                    hotel.type === selectedType;


                return (
                    priceMatch &&
                    ratingMatch &&
                    typeMatch
                );

            }
        );


    sortHotels();


}


// =====================================
// SORT HOTELS
// =====================================

function sortHotels() {


    const sort =
        sortSelect.value;


    if (sort === "price-low") {

        filteredHotels.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    else if (sort === "price-high") {

        filteredHotels.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    else {

        filteredHotels.sort(
            (a, b) =>
                b.rating - a.rating
        );

    }


    displayHotels(
        filteredHotels
    );

}


// =====================================
// PRICE FILTER
// =====================================

priceFilter.addEventListener(
    "input",
    function() {

        priceValue.textContent =
            this.value;

        applyFilters();

    }
);


// =====================================
// RATING FILTER
// =====================================

ratingFilter.addEventListener(
    "change",
    function() {

        applyFilters();

    }
);


// =====================================
// TYPE FILTER
// =====================================

typeFilter.addEventListener(
    "change",
    function() {

        applyFilters();

    }
);


// =====================================
// SORT
// =====================================

sortSelect.addEventListener(
    "change",
    function() {

        sortHotels();

    }
);


// =====================================
// RESET FILTERS
// =====================================

resetFilters.addEventListener(
    "click",
    function() {


        priceFilter.value =
            200;


        priceValue.textContent =
            200;


        ratingFilter.value =
            0;


        typeFilter.value =
            "all";


        sortSelect.value =
            "rating";


        filteredHotels =
            [...allHotels];


        sortHotels();

    }
);


// =====================================
// VIEW HOTEL
// =====================================

function viewHotel(id) {


    window.location.href =
        `hotel-details.html?id=${id}`;

}


// =====================================
// START
// =====================================

loadHotels();