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
   variants[0] is always the cheapest variant: the
   whole site uses it as the starting price.
   Power is in hp, torque in Nm, top speed in km/h.

   Shared globals are declared with `var` on purpose:
   every page loads several classic <script> files that
   share one global scope, and `var` keeps those names
   from clashing. Inside functions we use let / const.
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

/* Builds a labelled placeholder frame for a car photo angle we don't
   have a correct photo of. */
function placeholderFrameHTML(car, label, tintHex) {
    const icon = label === 'Interior' ? INTERIOR_ICON_SVG : CAR_SILHOUETTE_SVG;
    const shortName = car.name.replace(car.brand, '').trim().toUpperCase();

    return (
        `<div class="placeholder-car" style="border-color:${tintHex}66; color:${tintHex};">` +
            `<div class="placeholder-icon">${icon}</div>` +
            `${car.brand.toUpperCase()}<br><strong>${shortName}</strong>` +
            `<em>${label} photo not available</em>` +
        '</div>'
    );
}

var CARS = [
    {
        id: "bmw-m4",
        brand: "BMW",
        name: "BMW M4",
        images: { front: "../Images/bmw-m4.png", side: null, interior: null, back: null },
        colorImages: {
            "Racing Red": { front: null, side: null, interior: null, back: null },
            "Jet Black": { front: "../Images/bmw-m4-black-front.png", side: null, interior: null, back: null },
            "Alpine White": { front: "../Images/bmw-m4-white-front.png", side: null, interior: null, back: null },
            "Sun Yellow": { front: "../Images/bmw-m4-yellow-front.png", side: null, interior: null, back: null },
            "Lime Green": { front: null, side: "../Images/bmw-m4-limegreen-side.png", interior: null, back: "../Images/bmw-m4-limegreen-back.png" },
            "Isle of Man Green": { front: "../Images/bmw-m4-racinggreen-front.png", side: null, interior: null, back: "../Images/bmw-m4-racinggreen-back.png" },
            "Laguna Seca Blue": { front: "../Images/bmw-m4-blue-front.png", side: "../Images/bmw-m4-blue-side.png", interior: null, back: null },
            "Frozen Blue": { front: "../Images/bmw-m4-frozenblue-front.png", side: null, interior: null, back: null }
        },
        description: "BMW M's two-door coupe with a 3.0-litre twin-turbo inline-six, sold in India as the all-wheel-drive M4 Competition M xDrive.",
        specs: { engine: "3.0L Twin-Turbo Inline-6", transmission: "8-Speed M Steptronic Auto", seating: "4 Seats", fuelType: "Petrol" },
        features: ["M xDrive All-Wheel Drive", "Adaptive M Suspension", "Active M Differential", "Carbon Fibre Roof", "Head-Up Display", "Harman Kardon Audio"],
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
            { id: "competition", label: "M4 Competition M xDrive", fuelType: "Petrol", power: 523, torque: 650, topSpeed: 250, accel: "3.5s", priceCr: 1.53, extraFeatures: [] },
            { id: "cs", label: "M4 CS", fuelType: "Petrol", power: 543, torque: 650, topSpeed: 302, accel: "3.4s", priceCr: 1.89, extraFeatures: ["M Carbon Bucket Seats", "Carbon Fibre Bonnet"] }
        ]
    },
    {
        id: "audi-r8",
        brand: "Audi",
        name: "Audi R8",
        images: { front: "../Images/audi-r8.png", side: null, interior: null, back: null },
        colorImages: {
            "Ibis White": { front: "../Images/audi-r8-white-front.png", side: null, interior: null, back: "../Images/audi-r8-white-back.png" },
            "Florett Silver": { front: "../Images/audi-r8-silver-front.png", side: null, interior: null, back: null },
            "Tango Red": { front: "../Images/audi-r8-red-front.png", side: null, interior: null, back: "../Images/audi-r8-red-back.png" },
            "Daytona Grey": { front: "../Images/audi-r8-grey-front.png", side: null, interior: null, back: null }
        },
        description: "Audi's mid-engine two-seater with a naturally aspirated 5.2-litre V10 and quattro all-wheel drive; production ended in 2024.",
        specs: { engine: "5.2L V10", transmission: "7-Speed S tronic DCT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Quattro All-Wheel Drive", "Audi Virtual Cockpit", "Magnetic Ride Dampers", "Aluminium & Carbon Audi Space Frame", "Bang & Olufsen Audio", "Laser Light Headlights (optional)"],
        colors: [
            { name: "Ibis White", hex: "#f5f5f5" },
            { name: "Florett Silver", hex: "#c8c8c8" },
            { name: "Tango Red", hex: "#c81e2c" },
            { name: "Daytona Grey", hex: "#4a4a4a" }
        ],
        variants: [
            { id: "v10", label: "R8 V10", fuelType: "Petrol", power: 562, torque: 550, topSpeed: 324, accel: "3.4s", priceCr: 2.30, extraFeatures: [] },
            { id: "v10-performance", label: "R8 V10 Performance", fuelType: "Petrol", power: 611, torque: 580, topSpeed: 331, accel: "3.1s", priceCr: 2.72, extraFeatures: ["Carbon Ceramic Brakes", "Carbon Fibre Exterior Trim"] }
        ]
    },
    {
        id: "mercedes-amg-gt",
        brand: "Mercedes",
        name: "Mercedes AMG GT",
        images: { front: "../Images/mercedes-amg-gt.png", side: null, interior: null, back: null },
        description: "A front-mid-engine two-seat coupe whose 4.0-litre twin-turbo V8 is hand-built under AMG's 'one man, one engine' process.",
        specs: { engine: "4.0L Twin-Turbo V8", transmission: "7-Speed AMG Speedshift DCT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["AMG Ride Control", "AMG Dynamic Select", "Race Start Launch Control", "Rear-Mounted Transaxle Gearbox", "Burmester Surround Sound", "Nappa Leather Upholstery"],
        colors: CAR_COLORS,
        variants: [
            { id: "gt", label: "AMG GT S", fuelType: "Petrol", power: 515, torque: 670, topSpeed: 310, accel: "3.8s", priceCr: 2.09, extraFeatures: [] },
            { id: "gt-r", label: "AMG GT R", fuelType: "Petrol", power: 577, torque: 700, topSpeed: 318, accel: "3.6s", priceCr: 2.23, extraFeatures: ["Active Rear-Wheel Steering", "AMG Track Pace", "Manually Adjustable Rear Wing"] }
        ]
    },
    {
        id: "ferrari-sf90",
        brand: "Ferrari",
        name: "Ferrari SF90",
        images: { front: "../Images/ferrari-sf90.png", side: null, interior: null, back: null },
        description: "Ferrari's first series-production plug-in hybrid, pairing a 4.0-litre twin-turbo V8 with three electric motors for 1,000 CV combined.",
        specs: { engine: "4.0L Twin-Turbo V8 + 3 Electric Motors", transmission: "8-Speed DCT", seating: "2 Seats", fuelType: "Hybrid" },
        features: ["Electric Front-Axle All-Wheel Drive", "Up to 25 km Electric-Only Range", "eManettino Drive Modes", "Active Shut-Off Gurney Aero", "Brake-by-Wire System", "Aluminium & Carbon Fibre Chassis"],
        colors: CAR_COLORS,
        variants: [
            { id: "stradale", label: "SF90 Stradale", fuelType: "Hybrid", power: 986, torque: 800, topSpeed: 340, accel: "2.5s", priceCr: 7.50, extraFeatures: [] },
            { id: "spider", label: "SF90 Spider", fuelType: "Hybrid", power: 986, torque: 800, topSpeed: 340, accel: "2.5s", priceCr: 8.55, extraFeatures: ["Retractable Hard Top"] }
        ]
    },
    {
        id: "lamborghini-huracan",
        brand: "Lamborghini",
        name: "Lamborghini Huracan",
        images: { front: "../Images/lamborghini-huracan.png", side: null, interior: "../Images/lamborghini-interior.png", back: null },
        description: "Lamborghini's naturally aspirated V10 supercar, sold in India as the all-wheel-drive EVO and the rear-drive, track-focused STO; production ended in 2024.",
        specs: { engine: "5.2L V10", transmission: "7-Speed DCT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["LDVI Integrated Vehicle Dynamics", "Rear-Wheel Steering", "Carbon Ceramic Brakes", "Magnetorheological Dampers", "8.4-inch Touchscreen", "Alcantara Interior"],
        colors: CAR_COLORS,
        variants: [
            { id: "evo", label: "Huracan EVO", fuelType: "Petrol", power: 631, torque: 600, topSpeed: 325, accel: "2.9s", priceCr: 3.73, extraFeatures: ["All-Wheel Drive"] },
            { id: "sto", label: "Huracan STO", fuelType: "Petrol", power: 631, torque: 565, topSpeed: 310, accel: "3.0s", priceCr: 4.99, extraFeatures: ["Rear-Wheel Drive", "Carbon Fibre Body Panels", "Lamborghini Telemetry"] }
        ]
    },
    {
        id: "porsche-911-turbo-s",
        brand: "Porsche",
        name: "Porsche 911 Turbo S",
        images: { front: "../Images/porsche-911.png", side: null, interior: "../Images/porsche-interior.png", back: null },
        description: "The 992-generation 911 Turbo S, a 2+2 with a rear-mounted 3.7-litre twin-turbo flat-six and all-wheel drive.",
        specs: { engine: "3.7L Twin-Turbo Flat-6", transmission: "8-Speed PDK", seating: "4 Seats", fuelType: "Petrol" },
        features: ["PASM Adaptive Suspension", "Porsche Ceramic Composite Brakes", "Rear-Axle Steering", "Porsche Active Aerodynamics", "Sport Chrono Package", "Bose Surround Sound"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "Turbo S Coupe", fuelType: "Petrol", power: 641, torque: 800, topSpeed: 330, accel: "2.7s", priceCr: 3.08, extraFeatures: [] },
            { id: "cabriolet", label: "Turbo S Cabriolet", fuelType: "Petrol", power: 641, torque: 800, topSpeed: 330, accel: "2.8s", priceCr: 3.37, extraFeatures: ["Power Soft Top", "Electric Wind Deflector"] }
        ]
    },
    {
        id: "lamborghini-aventador-svj",
        brand: "Lamborghini",
        name: "Lamborghini Aventador SVJ",
        images: { front: "../Images/lamborghini-aventador-svj-front.png", side: null, interior: null, back: "../Images/lamborghini-aventador-svj-back.png" },
        description: "The limited-production Aventador SVJ, with a 6.5-litre naturally aspirated V12 and ALA active aerodynamics.",
        specs: { engine: "6.5L V12", transmission: "7-Speed ISR", seating: "2 Seats", fuelType: "Petrol" },
        features: ["ALA Active Aerodynamics", "Rear-Wheel Steering", "Carbon Fibre Monocoque", "Pushrod Magnetorheological Suspension", "Carbon Ceramic Brakes", "All-Wheel Drive"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "SVJ Coupe", fuelType: "Petrol", power: 759, torque: 720, topSpeed: 350, accel: "2.8s", priceCr: 6.00, extraFeatures: [] },
            { id: "roadster", label: "SVJ Roadster", fuelType: "Petrol", power: 759, torque: 720, topSpeed: 350, accel: "2.9s", priceCr: 6.10, extraFeatures: ["Removable Carbon Roof Panels"] }
        ]
    },
    {
        id: "ferrari-roma",
        brand: "Ferrari",
        name: "Ferrari Roma",
        images: { front: "../Images/ferrari-roma-front.png", side: null, interior: null, back: null },
        description: "A front-engine 2+2 grand tourer styled after 1950s and '60s Italian GTs, with a 3.9-litre twin-turbo V8.",
        specs: { engine: "3.9L Twin-Turbo V8", transmission: "8-Speed DCT", seating: "4 Seats", fuelType: "Petrol" },
        features: ["Manettino Dial", "Side Slip Control", "16-inch Digital Instrument Cluster", "Passenger Touch Display", "Magnetorheological Dampers", "JBL Professional Audio (optional)"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "Roma Coupe", fuelType: "Petrol", power: 612, torque: 760, topSpeed: 320, accel: "3.4s", priceCr: 3.76, extraFeatures: [] },
            { id: "spider", label: "Roma Spider", fuelType: "Petrol", power: 612, torque: 760, topSpeed: 320, accel: "3.4s", priceCr: 4.76, extraFeatures: ["Five-Layer Fabric Soft Top"] }
        ]
    },
    {
        id: "porsche-panamera-e-hybrid",
        brand: "Porsche",
        name: "Porsche Panamera Turbo S E-Hybrid",
        images: { front: "../Images/porsche-panamera-front.png", side: null, interior: null, back: null },
        description: "The second-generation Panamera four-door in 2021 Turbo S form, offered with a 4.0-litre twin-turbo V8 alone or as a plug-in hybrid.",
        specs: { engine: "4.0L Twin-Turbo V8 + Electric Motor", transmission: "8-Speed PDK", seating: "4 Seats", fuelType: "Hybrid" },
        features: ["Adaptive Air Suspension", "Porsche Dynamic Chassis Control", "Rear-Axle Steering", "Sport Chrono Package", "Panoramic Roof (optional)", "Burmester 3D Audio (optional)"],
        colors: CAR_COLORS,
        variants: [
            { id: "turbo-petrol", label: "Turbo S", fuelType: "Petrol", power: 621, torque: 820, topSpeed: 315, accel: "3.1s", priceCr: 2.12, extraFeatures: [] },
            { id: "e-hybrid", label: "Turbo S E-Hybrid", fuelType: "Hybrid", power: 690, torque: 870, topSpeed: 315, accel: "3.2s", priceCr: 2.43, extraFeatures: ["About 50 km electric range (WLTP)", "E-Power Electric Driving Mode"] }
        ]
    },
    {
        id: "audi-rs7-sportback",
        brand: "Audi",
        name: "Audi RS7 Sportback",
        images: { front: null, side: null, interior: null, back: null },
        description: "Audi Sport's five-door Sportback with a 4.0-litre twin-turbo V8, a 48-volt mild-hybrid system and quattro all-wheel drive.",
        specs: { engine: "4.0L Twin-Turbo V8", transmission: "8-Speed Tiptronic", seating: "5 Seats", fuelType: "Petrol" },
        features: ["Quattro All-Wheel Drive", "48V Mild-Hybrid System", "Matrix LED Headlights", "Quattro Sport Differential", "Adaptive Air Suspension", "Bang & Olufsen 3D Audio"],
        colors: CAR_COLORS,
        variants: [
            { id: "rs7", label: "RS7 Sportback", fuelType: "Petrol", power: 591, torque: 800, topSpeed: 250, accel: "3.6s", priceCr: 1.94, extraFeatures: [] },
            { id: "rs7-performance", label: "RS7 Performance", fuelType: "Petrol", power: 621, torque: 850, topSpeed: 280, accel: "3.4s", priceCr: 2.15, extraFeatures: ["Dynamic Package Plus (305 km/h limit)"] }
        ]
    },
    {
        id: "bmw-i8",
        brand: "BMW",
        name: "BMW i8",
        images: { front: "../Images/bmw-i8-front.png", side: null, interior: null, back: "../Images/bmw-i8-back.png" },
        description: "BMW's 2014–2020 plug-in hybrid sports car, pairing a 1.5-litre turbo three-cylinder with a front electric motor in a carbon-fibre passenger cell.",
        specs: { engine: "1.5L Turbo 3-Cyl + Electric Motor", transmission: "6-Speed Auto + 2-Speed Electric", seating: "4 Seats", fuelType: "Hybrid" },
        features: ["Carbon Fibre Life Module", "eDrive Electric-Only Mode", "Butterfly Doors", "Head-Up Display", "Regenerative Braking", "BMW Laserlight (optional)"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "i8 Coupe", fuelType: "Hybrid", power: 369, torque: 570, topSpeed: 250, accel: "4.4s", priceCr: 2.62, extraFeatures: ["Up to 55 km electric range (NEDC)"] },
            { id: "roadster", label: "i8 Roadster", fuelType: "Hybrid", power: 369, torque: 570, topSpeed: 250, accel: "4.6s", priceCr: 2.90, extraFeatures: ["Electric Soft Top", "Up to 53 km electric range (NEDC)"] }
        ]
    },
    {
        id: "range-rover-autobiography",
        brand: "Land Rover",
        name: "Range Rover Autobiography",
        images: { front: "../Images/range-rover-front.png", side: null, interior: "../Images/range-rover-interior.png", back: "../Images/range-rover-back.png" },
        colorImages: {
            "Champagne Gold": { front: "../Images/rangerover-gold-front.png", side: null, interior: null, back: null },
            "Garnet Red": { front: null, side: null, interior: null, back: null },
            "Santorini Black": { front: "../Images/range-rover-front.png", side: null, interior: null, back: null }
        },
        description: "The fifth-generation (L460) full-size Range Rover in Autobiography trim, sold in India with a 3.0-litre mild-hybrid petrol inline-six.",
        specs: { engine: "3.0L Twin-Turbo Inline-6 Mild-Hybrid", transmission: "8-Speed Auto", seating: "5 Seats", fuelType: "Petrol" },
        features: ["Terrain Response 2", "Electronic Air Suspension", "All-Wheel Steering", "Meridian Signature Sound System", "Pivi Pro 13.1-inch Touchscreen", "Adaptive Cruise Control"],
        colors: [
            { name: "Champagne Gold", hex: "#b89a6e" },
            { name: "Garnet Red", hex: "#7a2e2b" },
            { name: "Santorini Black", hex: "#2b2b2b" }
        ],
        variants: [
            { id: "petrol", label: "Autobiography P400 Petrol", fuelType: "Petrol", power: 394, torque: 550, topSpeed: 242, accel: "5.8s", priceCr: 2.57, extraFeatures: [] }
        ]
    },
    {
        id: "bentley-continental-gt",
        brand: "Bentley",
        name: "Bentley Continental GT",
        images: { front: "../Images/bentley-continental-gt-front.png", side: null, interior: null, back: null },
        description: "The third-generation (2018–2024) Continental GT, a 2+2 grand tourer offered with a 4.0-litre twin-turbo V8 or a 6.0-litre twin-turbo W12.",
        specs: { engine: "4.0L Twin-Turbo V8 / 6.0L Twin-Turbo W12", transmission: "8-Speed DCT", seating: "4 Seats", fuelType: "Petrol" },
        features: ["Bentley Rotating Display (optional)", "Naim for Bentley Audio (optional)", "All-Wheel Drive", "Three-Chamber Air Suspension", "Diamond-Quilted Leather", "Massage Front Seats"],
        colors: CAR_COLORS,
        variants: [
            { id: "v8", label: "Continental GT V8", fuelType: "Petrol", power: 542, torque: 770, topSpeed: 318, accel: "4.0s", priceCr: 3.85, extraFeatures: [] },
            { id: "w12-speed", label: "Continental GT Speed W12", fuelType: "Petrol", power: 650, torque: 900, topSpeed: 335, accel: "3.6s", priceCr: 6.46, extraFeatures: ["Electronic Limited-Slip Differential", "All-Wheel Steering"] }
        ]
    },
    {
        id: "rolls-royce-ghost",
        brand: "Rolls-Royce",
        name: "Rolls-Royce Ghost",
        images: { front: "../Images/rolls-royce-ghost-front.png", side: null, interior: "../Images/rollsroyce-interior.png", back: null },
        description: "Rolls-Royce's second-generation Ghost saloon (Series II from 2024), with a 6.75-litre twin-turbo V12, all-wheel drive and all-wheel steering.",
        specs: { engine: "6.75L Twin-Turbo V12", transmission: "8-Speed Auto", seating: "5 Seats", fuelType: "Petrol" },
        features: ["Planar Suspension System", "Satellite-Aided Transmission", "All-Wheel Drive and Steering", "Starlight Headliner", "Illuminated Fascia", "Bespoke Audio System"],
        colors: CAR_COLORS,
        variants: [
            { id: "standard", label: "Ghost", fuelType: "Petrol", power: 563, torque: 850, topSpeed: 250, accel: "4.8s", priceCr: 8.95, extraFeatures: [] },
            { id: "extended", label: "Ghost Extended", fuelType: "Petrol", power: 563, torque: 850, topSpeed: 250, accel: "5.0s", priceCr: 10.19, extraFeatures: ["170 mm Longer Wheelbase", "Extra Rear Legroom"] }
        ]
    },
    {
        id: "aston-martin-db11",
        brand: "Aston Martin",
        name: "Aston Martin DB11",
        images: { front: "../Images/aston-martin-db11-front.png", side: null, interior: null, back: null },
        description: "Aston Martin's 2016–2023 grand tourer, offered with a Mercedes-AMG-sourced 4.0-litre twin-turbo V8 or Aston's own 5.2-litre twin-turbo V12.",
        specs: { engine: "4.0L Twin-Turbo V8 / 5.2L Twin-Turbo V12", transmission: "8-Speed Auto", seating: "4 Seats", fuelType: "Petrol" },
        features: ["Aeroblade Rear Aerodynamics", "Adaptive Damping", "Bonded Aluminium Structure", "Sports Exhaust", "Bang & Olufsen BeoSound (optional)", "Bridge of Weir Leather Interior"],
        colors: CAR_COLORS,
        variants: [
            { id: "v8", label: "DB11 V8", fuelType: "Petrol", power: 496, torque: 675, topSpeed: 301, accel: "4.0s", priceCr: 3.80, extraFeatures: [] },
            { id: "amr-v12", label: "DB11 AMR V12", fuelType: "Petrol", power: 621, torque: 700, topSpeed: 334, accel: "3.7s", priceCr: 4.20, extraFeatures: ["AMR Sport-Tuned Suspension", "AMR Exterior Detailing"] }
        ]
    },
    {
        id: "tesla-model-s-plaid",
        brand: "Tesla",
        name: "Tesla Model S Plaid",
        images: { front: "../Images/tesla-model-s-plaid-front.png", side: null, interior: null, back: null },
        description: "The tri-motor version of Tesla's five-seat electric sedan, rated by Tesla at 1,020 hp and 0-100 km/h in 2.1 seconds.",
        specs: { engine: "Tri-Motor Electric Powertrain", transmission: "Single-Speed Direct Drive", seating: "5 Seats", fuelType: "Electric" },
        features: ["Autopilot Driver Assistance", "17-inch Touchscreen", "Yoke Steering (optional)", "Over-the-Air Updates", "HEPA Filter with Bioweapon Defense Mode", "Track Mode"],
        colors: CAR_COLORS,
        variants: [
            { id: "plaid", label: "Plaid", fuelType: "Electric", power: 1020, torque: 1420, topSpeed: 322, accel: "2.1s", priceCr: 1.55, extraFeatures: ["Up to 592 km range (EPA est.)"] }
        ]
    },
    {
        id: "jaguar-f-type-r",
        brand: "Jaguar",
        name: "Jaguar F-Type R",
        images: { front: "../Images/jaguar-f-type-front.png", side: null, interior: null, back: null },
        description: "The top F-Type, a two-seat sports car with a 5.0-litre supercharged V8 and all-wheel drive; F-Type production ended in 2024.",
        specs: { engine: "5.0L Supercharged V8", transmission: "8-Speed Auto", seating: "2 Seats", fuelType: "Petrol" },
        features: ["All-Wheel Drive", "Torque Vectoring by Braking", "Adaptive Dynamics", "Switchable Active Exhaust", "Meridian Sound System", "Launch Control"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "F-Type R Coupe", fuelType: "Petrol", power: 567, torque: 700, topSpeed: 300, accel: "3.7s", priceCr: 1.75, extraFeatures: [] },
            { id: "convertible", label: "F-Type R Convertible", fuelType: "Petrol", power: 567, torque: 700, topSpeed: 300, accel: "3.7s", priceCr: 2.42, extraFeatures: ["Power-Folding Soft Top"] }
        ]
    },
    {
        id: "mclaren-720s",
        brand: "McLaren",
        name: "McLaren 720S",
        images: { front: "../Images/mclaren-720s-front.png", side: null, interior: null, back: null },
        description: "McLaren's 2017–2023 mid-engine supercar, built around a carbon-fibre Monocage II tub with dihedral doors and a 4.0-litre twin-turbo V8.",
        specs: { engine: "4.0L Twin-Turbo V8", transmission: "7-Speed DCT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Dihedral Doors", "Proactive Chassis Control II", "Variable Drift Control", "Carbon Fibre Monocage II", "Folding Driver Display", "McLaren Track Telemetry (optional)"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "720S Coupe", fuelType: "Petrol", power: 710, torque: 770, topSpeed: 341, accel: "2.9s", priceCr: 4.65, extraFeatures: [] },
            { id: "spider", label: "720S Spider", fuelType: "Petrol", power: 710, torque: 770, topSpeed: 341, accel: "2.9s", priceCr: 5.04, extraFeatures: ["Retractable Hard Top"] }
        ]
    },
    {
        id: "maserati-mc20",
        brand: "Maserati",
        name: "Maserati MC20",
        images: { front: "../Images/maserati-mc20-front.png", side: null, interior: null, back: null },
        description: "Maserati's mid-engine two-seater with butterfly doors and the in-house 3.0-litre 'Nettuno' twin-turbo V6.",
        specs: { engine: "3.0L Twin-Turbo V6", transmission: "8-Speed DCT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Butterfly Doors", "Carbon Fibre Monocoque", "Pre-Chamber Combustion Engine", "Launch Control", "Double-Wishbone Suspension", "Sonus Faber Audio (optional)"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "MC20 Coupe", fuelType: "Petrol", power: 621, torque: 730, topSpeed: 325, accel: "2.9s", priceCr: 3.69, extraFeatures: [] },
            { id: "cielo", label: "MC20 Cielo", fuelType: "Petrol", power: 621, torque: 730, topSpeed: 320, accel: "3.0s", priceCr: 5.02, extraFeatures: ["Retractable Electrochromic Glass Roof"] }
        ]
    },
    {
        id: "koenigsegg-jesko",
        brand: "Koenigsegg",
        name: "Koenigsegg Jesko",
        images: { front: "../Images/koenigsegg-jesko-side.png", side: null, interior: null, back: null },
        description: "A Swedish hypercar whose 5.0-litre twin-turbo V8 makes 1,280 hp on regular petrol (1,600 hp on E85), driving through a 9-speed multi-clutch gearbox.",
        specs: { engine: "5.0L Twin-Turbo V8", transmission: "9-Speed Light Speed Transmission", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Light Speed Transmission", "Autoskin Powered Doors", "Triplex Suspension", "Active Rear-Wheel Steering", "Carbon Fibre Chassis", "Removable Roof Panel"],
        colors: CAR_COLORS,
        variants: [
            { id: "standard", label: "Jesko Attack", fuelType: "Petrol", power: 1280, torque: 1500, topSpeed: 480, accel: "2.5s", priceCr: 22.00, extraFeatures: ["High-Downforce Rear Wing"] },
            { id: "absolut", label: "Jesko Absolut", fuelType: "Petrol", power: 1280, torque: 1500, topSpeed: 531, accel: "2.5s", priceCr: 24.50, extraFeatures: ["Low-Drag Bodywork without Rear Wing"] }
        ]
    },
    {
        id: "bugatti-chiron",
        brand: "Bugatti",
        name: "Bugatti Chiron",
        images: { front: "../Images/bugatti-chiron-front.png", side: null, interior: null, back: null },
        description: "Bugatti's 2016–2024 hypercar, powered by an 8.0-litre quad-turbo W16 and limited to 500 cars across all versions.",
        specs: { engine: "8.0L Quad-Turbo W16", transmission: "7-Speed DCT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Carbon Fibre Monocoque", "Active Aerodynamics", "Carbon Ceramic Brakes", "Adaptive Chassis", "Top Speed Key", "Bespoke Leather Cabin"],
        colors: CAR_COLORS,
        variants: [
            { id: "standard", label: "Chiron", fuelType: "Petrol", power: 1479, torque: 1600, topSpeed: 420, accel: "2.4s", priceCr: 26.50, extraFeatures: [] },
            { id: "super-sport", label: "Chiron Super Sport", fuelType: "Petrol", power: 1578, torque: 1600, topSpeed: 440, accel: "2.4s", priceCr: 32.00, extraFeatures: ["Long-Tail Bodywork"] }
        ]
    },
    {
        id: "pagani-huayra",
        brand: "Pagani",
        name: "Pagani Huayra",
        images: { front: "../Images/pagani-huayra-front.png", side: null, interior: null, back: null },
        description: "Pagani's hand-built hypercar with a Mercedes-AMG 6.0-litre twin-turbo V12 and four independently controlled active aero flaps.",
        specs: { engine: "6.0L Twin-Turbo V12", transmission: "7-Speed AMT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Active Aero Flaps", "Carbo-Titanium Monocoque", "Xtrac Single-Clutch Gearbox", "Titanium Exhaust", "Bespoke Instrumentation", "Hand-Stitched Leather Cabin"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "Huayra Coupe", fuelType: "Petrol", power: 720, torque: 1000, topSpeed: 383, accel: "3.2s", priceCr: 19.50, extraFeatures: [] },
            { id: "roadster", label: "Huayra Roadster", fuelType: "Petrol", power: 754, torque: 1000, topSpeed: 383, accel: "3.2s", priceCr: 22.00, extraFeatures: ["Removable Roof Panels"] }
        ]
    },
    {
        id: "nissan-gt-r",
        brand: "Nissan",
        name: "Nissan GT-R",
        images: { front: "../Images/nissan-gt-r-front.png", side: null, interior: null, back: null },
        description: "Nissan's R35 GT-R, a 2+2 coupe with a hand-assembled 3.8-litre twin-turbo V6 and ATTESA E-TS all-wheel drive; production ended in 2025.",
        specs: { engine: "3.8L Twin-Turbo V6", transmission: "6-Speed DCT", seating: "4 Seats", fuelType: "Petrol" },
        features: ["ATTESA E-TS All-Wheel Drive", "Rear-Mounted Transaxle", "Bilstein DampTronic Suspension", "Launch Control", "Titanium Exhaust", "Multi-Function Performance Display"],
        colors: CAR_COLORS,
        variants: [
            { id: "premium", label: "GT-R", fuelType: "Petrol", power: 562, torque: 637, topSpeed: 315, accel: "2.9s", priceCr: 2.12, extraFeatures: [] },
            { id: "nismo", label: "GT-R NISMO", fuelType: "Petrol", power: 592, torque: 652, topSpeed: 320, accel: "2.7s", priceCr: 2.60, extraFeatures: ["Carbon Fibre Bonnet and Wings", "Carbon Ceramic Brakes"] }
        ]
    },
    {
        id: "chevrolet-corvette-z06",
        brand: "Chevrolet",
        name: "Chevrolet Corvette Z06",
        images: { front: "../Images/chevrolet-corvette-z06-front.png", side: null, interior: null, back: null },
        description: "The C8 Corvette Z06, a mid-engine two-seater with a 5.5-litre naturally aspirated flat-plane-crank V8 that revs to 8,600 rpm.",
        specs: { engine: "5.5L Naturally Aspirated V8", transmission: "8-Speed DCT", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Flat-Plane-Crank V8", "Magnetic Ride Control 4.0", "Launch Control", "Performance Data Recorder", "Z-Mode Drive Selector", "Z07 Carbon Aero Package (optional)"],
        colors: CAR_COLORS,
        variants: [
            { id: "coupe", label: "Z06 Coupe", fuelType: "Petrol", power: 670, torque: 623, topSpeed: 306, accel: "2.6s", priceCr: 1.15, extraFeatures: ["Removable Roof Panel"] },
            { id: "convertible", label: "Z06 Convertible", fuelType: "Petrol", power: 670, torque: 623, topSpeed: 306, accel: "2.7s", priceCr: 1.30, extraFeatures: ["Power Retractable Hardtop"] }
        ]
    },
    {
        id: "ford-mustang-shelby-gt500",
        brand: "Ford",
        name: "Ford Mustang Shelby GT500",
        images: { front: "../Images/ford-mustang-shelby-front.png", side: null, interior: null, back: "../Images/ford-mustang-shelby-back.png" },
        colorImages: {
            "Iconic Silver": { front: "../Images/ford-mustang-shelby-front.png", side: null, interior: null, back: null },
            "Grabber Orange": { front: "../Images/ford-mustang-shelby-orange-front.png", side: null, interior: null, back: null },
            "Race Red": { front: null, side: null, interior: null, back: "../Images/ford-mustang-shelby-back.png" },
            "Velocity Blue": { front: "../Images/ford-mustang-shelby-blue-top.png", side: null, interior: null, back: null },
            "Grabber Lime": { front: "../Images/ford-mustang-shelby-green-side.png", side: null, interior: null, back: null }
        },
        description: "The 2020–2022 Shelby GT500, a Mustang with a 760 hp supercharged 5.2-litre V8 and a 7-speed dual-clutch gearbox.",
        specs: { engine: "5.2L Supercharged V8", transmission: "7-Speed DCT", seating: "4 Seats", fuelType: "Petrol" },
        features: ["Electronic Line-Lock", "MagneRide Damping", "Launch Control", "Active Valve Exhaust", "Track Apps Data Display", "Brembo Brakes"],
        colors: [
            { name: "Iconic Silver", hex: "#c6c8ca" },
            { name: "Grabber Orange", hex: "#e8631a" },
            { name: "Race Red", hex: "#c81e2c" },
            { name: "Velocity Blue", hex: "#1c5fa8" },
            { name: "Grabber Lime", hex: "#c3d92b" }
        ],
        variants: [
            { id: "standard", label: "Shelby GT500", fuelType: "Petrol", power: 760, torque: 847, topSpeed: 290, accel: "3.3s", priceCr: 1.05, extraFeatures: [] },
            { id: "carbon-track", label: "Shelby GT500 Carbon Fiber Track Package", fuelType: "Petrol", power: 760, torque: 847, topSpeed: 290, accel: "3.2s", priceCr: 1.25, extraFeatures: ["Carbon Fibre Wheels", "Adjustable Carbon Rear Wing", "Recaro Seats"] }
        ]
    },
    {
        id: "toyota-gr-supra",
        brand: "Toyota",
        name: "Toyota GR Supra",
        images: { front: null, side: null, interior: null, back: null },
        description: "The fifth-generation (A90) GR Supra, a two-seat coupe co-developed with BMW and powered by a 3.0-litre turbo inline-six.",
        specs: { engine: "3.0L Turbo Inline-6", transmission: "8-Speed Auto", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Adaptive Variable Suspension", "Active Rear Differential", "Launch Control", "Brembo Front Brakes", "8.8-inch Touchscreen", "Sport Drive Mode"],
        colors: CAR_COLORS,
        variants: [
            { id: "3.0", label: "GR Supra 3.0", fuelType: "Petrol", power: 382, torque: 500, topSpeed: 250, accel: "3.9s", priceCr: 0.68, extraFeatures: [] },
            { id: "3.0-premium", label: "GR Supra 3.0 Premium", fuelType: "Petrol", power: 382, torque: 500, topSpeed: 250, accel: "3.9s", priceCr: 0.78, extraFeatures: ["JBL Premium Audio", "Head-Up Display", "Wireless Charging"] }
        ]
    },
    {
        id: "mazda-mx5-miata",
        brand: "Mazda",
        name: "Mazda MX-5 Miata",
        images: { front: null, side: null, interior: null, back: null },
        description: "The fourth-generation (ND) MX-5, a lightweight front-engine, rear-drive two-seater offered as a soft-top or RF retractable fastback.",
        specs: { engine: "2.0L Naturally Aspirated Inline-4", transmission: "6-Speed Manual", seating: "2 Seats", fuelType: "Petrol" },
        features: ["Kinematic Posture Control", "Rear-Wheel Drive", "Limited-Slip Differential (manual models)", "Bose Sound System", "Bilstein Dampers (selected trims)", "Apple CarPlay & Android Auto"],
        colors: CAR_COLORS,
        variants: [
            { id: "soft-top", label: "MX-5 Soft Top", fuelType: "Petrol", power: 181, torque: 205, topSpeed: 210, accel: "6.5s", priceCr: 0.32, extraFeatures: ["Manual Fabric Soft Top"] },
            { id: "rf", label: "MX-5 RF (Retractable Fastback)", fuelType: "Petrol", power: 181, torque: 205, topSpeed: 209, accel: "6.5s", priceCr: 0.38, extraFeatures: ["Power Retractable Fastback Roof"] }
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
        description: "The current-generation Defender, built on an aluminium monocoque with permanent four-wheel drive and a two-speed transfer box.",
        specs: { engine: "3.0L Diesel I6 / 5.0L Supercharged Petrol V8", transmission: "8-Speed Auto", seating: "5 Seats", fuelType: "Diesel" },
        features: ["Terrain Response 2", "Electronic Air Suspension", "Wade Sensing", "ClearSight Ground View", "3D Surround Camera", "Pivi Pro Infotainment"],
        colors: [
            { name: "Coastal Blue", hex: "#4a6a78" },
            { name: "Pangea Green", hex: "#8a9873" },
            { name: "Santorini Black", hex: "#2b2b2b" }
        ],
        variants: [
            { id: "d300-diesel", label: "110 D300 Diesel", fuelType: "Diesel", power: 296, torque: 650, topSpeed: 191, accel: "6.7s", priceCr: 1.32, extraFeatures: [] },
            { id: "v8-petrol", label: "110 P525 V8 Petrol", fuelType: "Petrol", power: 518, torque: 625, topSpeed: 240, accel: "5.4s", priceCr: 1.85, extraFeatures: ["Quad Exhaust Outlets", "Adaptive Dynamics"] }
        ]
    },
    {
        id: "mercedes-g-wagon",
        brand: "Mercedes",
        name: "Mercedes-Benz G-Class",
        images: { front: "../Images/mercedes-g-wagon-front.jpg", side: null, interior: null, back: "../Images/mercedes-g-wagon-back.png" },
        colorImages: {
            "Denim Blue": { front: "../Images/gwagon-blue-front.png", side: null, interior: null, back: "../Images/gwagon-blue-back.png" },
            "Alpine White": { front: "../Images/gwagon-white-front.png", side: null, interior: null, back: null },
            "Jet Black": { front: "../Images/gwagon-black-front.png", side: null, interior: null, back: null },
            "Olive Green": { front: "../Images/gwagon-olive-front.png", side: null, interior: null, back: null },
            "Sunset Orange": { front: "../Images/gwagon-orange-front.png", side: null, interior: null, back: "../Images/gwagon-orange-back.png" },
            "Maroon": { front: "../Images/gwagon-maroon-front.png", side: null, interior: null, back: null }
        },
        description: "Mercedes-Benz's boxy body-on-frame off-roader, with three locking differentials and a low-range transfer case under a luxury cabin.",
        specs: { engine: "4.0L Biturbo V8", transmission: "9-Speed Auto", seating: "5 Seats", fuelType: "Petrol" },
        features: ["Three Locking Differentials", "Low-Range Transfer Case", "Independent Front Suspension", "Burmester Surround Sound", "MBUX Dual-Screen Cockpit", "Off-Road Cockpit Display"],
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
            { id: "g63-amg", label: "AMG G63", fuelType: "Petrol", power: 577, torque: 850, topSpeed: 240, accel: "4.3s", priceCr: 3.60, extraFeatures: ["48V Mild-Hybrid System", "AMG Ride Control Suspension", "AMG Performance Exhaust"] }
        ]
    },
    {
        id: "hyundai-ioniq-5",
        brand: "Hyundai",
        name: "Hyundai Ioniq 5",
        images: { front: null, side: "../Images/hyundai-ioniq5-side.jpg", interior: null, back: null },
        description: "Hyundai's E-GMP-based electric crossover with 800-volt fast charging, sold in India as a single 72.6 kWh rear-drive variant.",
        specs: { engine: "Electric Motor (RWD) / Dual-Motor (AWD)", transmission: "Single-Speed Direct Drive", seating: "5 Seats", fuelType: "Electric" },
        features: ["800V Ultra-Fast Charging", "Vehicle-to-Load Power Outlet", "Flat-Floor Cabin", "Sliding 'Universal Island' Centre Console", "Relaxation Front Seats", "Level 2 ADAS"],
        colors: CAR_COLORS,
        variants: [
            { id: "rwd", label: "Ioniq 5 RWD (72.6 kWh)", fuelType: "Electric", power: 214, torque: 350, topSpeed: 185, accel: "7.6s", priceCr: 0.46, extraFeatures: ["Up to 631 km range (ARAI)"] },
            { id: "awd", label: "Ioniq 5 AWD", fuelType: "Electric", power: 320, torque: 605, topSpeed: 185, accel: "5.1s", priceCr: 0.55, extraFeatures: ["Dual-Motor All-Wheel Drive"] }
        ]
    },
    {
        id: "kia-ev6-gt",
        brand: "Kia",
        name: "Kia EV6 GT",
        images: { front: "../Images/kia-ev6-front.jpg", side: null, interior: null, back: null },
        description: "Kia's E-GMP electric crossover, sold in India as the GT-Line AWD; the 585 PS EV6 GT is the performance version sold in other markets.",
        specs: { engine: "Dual-Motor Electric Powertrain", transmission: "Single-Speed Direct Drive", seating: "5 Seats", fuelType: "Electric" },
        features: ["800V Ultra-Fast Charging", "Dual-Motor All-Wheel Drive", "Vehicle-to-Load Power Outlet", "Augmented-Reality Head-Up Display", "Meridian Premium Audio", "Level 2 ADAS"],
        colors: CAR_COLORS,
        variants: [
            { id: "gt-line", label: "EV6 GT-Line AWD", fuelType: "Electric", power: 321, torque: 605, topSpeed: 185, accel: "5.2s", priceCr: 0.66, extraFeatures: ["Up to 663 km range (ARAI)"] },
            { id: "gt", label: "EV6 GT", fuelType: "Electric", power: 577, torque: 740, topSpeed: 260, accel: "3.5s", priceCr: 0.72, extraFeatures: ["Launch Control", "Drift Mode", "Electronic Limited-Slip Differential", "Up to 424 km range (WLTP)"] }
        ]
    },
    {
        id: "lucid-air",
        brand: "Lucid",
        name: "Lucid Air",
        images: { front: "../Images/lucid-air-front.png", side: "../Images/lucid-air-side.png", interior: "../Images/lucid-air-interior.png", back: "../Images/lucid-air-back.png" },
        colorImages: {
            "Eureka Gold": { front: null, side: null, interior: null, back: null },
            "Quantum Grey": { front: "../Images/lucid-air-front-grey.png", side: null, interior: null, back: null },
            "Sable Copper": { front: "../Images/lucid-air-copper-front.png", side: null, interior: null, back: null },
            "Zenith Red": { front: null, side: "../Images/lucid-air-side.png", interior: null, back: "../Images/lucid-air-back.png" },
            "Coastal Teal": { front: "../Images/lucid-air-teal-front.png", side: null, interior: null, back: null }
        },
        description: "Lucid's long-range electric luxury sedan, offered as the dual-motor Touring and the tri-motor Sapphire.",
        specs: { engine: "Dual-Motor (Touring) / Tri-Motor (Sapphire) Electric", transmission: "Single-Speed Direct Drive", seating: "5 Seats", fuelType: "Electric" },
        features: ["DreamDrive Driver Assistance", "Glass Canopy Roof", "34-inch Curved Glass Cockpit Display", "Surreal Sound Audio", "Wireless Device Charging", "Over-the-Air Updates"],
        colors: [
            { name: "Eureka Gold", hex: "#8a7250" },
            { name: "Quantum Grey", hex: "#6d7278" },
            { name: "Sable Copper", hex: "#7a5a4c" },
            { name: "Zenith Red", hex: "#5e1f2b" },
            { name: "Coastal Teal", hex: "#2f8f9c" }
        ],
        variants: [
            { id: "touring", label: "Air Touring", fuelType: "Electric", power: 620, torque: 830, topSpeed: 225, accel: "3.4s", priceCr: 1.15, extraFeatures: ["Up to 653 km range (EPA est., 19-inch wheels)"] },
            { id: "sapphire", label: "Air Sapphire", fuelType: "Electric", power: 1234, torque: 1430, topSpeed: 330, accel: "1.9s", priceCr: 2.10, extraFeatures: ["Tri-Motor All-Wheel Drive", "Carbon Ceramic Brakes", "Up to 687 km range (EPA est.)"] }
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
        description: "The V-Series version of Cadillac's three-row full-size SUV, with a 682 hp supercharged 6.2-litre V8.",
        specs: { engine: "6.2L Supercharged V8", transmission: "10-Speed Auto", seating: "7 Seats", fuelType: "Petrol" },
        features: ["Super Cruise Hands-Free Driving", "AKG Studio Reference Audio", "Curved OLED Display", "Magnetic Ride Control 4.0", "Adaptive Air Suspension", "Night Vision Camera"],
        colors: [
            { name: "Infrared Red", hex: "#8f1f1f" },
            { name: "Stellar Black", hex: "#0a0a0a" },
            { name: "Summit White", hex: "#f2f2f2" },
            { name: "Skyline Blue", hex: "#2b5f7a" }
        ],
        variants: [
            { id: "v", label: "Escalade-V", fuelType: "Petrol", power: 682, torque: 885, topSpeed: 200, accel: "4.4s", priceCr: 1.75, extraFeatures: [] },
            { id: "v-esv", label: "Escalade-V ESV (Long Wheelbase)", fuelType: "Petrol", power: 682, torque: 885, topSpeed: 200, accel: "4.4s", priceCr: 1.95, extraFeatures: ["Longer Wheelbase", "Larger Cargo Area"] }
        ]
    }
];

/* ================================================
   Helpers
   ================================================ */

/* Format a crore price for display, Indian style */
function formatCrorePrice(priceCr) {
    return "₹" + priceCr.toFixed(2) + " Crore";
}

/* Get a car by its id */
function getCarById(id) {
    for (let i = 0; i < CARS.length; i++) {
        if (CARS[i].id === id) {
            return CARS[i];
        }
    }
    return null;
}

/* Removes duplicate values IN PLACE using nested loops + splice().
   The inner index steps back after a splice so no item is skipped. */
function removeDuplicates(list) {
    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            if (list[i] === list[j]) {
                list.splice(j, 1);
                j--;
            }
        }
    }

    return list;
}

