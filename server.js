const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database");

const app = express();

const PORT = process.env.PORT || 3000;


// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// =====================================
// SERVE FRONTEND
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

                message:
                    "Failed to fetch hotels."

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

    const destination =
        (req.query.destination || "").trim();


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
        Number(req.params.id);


    if (!Number.isInteger(hotelId)) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid hotel ID."

        });

    }


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


    // =================================
    // BASIC VALIDATION
    // =================================

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


    const hotelId =
        Number(hotel_id);


    const guestCount =
        Number(guests);


    if (!Number.isInteger(hotelId)) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid hotel ID."

        });

    }


    if (
        !Number.isInteger(guestCount) ||
        guestCount < 1 ||
        guestCount > 20
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Guests must be between 1 and 20."

        });

    }


    // =================================
    // EMAIL VALIDATION
    // =================================

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        return res.status(400).json({

            success: false,

            message:
                "Please enter a valid email address."

        });

    }


    // =================================
    // DATE VALIDATION
    // =================================

    const checkInDate =
        new Date(check_in);

    const checkOutDate =
        new Date(check_out);


    if (
        Number.isNaN(checkInDate.getTime()) ||
        Number.isNaN(checkOutDate.getTime())
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid booking dates."

        });

    }


    if (checkOutDate <= checkInDate) {

        return res.status(400).json({

            success: false,

            message:
                "Check-out must be after check-in."

        });

    }


    // =================================
    // CHECK HOTEL EXISTS
    // =================================

    db.get(
        "SELECT * FROM hotels WHERE id = ?",
        [hotelId],
        (hotelError, hotel) => {

            if (hotelError) {

                console.error(
                    "Hotel lookup error:",
                    hotelError.message
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Unable to verify hotel."

                });

            }


            if (!hotel) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Hotel not found."

                });

            }


            // =================================
            // BOOKING DATE
            // =================================

            const bookingDate =
                new Date().toISOString();


            // =================================
            // INSERT BOOKING
            // =================================

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
                    hotelId,
                    guest_name.trim(),
                    email.trim(),
                    check_in,
                    check_out,
                    guestCount,
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


                    res.status(201).json({

                        success: true,

                        message:
                            "Booking created successfully.",

                        booking: {

                            id:
                                this.lastID,

                            hotel_id:
                                hotelId,

                            guest_name:
                                guest_name.trim(),

                            email:
                                email.trim(),

                            check_in:
                                check_in,

                            check_out:
                                check_out,

                            guests:
                                guestCount,

                            booking_date:
                                bookingDate

                        }

                    });

                }

            );

        }

    );

});


// =====================================
// GET BOOKING BY ID
// =====================================

app.get("/api/bookings/:id", (req, res) => {

    const bookingId =
        Number(req.params.id);


    if (!Number.isInteger(bookingId)) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid booking ID."

        });

    }


    const sql = `

        SELECT

            bookings.*,

            hotels.name AS hotel_name,

            hotels.location AS hotel_location,

            hotels.image AS hotel_image,

            hotels.rating AS hotel_rating,

            hotels.price AS hotel_price

        FROM bookings

        JOIN hotels

            ON bookings.hotel_id = hotels.id

        WHERE bookings.id = ?

    `;


    db.get(
        sql,
        [bookingId],
        (err, booking) => {

            if (err) {

                console.error(
                    "Booking lookup error:",
                    err.message
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to fetch booking."

                });

            }


            if (!booking) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Booking not found."

                });

            }


            res.json({

                success: true,

                booking: booking

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