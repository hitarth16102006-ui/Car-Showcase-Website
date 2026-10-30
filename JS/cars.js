/* ================================================
   cars.js
   Renders the cars grid on cars.html from CARS
   (see cars-data.js) and powers the live search
   box, brand filter, price range, sort menu and
   the "Surprise me" button.
   ================================================ */

(function () {
    const grid = document.querySelector('.cars-grid');
    const searchInput = document.getElementById('carSearch');
    const brandFilter = document.getElementById('brandFilter');

    if (!grid || typeof CARS === 'undefined') {
        return;
    }

    let sortSelect = null;
    let minInput = null;
    let maxInput = null;
    let resultsCount = null;

    /* Fill the brand dropdown with every brand that actually exists in CARS,
       instead of a hardcoded list that can drift out of date. */
    function populateBrandFilter() {
        if (!brandFilter) {
            return;
        }

        brandFilter.innerHTML = '<option value="All">All Brands</option>';

        getAllBrands().forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandFilter.appendChild(option);
        });
    }

    /* Extra controls are built here so cars.html does not need to change:
       sort menu, min / max price (in crore), "Surprise me" and a results line. */
    function buildExtraControls() {
        const wrap = document.createElement('div');
        wrap.className = 'cars-extra-controls';
        wrap.innerHTML =
            '<select id="carSort" aria-label="Sort cars">' +
                '<option value="default">Sort: Featured</option>' +
                '<option value="price-asc">Price: Low to High</option>' +
                '<option value="price-desc">Price: High to Low</option>' +
                '<option value="name">Name: A to Z</option>' +
            '</select>' +
            '<input type="number" id="minPrice" min="0" step="0.1" placeholder="Min ₹ Cr" aria-label="Minimum price in crore">' +
            '<input type="number" id="maxPrice" min="0" step="0.1" placeholder="Max ₹ Cr" aria-label="Maximum price in crore">' +
            '<button type="button" id="surpriseBtn" class="btn">Surprise me</button>' +
            '<p id="resultsCount" class="results-count" aria-live="polite"></p>';

        grid.parentNode.insertBefore(wrap, grid);

        sortSelect = document.getElementById('carSort');
        minInput = document.getElementById('minPrice');
        maxInput = document.getElementById('maxPrice');
        resultsCount = document.getElementById('resultsCount');

        sortSelect.addEventListener('change', applyFilters);
        minInput.addEventListener('input', applyFilters);
        maxInput.addEventListener('input', applyFilters);

        document.getElementById('surpriseBtn').addEventListener('click', () => {
            const lucky = pickRandom(CARS);
            window.location.href = `car-details.html?id=${lucky.id}`;
        });
    }

    function carCardHTML(car, index) {
        const baseVariant = car.variants[0];
        const thumbnail = getDefaultThumbnail(car);
        const imageMarkup = thumbnail
            ? `<img src="${thumbnail}" alt="${car.name}">`
            : placeholderFrameHTML(car, 'Front View', '#e63946');
        const stripe = isEven(index) ? 'card-even' : 'card-odd';
        const category = getPriceCategory(baseVariant.priceCr);

        /* onmouseover / onmouseout written as inline attributes: a gentle
           one-second zoom on the photo while the pointer is over it. */
        return (
            `<article class="car-card ${stripe}" data-brand="${car.brand}" data-name="${car.name.toLowerCase()}">` +
                '<div class="car-img" ' +
                    'onmouseover="this.style.transition=\'transform 1s\'; this.style.transform=\'scale(1.02)\';" ' +
                    'onmouseout="this.style.transform=\'none\';">' +
                    `<span class="brand-tag">${car.brand}</span>` +
                    (typeof wishlistHeartHTML === 'function' ? wishlistHeartHTML(car.id) : '') +
                    imageMarkup +
                '</div>' +
                '<div class="car-details">' +
                    `<h2>${car.name}</h2>` +
                    `<p class="brand">Brand: ${car.brand}</p>` +
                    `<p class="price-category">${category}</p>` +
                    `<p class="price">${formatCrorePrice(baseVariant.priceCr)}</p>` +
                    '<div class="car-card-actions">' +
                        `<a href="car-details.html?id=${car.id}" class="details-btn">View Details</a>` +
                        (typeof compareButtonHTML === 'function' ? compareButtonHTML(car.id) : '') +
                    '</div>' +
                '</div>' +
            '</article>'
        );
    }

    function renderCars(list) {
        if (list.length === 0) {
            grid.innerHTML = '<p class="no-results">No cars match your search. Try a different name or brand.</p>';
        } else {
            grid.innerHTML = list.map(carCardHTML).join('');
        }

        if (resultsCount) {
            resultsCount.innerText = `Showing ${list.length} of ${CARS.length} cars`;
        }
    }

    /* Sort a COPY of the list according to the sort menu (switch...case). */
    function sortCars(list) {
        const sorted = [...list];
        const mode = sortSelect ? sortSelect.value : 'default';

        switch (mode) {
            case 'price-asc':
                sorted.sort((a, b) => a.variants[0].priceCr - b.variants[0].priceCr);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.variants[0].priceCr - a.variants[0].priceCr);
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        return sorted;
    }

    function readPriceRange() {
        /* parseFloat keeps decimals (0.5 Cr); parseInt would cut them off */
        let low = parseFloat(minInput ? minInput.value : '');
        let high = parseFloat(maxInput ? maxInput.value : '');

        if (isNaN(low)) {
            low = 0;
        }

        if (isNaN(high)) {
            high = Infinity;
        }

        /* Typed them the wrong way round? Swap without a third variable. */
        if (isFinite(high) && low > high) {
            low = low + high;
            high = low - high;
            low = low - high;
        }

        return { low: low, high: high };
    }

    function applyFilters() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const brand = brandFilter ? brandFilter.value : 'All';
        const range = readPriceRange();

        const filtered = CARS.filter(car => {
            const matchesQuery = query === '' ||
                car.name.toLowerCase().includes(query) ||
                car.brand.toLowerCase().includes(query);

            const matchesBrand = brand === 'All' || car.brand === brand;
            const matchesPrice = isInRange(car.variants[0].priceCr, range.low, range.high);

            return matchesQuery && matchesBrand && matchesPrice;
        });

        renderCars(sortCars(filtered));
    }

    populateBrandFilter();
    buildExtraControls();

    /* Pre-select a brand if we arrived via a "?brand=X" link (Popular
       Brands on the homepage, or footer brand links). */
    const presetBrand = new URLSearchParams(window.location.search).get('brand');

    if (presetBrand && brandFilter) {
        let optionIndex = 0;

        while (optionIndex < brandFilter.options.length) {
            if (brandFilter.options[optionIndex].value === presetBrand) {
                brandFilter.value = presetBrand;
                break;
            }

            optionIndex++;
        }
    }

    applyFilters();

    console.log(`cars.js: ${CARS.length} cars rendered`);
    logBrandSummary();

    if (searchInput) {
        /* 'input' fires on every change: typing, pasting, deleting */
        searchInput.addEventListener('input', applyFilters);

        /* Keyboard: Escape clears the box */
        searchInput.addEventListener('keyup', event => {
            if (event.key === 'Escape') {
                searchInput.value = '';
                applyFilters();
            }
        });

        searchInput.addEventListener('focus', () => searchInput.classList.add('focused'));
        searchInput.addEventListener('blur', () => searchInput.classList.remove('focused'));
    }

    if (brandFilter) {
        brandFilter.addEventListener('change', applyFilters);
    }
}());