/* Distinct, sorted list of every brand in CARS */
function getAllBrands() {
    const brands = CARS.map(car => car.brand);

    removeDuplicates(brands);

    return brands.sort();
}

/* Best available thumbnail for listing cards / similar cars.
   Cars with per-colour photos (colorImages) use the first colour that
   actually has a photo; everything else falls back to the flat
   `images` object. */
function getDefaultThumbnail(car) {
    if (car.colorImages) {
        for (let i = 0; i < car.colors.length; i++) {
            const set = car.colorImages[car.colors[i].name];

            if (set) {
                if (set.front) return set.front;
                if (set.side) return set.side;
                if (set.back) return set.back;
            }
        }

        return null;
    }

    if (!car.images) {
        return null;
    }

    return car.images.front || car.images.side || car.images.back || null;
}

/* ================================================
   Number, decision and loop helpers
   (used by cars.js, details.js, contact.js and main.js)
   ================================================ */

/* Even / odd check */
function isEven(number) {
    return number % 2 === 0;
}

/* Is the number inside min..max (inclusive)? */
function isInRange(number, min, max) {
    return number >= min && number <= max;
}

/* Price band label: an if...else if...else ladder.
   The first true condition wins; `else` catches everything else. */
function getPriceCategory(priceCr) {
    if (priceCr < 1) {
        return 'Entry Luxury';
    } else if (priceCr < 3) {
        return 'Premium';
    } else if (priceCr < 6) {
        return 'Supercar';
    } else {
        return 'Hypercar';
    }
}

