const {
  getStoredUsers,
  findUserByEmail,
  upsertUser,
  isValidEmail,
  escapeHTML,
  getPasswordStrength
} = require('../JS/auth.js');

beforeEach(() => {
  localStorage.clear();
});

describe('isValidEmail', () => {
  test('accepts ordinary addresses, in any letter case', () => {
    expect(isValidEmail('asha@example.org')).toBe(true);
    expect(isValidEmail('ASHA@Mail.COM')).toBe(true);
  });

  test('rejects text that is not an email address', () => {
    expect(isValidEmail('asha@')).toBe(false);
    expect(isValidEmail('asha example.org')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('escapeHTML', () => {
  test('turns markup into harmless text', () => {
    expect(escapeHTML('<img src=x onerror="alert(1)">')).toBe('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  });

  test('leaves plain text unchanged', () => {
    expect(escapeHTML('Chandigarh showroom')).toBe('Chandigarh showroom');
  });
});

describe('getPasswordStrength', () => {
  test('a short lower-case password is weak', () => {
    expect(getPasswordStrength('abc').label).toBe('Weak');
  });

  test('a long password with every character type is strong', () => {
    expect(getPasswordStrength('Garage#2026').label).toBe('Strong');
  });
});

describe('stored accounts', () => {
  test('upsertUser adds a new account and findUserByEmail ignores letter case', () => {
    upsertUser({ name: 'Asha', email: 'asha@example.org', passwordHash: 'abc' });
    expect(findUserByEmail('ASHA@example.org').name).toBe('Asha');
  });

  test('upsertUser updates an existing account instead of adding a second one', () => {
    upsertUser({ name: 'Asha', email: 'asha@example.org' });
    upsertUser({ name: 'Asha Verma', email: 'asha@example.org' });
    expect(getStoredUsers()).toHaveLength(1);
    expect(findUserByEmail('asha@example.org').name).toBe('Asha Verma');
  });

  test('findUserByEmail returns null for an unknown email', () => {
    expect(findUserByEmail('nobody@example.org')).toBeNull();
  });
});
