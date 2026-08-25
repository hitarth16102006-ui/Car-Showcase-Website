````markdown
# 🚗 AUTOVERSE — Premium Car Showcase Website

> **Discover • Compare • Customize • Drive**

**Developed by Hitarth Gujral, Vansh Goyal and Angel Goel**

AUTOVERSE is a modern, responsive and interactive car showcase website designed to provide users with a premium automotive browsing experience.

The project allows users to explore cars from different brands, search and filter vehicles, view detailed specifications, switch between car colours and variants, save cars to their wishlist, manage their garage, compare vehicles, and submit enquiries or test-drive requests.

Built as a **Frontend Engineering-II academic project**, AUTOVERSE focuses on applying HTML5, CSS3 and Vanilla JavaScript concepts to a complete real-world style web application.

---

## 🌐 Project Repository

🔗 **GitHub Repository:**  
https://github.com/hitarth16102006-ui/Car-Showcase-Website

---

# 👥 Team Members

AUTOVERSE was developed as a collaborative academic project by:

| Team Member | Role & Responsibilities |
|---|---|
| **Hitarth Gujral** | **Team Leader** — Home page, navigation, footer, responsive design, project integration, GitHub management and final testing |
| **Vansh Goyal** | **Frontend Developer** — Cars listing, car cards, search, filtering and car data |
| **Angel Goel** | **Frontend Developer** — Car details, specifications, image gallery, colour selection, variants and similar cars |

### Team

**Hitarth Gujral • Vansh Goyal • Angel Goel**

Together, the team worked on designing, developing, testing and integrating the AUTOVERSE car showcase platform.

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
- Premium automotive UI
- Dark/light theme support

---

## 🚘 Cars Listing

The Cars page provides an interactive catalogue of vehicles.

### Features

- Dynamically generated car cards
- Live search
- Brand filtering
- Car information
- Price display
- Wishlist buttons
- Responsive grid layout

The car catalogue is powered by centralized JavaScript data rather than manually hard-coded individual cards.

---

# 🔎 Live Search & Filtering

Users can instantly search through the car catalogue.

The search system:

1. Reads the user's input
2. Normalizes the search text
3. Filters the car data
4. Checks car names and brands
5. Applies the selected brand filter
6. Re-renders the matching results

### Concepts Used

- JavaScript arrays
- `filter()`
- String methods
- Event listeners
- DOM manipulation
- Dynamic rendering

Example:

```javascript
searchInput.addEventListener("input", applyFilters);
````

---

# 📋 Dynamic Car Details

AUTOVERSE uses a **data-driven car details system**.

Instead of creating a separate HTML page for every vehicle, one details page dynamically displays information according to the selected car.

Example:

```text
car-details.html?id=bmw-m4
```

JavaScript reads the car ID from the URL and retrieves the corresponding vehicle from the central car dataset.

### Concepts Used

* `URLSearchParams`
* Query parameters
* JavaScript objects
* `map()`
* `find()`
* DOM manipulation
* Dynamic HTML rendering
* `innerHTML`

### Flow

```text
User selects a car
       ↓
Car ID is added to URL
       ↓
URLSearchParams reads ID
       ↓
getCarById() finds the car
       ↓
Car data is retrieved
       ↓
Details are dynamically rendered
```

---

# 🎨 Dynamic Car Colour Selection

One of the special features of AUTOVERSE is the ability to change the displayed colour of a vehicle.

Users can select different colour swatches on the Car Details page.

The selected colour determines which colour-specific images are displayed in the gallery.

### Flow

```text
Colour Swatch
      ↓
Selected Colour
      ↓
Colour-specific Image Data
      ↓
Gallery Update
      ↓
Updated Car Images
```

This is implemented using JavaScript and structured car image data rather than simply applying a CSS colour filter.

---

# 🏎️ Variant Selection

Users can also switch between available vehicle variants.

For example:

```text
M4 Competition
      ↓
