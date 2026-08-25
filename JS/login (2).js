/* ================================================
   login.js
   Handles the login form. This site has no real
   backend, so we look up the email against
   accounts created via Signup on this browser; if
   none is found we still let the person in and use
   a friendly name derived from their email.
   ================================================ */

(function () {
    var form = document.getElementById('loginForm') || document.querySelector('.auth-form');

    if (!form || typeof setCurrentUser === 'undefined') {
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var email = document.getElementById('loginEmail').value.trim();
        var password = document.getElementById('loginPassword').value;
        var rememberMeBox = document.getElementById('rememberMe');

        if (!email || !password) {
            alert('Please enter your email and password.');
            return;
        }

        var existingUser = findUserByEmail(email);
        var name = existingUser ? existingUser.name : deriveNameFromEmail(email);

        setCurrentUser({ name: name, email: email });

        if (typeof rememberEmail === 'function' && rememberMeBox) {
            rememberEmail(email, rememberMeBox.checked);
        }

        try {
            sessionStorage.setItem('skipHomeLoader', 'true');
        } catch (error) {
            /* sessionStorage unavailable - the home loader will just play once more */
        }

        window.location.href = 'index.html';
    });
}());
