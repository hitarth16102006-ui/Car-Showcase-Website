const {
  getWishlistIds,
  saveWishlistIds,
  isCarWishlisted,
  toggleWishlist,
  wishlistHeartHTML
} = require('../JS/wishlist.js');

beforeEach(() => {
  localStorage.clear();
});

describe('getWishlistIds / saveWishlistIds', () => {
  test('returns an empty array when nothing has been saved yet', () => {
    expect(getWishlistIds()).toEqual([]);
  });

  test('round-trips an array of ids through localStorage', () => {
    saveWishlistIds(['bmw-m4', 'audi-r8']);
    expect(getWishlistIds()).toEqual(['bmw-m4', 'audi-r8']);
  });

  test('returns an empty array if localStorage holds malformed JSON', () => {
    localStorage.setItem('autoverseWishlist', '{not valid json');
    expect(getWishlistIds()).toEqual([]);
  });
});

describe('isCarWishlisted', () => {
  test('is false for a car that has not been saved', () => {
    expect(isCarWishlisted('bmw-m4')).toBe(false);
  });

  test('is true once the id has been saved', () => {
    saveWishlistIds(['bmw-m4']);
    expect(isCarWishlisted('bmw-m4')).toBe(true);
  });
});

describe('toggleWishlist', () => {
  test('adds a car that is not yet saved, and returns true', () => {
    const result = toggleWishlist('bmw-m4');
    expect(result).toBe(true);
    expect(getWishlistIds()).toEqual(['bmw-m4']);
  });

  test('removes a car that is already saved, and returns false', () => {
    saveWishlistIds(['bmw-m4', 'audi-r8']);
    const result = toggleWishlist('bmw-m4');
    expect(result).toBe(false);
    expect(getWishlistIds()).toEqual(['audi-r8']);
  });

  test('toggling the same id twice leaves the list unchanged', () => {
    toggleWishlist('bmw-m4');
    toggleWishlist('bmw-m4');
    expect(getWishlistIds()).toEqual([]);
  });

  test('multiple different cars can be saved independently', () => {
    toggleWishlist('bmw-m4');
    toggleWishlist('audi-r8');
    toggleWishlist('porsche-911-turbo-s');
    expect(getWishlistIds()).toEqual(['bmw-m4', 'audi-r8', 'porsche-911-turbo-s']);
  });
});

describe('wishlistHeartHTML', () => {
  test('renders an inactive heart for a car that is not saved', () => {
    const html = wishlistHeartHTML('bmw-m4');
    expect(html).toContain('data-wishlist-id="bmw-m4"');
    expect(html).not.toContain('active');
    expect(html).toContain('aria-pressed="false"');
  });

  test('renders an active heart for a car that is saved', () => {
    saveWishlistIds(['bmw-m4']);
    const html = wishlistHeartHTML('bmw-m4');
    expect(html).toContain('active');
    expect(html).toContain('aria-pressed="true"');
  });
});
