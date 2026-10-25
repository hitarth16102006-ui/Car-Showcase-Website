/* ================================================
   main.js
   Small interactions used on the home page
   ================================================ */

/* ============ FIRST PROGRAM + CONSOLE DEMO ============ */
/* console.log prints a message, console.table prints rows and columns.
   Open the browser console (F12, or Ctrl + Shift + J) to see them. */

console.log('Hello from AUTOVERSE!');

/* Prints 0 to 4 with a one-second gap between each number.
   `let i` gives every loop round its own copy of i, so each timer
   remembers the right number. */
function printBootSequence() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => console.log(`AUTOVERSE start-up step ${i}`), i * 1000);
    }
}

/* Shows the letters of a word one at a time. Returns the timer ids so the
   caller could cancel them with clearTimeout(). */
function showLettersOneByOne(element, word, delay) {
    const timers = [];

    element.textContent = '';
    element.setAttribute('aria-label', word);

    for (let i = 0; i < word.length; i++) {
        timers.push(setTimeout(() => {
            element.textContent += word[i];
        }, (i + 1) * delay));
    }

    return timers;
}

/* Greeting by hour of the day: an if...else if...else ladder */
function getGreeting(hour) {
    if (hour < 12) {
        return 'Good morning';
    } else if (hour < 17) {
        return 'Good afternoon';
    } else if (hour < 21) {
        return 'Good evening';
    } else {
        return 'Good night';
    }
}

if (typeof CARS !== 'undefined') {
    const swap = { first: 'AUTO', second: 'VERSE' };

    /* swap two values without a third variable (destructuring) */
    let first = swap.first;
    let second = swap.second;
    [first, second] = [second, first];

    console.log(`Brand name, swapped: ${first} ${second}`);
    console.table(getBrandSummary().slice(0, 5));
    printBootSequence();
}

/* ============ BRAND STRIP / POPULAR BRANDS ============ */
/* Home-page-only sections. The footer's brand list is handled in
   navbar.js instead, since navbar.js loads on every page. */

