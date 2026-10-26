/* ================================================
   wishlist.js
   Backend-free wishlist ("heart a car") system.
   Saved car ids live in localStorage so the heart
   state, the nav badge count, and the footer
   Wishlist column all stay in sync across every
   page without a server.
   ================================================ */

var AUTOVERSE_WISHLIST_KEY = 'autoverseWishlist';

function getWishlistIds() {
    try {
        const raw = localStorage.getItem(AUTOVERSE_WISHLIST_KEY);
        const parsed = raw ? JSON.parse(raw) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveWishlistIds(ids) {
    try {
        localStorage.setItem(AUTOVERSE_WISHLIST_KEY, JSON.stringify(ids));
    } catch (error) {
        return;
    }
}

function isCarWishlisted(carId) {
    return getWishlistIds().includes(carId);
}

function toggleWishlist(carId) {
    const ids = getWishlistIds();
    const index = ids.indexOf(carId);

    if (index === -1) {
        ids.push(carId);
    } else {
        ids.splice(index, 1);
    }

    saveWishlistIds(ids);
    refreshWishlistUI();
    return ids.includes(carId);
}

function wishlistHeartHTML(carId, extraClass) {
    const active = isCarWishlisted(carId) ? ' active' : '';
    const cls = extraClass ? ' ' + extraClass : '';
    return (
        `<button type="button" class="wishlist-heart${active}${cls}" data-wishlist-id="${carId}" ` +
            `aria-label="Save to wishlist" aria-pressed="${active ? 'true' : 'false'}" title="Save to wishlist">` +
            '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21s-7.5-4.6-10.2-9.2C.2 8.6 1.6 4.9 5 4.1c2.1-.5 4.1.4 5.4 2.1l1.6 2 1.6-2c1.3-1.7 3.3-2.6 5.4-2.1 3.4.8 4.8 4.5 3.2 7.7C19.5 16.4 12 21 12 21z"/></svg>' +
        '</button>'
    );
}

/* Ask first, then empty the wishlist */
function clearWishlist() {
    if (!confirm('Remove every car from your wishlist?')) {
        return false;
    }

    saveWishlistIds([]);
    refreshWishlistUI();

    document.querySelectorAll('.wishlist-heart.active').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });

    return true;
}

/* Any heart button on the page (car cards, details page, wishlist
   page) wires itself up here - one delegated listener so it works
   no matter when the markup was rendered. */
document.addEventListener('click', event => {
    if (event.target.closest && event.target.closest('.wishlist-clear')) {
        event.preventDefault();
        clearWishlist();
        return;
    }

    const heart = event.target.closest ? event.target.closest('.wishlist-heart') : null;

    if (!heart) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    const carId = heart.getAttribute('data-wishlist-id');

    if (!carId) {
        return;
    }

    const nowActive = toggleWishlist(carId);

    document.querySelectorAll(`.wishlist-heart[data-wishlist-id="${carId}"]`).forEach(btn => {
        btn.classList.toggle('active', nowActive);
        btn.setAttribute('aria-pressed', nowActive ? 'true' : 'false');
    });

    /* Restart the little "pop" animation. If the heart is clicked again
       before the first timer fires, cancel that timer first. */
    heart.classList.add('wishlist-pop');
    clearTimeout(heart.popTimer);
    heart.popTimer = setTimeout(() => heart.classList.remove('wishlist-pop'), 260);
});

/* ---------- Nav badge (every page) ---------- */
function renderWishlistNavLink() {
    const navButtons = document.querySelector('.nav-buttons');

    if (!navButtons || document.getElementById('navWishlistLink')) {
        updateWishlistBadge();
        return;
    }

    const link = document.createElement('a');
    link.href = 'wishlist.html';
    link.id = 'navWishlistLink';
    link.className = 'wishlist-nav-link';
    link.setAttribute('aria-label', 'View wishlist');
    link.innerHTML =
        '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 21s-7.5-4.6-10.2-9.2C.2 8.6 1.6 4.9 5 4.1c2.1-.5 4.1.4 5.4 2.1l1.6 2 1.6-2c1.3-1.7 3.3-2.6 5.4-2.1 3.4.8 4.8 4.5 3.2 7.7C19.5 16.4 12 21 12 21z"/></svg>' +
        '<span class="wishlist-nav-label">Wishlist</span>' +
        '<span class="wishlist-nav-count" id="navWishlistCount">0</span>';

    const themeToggle = navButtons.querySelector('.theme-toggle');

    if (themeToggle) {
        navButtons.insertBefore(link, themeToggle);
    } else {
        navButtons.appendChild(link);
    }

    updateWishlistBadge();
}

function updateWishlistBadge() {
    const count = getWishlistIds().length;
    const badge = document.getElementById('navWishlistCount');

    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
}

/* ---------- Footer "Wishlist" column (every page) ---------- */
function renderFooterWishlistColumn() {
    const footerContent = document.querySelector('.footer-content');
    const existingList = document.getElementById('footerWishlistList');

    if (!footerContent) {
        return;
    }

    let list = existingList;

    if (!list) {
        const column = document.createElement('div');
        column.className = 'footer-wishlist';
        column.innerHTML = '<h3>Wishlist</h3><ul id="footerWishlistList"></ul>';

        const contactColumn = footerContent.querySelector('.footer-contact');

        if (contactColumn) {
            footerContent.insertBefore(column, contactColumn);
        } else {
            footerContent.appendChild(column);
        }

        list = column.querySelector('#footerWishlistList');
    }

    if (typeof CARS === 'undefined') {
        return;
    }

    const ids = getWishlistIds();

    if (ids.length === 0) {
        list.innerHTML = '<li class="footer-wishlist-empty">No cars saved yet</li>';
        return;
    }

    const savedCars = ids.map(id => getCarById(id)).filter(Boolean);

    if (savedCars.length === 0) {
        list.innerHTML = '<li class="footer-wishlist-empty">No cars saved yet</li>';
        return;
    }

    const items = savedCars.map(car => `<li><a href="car-details.html?id=${car.id}">${car.name}</a></li>`);

    /* reduce(): add every saved car's starting price into one total */
    const totalCr = savedCars.reduce((total, car) => total + car.variants[0].priceCr, 0);

    items.push(`<li class="footer-wishlist-total">Total value: ${formatCrorePrice(totalCr)}</li>`);
    items.push('<li><button type="button" class="wishlist-clear">Clear all</button></li>');

    list.innerHTML = items.join('');
}

function refreshWishlistUI() {
    updateWishlistBadge();
    renderFooterWishlistColumn();

    if (typeof renderWishlistPage === 'function') {
        renderWishlistPage();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderWishlistNavLink();
    renderFooterWishlistColumn();
});

/* Test-only export shim - no-op in browsers, see cars-data.js for details. */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getWishlistIds: getWishlistIds,
        saveWishlistIds: saveWishlistIds,
        isCarWishlisted: isCarWishlisted,
        toggleWishlist: toggleWishlist,
        wishlistHeartHTML: wishlistHeartHTML,
        clearWishlist: clearWishlist
    };
}
