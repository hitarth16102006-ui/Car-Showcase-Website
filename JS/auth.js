/* ================================================
   auth.js
   Shared, backend-free authentication helpers.
   Accounts and the logged-in user are kept in
   localStorage so the "Welcome, Name" state can be
   read on every page by navbar.js.
   ================================================ */

var AUTOVERSE_USERS_KEY = 'autoverseUsers';
var AUTOVERSE_CURRENT_USER_KEY = 'autoverseCurrentUser';

function getStoredUsers() {
    try {
        return JSON.parse(localStorage.getItem(AUTOVERSE_USERS_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveStoredUsers(users) {
    try {
        localStorage.setItem(AUTOVERSE_USERS_KEY, JSON.stringify(users));
    } catch (error) {
        return;
    }
}

function findUserByEmail(email) {
    var users = getStoredUsers();
    var normalized = email.trim().toLowerCase();

    for (var i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === normalized) {
            return users[i];
        }
    }

    return null;
}

function upsertUser(user) {
    var users = getStoredUsers();
    var normalized = user.email.trim().toLowerCase();
    var existingIndex = -1;

    for (var i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === normalized) {
            existingIndex = i;
            break;
        }
    }

    if (existingIndex === -1) {
        users.push(user);
    } else {
        users[existingIndex] = user;
    }

    saveStoredUsers(users);
}

function setCurrentUser(user) {
    try {
        localStorage.setItem(AUTOVERSE_CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
        return;
    }
}

function getCurrentUser() {
    try {
        var raw = localStorage.getItem(AUTOVERSE_CURRENT_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
}

function clearCurrentUser() {
    try {
        localStorage.removeItem(AUTOVERSE_CURRENT_USER_KEY);
    } catch (error) {
        return;
    }
}

/* Used at login time when someone signs in with an email that was
   never used to sign up on this browser before - we still want to
   greet them by a reasonable name instead of just their email. */
function deriveNameFromEmail(email) {
    var prefix = email.split('@')[0].replace(/[._-]+/g, ' ').trim();

    if (!prefix) {
        return 'Driver';
    }

    return prefix.replace(/\w\S*/g, function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}

/* ---------- Password show/hide toggle (login + signup) ---------- */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.password-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = btn.getAttribute('data-target');
            var input = document.getElementById(targetId);

            if (!input) {
                return;
            }

            var willShow = input.type === 'password';
            input.type = willShow ? 'text' : 'password';
            btn.setAttribute('aria-label', willShow ? 'Hide password' : 'Show password');
            btn.classList.toggle('active', willShow);
        });
    });

    /* ---------- Google sign-in / sign-up placeholder ---------- */
    document.querySelectorAll('#googleSignInBtn, #googleSignUpBtn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            alert('Google Sign-In will be available soon. For now, please continue with your email address.');
        });
    });

    /* ---------- Remember me: prefill email on the login page ---------- */
    var rememberedEmailKey = 'autoverseRememberedEmail';
    var loginEmailField = document.getElementById('loginEmail');
    var rememberMeBox = document.getElementById('rememberMe');

    if (loginEmailField && rememberMeBox) {
        try {
            var remembered = localStorage.getItem(rememberedEmailKey);

            if (remembered) {
                loginEmailField.value = remembered;
                rememberMeBox.checked = true;
            }
        } catch (error) {
            /* localStorage unavailable */
        }
    }
});

function rememberEmail(email, shouldRemember) {
    try {
        if (shouldRemember) {
            localStorage.setItem('autoverseRememberedEmail', email);
        } else {
            localStorage.removeItem('autoverseRememberedEmail');
        }
    } catch (error) {
        return;
    }
}

/* ---------- My Garage: enquiries + test drives (localStorage-backed) ---------- */
var AUTOVERSE_ENQUIRIES_KEY = 'autoverseEnquiries';
var AUTOVERSE_TEST_DRIVES_KEY = 'autoverseTestDrives';

function getEnquiryRecords() {
    try {
        return JSON.parse(localStorage.getItem(AUTOVERSE_ENQUIRIES_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveEnquiryRecord(record) {
    var records = getEnquiryRecords();
    records.unshift(record);

    try {
        localStorage.setItem(AUTOVERSE_ENQUIRIES_KEY, JSON.stringify(records));
    } catch (error) {
        return;
    }
}

function getTestDriveRecords() {
    try {
        return JSON.parse(localStorage.getItem(AUTOVERSE_TEST_DRIVES_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveTestDriveRecord(record) {
    var records = getTestDriveRecords();
    records.unshift(record);

    try {
        localStorage.setItem(AUTOVERSE_TEST_DRIVES_KEY, JSON.stringify(records));
    } catch (error) {
        return;
    }
}
