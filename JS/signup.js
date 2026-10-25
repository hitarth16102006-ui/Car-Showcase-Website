/* ================================================
   signup.js
   Handles the signup form: validates the passwords
   match, stores the account, logs the user in, and
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
       Note: input.value shows "C:\fakepath\photo.jpg". Browsers hide the real
       folder on purpose so a website cannot learn your user name or folders;
       JavaScript only gets the file name and the file itself (input.files). */
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
        photoName.textContent = `${file.name} (browser path: ${photoInput.value})`;
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
            alert('Please fill in all fields.');
            return;
        }

        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
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

        upsertUser({ name: name, email: email, phone: phone });
        setCurrentUser({ name: name, email: email });
        authLog('signup', email, name);

        try {
            sessionStorage.setItem('skipHomeLoader', 'true');
        } catch (error) {
            /* sessionStorage unavailable - the home loader will just play once more */
        }

        window.location.href = 'index.html';
    });
}());