/* ================================================
   Random + string helpers
   ================================================ */

/* Random whole number from min to max, BOTH included */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* A random item from an array */
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

/* Adds up the character codes of a string (charCodeAt) */
function charCodeSum(text) {
    let sum = 0;

    for (let i = 0; i < text.length; i++) {
        sum += text.charCodeAt(i);
    }

    return sum;
}

/* "ferrari roma" -> "Ferrari Roma" */
function capitalizeWords(text) {
    const words = text.split(' ');

    for (let i = 0; i < words.length; i++) {
        if (words[i] === '') {
            continue;
        }

        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }

    return words.join(' ');
}

/* Unique booking reference such as AV-421873. do...while keeps
   generating until the number has not been used before. */
function generateReferenceNumber(seedText, existingRefs) {
    const taken = Array.isArray(existingRefs) ? existingRefs : [];
    const base = charCodeSum(seedText || 'AUTOVERSE') % 100;
    let reference;

    do {
        reference = `AV-${String(base).padStart(2, '0')}${randomInt(1000, 9999)}`;
    } while (taken.includes(reference));

    return reference;
}

/* "Sunday, October 25, 2026" - formatted from the Date object's parts */
function formatDateLong(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];

    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/* ================================================
   Array helpers
   ================================================ */

/* Merge two arrays with spread */
function mergeLists(first, second) {
    return [...first, ...second];
}

