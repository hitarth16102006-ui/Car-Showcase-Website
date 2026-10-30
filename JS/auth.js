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
        const parsed = JSON.parse(localStorage.getItem(AUTOVERSE_USERS_KEY));
        return Array.isArray(parsed) ? parsed : [];
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
    const users = getStoredUsers();
    const normalized = email.trim().toLowerCase();

    for (let i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === normalized) {
            return users[i];
        }
    }

    return null;
}

function upsertUser(user) {
    const users = getStoredUsers();
    const normalized = user.email.trim().toLowerCase();
    let existingIndex = -1;

    for (let i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === normalized) {
            existingIndex = i;
            break;
        }
    }

    /* == (loose equality) is fine here: both sides are numbers */
    if (existingIndex == -1) {
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
        const raw = localStorage.getItem(AUTOVERSE_CURRENT_USER_KEY);
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

/* Basic e-mail shape check. The `i` flag makes the pattern
   case-insensitive, so "ASHA@Mail.COM" passes too. */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email.trim());
}

/* Escapes the five HTML special characters so text typed by a visitor
   (a name, a test-drive location...) can be placed inside innerHTML
   without being run as markup. */
function escapeHTML(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/* SHA-256 hash of a password as a hex string, so signup never has to
   keep the password itself. crypto.subtle is asynchronous: it returns a
   Promise, so callers use .then(). It only exists on https://, localhost
   and file:// pages.
   This is still NOT real security - anyone with access to this browser
   can read localStorage. Real accounts need a server. */
function hashPassword(password) {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
        return Promise.reject(new Error('Password hashing needs a secure (https) page'));
    }

    const bytes = new TextEncoder().encode(password);

    return crypto.subtle.digest('SHA-256', bytes).then(buffer => {
        return Array.from(new Uint8Array(buffer))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    });
}

/* Scores a password from its character codes.
   65-90 = A-Z, 97-122 = a-z, 48-57 = 0-9, everything else = symbol. */
function getPasswordStrength(password) {
    let hasUpper = false;
    let hasLower = false;
    let hasDigit = false;
    let hasSymbol = false;

    for (let i = 0; i < password.length; i++) {
        const code = password.charCodeAt(i);

        if (code === 32) {
            continue;
        }

        if (code >= 65 && code <= 90) {
            hasUpper = true;
        } else if (code >= 97 && code <= 122) {
            hasLower = true;
        } else if (code >= 48 && code <= 57) {
            hasDigit = true;
        } else {
            hasSymbol = true;
        }
    }

    let score = 0;

    [hasUpper, hasLower, hasDigit, hasSymbol].forEach(flag => {
        if (flag) {
            score++;
        }
    });

    if (password.length >= 8) {
        score++;
    }

    let label;

    switch (score) {
        case 0:
        case 1:
            label = 'Weak';
            break;
        case 2:
            label = 'Fair';
            break;
        case 3:
            label = 'Good';
            break;
        default:
            label = 'Strong';
    }

    return { score: score, label: label };
}

/* Logs any number of values using the `arguments` object.
   Never pass passwords to this. */
function authLog() {
    const parts = [];

    for (let i = 0; i < arguments.length; i++) {
        parts.push(arguments[i]);
    }

    console.log(`[auth] (${arguments.length} values)`, parts.join(' | '));
}

/* Reads the demo accounts from JS/users.json. The path is relative to the
   HTML page, which lives in HTML/, hence ../JS/. fetch() needs the site to
   be served over http(s); if the file cannot be loaded we quietly fall
   back to an empty list. */
function loadDemoUsers() {
    if (typeof fetch !== 'function') {
        return Promise.resolve([]);
    }

    return fetch('../JS/users.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return response.json();
        })
        .then(data => (data && Array.isArray(data.users) ? data.users : []))
        .catch(() => []);
}

/* ---------- Password show/hide toggle (login + signup) ---------- */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);

            if (!input) {
                return;
            }

            const willShow = input.type === 'password';
            input.type = willShow ? 'text' : 'password';
            btn.setAttribute('aria-label', willShow ? 'Hide password' : 'Show password');
            btn.classList.toggle('active', willShow);
        });
    });

    /* ---------- Google sign-in / sign-up placeholder ---------- */
    document.querySelectorAll('#googleSignInBtn, #googleSignUpBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Google sign-in is not part of this version of AUTOVERSE. Please use your email address instead.');
        });
    });

    /* ---------- Highlight the field being typed in (focus / blur) ---------- */
    document.querySelectorAll('.auth-form input').forEach(field => {
        field.addEventListener('focus', () => field.classList.add('field-focused'));
        field.addEventListener('blur', () => field.classList.remove('field-focused'));
    });

    /* ---------- Remember me: prefill email on the login page ---------- */
    const rememberedEmailKey = 'autoverseRememberedEmail';
    const loginEmailField = document.getElementById('loginEmail');
    const rememberMeBox = document.getElementById('rememberMe');

    if (loginEmailField && rememberMeBox) {
        try {
            const remembered = localStorage.getItem(rememberedEmailKey);

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
        const parsed = JSON.parse(localStorage.getItem(AUTOVERSE_ENQUIRIES_KEY));
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveEnquiryRecord(record) {
    const records = getEnquiryRecords();
    records.unshift(record);

    try {
        localStorage.setItem(AUTOVERSE_ENQUIRIES_KEY, JSON.stringify(records));
    } catch (error) {
        return;
    }
}

function getTestDriveRecords() {
    try {
        const parsed = JSON.parse(localStorage.getItem(AUTOVERSE_TEST_DRIVES_KEY));
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveTestDriveRecord(record) {
    const records = getTestDriveRecords();
    records.unshift(record);

    try {
        localStorage.setItem(AUTOVERSE_TEST_DRIVES_KEY, JSON.stringify(records));
    } catch (error) {
        return;
    }
}

/* Test-only export shim - no-op in browsers, see cars-data.js for details. */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getStoredUsers: getStoredUsers,
        findUserByEmail: findUserByEmail,
        upsertUser: upsertUser,
        isValidEmail: isValidEmail,
        escapeHTML: escapeHTML,
        getPasswordStrength: getPasswordStrength
    };
}