(function () {
    if (typeof CARS === 'undefined') {
        return;
    }

    const brands = getAllBrands();

    /* ---- Moving brand strip (two identical groups for a seamless loop) ---- */
    const brandGroupA = document.getElementById('brandGroupA');
    const brandGroupB = document.getElementById('brandGroupB');

    if (brandGroupA && brandGroupB) {
        const stripHTML = brands
            .map(brand => `<span>${brand.toUpperCase()}</span><b>&bull;</b>`)
            .join('');

        brandGroupA.innerHTML = stripHTML;
        brandGroupB.innerHTML = stripHTML;
    }

    /* ---- Popular Brands grid - clicking a brand filters the Cars page ---- */
    const brandsGrid = document.getElementById('brandsGrid');

    if (brandsGrid) {
        brandsGrid.innerHTML = brands
            .map(brand => `<a class="brand-card" href="cars.html?brand=${encodeURIComponent(brand)}"><h3>${brand}</h3></a>`)
            .join('');
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

    document.querySelectorAll('.featured-cars .car-card').forEach(card => {
        const link = card.querySelector('.car-btn, .details-btn');
        const imgWrap = card.querySelector('.car-img');

        if (!link || !imgWrap) {
            return;
        }

        const match = link.getAttribute('href').match(/[?&]id=([^&]+)/);

        if (!match) {
            return;
        }

        imgWrap.insertAdjacentHTML('afterbegin', wishlistHeartHTML(match[1]));

        if (typeof compareButtonHTML === 'function') {
            const actionsWrap = document.createElement('div');
            actionsWrap.className = 'car-card-actions';
            link.insertAdjacentElement('afterend', actionsWrap);
            actionsWrap.appendChild(link);
            actionsWrap.insertAdjacentHTML('beforeend', compareButtonHTML(match[1]));
        }
    });
}());

/* ============ TESTIMONIALS CAROUSEL ============ */
/* 15 reviews, shown 3 at a time, with < > arrows and dot indicators.
   It starts on a random page, turns pages by itself every 8 seconds,
   pauses while the mouse is over it, and answers the left / right
   arrow keys. */

(function () {
    const grid = document.getElementById('testimonialsGrid');
    const dotsWrap = document.getElementById('testimonialDots');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');

    if (!grid) {
        return;
    }

    const reviews = [
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

    const reviewsPerPage = 3;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const autoPlayDelay = 8000;
    let currentPage = Math.floor(Math.random() * totalPages);
    let autoTimer = null;

    function renderPage() {
        const start = currentPage * reviewsPerPage;
        const pageReviews = reviews.slice(start, start + reviewsPerPage);

        grid.innerHTML = pageReviews.map(review => (
            '<article class="testimonial-card">' +
                `<div class="testimonial-img">${review.initials}</div>` +
                `<h3>${review.name}</h3>` +
                '<p class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</p>' +
                `<p class="testimonial-text">${review.text}</p>` +
            '</article>'
        )).join('');

        if (dotsWrap) {
            dotsWrap.innerHTML = '';

            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'testimonial-dot' + (i === currentPage ? ' active' : '');
                dot.setAttribute('aria-label', `Show reviews page ${i + 1}`);

                dot.addEventListener('click', () => {
                    currentPage = i;
                    renderPage();
                });

                dotsWrap.appendChild(dot);
            }
        }
    }

    function goToPage(delta) {
        currentPage = (currentPage + delta + totalPages) % totalPages;
        renderPage();
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoTimer = setInterval(() => goToPage(1), autoPlayDelay);
    }

    function stopAutoPlay() {
        clearInterval(autoTimer);
        autoTimer = null;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToPage(-1));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToPage(1));
    }

    grid.setAttribute('tabindex', '0');
    grid.addEventListener('mouseover', stopAutoPlay);
    grid.addEventListener('mouseout', startAutoPlay);
    grid.addEventListener('focus', stopAutoPlay);
    grid.addEventListener('blur', startAutoPlay);

    grid.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            goToPage(-1);
        } else if (event.key === 'ArrowRight') {
            goToPage(1);
        }
    });

    renderPage();
    startAutoPlay();
}());

/* ============ PERSONALIZED HERO GREETING ============ */
/* If someone is logged in, greet them by name in the hero tagline.
   A second line shows the greeting for the time of day and today's date. */

(function () {
    const heroSmall = document.querySelector('.hero-small');

    if (!heroSmall) {
        return;
    }

    try {
        const raw = localStorage.getItem('autoverseCurrentUser');
        const user = raw ? JSON.parse(raw) : null;

        if (user && user.name) {
            /* letters appear one by one, 45 ms apart */
            showLettersOneByOne(heroSmall, `WELCOME BACK, ${user.name.toUpperCase()}!`, 45);
        }
    } catch (error) {
        /* localStorage unavailable - keep the default tagline */
    }

    const now = new Date();
    const dateLine = document.createElement('p');
    dateLine.className = 'hero-date';
    dateLine.innerText = `${getGreeting(now.getHours())} · ${typeof formatDateLong === 'function' ? formatDateLong(now) : now.toDateString()}`;
    heroSmall.insertAdjacentElement('afterend', dateLine);
}());

/* ============ PROMO STRIP: marquee, countdown and clock ============ */
/* Built here so index.html does not need to change. Sits above the
   Featured Cars section. */

