# AUTOVERSE

A premium car showcase, comparison and enquiry platform, built with plain HTML, CSS and JavaScript (no framework, no backend).

AUTOVERSE lets visitors browse a curated collection of luxury and performance vehicles, save cars to a personal wishlist, compare specifications side by side, read customer reviews, and submit enquiries or test-drive requests - all backed by a "My Garage" dashboard once they create an account.

---

## Features

- **Home, Cars & Car Details** - browsable catalogue with search, brand filtering, a photo carousel, an interactive colour/variant picker, and a full spec/performance/features breakdown per car.
- **Compare Cars** - select up to 3 cars from anywhere on the site and view them side by side in a spec + features table.
- **Wishlist** - heart any car to save it; a live count badge and footer column stay in sync across every page.
- **Contact / Enquiry system** - enquiry-type routing, a Vehicle of Interest field that auto-fills from "Book a Test Drive" links, conditional test-drive fields, and a 20-question progressive FAQ.
- **Accounts & My Garage** - sign up / sign in (with Remember Me, password visibility toggle, and a Forgot Password flow), then track your saved cars, test-drive bookings and enquiries from one dashboard.
- **Dark / light theme toggle** - applied consistently across every page and component.
- **Legal pages** - Terms & Conditions and Privacy Policy, linked from every footer and consent checkbox.
- **Accessibility & SEO basics** - skip-to-content link, meta descriptions, Open Graph tags, and a custom favicon on every page.

## Tech Stack

- HTML5, CSS3 (mobile-first, custom properties, no framework)
- Vanilla JavaScript (no build step required)
- `localStorage` for all persistence - accounts, wishlist, compare list, enquiries, and theme preference all live in the browser (see [Known Limitations](#known-limitations))
- [Jest](https://jestjs.io/) for unit tests

---

## Getting Started

AUTOVERSE is a static site - no build step is required to view it.

### Option 1: Open directly
Open `HTML/index.html` in a browser. Most features work this way, though some browsers restrict `localStorage` for pages opened via `file://`, so a local server is recommended.

### Option 2: Local server (recommended)
```bash
# from the project root
python3 -m http.server 8000
# then visit http://localhost:8000/HTML/index.html
```
Any static file server works (`npx serve`, VS Code's Live Server extension, etc.).

### Running the tests
```bash
npm install
npm test
```
This runs the Jest suite covering the pure logic in `cars-data.js`, `wishlist.js` and `compare.js` (price formatting, car lookup, wishlist/compare toggling, the 3-car compare limit, and the review-generation fallback).

---

## Folder Structure

```
autoverse/
├── HTML/              All pages (index, cars, car-details, compare, about,
│                       contact, login, signup, forgot-password, garage,
│                       wishlist, terms, privacy)
├── CSS/                One stylesheet per page/feature area, plus style.css
│                       (shared/global) and responsive.css (breakpoints)
├── JS/                 One script per feature: cars-data.js (the car
│                       catalogue + helpers), cars.js, details.js, contact.js,
│                       wishlist.js, compare.js, auth.js, navbar.js, main.js
├── Images/             Car photography + favicon
├── tests/              Jest test suites
├── package.json
└── jest.config.js
```

## Known Limitations

This is a front-end-only student project, so a few things are intentionally out of scope for now:

- **No backend.** Accounts, wishlist, compare selections, and enquiries are stored in the browser's `localStorage`, not a server or database. Passwords are not hashed. Nothing syncs across devices, and clearing browser data resets everything.
- **No real payment or dealership integration.** Enquiries and test-drive bookings are simulated (a confirmation message, not an actual email/notification).
- **Google Sign-In** is a placeholder button - it doesn't perform real OAuth.
- Several cars in `cars-data.js` still use fallback placeholder artwork rather than real photography.

These are the natural next steps if this project moves beyond a course submission (see the Terms & Privacy pages, which are written to accurately describe this local-storage-only state).

---

## Team

| Name | Role |
|---|---|
| Hitarth Gujral | Team Lead - Home Page, Project Integration, GitHub Management |
| Vansh Goyal | Cars Listing Module |
| Angel Goel | Car Details Module |
| Tegveer Singh | Authentication & Information Pages (Login, Signup, About, Contact) |

---

## License

Student project - built for educational purposes. Vehicle names, brands and logos referenced belong to their respective manufacturers and are used descriptively only.
