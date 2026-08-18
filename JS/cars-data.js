/* ================================================
   cars-data.js
   Single source of truth for every car on the site.
   Used by cars.js (listing + search/filter) and
   details.js (car detail page, gallery carousel,
   colours, variants, similar cars).

   Each car has an `images` object with up to 4
   angles: front, side, interior, back. Any angle
   set to null renders as a labelled placeholder
   frame in the gallery carousel instead of a photo.
   ================================================ */

var CAR_COLORS = [
    { name: "Jet Black", hex: "#0a0a0a" },
    { name: "Alpine White", hex: "#f2f2f2" },
    { name: "Racing Red", hex: "#c81e2c" },
    { name: "Storm Grey", hex: "#4a4a4a" },
    { name: "Deep Blue", hex: "#1c3a5e" }
];

/* Generic, non-photorealistic vector illustrations used wherever a
   real photo isn't available. They are intentionally simple line-art
   silhouettes (not brand-specific), tinted with the selected paint
   colour via currentColor, so it's clear these are stand-in graphics
   rather than actual photos of the car. */
var CAR_SILHOUETTE_SVG =
    '<svg viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M10 68 L28 68 C33 50 50 34 72 30 L128 30 C150 34 164 48 176 58 L206 62 C212 63 214 66 214 70 L214 76 L10 76 Z"/>' +
        '<path d="M72 30 L82 48 L150 48 L140 30" />' +
        '<line x1="10" y1="68" x2="214" y2="68" />' +
        '<circle cx="56" cy="76" r="14" />' +
        '<circle cx="168" cy="76" r="14" />' +
    '</svg>';

var INTERIOR_ICON_SVG =
    '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="50" cy="50" r="34" />' +
        '<circle cx="50" cy="50" r="9" />' +
        '<line x1="50" y1="16" x2="50" y2="32" />' +
        '<line x1="21" y1="66" x2="35" y2="57" />' +
        '<line x1="79" y1="66" x2="65" y2="57" />' +
    '</svg>';

/* Builds a labelled placeholder frame for a car photo angle that
   hasn't been supplied yet. */
function placeholderFrameHTML(car, label, tintHex) {
    var icon = label === 'Interior' ? INTERIOR_ICON_SVG : CAR_SILHOUETTE_SVG;

    return (
        '<div class="placeholder-car" style="border-color:' + tintHex + '66; color:' + tintHex + ';">' +
            '<div class="placeholder-icon">' + icon + '</div>' +
            car.brand.toUpperCase() + '<br><strong>' + car.name.replace(car.brand, '').trim().toUpperCase() + '</strong>' +
            '<em>' + label + ' photo coming soon</em>' +
        '</div>'
    );
}