(function () {
    const featured = document.querySelector('.featured-cars');

    if (!featured || typeof CARS === 'undefined') {
        return;
    }

    const prices = CARS.map(car => car.variants[0].priceCr);
    const average = prices.reduce((total, price) => total + price, 0) / prices.length;
    const cheapest = Math.min(...prices);

    const strip = document.createElement('div');
    strip.className = 'promo-strip';
    strip.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:10px 20px;background:#111;color:#f5c542;font-size:14px;';

    /* <marquee> is old HTML, but browsers still scroll it */
    const marquee = document.createElement('marquee');
    marquee.setAttribute('behavior', 'scroll');
    marquee.setAttribute('direction', 'left');
    marquee.setAttribute('scrollamount', '6');
    marquee.style.flex = '1 1 320px';
    marquee.appendChild(document.createTextNode(
        `${CARS.length} cars • ${getAllBrands().length} brands • starting at ${formatCrorePrice(cheapest)} • average ${formatCrorePrice(average)}`
    ));

    const tools = document.createElement('div');
    tools.className = 'promo-tools';
    tools.style.cssText = 'display:flex;align-items:center;gap:14px;';

    const countdown = document.createElement('span');
    countdown.id = 'offerCountdown';

    const clock = document.createElement('span');
    clock.id = 'liveClock';

    const clockToggle = document.createElement('button');
    clockToggle.type = 'button';
    clockToggle.className = 'btn clock-toggle';
    clockToggle.textContent = 'Stop clock';

    tools.appendChild(countdown);
    tools.appendChild(clock);
    tools.appendChild(clockToggle);
    strip.appendChild(marquee);
    strip.appendChild(tools);
    featured.parentNode.insertBefore(strip, featured);

    /* ---- Countdown: time left until midnight, updated every second ---- */
    const pad = number => String(number).padStart(2, '0');
    let countdownTimer = null;

    function updateCountdown() {
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const secondsLeft = Math.floor((end - new Date()) / 1000);

        if (secondsLeft <= 0) {
            countdown.innerText = 'Today’s offers have ended';
            clearInterval(countdownTimer);
            return;
        }

        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;

        countdown.innerText = `Offers end in ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);

    /* ---- Digital clock with a start / stop toggle button ---- */
    let clockTimer = null;

    function tickClock() {
        clock.innerText = new Date().toLocaleTimeString();
    }

    function startClock() {
        if (clockTimer !== null) {
            return;
        }

        tickClock();
        clockTimer = setInterval(tickClock, 1000);
        clockToggle.textContent = 'Stop clock';
    }

    function stopClock() {
        clearInterval(clockTimer);
        clockTimer = null;
        clockToggle.textContent = 'Start clock';
    }

    clockToggle.addEventListener('click', () => {
        if (clockTimer === null) {
            startClock();
        } else {
            stopClock();
        }
    });

    startClock();
}());

/* home page elements we need to work with */
var menu = document.getElementById('navLinks');
var allLinks = document.querySelectorAll('a');
var newsletterForm = document.getElementById('newsletterForm');
var newsletterEmail = document.getElementById('newsletterEmail');

/* ============ SMOOTH SCROLLING ============ */
/* when an anchor link is clicked, scroll slowly
   to that section instead of jumping instantly */

allLinks.forEach(link => {
    const href = link.getAttribute('href');

    // only handle links that point to a section on this page
    if (href && href.charAt(0) === '#') {
        link.addEventListener('click', event => {
            event.preventDefault();

            // find the section the link is pointing to
            const targetSection = document.querySelector(href);

            if (targetSection) {
                // section position minus the height of the fixed navbar
                const finalPosition = targetSection.getBoundingClientRect().top + window.scrollY - 70;
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
    newsletterForm.addEventListener('submit', event => {
        event.preventDefault();

        const email = newsletterEmail.value.trim();

        /* == (loose) is enough to test for an empty string here */
        if (email == '') {
            alert('Please enter your email address.');
            return;
        }

        /* the i flag makes the pattern ignore upper / lower case */
        if (!/^\S+@\S+\.\S+$/i.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        alert(`Thank you for subscribing, ${email}!`);
        newsletterEmail.value = '';
    });
}

/* ============ LOADING SCREEN ============ */

function hideLoader(loader) {
    loader.classList.add('hide');
    loader.setAttribute('aria-hidden', 'true');
}

function hideLoaderAfterAnimation(loader, loadingBar) {
    let hasHiddenLoader = false;

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
        const animations = loadingBar.getAnimations();

        if (animations.length > 0) {
            Promise.all(animations.map(animation => animation.finished.catch(() => null))).then(finishLoading);
            return;
        }
    }

    const loadingBarStyles = window.getComputedStyle(loadingBar);

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
