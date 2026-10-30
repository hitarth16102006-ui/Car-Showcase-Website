/* ================================================
   signup.js
   Handles the signup form: validates the fields,
   stores the account in localStorage (the password
   only as a SHA-256 hash), logs the user in, and
   sends them home where they'll see a welcome
   message with their name.

   Also adds three small helpers to the form:
     - a live password-strength message
     - a live "passwords match" message
     - an optional profile photo preview
   ================================================ */

(function () {
    const form = (document.forms && document.forms['signupForm']) || document.querySelector('.auth-form');

    if (!form || typeof setCurrentUser === 'undefined') {
        return;
    }

    function readField(id) {
        const field = (form.elements && form.elements[id]) || document.getElementById(id);
        return field ? field.value : '';
    }

    /* A small <p> placed after a field. createTextNode keeps the text safe. */
    function addHint(afterElement, className) {
        const hint = document.createElement('p');
        hint.className = className;
        hint.appendChild(document.createTextNode(''));
        afterElement.insertAdjacentElement('afterend', hint);
        return hint;
    }

    function setHint(hint, message) {
        hint.firstChild.nodeValue = message;
    }

    /* ---------- Live password strength + match messages (keyboard events) ---------- */
    const passwordField = document.getElementById('signupPassword');
    const confirmField = document.getElementById('signupConfirmPassword');

    if (passwordField) {
        const strengthHint = addHint(passwordField, 'password-strength');

        passwordField.addEventListener('keyup', () => {
            if (passwordField.value === '') {
                setHint(strengthHint, '');
                return;
            }

            const result = getPasswordStrength(passwordField.value);
            setHint(strengthHint, `Password strength: ${result.label}`);
        });
    }

    if (confirmField && passwordField) {
        const matchHint = addHint(confirmField, 'password-match');

        confirmField.addEventListener('keyup', () => {
            if (confirmField.value === '') {
                setHint(matchHint, '');
            } else if (confirmField.value === passwordField.value) {
                setHint(matchHint, 'Passwords match');
            } else {
                setHint(matchHint, 'Passwords do not match yet');
            }
        });
    }

    /* ---------- Profile photo preview (file input + FileReader) ---------- */
    /* The preview appears the moment a file is chosen - no extra button.
       The photo is only previewed; it is not uploaded or saved anywhere. */
    const submitButton = form.querySelector('[type="submit"]');
    const photoWrap = document.createElement('div');
    photoWrap.className = 'signup-photo';
    photoWrap.innerHTML =
        '<label for="signupPhoto">Profile photo (optional)</label>' +
        '<input type="file" id="signupPhoto" accept="image/*">' +
        '<img id="signupPhotoPreview" alt="Profile photo preview" width="96" height="96" style="display:none;border-radius:50%;object-fit:cover;">' +
        '<small id="signupPhotoName"></small>';

    if (submitButton && submitButton.parentNode) {
        submitButton.parentNode.insertBefore(photoWrap, submitButton);
    } else {
        form.appendChild(photoWrap);
    }

    const photoInput = document.getElementById('signupPhoto');
    const photoPreview = document.getElementById('signupPhotoPreview');
    const photoName = document.getElementById('signupPhotoName');

    photoInput.addEventListener('change', () => {
        const file = photoInput.files[0];

        if (!file) {
            photoPreview.style.display = 'none';
            photoName.textContent = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Please choose an image file.');
            photoInput.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            photoPreview.src = reader.result;
            photoPreview.style.display = 'block';
        };

        reader.readAsDataURL(file);
        photoName.textContent = file.name;
    });

    form.addEventListener('submit', event => {
        event.preventDefault();

        const name = readField('signupName').trim();
        const email = readField('signupEmail').trim();
        const phone = readField('signupPhone').trim();
        const password = readField('signupPassword');
        const confirmPassword = readField('signupConfirmPassword');
        const agreeTerms = document.getElementById('agreeTerms');

        if (!name || !email || !password) {
            alert('Please fill in your name, email address and password.');
            return;
        }

        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        /* optional field: only check it when something was typed */
        if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''))) {
            alert('Please enter a valid 10-digit mobile number, or leave the field empty.');
            return;
        }

        if (password.length < 8) {
            alert('Your password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        if (agreeTerms && !agreeTerms.checked) {
            alert('Please agree to the Terms & Conditions and Privacy Policy to continue.');
            return;
        }

        if (findUserByEmail(email)) {
            alert('An account with this email already exists on this browser. Please log in instead.');
            return;
        }

        hashPassword(password)
            .then(passwordHash => {
                upsertUser({ name: name, email: email, phone: phone, passwordHash: passwordHash });
                setCurrentUser({ name: name, email: email });
                authLog('signup', email, name);

                try {
                    sessionStorage.setItem('skipHomeLoader', 'true');
                } catch (error) {
                    /* sessionStorage unavailable - the home loader will just play once more */
                }

                window.location.href = 'index.html';
            })
            .catch(() => {
                alert('Signing up needs the site to be opened over https:// or from localhost.');
            });
    });
}());
