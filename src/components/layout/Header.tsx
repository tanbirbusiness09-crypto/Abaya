import {
  ChevronDown,
  Clock,
  Globe,
  Heart,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES, OCCASIONS, SECONDARY_NAV_ITEMS } from '../../data/categories';
import { POPULAR_SEARCHES, SAUDI_CITIES } from '../../data/storeConfig';
import { storeService } from '../../services/storeService';
import { formatPrice } from '../../utils/catalogLogic';
import { SmartImage } from '../ui/SmartImage';

export function Header() {
  const { lang, setLang, l, t, city, setCityById } = useLocale();
  const {
    cartTotals,
    wishlistIds,
    setCartDrawerOpen,
    user,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useStore();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeMegaCat, setActiveMegaCat] = useState(CATEGORIES[0].slug);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promoVisible, setPromoVisible] = useState(true);

  const searchRef = useRef<HTMLDivElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const suggestions = storeService.getSearchSuggestions(searchTerm);
  const selectedMegaCategory =
    CATEGORIES.find((c) => c.slug === activeMegaCat) ?? CATEGORIES[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = searchTerm.trim();
    if (!cleaned) return;
    addRecentSearch(cleaned);
    setSearchFocused(false);
    navigate(`/search?q=${encodeURIComponent(cleaned)}`);
  };

  const triggerQuickSearch = (term: string) => {
    setSearchTerm(term);
    addRecentSearch(term);
    setSearchFocused(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <>
      {/* Top promotional announcement bar (slim, dismissible, desktop/tablet) */}
      {promoVisible && (
        <div className="hidden sm:block bg-[#3D1023] text-[#F8F4ED] text-xs">
          <div className="max-w-[1440px] mx-auto px-6 py-1.5 flex items-center justify-between gap-3">
            <p className="truncate font-medium flex-1 text-center">{t.promoBar}</p>
            <button
              type="button"
              onClick={() => setPromoVisible(false)}
              aria-label={lang === 'ar' ? 'إغلاق شريط العروض' : 'Dismiss announcement'}
              className="text-white/70 hover:text-white p-0.5 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#EAE5DF] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
          {/* Row 1: Brand, City, Search, Actions */}
          <div className="h-14 md:h-16 flex items-center justify-between gap-2.5 md:gap-5">
            {/* Mobile Menu + Brand Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label={lang === 'ar' ? 'فتح القائمة' : 'Open navigation menu'}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#202020] hover:bg-[#F8F4ED]"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link
                to="/"
                className="flex items-center gap-1.5 whitespace-nowrap shrink-0 group"
                aria-label="LAYANA | ليانا"
              >
                <span className="font-editorial text-xl sm:text-2xl font-bold tracking-wider text-[#581C32]">
                  LAYANA
                </span>
                <span className="text-[#C5A572] font-light text-lg">|</span>
                <span className="text-lg sm:text-xl font-extrabold text-[#3D1023] tracking-tight">
                  ليانا
                </span>
              </Link>
            </div>

            {/* Delivery Location Selector (Desktop) */}
            <button
              type="button"
              onClick={() => setCityModalOpen(true)}
              className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#F8F4ED] text-start transition-colors shrink-0"
            >
              <MapPin className="w-4 h-4 text-[#581C32] shrink-0" />
              <div className="leading-tight">
                <span className="block text-[10px] text-[#777777] whitespace-nowrap">
                  {t.deliverTo}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#202020] whitespace-nowrap">
                  <span>{l(city.name)}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#777777]" />
                </span>
              </div>
            </button>

            {/* Large Noon-style Product Search Bar (Desktop & Tablet) */}
            <div ref={searchRef} className="hidden md:block flex-1 max-w-2xl relative">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="search"
                  value={searchTerm}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  aria-label={t.searchPlaceholder}
                  className="w-full h-10 ps-4 pe-20 rounded-lg bg-[#F8F4ED] border border-[#EAE5DF] focus:bg-white focus:border-[#581C32] text-sm text-[#202020] placeholder:text-[#777777] transition-colors"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label={t.clear}
                    className="absolute end-11 p-1 text-[#777777] hover:text-[#202020]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  aria-label={t.searchButton}
                  className="absolute end-1 h-8 px-3 rounded-md bg-[#581C32] hover:bg-[#3D1023] text-white flex items-center justify-center transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Search Autocomplete Dropdown */}
              {searchFocused && (
                <div className="absolute top-full mt-1.5 inset-x-0 bg-white border border-[#EAE5DF] rounded-xl shadow-2xl overflow-hidden z-50">
                  {searchTerm.trim() === '' ? (
                    <div className="p-4 space-y-4">
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#777777]">
                              <Clock className="w-3.5 h-3.5" />
                              {t.recentSearches}
                            </span>
                            <button
                              type="button"
                              onClick={clearRecentSearches}
                              className="text-xs text-[#581C32] hover:underline"
                            >
                              {t.clear}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recentSearches.map((q) => (
                              <button
                                key={q}
                                type="button"
                                onClick={() => triggerQuickSearch(q)}
                                className="px-3 py-1.5 rounded-md bg-[#F8F4ED] hover:bg-[#EAE5DF] text-xs font-medium text-[#202020]"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#777777] mb-2">
                          <TrendingUp className="w-3.5 h-3.5 text-[#581C32]" />
                          {t.popularSearches}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {POPULAR_SEARCHES[lang].map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => triggerQuickSearch(term)}
                              className="px-3 py-1.5 rounded-md border border-[#EAE5DF] hover:border-[#581C32] hover:text-[#581C32] text-xs font-medium text-[#202020] transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-h-[70vh] overflow-y-auto divide-y divide-[#EAE5DF]">
                      {suggestions.categories.length > 0 && (
                        <div className="p-3">
                          <p className="text-[11px] font-bold text-[#777777] mb-2">
                            {t.matchingCategories}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {suggestions.categories.map((cat) => (
                              <Link
                                key={cat.slug}
                                to={`/category/${cat.slug}`}
                                onClick={() => setSearchFocused(false)}
                                className="px-3 py-1.5 rounded-md bg-[#F8F4ED] hover:bg-[#581C32] hover:text-white text-xs font-semibold text-[#581C32] transition-colors"
                              >
                                {l(cat.name)}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-3">
                        <p className="text-[11px] font-bold text-[#777777] mb-2">
                          {t.matchingProducts}
                        </p>
                        {suggestions.products.length === 0 ? (
                          <p className="text-xs text-[#777777] py-4 text-center">
                            {t.noSearchMatches}
                          </p>
                        ) : (
                          <div className="space-y-1">
                            {suggestions.products.map((prod) => (
                              <Link
                                key={prod.id}
                                to={`/product/${prod.slug}`}
                                onClick={() => {
                                  addRecentSearch(searchTerm);
                                  setSearchFocused(false);
                                }}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F4ED] transition-colors"
                              >
                                <div className="w-10 h-13 rounded overflow-hidden bg-[#F8F4ED] shrink-0">
                                  <SmartImage
                                    src={prod.images[0]}
                                    alt={l(prod.name)}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-[#202020] truncate">
                                    {l(prod.name)}
                                  </p>
                                  <p className="text-[11px] text-[#777777]">
                                    {l(prod.collection)} · {l(prod.fabric)}
                                  </p>
                                </div>
                                <span className="text-xs font-bold text-[#581C32] tabular-nums shrink-0">
                                  {formatPrice(prod.price, lang)}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 bg-[#F8F4ED]/60 text-center">
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="text-xs font-bold text-[#581C32] hover:underline"
                        >
                          {t.viewAllResults} ({searchTerm})
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right utility actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
                className="h-9 px-2.5 rounded-lg hover:bg-[#F8F4ED] text-xs font-bold text-[#202020] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <Globe className="w-4 h-4 text-[#581C32]" />
                <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              {/* Account link (Desktop) */}
              <Link
                to={user.isAuthenticated ? '/account' : '/login'}
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg hover:bg-[#F8F4ED] text-xs font-semibold text-[#202020] whitespace-nowrap shrink-0 transition-colors"
              >
                <User className="w-4 h-4 text-[#581C32]" />
                <span className="hidden lg:inline">
                  {user.isAuthenticated ? user.fullName.split(' ')[0] : t.signIn}
                </span>
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                aria-label={`${t.wishlist} (${wishlistIds.length})`}
                className="relative w-9 h-9 rounded-lg hover:bg-[#F8F4ED] flex items-center justify-center text-[#202020] transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistIds.length > 0 && (
                  <span className="absolute top-0.5 end-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#C5A572] text-[#202020] text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer trigger */}
              <button
                type="button"
                onClick={() => setCartDrawerOpen(true)}
                aria-label={`${t.cart} (${cartTotals.itemCount})`}
                className="relative h-9 px-2.5 rounded-lg bg-[#F8F4ED] hover:bg-[#581C32] text-[#202020] hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-bold">{t.cart}</span>
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#581C32] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {cartTotals.itemCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile compact search bar & city selector */}
          <div className="md:hidden pb-2.5 flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-[#777777] absolute start-3 pointer-events-none" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                className="w-full h-9 ps-9 pe-3 rounded-lg bg-[#F8F4ED] border border-[#EAE5DF] text-xs text-[#202020] placeholder:text-[#777777]"
              />
            </form>
            <button
              type="button"
              onClick={() => setCityModalOpen(true)}
              aria-label={t.selectCity}
              className="h-9 px-2.5 rounded-lg bg-[#F8F4ED] border border-[#EAE5DF] inline-flex items-center gap-1 text-[11px] font-semibold text-[#202020] shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-[#581C32]" />
              <span>{l(city.name)}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Horizontal Category Navigation + Mega Menu (Desktop) */}
        <div ref={megaRef} className="hidden lg:block border-t border-[#EAE5DF] bg-[#F8F4ED]/65 relative">
          <div className="max-w-[1440px] mx-auto px-6 h-10 flex items-center gap-5">
            <button
              type="button"
              onClick={() => setMegaMenuOpen((v) => !v)}
              aria-expanded={megaMenuOpen}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#581C32] hover:text-[#3D1023] whitespace-nowrap shrink-0 py-1"
            >
              <Menu className="w-4 h-4" />
              <span>{t.allCategories}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <span className="h-4 w-px bg-[#EAE5DF] shrink-0" />

            <nav aria-label="Primary categories" className="flex items-center gap-5 overflow-x-auto no-scrollbar">
              {SECONDARY_NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => {
                    if (item.categorySlug) setActiveMegaCat(item.categorySlug);
                  }}
                  className={`text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    item.highlight
                      ? 'text-[#D92D39] hover:text-[#b4202b] font-bold'
                      : 'text-[#202020] hover:text-[#581C32]'
                  }`}
                >
                  {l(item.label)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Interactive Full-Width Mega Menu */}
          {megaMenuOpen && (
            <div className="absolute top-full inset-x-0 bg-white border-b border-[#EAE5DF] shadow-2xl z-50">
              <div className="max-w-[1440px] mx-auto px-6 py-6 grid grid-cols-12 gap-6">
                {/* Category list column */}
                <div className="col-span-3 border-e border-[#EAE5DF] pe-4 space-y-1 max-h-[380px] overflow-y-auto">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onMouseEnter={() => setActiveMegaCat(cat.slug)}
                      onClick={() => {
                        setMegaMenuOpen(false);
                        navigate(`/category/${cat.slug}`);
                      }}
                      className={`w-full text-start px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                        activeMegaCat === cat.slug
                          ? 'bg-[#F8F4ED] text-[#581C32]'
                          : 'text-[#202020] hover:bg-[#F8F4ED]/60'
                      }`}
                    >
                      <span>{l(cat.name)}</span>
                      <span className="text-[#C5A572]">›</span>
                    </button>
                  ))}
                </div>

                {/* Subcategories & Occasions column */}
                <div className="col-span-5 space-y-5">
                  <div>
                    <h3 className="text-base font-bold text-[#581C32]">{l(selectedMegaCategory.name)}</h3>
                    <p className="text-xs text-[#777777] mt-1">{l(selectedMegaCategory.description)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-[#202020] mb-2">
                        {lang === 'ar' ? 'الأقسام الفرعية' : 'Subcategories'}
                      </p>
                      <ul className="space-y-1.5">
                        {selectedMegaCategory.subcategories.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              to={`/category/${sub.slug}`}
                              onClick={() => setMegaMenuOpen(false)}
                              className="text-xs text-[#777777] hover:text-[#581C32] font-medium"
                            >
                              {l(sub.name)}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            to={`/category/${selectedMegaCategory.slug}`}
                            onClick={() => setMegaMenuOpen(false)}
                            className="text-xs font-bold text-[#581C32] hover:underline"
                          >
                            {t.viewAll} ←
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#202020] mb-2">
                        {t.sections.shopByOccasion}
                      </p>
                      <ul className="space-y-1.5">
                        {OCCASIONS.slice(0, 5).map((occ) => (
                          <li key={occ.slug}>
                            <Link
                              to={`/collection/${occ.slug}`}
                              onClick={() => setMegaMenuOpen(false)}
                              className="text-xs text-[#777777] hover:text-[#581C32] font-medium"
                            >
                              {l(occ.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Editorial Featured Fashion Card */}
                <div className="col-span-4">
                  <Link
                    to={`/category/${selectedMegaCategory.slug}`}
                    onClick={() => setMegaMenuOpen(false)}
                    className="group relative block h-[280px] rounded-xl overflow-hidden bg-[#F8F4ED] border border-[#EAE5DF]"
                  >
                    <SmartImage
                      src={selectedMegaCategory.image}
                      alt={l(selectedMegaCategory.name)}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3D1023]/85 via-[#3D1023]/25 to-transparent flex flex-col justify-end p-5 text-white">
                      <p className="text-xs text-[#C5A572] font-semibold">LAYANA | ليانا</p>
                      <p className="text-lg font-bold mt-0.5">{l(selectedMegaCategory.name)}</p>
                      <span className="mt-2 inline-block text-xs font-semibold underline underline-offset-4">
                        {t.shopNow}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Saudi City Selector Modal */}
      {cityModalOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t.selectCity}
          onClick={() => setCityModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full border border-[#EAE5DF] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#EAE5DF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#581C32]" />
                <h2 className="text-base font-bold text-[#202020]">{t.selectCity}</h2>
              </div>
              <button
                type="button"
                onClick={() => setCityModalOpen(false)}
                aria-label="Close city selector"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#777777] hover:bg-[#F8F4ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2 max-h-[65vh] overflow-y-auto">
              {SAUDI_CITIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCityById(c.id);
                    setCityModalOpen(false);
                  }}
                  className={`p-3 rounded-lg border text-start transition-colors ${
                    city.id === c.id
                      ? 'border-[#581C32] bg-[#581C32]/5'
                      : 'border-[#EAE5DF] hover:border-[#C5A572]'
                  }`}
                >
                  <p className="text-sm font-bold text-[#202020]">{l(c.name)}</p>
                  <p className="text-[11px] text-[#777777] mt-0.5">{l(c.region)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/50 flex justify-start"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-[85%] max-w-xs bg-white h-full flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3.5 bg-[#581C32] text-white flex items-center justify-between">
              <span className="font-bold text-base">LAYANA | ليانا</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-1 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#EAE5DF]">
              <div className="p-4 flex items-center justify-between bg-[#F8F4ED]">
                <Link
                  to={user.isAuthenticated ? '/account' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-[#581C32]"
                >
                  {user.isAuthenticated ? user.fullName : t.signIn}
                </Link>
                <button
                  type="button"
                  onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                  className="px-3 py-1 rounded bg-white border border-[#EAE5DF] text-xs font-bold"
                >
                  {lang === 'ar' ? 'English' : 'العربية'}
                </button>
              </div>

              <div className="p-3 space-y-1">
                <p className="px-2 py-1 text-[11px] font-bold text-[#777777]">{t.allCategories}</p>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#F8F4ED] text-sm font-medium text-[#202020]"
                  >
                    <div className="w-8 h-10 rounded overflow-hidden bg-[#F8F4ED] shrink-0">
                      <SmartImage src={cat.image} alt={l(cat.name)} className="w-full h-full object-cover" />
                    </div>
                    <span>{l(cat.name)}</span>
                  </Link>
                ))}
              </div>

              <div className="p-3 space-y-1 text-sm">
                <Link to="/flash-deals" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 font-semibold text-[#D92D39]">
                  {t.sections.flashDeals}
                </Link>
                <Link to="/order-tracking" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-[#202020]">
                  {t.checkout.trackOrder}
                </Link>
                <Link to="/size-guide" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-[#202020]">
                  {t.pdp.sizeGuide}
                </Link>
                <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-[#202020]">
                  {lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
                </Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2 text-[#202020]">
                  {lang === 'ar' ? 'اتصلي بنا' : 'Contact Us'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
