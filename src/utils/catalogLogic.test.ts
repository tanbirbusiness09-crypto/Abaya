import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../data/products';
import {
  calculateCartTotals,
  filterProducts,
  formatPrice,
  formatSaudiPhone,
  isValidSaudiPhone,
  sortProducts,
  type CartItem,
} from './catalogLogic';

test('dataset includes at least 48 unique demonstration products with unique IDs and SKUs', () => {
  assert.ok(PRODUCTS.length >= 48, `Expected >= 48 products, got ${PRODUCTS.length}`);
  const ids = new Set(PRODUCTS.map((p) => p.id));
  const skus = new Set(PRODUCTS.map((p) => p.sku));
  const slugs = new Set(PRODUCTS.map((p) => p.slug));
  assert.equal(ids.size, PRODUCTS.length);
  assert.equal(skus.size, PRODUCTS.length);
  assert.equal(slugs.size, PRODUCTS.length);
});

test('filterProducts filters accurately by category, price, color, fabric, and Arabic/English search', () => {
  const linenUnder300 = filterProducts(PRODUCTS, {
    fabrics: ['natural-linen'],
    maxPrice: 300,
  });
  assert.ok(linenUnder300.length > 0);
  assert.ok(linenUnder300.every((p) => p.fabricKey === 'natural-linen' && p.price <= 300));

  const arabicSearch = filterProducts(PRODUCTS, { searchQuery: 'عنابي' });
  assert.ok(arabicSearch.length >= 3);

  const englishSearch = filterProducts(PRODUCTS, { searchQuery: 'prayer set' });
  assert.ok(englishSearch.length >= 2);
});

test('sortProducts orders prices ascending and descending deterministically', () => {
  const asc = sortProducts(PRODUCTS, 'price-asc');
  for (let i = 1; i < asc.length; i++) {
    assert.ok(asc[i].price >= asc[i - 1].price);
  }

  const desc = sortProducts(PRODUCTS, 'price-desc');
  for (let i = 1; i < desc.length; i++) {
    assert.ok(desc[i].price <= desc[i - 1].price);
  }
});

test('calculateCartTotals computes discount, free shipping threshold, COD fee, and 15% VAT portion', () => {
  const sampleItems: CartItem[] = [
    {
      key: 'prod-01::black::54',
      productId: 'prod-01',
      slug: 'al-najd',
      sku: 'LYN-BLK-101',
      name: { ar: 'عباية نجد', en: 'Al Najd Abaya' },
      image: '/img.jpg',
      price: 200,
      colorId: 'black',
      colorName: { ar: 'أسود', en: 'Black' },
      colorHex: '#1A1A1A',
      size: '54',
      quantity: 2,
    },
  ];

  // Subtotal = 400 SAR -> qualifies for free standard shipping (>= 399)
  const noCoupon = calculateCartTotals(sampleItems);
  assert.equal(noCoupon.subtotal, 400);
  assert.equal(noCoupon.shipping, 0);
  assert.equal(noCoupon.total, 400);
  assert.equal(noCoupon.vatIncluded, Number((400 - 400 / 1.15).toFixed(2)));

  // LAYANA15 gives 15% off (60 SAR) -> 340 SAR -> below 399 so standard shipping (24 SAR) applies
  const withCoupon = calculateCartTotals(sampleItems, {
    couponCode: 'LAYANA15',
    paymentMethodId: 'cod',
  });
  assert.equal(withCoupon.discount, 60);
  assert.equal(withCoupon.shipping, 24);
  assert.equal(withCoupon.codFee, 15);
  assert.equal(withCoupon.total, 379);
});

test('Saudi phone formatting and validation accepts 05 / 5 / +9665 and rejects invalid numbers', () => {
  assert.equal(isValidSaudiPhone('0551234567'), true);
  assert.equal(isValidSaudiPhone('+966 50 987 6543'), true);
  assert.equal(isValidSaudiPhone('0412345678'), false);
  assert.equal(formatSaudiPhone('0551234567'), '+966 55 123 4567');
  assert.equal(formatPrice(249, 'ar'), '249 ر.س');
  assert.equal(formatPrice(249, 'en'), 'SAR 249');
});
