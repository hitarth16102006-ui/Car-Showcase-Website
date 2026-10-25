/* ================================================
   details.js
   Reads ?id=<car-id> from the URL and builds the
   entire car-details.html page from CARS
   (see cars-data.js): a front/side/interior/back
   photo carousel, specs, performance, a working
   colour picker, a working variant / fuel-type
   picker, features, similar cars - plus a rating
   summary, variant table, finance tool and a
   printable spec sheet.
   ================================================ */

(function () {
    if (typeof CARS === 'undefined') {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const carId = params.get('id') || 'porsche-911-turbo-s';
    let car = getCarById(carId);

    if (!car) {
        car = CARS[0];
    }

    /* remember the last car viewed (implicit global lives in trackVisit) */
    trackVisit(car.id);

    let selectedVariant = car.variants[0];
    let selectedColor = car.colors[0];
    let slideIndex = 0;

    function currentImageSet() {
        const base = car.images || {};

        if (car.colorImages) {
            const colorSet = car.colorImages[selectedColor.name] || {};

            /* Fall back to the car's shared photos for any angle this colour
               has no photo of its own for. */
            return {
                front: colorSet.front || base.front || null,
                side: colorSet.side || base.side || null,
                interior: colorSet.interior || base.interior || null,
                back: colorSet.back || base.back || null
            };
        }

        return base;
    }

    /* slides can be swapped around (front <-> rear) with the swap button */
    let slideOrder = [0, 1, 2, 3];

    function getSlides() {
        const set = currentImageSet();

        const slides = [
            { src: set.front || null, label: 'Front View' },
            { src: set.side || null, label: 'Side View' },
            { src: set.interior || null, label: 'Interior' },
            { src: set.back || null, label: 'Rear View' }
        ];

        return slideOrder.map(index => slides[index]);
    }

    /* -------- Elements -------- */
    let breadcrumbName = document.getElementById('breadcrumbName');
    let galleryFrame = document.getElementById('galleryFrame');
    let galleryDots = document.getElementById('galleryDots');
    let prevArrow = document.getElementById('galleryPrev');
    let nextArrow = document.getElementById('galleryNext');
    let detailsBrand = document.getElementById('detailsBrand');
    let carTitle = document.getElementById('carTitle');
    let carDescription = document.getElementById('carDescription');
    let carPrice = document.getElementById('carPrice');
    let colorSwatches = document.getElementById('colorSwatches');
    let selectedColorLabel = document.getElementById('selectedColorLabel');
    let variantButtons = document.getElementById('variantButtons');
    let specGrid = document.getElementById('specGrid');
    let performanceGrid = document.getElementById('performanceGrid');
    let featuresList = document.getElementById('featuresList');
    let pageTitle = document.querySelector('title');

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

    let testDriveLink = document.querySelector('.details-buttons a[href="contact.html"], .details-buttons .btn:not(.back-btn)');

    if (testDriveLink) {
        testDriveLink.setAttribute('href', 'contact.html?car=' + encodeURIComponent(car.id));
    }

    let saveToGarageBtn = document.getElementById('saveToGarageBtn');

    function renderSaveToGarageBtn() {
        if (!saveToGarageBtn || typeof isCarWishlisted !== 'function') {
            return;
        }

        let saved = isCarWishlisted(car.id);
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

    let compareToggleBtn = document.getElementById('compareToggleBtn');

    function renderCompareToggleBtn() {
        if (!compareToggleBtn || typeof isCarInCompare !== 'function') {
            return;
        }

        let inCompare = isCarInCompare(car.id);
        compareToggleBtn.innerHTML = inCompare ? '&#10003; Added to Compare' : '&#8646; Add to Compare';
        compareToggleBtn.classList.toggle('saved', inCompare);
    }

    if (compareToggleBtn) {
        compareToggleBtn.addEventListener('click', function () {
            if (typeof toggleCompare === 'function') {
                toggleCompare(car.id);
                renderCompareToggleBtn();
            }
        });

        renderCompareToggleBtn();
    }

    /* -------- Photo carousel: front / side / interior / back -------- */

    function shortName() {
        return car.name.replace(car.brand, '').trim().toUpperCase();
    }

    function renderGallery() {
        if (!galleryFrame) {
            return;
        }

        let slides = getSlides();

        if (slideIndex >= slides.length) {
            slideIndex = 0;
        }

        let slide = slides[slideIndex];
        let tint = selectedColor.hex;

        let heartMarkup = typeof wishlistHeartHTML === 'function' ? wishlistHeartHTML(car.id) : '';

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
                let activeClass = i === slideIndex ? ' active' : '';
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
        let slides = getSlides();
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
            let activeClass = color.name === selectedColor.name ? ' active' : '';
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
                let colorName = swatch.getAttribute('data-color');
                let match = car.colors.filter((c) => c.name === colorName)[0];

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
            let activeClass = variant.id === selectedVariant.id ? ' active' : '';
            return (
                '<button type="button" class="variant-btn' + activeClass + '" data-variant="' + variant.id + '">' +
                    variant.label + '<span class="variant-fuel">' + variant.fuelType + '</span>' +
                '</button>'
            );
        }).join('');

        variantButtons.querySelectorAll('.variant-btn').forEach(function (button) {
            button.addEventListener('click', function () {
                let variantId = button.getAttribute('data-variant');
                let match = car.variants.filter((v) => v.id === variantId)[0];

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

        let specs = [
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

        let perf = [
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

        let allFeatures = car.features.concat(selectedVariant.extraFeatures || []);

        featuresList.innerHTML = allFeatures.map(function (feature) {
            return '<li>' + feature + '</li>';
        }).join('');
    }

    /* -------- Overview -------- */

    function renderOverview() {
        let titleEl = document.getElementById('overviewTitle');
        let textEl = document.getElementById('overviewText');

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
        let matched = list.filter(function (item) {
            return keywords.some(function (word) {
                return item.toLowerCase().includes(word);
            });
        });

        return matched.length ? matched : list.slice(0, fallbackCount || 2);
    }

    function renderListInto(elementId, items) {
        let el = document.getElementById(elementId);

        if (!el) {
            return;
        }

        el.innerHTML = items.map(function (item) {
            return '<div class="split-list-item">' + item + '</div>';
        }).join('');
    }

    function renderPowertrainDesign() {
        let allFeatures = car.features.concat(selectedVariant.extraFeatures || []);

        let powertrainItems = [
            'Engine: ' + car.specs.engine,
            'Transmission: ' + car.specs.transmission,
            'Power: ' + selectedVariant.power + ' bhp / Torque: ' + selectedVariant.torque + ' Nm'
        ];

        if (car.specs.fuelType === 'Electric' || car.specs.fuelType === 'Hybrid') {
            powertrainItems.push('Electrified powertrain tuned for instant torque delivery from a standstill.');
        }

        renderListInto('powertrainList', powertrainItems);

        let designItems = pick(allFeatures, ['light', 'aero', 'carbon', 'wheel', 'roof', 'body', 'led'], 3);
        designItems = designItems.length ? designItems : ['Sculpted body lines shaped for both presence and efficiency.', 'Signature lighting language unique to ' + car.brand + '.', 'Aerodynamic details tuned to reduce drag without disrupting the silhouette.'];
        renderListInto('designList', designItems);
    }

    function renderInteriorTechnology() {
        let allFeatures = car.features.concat(selectedVariant.extraFeatures || []);

        let interiorItems = pick(allFeatures, ['seat', 'leather', 'alcantara', 'audio', 'cockpit', 'comfort', 'sound'], 3);
        interiorItems = interiorItems.length ? interiorItems : ['Premium upholstery finished with meticulous hand-stitched detailing.', car.specs.seating + ' of thoughtfully designed cabin space.', 'A driver-focused cockpit built around comfort on every drive.'];
        renderListInto('interiorList', interiorItems);

        let technologyItems = pick(allFeatures, ['assist', 'display', 'connect', 'camera', 'cruise', 'head-up', 'hud', 'app', 'digital', 'wireless', 'update'], 3);
        technologyItems = technologyItems.length ? technologyItems : ['Digital instrument cluster with configurable driving displays.', 'Smartphone connectivity with over-the-air software updates.', 'Advanced driver assistance systems for confident everyday driving.'];
        renderListInto('technologyList', technologyItems);
    }

    /* -------- Driving Experience -------- */

    function renderDriveModes() {
        let grid = document.getElementById('driveModeGrid');

        if (!grid) {
            return;
        }

        let isElectrified = car.specs.fuelType === 'Electric' || car.specs.fuelType === 'Hybrid';

        let modes = [
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
        let list = document.getElementById('safetyList');

        if (!list) {
            return;
        }

        let allFeatures = car.features.concat(selectedVariant.extraFeatures || []);
        let safetyFromFeatures = pick(allFeatures, ['brake', 'camera', 'cruise', 'assist', 'sensor', 'stability'], 0);

        let safetyItems = [
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
        let grid = document.getElementById('ownershipGrid');

        if (!grid) {
            return;
        }

        let cards = [
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
        let grid = document.getElementById('reviewsGrid');

        if (!grid || typeof getCarReviews !== 'function') {
            return;
        }

        let reviews = getCarReviews(car);

        grid.innerHTML = reviews.map(function (review) {
            let stars = '\u2605'.repeat(review.rating) + '\u2606'.repeat(5 - review.rating);

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
        let btn = document.getElementById('finalCtaBtn');

        if (btn) {
            btn.setAttribute('href', 'contact.html?car=' + encodeURIComponent(car.id));
        }
    }

    /* -------- Similar cars (9 total, 3 visible at a time, arrow-paged) -------- */

    let similarGrid = document.getElementById('similarGrid');
    let similarPrev = document.getElementById('similarPrev');
    let similarNext = document.getElementById('similarNext');
    let similarDots = document.getElementById('similarDots');
    let similarCars = [];
    let similarPage = 0;
    let similarPerPage = 3;

    function similarCardHTML(c) {
        let baseVariant = c.variants[0];
        let thumbnail = getDefaultThumbnail(c);
        let imageMarkup = thumbnail
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
                    '<div class="car-card-actions">' +
                        '<a href="car-details.html?id=' + c.id + '" class="details-btn">View Details</a>' +
                        (typeof compareButtonHTML === 'function' ? compareButtonHTML(c.id) : '') +
                    '</div>' +
                '</div>' +
            '</article>'
        );
    }

    function renderSimilarPage() {
        if (!similarGrid) {
            return;
        }

        let totalPages = Math.ceil(similarCars.length / similarPerPage);
        let start = similarPage * similarPerPage;
        let pageCars = similarCars.slice(start, start + similarPerPage);

        similarGrid.innerHTML = pageCars.map(similarCardHTML).join('');

        if (similarDots) {
            similarDots.innerHTML = '';

            for (let i = 0; i < totalPages; i++) {
                let dot = document.createElement('button');
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

        let sameBrand = CARS.filter((c) => c.id !== car.id && c.brand === car.brand);
        let others = CARS.filter((c) => c.id !== car.id && c.brand !== car.brand);
        similarCars = mergeLists(sameBrand, others).slice(0, 9);
        similarPage = 0;

        renderSimilarPage();
    }

    if (similarPrev) {
        similarPrev.addEventListener('click', function () {
            let totalPages = Math.ceil(similarCars.length / similarPerPage) || 1;
            similarPage = (similarPage - 1 + totalPages) % totalPages;
            renderSimilarPage();
        });
    }

    if (similarNext) {
        similarNext.addEventListener('click', function () {
            let totalPages = Math.ceil(similarCars.length / similarPerPage) || 1;
            similarPage = (similarPage + 1) % totalPages;
            renderSimilarPage();
        });
    }

    /* ================================================
       EXTRA TOOLS (built with createElement so the HTML
       file does not need to change)
       ================================================ */

    /* Where the extra sections go: after the ownership section,
       or at the end of <main> / <body> if that is missing */
    function getExtraHost() {
        const ownership = document.getElementById('ownershipGrid');
        const section = ownership ? ownership.closest('section') : null;
        const host = document.createElement('section');

        host.className = 'details-extras';
        host.style.cssText = 'max-width:1100px;margin:30px auto;padding:0 20px;';

        if (section && section.parentNode) {
            section.parentNode.insertBefore(host, section.nextSibling);
        } else {
            (document.querySelector('main') || document.body).appendChild(host);
        }

        return host;
    }

    function makeBlock(host, id, title) {
        const block = document.createElement('div');
        const heading = document.createElement('h2');

        block.id = id;
        block.style.marginBottom = '30px';
        heading.appendChild(document.createTextNode(title));
        block.appendChild(heading);
        host.appendChild(block);

        return block;
    }

    /* ---- Gallery extras: arrow keys, auto-play and front/rear swap ---- */
    function buildGalleryExtras() {
        if (!galleryFrame) {
            return;
        }

        /* keyboard: left / right arrows move the photo, unless typing */
        document.addEventListener('keydown', event => {
            const tag = event.target && event.target.tagName;

            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
                return;
            }

            if (event.key === 'ArrowLeft') {
                goToSlide(-1);
            } else if (event.key === 'ArrowRight') {
                goToSlide(1);
            }
        });

        const bar = document.createElement('div');
        bar.className = 'gallery-tools';
        bar.style.cssText = 'display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;';

        const playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.className = 'btn gallery-play';
        playBtn.textContent = 'Auto-play photos';

        const swapBtn = document.createElement('button');
        swapBtn.type = 'button';
        swapBtn.className = 'btn gallery-swap';
        swapBtn.textContent = 'Swap front / rear';

        let playTimer = null;

        playBtn.addEventListener('click', () => {
            if (playTimer === null) {
                playTimer = setInterval(() => goToSlide(1), 2500);
                playBtn.textContent = 'Stop auto-play';
            } else {
                clearInterval(playTimer);
                playTimer = null;
                playBtn.textContent = 'Auto-play photos';
            }
        });

        swapBtn.addEventListener('click', () => {
            /* swap two array items with destructuring - no temp variable */
            [slideOrder[0], slideOrder[3]] = [slideOrder[3], slideOrder[0]];
            slideIndex = 0;
            renderGallery();
        });

        bar.appendChild(playBtn);
        bar.appendChild(swapBtn);
        galleryFrame.insertAdjacentElement('afterend', bar);
    }

    /* ---- Colour preview square: grows and fades over one second ---- */
    function buildColorSquare() {
        if (!colorSwatches) {
            return;
        }

        const square = document.createElement('div');
        square.id = 'colorSquare';
        square.style.cssText = 'width:60px;height:60px;margin-top:10px;border-radius:6px;border:1px solid #888;transition:all 1s;';
        colorSwatches.insertAdjacentElement('afterend', square);

        let resetTimer = null;

        colorSquareUpdate = function () {
            square.style.background = selectedColor.hex;
            square.style.transform = 'scale(1.4)';
            square.style.opacity = '0.6';

            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                square.style.transform = 'scale(1)';
                square.style.opacity = '1';
            }, 50);
        };

        colorSquareUpdate();
    }

    let colorSquareUpdate = function () {};

    /* ---- Variant comparison table (nested loops) ---- */
    function buildVariantTable(host) {
        const block = makeBlock(host, 'variantTable', 'Compare All Variants');
        const table = document.createElement('table');
        table.style.cssText = 'width:100%;border-collapse:collapse;';

        const columns = ['Variant', 'Fuel', 'Power (bhp)', 'Torque (Nm)', 'Top speed (km/h)', 'Price'];
        const headRow = table.insertRow();

        for (let c = 0; c < columns.length; c++) {
            const th = document.createElement('th');
            th.appendChild(document.createTextNode(columns[c]));
            th.style.cssText = 'text-align:left;padding:8px;border-bottom:2px solid #888;';
            headRow.appendChild(th);
        }

        for (let r = 0; r < car.variants.length; r++) {
            const v = car.variants[r];
            const cells = [v.label, v.fuelType, v.power, v.torque, v.topSpeed, formatCrorePrice(v.priceCr)];
            const row = table.insertRow();

            for (let c = 0; c < cells.length; c++) {
                const td = row.insertCell();
                td.appendChild(document.createTextNode(String(cells[c])));
                td.style.cssText = 'padding:8px;border-bottom:1px solid #ccc;';
            }
        }

        block.appendChild(table);
    }

    /* ---- Rating summary with a star pattern (nested loops) ---- */
    function buildRatingSummary(host) {
        if (typeof getCarReviews !== 'function') {
            return;
        }

        const reviews = getCarReviews(car);

        if (!Array.isArray(reviews) || reviews.length === 0) {
            return;
        }

        const counts = new Array(6).fill(0);

        reviews.forEach(review => {
            counts[review.rating]++;
        });

        const average = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
        const block = makeBlock(host, 'ratingSummary', 'Rating Summary');
        const intro = document.createElement('p');

        intro.innerText = `Average ${average.toFixed(1)} / 5 from ${reviews.length} reviews`;
        block.appendChild(intro);

        const pre = document.createElement('pre');
        let pattern = '';

        for (let stars = 5; stars >= 1; stars--) {
            let line = `${stars} star `;

            for (let s = 0; s < stars; s++) {
                line += '★';
            }

            for (let n = 0; n < counts[stars]; n++) {
                line += ' ■';
            }

            pattern += `${line}\n`;
        }

        pre.textContent = pattern;
        block.appendChild(pre);
    }

    /* ---- Finance tool: calculator, expression box, ownership table ---- */
    function buildFinanceTool(host) {
        const block = makeBlock(host, 'financeTool', 'Finance & Ownership Tool');
        const basePrice = () => selectedVariant.priceCr;

        /* 1. simple calculator (uses switch inside calculate()) */
        const calcRow = document.createElement('div');
        calcRow.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px;';
        calcRow.innerHTML =
            '<input type="number" id="calcA" placeholder="First number" value="10">' +
            '<select id="calcOp"><option>+</option><option>-</option><option>*</option><option>/</option></select>' +
            '<input type="number" id="calcB" placeholder="Second number" value="2">' +
            '<button type="button" class="btn" id="calcGo">Calculate</button>' +
            '<strong id="calcOut"></strong>';
        block.appendChild(calcRow);

        document.getElementById('calcGo').addEventListener('click', () => {
            const a = parseFloat(document.getElementById('calcA').value);
            const b = parseFloat(document.getElementById('calcB').value);
            const op = document.getElementById('calcOp').value;

            document.getElementById('calcOut').innerText = (isNaN(a) || isNaN(b))
                ? 'Enter two numbers'
                : `${a} ${op} ${b} = ${calculate(a, op, b)}`;
        });

        /* 2. expression box using eval(), guarded by a whitelist.
           eval() runs text as code, so only digits, + - * / ( ) . and
           spaces are allowed through. Never eval raw user input. */
        const exprRow = document.createElement('div');
        exprRow.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px;';
        exprRow.innerHTML =
            '<input type="text" id="exprBox" placeholder="e.g. 2.5 * 4 + 1" value="2.5 * 4 + 1">' +
            '<button type="button" class="btn" id="exprGo">Evaluate</button>' +
            '<strong id="exprOut"></strong>';
        block.appendChild(exprRow);

        document.getElementById('exprGo').addEventListener('click', () => {
            const text = document.getElementById('exprBox').value;
            const out = document.getElementById('exprOut');

            if (!/^[0-9+\-*/().\s]+$/.test(text)) {
                out.innerText = 'Only numbers and + - * / ( ) are allowed';
                return;
            }

            try {
                out.innerText = `= ${eval(text)}`;
            } catch (error) {
                out.innerText = 'Invalid expression';
            }
        });

        /* 3. ownership cost table: a multiplication table in a div */
        const tableDiv = document.createElement('div');
        tableDiv.id = 'ownershipTable';
        block.appendChild(tableDiv);

        function renderOwnershipTable() {
            const annual = basePrice() * 0.03;
            const costs = [];
            let html = `<p>Estimated running cost: 3% of ${formatCrorePrice(basePrice())} per year = ${annual.toFixed(3)} Cr</p>`;

            for (let year = 1; year <= 5; year++) {
                const cost = annual * year;
                costs.push(cost);
                html += `<div>${year} x ${annual.toFixed(3)} = ${cost.toFixed(3)} Cr</div>`;
            }

            html += `<strong>5-year total: ${sumOf.apply(null, costs).toFixed(3)} Cr</strong>`;
            tableDiv.innerHTML = html;
        }

        renderOwnershipTable();
        refreshFinance = renderOwnershipTable;
    }

    let refreshFinance = function () {};

    /* ---- Printable spec sheet (document.write into a new window) ---- */
    function buildPrintButton() {
        const actions = document.querySelector('.details-buttons');

        if (!actions) {
            return;
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn print-spec-btn';
        btn.textContent = 'Print Spec Sheet';
        actions.appendChild(btn);

        btn.addEventListener('click', () => {
            const win = window.open('', '_blank');

            if (!win) {
                alert('Please allow pop-ups to open the spec sheet.');
                return;
            }

            let rows = '';

            for (const key in car.specs) {
                rows += `<tr><td><b>${key}</b></td><td>${car.specs[key]}</td></tr>`;
            }

            win.document.write(
                `<html><head><title>${car.name} spec sheet</title></head><body>` +
                `<h1>${car.name}</h1><p>${car.brand} - ${formatCrorePrice(selectedVariant.priceCr)}</p>` +
                `<table border="1" cellpadding="6">${rows}</table></body></html>`
            );
            win.document.close();
        });
    }

    /* variant changes also refresh the finance table */
    if (variantButtons) {
        variantButtons.addEventListener('click', () => refreshFinance());
    }

    if (colorSwatches) {
        colorSwatches.addEventListener('click', () => colorSquareUpdate());
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

    buildGalleryExtras();
    buildColorSquare();
    buildPrintButton();

    const extraHost = getExtraHost();
    buildVariantTable(extraHost);
    buildRatingSummary(extraHost);
    buildFinanceTool(extraHost);
}());
