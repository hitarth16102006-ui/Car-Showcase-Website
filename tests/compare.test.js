const {
  AUTOVERSE_COMPARE_MAX,
  getCompareIds,
  saveCompareIds,
  isCarInCompare,
  toggleCompare,
  compareButtonHTML
} = require('../JS/compare.js');

beforeEach(() => {
  localStorage.clear();
  // toggleCompare calls window.alert() when the 3-car limit is hit;
  // jsdom doesn't implement it, so stub it to keep test output clean.
  window.alert = jest.fn();
});

describe('AUTOVERSE_COMPARE_MAX', () => {
  test('the compare limit is 3 cars', () => {
    expect(AUTOVERSE_COMPARE_MAX).toBe(3);
  });
});

describe('getCompareIds / saveCompareIds', () => {
  test('returns an empty array when nothing has been selected yet', () => {
    expect(getCompareIds()).toEqual([]);
  });

  test('round-trips an array of ids through localStorage', () => {
    saveCompareIds(['bmw-m4', 'audi-r8']);
    expect(getCompareIds()).toEqual(['bmw-m4', 'audi-r8']);
  });
});

describe('isCarInCompare', () => {
  test('is false for a car that has not been added', () => {
    expect(isCarInCompare('bmw-m4')).toBe(false);
  });

  test('is true once the id has been added', () => {
    saveCompareIds(['bmw-m4']);
    expect(isCarInCompare('bmw-m4')).toBe(true);
  });
});

describe('toggleCompare', () => {
  test('adds a car that is not yet selected, and returns true', () => {
    const result = toggleCompare('bmw-m4');
    expect(result).toBe(true);
    expect(getCompareIds()).toEqual(['bmw-m4']);
  });

  test('removes a car that is already selected, and returns false', () => {
    saveCompareIds(['bmw-m4', 'audi-r8']);
    const result = toggleCompare('bmw-m4');
    expect(result).toBe(false);
    expect(getCompareIds()).toEqual(['audi-r8']);
  });

  test('allows exactly 3 cars to be added', () => {
    toggleCompare('bmw-m4');
    toggleCompare('audi-r8');
    toggleCompare('porsche-911-turbo-s');
    expect(getCompareIds()).toHaveLength(3);
  });

  test('refuses to add a 4th car and warns the user instead', () => {
    toggleCompare('bmw-m4');
    toggleCompare('audi-r8');
    toggleCompare('porsche-911-turbo-s');

    const result = toggleCompare('ferrari-sf90');

    expect(result).toBe(false);
    expect(getCompareIds()).toHaveLength(3);
    expect(getCompareIds()).not.toContain('ferrari-sf90');
    expect(window.alert).toHaveBeenCalledTimes(1);
  });

  test('removing a car after hitting the limit frees up a slot', () => {
    toggleCompare('bmw-m4');
    toggleCompare('audi-r8');
    toggleCompare('porsche-911-turbo-s');

    toggleCompare('bmw-m4'); // remove one
    const result = toggleCompare('ferrari-sf90'); // now there's room

    expect(result).toBe(true);
    expect(getCompareIds()).toEqual(['audi-r8', 'porsche-911-turbo-s', 'ferrari-sf90']);
  });
});

describe('compareButtonHTML', () => {
  test('renders an inactive button for a car not in the compare list', () => {
    const html = compareButtonHTML('bmw-m4');
    expect(html).toContain('data-compare-id="bmw-m4"');
    expect(html).not.toContain('active');
  });

  test('renders an active button for a car already in the compare list', () => {
    saveCompareIds(['bmw-m4']);
    const html = compareButtonHTML('bmw-m4');
    expect(html).toContain('active');
    expect(html).toContain('aria-pressed="true"');
  });
});
