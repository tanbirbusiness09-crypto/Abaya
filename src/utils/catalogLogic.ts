import type { Product } from '../data/products';
import { DEMO_COUPONS, STORE_CONFIG, type DemoCoupon } from '../data/storeConfig';
import type { Language } from '../locales/translations';

export type SortKey =
  | 'recommended'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'bestselling'
  | 'rating'
  | 'discount';

export interface CatalogFilters {
  categorySlug?: string;
  occasionSlug?: string;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  fabrics?: string[];
  styles?: string[];
  minRating?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  onlyNewArrivals?: boolean;
  onlyBestSellers?: boolean;
  onlyFlashDeals?: boolean;
}

export interface CartItem {
  key: string; // productId::colorId::size
  productId: string;
  slug: string;
  sku: string;
  name: { ar: string; en: string };
  image: string;
  price: number;
  originalPrice?: number;
  colorId: string;
  colorName: { ar: string; en: string };
  colorHex: string;
  size: string;
  quantity: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
  vatIncluded: number; // Extracted 15% VAT portion from VAT-inclusive total
  total: number;
  freeShippingProgress: number; // 0..100
  amountToFreeShipping: number;
  appliedCoupon: DemoCoupon | null;
}

export function formatPrice(amount: number, lang: Language): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return lang === 'ar' ? `${formatted} ر.س` : `SAR ${formatted}`;
}

export function formatSaudiPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  let local = digits;
  if (local.startsWith('00966')) local = local.slice(5);
  else if (local.startsWith('966')) local = local.slice(3);
  else if (local.startsWith('0')) local = local.slice(1);
  local = local.slice(0, 9);
  if (!local) return '+966 ';
  const part1 = local.slice(0, 2);
  const part2 = local.slice(2, 5);
  const part3 = local.slice(5, 9);
  return ['+966', part1, part2, part3].filter(Boolean).join(' ');
}

export function isValidSaudiPhone(input: string): boolean {
  const digits = input.replace(/\D/g, '');
  let local = digits;
  if (local.startsWith('00966')) local = local.slice(5);
  else if (local.startsWith('966')) local = local.slice(3);
  else if (local.startsWith('0')) local = local.slice(1);
  return /^5\d{8}$/.test(local);
}

export function normalizeQuery(q: string): string {
  return q
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

export function matchesSearch(product: Product, rawQuery: string): boolean {
  const q = normalizeQuery(rawQuery);
  if (!q) return true;
  const tokens = q.split(/\s+/).filter(Boolean);
  const haystack = normalizeQuery(
    [
      product.name.ar,
      product.name.en,
      product.collection.ar,
      product.collection.en,
      product.description.ar,
      product.description.en,
      product.fabric.ar,
      product.fabric.en,
      product.style.ar,
      product.style.en,
      product.sku,
      product.categorySlug,
      ...product.secondaryCategories,
      ...product.occasions,
      ...product.colors.map((c) => `${c.id} ${c.name.ar} ${c.name.en}`),
      ...product.tags,
    ].join(' ')
  );
  return tokens.every((token) => haystack.includes(token));
}

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  return products.filter((p) => {
    if (filters.categorySlug && filters.categorySlug !== 'all') {
      const inCat =
        p.categorySlug === filters.categorySlug ||
        p.secondaryCategories.includes(filters.categorySlug);
      if (!inCat) return false;
    }

    if (filters.occasionSlug && !p.occasions.includes(filters.occasionSlug)) {
      return false;
    }

    if (filters.onlyNewArrivals && !p.isNewArrival) return false;
    if (filters.onlyBestSellers && !p.isBestSeller) return false;
    if (filters.onlyFlashDeals && !p.isFlashDeal) return false;

    if (filters.searchQuery && !matchesSearch(p, filters.searchQuery)) {
      return false;
    }

    if (typeof filters.minPrice === 'number' && !Number.isNaN(filters.minPrice) && p.price < filters.minPrice) {
      return false;
    }

    if (typeof filters.maxPrice === 'number' && !Number.isNaN(filters.maxPrice) && p.price > filters.maxPrice) {
      return false;
    }

    if (filters.colors && filters.colors.length > 0) {
      const productColorIds = p.colors.map((c) => c.id);
      if (!filters.colors.some((c) => productColorIds.includes(c))) return false;
    }

    if (filters.sizes && filters.sizes.length > 0) {
      const availableSizes = p.sizes.filter((s) => s.inStock).map((s) => s.label);
      if (!filters.sizes.some((s) => availableSizes.includes(s))) return false;
    }

    if (filters.fabrics && filters.fabrics.length > 0) {
      if (!filters.fabrics.includes(p.fabricKey)) return false;
    }

    if (filters.styles && filters.styles.length > 0) {
      if (!filters.styles.includes(p.styleKey)) return false;
    }

    if (typeof filters.minRating === 'number' && filters.minRating > 0 && p.rating < filters.minRating) {
      return false;
    }

    if (filters.inStockOnly && !p.inStock) return false;
    if (filters.onSaleOnly && p.discountPercent <= 0) return false;

    return true;
  });
}

