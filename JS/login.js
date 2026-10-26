/* ================================================
   login.js
   Handles the login form. This site has no real
   backend, so we check the email against:
     1. the demo accounts in users.json (a JSON file), and
     2. accounts created via Signup on this browser.
   If neither knows the email we still let the person
   in and use a friendly name derived from their email.
   ================================================ */

(function () {
    /* document.forms['loginForm'] finds the form by its name / id */
    const form = (document.forms && document.forms['loginForm']) || document.querySelector('.auth-form');

    if (!form || typeof setCurrentUser === 'undefined') {
        return;
    }

    /* Read a field through the form's own elements list first
       (form.elements.loginEmail), then fall back to its id. */
    function readField(id) {
        const field = (form.elements && form.elements[id]) || document.getElementById(id);
        return field ? field.value : '';
    }

    /* Looks for the email in the demo list with a while loop.
       Returns { status, name } where status is 'demo', 'wrong-password'
       or 'local' (not a demo account). */
    function checkCredentials(email, password, demoUsers) {
        let index = 0;

        while (index < demoUsers.length) {
            const demo = demoUsers[index];
            index++;

            /* != is loose "not equal" - both sides are lower-cased strings */
            if (demo.email.toLowerCase() != email.toLowerCase()) {
                continue;
            }

            return demo.password === password
                ? { status: 'demo', name: demo.name }
                : { status: 'wrong-password' };
        }

        return { status: 'local' };
    }

    function finishLogin(name, email, rememberMeBox) {
        setCurrentUser({ name: name, email: email, lastLogin: new Date().toISOString() });
        authLog('login', email);

        if (typeof rememberEmail === 'function' && rememberMeBox) {
            rememberEmail(email, rememberMeBox.checked);
        }

        try {
            sessionStorage.setItem('skipHomeLoader', 'true');
        } catch (error) {
            /* sessionStorage unavailable - the home loader will just play once more */
        }

        window.location.href = 'index.html';
    }

    /* Caps Lock warning: getModifierState('CapsLock') tells us whether it is on.
       The note stays in the layout and only its visibility changes. */
    const passwordField = document.getElementById('loginPassword');

    if (passwordField) {
        const capsNote = document.createElement('small');
        capsNote.className = 'caps-note';
        capsNote.appendChild(document.createTextNode('Caps Lock is on'));
        capsNote.style.visibility = 'hidden';
        passwordField.insertAdjacentElement('afterend', capsNote);

        /* Check on every key press AND release, and when the field is
           clicked or focused. (Some browsers only send keydown when Caps
           Lock is switched on, others only keyup when it is switched off,
           so listening to one event alone works just once.) */
        const updateCapsNote = event => {
            if (typeof event.getModifierState !== 'function') {
                return;
            }

            const capsOn = event.getModifierState('CapsLock');
            capsNote.style.visibility = capsOn ? 'visible' : 'hidden';
        };

        ['keydown', 'keyup', 'mousedown', 'focus'].forEach(name => {
            passwordField.addEventListener(name, updateCapsNote);
        });

        /* the Caps Lock key pressed anywhere on the page while the field
           is focused should also update the note */
        document.addEventListener('keydown', event => {
            if (document.activeElement === passwordField) {
                updateCapsNote(event);
            }
        });

        passwordField.addEventListener('blur', () => {
            capsNote.style.visibility = 'hidden';
        });
    }

    form.addEventListener('submit', event => {
        event.preventDefault();

        const email = readField('loginEmail').trim();
        const password = readField('loginPassword');
        const rememberMeBox = document.getElementById('rememberMe');

        if (!email || !password) {
            alert('Please enter your email and password.');
            return;
        }

        if (typeof isValidEmail === 'function' && !isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        loadDemoUsers().then(demoUsers => {
            const outcome = checkCredentials(email, password, demoUsers);
            let name;

            switch (outcome.status) {
                case 'wrong-password':
                    alert('Incorrect password for this account. Please try again.');
                    return;
                case 'demo':
                    name = outcome.name;
                    break;
                default: {
                    const existingUser = findUserByEmail(email);
                    name = existingUser ? existingUser.name : deriveNameFromEmail(email);
                }
            }

            finishLogin(name, email, rememberMeBox);
        });
    });
}());