/* Brand -> number of cars. Uses for...in over a plain object. */
function getBrandSummary() {
    const counts = {};

    CARS.forEach(car => {
        counts[car.brand] = (counts[car.brand] || 0) + 1;
    });

    const summary = [];

    for (const brand in counts) {
        if (!Object.prototype.hasOwnProperty.call(counts, brand)) {
            continue;
        }

        summary.push({ brand: brand, cars: counts[brand] });
    }

    return summary;
}

function logBrandSummary() {
    console.table(getBrandSummary());
}

/* Browser-only start-up message (the very first console.log) */
if (typeof window !== 'undefined' && typeof console !== 'undefined') {
    console.log(`AUTOVERSE data ready: ${CARS.length} cars across ${getAllBrands().length} brands`);
}

/* ================================================
   Test-only export shim. Browsers never define
   `module`, so this block is a complete no-op when
   the file is loaded via a <script> tag - it only
   runs under Node/Jest, letting the test suite
   `require()` these functions without needing a
   bundler or duplicating logic.
   ================================================ */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CAR_COLORS: CAR_COLORS,
        CARS: CARS,
        placeholderFrameHTML: placeholderFrameHTML,
        formatCrorePrice: formatCrorePrice,
        getCarById: getCarById,
        getAllBrands: getAllBrands,
        getDefaultThumbnail: getDefaultThumbnail,
        removeDuplicates: removeDuplicates,
        isEven: isEven,
        isInRange: isInRange,
        getPriceCategory: getPriceCategory,
        randomInt: randomInt,
        pickRandom: pickRandom,
        charCodeSum: charCodeSum,
        capitalizeWords: capitalizeWords,
        generateReferenceNumber: generateReferenceNumber,
        formatDateLong: formatDateLong,
        mergeLists: mergeLists,
        getBrandSummary: getBrandSummary
    };
}
