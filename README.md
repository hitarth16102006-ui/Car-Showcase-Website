# 🚗 AUTOVERSE — Premium Car Showcase Website

> **Discover • Compare • Customize • Drive**

AUTOVERSE is a modern, responsive and interactive car showcase website designed to provide users with a premium automotive browsing experience.

The project allows users to explore cars from different brands, search and filter vehicles, view detailed specifications, switch between car colours and variants, save cars to their wishlist, and submit enquiries or test-drive requests.

Built as a **Frontend Engineering-II academic project**, AUTOVERSE focuses on applying HTML5, CSS3 and Vanilla JavaScript concepts to a complete real-world style web application.

---

## 🌐 Project Repository

🔗 **GitHub:**  
https://github.com/hitarth16102006-ui/Car-Showcase-Website

---

# ✨ Key Features

## 🏠 Premium Home Page

- Cinematic hero section
- Featured cars
- Popular car brands
- Animated statistics
- Customer testimonials
- Newsletter section
- Responsive navigation
- Premium dark automotive UI

---

## 🚘 Cars Listing

The Cars page provides an interactive catalogue of vehicles.

### Features

- Dynamic car cards
- Live search
- Brand filtering
- Car information
- Price display
- Wishlist buttons
- Responsive grid layout

The car catalogue is powered by JavaScript data rather than manually hard-coded individual cards.

---

## 🔎 Live Search & Filtering

Users can instantly search through the car catalogue.

The search system:

1. Reads the user's input
2. Normalizes the search text
3. Filters the car data
4. Checks car names and brands
5. Re-renders the matching results

### Concepts Used

- JavaScript arrays
- `filter()`
- String methods
- Event listeners
- DOM manipulation
- Dynamic rendering

---

# 📋 Dynamic Car Details

AUTOVERSE uses a **data-driven car details system**.

Instead of creating a separate HTML page for every vehicle, one details page dynamically displays information according to the selected car.

Example:

```text
car-details.html?id=bmw-m4
