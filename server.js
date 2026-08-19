const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database");

const app = express();

const PORT = 3000;


// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// =====================================
// SERVE FRONTEND FILES
// =====================================

app.use(express.static(
    path.join(__dirname, "public")
));


// =====================================
// HOME PAGE
// =====================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});


// =====================================
// TEST API
// =====================================

app.get("/api/test", (req, res) => {

    res.json({

        success: true,

        message:
            "Hotels.com Clone API is working!"

    });

});


// =====================================
// GET ALL HOTELS
// =====================================

app.get("/api/hotels", (req, res) => {

    const sql = `
        SELECT *
        FROM hotels
        ORDER BY rating DESC
    `;


    db.all(sql, [], (err, rows) => {

        if (err) {

            console.error(
                "Error fetching hotels:",
                err.message
            );

            return res.status(500).json({

                success: false,

                message: "Failed to fetch hotels."

            });

        }


        res.json({

            success: true,

            count: rows.length,

            hotels: rows

        });

    });

});


// =====================================
// SEARCH HOTELS
// =====================================

app.get("/api/hotels/search", (req, res) => {

    const {
        destination
    } = req.query;


    if (!destination) {

        return res.status(400).json({

            success: false,

            message:
                "Destination is required."

        });

    }


    const sql = `
        SELECT *
        FROM hotels
        WHERE location LIKE ?
        ORDER BY rating DESC
    `;


    const searchValue =
        `%${destination}%`;


    db.all(
        sql,
        [searchValue],
        (err, rows) => {

            if (err) {

                console.error(
                    "Search error:",
                    err.message
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Hotel search failed."

                });

            }


            res.json({

                success: true,

                count: rows.length,

                hotels: rows

            });

        }

    );

});


// =====================================
// GET SINGLE HOTEL
// =====================================

app.get("/api/hotels/:id", (req, res) => {

    const hotelId =
        req.params.id;


    const sql = `
        SELECT *
        FROM hotels
        WHERE id = ?
    `;


    db.get(
        sql,
        [hotelId],
        (err, hotel) => {

            if (err) {

                console.error(
                    "Hotel details error:",
                    err.message
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to fetch hotel."

                });

            }


            if (!hotel) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Hotel not found."

                });

            }


            res.json({

                success: true,

                hotel: hotel

            });

        }

    );

});

// =====================================
// CREATE BOOKING
// =====================================

app.post("/api/bookings", (req, res) => {

    const {
        hotel_id,
        guest_name,
        email,
        check_in,
        check_out,
        guests
    } = req.body;


    // Validate required fields

    if (
        !hotel_id ||
        !guest_name ||
        !email ||
        !check_in ||
        !check_out ||
        !guests
    ) {

        return res.status(400).json({

            success: false,

            message:
                "All booking fields are required."

        });

    }


    // Validate dates

    if (
        new Date(check_out) <=
        new Date(check_in)
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Check-out must be after check-in."

        });

    }


    // Get current date

    const bookingDate =
        new Date().toISOString();


    // Insert booking

    const sql = `

        INSERT INTO bookings

        (
            hotel_id,
            guest_name,
            email,
            check_in,
            check_out,
            guests,
            booking_date
        )

        VALUES (?, ?, ?, ?, ?, ?, ?)

    `;


    db.run(
        sql,

        [
            hotel_id,
            guest_name,
            email,
            check_in,
            check_out,
            guests,
            bookingDate
        ],

        function(err) {

            if (err) {

                console.error(
                    "Booking error:",
                    err.message
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to save booking."

                });

            }


            // Return booking

            res.status(201).json({

                success: true,

                message:
                    "Booking created successfully.",

                booking: {

                    id:
                        this.lastID,

                    hotel_id:
                        hotel_id,

                    guest_name:
                        guest_name,

                    email:
                        email,

                    check_in:
                        check_in,

                    check_out:
                        check_out,

                    guests:
                        guests,

                    booking_date:
                        bookingDate

                }

            });

        }

    );

});

// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {

    console.log(
        `Hotels.com Clone running at http://localhost:${PORT}`
    );

});