/* ================================================
   main.js
   Small interactions used on the home page
   ================================================ */

/* ============ BRAND STRIP / POPULAR BRANDS ============ */
/* Home-page-only sections. The footer's brand list is handled in
   navbar.js instead, since navbar.js loads on every page. */

(function () {
    if (typeof CARS === 'undefined') {
        return;
    }

    var brands = getAllBrands();

    /* ---- Moving brand strip (two identical groups for a seamless loop) ---- */
    var brandGroupA = document.getElementById('brandGroupA');
    var brandGroupB = document.getElementById('brandGroupB');

    if (brandGroupA && brandGroupB) {
        var stripHTML = brands.map(function (brand) {
            return '<span>' + brand.toUpperCase() + '</span><b>&bull;</b>';
        }).join('');

        brandGroupA.innerHTML = stripHTML;
        brandGroupB.innerHTML = stripHTML;
    }

    /* ---- Popular Brands grid - clicking a brand filters the Cars page ---- */
    var brandsGrid = document.getElementById('brandsGrid');

    if (brandsGrid) {
        brandsGrid.innerHTML = brands.map(function (brand) {
            return '<a class="brand-card" href="cars.html?brand=' + encodeURIComponent(brand) + '"><h3>' + brand + '</h3></a>';
        }).join('');
    }
}());

/* ============ WISHLIST HEARTS ON STATIC FEATURED CARDS ============ */
/* index.html's Featured Cars section is hand-written HTML, not
   rendered from CARS like cars.js/details.js do. We still want a
   heart on every card, so we read the car id straight out of the
   card's own "View Details" link (?id=...) and inject the same
   heart button wishlist.js uses everywhere else. */
(function () {
    if (typeof wishlistHeartHTML !== 'function') {
        return;
    }

    document.querySelectorAll('.featured-cars .car-card').forEach(function (card) {
        var link = card.querySelector('.car-btn, .details-btn');
        var imgWrap = card.querySelector('.car-img');

        if (!link || !imgWrap) {
            return;
        }

        var match = link.getAttribute('href').match(/[?&]id=([^&]+)/);

        if (!match) {
            return;
        }

        imgWrap.insertAdjacentHTML('afterbegin', wishlistHeartHTML(match[1]));
    });
}());

/* ============ TESTIMONIALS CAROUSEL ============ */
/* 15 reviews, shown 3 at a time, with < > arrows and dot indicators. */

(function () {
    var grid = document.getElementById('testimonialsGrid');
    var dotsWrap = document.getElementById('testimonialDots');
    var prevBtn = document.getElementById('testimonialPrev');
    var nextBtn = document.getElementById('testimonialNext');

    if (!grid) {
        return;
    }

    var reviews = [
        { initials: 'RS', name: 'Rahul Sharma', text: 'Bought my BMW M4 through Autoverse and the whole process was smooth and quick. The team was very professional.' },
        { initials: 'PP', name: 'Priya Patel', text: 'I was a little nervous about buying online but Autoverse made it easy. Got my Audi R8 at a great price.' },
        { initials: 'AM', name: 'Arjun Mehta', text: 'Verified dealers and honest prices. I saved a lot of money on my Porsche 911. Highly recommended to everyone.' },
        { initials: 'SK', name: 'Sanya Kapoor', text: 'The car details page made it so easy to compare petrol and hybrid variants side by side before I decided.' },
        { initials: 'VR', name: 'Vikram Rao', text: 'Picked up a Range Rover through Autoverse. The specification breakdown was more thorough than any dealership site.' },
        { initials: 'NJ', name: 'Neha Joshi', text: 'Loved browsing the Lamborghini and Ferrari listings. Felt like a proper showroom experience from my laptop.' },
        { initials: 'KG', name: 'Karan Gill', text: 'Customer support answered every question about my Tesla Model S Plaid within minutes. Excellent service.' },
        { initials: 'AD', name: 'Ananya Desai', text: 'The search and filter tools made finding the right Mercedes trim effortless. Would recommend to any first-time buyer.' },
        { initials: 'RM', name: 'Rohan Malhotra', text: 'Test drove the Aston Martin DB11 after finding it here. The listing details matched the real car exactly.' },
        { initials: 'ID', name: 'Ishaan Dutta', text: 'Great platform for comparing performance numbers across brands before making a big decision.' },
        { initials: 'MS', name: 'Meera Singh', text: 'The whole booking and enquiry process for my Jaguar F-Type was quick, transparent and stress-free.' },
        { initials: 'AT', name: 'Aditya Thakur', text: 'Appreciated how clearly diesel, petrol and hybrid options were laid out for the Range Rover I was eyeing.' },
        { initials: 'PB', name: 'Pooja Bhatia', text: 'Autoverse helped me shortlist between three SUVs in a single afternoon. Genuinely useful comparisons.' },
        { initials: 'HK', name: 'Harsh Kohli', text: 'Bought my Nissan GT-R here and the after-sales support team followed up multiple times to make sure I was happy.' },
        { initials: 'SC', name: 'Simran Chawla', text: 'Clean design, honest pricing and a huge range of brands. My go-to site whenever I am car shopping now.' }
    ];

    var reviewsPerPage = 3;
    var totalPages = Math.ceil(reviews.length / reviewsPerPage);
    var currentPage = 0;

    function renderPage() {
        var start = currentPage * reviewsPerPage;
        var pageReviews = reviews.slice(start, start + reviewsPerPage);

        grid.innerHTML = pageReviews.map(function (review) {
            return (
                '<article class="testimonial-card">' +
                    '<div class="testimonial-img">' + review.initials + '</div>' +
                    '<h3>' + review.name + '</h3>' +
                    '<p class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</p>' +
                    '<p class="testimonial-text">' + review.text + '</p>' +
                '</article>'
            );
        }).join('');

        if (dotsWrap) {
            dotsWrap.innerHTML = '';

            for (var i = 0; i < totalPages; i++) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'testimonial-dot' + (i === currentPage ? ' active' : '');
                dot.setAttribute('aria-label', 'Show reviews page ' + (i + 1));

                (function (pageIndex) {
                    dot.addEventListener('click', function () {
                        currentPage = pageIndex;
                        renderPage();
                    });
                }(i));

                dotsWrap.appendChild(dot);
            }
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            currentPage = (currentPage - 1 + totalPages) % totalPages;
            renderPage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            currentPage = (currentPage + 1) % totalPages;
            renderPage();
        });
    }

    renderPage();
}());

