const sqlite3 = require("sqlite3").verbose();
const path = require("path");


// =====================================
// DATABASE CONNECTION
// =====================================

const dbPath = path.join(__dirname, "hotels.db");

const db = new sqlite3.Database(dbPath, (err) => {

    if (err) {

        console.error(
            "Database connection error:",
            err.message
        );

    } else {

        console.log(
            "Connected to SQLite database."
        );

    }

});


// =====================================
// CREATE TABLES
// =====================================

db.serialize(() => {

    // =================================
    // HOTELS TABLE
    // =================================

    db.run(`
        CREATE TABLE IF NOT EXISTS hotels (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            location TEXT NOT NULL,

            description TEXT,

            price REAL NOT NULL,

            rating REAL NOT NULL,

            type TEXT NOT NULL,

            amenities TEXT,

            image TEXT

        )
    `);


    // =================================
    // BOOKINGS TABLE
    // =================================

    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            hotel_id INTEGER NOT NULL,

            guest_name TEXT NOT NULL,

            email TEXT NOT NULL,

            check_in TEXT NOT NULL,

            check_out TEXT NOT NULL,

            guests INTEGER NOT NULL,

            booking_date TEXT NOT NULL,

            FOREIGN KEY (hotel_id)
            REFERENCES hotels(id)

        )
    `);


    // =================================
    // CHECK IF HOTELS ALREADY EXIST
    // =================================

    db.get(
        "SELECT COUNT(*) AS count FROM hotels",
        (err, row) => {

            if (err) {

                console.error(
                    "Error checking hotels:",
                    err.message
                );

                return;
            }


            // Only insert hotels if table is empty

            if (row.count === 0) {

                const hotels = [

                    [
                        "Grand Luxury Hotel",
                        "Lahore",
                        "A luxurious hotel located in the heart of Lahore with modern rooms and excellent facilities.",
                        120,
                        4.8,
                        "Luxury Hotel",
                        "WiFi,Swimming Pool,Spa,Restaurant,Gym",
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
                    ],

                    [
                        "Royal Palace Hotel",
                        "Islamabad",
                        "A beautiful hotel offering comfortable rooms and stunning views of Islamabad.",
                        95,
                        4.7,
                        "Hotel",
                        "WiFi,Restaurant,Parking,Room Service",
                        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80"
                    ],

                    [
                        "City View Resort",
                        "Karachi",
                        "A modern resort with comfortable rooms and easy access to major attractions.",
                        85,
                        4.6,
                        "Resort",
                        "WiFi,Swimming Pool,Restaurant,Beach Access",
                        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=80"
                    ],

                    [
                        "Pearl Grand Hotel",
                        "Lahore",
                        "A premium city hotel featuring spacious rooms, dining and business facilities.",
                        110,
                        4.5,
                        "Luxury Hotel",
                        "WiFi,Gym,Restaurant,Parking,Business Center",
                        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
                    ],

                    [
                        "Serena Palace",
                        "Islamabad",
                        "A peaceful stay with elegant rooms, gardens and premium guest services.",
                        135,
                        4.9,
                        "Luxury Hotel",
                        "WiFi,Spa,Gym,Restaurant,Swimming Pool",
                        "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1000&q=80"
                    ],

                    [
                        "Beach View Resort",
                        "Karachi",
                        "A relaxing coastal resort offering comfortable rooms and beautiful surroundings.",
                        75,
                        4.4,
                        "Resort",
                        "WiFi,Beach Access,Restaurant,Parking",
                        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1000&q=80"
                    ],

                    [
                        "Mountain Escape Hotel",
                        "Murree",
                        "A scenic mountain hotel perfect for families and travelers looking for a peaceful getaway.",
                        90,
                        4.6,
                        "Hotel",
                        "WiFi,Restaurant,Parking,Mountain View",
                        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=80"
                    ],

                    [
                        "Lake View Resort",
                        "Nathia Gali",
                        "A comfortable resort surrounded by beautiful mountain scenery and fresh air.",
                        100,
                        4.7,
                        "Resort",
                        "WiFi,Restaurant,Parking,Mountain View",
                        "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80"
                    ]

                ];


                const insertHotel = db.prepare(`
                    INSERT INTO hotels
                    (
                        name,
                        location,
                        description,
                        price,
                        rating,
                        type,
                        amenities,
                        image
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `);


                hotels.forEach((hotel) => {

                    insertHotel.run(hotel);

                });


                insertHotel.finalize(() => {

                    console.log(
                        "Hotel data inserted successfully."
                    );

                });

            } else {

                console.log(
                    "Hotel data already exists."
                );

            }

        }

    );

});


module.exports = db;