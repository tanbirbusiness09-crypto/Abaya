import { ArrowUpDown, ChevronRight, SlidersHorizontal, Star, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { SeoHead } from '../components/ui/SeoHead';
import { SmartImage } from '../components/ui/SmartImage';
import { useLocale } from '../context/LocaleContext';
import { CATEGORIES, COLORS, OCCASIONS } from '../data/categories';
import { FABRIC_FILTER_OPTIONS, STYLE_FILTER_OPTIONS } from '../data/products';
import { ABAYA_LENGTHS } from '../data/storeConfig';
import { storeService } from '../services/storeService';
import type { CatalogFilters, SortKey } from '../utils/catalogLogic';

export type CatalogMode =
  | 'all'
  | 'category'
  | 'collection'
  | 'new-arrivals'
  | 'best-sellers'
  | 'flash-deals'
  | 'sale'
  | 'search';

interface CatalogPageProps {
  mode: CatalogMode;
}

const PAGE_SIZE = 16;

export function CatalogPage({ mode }: CatalogPageProps) {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang, isRtl, l, t } = useLocale();

  const initialQuery = searchParams.get('q') ?? '';
  const initialColor = searchParams.get('color');
  const initialMinPrice = searchParams.get('minPrice');
  const initialMaxPrice = searchParams.get('maxPrice');

  const [selectedCategory, setSelectedCategory] = useState<string>(
    mode === 'category' && slug ? slug : 'all'
  );
  const [selectedOccasion, setSelectedOccasion] = useState<string>(
    mode === 'collection' && slug ? slug : ''
  );
  const [minPrice, setMinPrice] = useState<string>(initialMinPrice ?? '');
  const [maxPrice, setMaxPrice] = useState<string>(initialMaxPrice ?? '');
  const [selectedColors, setSelectedColors] = useState<string[]>(
    initialColor ? [initialColor] : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(mode === 'sale');
  const [sortBy, setSortBy] = useState<SortKey>(
    mode === 'new-arrivals'
      ? 'newest'
      : mode === 'best-sellers'
        ? 'bestselling'
        : mode === 'sale' || mode === 'flash-deals'
          ? 'discount'
          : 'recommended'
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  // Sync route param changes
  useEffect(() => {
    setSelectedCategory(mode === 'category' && slug ? slug : 'all');
    setSelectedOccasion(mode === 'collection' && slug ? slug : '');
    setOnSaleOnly(mode === 'sale');
    setSelectedColors(searchParams.get('color') ? [searchParams.get('color')!] : []);
    setMinPrice(searchParams.get('minPrice') ?? '');
    setMaxPrice(searchParams.get('maxPrice') ?? '');
    setVisibleCount(PAGE_SIZE);
  }, [mode, slug, searchParams]);

  const activeCategoryObj =
    selectedCategory !== 'all' ? storeService.getCategoryBySlug(selectedCategory) : undefined;
  const activeOccasionObj =
    selectedOccasion ? storeService.getOccasionBySlug(selectedOccasion) : undefined;

  const filters: CatalogFilters = useMemo(
    () => ({
      categorySlug: selectedCategory !== 'all' ? selectedCategory : undefined,
      occasionSlug: selectedOccasion || undefined,
      searchQuery: mode === 'search' ? initialQuery : undefined,
      minPrice: minPrice !== '' ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== '' ? Number(maxPrice) : undefined,
      colors: selectedColors,
      sizes: selectedSizes,
      fabrics: selectedFabrics,
      styles: selectedStyles,
      minRating,
      inStockOnly,
      onSaleOnly,
      onlyNewArrivals: mode === 'new-arrivals',
      onlyBestSellers: mode === 'best-sellers',
      onlyFlashDeals: mode === 'flash-deals',
    }),
    [
      selectedCategory,
      selectedOccasion,
      mode,
      initialQuery,
      minPrice,
      maxPrice,
      selectedColors,
      selectedSizes,
      selectedFabrics,
      selectedStyles,
      minRating,
      inStockOnly,
      onSaleOnly,
    ]
  );

  const products = useMemo(() => storeService.queryCatalog(filters, sortBy), [filters, sortBy]);
  const visibleProducts = products.slice(0, visibleCount);

  const toggleArrayValue = (list: string[], val: string, setter: (next: string[]) => void) => {
    setter(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);
  };

  const clearAllFilters = () => {
    if (mode !== 'category') setSelectedCategory('all');
    if (mode !== 'collection') setSelectedOccasion('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedFabrics([]);
    setSelectedStyles([]);
    setMinRating(0);
    setInStockOnly(false);
    if (mode !== 'sale') setOnSaleOnly(false);
    if (mode === 'all') setSearchParams({});
  };

  // Determine heading & banner metadata
  const pageTitle = (() => {
    if (mode === 'search') {
      return lang === 'ar' ? `نتائج البحث: "${initialQuery}"` : `Search Results: "${initialQuery}"`;
    }
    if (activeCategoryObj) return l(activeCategoryObj.name);
    if (activeOccasionObj) return l(activeOccasionObj.name);
    if (mode === 'new-arrivals') return t.sections.newArrivals;
    if (mode === 'best-sellers') return t.sections.bestSellers;
    if (mode === 'flash-deals') return t.sections.flashDeals;
    if (mode === 'sale') return lang === 'ar' ? 'التخفيضات والعروض' : 'Sale & Special Offers';
    return lang === 'ar' ? 'جميع العبايات والأزياء المحتشمة' : 'All Abayas & Modest Fashion';
  })();

  const pageSubtitle = activeCategoryObj
    ? l(activeCategoryObj.description)
    : activeOccasionObj
      ? l(activeOccasionObj.subtitle)
      : lang === 'ar'
        ? 'استعرضي تشكيلة ليانا السعودية المصممة بأفخر الأقمشة وبأسعار شاملة ضريبة القيمة المضافة 15%.'
        : 'Browse LAYANA contemporary Saudi abayas crafted from fine fabrics with VAT-inclusive SAR pricing.';

  const bannerImage = activeCategoryObj?.image || activeOccasionObj?.image;

  // Build active filter chips
  const activeChips: { key: string; label: string; onRemove: () => void }[] = [];
  if (minPrice) {
    activeChips.push({
      key: 'minPrice',
      label: `${t.filters.minPrice}: ${minPrice}`,
      onRemove: () => setMinPrice(''),
    });
  }
  if (maxPrice) {
    activeChips.push({
      key: 'maxPrice',
      label: `${t.filters.maxPrice}: ${maxPrice}`,
      onRemove: () => setMaxPrice(''),
    });
  }
  selectedColors.forEach((cid) => {
    const c = COLORS.find((x) => x.id === cid);
    if (c) {
      activeChips.push({
        key: `color-${cid}`,
        label: l(c.name),
        onRemove: () => setSelectedColors((prev) => prev.filter((x) => x !== cid)),
      });
    }
  });
  selectedSizes.forEach((sz) => {
    activeChips.push({
      key: `size-${sz}`,
      label: `${lang === 'ar' ? 'الطول' : 'Length'} ${sz}`,
      onRemove: () => setSelectedSizes((prev) => prev.filter((x) => x !== sz)),
    });
  });
  selectedFabrics.forEach((fk) => {
    const f = FABRIC_FILTER_OPTIONS.find((x) => x.key === fk);
    if (f) {
      activeChips.push({
        key: `fabric-${fk}`,
        label: l(f.label),
        onRemove: () => setSelectedFabrics((prev) => prev.filter((x) => x !== fk)),
      });
    }
  });
  selectedStyles.forEach((sk) => {
    const s = STYLE_FILTER_OPTIONS.find((x) => x.key === sk);
    if (s) {
      activeChips.push({
        key: `style-${sk}`,
        label: l(s.label),
        onRemove: () => setSelectedStyles((prev) => prev.filter((x) => x !== sk)),
      });
    }
  });
  if (minRating > 0) {
    activeChips.push({
      key: 'rating',
      label: `${minRating}★ ${t.filters.andUp}`,
      onRemove: () => setMinRating(0),
    });
  }
  if (inStockOnly) {
    activeChips.push({
      key: 'instock',
      label: t.filters.inStockOnly,
      onRemove: () => setInStockOnly(false),
    });
  }
  if (onSaleOnly && mode !== 'sale') {
    activeChips.push({
      key: 'onsale',
      label: t.filters.onSaleOnly,
      onRemove: () => setOnSaleOnly(false),
    });
  }

  const filterPanelContent = (
    <div className="space-y-5 text-xs">
      {/* Category filter */}
      <div>
        <h3 className="font-bold text-sm text-[#202020] mb-2.5">{t.filters.category}</h3>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pe-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-start px-2.5 py-1.5 rounded-md transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#581C32] text-white font-semibold'
                : 'text-[#202020] hover:bg-[#F8F4ED]'
            }`}
          >
            {t.allCategories}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`w-full text-start px-2.5 py-1.5 rounded-md transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-[#581C32] text-white font-semibold'
                  : 'text-[#202020] hover:bg-[#F8F4ED]'
              }`}
            >
              {l(cat.name)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-[#EAE5DF]">
        <h3 className="font-bold text-sm text-[#202020] mb-2.5">{t.filters.priceRange}</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={t.filters.minPrice}
            aria-label={t.filters.minPrice}
            className="h-9 px-2.5 rounded-md border border-[#EAE5DF] bg-[#F8F4ED]/60 text-xs tabular-nums"
          />
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={t.filters.maxPrice}
            aria-label={t.filters.maxPrice}
            className="h-9 px-2.5 rounded-md border border-[#EAE5DF] bg-[#F8F4ED]/60 text-xs tabular-nums"
          />
        </div>
      </div>

      {/* Colors */}
      <div className="pt-4 border-t border-[#EAE5DF]">
        <h3 className="font-bold text-sm text-[#202020] mb-2.5">{t.filters.color}</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {COLORS.map((c) => {
            const active = selectedColors.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleArrayValue(selectedColors, c.id, setSelectedColors)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md border text-start transition-colors ${
                  active
                    ? 'border-[#581C32] bg-[#581C32]/5 font-bold text-[#581C32]'
                    : 'border-[#EAE5DF] hover:border-[#C5A572]'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-[#EAE5DF] shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="truncate">{l(c.name)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Abaya Length / Size */}
      <div className="pt-4 border-t border-[#EAE5DF]">
        <h3 className="font-bold text-sm text-[#202020] mb-2.5">{t.filters.size}</h3>
        <div className="flex flex-wrap gap-1.5">
          {ABAYA_LENGTHS.map((len) => {
            const active = selectedSizes.includes(len);
            return (
              <button
                key={len}
                type="button"
                onClick={() => toggleArrayValue(selectedSizes, len, setSelectedSizes)}
                className={`w-10 h-8 rounded-md border font-semibold tabular-nums transition-colors ${
                  active
                    ? 'bg-[#581C32] text-white border-[#581C32]'
                    : 'bg-white text-[#202020] border-[#EAE5DF] hover:border-[#581C32]'
                }`}
              >
                {len}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fabric */}
      <div className="pt-4 border-t border-[#EAE5DF]">
        <h3 className="font-bold text-sm text-[#202020] mb-2.5">{t.filters.fabric}</h3>
        <div className="space-y-1.5">
          {FABRIC_FILTER_OPTIONS.map((f) => (
            <label key={f.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFabrics.includes(f.key)}
                onChange={() => toggleArrayValue(selectedFabrics, f.key, setSelectedFabrics)}
                className="accent-[#581C32] rounded"
              />
              <span className="text-[#202020]">{l(f.label)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Style */}
      <div className="pt-4 border-t border-[#EAE5DF]">
        <h3 className="font-bold text-sm text-[#202020] mb-2.5">{t.filters.style}</h3>
        <div className="space-y-1.5">
          {STYLE_FILTER_OPTIONS.map((s) => (
            <label key={s.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedStyles.includes(s.key)}
                onChange={() => toggleArrayValue(selectedStyles, s.key, setSelectedStyles)}
                className="accent-[#581C32] rounded"
              />
              <span className="text-[#202020]">{l(s.label)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Occasion */}
      <div className="pt-4 border-t border-[#EAE5DF]">
        <h3 className="font-bold text-sm text-[#202020] mb-2.5">{t.filters.occasion}</h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedOccasion('')}
            className={`w-full text-start px-2.5 py-1.5 rounded-md ${
              selectedOccasion === '' ? 'bg-[#F8F4ED] font-bold text-[#581C32]' : 'hover:bg-[#F8F4ED]'
            }`}
          >
            {lang === 'ar' ? 'جميع المناسبات' : 'All Occasions'}
          </button>
          {OCCASIONS.map((occ) => (
            <button
              key={occ.slug}
              type="button"
              onClick={() => setSelectedOccasion(occ.slug)}
              className={`w-full text-start px-2.5 py-1.5 rounded-md ${
                selectedOccasion === occ.slug
                  ? 'bg-[#581C32] text-white font-semibold'
                  : 'hover:bg-[#F8F4ED]'
              }`}
            >
              {l(occ.name)}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="pt-4 border-t border-[#EAE5DF]">
        <h3 className="font-bold text-sm text-[#202020] mb-2.5">{t.filters.rating}</h3>
        <div className="space-y-1.5">
          {[4.5, 4].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={`w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${
                minRating === r
                  ? 'border-[#581C32] bg-[#581C32]/5 font-bold text-[#581C32]'
                  : 'border-[#EAE5DF] hover:border-[#C5A572]'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-[#C5A572] text-[#C5A572]" />
              <span className="tabular-nums">{r}+</span>
              <span>{t.filters.andUp}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability & Discount */}
      <div className="pt-4 border-t border-[#EAE5DF] space-y-2">
        <h3 className="font-bold text-sm text-[#202020]">{t.filters.availability}</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-[#581C32]"
          />
          <span>{t.filters.inStockOnly}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={(e) => setOnSaleOnly(e.target.checked)}
            className="accent-[#581C32]"
          />
          <span>{t.filters.onSaleOnly}</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      <SeoHead title={pageTitle} description={pageSubtitle} />

      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#777777] mb-4 flex-wrap">
          <Link to="/" className="hover:text-[#581C32]">
            {t.home}
          </Link>
          <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          <Link to="/products" className="hover:text-[#581C32]">
            {lang === 'ar' ? 'المتجر' : 'Shop'}
          </Link>
          <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          <span className="font-semibold text-[#202020]">{pageTitle}</span>
        </nav>

        {/* Category / Collection Banner */}
        <div className="rounded-xl overflow-hidden bg-[#3D1023] text-white mb-6 border border-[#EAE5DF] flex flex-col sm:flex-row items-stretch">
          <div className="p-5 sm:p-7 flex-1 flex flex-col justify-center">
            <p className="text-[11px] font-bold text-[#C5A572] tracking-wider">LAYANA | ليانا</p>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold mt-1">{pageTitle}</h1>
            <p className="text-xs sm:text-sm text-white/80 mt-2 max-w-2xl leading-relaxed">
              {pageSubtitle}
            </p>
          </div>
          {bannerImage && (
            <div className="hidden sm:block w-52 lg:w-64 shrink-0 relative">
              <SmartImage
                src={bannerImage}
                alt={pageTitle}
                className="w-full h-full object-cover object-top"
              />
            </div>
          )}
        </div>

        {/* Mobile Android-App Filter & Sort Bar */}
        <div className="lg:hidden grid grid-cols-2 gap-2 mb-3.5">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="h-10 px-3 rounded-xl bg-white border border-[#EAE5DF] shadow-[0_1px_2px_rgba(32,32,32,0.03)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 text-xs font-bold text-[#202020]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#581C32]" />
            <span>
              {t.filters.title}
              {activeChips.length > 0 ? ` (${activeChips.length})` : ''}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMobileSortOpen(true)}
            className="h-10 px-3 rounded-xl bg-white border border-[#EAE5DF] shadow-[0_1px_2px_rgba(32,32,32,0.03)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 text-xs font-bold text-[#202020]"
          >
            <ArrowUpDown className="w-4 h-4 text-[#581C32]" />
            <span className="truncate">{t.sortOptions[sortBy]}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white rounded-xl border border-[#EAE5DF] p-5 sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAE5DF]">
              <span className="font-bold text-sm text-[#202020]">{t.filters.title}</span>
              {activeChips.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-[#D92D39] hover:underline"
                >
                  {t.filters.clearAll}
                </button>
              )}
            </div>
            {filterPanelContent}
          </aside>

          {/* Main Product Grid Column */}
          <div className="flex-1 min-w-0 w-full space-y-4">
            {/* Top Bar: Count + Sort dropdown (Desktop) */}
            <div className="bg-white rounded-xl border border-[#EAE5DF] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-[#777777] tabular-nums">
                <span className="font-bold text-[#202020]">{products.length}</span>{' '}
                {t.filters.productsFound}
              </p>

              <div className="hidden lg:flex items-center gap-2">
                <label htmlFor="desktop-sort" className="text-xs text-[#777777] font-medium">
                  {t.filters.sortBy}:
                </label>
                <select
                  id="desktop-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="h-9 px-3 rounded-lg border border-[#EAE5DF] bg-[#F8F4ED]/60 text-xs font-semibold text-[#202020]"
                >
                  {(Object.keys(t.sortOptions) as SortKey[]).map((key) => (
                    <option key={key} value={key}>
                      {t.sortOptions[key]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#581C32]/30 text-xs font-semibold text-[#581C32] hover:bg-[#581C32] hover:text-white transition-colors"
                  >
                    <span>{chip.label}</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-[#D92D39] hover:underline px-2 py-1"
                >
                  {t.filters.clearAll}
                </button>
              </div>
            )}

            {/* Grid or Empty state */}
            {products.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#EAE5DF] p-10 text-center space-y-3">
                <h2 className="text-base font-bold text-[#202020]">{t.filters.emptyTitle}</h2>
                <p className="text-xs text-[#777777] max-w-md mx-auto">{t.filters.emptyDesc}</p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-2 px-5 py-2.5 rounded-lg bg-[#581C32] text-white text-xs font-bold hover:bg-[#3D1023]"
                >
                  {t.filters.clearAll}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 sm:gap-4">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {visibleCount < products.length && (
                  <div className="pt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                      className="px-8 py-3 rounded-lg bg-white border border-[#581C32] text-[#581C32] hover:bg-[#581C32] hover:text-white text-sm font-bold transition-colors"
                    >
                      {t.filters.loadMore} ({products.length - visibleCount})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {mobileFilterOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[80] bg-black/50 backdrop-blur-[1px] flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={t.filters.title}
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-[#D8D0C7] mx-auto mt-2.5 mb-0.5 shrink-0" />
            <div className="px-5 py-3 border-b border-[#EAE5DF] flex items-center justify-between">
              <h2 className="text-base font-bold text-[#202020]">{t.filters.title}</h2>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filters"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#777777] hover:bg-[#F8F4ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">{filterPanelContent}</div>
            <div className="p-4 border-t border-[#EAE5DF] bg-[#F8F4ED] grid grid-cols-2 gap-3 pb-safe">
              <button
                type="button"
                onClick={clearAllFilters}
                className="h-11 rounded-xl border border-[#EAE5DF] bg-white text-xs font-bold text-[#202020] active:scale-[0.98] transition-transform"
              >
                {t.filters.clearAll}
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="h-11 rounded-xl bg-[#581C32] text-white text-xs font-bold active:scale-[0.98] transition-transform"
              >
                {t.filters.apply} ({products.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Bottom Sheet */}
      {mobileSortOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[80] bg-black/50 backdrop-blur-[1px] flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={t.filters.sortBy}
          onClick={() => setMobileSortOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl px-5 pt-2.5 pb-5 space-y-1.5 pb-safe shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-[#D8D0C7] mx-auto mb-2" />
            <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE5DF]">
              <h2 className="text-base font-bold text-[#202020]">{t.filters.sortBy}</h2>
              <button
                type="button"
                onClick={() => setMobileSortOpen(false)}
                aria-label="Close sort sheet"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#777777] hover:bg-[#F8F4ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {(Object.keys(t.sortOptions) as SortKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSortBy(key);
                  setMobileSortOpen(false);
                }}
                className={`w-full text-start px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                  sortBy === key
                    ? 'bg-[#581C32] text-white font-bold'
                    : 'text-[#202020] hover:bg-[#F8F4ED]'
                }`}
              >
                {t.sortOptions[key]}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
