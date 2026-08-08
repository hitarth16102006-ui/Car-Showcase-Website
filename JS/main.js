/* ================================================
   main.js
   Small interactions used on the home page
   ================================================ */

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

