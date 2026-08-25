🚗 AUTOVERSE --- Premium Car Showcase Website

Discover • Compare • Customize • Drive

Developed by Hitarth Gujral, Vansh Goyal and Angel Goel

AUTOVERSE is a modern, responsive and interactive car showcase website
created as a Frontend Engineering-II academic project. The website
provides a premium automotive browsing experience where users can
explore vehicles, search and filter cars, view detailed specifications,
change car colours and variants, save vehicles, and interact with
enquiry and test-drive forms.

The project demonstrates the practical use of HTML5, CSS3 and Vanilla
JavaScript to build a complete multi-page frontend application without
relying on a frontend framework.

🌐 Project Repository

GitHub: https://github.com/hitarth16102006-ui/Car-Showcase-Website

👥 Team Members

AUTOVERSE was developed collaboratively by:

Team Member                         Role & Responsibilities

Hitarth Gujral                  Team Leader --- Home page,
navigation, footer, responsive
design, project integration, GitHub
management and final testing

Vansh Goyal                     Frontend Developer --- Cars
listing, car cards, search,
filtering and car data

Team

Hitarth Gujral • Vansh Goyal • Angel Goel

✨ Features

🏠 Premium Home Page

The home page provides the main entry point to AUTOVERSE with:

Premium automotive hero section

Featured vehicles

Popular car brands

Animated statistics

Customer-focused sections

Newsletter section

Responsive navigation

Smooth animations and transitions

Dark/light theme support

🚘 Cars Listing

The Cars page provides an interactive catalogue of vehicles.

Features

Dynamically generated car cards

Live search

Brand filtering

Vehicle information

Price display

Wishlist functionality

Responsive grid layout

Car information is maintained in centralized JavaScript data, allowing
the same dataset to be reused across different parts of the website.

🔎 Live Search & Filtering

Users can search for vehicles directly from the Cars page.

The search and filtering process:

Reads the user's search input.

Normalizes the text for consistent matching.

Checks the available car data.

Matches car names and brands.

Applies the selected brand filter.

Dynamically updates the displayed cards.

JavaScript Concepts Used

Arrays

Objects

filter()

String methods

Event listeners

DOM manipulation

Dynamic rendering

Example:

searchInput.addEventListener("input", applyFilters);

📋 Dynamic Car Details

AUTOVERSE uses a data-driven car-details system.

Instead of creating a separate HTML file for every vehicle, a common
details page dynamically displays the information of the selected car.

Example:

car-details.html?id=bmw-m4

JavaScript reads the ID from the URL and retrieves the corresponding car
from the centralized dataset.

Concepts Used

URLSearchParams

Query parameters

JavaScript objects

find()

map()

DOM manipulation

innerHTML

Dynamic rendering

Flow

User selects a car
       ↓
Car ID is added to the URL
       ↓
URLSearchParams reads the ID
       ↓
The matching car is found
       ↓
Car data is retrieved
       ↓
The details page is dynamically rendered

🎨 Dynamic Car Colour Selection

One of the major interactive features of AUTOVERSE is the ability to
change the selected car's colour.

On the Car Details page, users can select different colour swatches.

The selected colour is used to display the corresponding vehicle images
in the gallery.

Flow

Colour Swatch
      ↓
Selected Colour
      ↓
Colour-specific Image Data
      ↓
Gallery Update
      ↓
Updated Car Images

This feature is implemented through JavaScript and structured vehicle
image data.

🏎️ Variant Selection

Users can switch between available vehicle variants from the Car Details
page.

For example:

M4 Competition
      ↓
M4 CS

When a different variant is selected, the corresponding information and
specifications are updated.

Concepts Used

JavaScript objects

Event handling

Conditional logic

State handling

DOM manipulation

Dynamic rendering

❤️ Wishlist

Users can save vehicles using the heart/wishlist functionality.

The selected vehicle IDs are stored in the browser using localStorage.

Storage Flow

User clicks ❤️
      ↓
Car ID is added or removed
      ↓
JSON.stringify()
      ↓
localStorage
      ↓
Data remains after refresh

Concepts Used

localStorage

JSON.stringify()

JSON.parse()

Arrays

Event handling

State management

Event delegation

🚘 Garage

The Garage provides an area for users to manage their saved automotive
activity.

It can be used for managing information such as:

Saved vehicles

Wishlist items

Enquiries

Test-drive related information

The current implementation uses browser-side state and localStorage.

⚖️ Car Comparison

AUTOVERSE includes a comparison experience that allows users to evaluate
selected vehicles.

The comparison interface can present vehicle information such as:

Specifications

Performance

Features

General vehicle information

The information is generated from the centralized car dataset.

👤 Authentication

AUTOVERSE includes frontend authentication-related pages and
functionality:

Login

Signup

Forgot Password

Form validation

Password confirmation

Login state handling

Logout functionality

Important: The current authentication system is a
frontend/browser-side implementation and is not intended to provide
production-level security.

A production implementation would require a backend, secure password
hashing, server-side validation and secure session/token management.

📞 Contact & Test Drive

The Contact page provides different enquiry options.

Depending on the selected enquiry type, additional form fields can be
displayed dynamically.

For example:

Book a Test Drive
        ↓
Date
Time
Location
        ↓
Submit Request

This demonstrates:

Forms

Form validation

Change events

Conditional UI

DOM manipulation

JavaScript event handling

📱 Responsive Design

AUTOVERSE is designed to work across different screen sizes.

The website has been tested on:

🖥️ Desktop

💻 Laptop

📱 Tablet

📱 Mobile

Responsive Features

Responsive navigation

Mobile navigation menu

Flexible layouts

CSS Grid

Flexbox

Responsive typography

Adaptive spacing

Responsive forms

Responsive car cards

Responsive images

Mobile-friendly buttons

Responsive animations

The layout changes according to the viewport using CSS media queries.

Design Principle

One codebase. Different layouts depending on the viewport.

🎨 UI & Theme

AUTOVERSE follows a premium automotive design language featuring:

Dark luxury interface

Red and gold accent elements

Modern typography

Smooth transitions

Hover effects

CSS animations

Responsive components

Light/dark theme functionality

The design aims to maintain a consistent visual identity throughout the
website.

🛠️ Technology Stack

Technology               Purpose

HTML5                Website structure and semantic markup
CSS3                 Styling, layouts, animations and responsive design
Vanilla JavaScript   Logic and interactivity
CSS Grid             Two-dimensional responsive layouts
Flexbox              One-dimensional alignment and layouts
LocalStorage         Browser-side data persistence
Git                  Version control
GitHub               Repository and team collaboration
VS Code              Development environment
Chrome DevTools      Debugging and responsive testing
Jest                 Testing selected JavaScript logic

📂 Project Structure

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

🧠 JavaScript Concepts Used

AUTOVERSE demonstrates several important JavaScript concepts.

Arrays

Vehicle information is maintained as a collection of JavaScript objects.

Example:

const CARS = [
    {
        id: "bmw-m4",
        brand: "BMW",
        name: "M4",
        price: "₹1.20 Crore"
    }
];

Objects

Each vehicle can contain related properties such as:

ID

Brand

Name

Price

Specifications

Images

Colours

Variants

Features

Using objects allows related information to be grouped together.

Array Methods

The project uses methods including:

filter()
map()
forEach()
find()

filter()

Used to select vehicles matching search and filter conditions.

map()

Used to transform data into dynamically generated content.

forEach()

Used to perform an operation for each item in a collection.

find()

Used to locate a specific vehicle object.

🌐 DOM Manipulation

JavaScript dynamically updates parts of the webpage instead of requiring
a full page reload.

Examples include:

Car cards

Vehicle specifications

Images

Wishlist state

Forms

Navigation

Theme controls

Dynamic content

Important DOM methods and properties include:

document.getElementById()
document.querySelector()
document.querySelectorAll()
element.classList
element.innerHTML

🖱️ Event Handling

The website uses browser events such as:

click
input
change
submit
DOMContentLoaded

Example:

searchInput.addEventListener("input", applyFilters);

Events allow the website to respond immediately to user actions.

💾 Browser Storage

The project uses browser localStorage for client-side persistence.

Common operations include:

localStorage.setItem()
localStorage.getItem()

Arrays and objects can be converted into strings using:

JSON.stringify()

and converted back using:

JSON.parse()

👥 Event Delegation

Dynamic elements such as wishlist buttons can be handled using event
delegation.

Instead of attaching separate listeners to every dynamically generated
element, a parent element can handle the event and identify the actual
clicked element.

