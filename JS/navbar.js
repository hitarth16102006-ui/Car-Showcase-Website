/* ================================================
   navbar.js
   Shared navbar interactions used on every page
   ================================================ */

/* ---------- Blob download helpers (top level so every page can use them) ---------- */

/* Turns any JavaScript value into a downloadable .json file.
   A Blob is an in-memory, file-like chunk of data; createObjectURL gives it
   a temporary blob: address the <a download> link can point to. The browser
   asks where to save it - JavaScript cannot silently write to your disk. */
function downloadJSONFile(filename, data) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    /* free the temporary address a moment later */
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* Everything this browser has saved for the visitor, gathered with for...in */
function collectAccountData() {
    const keys = {
        currentUser: 'autoverseCurrentUser',
        wishlist: 'autoverseWishlist',
        compare: 'autoverseCompare',
        enquiries: 'autoverseEnquiries',
        testDrives: 'autoverseTestDrives'
    };
    const data = { exportedAt: new Date().toISOString() };

    for (const label in keys) {
        try {
            const raw = localStorage.getItem(keys[label]);
            data[label] = raw ? JSON.parse(raw) : null;
        } catch (error) {
            data[label] = null;
        }
    }

    return data;
}

(function () {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const themeToggle = document.getElementById('themeToggle');
    const navButtons = document.querySelector('.nav-buttons');
    const skipHomeLoaderKey = 'skipHomeLoader';
    const currentUserKey = 'autoverseCurrentUser';

    /* ---------- Welcome, <name> ---------- */
    /* Shown on every page (including the homepage) once someone has
       logged in or signed up. Reads the same localStorage key that
       auth.js writes to, so it works without needing auth.js loaded
       on every page. */
    function getLoggedInUser() {
        try {
            const raw = localStorage.getItem(currentUserKey);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function renderAuthState() {
        if (!navButtons) {
            return;
        }

        const user = getLoggedInUser();
        const loginLink = navButtons.querySelector('.login-btn');
        const signupLink = navButtons.querySelector('.signup-btn');
        const existingWelcome = navButtons.querySelector('.nav-welcome');
        const existingLogout = navButtons.querySelector('.logout-btn');
        const existingExport = navButtons.querySelector('.export-btn');

        if (user) {
            if (loginLink) {
                loginLink.style.display = 'none';
            }

            if (signupLink) {
                signupLink.style.display = 'none';
            }

            if (!existingWelcome) {
                const welcome = document.createElement('a');
                welcome.href = 'garage.html';
                welcome.className = 'nav-welcome';

                /* the name was typed by the visitor, so it goes in as text,
                   never as HTML */
                const nameEl = document.createElement('strong');
                nameEl.textContent = user.name;
                welcome.append('Welcome, ', nameEl);
                navButtons.insertBefore(welcome, navButtons.firstChild);
            }

            if (!existingExport) {
                const exportBtn = document.createElement('button');
                exportBtn.type = 'button';
                exportBtn.className = 'login-btn export-btn';
                exportBtn.textContent = 'Export data';
                exportBtn.title = 'Download your saved cars, enquiries and test drives as a JSON file';

                exportBtn.addEventListener('click', () => {
                    downloadJSONFile('autoverse-my-data.json', collectAccountData());
                });

                navButtons.insertBefore(exportBtn, themeToggle || null);
            }

            if (!existingLogout) {
                const logoutBtn = document.createElement('button');
                logoutBtn.type = 'button';
                logoutBtn.className = 'login-btn logout-btn';
                logoutBtn.textContent = 'Logout';

                logoutBtn.addEventListener('click', () => {
                    if (!confirm('Log out of AUTOVERSE?')) {
                        return;
                    }

                    try {
                        localStorage.removeItem(currentUserKey);
                    } catch (error) {
                        /* storage unavailable - still go home */
                    } finally {
                        window.location.href = 'index.html';
                    }
                });

                navButtons.insertBefore(logoutBtn, themeToggle || null);
            }
        } else {
            if (loginLink) {
                loginLink.style.display = '';
            }

            if (signupLink) {
                signupLink.style.display = '';
            }

            if (existingWelcome) {
                existingWelcome.remove();
            }

            if (existingExport) {
                existingExport.remove();
            }

            if (existingLogout) {
                existingLogout.remove();
            }
        }
    }

    /* Keep the buttons hidden until they are arranged, so the
       Login / Signup buttons never flash before "Welcome, name" appears.
       (visibility keeps the space reserved, display: none would not.) */
    if (navButtons) {
        navButtons.style.visibility = 'hidden';
    }

    try {
        renderAuthState();
    } finally {
        if (navButtons) {
            navButtons.style.visibility = 'visible';
        }
    }

    /* ---------- Footer "Explore" brand list (every page) ---------- */
    /* navbar.js loads on every page, unlike main.js, so the footer's
       full brand list (built from CARS) shows up everywhere, not just
       the home page. */
    if (typeof CARS !== 'undefined' && typeof getAllBrands === 'function') {
        const footerExploreList = document.getElementById('footerExploreList');

        if (footerExploreList) {
            footerExploreList.innerHTML = getAllBrands()
                .map(brand => `<li><a href="cars.html?brand=${encodeURIComponent(brand)}">${brand}</a></li>`)
                .join('');
        }
    }

    function getPageName(pathname) {
        const parts = pathname.replace(/\\/g, '/').split('/');
        return (parts.pop() || '').toLowerCase();
    }

    function isHomePage() {
        const pageName = getPageName(window.location.pathname);
        return pageName === '' || pageName === 'index.html';
    }

    function isHomeLink(link) {
        const href = link.getAttribute('href');

        if (!href) {
            return false;
        }

        try {
            const url = new URL(href, window.location.href);

            if (url.origin !== window.location.origin) {
                return false;
            }

            const pageName = getPageName(url.pathname);
            return pageName === '' || pageName === 'index.html';
        } catch (error) {
            return false;
        }
    }

    function rememberInternalHomeNavigation() {
        try {
            sessionStorage.setItem(skipHomeLoaderKey, 'true');
        } catch (error) {
            return;
        }
    }

    function closeMobileMenu() {
        if (!menuToggle || !navLinks) {
            return;
        }

        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');

        if (navbar) {
            navbar.classList.remove('menu-open');
        }
    }

    function setThemeIcon() {
        if (!themeToggle) {
            return;
        }

        themeToggle.innerHTML = document.body.classList.contains('light-theme') ? '&#9788;' : '&#9790;';
    }

    if (navbar) {
        const updateNavbarState = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        updateNavbarState();
        window.addEventListener('scroll', updateNavbarState);
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');

            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

            if (navbar) {
                navbar.classList.toggle('menu-open', isOpen);
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    /* ---------- Window + keyboard events ---------- */
    /* resize: a phone menu left open should close when the window becomes
       desktop-wide. The timeout waits until resizing stops (debounce). */
    let resizeTimer = null;

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        }, 150);
    });

    /* keydown: Escape closes the mobile menu */
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });

    /* load: fires once every image and style sheet has arrived */
    window.addEventListener('load', () => {
        document.documentElement.classList.add('page-loaded');
    });

    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', event => {
            if (!isHomeLink(link)) {
                return;
            }

            if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            if (isHomePage()) {
                event.preventDefault();
                closeMobileMenu();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            rememberInternalHomeNavigation();
        });
    });

    if (themeToggle) {
        try {
            if (localStorage.getItem('theme') === 'light') {
                document.body.classList.add('light-theme');
            }
        } catch (error) {
            /* localStorage unavailable - stay on the dark theme */
        }

        setThemeIcon();

        themeToggle.addEventListener('click', () => {
            /* a one-second colour fade between dark and light */
            document.body.style.transition = 'background-color 1s ease, color 1s ease';
            document.body.classList.toggle('light-theme');

            try {
                localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
            } catch (error) {
                /* ignore - the theme just will not be remembered */
            }

            setThemeIcon();
        });
    }

    /* ---------- Scroll-reveal animations (every page) ---------- */
    /* Fades + lifts cards into place as they enter the viewport.
       navbar.js runs on every page, so this covers the whole site
       without needing main.js everywhere. */
    (function () {
        const revealSelectors = [
            '.feature-card', '.brand-card', '.stat-box', '.testimonial-card',
            '.team-card', '.mission-box', '.car-card', '.spec-item',
            '.performance-item', '.features-list li', '.contact-form',
            '.contact-info', '.auth-card', '.details-gallery', '.car-info',
            '.ownership-card', '.review-card', '.drive-mode-card',
            '.split-list-item', '.concierge-card', '.showroom-card',
            '.faq-item', '.manifesto-block', '.timeline li',
            '.manifesto-tags span', '.enquiry-option', '.about-image-block'
        ];

        const revealTargets = document.querySelectorAll(revealSelectors.join(','));

        if (!revealTargets.length) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
            revealTargets.forEach(el => el.classList.add('in-view'));
            return;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach((el, index) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${(index % 6) * 0.06}s`;
            observer.observe(el);
        });
    }());

    /* ---------- Collection stats ([data-stat] elements) ---------- */
    /* The numbers on the home and about pages are counted from CARS, so
       they can never drift out of date when a car is added or removed. */
    if (typeof CARS !== 'undefined') {
        const fuelTypes = [];
        let variantCount = 0;

        CARS.forEach(car => {
            variantCount += car.variants.length;

            car.variants.forEach(variant => {
                if (!fuelTypes.includes(variant.fuelType)) {
                    fuelTypes.push(variant.fuelType);
                }
            });
        });

        const statValues = {
            cars: CARS.length,
            brands: getAllBrands().length,
            variants: variantCount,
            fuelTypes: fuelTypes.length
        };

        document.querySelectorAll('[data-stat]').forEach(el => {
            const value = statValues[el.getAttribute('data-stat')];

            if (value === undefined) {
                return;
            }

            /* animated counters read data-count; plain ones show the number */
            if (el.hasAttribute('data-count')) {
                el.setAttribute('data-count', value);
            } else {
                el.textContent = value;
            }
        });
    }

    /* ---------- Animated stat counters (any [data-count] element) ---------- */
    (function () {
        const counters = document.querySelectorAll('[data-count]');

        if (!counters.length || !('IntersectionObserver' in window)) {
            return;
        }

        function animateCounter(el) {
            const target = parseInt(el.getAttribute('data-count'), 10) || 0;
            const duration = 1200;
            let startTime = null;

            function step(timestamp) {
                if (!startTime) {
                    startTime = timestamp;
                }

                const progress = Math.min((timestamp - startTime) / duration, 1);
                /* exact counts, so no "+" on the end */
                el.textContent = Math.floor(progress * target);

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            requestAnimationFrame(step);
        }

        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(el => counterObserver.observe(el));
    }());
}());