M4 CS
```

When a variant is selected, the corresponding vehicle information and specifications are updated.

This demonstrates:

* JavaScript state handling
* Objects
* Conditional logic
* Dynamic rendering
* DOM manipulation

---

# ❤️ Wishlist

Users can save vehicles using the heart/wishlist functionality.

The selected car IDs are stored in the browser using:

```javascript
localStorage
```

### Storage Flow

```text
User clicks ❤️
      ↓
Car ID is added/removed
      ↓
JSON.stringify()
      ↓
localStorage
      ↓
Saved data persists after refresh
```

### Concepts Used

* `localStorage`
* `JSON.stringify()`
* `JSON.parse()`
* Arrays
* Event handling
* State management
* Event delegation

---

# 🚘 Garage

The Garage provides a user-oriented area for managing saved automotive activity.

It can be used to keep track of:

* Saved cars
* Wishlist items
* Enquiries
* Test-drive related information

The Garage works with browser-side state and localStorage in the current frontend implementation.

---

# ⚖️ Car Comparison

AUTOVERSE provides a comparison experience where users can select cars and view their information side-by-side.

The comparison feature helps users evaluate:

* Specifications
* Performance
* Features
* Vehicle information

The data is dynamically generated from the centralized car dataset.

---

# 👤 Authentication

AUTOVERSE includes:

* Login
* Signup
* Forgot Password
* Form validation
* Password confirmation
* Login state handling
* Logout functionality

> **Note:** Authentication is currently browser-side and is not intended to represent production-level secure authentication.

A future backend implementation would use proper password hashing, sessions/tokens and server-side validation.

---

# 📞 Contact & Test Drive

The Contact page provides different enquiry options.

Depending on the selected enquiry type, additional fields can appear dynamically.

For example:

```text
Book a Test Drive
        ↓
Date
Time
Location
        ↓
