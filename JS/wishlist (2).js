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
        var raw = localStorage.getItem(AUTOVERSE_WISHLIST_KEY);
        return raw ? JSON.parse(raw) : [];
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
    return getWishlistIds().indexOf(carId) !== -1;
}

function toggleWishlist(carId) {
    var ids = getWishlistIds();
    var index = ids.indexOf(carId);

    if (index === -1) {
        ids.push(carId);
    } else {
        ids.splice(index, 1);
    }

    saveWishlistIds(ids);
    refreshWishlistUI();
    return ids.indexOf(carId) !== -1;
}

function wishlistHeartHTML(carId, extraClass) {
    var active = isCarWishlisted(carId) ? ' active' : '';
    var cls = extraClass ? ' ' + extraClass : '';
    return (
        '<button type="button" class="wishlist-heart' + active + cls + '" data-wishlist-id="' + carId + '" ' +
            'aria-label="Save to wishlist" aria-pressed="' + (active ? 'true' : 'false') + '" title="Save to wishlist">' +
            '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21s-7.5-4.6-10.2-9.2C.2 8.6 1.6 4.9 5 4.1c2.1-.5 4.1.4 5.4 2.1l1.6 2 1.6-2c1.3-1.7 3.3-2.6 5.4-2.1 3.4.8 4.8 4.5 3.2 7.7C19.5 16.4 12 21 12 21z"/></svg>' +
        '</button>'
    );
}

/* Any heart button on the page (car cards, details page, wishlist
   page) wires itself up here - one delegated listener so it works
   no matter when the markup was rendered. */
document.addEventListener('click', function (event) {
    var heart = event.target.closest ? event.target.closest('.wishlist-heart') : null;

    if (!heart) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    var carId = heart.getAttribute('data-wishlist-id');

    if (!carId) {
        return;
    }

    var nowActive = toggleWishlist(carId);

    document.querySelectorAll('.wishlist-heart[data-wishlist-id="' + carId + '"]').forEach(function (btn) {
        btn.classList.toggle('active', nowActive);
        btn.setAttribute('aria-pressed', nowActive ? 'true' : 'false');
    });

    heart.classList.add('wishlist-pop');
    setTimeout(function () { heart.classList.remove('wishlist-pop'); }, 260);
});

/* ---------- Nav badge (every page) ---------- */
function renderWishlistNavLink() {
    var navButtons = document.querySelector('.nav-buttons');

    if (!navButtons || document.getElementById('navWishlistLink')) {
        updateWishlistBadge();
        return;
    }

    var link = document.createElement('a');
    link.href = 'wishlist.html';
    link.id = 'navWishlistLink';
    link.className = 'wishlist-nav-link';
    link.setAttribute('aria-label', 'View wishlist');
    link.innerHTML =
        '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 21s-7.5-4.6-10.2-9.2C.2 8.6 1.6 4.9 5 4.1c2.1-.5 4.1.4 5.4 2.1l1.6 2 1.6-2c1.3-1.7 3.3-2.6 5.4-2.1 3.4.8 4.8 4.5 3.2 7.7C19.5 16.4 12 21 12 21z"/></svg>' +
        '<span class="wishlist-nav-label">Wishlist</span>' +
        '<span class="wishlist-nav-count" id="navWishlistCount">0</span>';

    var themeToggle = navButtons.querySelector('.theme-toggle');

    if (themeToggle) {
        navButtons.insertBefore(link, themeToggle);
    } else {
        navButtons.appendChild(link);
    }

    updateWishlistBadge();
}

function updateWishlistBadge() {
    var count = getWishlistIds().length;
    var badge = document.getElementById('navWishlistCount');

    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
}

/* ---------- Footer "Wishlist" column (every page) ---------- */
function renderFooterWishlistColumn() {
    var footerContent = document.querySelector('.footer-content');
    var existingList = document.getElementById('footerWishlistList');

    if (!footerContent) {
        return;
    }

    var list = existingList;

    if (!list) {
        var column = document.createElement('div');
        column.className = 'footer-wishlist';
        column.innerHTML = '<h3>Wishlist</h3><ul id="footerWishlistList"></ul>';

        var contactColumn = footerContent.querySelector('.footer-contact');

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

    var ids = getWishlistIds();

    if (ids.length === 0) {
        list.innerHTML = '<li class="footer-wishlist-empty">No cars saved yet</li>';
        return;
    }

    var items = ids.map(function (id) {
        var car = getCarById(id);

        if (!car) {
            return '';
        }

        return '<li><a href="car-details.html?id=' + car.id + '">' + car.name + '</a></li>';
    }).filter(Boolean);

    list.innerHTML = items.length
        ? items.join('')
        : '<li class="footer-wishlist-empty">No cars saved yet</li>';
}

function refreshWishlistUI() {
    updateWishlistBadge();
    renderFooterWishlistColumn();

    if (typeof renderWishlistPage === 'function') {
        renderWishlistPage();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderWishlistNavLink();
    renderFooterWishlistColumn();
});
