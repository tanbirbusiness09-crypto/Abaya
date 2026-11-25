import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Headphones,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCarousel } from '../components/product/ProductCarousel';
import { SeoHead } from '../components/ui/SeoHead';
import { SmartImage } from '../components/ui/SmartImage';
import { useLocale } from '../context/LocaleContext';
import { useStore } from '../context/StoreContext';
import {
  CATEGORIES,
  COLORS,
  HERO_SLIDES,
  OCCASIONS,
  PRICE_SHORTCUTS,
  PROMO_BANNERS,
} from '../data/categories';
import { PRODUCTS } from '../data/products';
import { STORE_CONFIG } from '../data/storeConfig';

function useCountdown(hoursFromNow: number) {
  const [target] = useState(() => Date.now() + hoursFromNow * 3600 * 1000);
  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, target - Date.now()));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

export function HomePage() {
  const { lang, isRtl, l, t } = useLocale();
  const { recentlyViewedIds } = useStore();
  const countdown = useCountdown(STORE_CONFIG.flashDealsDurationHours);

  const flashProducts = useMemo(() => PRODUCTS.filter((p) => p.isFlashDeal), []);
  const recommendedProducts = useMemo(() => PRODUCTS.filter((p) => p.isRecommended).slice(0, 12), []);
  const newArrivalProducts = useMemo(() => PRODUCTS.filter((p) => p.isNewArrival).slice(0, 10), []);
  const bestSellerProducts = useMemo(() => PRODUCTS.filter((p) => p.isBestSeller).slice(0, 12), []);
  const recentlyViewedProducts = useMemo(
    () =>
      recentlyViewedIds
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [recentlyViewedIds]
  );

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const benefitIcons = [Truck, ShieldCheck, Sparkles, Headphones, RefreshCw];

  const orgJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: STORE_CONFIG.brand.full,
      description: l(STORE_CONFIG.brand.tagline),
      currenciesAccepted: 'SAR',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Riyadh',
        addressCountry: 'SA',
      },
    }),
    [l]
  );

  return (
    <>
      <SeoHead
        title={lang === 'ar' ? 'متجر العبايات والأزياء المحتشمة الفاخرة' : 'Premium Saudi Abaya & Modest Fashion'}
        description={
          lang === 'ar'
            ? 'تسوّقي أحدث العبايات السعودية الفاخرة، عبايات الكتان، البشت المطرز، والطرح الحريرية بأسعار شاملة الضريبة مع توصيل لجميع مدن المملكة.'
            : 'Shop contemporary Saudi abayas, luxury embroidered bishts, breathable linen abayas, and silk shaylas with VAT-inclusive SAR pricing and KSA delivery.'
        }
        jsonLd={orgJsonLd}
      />

      {/* SECTION A — PROMOTIONAL HERO CAROUSEL */}
      <section aria-label="Featured Campaigns" className="bg-white border-b border-[#EAE5DF]">
        <div className="max-w-[1440px] mx-auto md:px-6 md:py-4">
          <Swiper
            key={isRtl ? 'hero-rtl' : 'hero-ltr'}
            dir={isRtl ? 'rtl' : 'ltr'}
            modules={[Autoplay, Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            loop
            className="layana-hero-swiper md:rounded-xl overflow-hidden"
          >
            {HERO_SLIDES.map((slide, idx) => (
              <SwiperSlide key={slide.id}>
                {/* Desktop / Tablet editorial split/full banner */}
                <div className="hidden md:block relative h-[400px] lg:h-[460px] w-full bg-[#3D1023]">
                  <SmartImage
                    src={slide.image}
                    alt={l(slide.title)}
                    priority={idx === 0}
                    className="w-full h-full object-cover object-[center_12%]"
                  />
                  <div
                    className={`absolute inset-0 ${
                      slide.textSide === 'right'
                        ? 'bg-gradient-to-l from-[#2A0B18]/88 via-[#2A0B18]/50 to-transparent'
                        : 'bg-gradient-to-r from-[#2A0B18]/88 via-[#2A0B18]/50 to-transparent'
                    }`}
                  />
                  <div className="absolute inset-0 flex items-center" dir="ltr">
                    <div
                      className={`w-full max-w-[1440px] mx-auto px-12 lg:px-16 flex ${
                        slide.textSide === 'right' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        dir={isRtl ? 'rtl' : 'ltr'}
                        className="max-w-lg text-white space-y-4"
                      >
                        <p className="text-xs font-bold tracking-widest text-[#C5A572]">
                          {l(slide.eyebrow)}
                        </p>
                        <h1 className="font-editorial text-4xl lg:text-5xl font-bold leading-tight text-balance">
                          {l(slide.title)}
                        </h1>
                        <p className="text-sm lg:text-base text-white/90 leading-relaxed max-w-md">
                          {l(slide.subtitle)}
                        </p>
                        <div className="pt-2">
                          <Link
                            to={slide.link}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C5A572] hover:bg-[#b59460] text-[#202020] text-sm font-bold transition-colors shadow-sm"
                          >
                            <span>{l(slide.cta)}</span>
                            <ArrowIcon className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile-Optimized Banner Layout (dedicated portrait composition) */}
                <div className="md:hidden relative h-[360px] w-full bg-[#3D1023]">
                  <SmartImage
                    src={slide.mobileImage}
                    alt={l(slide.title)}
                    priority={idx === 0}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A0B18]/92 via-[#2A0B18]/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 pb-9 text-white space-y-2.5">
                    <p className="text-[11px] font-bold tracking-wider text-[#C5A572]">
                      {l(slide.eyebrow)}
                    </p>
                    <h2 className="font-editorial text-2xl font-bold leading-tight text-balance">
                      {l(slide.title)}
                    </h2>
                    <p className="text-xs text-white/85 line-clamp-2 leading-relaxed">
                      {l(slide.subtitle)}
                    </p>
                    <Link
                      to={slide.link}
                      className="inline-flex items-center gap-1.5 mt-1 px-4 py-2.5 rounded-lg bg-[#C5A572] text-[#202020] text-xs font-bold"
                    >
                      <span>{l(slide.cta)}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 space-y-8 sm:space-y-10 py-6 sm:py-8">
        {/* SECTION B — SHOP BY CATEGORY (Horizontally Scrollable Visual Cards) */}
        <section aria-labelledby="sec-categories">
          <div className="flex items-center justify-between mb-4">
            <h2 id="sec-categories" className="text-lg sm:text-xl font-bold text-[#202020]">
              {t.sections.shopByCategory}
            </h2>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline whitespace-nowrap"
            >
              <span>{t.viewAll}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="group shrink-0 w-[100px] sm:w-[122px] flex flex-col items-center text-center gap-2"
              >
                <div className="w-[94px] h-[116px] sm:w-[116px] sm:h-[144px] rounded-xl overflow-hidden bg-white border border-[#EAE5DF] group-hover:border-[#581C32] shadow-xs transition-all">
                  <SmartImage
                    src={cat.image}
                    alt={l(cat.name)}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-semibold text-[#202020] group-hover:text-[#581C32] leading-tight line-clamp-2">
                  {l(cat.shortName)}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION C — FLASH DEALS */}
        <section
          aria-labelledby="sec-flash"
          className="bg-white rounded-xl border border-[#EAE5DF] p-4 sm:p-6 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3.5 border-b border-[#EAE5DF]">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 text-[#581C32]">
                <Zap className="w-5 h-5 fill-[#D92D39] text-[#D92D39]" />
                <h2 id="sec-flash" className="text-lg sm:text-xl font-bold text-[#202020]">
                  {t.sections.flashDeals}
                </h2>
              </div>

              <div className="inline-flex items-center gap-2 text-xs text-[#777777]">
                <Clock className="w-3.5 h-3.5 text-[#581C32]" />
                <span>{t.sections.flashEndsIn}</span>
                <div
                  className="inline-flex flex-row items-center gap-1 tabular-nums font-bold text-white [direction:ltr]"
                  dir="ltr"
                  aria-label={`${countdown.hours} hours ${countdown.minutes} minutes ${countdown.seconds} seconds`}
                >
                  <span className="inline-flex items-baseline gap-0.5 px-2 py-0.5 rounded bg-[#581C32]">
                    <span>{countdown.hours}</span>
                    <span className="text-[10px] font-medium text-[#C5A572]">
                      {lang === 'ar' ? 'س' : 'h'}
                    </span>
                  </span>
                  <span className="text-[#581C32]">:</span>
                  <span className="inline-flex items-baseline gap-0.5 px-2 py-0.5 rounded bg-[#581C32]">
                    <span>{countdown.minutes}</span>
                    <span className="text-[10px] font-medium text-[#C5A572]">
                      {lang === 'ar' ? 'د' : 'm'}
                    </span>
                  </span>
                  <span className="text-[#581C32]">:</span>
                  <span className="inline-flex items-baseline gap-0.5 px-2 py-0.5 rounded bg-[#D92D39]">
                    <span>{countdown.seconds}</span>
                    <span className="text-[10px] font-medium text-white/90">
                      {lang === 'ar' ? 'ث' : 's'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/flash-deals"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline whitespace-nowrap"
            >
              <span>{t.viewAll}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <ProductCarousel products={flashProducts} />
        </section>

        {/* SECTION D — RECOMMENDED FOR YOU (Noon-style dense responsive product grid) */}
        <section aria-labelledby="sec-recommended">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="sec-recommended" className="text-lg sm:text-xl font-bold text-[#202020]">
                {t.sections.recommended}
              </h2>
              <p className="text-xs text-[#777777] mt-0.5">{l(STORE_CONFIG.demoNotice)}</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline whitespace-nowrap"
            >
              <span>{t.viewAll}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* SECTION E — NEW ARRIVALS */}
        <section aria-labelledby="sec-new">
          <div className="flex items-center justify-between mb-4">
            <h2 id="sec-new" className="text-lg sm:text-xl font-bold text-[#202020]">
              {t.sections.newArrivals}
            </h2>
            <Link
              to="/new-arrivals"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline whitespace-nowrap"
            >
              <span>{t.viewAll}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <ProductCarousel products={newArrivalProducts} />
        </section>

        {/* SECTION F — EDITORIAL PROMOTIONAL BANNERS (4-Card Campaign Grid) */}
        <section aria-labelledby="sec-campaigns">
          <div className="flex items-center justify-between mb-4">
            <h2 id="sec-campaigns" className="text-lg sm:text-xl font-bold text-[#202020]">
              {t.sections.featuredCampaigns}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROMO_BANNERS.map((banner) => (
              <Link
                key={banner.id}
                to={banner.link}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-[#3D1023] border border-[#EAE5DF]"
              >
                <SmartImage
                  src={banner.image}
                  alt={l(banner.title)}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A0B18]/90 via-[#2A0B18]/25 to-transparent flex flex-col justify-end p-5 text-white">
                  <p className="text-[11px] font-bold text-[#C5A572]">{l(banner.kicker)}</p>
                  <h3 className="font-editorial text-xl font-bold mt-1 leading-snug">
                    {l(banner.title)}
                  </h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-2">{l(banner.subtitle)}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#C5A572] group-hover:underline">
                    <span>{l(banner.cta)}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION G — BEST SELLERS */}
        <section aria-labelledby="sec-bestsellers">
          <div className="flex items-center justify-between mb-4">
            <h2 id="sec-bestsellers" className="text-lg sm:text-xl font-bold text-[#202020]">
              {t.sections.bestSellers}
            </h2>
            <Link
              to="/best-sellers"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline whitespace-nowrap"
            >
              <span>{t.viewAll}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {bestSellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* SECTION H — SHOP BY COLOR */}
        <section
          aria-labelledby="sec-color"
          className="bg-white rounded-xl border border-[#EAE5DF] p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 id="sec-color" className="text-lg sm:text-xl font-bold text-[#202020]">
              {t.sections.shopByColor}
            </h2>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline"
            >
              <span>{t.viewAll}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {COLORS.map((c) => (
              <Link
                key={c.id}
                to={`/products?color=${c.id}`}
                className="group rounded-lg overflow-hidden border border-[#EAE5DF] hover:border-[#581C32] bg-[#F8F4ED] transition-all"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <SmartImage
                    src={c.image}
                    alt={l(c.name)}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2.5 bg-white flex items-center justify-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-[#EAE5DF] shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-xs font-semibold text-[#202020] truncate">
                    {l(c.name)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION I — SHOP BY OCCASION */}
        <section aria-labelledby="sec-occasion">
          <div className="flex items-center justify-between mb-4">
            <h2 id="sec-occasion" className="text-lg sm:text-xl font-bold text-[#202020]">
              {t.sections.shopByOccasion}
            </h2>
            <Link
              to="/collections"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline"
            >
              <span>{t.viewAll}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {OCCASIONS.map((occ) => (
              <Link
                key={occ.slug}
                to={`/collection/${occ.slug}`}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-[#3D1023] border border-[#EAE5DF]"
              >
                <SmartImage
                  src={occ.image}
                  alt={l(occ.name)}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A0B18]/90 via-[#2A0B18]/20 to-transparent flex flex-col justify-end p-3 text-white">
                  <h3 className="text-xs sm:text-sm font-bold leading-snug">{l(occ.name)}</h3>
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">{l(occ.subtitle)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION J — SHOP BY PRICE */}
        <section aria-labelledby="sec-price">
          <div className="flex items-center justify-between mb-4">
            <h2 id="sec-price" className="text-lg sm:text-xl font-bold text-[#202020]">
              {t.sections.shopByPrice}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PRICE_SHORTCUTS.map((tier) => {
              const query = tier.maxPrice
                ? `maxPrice=${tier.maxPrice}`
                : `minPrice=${tier.minPrice ?? 300}`;
              const count = PRODUCTS.filter((p) =>
                tier.maxPrice ? p.price <= tier.maxPrice : p.price >= (tier.minPrice ?? 300)
              ).length;

              return (
                <Link
                  key={tier.id}
                  to={`/products?${query}`}
                  className="group p-4 sm:p-5 rounded-xl bg-white border border-[#EAE5DF] hover:border-[#581C32] hover:bg-[#581C32] transition-colors flex flex-col justify-between gap-2"
                >
                  <div>
                    <p className="text-base sm:text-lg font-extrabold text-[#581C32] group-hover:text-white tabular-nums">
                      {l(tier.label)}
                    </p>
                    <p className="text-xs text-[#777777] group-hover:text-white/80 mt-1">
                      {l(tier.sublabel)}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#C5A572] tabular-nums">
                    {count} {t.filters.productsFound} →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECTION K — RECENTLY VIEWED */}
        {recentlyViewedProducts.length > 0 && (
          <section aria-labelledby="sec-recent">
            <div className="flex items-center justify-between mb-4">
              <h2 id="sec-recent" className="text-lg sm:text-xl font-bold text-[#202020]">
                {t.sections.recentlyViewed}
              </h2>
              <Link
                to="/account/recently-viewed"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline"
              >
                <span>{t.viewAll}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
            <ProductCarousel products={recentlyViewedProducts} />
          </section>
        )}

        {/* SECTION L — CUSTOMER BENEFITS */}
        <section
          aria-labelledby="sec-benefits"
          className="bg-white rounded-xl border border-[#EAE5DF] p-5 sm:p-6"
        >
          <h2 id="sec-benefits" className="text-base font-bold text-[#202020] mb-4">
            {t.sections.benefitsTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {t.benefits.map((b, idx) => {
              const Icon = benefitIcons[idx % benefitIcons.length];
              return (
                <div key={b.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F8F4ED] text-[#581C32] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#202020]">{b.title}</h3>
                    <p className="text-[11px] text-[#777777] mt-0.5 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
