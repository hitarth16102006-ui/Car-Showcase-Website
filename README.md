# AUTOVERSE

A student car showcase and comparison website, built with plain HTML, CSS and JavaScript (no framework, no backend).

AUTOVERSE lets visitors browse 33 luxury and performance cars, save cars to a wishlist, compare specifications side by side, and record enquiries or test-drive requests, which appear in a "My Garage" dashboard. Everything is stored in the visitor's own browser.

---

## Features

- **Home, Cars & Car Details** - browsable catalogue with search, brand filtering, a photo carousel, an interactive colour/variant picker, and a full spec/performance/features breakdown per car.
- **Compare Cars** - select up to 3 cars from anywhere on the site and view them side by side in a spec + features table.
- **Wishlist** - heart any car to save it; a live count badge and footer column stay in sync across every page.
- **Contact / Enquiry system** - enquiry-type routing, a Vehicle of Interest field that auto-fills from "Book a Test Drive" links, conditional test-drive fields, and a progressive FAQ.
- **Accounts & My Garage** - a front-end demo of sign up / sign in (passwords stored only as SHA-256 hashes, Remember Me, password visibility toggle), then see your saved cars, test-drive requests and enquiries in one dashboard. Demo accounts are in `JS/users.json`.
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
This runs the Jest suite covering the logic in `cars-data.js`, `wishlist.js`, `compare.js` and `auth.js` (data integrity, price formatting and bands, car lookup, wishlist/compare toggling, the 3-car compare limit, email validation, HTML escaping and stored accounts).

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
│                       wishlist.js, compare.js, auth.js, login.js, signup.js,
│                       navbar.js, main.js, cursor-glow.js, users.json
├── Images/             Car photography + favicon
├── tests/              Jest test suites
├── package.json
└── jest.config.js
```

## Known Limitations

This is a front-end-only student project, so a few things are intentionally out of scope for now:

- **No backend.** Accounts, wishlist, compare selections, and enquiries are stored in the browser's `localStorage`, not a server or database. Passwords are stored as SHA-256 hashes, but anyone with access to the browser can read or change `localStorage`, so this is not real authentication. Nothing syncs across devices, and clearing browser data resets everything.
- **Demo accounts need a server.** `users.json` is loaded with `fetch()`, which does not work for pages opened via `file://`; use a local server.
- **No dealership integration.** Enquiries and test-drive requests are saved in the browser only; nobody is notified and no email is sent.
- **Google Sign-In** is a placeholder button - it doesn't perform real OAuth.
- **Prices are indicative.** Prices are approximate Indian ex-showroom figures from public sources at the time of writing; several cars were never officially sold in India. Some 0-100 km/h times for US-market cars are the makers' 0-60 mph figures.
- Photo angles we don't have a correct picture of show a labelled "photo not available" placeholder rather than a picture of a different car.

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
