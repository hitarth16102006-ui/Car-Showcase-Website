/* ================================================
   cars.js
   Renders the cars grid on cars.html from CARS
   (see cars-data.js) and powers the live search
   box + brand filter dropdown.
   ================================================ */

(function () {
    var grid = document.querySelector('.cars-grid');
    var searchInput = document.getElementById('carSearch');
    var brandFilter = document.getElementById('brandFilter');

    if (!grid || typeof CARS === 'undefined') {
        return;
    }

    /* Fill the brand dropdown with every brand that actually exists in CARS,
       instead of a hardcoded list that can drift out of date. */
    function populateBrandFilter() {
        if (!brandFilter) {
            return;
        }

        var brands = [];

        CARS.forEach(function (car) {
            if (brands.indexOf(car.brand) === -1) {
                brands.push(car.brand);
            }
        });

        brands.sort();

        brandFilter.innerHTML = '<option value="All">All Brands</option>';

        brands.forEach(function (brand) {
            var option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandFilter.appendChild(option);
        });
    }

    function carCardHTML(car) {
        var baseVariant = car.variants[0];
        var thumbnail = getDefaultThumbnail(car);
        var imageMarkup = thumbnail
            ? '<img src="' + thumbnail + '" alt="' + car.name + '">'
            : placeholderFrameHTML(car, 'Front View', '#e63946');

        return (
            '<article class="car-card" data-brand="' + car.brand + '" data-name="' + car.name.toLowerCase() + '">' +
                '<div class="car-img">' +
                    '<span class="brand-tag">' + car.brand + '</span>' +
                    (typeof wishlistHeartHTML === 'function' ? wishlistHeartHTML(car.id) : '') +
                    imageMarkup +
                '</div>' +
                '<div class="car-details">' +
                    '<h2>' + car.name + '</h2>' +
                    '<p class="brand">Brand: ' + car.brand + '</p>' +
                    '<p class="price">' + formatCrorePrice(baseVariant.priceCr) + '</p>' +
                    '<a href="car-details.html?id=' + car.id + '" class="details-btn">View Details</a>' +
                '</div>' +
            '</article>'
        );
    }

    function renderCars(list) {
        if (list.length === 0) {
            grid.innerHTML = '<p class="no-results">No cars match your search. Try a different name or brand.</p>';
            return;
        }

        grid.innerHTML = list.map(carCardHTML).join('');
    }

    function applyFilters() {
        var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var brand = brandFilter ? brandFilter.value : 'All';

        var filtered = CARS.filter(function (car) {
            var matchesQuery = query === '' ||
                car.name.toLowerCase().indexOf(query) !== -1 ||
                car.brand.toLowerCase().indexOf(query) !== -1;

            var matchesBrand = brand === 'All' || car.brand === brand;

            return matchesQuery && matchesBrand;
        });

        renderCars(filtered);
    }

    populateBrandFilter();

    /* Pre-select a brand if we arrived via a "?brand=X" link (Popular
       Brands on the homepage, or footer brand links). */
    var presetBrand = new URLSearchParams(window.location.search).get('brand');

    if (presetBrand && brandFilter) {
        var optionExists = Array.prototype.some.call(brandFilter.options, function (opt) {
            return opt.value === presetBrand;
        });

        if (optionExists) {
            brandFilter.value = presetBrand;
        }
    }

    applyFilters();

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (brandFilter) {
        brandFilter.addEventListener('change', applyFilters);
    }
}());
