/* ================================================
   contact.js
   Powers the AUTOVERSE Contact / Enquiry page:
   - Fills "Vehicle of Interest" from CARS
   - Auto-selects + auto-checks "Book a Test Drive"
     when arriving via ?car=<id> from a car's
     "Book a Test Drive" button
   - Shows/hides the Test Drive Preferences block
     based on the selected enquiry type
   - Handles form submit with a friendly confirmation
   ================================================ */

(function () {
    var form = document.getElementById('contactForm');
    var vehicleSelect = document.getElementById('vehicleOfInterest');
    var enquiryRadios = document.querySelectorAll('input[name="enquiryType"]');
    var testDriveBlock = document.getElementById('testDriveBlock');
    var testDriveRadio = document.getElementById('enquiryTestDrive');

    /* ---------- Vehicle of Interest dropdown ---------- */
    if (vehicleSelect && typeof CARS !== 'undefined') {
        var otherOption = vehicleSelect.querySelector('option[value="Other"]');

        CARS.forEach(function (car) {
            var option = document.createElement('option');
            option.value = car.id;
            option.textContent = car.brand + ' ' + car.name.replace(car.brand, '').trim();
            vehicleSelect.insertBefore(option, otherOption);
        });
    }

    /* ---------- Auto-populate from "Book a Test Drive" links (?car=id) ---------- */
    var params = new URLSearchParams(window.location.search);
    var presetCarId = params.get('car');

    if (presetCarId && vehicleSelect) {
        var optionExists = Array.prototype.some.call(vehicleSelect.options, function (opt) {
            return opt.value === presetCarId;
        });

        if (optionExists) {
            vehicleSelect.value = presetCarId;
        }

        if (testDriveRadio) {
            testDriveRadio.checked = true;
        }
    }

    /* ---------- Show/hide Test Drive Preferences ---------- */
    function updateTestDriveVisibility() {
        if (!testDriveBlock) {
            return;
        }

        var selected = document.querySelector('input[name="enquiryType"]:checked');
        var isTestDrive = selected && selected.value === 'Book a Test Drive';

        testDriveBlock.hidden = !isTestDrive;
    }

    enquiryRadios.forEach(function (radio) {
        radio.addEventListener('change', updateTestDriveVisibility);
    });

    updateTestDriveVisibility();

    /* ---------- Submit ---------- */
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var name = document.getElementById('contactName').value.trim();

            if (!name) {
                alert('Please enter your full name.');
                return;
            }

            var enquiryType = document.querySelector('input[name="enquiryType"]:checked');
            var enquiryLabel = enquiryType ? enquiryType.value : 'General Enquiry';
            var vehicleSelectEl = document.getElementById('vehicleOfInterest');
            var vehicleId = vehicleSelectEl ? vehicleSelectEl.value : '';
            var vehicleCar = (vehicleId && typeof getCarById === 'function') ? getCarById(vehicleId) : null;
            var vehicleName = vehicleCar ? vehicleCar.name : (vehicleId === 'Other' ? 'Other' : 'Not specified');

            if (typeof saveEnquiryRecord === 'function') {
                saveEnquiryRecord({
                    vehicle: vehicleName,
                    type: enquiryLabel,
                    date: new Date().toISOString()
                });
            }

            if (enquiryLabel === 'Book a Test Drive' && typeof saveTestDriveRecord === 'function') {
                var dateField = document.getElementById('testDriveDate');
                var timeField = document.getElementById('testDriveTime');
                var locationField = document.getElementById('testDriveLocation');

                saveTestDriveRecord({
                    vehicle: vehicleName,
                    date: dateField && dateField.value ? dateField.value : 'To be confirmed',
                    time: timeField && timeField.value ? timeField.value : 'To be confirmed',
                    location: locationField && locationField.value ? locationField.value : 'To be confirmed',
                    status: 'Pending'
                });
            }

            alert('Thank you, ' + name + '! Your ' + enquiryLabel.replace('&amp;', '&') + ' has been sent. An AUTOVERSE specialist will reach out to you shortly.');
            form.reset();
            updateTestDriveVisibility();
        });
    }

    /* ---------- FAQ accordion (native <details>, just close siblings) ---------- */
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (!item.open) {
                return;
            }

            faqItems.forEach(function (other) {
                if (other !== item) {
                    other.open = false;
                }
            });
        });
    });

    /* ---------- FAQ progressive reveal (4 shown, +4 per click) ---------- */
    var faqMoreBtn = document.getElementById('faqMoreBtn');
    var faqRevealStep = 4;

    function revealMoreFaqs() {
        var hidden = document.querySelectorAll('.faq-item.faq-hidden');

        for (var i = 0; i < faqRevealStep && i < hidden.length; i++) {
            hidden[i].classList.remove('faq-hidden');
        }

        if (document.querySelectorAll('.faq-item.faq-hidden').length === 0 && faqMoreBtn) {
            faqMoreBtn.style.display = 'none';
        }
    }

    if (faqMoreBtn) {
        faqMoreBtn.addEventListener('click', revealMoreFaqs);
    }
}());