export function sortProducts(products: Product[], sortKey: SortKey): Product[] {
  const list = [...products];
  switch (sortKey) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    case 'newest':
      return list.sort((a, b) => Number(Boolean(b.isNewArrival)) - Number(Boolean(a.isNewArrival)) || b.id.localeCompare(a.id));
    case 'bestselling':
      return list.sort((a, b) => Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller)) || b.reviewCount - a.reviewCount);
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'discount':
      return list.sort((a, b) => b.discountPercent - a.discountPercent || a.price - b.price);
    case 'recommended':
    default:
      return list.sort(
        (a, b) =>
          Number(Boolean(b.isRecommended)) - Number(Boolean(a.isRecommended)) ||
          Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller)) ||
          b.rating - a.rating
      );
  }
}

export function findCoupon(code: string | null | undefined): DemoCoupon | null {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  return DEMO_COUPONS.find((c) => c.code === normalized) ?? null;
}

export function calculateCartTotals(
  items: CartItem[],
  options?: {
    couponCode?: string | null;
    deliveryMethod?: 'standard' | 'express';
    paymentMethodId?: string;
  }
): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
  const deliveryMethod = options?.deliveryMethod ?? 'standard';
  const coupon = findCoupon(options?.couponCode);

  let discount = 0;
  let couponFreeShip = false;

  if (coupon && subtotal >= coupon.minSubtotal && subtotal > 0) {
    if (coupon.type === 'percent') {
      discount = Number(((subtotal * coupon.value) / 100).toFixed(2));
    } else if (coupon.type === 'fixed') {
      discount = Math.min(subtotal, coupon.value);
    } else if (coupon.type === 'shipping') {
      couponFreeShip = true;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const threshold = STORE_CONFIG.freeShippingThreshold;
  const qualifiesFreeStandard = discountedSubtotal >= threshold || couponFreeShip;

  let shipping = 0;
  if (subtotal > 0) {
    if (deliveryMethod === 'express') {
      shipping = STORE_CONFIG.expressShippingFee;
    } else {
      shipping = qualifiesFreeStandard ? 0 : STORE_CONFIG.standardShippingFee;
    }
  }

  const codFee = subtotal > 0 && options?.paymentMethodId === 'cod' ? STORE_CONFIG.codFee : 0;
  const total = Number((discountedSubtotal + shipping + codFee).toFixed(2));

  // KSA prices are VAT-inclusive (15%): VAT portion = total - total / 1.15
  const vatIncluded = Number((total - total / (1 + STORE_CONFIG.vatRate)).toFixed(2));
  const amountToFreeShipping = Math.max(0, Number((threshold - discountedSubtotal).toFixed(2)));
  const freeShippingProgress = Math.min(100, Math.round((discountedSubtotal / threshold) * 100));

  return {
    itemCount,
    subtotal,
    discount,
    shipping,
    codFee,
    vatIncluded,
    total,
    freeShippingProgress,
    amountToFreeShipping,
    appliedCoupon: coupon && subtotal >= coupon.minSubtotal ? coupon : null,
  };
}