Submit Request
```

This demonstrates JavaScript-driven dynamic forms and event handling.

---

# 📱 Responsive Design

AUTOVERSE follows a **mobile-first responsive design approach**.

The website adapts across:

* 🖥️ Desktop
* 💻 Laptop
* 📱 Tablet
* 📱 Mobile

### Responsive Features

* Responsive navigation
* Flexible layouts
* CSS Grid
* Flexbox
* Responsive typography
* Adaptive spacing
* Responsive forms
* Mobile-friendly buttons
* Responsive car cards
* Responsive images
* Responsive animations

The layout progressively adapts using CSS media queries.

Example:

```css
@media (min-width: 768px) {
    .cars-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

### Design Principle

> **One codebase. Different layouts depending on the viewport.**

---

# 🎨 UI & Theme

AUTOVERSE uses a premium automotive visual style with:

* Dark luxury interface
* Gold/red accent elements
* Poppins typography
* Smooth transitions
* Hover effects
* CSS animations
* Responsive components
* Light/dark theme functionality

The website is designed to provide a consistent visual experience across all pages.

---

# 🛠️ Technology Stack

| Technology             | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| **HTML5**              | Website structure and semantic markup           |
| **CSS3**               | Styling, layouts and animations                 |
| **Vanilla JavaScript** | Logic and interactivity                         |
| **CSS Grid**           | Responsive two-dimensional layouts              |
| **Flexbox**            | Component alignment and one-dimensional layouts |
| **LocalStorage**       | Browser-side persistence                        |
| **Git**                | Version control                                 |
| **GitHub**             | Collaboration and repository management         |
| **VS Code**            | Development                                     |
| **Chrome DevTools**    | Debugging and responsive testing                |
| **Jest**               | JavaScript logic testing                        |

---

# 📂 Project Structure

```text
AUTOVERSE/
│
├── HTML/
│   ├── index.html
│   ├── cars.html
│   ├── car-details.html
│   ├── compare.html
│   ├── about.html
│   ├── contact.html
│   ├── login.html
│   ├── signup.html
│   ├── forgot-password.html
│   ├── garage.html
│   ├── wishlist.html
│   ├── terms.html
│   └── privacy.html
│
├── CSS/
│   ├── style.css
│   ├── home.css
│   ├── cars.css
│   ├── car-details.css
│   ├── compare.css
│   ├── login.css
│   ├── signup.css
│   ├── about.css
│   ├── contact.css
│   ├── responsive.css
│   └── animations.css
│
├── JS/
│   ├── main.js
│   ├── cars.js
│   ├── details.js
│   ├── cars-data.js
│   ├── login.js
│   ├── signup.js
│   ├── contact.js
│   ├── auth.js
│   └── ...
│
├── Images/
│   └── Car and website assets
│
├── tests/
│   └── Test files
│
├── .gitignore
├── package.json
└── README.md
```

---

# 🧠 Core JavaScript Concepts

AUTOVERSE demonstrates several important JavaScript concepts.

## Arrays

Vehicle information is stored as a collection of JavaScript objects.

```javascript
const CARS = [
    {
        id: "bmw-m4",
        brand: "BMW",
        name: "M4",
        price: "₹1.20 Crore"
    }
];
```

## Objects

Each car is represented as an object containing related properties such as:

* ID
* Brand
* Name
* Price
* Specifications
* Images
* Colours
* Variants
* Features

---

## Array Methods

The project uses methods such as:

```javascript
filter()
map()
forEach()
find()
```

### `filter()`

Selects cars that satisfy search or filtering conditions.

### `map()`

Transforms data into dynamically generated content.

### `forEach()`

Performs an operation for each item in an array.

### `find()`

Locates a specific car object.

---

# 🌐 DOM Manipulation

JavaScript dynamically updates:

* Car cards
* Specifications
* Images
* Forms
* Wishlist states
* UI elements
* Navigation states
* Themes

Important DOM methods include:

```javascript
document.getElementById()
document.querySelector()
document.querySelectorAll()
element.classList
element.innerHTML
```

---

# 🖱️ Event Handling

The project uses browser events such as:

```text
click
input
change
submit
DOMContentLoaded
```

Example:

```javascript
searchInput.addEventListener("input", applyFilters);
```

These events allow the website to respond to user actions.

---

# 💾 Browser Storage

The wishlist and other browser-side state use:

```javascript
localStorage.setItem()
localStorage.getItem()
```

JavaScript objects and arrays are converted to strings using:

```javascript
JSON.stringify()
```

and restored using:

```javascript
JSON.parse()
```

---

# 👥 Event Delegation

The project uses event delegation for dynamically generated interactive elements such as wishlist buttons.

Instead of attaching a separate event listener to every dynamically created button, an event can be handled through a common parent and the clicked element can be identified.

Important concepts include:

```javascript
event.target
closest()
getAttribute()
```

This makes dynamic interfaces easier to manage.

---

# ♿ Accessibility

AUTOVERSE includes several accessibility considerations:

* Semantic HTML5
* Skip-to-content navigation
* Meaningful image `alt` text
* Accessible buttons
* ARIA attributes
* Keyboard-friendly controls
* Visually hidden `.sr-only` labels
* `prefers-reduced-motion` support

These features help make the website more usable for keyboard and assistive-technology users.

---

# 🔍 SEO Features

The project includes several basic SEO and metadata features:

* Unique page titles
* Meta descriptions
* Open Graph metadata
* Twitter card metadata
* Favicon
* Semantic HTML structure

Future improvements could include:

* Canonical URLs
* Open Graph images
* Structured data / JSON-LD
* Advanced vehicle metadata

---

# 🧪 Testing

The project was tested for:

* Navigation
* Search
* Filtering
* Car details
* Colour selection
* Variant selection
* Wishlist persistence
* Form validation
* Responsive layouts
* Invalid car IDs
* Different viewport sizes

Chrome DevTools was used to verify responsive behaviour across different screen sizes.

Jest is also used for testing selected JavaScript logic.

---

# 🔄 Development Workflow

The team used Git and GitHub for collaboration.

### Basic Workflow

```bash
git pull origin main
```

Make changes and test the project.

```bash
git status
git add .
git commit -m "Meaningful commit message"
git push origin main
```

### Team Rules

* Pull the latest code before working
* Test changes before pushing
* Use meaningful commit messages
* Avoid editing another member's assigned files
* Communicate before major changes
* Resolve conflicts carefully
* Do not force-push unless the team agrees

---

# 🌳 Git Workflow

Our basic collaborative workflow is:

```text
GitHub Repository
       ↓
git pull
       ↓
Work on assigned feature
       ↓
Test locally
       ↓
git add .
       ↓
git commit
       ↓
git push
       ↓
Team Review
```

GitHub was used to maintain the project repository and coordinate the work of all three team members.

---

# 🎓 Learning Outcomes

Through AUTOVERSE, we applied and strengthened our understanding of:

* Semantic HTML5
* CSS Grid
* CSS Flexbox
* Responsive Web Design
* CSS Animations
* JavaScript
* Arrays & Objects
* Array Methods
* DOM Manipulation
* Event Handling
* URL Parameters
* LocalStorage
* Form Validation
* Git
* GitHub Collaboration
* Debugging
* Browser Developer Tools
* Team-based Software Development

---

# 🚀 Future Scope

AUTOVERSE can be extended into a complete production-level automotive platform.

### Backend & Database

* Node.js backend
* Express.js API
* Real database integration
* Persistent vehicle inventory

### Secure Authentication

* Password hashing
* Server-side validation
* Sessions or token-based authentication
* Secure user accounts

### Admin Dashboard

An administrator could manage:

* Cars
* Brands
* Specifications
* Images
* Pricing
* Inventory
* User enquiries

### Real-Time Inventory

The system could display:

* Vehicle availability
* Live pricing
* Stock status
* Dealer information

### Booking System

The enquiry system could be extended into a real booking platform with:

* Test-drive scheduling
* Confirmation emails
* Appointment management
* Dealer notifications

### Payment Integration

Future versions could support secure online payments for bookings or other automotive services.

---

# ⚠️ Current Limitations

The current project is primarily a frontend implementation.

Therefore:

* There is no production backend.
* Authentication is browser-side.
* Vehicle data is stored in JavaScript.
* Wishlist persistence uses browser localStorage.
* Test-drive and enquiry forms are frontend demonstrations.
* Browser-side storage can be modified by the user.
* Production-level security would require server-side implementation.

These limitations provide opportunities for future backend development.

---

# 🎯 Project Goal

AUTOVERSE was created to demonstrate how fundamental web development concepts can be combined into a complete interactive application.

Rather than building isolated HTML pages, the project combines:

```text
HTML
  ↓
CSS
  ↓
JavaScript
  ↓
Dynamic Data
  ↓
DOM Manipulation
  ↓
User Interaction
  ↓
Browser Storage
  ↓
Responsive Experience
```

The result is a modern, responsive and interactive automotive showcase experience.

---

# 📄 Academic Project

**Project:** AUTOVERSE — Car Showcase Website

**Course:** Frontend Engineering-II

**Project Type:** Academic / Educational Project

**Technologies:** HTML5 • CSS3 • Vanilla JavaScript

**Repository:**
[https://github.com/hitarth16102006-ui/Car-Showcase-Website](https://github.com/hitarth16102006-ui/Car-Showcase-Website)

### Team

**Hitarth Gujral • Vansh Goyal • Angel Goel**

---

# ⭐ Acknowledgement

This project was developed as a collaborative academic project to apply frontend web development concepts in a practical real-world style application.

We would like to acknowledge the guidance provided during the Frontend Engineering-II course and the collaborative effort of all three team members in designing, developing, testing and integrating AUTOVERSE.

---

# 📜 License

This project is created for educational and academic purposes.

---

# 🚗 AUTOVERSE

### Discover. Compare. Customize. Drive.

**Built with HTML5 • CSS3 • JavaScript • Creativity • Teamwork**

```
```