Important concepts include:

event.target
closest()
getAttribute()

This approach is useful when elements are generated dynamically using
JavaScript.

♿ Accessibility

The website includes several accessibility considerations:

Semantic HTML5

Skip-to-content navigation

Meaningful image alt text

Accessible buttons

ARIA attributes where required

Keyboard-friendly controls

Visually hidden .sr-only labels

prefers-reduced-motion support

These practices help make the website more usable for different users
and assistive technologies.

🔍 SEO & Metadata

The website includes basic SEO and metadata features such as:

Page titles

Meta descriptions

Open Graph metadata

Twitter card metadata

Favicon

Semantic HTML structure

These features improve the way pages are identified and shared.

🧪 Testing

The project was tested for:

Page navigation

Search functionality

Brand filtering

Car details

Colour selection

Variant selection

Wishlist persistence

Form validation

Invalid car IDs

Responsive layouts

Different viewport sizes

Chrome DevTools was used to test responsive behaviour at different
screen widths.

Selected JavaScript logic can also be tested using Jest.

🔄 Development Workflow

The team used Git and GitHub for version control and collaboration.

Basic Workflow

git pull origin main

After making and testing changes:

git status
git add .
git commit -m "Meaningful commit message"
git push origin main

Team Rules

Pull the latest code before starting work.

Work on the assigned part of the project.

Test changes before pushing.

Use meaningful commit messages.

Communicate before making major changes.

Avoid editing another member's assigned files without discussion.

Resolve Git conflicts carefully.

Avoid force-pushing unless the team agrees.

🌳 Git Collaboration Workflow

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

GitHub was used to maintain the project repository and coordinate the
work of the three team members.

🎓 Learning Outcomes

Through AUTOVERSE, the team applied and strengthened knowledge of:

Semantic HTML5

CSS Grid

CSS Flexbox

Responsive Web Design

CSS Animations

JavaScript

Arrays and Objects

Array Methods

DOM Manipulation

Event Handling

URL Parameters

LocalStorage

Form Validation

Git

GitHub Collaboration

Browser Developer Tools

Debugging

Team-based Software Development

🚀 Future Scope

AUTOVERSE can be extended into a complete production-level automotive
platform.

Backend & Database

Node.js backend

Express.js API

Real database integration

Persistent vehicle inventory

Secure Authentication

Password hashing

Server-side validation

Secure sessions

Token-based authentication

User accounts

Admin Dashboard

An administrator could manage:

Cars

Brands

Specifications

Images

Pricing

Inventory

User enquiries

Real-Time Inventory

Future versions could display:

Vehicle availability

Live pricing

Stock status

Dealer information

Booking System

The current enquiry flow could be extended into a real booking platform
with:

Test-drive scheduling

Confirmation emails

Appointment management

Dealer notifications

Payment Integration

Secure online payment could be introduced for bookings or other
automotive services.

⚠️ Current Limitations

The current project is primarily a frontend implementation.

Therefore:

There is no production backend.

Authentication is browser-side.

Vehicle data is stored in JavaScript.

Wishlist persistence uses browser localStorage.

Test-drive and enquiry forms are frontend demonstrations.

Browser-side storage can be modified by the user.

Production-level security would require server-side implementation.

These limitations provide clear opportunities for future backend
development.

🎯 Project Objective

The main objective of AUTOVERSE was to demonstrate how fundamental
frontend development concepts can be combined into a complete
interactive application.

The project combines:

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

The result is a modern, responsive and interactive automotive showcase
website.

📄 Academic Project

Project: AUTOVERSE --- Car Showcase Website

Course: Frontend Engineering-II

Project Type: Academic / Educational Project

Technologies: HTML5 • CSS3 • Vanilla JavaScript

Repository:
https://github.com/hitarth16102006-ui/Car-Showcase-Website

Team

Hitarth Gujral • Vansh Goyal • Angel Goel

⭐ Acknowledgement

AUTOVERSE was developed as a collaborative academic project to apply
frontend web development concepts in a practical real-world style
application.

The three team members contributed to the design, development, testing
and integration of the project.

📜 License

This project is created for educational and academic purposes.

🚗 AUTOVERSE

Discover. Compare. Customize. Drive.

Built with HTML5 • CSS3 • JavaScript • Creativity • Teamwork
