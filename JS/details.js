/* ================================================
   details.js
   Reads ?id=<car-id> from the URL and builds the
   entire car-details.html page from CARS
   (see cars-data.js): a front/side/interior/back
   photo carousel, specs, performance, a working
   colour picker, a working variant / fuel-type
   picker, features, and similar cars.
   ================================================ */

(function () {
    if (typeof CARS === 'undefined') {
        return;
    }

    var params = new URLSearchParams(window.location.search);
    var carId = params.get('id') || 'porsche-911-turbo-s';
    var car = getCarById(carId);

    if (!car) {
        car = CARS[0];
    }

    var selectedVariant = car.variants[0];
    var selectedColor = car.colors[0];
    var slideIndex = 0;

    function currentImageSet() {
        var base = car.images || {};

        if (car.colorImages) {
            var colorSet = car.colorImages[selectedColor.name] || {};

            /* Fall back to the car's shared front/side/interior/back photos
               for any angle this specific colour doesn't have its own
               photo for, rather than showing a placeholder when a
               perfectly good generic shot exists. */
            return {
                front: colorSet.front || base.front || null,
                side: colorSet.side || base.side || null,
                interior: colorSet.interior || base.interior || null,
                back: colorSet.back || base.back || null
            };
        }

        return base;
    }

    function getSlides() {
        var set = currentImageSet();

        return [
            { src: set.front || null, label: 'Front View' },
            { src: set.side || null, label: 'Side View' },
            { src: set.interior || null, label: 'Interior' },
            { src: set.back || null, label: 'Rear View' }
        ];
    }

    /* -------- Elements -------- */
    var breadcrumbName = document.getElementById('breadcrumbName');
    var galleryFrame = document.getElementById('galleryFrame');
    var galleryDots = document.getElementById('galleryDots');
    var prevArrow = document.getElementById('galleryPrev');
    var nextArrow = document.getElementById('galleryNext');
    var detailsBrand = document.getElementById('detailsBrand');
    var carTitle = document.getElementById('carTitle');
    var carDescription = document.getElementById('carDescription');
    var carPrice = document.getElementById('carPrice');
    var colorSwatches = document.getElementById('colorSwatches');
    var selectedColorLabel = document.getElementById('selectedColorLabel');
    var variantButtons = document.getElementById('variantButtons');
    var specGrid = document.getElementById('specGrid');
    var performanceGrid = document.getElementById('performanceGrid');
    var featuresList = document.getElementById('featuresList');
    var pageTitle = document.querySelector('title');

    /* -------- Static, non-variant page parts -------- */

    if (pageTitle) {
        pageTitle.textContent = car.name + ' | AUTOVERSE';
    }

    if (breadcrumbName) {
        breadcrumbName.textContent = car.name;
    }

    if (detailsBrand) {
        detailsBrand.textContent = car.brand.toUpperCase();
    }

    if (carTitle) {
        carTitle.textContent = car.name;
    }

    if (carDescription) {
        carDescription.textContent = car.description;
    }

    var testDriveLink = document.querySelector('.details-buttons a[href="contact.html"], .details-buttons .btn:not(.back-btn)');

    if (testDriveLink) {
        testDriveLink.setAttribute('href', 'contact.html?car=' + encodeURIComponent(car.id));
    }

    var saveToGarageBtn = document.getElementById('saveToGarageBtn');

    function renderSaveToGarageBtn() {
        if (!saveToGarageBtn || typeof isCarWishlisted !== 'function') {
            return;
        }

        var saved = isCarWishlisted(car.id);
        saveToGarageBtn.innerHTML = saved ? '&#9829; Saved to Garage' : '&#9825; Save to Garage';
        saveToGarageBtn.classList.toggle('saved', saved);
    }

    if (saveToGarageBtn) {
        saveToGarageBtn.addEventListener('click', function () {
            if (typeof toggleWishlist === 'function') {
                toggleWishlist(car.id);
                renderSaveToGarageBtn();
            }
        });

        renderSaveToGarageBtn();
    }

    /* -------- Photo carousel: front / side / interior / back -------- */

    function shortName() {
        return car.name.replace(car.brand, '').trim().toUpperCase();
    }

    function renderGallery() {
        if (!galleryFrame) {
            return;
        }

        var slides = getSlides();

        if (slideIndex >= slides.length) {
            slideIndex = 0;
        }

        var slide = slides[slideIndex];
        var tint = selectedColor.hex;

        var heartMarkup = typeof wishlistHeartHTML === 'function' ? wishlistHeartHTML(car.id) : '';

        if (slide.src) {
            galleryFrame.innerHTML =
                '<span class="brand-tag">' + car.brand + '</span>' +
                heartMarkup +
                '<img src="' + slide.src + '" alt="' + car.name + ' - ' + selectedColor.name + ' - ' + slide.label + '">' +
                '<span class="gallery-caption">' + selectedColor.name + ' \u2013 ' + slide.label + '</span>';
        } else {
            galleryFrame.innerHTML =
                '<span class="brand-tag">' + car.brand + '</span>' +
                heartMarkup +
                placeholderFrameHTML(car, slide.label, tint) +
                '<span class="gallery-caption">' + slide.label + '</span>';
        }

        if (galleryDots) {
            galleryDots.innerHTML = slides.map(function (s, i) {
                var activeClass = i === slideIndex ? ' active' : '';
                return '<button type="button" class="gallery-dot' + activeClass + '" data-index="' + i + '" aria-label="Show ' + s.label + '"></button>';
            }).join('');

            galleryDots.querySelectorAll('.gallery-dot').forEach(function (dot) {
                dot.addEventListener('click', function () {
                    slideIndex = parseInt(dot.getAttribute('data-index'), 10);
                    renderGallery();
                });
            });
        }
    }

    function goToSlide(delta) {
        var slides = getSlides();
        slideIndex = (slideIndex + delta + slides.length) % slides.length;
        renderGallery();
    }

    if (prevArrow) {
        prevArrow.addEventListener('click', function () { goToSlide(-1); });
    }

    if (nextArrow) {
        nextArrow.addEventListener('click', function () { goToSlide(1); });
    }

    /* -------- Colour picker -------- */
    /* Selecting a colour keeps the same car and the same photo set -
       it re-tints the placeholder frame / current photo's border and
       updates the colour label, since we don't have a distinct photo
       per paint colour. */

    function renderColorSwatches() {
        if (!colorSwatches) {
            return;
        }

        colorSwatches.innerHTML = car.colors.map(function (color) {
            var activeClass = color.name === selectedColor.name ? ' active' : '';
            return (
                '<button type="button" class="color-swatch' + activeClass + '" ' +
                    'data-color="' + color.name + '" ' +
                    'style="background:' + color.hex + '" ' +
                    'title="' + color.name + '" aria-label="' + color.name + '"></button>'
            );
        }).join('');

        if (selectedColorLabel) {
            selectedColorLabel.textContent = selectedColor.name;
        }

        colorSwatches.querySelectorAll('.color-swatch').forEach(function (swatch) {
            swatch.addEventListener('click', function () {
                var colorName = swatch.getAttribute('data-color');
                var match = car.colors.filter(function (c) { return c.name === colorName; })[0];

                if (match) {
                    selectedColor = match;
                    renderColorSwatches();
                    renderGallery();
                }
            });
        });
    }

    /* -------- Variant / fuel-type picker -------- */

    function renderVariantButtons() {
        if (!variantButtons) {
            return;
        }

        variantButtons.innerHTML = car.variants.map(function (variant) {
            var activeClass = variant.id === selectedVariant.id ? ' active' : '';
            return (
                '<button type="button" class="variant-btn' + activeClass + '" data-variant="' + variant.id + '">' +
                    variant.label + '<span class="variant-fuel">' + variant.fuelType + '</span>' +
                '</button>'
            );
        }).join('');

        variantButtons.querySelectorAll('.variant-btn').forEach(function (button) {
            button.addEventListener('click', function () {
                var variantId = button.getAttribute('data-variant');
                var match = car.variants.filter(function (v) { return v.id === variantId; })[0];

                if (match) {
                    selectedVariant = match;
                    renderVariantButtons();
                    renderPrice();
                    renderSpecs();
                    renderPerformance();
                    renderFeatures();
                    renderPowertrainDesign();
                    renderInteriorTechnology();
                    renderSafety();
                }
            });
        });
    }

    /* -------- Price -------- */

    function renderPrice() {
        if (carPrice) {
            carPrice.textContent = formatCrorePrice(selectedVariant.priceCr);
        }
    }

    /* -------- Specifications -------- */

    function renderSpecs() {
        if (!specGrid) {
            return;
        }

        var specs = [
            { label: 'Engine', value: car.specs.engine },
            { label: 'Power', value: selectedVariant.power + ' bhp' },
            { label: 'Torque', value: selectedVariant.torque + ' Nm' },
            { label: 'Transmission', value: car.specs.transmission },
            { label: '0-100 km/h', value: selectedVariant.accel },
            { label: 'Top Speed', value: selectedVariant.topSpeed + ' km/h' },
            { label: 'Fuel Type', value: selectedVariant.fuelType },
            { label: 'Seating', value: car.specs.seating }
        ];

        specGrid.innerHTML = specs.map(function (spec) {
            return '<div class="spec-item"><h3>' + spec.label + '</h3><p>' + spec.value + '</p></div>';
        }).join('');
    }

    /* -------- Performance -------- */

    function renderPerformance() {
        if (!performanceGrid) {
            return;
        }

        var perf = [
            { value: selectedVariant.power, label: 'Horsepower' },
            { value: selectedVariant.torque, label: 'Torque Nm' },
            { value: selectedVariant.topSpeed, label: 'Top Speed km/h' },
            { value: selectedVariant.accel, label: '0-100 km/h' }
        ];

        performanceGrid.innerHTML = perf.map(function (item) {
            return '<div class="performance-item"><strong>' + item.value + '</strong><span>' + item.label + '</span></div>';
        }).join('');
    }

    /* -------- Features (base features + anything the selected variant adds) -------- */

    function renderFeatures() {
        if (!featuresList) {
            return;
        }

        var allFeatures = car.features.concat(selectedVariant.extraFeatures || []);

        featuresList.innerHTML = allFeatures.map(function (feature) {
            return '<li>' + feature + '</li>';
        }).join('');
    }

    /* -------- Overview -------- */

    function renderOverview() {
        var titleEl = document.getElementById('overviewTitle');
        var textEl = document.getElementById('overviewText');

        if (!textEl) {
            return;
        }

        if (titleEl) {
            titleEl.textContent = car.brand + ' Philosophy';
        }

        textEl.textContent = car.description + ' Every ' + car.brand + ' that carries this badge is built around one idea: performance and craftsmanship should never have to compete with each other.';
    }

    /* -------- Powertrain / Design / Interior / Technology (generic, built from specs + features) -------- */

    function pick(list, keywords, fallbackCount) {
        var matched = list.filter(function (item) {
            return keywords.some(function (word) {
                return item.toLowerCase().indexOf(word) !== -1;
            });
        });

        return matched.length ? matched : list.slice(0, fallbackCount || 2);
    }

    function renderListInto(elementId, items) {
        var el = document.getElementById(elementId);

        if (!el) {
            return;
        }

        el.innerHTML = items.map(function (item) {
            return '<div class="split-list-item">' + item + '</div>';
        }).join('');
    }

    function renderPowertrainDesign() {
        var allFeatures = car.features.concat(selectedVariant.extraFeatures || []);

        var powertrainItems = [
            'Engine: ' + car.specs.engine,
            'Transmission: ' + car.specs.transmission,
            'Power: ' + selectedVariant.power + ' bhp / Torque: ' + selectedVariant.torque + ' Nm'
        ];

        if (car.specs.fuelType === 'Electric' || car.specs.fuelType === 'Hybrid') {
            powertrainItems.push('Electrified powertrain tuned for instant torque delivery from a standstill.');
        }

        renderListInto('powertrainList', powertrainItems);

        var designItems = pick(allFeatures, ['light', 'aero', 'carbon', 'wheel', 'roof', 'body', 'led'], 3);
        designItems = designItems.length ? designItems : ['Sculpted body lines shaped for both presence and efficiency.', 'Signature lighting language unique to ' + car.brand + '.', 'Aerodynamic details tuned to reduce drag without disrupting the silhouette.'];
        renderListInto('designList', designItems);
    }

    function renderInteriorTechnology() {
        var allFeatures = car.features.concat(selectedVariant.extraFeatures || []);

        var interiorItems = pick(allFeatures, ['seat', 'leather', 'alcantara', 'audio', 'cockpit', 'comfort', 'sound'], 3);
        interiorItems = interiorItems.length ? interiorItems : ['Premium upholstery finished with meticulous hand-stitched detailing.', car.specs.seating + ' of thoughtfully designed cabin space.', 'A driver-focused cockpit built around comfort on every drive.'];
        renderListInto('interiorList', interiorItems);

        var technologyItems = pick(allFeatures, ['assist', 'display', 'connect', 'camera', 'cruise', 'head-up', 'hud', 'app', 'digital', 'wireless', 'update'], 3);
        technologyItems = technologyItems.length ? technologyItems : ['Digital instrument cluster with configurable driving displays.', 'Smartphone connectivity with over-the-air software updates.', 'Advanced driver assistance systems for confident everyday driving.'];
        renderListInto('technologyList', technologyItems);
    }

    /* -------- Driving Experience -------- */

    function renderDriveModes() {
        var grid = document.getElementById('driveModeGrid');

        if (!grid) {
            return;
        }

        var isElectrified = car.specs.fuelType === 'Electric' || car.specs.fuelType === 'Hybrid';

        var modes = [
            { icon: 'C', name: 'Comfort', text: 'Softened throttle and suspension response tuned for effortless daily driving.' },
            { icon: 'S', name: 'Sport', text: 'Sharper steering, faster shifts and a more aggressive exhaust note on demand.' },
            isElectrified
                ? { icon: 'E', name: 'Electric', text: 'Silent, zero-emission driving with instant torque for city commutes.' }
                : { icon: 'T', name: 'Track', text: 'Maximum power delivery and stability control tuned for closed-circuit driving.' }
        ];

        grid.innerHTML = modes.map(function (mode) {
            return (
                '<div class="drive-mode-card">' +
                    '<div class="drive-mode-icon">' + mode.icon + '</div>' +
                    '<h3>' + mode.name + '</h3>' +
                    '<p>' + mode.text + '</p>' +
                '</div>'
            );
        }).join('');
    }

    /* -------- Safety -------- */

    function renderSafety() {
        var list = document.getElementById('safetyList');

        if (!list) {
            return;
        }

        var allFeatures = car.features.concat(selectedVariant.extraFeatures || []);
        var safetyFromFeatures = pick(allFeatures, ['brake', 'camera', 'cruise', 'assist', 'sensor', 'stability'], 0);

        var safetyItems = [
            'Multi-Airbag Safety Cell',
            'Advanced Traction & Stability Control',
            'High-Performance Braking System',
            '360-Degree Parking Sensors & Camera'
        ].concat(safetyFromFeatures);

        list.innerHTML = safetyItems.slice(0, 6).map(function (item) {
            return '<li>' + item + '</li>';
        }).join('');
    }

    /* -------- Ownership -------- */

    function renderOwnership() {
        var grid = document.getElementById('ownershipGrid');

        if (!grid) {
            return;
        }

        var cards = [
            { title: 'Warranty', text: 'Comprehensive manufacturer warranty coverage arranged through AUTOVERSE\'s partner network.' },
            { title: 'Service Plans', text: 'Scheduled maintenance packages designed to keep your ' + car.name + ' performing like new.' },
            { title: 'Concierge Support', text: 'A dedicated AUTOVERSE specialist stays with you from enquiry through to delivery day.' }
        ];

        grid.innerHTML = cards.map(function (card) {
            return '<div class="ownership-card"><h3>' + card.title + '</h3><p>' + card.text + '</p></div>';
        }).join('');
    }

    /* -------- Reviews -------- */

    function renderReviews() {
        var grid = document.getElementById('reviewsGrid');

        if (!grid || typeof getCarReviews !== 'function') {
            return;
        }

        var reviews = getCarReviews(car);

        grid.innerHTML = reviews.map(function (review) {
            var stars = '\u2605'.repeat(review.rating) + '\u2606'.repeat(5 - review.rating);

            return (
                '<article class="review-card">' +
                    '<div class="review-head">' +
                        '<div class="review-avatar">' + review.initials + '</div>' +
                        '<div>' +
                            '<p class="review-name">' + review.name + '</p>' +
                            '<p class="review-stars">' + stars + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<p class="review-text">' + review.text + '</p>' +
                '</article>'
            );
        }).join('');
    }

    /* -------- Final CTA -------- */

    function renderFinalCta() {
        var btn = document.getElementById('finalCtaBtn');

        if (btn) {
            btn.setAttribute('href', 'contact.html?car=' + encodeURIComponent(car.id));
        }
    }

    /* -------- Similar cars (9 total, 3 visible at a time, arrow-paged) -------- */

    var similarGrid = document.getElementById('similarGrid');
    var similarPrev = document.getElementById('similarPrev');
    var similarNext = document.getElementById('similarNext');
    var similarDots = document.getElementById('similarDots');
    var similarCars = [];
    var similarPage = 0;
    var similarPerPage = 3;

    function similarCardHTML(c) {
        var baseVariant = c.variants[0];
        var thumbnail = getDefaultThumbnail(c);
        var imageMarkup = thumbnail
            ? '<img src="' + thumbnail + '" alt="' + c.name + '">'
            : placeholderFrameHTML(c, 'Front View', '#e63946');

        return (
            '<article class="car-card similar-card">' +
                '<div class="car-img">' +
                    '<span class="brand-tag">' + c.brand + '</span>' +
                    (typeof wishlistHeartHTML === 'function' ? wishlistHeartHTML(c.id) : '') +
                    imageMarkup +
                '</div>' +
                '<div class="similar-card-content">' +
                    '<h3>' + c.name + '</h3>' +
                    '<p class="brand">Brand: ' + c.brand + '</p>' +
                    '<p class="price">' + formatCrorePrice(baseVariant.priceCr) + '</p>' +
                    '<a href="car-details.html?id=' + c.id + '" class="details-btn">View Details</a>' +
                '</div>' +
            '</article>'
        );
    }

    function renderSimilarPage() {
        if (!similarGrid) {
            return;
        }

        var totalPages = Math.ceil(similarCars.length / similarPerPage);
        var start = similarPage * similarPerPage;
        var pageCars = similarCars.slice(start, start + similarPerPage);

        similarGrid.innerHTML = pageCars.map(similarCardHTML).join('');

        if (similarDots) {
            similarDots.innerHTML = '';

            for (var i = 0; i < totalPages; i++) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'gallery-dot' + (i === similarPage ? ' active' : '');
                dot.setAttribute('aria-label', 'Show similar cars page ' + (i + 1));

                (function (pageIndex) {
                    dot.addEventListener('click', function () {
                        similarPage = pageIndex;
                        renderSimilarPage();
                    });
                }(i));

                similarDots.appendChild(dot);
            }
        }
    }

    function renderSimilarCars() {
        if (!similarGrid) {
            return;
        }

        var sameBrand = CARS.filter(function (c) { return c.id !== car.id && c.brand === car.brand; });
        var others = CARS.filter(function (c) { return c.id !== car.id && c.brand !== car.brand; });
        similarCars = sameBrand.concat(others).slice(0, 9);
        similarPage = 0;

        renderSimilarPage();
    }

    if (similarPrev) {
        similarPrev.addEventListener('click', function () {
            var totalPages = Math.ceil(similarCars.length / similarPerPage) || 1;
            similarPage = (similarPage - 1 + totalPages) % totalPages;
            renderSimilarPage();
        });
    }

    if (similarNext) {
        similarNext.addEventListener('click', function () {
            var totalPages = Math.ceil(similarCars.length / similarPerPage) || 1;
            similarPage = (similarPage + 1) % totalPages;
            renderSimilarPage();
        });
    }

    renderGallery();
    renderColorSwatches();
    renderVariantButtons();
    renderPrice();
    renderSpecs();
    renderPerformance();
    renderFeatures();
    renderOverview();
    renderPowertrainDesign();
    renderInteriorTechnology();
    renderDriveModes();
    renderSafety();
    renderOwnership();
    renderReviews();
    renderFinalCta();
    renderSimilarCars();
}());