/* ============ PERSONALIZED HERO GREETING ============ */
/* If someone is logged in, greet them by name in the hero tagline */

(function () {
    var heroSmall = document.querySelector('.hero-small');

    if (!heroSmall) {
        return;
    }

    try {
        var raw = localStorage.getItem('autoverseCurrentUser');
        var user = raw ? JSON.parse(raw) : null;

        if (user && user.name) {
            heroSmall.textContent = 'WELCOME BACK, ' + user.name.toUpperCase() + '!';
        }
    } catch (error) {
        /* localStorage unavailable - keep the default tagline */
    }
}());

/* home page elements we need to work with */
var menu = document.getElementById('navLinks');
var allLinks = document.querySelectorAll('a');
var newsletterForm = document.getElementById('newsletterForm');
var newsletterEmail = document.getElementById('newsletterEmail');

/* ============ SMOOTH SCROLLING ============ */
/* when an anchor link is clicked, scroll slowly
   to that section instead of jumping instantly */

allLinks.forEach(function (link) {
    var href = link.getAttribute('href');

    // only handle links that point to a section on this page
    if (href && href.charAt(0) === '#') {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            // find the section the link is pointing to
            var targetSection = document.querySelector(href);

            if (targetSection) {
                // section position minus the height of the fixed navbar
                var finalPosition = targetSection.getBoundingClientRect().top + window.scrollY - 70;
                window.scrollTo({ top: finalPosition, behavior: 'smooth' });
            }

            // close the mobile menu after a link is clicked
            if (menu) {
                menu.classList.remove('open');
            }
        });
    }
});

/* ============ NEWSLETTER ============ */
/* show a simple message when the user subscribes */

if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var email = newsletterEmail.value;

        if (email === '') {
            alert('Please enter your email address.');
            return;
        }

        alert('Thank you for subscribing, ' + email + '!');
        newsletterEmail.value = '';
    });
}

/* ============ LOADING SCREEN ============ */

function hideLoader(loader) {
    loader.classList.add('hide');
    loader.setAttribute('aria-hidden', 'true');
}

function hideLoaderAfterAnimation(loader, loadingBar) {
    var hasHiddenLoader = false;

    function finishLoading() {
        if (hasHiddenLoader) {
            return;
        }

        hasHiddenLoader = true;
        hideLoader(loader);
    }

    if (!loadingBar) {
        finishLoading();
        return;
    }

    if (typeof loadingBar.getAnimations === 'function') {
        var animations = loadingBar.getAnimations();

        if (animations.length > 0) {
            Promise.all(animations.map(function (animation) {
                return animation.finished.catch(function () {
                    return null;
                });
            })).then(finishLoading);
            return;
        }
    }

    var loadingBarStyles = window.getComputedStyle(loadingBar);

    if (loadingBarStyles.animationName === 'none' || loadingBarStyles.animationDuration === '0s') {
        finishLoading();
        return;
    }

    loadingBar.addEventListener('animationend', finishLoading, { once: true });
}

var loader = document.getElementById('loader');
var loadingBar = document.querySelector('.loading-bar');
var shouldSkipHomeLoader = window.__skipHomeLoader === true || document.documentElement.classList.contains('skip-home-loader');

if (loader) {
    if (shouldSkipHomeLoader) {
        hideLoader(loader);
    } else {
        hideLoaderAfterAnimation(loader, loadingBar);
    }
}

