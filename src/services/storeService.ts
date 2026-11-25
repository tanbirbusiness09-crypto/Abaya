import { CATEGORIES, OCCASIONS, PRICE_SHORTCUTS } from '../data/categories';
import { PRODUCTS, type Product } from '../data/products';
import {
  filterProducts,
  matchesSearch,
  sortProducts,
  type CatalogFilters,
  type SortKey,
} from '../utils/catalogLogic';

/**
 * Service layer structured for future REST API / Node.js / DB drop-in replacement.
 * Currently backed by centralized mock catalog & LocalStorage persistence.
 */
export const storeService = {
  getAllProducts(): Product[] {
    return PRODUCTS;
  },

  getProductBySlug(slug: string): Product | undefined {
    return PRODUCTS.find((p) => p.slug === slug || p.id === slug);
  },

  queryCatalog(filters: CatalogFilters, sortKey: SortKey = 'recommended'): Product[] {
    const filtered = filterProducts(PRODUCTS, filters);
    return sortProducts(filtered, sortKey);
  },

  getSearchSuggestions(query: string) {
    const trimmed = query.trim();
    if (!trimmed) {
      return { products: [] as Product[], categories: [] as typeof CATEGORIES };
    }
    const products = PRODUCTS.filter((p) => matchesSearch(p, trimmed)).slice(0, 6);
    const qLower = trimmed.toLowerCase();
    const categories = CATEGORIES.filter(
      (c) =>
        c.name.ar.toLowerCase().includes(qLower) ||
        c.name.en.toLowerCase().includes(qLower) ||
        c.slug.includes(qLower)
    ).slice(0, 4);
    return { products, categories };
  },

  getSimilarProducts(product: Product, limit = 6): Product[] {
    return PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        (p.categorySlug === product.categorySlug ||
          p.occasions.some((occ) => product.occasions.includes(occ)))
    ).slice(0, limit);
  },

  getCrossSellProducts(excludeIds: string[], limit = 6): Product[] {
    const excluded = new Set(excludeIds);
    return PRODUCTS.filter(
      (p) =>
        !excluded.has(p.id) &&
        (p.categorySlug === 'shaylas' ||
          p.categorySlug === 'hijabs' ||
          p.categorySlug === 'accessories' ||
          p.isBestSeller)
    ).slice(0, limit);
  },

  getCategoryBySlug(slug: string) {
    return CATEGORIES.find((c) => c.slug === slug);
  },

  getOccasionBySlug(slug: string) {
    return OCCASIONS.find((o) => o.slug === slug);
  },

  getPriceShortcutBySlug(slug: string) {
    return PRICE_SHORTCUTS.find((p) => p.slug === slug);
  },
};
