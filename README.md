# 🏨 Hotels.com Clone

A fully functional hotel booking web application inspired by Hotels.com.

Users can search for hotels by destination, filter and sort hotel results, view hotel details, and make hotel reservations. Booking information is stored in a SQLite database.

---

## 🚀 Features

### 🏠 Homepage

- Search hotels by destination
- Select check-in date
- Select check-out date
- Featured hotels
- Top-rated hotels
- Responsive navigation
- Sign-in page

### 🔎 Hotel Search

- Search hotels by destination
- Dynamic hotel results
- Search results connected to SQLite database

### 🎯 Filters

Users can filter hotels by:

- Maximum price
- Minimum rating
- Hotel type

Available hotel types:

- Hotel
- Luxury Hotel
- Resort

### 📊 Sorting

Hotels can be sorted by:

- Best Rated
- Price: Low to High
- Price: High to Low

### 🏨 Hotel Details

Each hotel has:

- Hotel name
- Location
- Description
- Image
- Rating
- Price per night
- Hotel type
- Amenities

### 📅 Booking System

Users can:

- Select a hotel
- Enter guest information
- Select check-in date
- Select check-out date
- Select number of guests
- Calculate number of nights
- Calculate total price
- Confirm a reservation

### 💾 Database

The application uses SQLite to store:

- Hotel information
- Booking information
- Guest details
- Check-in and check-out dates
- Number of guests
- Booking date

### ✅ Booking Confirmation

After a successful reservation, users receive a confirmation page containing:

- Booking ID
- Hotel name
- Guest name
- Email
- Check-in date
- Check-out date
- Number of guests
- Number of nights
- Total price

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- SQLite
- SQLite3
- CORS
- dotenv
- Git
- GitHub

---

## 📁 Project Structure

```text
Hotels.com-Clone
│
├── public
│   │
│   ├── index.html
│   ├── signin.html
│   ├── hotels.html
│   ├── hotel-details.html
│   ├── booking.html
│   ├── confirmation.html
│   │
│   ├── css
│   │   ├── style.css
│   │   ├── hotels.css
│   │   ├── hotel-details.css
│   │   ├── booking.css
│   │   └── confirmation.css
│   │
│   └── js
│       ├── script.js
│       ├── signin.js
│       ├── hotels.js
│       ├── hotel-details.js
│       ├── booking.js
│       └── confirmation.js
│
├── database.js
├── hotels.db
├── server.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md