/* ================================================
   navbar.js
   Shared navbar interactions used on every page
   ================================================ */

(function () {
    var navbar = document.getElementById('navbar');
    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');
    var themeToggle = document.getElementById('themeToggle');
    var skipHomeLoaderKey = 'skipHomeLoader';

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
}());
