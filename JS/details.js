/* ================================================
   details.js
   Reads ?id=<car-id> from the URL and builds the
   entire car-details.html page from CARS
   (see cars-data.js): a front/side/interior/back
   photo carousel, specs, performance, a working
   colour picker, a working variant / fuel-type
   picker, features, similar cars - plus a variant
   comparison table and a printable spec sheet.
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

    let selectedVariant = car.variants[0];
    /* Start on the first colour that has a photo of its own, so the
       first picture matches the colour name shown under it. */
    let selectedColor = car.colors[0];

    if (car.colorImages) {
        const firstWithPhoto = car.colors.find(color => {
            const set = car.colorImages[color.name];
            return set && (set.front || set.side || set.back);
        });

        if (firstWithPhoto) {
            selectedColor = firstWithPhoto;
        }
    }
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

        /* true when the photo really is in the selected colour, false when
           it is borrowed from the car's shared photos */
        const colorSet = car.colorImages ? (car.colorImages[selectedColor.name] || {}) : null;
        const inColor = angle => colorSet === null || Boolean(colorSet[angle]);

        const slides = [
            { src: set.front || null, label: 'Front View', inColor: inColor('front') },
            { src: set.side || null, label: 'Side View', inColor: inColor('side') },
            { src: set.interior || null, label: 'Interior', inColor: true },
            { src: set.back || null, label: 'Rear View', inColor: inColor('back') }
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
            /* only name the paint colour when the photo is actually in it */
            let caption = slide.inColor
                ? selectedColor.name + ' \u2013 ' + slide.label
                : slide.label + ' (other colour)';

            galleryFrame.innerHTML =
                '<span class="brand-tag">' + car.brand + '</span>' +
                heartMarkup +
                '<img src="' + slide.src + '" alt="' + car.name + ' - ' + caption + '">' +
                '<span class="gallery-caption">' + caption + '</span>';
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
            { label: 'Power', value: selectedVariant.power + ' hp' },
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
            titleEl.textContent = 'About the ' + car.name;
        }

        textEl.textContent = car.description;
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
            'Power: ' + selectedVariant.power + ' hp / Torque: ' + selectedVariant.torque + ' Nm'
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
                : { icon: 'I', name: 'Individual', text: 'Steering, suspension and throttle response set separately to suit the driver.' }
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

        /* only items every modern car on the site has; anything more
           specific must come from the car's own feature list */
        let safetyItems = [
            'Driver and passenger airbags',
            'ABS with electronic brake-force distribution',
            'Electronic stability and traction control'
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

        /* AUTOVERSE is a showcase, not a dealer, so these cards point the
           visitor to the right people instead of promising services */
        let cards = [
            { title: 'Warranty', text: 'Warranty terms for the ' + car.name + ' are set by ' + car.brand + ' and vary by market. Confirm them with an authorised dealer.' },
            { title: 'Servicing', text: 'Service intervals and maintenance packages are offered by ' + car.brand + ' dealers, not by AUTOVERSE.' },
            { title: 'Your Enquiries', text: 'Enquiries and test-drive requests you make here are saved in My Garage on this browser.' }
        ];

        grid.innerHTML = cards.map(function (card) {
            return '<div class="ownership-card"><h3>' + card.title + '</h3><p>' + card.text + '</p></div>';
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

        const columns = ['Variant', 'Fuel', 'Power (hp)', 'Torque (Nm)', 'Top speed (km/h)', 'Price'];
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

            const labels = { engine: 'Engine', transmission: 'Transmission', seating: 'Seating', fuelType: 'Fuel type' };
            let rows = '';

            /* for...in walks over every key of the specs object */
            for (const key in car.specs) {
                rows += `<tr><td><b>${labels[key] || key}</b></td><td>${car.specs[key]}</td></tr>`;
            }

            win.document.write(
                `<html><head><title>${car.name} spec sheet</title></head><body>` +
                `<h1>${car.name}</h1><p>${selectedVariant.label} - ${formatCrorePrice(selectedVariant.priceCr)}</p>` +
                `<table border="1" cellpadding="6">${rows}</table></body></html>`
            );
            win.document.close();
        });
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
    renderFinalCta();
    renderSimilarCars();

    buildGalleryExtras();
    buildColorSquare();
    buildPrintButton();

    const extraHost = getExtraHost();
    buildVariantTable(extraHost);
}());
