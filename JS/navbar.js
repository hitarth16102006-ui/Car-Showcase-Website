/* ================================================
   navbar.js
   Shared navbar interactions used on every page
   ================================================ */

(function () {
    var navbar = document.getElementById('navbar');
    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');
    var themeToggle = document.getElementById('themeToggle');
    var navButtons = document.querySelector('.nav-buttons');
    var skipHomeLoaderKey = 'skipHomeLoader';
    var currentUserKey = 'autoverseCurrentUser';

    /* ---------- Welcome, <name> ---------- */
    /* Shown on every page (including the homepage) once someone has
       logged in or signed up. Reads the same localStorage key that
       auth.js writes to, so it works without needing auth.js loaded
       on every page. */
    function getLoggedInUser() {
        try {
            var raw = localStorage.getItem(currentUserKey);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function renderAuthState() {
        if (!navButtons) {
            return;
        }

        var user = getLoggedInUser();
        var loginLink = navButtons.querySelector('.login-btn');
        var signupLink = navButtons.querySelector('.signup-btn');
        var existingWelcome = navButtons.querySelector('.nav-welcome');
        var existingLogout = navButtons.querySelector('.logout-btn');

        if (user) {
            if (loginLink) {
                loginLink.style.display = 'none';
            }

            if (signupLink) {
                signupLink.style.display = 'none';
            }

            if (!existingWelcome) {
                var welcome = document.createElement('a');
                welcome.href = 'garage.html';
                welcome.className = 'nav-welcome';
                welcome.innerHTML = 'Welcome, <strong>' + user.name + '</strong>';
                navButtons.insertBefore(welcome, navButtons.firstChild);
            }

            if (!existingLogout) {
                var logoutBtn = document.createElement('button');
                logoutBtn.type = 'button';
                logoutBtn.className = 'login-btn logout-btn';
                logoutBtn.textContent = 'Logout';

                logoutBtn.addEventListener('click', function () {
                    try {
                        localStorage.removeItem(currentUserKey);
                    } catch (error) {
                        return;
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

            if (existingLogout) {
                existingLogout.remove();
            }
        }
    }

    renderAuthState();

    /* ---------- Footer "Explore" brand list (every page) ---------- */
    /* navbar.js loads on every page, unlike main.js, so the footer's
       full brand list - including new brands like Tesla, Rolls-Royce
       and Range Rover - now shows up everywhere, not just the home page. */
    if (typeof CARS !== 'undefined' && typeof getAllBrands === 'function') {
        var footerExploreList = document.getElementById('footerExploreList');

        if (footerExploreList) {
            var brands = getAllBrands();

            footerExploreList.innerHTML = brands.map(function (brand) {
                return '<li><a href="cars.html?brand=' + encodeURIComponent(brand) + '">' + brand + '</a></li>';
            }).join('');
        }
    }

    function getPageName(pathname) {
        var parts = pathname.replace(/\\/g, '/').split('/');
        return (parts.pop() || '').toLowerCase();
    }

    function isHomePage() {
        var pageName = getPageName(window.location.pathname);
        return pageName === '' || pageName === 'index.html';
    }

    function isHomeLink(link) {
        var href = link.getAttribute('href');

        if (!href) {
            return false;
        }

        try {
            var url = new URL(href, window.location.href);

            if (url.origin !== window.location.origin) {
                return false;
            }

            var pageName = getPageName(url.pathname);
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
        function updateNavbarState() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        updateNavbarState();
        window.addEventListener('scroll', updateNavbarState);
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            var isOpen = navLinks.classList.toggle('open');

            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

            if (navbar) {
                navbar.classList.toggle('menu-open', isOpen);
            }
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                closeMobileMenu();
            });
        });
    }

    document.querySelectorAll('a[href]').forEach(function (link) {
        link.addEventListener('click', function (event) {
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
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-theme');
        }

        setThemeIcon();

        themeToggle.addEventListener('click', function () {
            document.body.classList.toggle('light-theme');

            if (document.body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }

            setThemeIcon();
        });
    }
    /* ---------- Scroll-reveal animations (every page) ---------- */
    /* Fades + lifts cards into place as they enter the viewport.
       navbar.js runs on every page, so this covers the whole site
       without needing main.js everywhere. */
    (function () {
        var revealSelectors = [
            '.feature-card', '.brand-card', '.stat-box', '.testimonial-card',
            '.team-card', '.mission-box', '.car-card', '.spec-item',
            '.performance-item', '.features-list li', '.contact-form',
            '.contact-info', '.auth-card', '.details-gallery', '.car-info',
            '.ownership-card', '.review-card', '.drive-mode-card',
            '.split-list-item', '.concierge-card', '.showroom-card',
            '.faq-item', '.manifesto-block', '.timeline li',
            '.manifesto-tags span', '.enquiry-option', '.about-image-block'
        ];

        var revealTargets = document.querySelectorAll(revealSelectors.join(','));

        if (!revealTargets.length) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
            revealTargets.forEach(function (el) { el.classList.add('in-view'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(function (el, index) {
            el.classList.add('reveal');
            el.style.transitionDelay = (index % 6) * 0.06 + 's';
            observer.observe(el);
        });
    }());

    /* ---------- Animated stat counters (any [data-count] element) ---------- */
    (function () {
        var counters = document.querySelectorAll('[data-count]');

        if (!counters.length || !('IntersectionObserver' in window)) {
            return;
        }

        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-count'), 10) || 0;
            var duration = 1200;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) {
                    startTime = timestamp;
                }

                var progress = Math.min((timestamp - startTime) / duration, 1);
                el.textContent = Math.floor(progress * target) + (progress >= 1 ? '+' : '');

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            requestAnimationFrame(step);
        }

        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(function (el) { counterObserver.observe(el); });
    }());
}());
