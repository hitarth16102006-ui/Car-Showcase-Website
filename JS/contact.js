/* ================================================
   contact.js
   Powers the AUTOVERSE Contact / Enquiry page:
   - Fills "Vehicle of Interest" from CARS
   - Auto-selects + auto-checks "Book a Test Drive"
     when arriving via ?car=<id> from a car's
     "Book a Test Drive" button
   - Shows/hides the Test Drive Preferences block
     based on the selected enquiry type
   - Test-drive date helpers (minimum date, "Use today")
   - Optional trade-in photo upload with previews
   - Handles form submit: validates the fields, saves
     the enquiry in this browser (it appears in My
     Garage) and shows its reference number
   ================================================ */

(function () {
    /* document.forms['contactForm'] finds the form by its name / id */
    const form = (document.forms && document.forms['contactForm']) || document.getElementById('contactForm');
    const vehicleSelect = document.getElementById('vehicleOfInterest');
    const enquiryRadios = document.querySelectorAll('input[name="enquiryType"]');
    const testDriveBlock = document.getElementById('testDriveBlock');
    const testDriveRadio = document.getElementById('enquiryTestDrive');
    const nameField = document.getElementById('contactName');

    /* ---------- Vehicle of Interest dropdown ---------- */
    if (vehicleSelect && typeof CARS !== 'undefined') {
        const otherOption = vehicleSelect.querySelector('option[value="Other"]');

        CARS.forEach(car => {
            const option = document.createElement('option');
            option.value = car.id;
            option.textContent = `${car.brand} ${car.name.replace(car.brand, '').trim()}`;
            vehicleSelect.insertBefore(option, otherOption);
        });
    }

    /* ---------- Auto-populate from "Book a Test Drive" links (?car=id) ---------- */
    const params = new URLSearchParams(window.location.search);
    const presetCarId = params.get('car');

    if (presetCarId && vehicleSelect) {
        const optionExists = Array.prototype.some.call(vehicleSelect.options, opt => opt.value === presetCarId);

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

        const selected = document.querySelector('input[name="enquiryType"]:checked');
        const isTestDrive = Boolean(selected) && selected.value === 'Book a Test Drive';

        testDriveBlock.hidden = !isTestDrive;
        /* '' hands control back to the style sheet, 'none' removes the block */
        testDriveBlock.style.display = isTestDrive ? '' : 'none';
    }

    enquiryRadios.forEach(radio => {
        radio.addEventListener('change', updateTestDriveVisibility);
    });

    updateTestDriveVisibility();

    /* ---------- Name field: tidy up when the user leaves it ---------- */
    if (nameField) {
        nameField.addEventListener('focus', () => nameField.classList.add('field-focused'));

        nameField.addEventListener('blur', () => {
            nameField.classList.remove('field-focused');

            if (typeof capitalizeWords === 'function') {
                nameField.value = capitalizeWords(nameField.value.trim());
            }
        });
    }

    /* ---------- Test drive date: minimum = today, plus a "Use today" button ---------- */
    function toISODate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${date.getFullYear()}-${month}-${day}`;
    }

    const testDriveDate = document.getElementById('testDriveDate');

    if (testDriveDate) {
        testDriveDate.min = toISODate(new Date());

        const todayBtn = document.createElement('button');
        todayBtn.type = 'button';
        todayBtn.className = 'btn use-today-btn';
        todayBtn.textContent = 'Use today';

        const todayLabel = document.createElement('small');
        todayLabel.className = 'use-today-label';

        testDriveDate.insertAdjacentElement('afterend', todayBtn);
        todayBtn.insertAdjacentElement('afterend', todayLabel);

        todayBtn.addEventListener('click', () => {
            const today = new Date();

            testDriveDate.value = toISODate(today);
            todayLabel.innerText = typeof formatDateLong === 'function' ? formatDateLong(today) : today.toDateString();
        });
    }

    /* ---------- Trade-in photos: choose several images, preview them all ---------- */
    let photoCount = 0;

    function buildPhotoUploader() {
        if (!form) {
            return;
        }

        const wrap = document.createElement('div');
        wrap.className = 'trade-in-photos';
        wrap.innerHTML =
            '<label for="tradeInPhotos">Trade-in photos (optional)</label>' +
            '<input type="file" id="tradeInPhotos" accept="image/*" multiple>' +
            '<small id="tradeInNote"></small>' +
            '<div id="tradeInPreview" class="trade-in-preview"></div>';

        const submitButton = form.querySelector('[type="submit"]');

        if (submitButton && submitButton.parentNode) {
            submitButton.parentNode.insertBefore(wrap, submitButton);
        } else {
            form.appendChild(wrap);
        }

        const input = document.getElementById('tradeInPhotos');
        const note = document.getElementById('tradeInNote');
        const preview = document.getElementById('tradeInPreview');

        /* The space for the preview strip is always reserved; it is only
           shown once at least one picture has been chosen. */
        preview.style.visibility = 'hidden';

        input.addEventListener('change', () => {
            preview.innerHTML = '';
            photoCount = 0;

            for (let i = 0; i < input.files.length; i++) {
                const file = input.files[i];

                if (!file.type.startsWith('image/')) {
                    continue;
                }

                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.alt = file.name;
                img.width = 110;
                img.addEventListener('load', () => URL.revokeObjectURL(img.src));
                preview.appendChild(img);
                photoCount++;
            }

            preview.style.visibility = photoCount > 0 ? 'visible' : 'hidden';

            /* ternary: a different message for 1 photo and several */
            if (photoCount === 0) {
                note.innerText = 'No image selected';
            } else {
                note.innerText = photoCount === 1 ? '1 photo selected' : `${photoCount} photos selected`;
            }
        });
    }

    buildPhotoUploader();

    /* ---------- Submit ---------- */
    if (form) {
        form.addEventListener('submit', event => {
            event.preventDefault();

            const name = (form.elements.contactName ? form.elements.contactName.value : '').trim();

            const phone = form.elements.phone ? form.elements.phone.value.replace(/[\s-]/g, '') : '';
            const pin = form.elements.pin ? form.elements.pin.value.trim() : '';

            if (!name) {
                alert('Please enter your full name.');
                return;
            }

            /* Indian mobile number: 10 digits starting 6-9, optional +91 or 0 */
            if (!/^(\+91|0)?[6-9]\d{9}$/.test(phone)) {
                alert('Please enter a valid 10-digit mobile number.');
                return;
            }

            /* PIN code is optional, but if given it must be 6 digits */
            if (pin && !/^\d{6}$/.test(pin)) {
                alert('Please enter a 6-digit PIN code, or leave the field empty.');
                return;
            }

            const enquiryType = document.querySelector('input[name="enquiryType"]:checked');
            const enquiryLabel = enquiryType ? enquiryType.value : 'General Enquiry';
            const vehicleSelectEl = document.getElementById('vehicleOfInterest');
            const vehicleId = vehicleSelectEl ? vehicleSelectEl.value : '';
            const vehicleCar = (vehicleId && typeof getCarById === 'function') ? getCarById(vehicleId) : null;

            /* == compares after type conversion; both sides are strings here */
            const vehicleName = vehicleCar ? vehicleCar.name : (vehicleId == 'Other' ? 'Other' : 'Not specified');

            const existingRefs = typeof getEnquiryRecords === 'function'
                ? getEnquiryRecords().map(record => record.ref).filter(Boolean)
                : [];
            const reference = typeof generateReferenceNumber === 'function'
                ? generateReferenceNumber(name, existingRefs)
                : `AV-${Date.now()}`;

            if (typeof saveEnquiryRecord === 'function') {
                saveEnquiryRecord({
                    vehicle: vehicleName,
                    type: enquiryLabel,
                    date: new Date().toISOString(),
                    ref: reference,
                    photos: photoCount
                });
            }

            if (enquiryLabel === 'Book a Test Drive' && typeof saveTestDriveRecord === 'function') {
                const dateField = document.getElementById('testDriveDate');
                const timeField = document.getElementById('testDriveTime');
                const locationField = document.getElementById('testDriveLocation');

                saveTestDriveRecord({
                    vehicle: vehicleName,
                    date: dateField && dateField.value ? dateField.value : 'To be confirmed',
                    time: timeField && timeField.value ? timeField.value : 'To be confirmed',
                    location: locationField && locationField.value ? locationField.value : 'To be confirmed',
                    status: 'Pending'
                });
            }

            /* Nothing is sent to a server: the enquiry is stored in localStorage
               and listed in My Garage. The message says exactly that. */
            alert(`Thank you, ${name}. Your enquiry (${enquiryLabel}) has been saved with reference ${reference}. ` +
                'You can find it in My Garage on this browser.');
            form.reset();
            updateTestDriveVisibility();

            const preview = document.getElementById('tradeInPreview');

            if (preview) {
                preview.innerHTML = '';
                preview.style.visibility = 'hidden';
            }

            photoCount = 0;
        });
    }

    /* ---------- FAQ accordion (native <details>, just close siblings) ---------- */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (!item.open) {
                return;
            }

            faqItems.forEach(other => {
                if (other !== item) {
                    other.open = false;
                }
            });
        });
    });

    /* ---------- FAQ progressive reveal (4 shown, +4 per click) ---------- */
    const faqMoreBtn = document.getElementById('faqMoreBtn');
    const faqRevealStep = 4;

    function revealMoreFaqs() {
        const hidden = document.querySelectorAll('.faq-item.faq-hidden');

        for (let i = 0; i < faqRevealStep && i < hidden.length; i++) {
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
