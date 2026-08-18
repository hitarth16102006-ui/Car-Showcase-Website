/* ================================================
   signup.js
   Handles the signup form: validates the passwords
   match, stores the account, logs the user in, and
   sends them home where they'll see a welcome
   message with their name.
   ================================================ */

(function () {
    var form = document.getElementById('signupForm') || document.querySelector('.auth-form');

    if (!form || typeof setCurrentUser === 'undefined') {
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var name = document.getElementById('signupName').value.trim();
        var email = document.getElementById('signupEmail').value.trim();
        var phone = document.getElementById('signupPhone') ? document.getElementById('signupPhone').value.trim() : '';
        var password = document.getElementById('signupPassword').value;
        var confirmPassword = document.getElementById('signupConfirmPassword').value;
        var agreeTerms = document.getElementById('agreeTerms');

        if (!name || !email || !password) {
            alert('Please fill in all fields.');
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

        try {
            sessionStorage.setItem('skipHomeLoader', 'true');
        } catch (error) {
            /* sessionStorage unavailable - the home loader will just play once more */
        }

        window.location.href = 'index.html';
    });
}());
