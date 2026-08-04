/* ================================================
   main.js
   Small interactions used on the home page
   ================================================ */

/* elements we need to work with */
var navbar = document.getElementById('navbar');
var menuToggle = document.getElementById('menuToggle');
var menu = document.getElementById('navLinks');
var allLinks = document.querySelectorAll('a');
var navLinks = document.querySelectorAll('.nav-links a');
var sections = document.querySelectorAll('main section');
var newsletterForm = document.getElementById('newsletterForm');
var newsletterEmail = document.getElementById('newsletterEmail');

/* ============ SMOOTH SCROLLING ============ */
/* when an anchor link is clicked, scroll slowly
   to that section instead of jumping instantly */

allLinks.forEach(function (link) {

    var href = link.getAttribute('href');

    // only handle links that point to a section on this page
    if (href.charAt(0) === '#') {

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
            menu.classList.remove('open');
        });
    }
});

/* ============ NAVBAR ACTIVE LINK ============ */
/* highlight the link of the section that is
   currently visible on the screen */

window.addEventListener('scroll', function () {

    var scrollPosition = window.scrollY;

    sections.forEach(function (section) {

        // if we have scrolled up to the section
        if (section.offsetTop - 90 <= scrollPosition) {

            var sectionId = section.getAttribute('id');

            navLinks.forEach(function (navLink) {

                navLink.classList.remove('active');

                if (navLink.getAttribute('href') === '#' + sectionId) {
                    navLink.classList.add('active');
                }
            });
        }
    });
});

/* ============ NAVBAR SHADOW ON SCROLL ============ */
/* add a small shadow to the navbar once the user
   scrolls a little bit down the page */

window.addEventListener('scroll', function () {

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/* ============ MOBILE MENU ============ */
/* open and close the navigation menu when the
   hamburger icon is clicked on mobile screens */

menuToggle.addEventListener('click', function () {
    menu.classList.toggle('open');
});

/* ============ NEWSLETTER ============ */
/* show a simple message when the user subscribes */

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

// ==========================
// Theme Toggle
// ==========================

const themeToggle = document.getElementById("themeToggle");

// Check saved theme
if(localStorage.getItem("theme") === "light"){

    document.body.classList.add("light-theme");
    themeToggle.innerHTML = "☀️";

}

themeToggle.addEventListener("click", function(){

    document.body.classList.toggle("light-theme");

    if(document.body.classList.contains("light-theme")){

        themeToggle.innerHTML = "☀️";

        localStorage.setItem("theme","light");

    }
    else{

        themeToggle.innerHTML = "🌙";

        localStorage.setItem("theme","dark");

    }

});

/*LOADING SCREEN*/

window.addEventListener("load", function(){

    setTimeout(function(){

        document.getElementById("loader").classList.add("hide");

    },2000);

});