var CARS = [
    {
        id: "bmw-m4",
        brand: "BMW",
        name: "BMW M4",
        images: { front: "../Images/bmw-m4.png", side: null, interior: "../Images/buick-interior.png", back: "../Images/dodge-back.jpg" },
        colorImages: {
            "Racing Red": { front: null, side: "../Images/bmw-m4-red-side.png", interior: null, back: null },
            "Jet Black": { front: "../Images/bmw-m4-black-front.png", side: null, interior: null, back: null },
            "Alpine White": { front: "../Images/bmw-m4-white-front.png", side: null, interior: null, back: null },
            "Sun Yellow": { front: "../Images/bmw-m4-yellow-front.png", side: null, interior: null, back: null },
            "Lime Green": { front: null, side: "../Images/bmw-m4-limegreen-side.png", interior: null, back: "../Images/bmw-m4-limegreen-back.png" },
            "Isle of Man Green": { front: "../Images/bmw-m4-racinggreen-front.png", side: null, interior: null, back: "../Images/bmw-m4-racinggreen-back.png" },
            "Laguna Seca Blue": { front: "../Images/bmw-m4-blue-front.png", side: "../Images/bmw-m4-blue-side.png", interior: null, back: null },
            "Frozen Blue": { front: "../Images/bmw-m4-frozenblue-front.png", side: null, interior: null, back: null }
        },
        description: "A razor-sharp coupe that blends everyday usability with true M-division performance.",
        specs: { engine: "3.0L Twin-Turbo Inline-6", transmission: "8-Speed Auto", seating: "4 Seats", fuelType: "Petrol" },
        features: ["Adaptive M Suspension", "Carbon Fibre Roof", "M Sport Differential", "Head-Up Display", "Harman Kardon Audio", "Adaptive LED Headlights"],
        colors: [
            { name: "Racing Red", hex: "#c81e2c" },
            { name: "Jet Black", hex: "#0a0a0a" },
            { name: "Alpine White", hex: "#f2f2f2" },
            { name: "Sun Yellow", hex: "#f4d13d" },
            { name: "Lime Green", hex: "#b6e83a" },
            { name: "Isle of Man Green", hex: "#1b4d3e" },
            { name: "Laguna Seca Blue", hex: "#1c6fbf" },
            { name: "Frozen Blue", hex: "#3a4f7a" }
        ],
        variants: [
            { id: "competition", label: "M4 Competition", fuelType: "Petrol", power: 510, torque: 650, topSpeed: 290, accel: "3.9s", priceCr: 1.20, extraFeatures: [] },
            { id: "cs", label: "M4 CS", fuelType: "Petrol", power: 550, torque: 650, topSpeed: 302, accel: "3.4s", priceCr: 1.45, extraFeatures: ["Carbon Bucket Seats", "Track-Tuned Chassis"] }
        ],
        reviews: [
            { name: "Rahul Sharma", initials: "RS", rating: 5, text: "Bought my M4 Competition through Autoverse and the whole process was smooth and quick. The team was very professional throughout." },
            { name: "Sanya Kapoor", initials: "SK", rating: 5, text: "The Laguna Seca Blue is even better in person. M Sport Differential makes corner exits addictive." },
            { name: "Arnav Puri", initials: "AP", rating: 4, text: "Firm ride on Indian roads but that's expected from a proper M car. Adaptive suspension helps a lot in Comfort mode." },
            { name: "Neha Joshi", initials: "NJ", rating: 5, text: "Test drove the CS variant after browsing here and immediately upgraded my booking. Worth every rupee of the difference." },
            { name: "Karan Gill", initials: "KG", rating: 5, text: "Harman Kardon audio and the carbon roof were the deciding factors for me. Delivery was right on schedule too." }
        ]
    },
    {
        id: "audi-r8",
        brand: "Audi",
        name: "Audi R8",
        images: { front: "../Images/audi-r8.png", side: null, interior: "../Images/tata-interior.png", back: "../Images/mclaren-720s-back.jpg" },
        colorImages: {
            "Ibis White": { front: "../Images/audi-r8-white-front.png", side: null, interior: null, back: "../Images/audi-r8-white-back.png" },
            "Florett Silver": { front: "../Images/audi-r8-silver-front.png", side: null, interior: null, back: null },
            "Tango Red": { front: "../Images/audi-r8-red-front.png", side: "../Images/audi-r8-red-side.png", interior: null, back: "../Images/audi-r8-red-back.png" },
            "Daytona Grey": { front: "../Images/audi-r8-grey-front.png", side: "../Images/audi-r8-grey-side.png", interior: null, back: null }
        },
        reviews: [
            { name: "Kabir Malhotra", initials: "KM", rating: 5, text: "The naturally aspirated V10 is a dying breed and Audi nailed it. Bought the Daytona Grey and it looks even better in person." },
            { name: "Simone D'Souza", initials: "SD", rating: 5, text: "Daily drove my R8 for a year now. Quattro grip makes it usable even in the monsoon, which surprised everyone at the dealership." },
            { name: "Yash Oberoi", initials: "YO", rating: 4, text: "Test drove the Performance variant after enquiring on Autoverse. Brutally fast, though rear visibility takes some getting used to." },
            { name: "Ananya Bhalla", initials: "AB", rating: 5, text: "Virtual Cockpit and B&O sound system make this feel like a spaceship. The Tango Red paint is stunning under sunlight." },
            { name: "Rajveer Chadha", initials: "RC", rating: 5, text: "Best decision booking a private viewing here. Sales team knew every spec by heart and the car matched the listing exactly." }
        ],
        description: "Audi's mid-engine flagship, pairing a screaming naturally aspirated V10 with everyday quattro grip.",
        specs: { engine: "5.2L V10", transmission: "7-Speed S-Tronic", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Quattro All-Wheel Drive", "Virtual Cockpit", "Magnetic Ride", "Carbon Sigma Package", "Bang & Olufsen Audio", "Laser Headlights"],
        colors: [
            { name: "Ibis White", hex: "#f5f5f5" },
            { name: "Florett Silver", hex: "#c8c8c8" },
            { name: "Tango Red", hex: "#c81e2c" },
            { name: "Daytona Grey", hex: "#4a4a4a" }
        ],
        variants: [
            { id: "v10", label: "R8 V10", fuelType: "Petrol", power: 570, torque: 550, topSpeed: 324, accel: "3.4s", priceCr: 2.50, extraFeatures: [] },
            { id: "v10-performance", label: "R8 V10 Performance", fuelType: "Petrol", power: 620, torque: 580, topSpeed: 331, accel: "3.1s", priceCr: 2.85, extraFeatures: ["Carbon Ceramic Brakes", "Performance Exhaust"] }
        ]
    },
    {
        id: "mercedes-amg-gt",
        brand: "Mercedes",
        name: "Mercedes AMG GT",
        images: { front: "../Images/mercedes-amg-gt.png", side: null, interior: "../Images/mercedes-interior.png", back: "../Images/lamborghini-aventador-svj-back.png" },
        description: "A front mid-engine grand tourer built by AMG's One Man, One Engine philosophy.",
        specs: { engine: "4.0L Twin-Turbo V8", transmission: "9-Speed AMG Speedshift", seating: "2 Seats", fuelType: "Petrol" },
        features: ["AMG Ride Control", "Race Start Launch Control", "Burmester Audio", "Adjustable Rear Wing", "AMG Track Pace", "Nappa Leather Interior"],
        colors: CAR_COLORS,
        variants: [
            { id: "gt", label: "AMG GT", fuelType: "Petrol", power: 476, torque: 600, topSpeed: 285, accel: "3.9s", priceCr: 2.20, extraFeatures: [] },
            { id: "gt-r", label: "AMG GT R", fuelType: "Petrol", power: 577, torque: 700, topSpeed: 318, accel: "3.5s", priceCr: 2.65, extraFeatures: ["Active Rear-Wheel Steering", "Widebody Kit"] }
        ],
        reviews: [
            { name: "Ananya Desai", initials: "AD", rating: 5, text: "One Man, One Engine philosophy really shows in how this car pulls. Burmester audio is the icing on top." },
            { name: "Rohan Malhotra", initials: "RM", rating: 5, text: "Booked the AMG GT R after a private viewing arranged through Autoverse. Widebody kit looks incredible in person." },
            { name: "Pooja Bhatia", initials: "PB", rating: 4, text: "Long bonnet takes getting used to in tight parking but the driving position and sound more than make up for it." },
            { name: "Ishaan Dutta", initials: "ID", rating: 5, text: "Track Pace telemetry is a fun touch for weekend circuit days. Adjustable rear wing is functional, not just for show." },
            { name: "Simran Chawla", initials: "SC", rating: 5, text: "Nappa leather interior feels genuinely premium. Sales team here answered every spec question before I even visited." }
        ]
    },
    {
        id: "ferrari-sf90",
        brand: "Ferrari",
        name: "Ferrari SF90",
        images: { front: "../Images/ferrari-sf90.png", side: null, interior: "../Images/ferrari-interior.png", back: "../Images/ferrari-sf90-back.jpg" },
        description: "Ferrari's first series-production plug-in hybrid, combining a twin-turbo V8 with three electric motors.",
        specs: { engine: "4.0L Twin-Turbo V8 + 3 Electric Motors", transmission: "8-Speed DCT", seating: "2 Seats", fuelType: "Hybrid" },
        features: ["eAWD Electric All-Wheel Drive", "25km Full-Electric Range", "Carbon Fibre Monocoque", "Side Slip Control 8.0", "Active Aero", "Racing-Derived Brake-by-Wire"],
        colors: CAR_COLORS,
        variants: [
            { id: "stradale", label: "SF90 Stradale", fuelType: "Hybrid", power: 986, torque: 800, topSpeed: 340, accel: "2.5s", priceCr: 4.50, extraFeatures: [] },
            { id: "xx-stradale", label: "SF90 XX Stradale", fuelType: "Hybrid", power: 1030, torque: 820, topSpeed: 350, accel: "2.3s", priceCr: 5.20, extraFeatures: ["Track-Focused Aero Kit", "Lightweight Forged Wheels"] }
        ],
        reviews: [
            { name: "Aditya Thakur", initials: "AT", rating: 5, text: "986 horsepower with a 25km electric-only range is a genuinely absurd combination. Daily usable, weekend savage." },
            { name: "Meera Singh", initials: "MS", rating: 5, text: "eAWD makes the SF90 shockingly easy to drive fast. The whole booking process through Autoverse felt white-glove." },
            { name: "Harsh Kohli", initials: "HK", rating: 4, text: "Cabin tech takes a session to fully learn but once you do, it's the most immersive supercar interior I've sat in." },
            { name: "Vikram Rao", initials: "VR", rating: 5, text: "Side Slip Control 8.0 genuinely changes how confident you feel pushing it near the limit. Ferrari engineering at its peak." },
            { name: "Aarushi Malhan", initials: "AM", rating: 5, text: "Active aero and the carbon monocoque justify every rupee of the premium over lesser supercars in this bracket." }
        ]
    },
    {
        id: "lamborghini-huracan",
        brand: "Lamborghini",
        name: "Lamborghini Huracan",
        images: { front: "../Images/lamborghini-huracan.png", side: null, interior: "../Images/lamborghini-interior.png", back: "../Images/ferrari-sf90-back.jpg" },
        description: "A naturally aspirated V10 supercar that delivers pure, uncompromising Lamborghini theatre.",
        specs: { engine: "5.2L V10", transmission: "7-Speed DCT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Lamborghini Dinamica Veicolo Integrata", "All-Wheel Steering", "Carbon Ceramic Brakes", "Forged Composite Body Panels", "Track Telemetry", "Alcantara Interior"],
        colors: CAR_COLORS,
        variants: [
            { id: "evo", label: "Huracan EVO", fuelType: "Petrol", power: 630, torque: 600, topSpeed: 325, accel: "2.9s", priceCr: 3.50, extraFeatures: [] },
            { id: "sto", label: "Huracan STO", fuelType: "Petrol", power: 640, torque: 565, topSpeed: 310, accel: "3.0s", priceCr: 3.95, extraFeatures: ["Motorsport-Derived Aero", "Titanium Exhaust"] }
        ],
        reviews: [
            { name: "Arjun Mehta", initials: "AM", rating: 5, text: "Verified dealers and honest prices. I saved a lot compared to what other platforms quoted for the same Huracan EVO." },
            { name: "Tanvi Rathore", initials: "TR", rating: 5, text: "That naturally aspirated V10 scream at 8000 rpm is why I chose the STO over turbocharged rivals. Zero regrets." },
              { name: "Dhruv Kapadia", initials: "DK", rating: 4, text: "STO is track-focused, so ride quality on broken city roads is a compromise you need to accept going in." },
            { name: "Riya Sabharwal", initials: "RS", rating: 5, text: "Alcantara interior and the forged composite panels feel special every time I open the door. True Lamborghini theatre." },
            { name: "Nakul Bedi", initials: "NB", rating: 5, text: "All-wheel steering makes it feel smaller than it is through tight corners. Booked mine after a track demo day." }
        ]
    },
    {
        id: "porsche-911-turbo-s",
        brand: "Porsche",
        name: "Porsche 911 Turbo S",
        images: { front: "../Images/porsche-911.png", side: null, interior: "../Images/porsche-interior.png", back: "../Images/dodge-back.jpg" },
        description: "A high-performance sports car that combines everyday comfort with Porsche engineering and incredible speed.",
        specs: { engine: "3.7L Twin-Turbo Flat-6", transmission: "8-Speed PDK", seating: "4 Seats", fuelType: "Petrol" },
        features: ["Adaptive Cruise Control", "Premium Sound System", "LED Headlights", "Parking Sensors", "Performance Brakes", "Premium Interior"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "Turbo S Coupe", fuelType: "Petrol", power: 572, torque: 750, topSpeed: 330, accel: "2.7s", priceCr: 1.80, extraFeatures: [] },
            { id: "cabriolet", label: "Turbo S Cabriolet", fuelType: "Petrol", power: 572, torque: 750, topSpeed: 320, accel: "2.8s", priceCr: 1.95, extraFeatures: ["Power Soft Top", "Wind Deflector"] }
        ],
        reviews: [
            { name: "Priya Patel", initials: "PP", rating: 5, text: "I was a little nervous about buying a car online but Autoverse made it easy. Got my 911 Turbo S at a great price." },
            { name: "Siddharth Anand", initials: "SA", rating: 5, text: "Everyday usability with genuine supercar pace is the whole point of a 911, and this one nails it perfectly." },
            { name: "Fatima Sheikh", initials: "FS", rating: 4, text: "Rear seats are more symbolic than usable for adults, but that's a 911 thing, not an Autoverse thing." },
            { name: "Kunal Sarin", initials: "KS", rating: 5, text: "PDK gearbox shifts are instant. Booked a test drive here and drove home the same week." },
            { name: "Bhavya Nanda", initials: "BN", rating: 5, text: "The Cabriolet with the power soft top is the perfect weekend car. Premium sound system is a genuine highlight too." }
        ]
    },
    {
        id: "lamborghini-aventador-svj",
        brand: "Lamborghini",
        name: "Lamborghini Aventador SVJ",
        images: { front: "../Images/lamborghini-aventador-svj-front.png", side: null, interior: "../Images/mahindra-interior.png", back: "../Images/lamborghini-aventador-svj-back.png" },
        description: "The most track-focused Aventador ever built, with active aerodynamics and a screaming V12.",
        specs: { engine: "6.5L V12", transmission: "7-Speed ISR", seating: "2 Seats", fuelType: "Petrol" },
        features: ["ALA Active Aerodynamics", "Rear-Wheel Steering", "Carbon Fibre Monocoque", "Magnetorheological Suspension", "Track Data Logger", "Nurburgring-Tuned Chassis"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "SVJ Coupe", fuelType: "Petrol", power: 770, torque: 720, topSpeed: 350, accel: "2.8s", priceCr: 5.70, extraFeatures: [] },
            { id: "roadster", label: "SVJ Roadster", fuelType: "Petrol", power: 770, torque: 720, topSpeed: 349, accel: "2.9s", priceCr: 6.10, extraFeatures: ["Removable Carbon Roof Panels"] }
        ]
    },
    {
        id: "ferrari-roma",
        brand: "Ferrari",
        name: "Ferrari Roma",
        images: { front: "../Images/ferrari-roma-front.png", side: null, interior: "../Images/generic-cream-interior.png", back: "../Images/mclaren-720s-back.jpg" },
        description: "A sleek 2+ grand tourer inspired by 1950s and '60s dolce vita Rome, blending elegance with a twin-turbo V8.",
        specs: { engine: "3.9L Twin-Turbo V8", transmission: "8-Speed DCT", seating: "4 Seats", fuelType: "Petrol" },
        features: ["Manettino Dial", "Side Slip Control", "Digital Cockpit", "JBL Premium Audio", "Adaptive Suspension", "Wireless CarPlay"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "Roma Coupe", fuelType: "Petrol", power: 620, torque: 760, topSpeed: 320, accel: "3.4s", priceCr: 3.10, extraFeatures: [] },
            { id: "spider", label: "Roma Spider", fuelType: "Petrol", power: 620, torque: 760, topSpeed: 316, accel: "3.4s", priceCr: 3.45, extraFeatures: ["Retractable Fabric Roof"] }
        ]
    },
    {
        id: "porsche-panamera-e-hybrid",
        brand: "Porsche",
        name: "Porsche Panamera Turbo S E-Hybrid",
        images: { front: "../Images/porsche-panamera-front.png", side: null, interior: "../Images/futuristic-concept-interior.png", back: "../Images/lamborghini-aventador-svj-back.png" },
        description: "A four-door luxury sports sedan available with a hybrid drivetrain that pairs V8 power with electric torque.",
        specs: { engine: "4.0L Twin-Turbo V8 + Electric Motor", transmission: "8-Speed PDK", seating: "4 Seats", fuelType: "Hybrid" },
        features: ["Porsche Active Suspension", "Adaptive Air Suspension", "Rear-Wheel Steering", "Panoramic Roof", "Burmester 3D Audio", "Electric-Only Driving Mode"],
        colors: CAR_COLORS,
        variants: [
            { id: "e-hybrid", label: "Turbo S E-Hybrid", fuelType: "Hybrid", power: 690, torque: 870, topSpeed: 315, accel: "3.1s", priceCr: 2.35, extraFeatures: ["44km Electric Range"] },
            { id: "turbo-petrol", label: "Turbo (Petrol)", fuelType: "Petrol", power: 620, torque: 820, topSpeed: 306, accel: "3.3s", priceCr: 1.95, extraFeatures: [] }
        ]
    },
    {
        id: "audi-rs7-sportback",
        brand: "Audi",
        name: "Audi RS7 Sportback",
        images: { front: "../Images/audi-rs7-front.png", side: null, interior: "../Images/bentley-interior3-dup.png", back: "../Images/ferrari-sf90-back.jpg" },
        description: "A four-door coupe that hides supercar performance beneath a practical, everyday-usable body.",
        specs: { engine: "4.0L Twin-Turbo V8", transmission: "8-Speed Tiptronic", seating: "5 Seats", fuelType: "Petrol" },
        features: ["Quattro All-Wheel Drive", "48V Mild-Hybrid System", "Matrix LED Headlights", "Sport Differential", "Bang & Olufsen 3D Audio", "Adaptive Air Suspension"],
        colors: CAR_COLORS,
        variants: [
            { id: "rs7", label: "RS7 Sportback", fuelType: "Petrol", power: 600, torque: 800, topSpeed: 250, accel: "3.6s", priceCr: 1.94, extraFeatures: [] },
            { id: "rs7-performance", label: "RS7 Performance", fuelType: "Petrol", power: 630, torque: 850, topSpeed: 305, accel: "3.3s", priceCr: 2.15, extraFeatures: ["Dynamic Package Plus"] }
        ]
    },
    {
        id: "bmw-i8",
        brand: "BMW",
        name: "BMW i8",
        images: { front: "../Images/bmw-i8-front.png", side: null, interior: "../Images/bmw-interior.png", back: "../Images/bmw-i8-back.png" },
        description: "A futuristic plug-in hybrid sports car built around a carbon-fibre passenger cell for efficiency and performance.",
        specs: { engine: "1.5L Turbo 3-Cyl + Electric Motor", transmission: "6-Speed Auto + 2-Speed Electric", seating: "4 Seats", fuelType: "Hybrid" },
        features: ["Carbon Fibre Life Module", "eDrive Electric-Only Mode", "Butterfly Doors", "Laser Headlights", "BMW Head-Up Display", "Regenerative Braking"],
        colors: CAR_COLORS,
        reviews: [
            { name: "Nikhil Bajwa", initials: "NB", rating: 5, text: "The butterfly doors get a crowd every single time I park it downtown. Still turns heads years after launch." },
            { name: "Trisha Nair", initials: "TN", rating: 4, text: "Great for city commutes on electric-only mode, and the hybrid kick-in feels seamless. Just wish the boot was bigger." },
            { name: "Aryan Vohra", initials: "AV", rating: 5, text: "Enquired here about the Roadster variant and had it booked within a week. Feels like driving a spaceship every day." },
            { name: "Ridhima Sood", initials: "RS", rating: 5, text: "Fuel savings from the hybrid setup are real, and it still has proper sports car presence. Zero regrets." },
            { name: "Omkar Deshmukh", initials: "OD", rating: 4, text: "Cabin is snug for taller drivers but the driving dynamics and futuristic design more than make up for it." }
        ],
        variants: [
            { id: "coupe", label: "i8 Coupe", fuelType: "Hybrid", power: 369, torque: 570, topSpeed: 250, accel: "4.4s", priceCr: 1.65, extraFeatures: ["53km Electric Range"] },
            { id: "roadster", label: "i8 Roadster", fuelType: "Hybrid", power: 369, torque: 570, topSpeed: 250, accel: "4.6s", priceCr: 1.85, extraFeatures: ["Power Soft Top"] }
        ]
    },
    {
        id: "range-rover-autobiography",
        brand: "Range Rover",
        name: "Range Rover Autobiography",
        images: { front: "../Images/range-rover-front.png", side: null, interior: "../Images/range-rover-interior.png", back: "../Images/range-rover-back.png" },
        colorImages: {
            "Champagne Gold": { front: "../Images/rangerover-gold-front.png", side: null, interior: null, back: null },
            "Garnet Red": { front: "../Images/rangerover-red-front.png", side: null, interior: null, back: null },
            "Santorini Black": { front: "../Images/range-rover-front.png", side: null, interior: null, back: null }
        },
        description: "The definitive full-size luxury SUV, offered with either an efficient diesel or a powerful petrol engine.",
        specs: { engine: "3.0L I6 (Diesel/Petrol options)", transmission: "8-Speed Auto", seating: "5 Seats", fuelType: "Diesel" },
        features: ["Terrain Response 2", "Air Suspension", "Executive Class Rear Seats", "Meridian Signature Sound", "Adaptive Cruise Control", "Night Vision Camera"],
        colors: [
            { name: "Champagne Gold", hex: "#b89a6e" },
            { name: "Garnet Red", hex: "#7a2e2b" },
            { name: "Santorini Black", hex: "#2b2b2b" }
        ],
        variants: [
            { id: "diesel", label: "3.0L Diesel", fuelType: "Diesel", power: 350, torque: 700, topSpeed: 234, accel: "6.3s", priceCr: 2.10, extraFeatures: ["Best-in-class Fuel Economy"] },
            { id: "petrol", label: "4.4L Petrol V8", fuelType: "Petrol", power: 530, torque: 750, topSpeed: 250, accel: "4.6s", priceCr: 2.45, extraFeatures: ["Sport Exhaust"] }
        ]
    },
    {
        id: "bentley-continental-gt",
        brand: "Bentley",
        name: "Bentley Continental GT",
        images: { front: "../Images/bentley-continental-gt-front.png", side: null, interior: "../Images/bentley-continental-gt-interior.png", back: "../Images/mclaren-720s-back.jpg" },
        description: "A hand-crafted British grand tourer that blends effortless V8 or W12 power with true luxury.",
        specs: { engine: "4.0L V8 / 6.0L W12", transmission: "8-Speed DCT", seating: "4 Seats", fuelType: "Petrol" },
        features: ["Rotating Dashboard Display", "Naim for Bentley Audio", "All-Wheel Drive", "Adaptive Air Suspension", "Diamond-Quilted Leather", "Massage Seats"],
        colors: CAR_COLORS,
        variants: [
            { id: "v8", label: "Continental GT V8", fuelType: "Petrol", power: 550, torque: 770, topSpeed: 318, accel: "4.0s", priceCr: 3.85, extraFeatures: [] },
            { id: "w12-speed", label: "Continental GT Speed W12", fuelType: "Petrol", power: 659, torque: 900, topSpeed: 335, accel: "3.5s", priceCr: 4.60, extraFeatures: ["Electronic Active Differential"] }
        ]
    },
    {
        id: "rolls-royce-ghost",
        brand: "Rolls-Royce",
        name: "Rolls-Royce Ghost",
        images: { front: "../Images/rolls-royce-ghost-front.png", side: null, interior: "../Images/rollsroyce-interior.png", back: "../Images/lamborghini-aventador-svj-back.png" },
        description: "The most technologically advanced Rolls-Royce ever built, prioritising silence and effortless power.",
        specs: { engine: "6.75L Twin-Turbo V12", transmission: "8-Speed Auto", seating: "5 Seats", fuelType: "Petrol" },
        features: ["Planar Suspension System", "Starlight Headliner", "Whisper-Quiet Cabin", "Bespoke Audio System", "Satellite-Aided Transmission", "Illuminated Fascia"],
        colors: CAR_COLORS,
        variants: [
            { id: "standard", label: "Ghost", fuelType: "Petrol", power: 563, torque: 850, topSpeed: 250, accel: "4.8s", priceCr: 7.95, extraFeatures: [] },
            { id: "extended", label: "Ghost Extended", fuelType: "Petrol", power: 563, torque: 850, topSpeed: 250, accel: "5.0s", priceCr: 8.90, extraFeatures: ["Extended Rear Legroom", "Rear Theatre Configuration"] }
        ]
    },
    {
        id: "aston-martin-db11",
        brand: "Aston Martin",
        name: "Aston Martin DB11",
        images: { front: "../Images/aston-martin-db11-front.png", side: null, interior: "../Images/bentley-interior2.png", back: "../Images/ferrari-sf90-back.jpg" },
        reviews: [
            { name: "Rohit Ahuja", initials: "RA", rating: 5, text: "Picked up my DB11 in British Racing Green and it still stops traffic every single time. The V12 soundtrack alone is worth the price." },
            { name: "Meher Kapoor", initials: "MK", rating: 5, text: "Booked a test drive through Autoverse and the showroom experience was flawless. Genuinely felt like buying a piece of art, not just a car." },
            { name: "Devansh Rana", initials: "DR", rating: 4, text: "Interior craftsmanship is unmatched at this price point. Only wish the infotainment felt a bit more modern, but I forgive it for how it drives." },
            { name: "Ira Sethi", initials: "IS", rating: 5, text: "The convertible top operation and cabin refinement make this the perfect daily-usable grand tourer. Highly recommend the AMR trim." },
            { name: "Farhan Qureshi", initials: "FQ", rating: 5, text: "Autoverse's enquiry team arranged a private viewing within two days. The DB11 delivers effortless power with old-school elegance." }
        ],
        description: "A handsome British grand tourer offered with a twin-turbo V8 or a thunderous V12.",
        specs: { engine: "4.0L Twin-Turbo V8 / 5.2L Twin-Turbo V12", transmission: "8-Speed Auto", seating: "4 Seats", fuelType: "Petrol" },
        features: ["Aeroblade Active Aerodynamics", "Adaptive Damping", "Bang & Olufsen BeoSound", "Carbon Fibre Body Panels", "Sports Exhaust", "Bespoke Leather Interior"],
        colors: CAR_COLORS,
        variants: [
            { id: "v8", label: "DB11 V8", fuelType: "Petrol", power: 503, torque: 675, topSpeed: 300, accel: "4.0s", priceCr: 3.30, extraFeatures: [] },
            { id: "amr-v12", label: "DB11 AMR V12", fuelType: "Petrol", power: 630, torque: 700, topSpeed: 335, accel: "3.7s", priceCr: 3.90, extraFeatures: ["AMR Aero Kit", "Sports Plus Suspension"] }
        ]
    },
    {
        id: "tesla-model-s-plaid",
        brand: "Tesla",
        name: "Tesla Model S Plaid",
        images: { front: "../Images/tesla-model-s-plaid-front.png", side: null, interior: "../Images/dark-minimalist-interior.png", back: "../Images/dodge-back.jpg" },
        description: "A tri-motor all-electric sedan that out-accelerates most hypercars while seating five in comfort.",
        specs: { engine: "Tri-Motor Electric Powertrain", transmission: "Single-Speed Direct Drive", seating: "5 Seats", fuelType: "Electric" },
        features: ["Full Self-Driving Capability", "17-inch Cinematic Display", "Yoke Steering Wheel", "Over-the-Air Updates", "Bioweapon Defense Mode Filter", "Track Mode"],
        colors: CAR_COLORS,
        variants: [
            { id: "plaid", label: "Plaid", fuelType: "Electric", power: 1020, torque: 1420, topSpeed: 322, accel: "1.99s", priceCr: 1.55, extraFeatures: ["396mi Range"] },
            { id: "plaid-plus", label: "Plaid+ Long Range", fuelType: "Electric", power: 1020, torque: 1420, topSpeed: 322, accel: "2.1s", priceCr: 1.75, extraFeatures: ["446mi Range", "Extended Battery Pack"] }
        ]
    },
    {
        id: "jaguar-f-type-r",
        brand: "Jaguar",
        name: "Jaguar F-Type R",
        images: { front: "../Images/jaguar-f-type-front.png", side: null, interior: "../Images/jaguar-f-type-interior.jpg", back: "../Images/mclaren-720s-back.jpg" },
        description: "A supercharged British sports car with a growling V8 soundtrack and sharp, balanced handling.",
        specs: { engine: "5.0L Supercharged V8", transmission: "8-Speed Auto", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Torque Vectoring by Braking", "Adaptive Dynamics", "Configurable Sport Exhaust", "Meridian Sound System", "All-Wheel Drive", "Launch Control"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "F-Type R Coupe", fuelType: "Petrol", power: 575, torque: 700, topSpeed: 300, accel: "3.5s", priceCr: 1.75, extraFeatures: [] },
            { id: "convertible", label: "F-Type R Convertible", fuelType: "Petrol", power: 575, torque: 700, topSpeed: 300, accel: "3.7s", priceCr: 1.95, extraFeatures: ["Power-Fold Soft Top"] }
        ]
    },
    {
        id: "mclaren-720s",
        brand: "McLaren",
        name: "McLaren 720S",
        images: { front: "../Images/mclaren-720s-front.png", side: null, interior: "../Images/buick-interior.png", back: "../Images/mclaren-720s-back.jpg" },
        description: "A featherweight carbon-tub supercar with dihedral doors and blistering twin-turbo V8 performance.",
        specs: { engine: "4.0L Twin-Turbo V8", transmission: "7-Speed DCT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Dihedral Doors", "Proactive Chassis Control II", "Variable Drift Control", "Carbon Fibre Monocage", "Folding Driver Display", "Track Telemetry"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "720S Coupe", fuelType: "Petrol", power: 710, torque: 770, topSpeed: 341, accel: "2.9s", priceCr: 4.20, extraFeatures: [] },
            { id: "spider", label: "720S Spider", fuelType: "Petrol", power: 710, torque: 770, topSpeed: 336, accel: "2.9s", priceCr: 4.60, extraFeatures: ["Retractable Hardtop"] }
        ]
    },
    {
        id: "maserati-mc20",
        brand: "Maserati",
        name: "Maserati MC20",
        images: { front: "../Images/maserati-mc20-front.png", side: null, interior: "../Images/tata-interior.png", back: "../Images/lamborghini-aventador-svj-back.png" },
        description: "Maserati's return to true supercar form, built around a bespoke twin-turbo V6 and butterfly doors.",
        specs: { engine: "3.0L Twin-Turbo V6", transmission: "8-Speed DCT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Butterfly Doors", "Carbon Fibre Monocoque", "Launch Control", "Adaptive Suspension", "Sonus Faber Audio", "Racing-Derived Aero"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "MC20 Coupe", fuelType: "Petrol", power: 630, torque: 730, topSpeed: 325, accel: "2.9s", priceCr: 3.35, extraFeatures: [] },
            { id: "cielo", label: "MC20 Cielo", fuelType: "Petrol", power: 630, torque: 730, topSpeed: 320, accel: "3.0s", priceCr: 3.75, extraFeatures: ["Electrochromic Glass Roof"] }
        ]
    },
    {
        id: "koenigsegg-jesko",
        brand: "Koenigsegg",
        name: "Koenigsegg Jesko",
        images: { front: null, side: "../Images/koenigsegg-jesko-side.png", interior: "../Images/mahindra-interior.png", back: "../Images/ferrari-sf90-back.jpg" },
        description: "A Swedish hypercar engineered around a 9-speed multi-clutch gearbox and record-chasing aerodynamics.",
        specs: { engine: "5.0L Twin-Turbo V8", transmission: "9-Speed Light Speed Transmission", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Light Speed Transmission", "Active Rear Wing", "Autoskin Doors", "Carbon Fibre Body", "Triplex Suspension", "Track-Focused Aero Package"],
        colors: CAR_COLORS,
        variants: [
            { id: "standard", label: "Jesko", fuelType: "Petrol", power: 1280, torque: 1500, topSpeed: 480, accel: "2.5s", priceCr: 22.00, extraFeatures: [] },
            { id: "absolut", label: "Jesko Absolut", fuelType: "Petrol", power: 1280, torque: 1500, topSpeed: 531, accel: "2.5s", priceCr: 24.50, extraFeatures: ["Top-Speed Focused Bodywork"] }
        ]
    },
    {
        id: "bugatti-chiron",
        brand: "Bugatti",
        name: "Bugatti Chiron",
        images: { front: "../Images/bugatti-chiron-front.png", side: null, interior: "../Images/generic-cream-interior.png", back: "../Images/dodge-back.jpg" },
        description: "An engineering marvel powered by a quad-turbo W16, built for effortless triple-digit cruising.",
        specs: { engine: "8.0L Quad-Turbo W16", transmission: "7-Speed DCT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Quad-Turbo W16 Engine", "Active Aerodynamics", "Carbon Ceramic Brakes", "Bespoke Leather Cabin", "Adaptive Chassis", "Top Speed Key Mode"],
        colors: CAR_COLORS,
        variants: [
            { id: "standard", label: "Chiron", fuelType: "Petrol", power: 1500, torque: 1600, topSpeed: 420, accel: "2.4s", priceCr: 26.50, extraFeatures: [] },
            { id: "super-sport", label: "Chiron Super Sport", fuelType: "Petrol", power: 1600, torque: 1600, topSpeed: 440, accel: "2.4s", priceCr: 32.00, extraFeatures: ["Elongated Tail for Stability"] }
        ]
    },
    {
        id: "pagani-huayra",
        brand: "Pagani",
        name: "Pagani Huayra",
        images: { front: "../Images/pagani-huayra-front.png", side: null, interior: "../Images/futuristic-concept-interior.png", back: "../Images/mclaren-720s-back.jpg" },
        description: "A hand-built Italian hypercar where art and engineering meet, with active aero flaps at every corner.",
        specs: { engine: "6.0L Twin-Turbo V12", transmission: "7-Speed AMT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Active Aero Flaps", "Carbon-Titanium Monocoque", "Gearbox by Xtrac", "Exposed Titanium Exhaust", "Bespoke Instrumentation", "Hand-Stitched Leather Cabin"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "Huayra Coupe", fuelType: "Petrol", power: 730, torque: 1000, topSpeed: 383, accel: "3.2s", priceCr: 19.50, extraFeatures: [] },
            { id: "roadster", label: "Huayra Roadster", fuelType: "Petrol", power: 764, torque: 1000, topSpeed: 383, accel: "3.2s", priceCr: 22.00, extraFeatures: ["Removable Carbon Roof Panels"] }
        ]
    },
    {
        id: "nissan-gt-r",
        brand: "Nissan",
        name: "Nissan GT-R",
        images: { front: "../Images/nissan-gt-r-front.png", side: null, interior: "../Images/bentley-interior3-dup.png", back: "../Images/lamborghini-aventador-svj-back.png" },
        description: "Nicknamed Godzilla, a twin-turbo all-wheel-drive icon that punches far above its price bracket.",
        specs: { engine: "3.8L Twin-Turbo V6", transmission: "6-Speed DCT", seating: "4 Seats", fuelType: "Petrol" },
        features: ["ATTESA E-TS All-Wheel Drive", "Launch Control", "Bilstein DampTronic Suspension", "Titanium Exhaust", "Driver-Focused Cockpit", "Track Data Logger"],
        colors: CAR_COLORS,
        variants: [
            { id: "premium", label: "GT-R Premium", fuelType: "Petrol", power: 565, torque: 633, topSpeed: 315, accel: "2.9s", priceCr: 1.90, extraFeatures: [] },
            { id: "nismo", label: "GT-R NISMO", fuelType: "Petrol", power: 600, torque: 652, topSpeed: 320, accel: "2.7s", priceCr: 2.60, extraFeatures: ["Motorsport Aero Kit", "Carbon Fibre Bonnet"] }
        ]
    },
    {
        id: "chevrolet-corvette-z06",
        brand: "Chevrolet",
        name: "Chevrolet Corvette Z06",
        images: { front: "../Images/chevrolet-corvette-z06-front.png", side: null, interior: "../Images/bentley-interior2.png", back: "../Images/ferrari-sf90-back.jpg" },
        description: "A mid-engine American supercar with a screaming naturally aspirated flat-plane-crank V8.",
        specs: { engine: "5.5L Naturally Aspirated V8", transmission: "8-Speed DCT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Flat-Plane-Crank V8", "Magnetic Ride Control 4.0", "Launch Control", "Carbon Fibre Aero Package", "Performance Data Recorder", "Z-Mode Drive Selector"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "Z06 Coupe", fuelType: "Petrol", power: 670, torque: 623, topSpeed: 306, accel: "2.6s", priceCr: 1.15, extraFeatures: [] },
            { id: "convertible", label: "Z06 Convertible", fuelType: "Petrol", power: 670, torque: 623, topSpeed: 306, accel: "2.7s", priceCr: 1.30, extraFeatures: ["Power Retractable Hardtop"] }
        ]
    },
    {
        id: "ford-mustang-shelby-gt500",
        brand: "Ford",
        name: "Ford Mustang Shelby GT500",
        images: { front: "../Images/ford-mustang-shelby-front.png", side: null, interior: "../Images/buick-interior.png", back: "../Images/ford-mustang-shelby-back.png" },
        colorImages: {
            "Iconic Silver": { front: "../Images/ford-mustang-shelby-front.png", side: null, interior: null, back: null },
            "Grabber Orange": { front: "../Images/ford-mustang-shelby-orange-front.png", side: null, interior: null, back: null },
            "Race Red": { front: null, side: null, interior: null, back: "../Images/ford-mustang-shelby-back.png" },
            "Velocity Blue": { front: null, side: "../Images/ford-mustang-shelby-blue-top.png", interior: null, back: null },
            "Grabber Lime": { front: null, side: "../Images/ford-mustang-shelby-green-side.png", interior: null, back: null }
        },
        description: "The most powerful street-legal Ford ever built, with a supercharged V8 and a wide, track-ready stance.",
        specs: { engine: "5.2L Supercharged V8", transmission: "7-Speed DCT", seating: "4 Seats", fuelType: "Petrol" },
        features: ["Electronic Line-Lock", "MagneRide Damping", "Launch Control", "Active Valve Exhaust", "Recaro Racing Seats", "Track Apps Data Display"],
        colors: [
            { name: "Iconic Silver", hex: "#c6c8ca" },
            { name: "Grabber Orange", hex: "#e8631a" },
            { name: "Race Red", hex: "#c81e2c" },
            { name: "Velocity Blue", hex: "#1c5fa8" },
            { name: "Grabber Lime", hex: "#c3d92b" }
        ],
        reviews: [
            { name: "Vikramjeet Ahluwalia", initials: "VA", rating: 5, text: "760 horsepower from a factory Mustang still feels unreal on launch control. Track Apps display is a great touch for track days." },
            { name: "Radhika Menon", initials: "RM", rating: 5, text: "Bought it in Grabber Orange and it's the loudest thing in every parking lot, in the best possible way." },
            { name: "Cyrus Batliwala", initials: "CB", rating: 4, text: "Recaro seats hold you in place through every corner. Ride is stiff for daily driving but that's the point of this car." },
            { name: "Ishika Bhargava", initials: "IB", rating: 5, text: "The active valve exhaust note alone made me sign the paperwork. Autoverse's spec sheet matched the dealership car exactly." },
            { name: "Gaurav Thakkar", initials: "GT", rating: 5, text: "MagneRide suspension makes it surprisingly composed on rough roads. Best value supercharged V8 you can buy right now." }
        ],
        variants: [
            { id: "standard", label: "Shelby GT500", fuelType: "Petrol", power: 760, torque: 847, topSpeed: 290, accel: "3.3s", priceCr: 1.05, extraFeatures: [] },
            { id: "carbon-track", label: "Shelby GT500 Carbon Track Pack", fuelType: "Petrol", power: 760, torque: 847, topSpeed: 290, accel: "3.2s", priceCr: 1.25, extraFeatures: ["Carbon Fibre Wheels", "Track Aero Kit"] }
        ]
    },
    {
        id: "toyota-gr-supra",
        brand: "Toyota",
        name: "Toyota GR Supra",
        images: { front: "../Images/toyota-gr-supra-front.png", side: null, interior: "../Images/toyota-camry-interior.png", back: "../Images/mclaren-720s-back.jpg" },
        description: "A modern reboot of a legendary nameplate, tuned for balanced, driver-focused rear-wheel-drive fun.",
        specs: { engine: "3.0L Turbo Inline-6", transmission: "8-Speed Auto", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Adaptive Variable Suspension", "Active Differential", "Launch Control", "JBL Premium Audio", "Sport Exhaust", "Driving Mode Select"],
        colors: CAR_COLORS,
        variants: [
            { id: "3.0", label: "GR Supra 3.0", fuelType: "Petrol", power: 382, torque: 500, topSpeed: 250, accel: "4.1s", priceCr: 0.68, extraFeatures: [] },
            { id: "3.0-premium", label: "GR Supra 3.0 Premium", fuelType: "Petrol", power: 382, torque: 500, topSpeed: 250, accel: "4.1s", priceCr: 0.78, extraFeatures: ["Adaptive Headlights", "Wireless Charging"] }
        ]
    },
    {
        id: "mazda-mx5-miata",
        brand: "Mazda",
        name: "Mazda MX-5 Miata",
        images: { front: "../Images/mazda-mx5-front.jpg", side: null, interior: "../Images/tata-interior.png", back: "../Images/lamborghini-aventador-svj-back.png" },
        description: "A lightweight, front-engine, rear-wheel-drive roadster built purely around driving joy.",
        specs: { engine: "2.0L Naturally Aspirated Inline-4", transmission: "6-Speed Manual", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Kinematic Posture Control", "Limited-Slip Differential", "Manual Soft Top", "Bose Sound System", "Lightweight Chassis", "Sport Suspension"],
        colors: CAR_COLORS,
        variants: [
            { id: "soft-top", label: "MX-5 Soft Top", fuelType: "Petrol", power: 181, torque: 205, topSpeed: 210, accel: "6.5s", priceCr: 0.32, extraFeatures: [] },
            { id: "rf", label: "MX-5 RF (Retractable Hardtop)", fuelType: "Petrol", power: 181, torque: 205, topSpeed: 209, accel: "6.5s", priceCr: 0.38, extraFeatures: ["Power Retractable Fastback Roof"] }
        ]
    },
    {
        id: "land-rover-defender",
        brand: "Land Rover",
        name: "Land Rover Defender",
        images: { front: "../Images/land-rover-defender-front.png", side: null, interior: "../Images/land-rover-defender-interior.png", back: "../Images/land-rover-defender-back.png" },
        colorImages: {
            "Coastal Blue": { front: "../Images/defender-blue-front.png", side: "../Images/defender-blue-side.png", interior: null, back: null },
            "Pangea Green": { front: "../Images/defender-green-front.png", side: null, interior: null, back: null },
            "Santorini Black": { front: "../Images/defender-black-front.png", side: null, interior: null, back: null }
        },
        description: "A rugged, go-anywhere SUV built on a stiff monocoque with genuine off-road capability.",
        specs: { engine: "3.0L Diesel I6 / 5.0L Petrol V8", transmission: "8-Speed Auto", seating: "5 Seats", fuelType: "Diesel" },
        features: ["Terrain Response 2", "Configurable Terrain Modes", "Wade Sensing", "ClearSight Ground View", "Air Suspension", "Electronic Air Suspension"],
        colors: [
            { name: "Coastal Blue", hex: "#4a6a78" },
            { name: "Pangea Green", hex: "#8a9873" },
            { name: "Santorini Black", hex: "#2b2b2b" }
        ],
        variants: [
            { id: "d300-diesel", label: "D300 Diesel", fuelType: "Diesel", power: 300, torque: 650, topSpeed: 191, accel: "6.5s", priceCr: 1.30, extraFeatures: [] },
            { id: "v8-petrol", label: "V8 Petrol", fuelType: "Petrol", power: 525, torque: 625, topSpeed: 240, accel: "5.2s", priceCr: 1.85, extraFeatures: ["Sport Exhaust", "Adaptive Dynamics"] }
        ]
    },
    {
        id: "mercedes-g-wagon",
        brand: "Mercedes",
        name: "Mercedes-Benz G-Class",
        images: { front: "../Images/mercedes-g-wagon-front.jpg", side: null, interior: "../Images/mahindra-interior.png", back: "../Images/mercedes-g-wagon-back.png" },
        colorImages: {
            "Denim Blue": { front: "../Images/gwagon-blue-front.png", side: null, interior: null, back: "../Images/gwagon-blue-back.png" },
            "Alpine White": { front: "../Images/gwagon-white-front.png", side: null, interior: null, back: null },
            "Jet Black": { front: "../Images/gwagon-black-front.png", side: null, interior: null, back: null },
            "Olive Green": { front: "../Images/gwagon-olive-front.png", side: null, interior: null, back: null },
            "Sunset Orange": { front: "../Images/gwagon-orange-front.png", side: null, interior: null, back: "../Images/gwagon-orange-back.png" },
            "Maroon": { front: "../Images/gwagon-maroon-front.png", side: null, interior: null, back: null }
        },
        description: "The unmistakable boxy off-roader turned status symbol, blending body-on-frame toughness with genuine luxury.",
        specs: { engine: "4.0L Biturbo V8", transmission: "9-Speed Auto", seating: "5 Seats", fuelType: "Petrol" },
        features: ["Three Locking Differentials", "Low-Range Transfer Case", "AMG Ride Control Suspension", "Burmester Surround Sound", "MBUX Dual-Screen Cockpit", "Off-Road Engineering Package"],
        colors: [
            { name: "Denim Blue", hex: "#3a5f7d" },
            { name: "Alpine White", hex: "#f2f2f2" },
            { name: "Jet Black", hex: "#0a0a0a" },
            { name: "Olive Green", hex: "#6b6f47" },
            { name: "Sunset Orange", hex: "#c1541f" },
            { name: "Maroon", hex: "#5e1f2b" }
        ],
        variants: [
            { id: "g550", label: "G550", fuelType: "Petrol", power: 416, torque: 610, topSpeed: 210, accel: "5.9s", priceCr: 1.95, extraFeatures: [] },
            { id: "g63-amg", label: "AMG G63", fuelType: "Petrol", power: 585, torque: 850, topSpeed: 220, accel: "4.5s", priceCr: 2.85, extraFeatures: ["AMG Performance Exhaust", "AMG Widebody Styling"] }
        ]
    },
    {
        id: "hyundai-ioniq-5",
        brand: "Hyundai",
        name: "Hyundai Ioniq 5",
        images: { front: null, side: "../Images/hyundai-ioniq5-side.jpg", interior: "../Images/ioniq-style-interior.png", back: "../Images/ferrari-sf90-back.jpg" },
        description: "A retro-futuristic electric crossover with an ultra-fast 800V charging platform.",
        specs: { engine: "Dual-Motor Electric Powertrain", transmission: "Single-Speed Direct Drive", seating: "5 Seats", fuelType: "Electric" },
        features: ["800V Ultra-Fast Charging", "Vehicle-to-Load Power Outlet", "Flat Floor Cabin", "Highway Driving Assist 2", "Sliding Centre Console", "Solar Roof Option"],
        colors: CAR_COLORS,
        variants: [
            { id: "rwd", label: "Ioniq 5 RWD", fuelType: "Electric", power: 225, torque: 350, topSpeed: 185, accel: "7.4s", priceCr: 0.45, extraFeatures: ["354km Range"] },
            { id: "awd", label: "Ioniq 5 AWD", fuelType: "Electric", power: 320, torque: 605, topSpeed: 185, accel: "5.1s", priceCr: 0.55, extraFeatures: ["414km Range", "Dual Motor Traction"] }
        ]
    },
    {
        id: "kia-ev6-gt",
        brand: "Kia",
        name: "Kia EV6 GT",
        images: { front: "../Images/kia-ev6-front.jpg", side: null, interior: "../Images/generic-cream-interior.png", back: "../Images/dodge-back.jpg" },
        description: "Kia's performance-flagship electric crossover, sharing its 800V platform with the Ioniq 5 but tuned for speed.",
        specs: { engine: "Dual-Motor Electric Powertrain", transmission: "Single-Speed Direct Drive", seating: "5 Seats", fuelType: "Electric" },
        features: ["800V Ultra-Fast Charging", "Launch Control", "Drift Mode", "GT Sport Seats", "Electronic Limited-Slip Differential", "Meridian Premium Audio"],
        colors: CAR_COLORS,
        variants: [
            { id: "gt", label: "EV6 GT", fuelType: "Electric", power: 585, torque: 740, topSpeed: 260, accel: "3.5s", priceCr: 0.72, extraFeatures: ["424km Range"] },
            { id: "gt-line", label: "EV6 GT-Line AWD", fuelType: "Electric", power: 320, torque: 605, topSpeed: 185, accel: "5.2s", priceCr: 0.62, extraFeatures: ["441km Range"] }
        ]
    },
    {
        id: "lucid-air",
        brand: "Lucid",
        name: "Lucid Air",
        images: { front: "../Images/lucid-air-front.png", side: "../Images/lucid-air-side.png", interior: null, back: "../Images/lucid-air-back.png" },
        colorImages: {
            "Eureka Gold": { front: "../Images/lucid-air-front.png", side: null, interior: null, back: null },
            "Storm Grey": { front: "../Images/lucid-air-front-grey.png", side: null, interior: null, back: null },
            "Sable Copper": { front: "../Images/lucid-air-copper-front.png", side: null, interior: null, back: null },
            "Garnet Red": { front: null, side: "../Images/lucid-air-side.png", interior: null, back: "../Images/lucid-air-back.png" },
            "Coastal Teal": { front: "../Images/lucid-air-teal-front.png", side: null, interior: null, back: null },
            "Zenith Red": { front: "../Images/lucid-air-green-collage.png", side: null, interior: null, back: null }
        },
        description: "A hyper-efficient electric luxury sedan with segment-leading range and a minimalist, tech-forward cabin.",
        specs: { engine: "Dual-Motor Electric Powertrain", transmission: "Single-Speed Direct Drive", seating: "5 Seats", fuelType: "Electric" },
        features: ["DreamDrive Pro Assist", "Glass Canopy Roof", "19-Speaker Surreal Sound", "Wireless Device Charging", "Over-the-Air Updates", "Executive Rear Seating Package"],
        colors: [
            { name: "Eureka Gold", hex: "#8a7250" },
            { name: "Storm Grey", hex: "#6d7278" },
            { name: "Sable Copper", hex: "#7a5a4c" },
            { name: "Garnet Red", hex: "#5e1f2b" },
            { name: "Coastal Teal", hex: "#2f8f9c" },
            { name: "Zenith Red", hex: "#7c9473" }
        ],
        reviews: [
            { name: "Advait Kulkarni", initials: "AK", rating: 5, text: "684km real-world range on the Touring trim blew my expectations out of the water. Glass canopy roof makes the cabin feel massive." },
            { name: "Pallavi Iyer", initials: "PI", rating: 5, text: "Booked a test drive after browsing Autoverse for a week. The Sapphire variant's acceleration genuinely scared me a little." },
            { name: "Zubin Wadia", initials: "ZW", rating: 4, text: "Minimalist interior is gorgeous but takes some relearning if you're coming from a traditional dashboard layout." },
            { name: "Naina Chopra", initials: "NC", rating: 5, text: "Quietest cabin I've ever sat in. Over-the-air updates keep adding new features months after delivery." },
            { name: "Kunal Firodia", initials: "KF", rating: 5, text: "Went in for the Coastal Teal colour and ended up loving the whole ownership experience Autoverse arranged end to end." }
        ],
        variants: [
            { id: "touring", label: "Air Touring", fuelType: "Electric", power: 620, torque: 830, topSpeed: 210, accel: "3.4s", priceCr: 1.15, extraFeatures: ["684km Range"] },
            { id: "sapphire", label: "Air Sapphire", fuelType: "Electric", power: 1234, torque: 1430, topSpeed: 270, accel: "1.89s", priceCr: 2.10, extraFeatures: ["Tri-Motor All-Wheel Drive", "Track Mode"] }
        ]
    },
    {
        id: "cadillac-escalade-v",
        brand: "Cadillac",
        name: "Cadillac Escalade V-Series",
        images: { front: "../Images/cadillac-escalade-front.png", side: "../Images/cadillac-escalade-side.png", interior: "../Images/cadillac-escalade-interior.png", back: "../Images/cadillac-escalade-back.png" },
        colorImages: {
            "Infrared Red": { front: "../Images/cadillac-escalade-front.png", side: null, interior: null, back: null },
            "Stellar Black": { front: null, side: "../Images/cadillac-escalade-black-side.png", interior: null, back: null },
            "Summit White": { front: "../Images/cadillac-escalade-white-front.png", side: null, interior: null, back: null },
            "Skyline Blue": { front: null, side: "../Images/cadillac-escalade-side.png", interior: null, back: "../Images/cadillac-escalade-back.png" }
        },
        description: "A supercharged, full-size luxury SUV that pairs American V8 muscle with three rows of tech-laden comfort.",
        specs: { engine: "6.2L Supercharged V8", transmission: "10-Speed Auto", seating: "7 Seats", fuelType: "Petrol" },
        features: ["Super Cruise Hands-Free Driving", "AKG Studio Reference Audio", "38-inch Curved OLED Display", "Magnetic Ride Control 4.0", "Adaptive Air Suspension", "Night Vision Camera"],
        colors: [
            { name: "Infrared Red", hex: "#8f1f1f" },
            { name: "Stellar Black", hex: "#0a0a0a" },
            { name: "Summit White", hex: "#f2f2f2" },
            { name: "Skyline Blue", hex: "#2b5f7a" }
        ],
        reviews: [
            { name: "Manav Grewal", initials: "MG", rating: 5, text: "Third-row space is genuinely usable for adults, and Super Cruise makes highway drives to the farmhouse effortless." },
            { name: "Divya Ramesh", initials: "DR", rating: 5, text: "The 38-inch OLED display is ridiculous in the best way. Booked mine in Summit White after a showroom visit arranged via Autoverse." },
            { name: "Harman Preet Singh", initials: "HS", rating: 4, text: "Supercharged V8 has serious muscle for something this size. Fuel economy is what you'd expect, but I knew that going in." },
            { name: "Aaliya Fernandes", initials: "AF", rating: 5, text: "AKG audio system alone justifies the V-Series upgrade. Feels like a private jet cabin on wheels." },
            { name: "Suryansh Bhatia", initials: "SB", rating: 5, text: "Autoverse's enquiry form let me pick the exact trim before visiting, saved so much back and forth with the dealership." }
        ],
        variants: [
            { id: "v", label: "Escalade V", fuelType: "Petrol", power: 682, torque: 653, topSpeed: 220, accel: "4.4s", priceCr: 1.75, extraFeatures: [] },
            { id: "v-black", label: "Escalade V Black Edition", fuelType: "Petrol", power: 682, torque: 653, topSpeed: 220, accel: "4.4s", priceCr: 1.95, extraFeatures: ["Black Accent Package", "22-inch Gloss Black Wheels"] }
        ]
    }
];

/* Helper: format a crore price for display, Indian style */
function formatCrorePrice(priceCr) {
    return "\u20B9" + priceCr.toFixed(2) + " Crore";
}

/* Helper: get a car by its id */
function getCarById(id) {
    for (var i = 0; i < CARS.length; i++) {
        if (CARS[i].id === id) {
            return CARS[i];
        }
    }
    return null;
}

/* Helper: distinct, sorted list of every brand in CARS */
function getAllBrands() {
    var brands = [];

    CARS.forEach(function (car) {
        if (brands.indexOf(car.brand) === -1) {
            brands.push(car.brand);
        }
    });

    return brands.sort();
}

/* Helper: reviews for a car's details page. Cars with a hand-written
   `reviews` array (the ones we have real customer-style feedback for)
   use that directly. Every other car still needs 4-5 reviews on its
   details page, so we generate believable ones from a shared name
   pool + car-aware sentence templates instead of leaving the section
   empty. */
var AUTOVERSE_REVIEW_NAMES = [
    { name: "Aman Sethi", initials: "AS" }, { name: "Kritika Bose", initials: "KB" },
    { name: "Yuvraj Chauhan", initials: "YC" }, { name: "Sneha Pillai", initials: "SP" },
    { name: "Rajat Kumar", initials: "RK" }, { name: "Anushka Rane", initials: "AR" },
    { name: "Mihir Shah", initials: "MS" }, { name: "Diya Krishnan", initials: "DK" },
    { name: "Vivaan Sinha", initials: "VS" }, { name: "Tara Bhatt", initials: "TB" },
    { name: "Aditi Chandra", initials: "AC" }, { name: "Rishabh Dua", initials: "RD" }
];

var AUTOVERSE_REVIEW_TEMPLATES = [
    "The {shortName} exceeded what the listing on Autoverse promised - test drove it and booked the same day.",
    "Genuinely impressed by the {engine} in the {shortName}. Feels every bit as premium as the price suggests.",
    "Autoverse's enquiry team made choosing between variants of the {shortName} so much easier than visiting three dealerships.",
    "Been driving my {shortName} for a few months now and the {feature} has been a standout feature every day.",
    "Comparing specs on the details page before visiting the showroom saved me hours. The {shortName} matched the listing exactly.",
    "The {fuelType} setup in the {shortName} is impressively refined. Would recommend to anyone shopping in this segment."
];

function generateGenericReviews(car) {
    var shortName = car.name.replace(car.brand, "").trim() || car.name;
    var feature = (car.features && car.features[0]) || "build quality";
    var engine = (car.specs && car.specs.engine) || "engine";
    var fuelType = (car.specs && car.specs.fuelType) || "powertrain";
    var reviews = [];

    for (var i = 0; i < 5; i++) {
        var person = AUTOVERSE_REVIEW_NAMES[(i * 3 + car.id.length) % AUTOVERSE_REVIEW_NAMES.length];
        var template = AUTOVERSE_REVIEW_TEMPLATES[(i + car.id.length) % AUTOVERSE_REVIEW_TEMPLATES.length];
        var text = template
            .replace("{shortName}", shortName)
            .replace("{feature}", feature)
            .replace("{engine}", engine)
            .replace("{fuelType}", fuelType);

        reviews.push({
            name: person.name,
            initials: person.initials,
            rating: i % 5 === 0 ? 4 : 5,
            text: text
        });
    }

    return reviews;
}

function getCarReviews(car) {
    if (car.reviews && car.reviews.length) {
        return car.reviews;
    }

    return generateGenericReviews(car);
}

/* Helper: best available thumbnail for listing cards / similar cars.
   Cars with per-colour photos (colorImages) use the first colour that
   actually has a photo; everything else falls back to the flat
   `images` object. */
function getDefaultThumbnail(car) {
    if (car.colorImages) {
        for (var i = 0; i < car.colors.length; i++) {
            var set = car.colorImages[car.colors[i].name];

            if (set) {
                if (set.front) return set.front;
                if (set.side) return set.side;
                if (set.back) return set.back;
            }
        }

        return null;
    }

    return car.images.front || car.images.side || car.images.back || null;
}
