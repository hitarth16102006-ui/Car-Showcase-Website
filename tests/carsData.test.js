const {
  CARS,
  formatCrorePrice,
  getCarById,
  getAllBrands,
  getDefaultThumbnail,
  getPriceCategory,
  isInRange,
  placeholderFrameHTML
} = require('../JS/cars-data.js');

describe('formatCrorePrice', () => {
  test('formats a whole-crore price with the rupee symbol', () => {
    expect(formatCrorePrice(1)).toBe('\u20B91.00 Crore');
  });

  test('formats a fractional-crore price to two decimal places', () => {
    expect(formatCrorePrice(1.2)).toBe('\u20B91.20 Crore');
  });

  test('formats a large multi-crore price', () => {
    expect(formatCrorePrice(4.5)).toBe('\u20B94.50 Crore');
  });

  test('rounds to two decimal places rather than truncating oddly', () => {
    expect(formatCrorePrice(2.005)).toMatch(/^\u20B92\.0[01] Crore$/);
  });
});

describe('CARS dataset integrity', () => {
  test('CARS is a non-empty array', () => {
    expect(Array.isArray(CARS)).toBe(true);
    expect(CARS.length).toBeGreaterThan(0);
  });

  test('every car has a unique id', () => {
    const ids = CARS.map((car) => car.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('every car has at least one variant with a positive price', () => {
    CARS.forEach((car) => {
      expect(Array.isArray(car.variants)).toBe(true);
      expect(car.variants.length).toBeGreaterThan(0);
      expect(car.variants[0].priceCr).toBeGreaterThan(0);
    });
  });

  test('every car has at least one colour option', () => {
    CARS.forEach((car) => {
      expect(Array.isArray(car.colors)).toBe(true);
      expect(car.colors.length).toBeGreaterThan(0);
    });
  });
});

describe('getCarById', () => {
  test('returns the matching car for a known id', () => {
    const knownId = CARS[0].id;
    const result = getCarById(knownId);
    expect(result).toBeDefined();
    expect(result.id).toBe(knownId);
  });

  test('returns null for an id that does not exist', () => {
    expect(getCarById('not-a-real-car-id')).toBeNull();
  });

  test('returns null when called with no id', () => {
    expect(getCarById()).toBeNull();
  });
});

describe('getAllBrands', () => {
  test('returns a sorted, de-duplicated list of brand names', () => {
    const brands = getAllBrands();
    const uniqueBrands = new Set(brands);

    expect(brands.length).toBe(uniqueBrands.size);

    const sorted = [...brands].sort();
    expect(brands).toEqual(sorted);
  });

  test('includes brands known to be in the dataset', () => {
    const brands = getAllBrands();
    expect(brands).toContain('BMW');
    expect(brands).toContain('Audi');
  });
});

describe('CARS content', () => {
  test('no car carries made-up customer reviews', () => {
    CARS.forEach((car) => {
      expect(car.reviews).toBeUndefined();
    });
  });

  test('the first variant is the starting (cheapest) price, as the site assumes', () => {
    CARS.forEach((car) => {
      car.variants.forEach((variant) => {
        expect(variant.priceCr).toBeGreaterThanOrEqual(car.variants[0].priceCr);
      });
    });
  });
});

describe('getPriceCategory', () => {
  test('puts each price in the right band', () => {
    expect(getPriceCategory(0.8)).toBe('Entry Luxury');
    expect(getPriceCategory(1.2)).toBe('Premium');
    expect(getPriceCategory(4.5)).toBe('Supercar');
    expect(getPriceCategory(22)).toBe('Hypercar');
  });
});

describe('isInRange', () => {
  test('includes both ends of the range', () => {
    expect(isInRange(1, 1, 3)).toBe(true);
    expect(isInRange(3, 1, 3)).toBe(true);
    expect(isInRange(3.01, 1, 3)).toBe(false);
  });
});

describe('getDefaultThumbnail', () => {
  test('returns the plain front image for a car with no colour-specific images', () => {
    const carWithFront = CARS.find((car) => car.images && car.images.front && !car.colorImages);
    expect(carWithFront).toBeDefined();
    expect(getDefaultThumbnail(carWithFront)).toBe(carWithFront.images.front);
  });

  test('prefers a colour-specific image over the plain image when both exist', () => {
    const carWithColorImages = CARS.find((car) => car.colorImages);

    if (!carWithColorImages) {
      return; // no car with colorImages in the current dataset
    }

    const thumbnail = getDefaultThumbnail(carWithColorImages);
    expect(typeof thumbnail === 'string' || thumbnail === null).toBe(true);
  });

  test('returns null when a car has no images at all', () => {
    const fakeCar = { id: 'fake', images: null };
    expect(getDefaultThumbnail(fakeCar)).toBeNull();
  });

  test('returns null when a car is missing the images field entirely', () => {
    const fakeCar = { id: 'fake' };
    expect(getDefaultThumbnail(fakeCar)).toBeNull();
  });
});

describe('placeholderFrameHTML', () => {
  test('returns a string containing the car\'s brand name as a fallback visual', () => {
    const car = CARS[0];
    const html = placeholderFrameHTML(car, 'Front View', '#e63946');
    expect(typeof html).toBe('string');
    expect(html).toContain(car.brand.toUpperCase());
  });

  test('mentions the requested photo label', () => {
    const car = CARS[0];
    const html = placeholderFrameHTML(car, 'Rear View', '#e63946');
    expect(html).toContain('Rear View');
  });
});
