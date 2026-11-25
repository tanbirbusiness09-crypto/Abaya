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

      {/* SECTION A — REDESIGNED FLAGSHIP EDITORIAL HERO (Desktop Bento Split + Native Android Mobile Split) */}
      <section aria-label="Featured Campaigns" className="bg-white border-b border-[#EAE5DF]">
        {/* DESKTOP & TABLET FLAGSHIP BENTO HERO */}
        <div className="hidden md:block max-w-[1440px] mx-auto px-6 pt-4 pb-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Primary 8-Col Architectural Split Campaign Slider */}
            <div className="lg:col-span-8 min-w-0">
              <Swiper
                key={isRtl ? 'hero-desktop-rtl' : 'hero-desktop-ltr'}
                dir={isRtl ? 'rtl' : 'ltr'}
                modules={[Autoplay, Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5800, disableOnInteraction: false }}
                loop
                className="layana-hero-swiper rounded-2xl overflow-hidden border border-[#EAE5DF] shadow-[0_8px_30px_rgba(61,16,35,0.06)] h-[430px] lg:h-[468px]"
              >
                {HERO_SLIDES.map((slide, idx) => {
                  const isLightPanel = slide.accentTone === 'sand';
                  const panelBg =
                    slide.accentTone === 'burgundy'
                      ? 'bg-[#3D1023] text-white'
                      : slide.accentTone === 'sand'
                        ? 'bg-[#FAF5EC] text-[#202020]'
                        : 'bg-[#1D1116] text-white';

                  return (
                    <SwiperSlide key={slide.id}>
                      <div className="grid grid-cols-12 h-full w-full">
                        {/* Editorial Typography Column (5 cols — clean architectural canvas, zero muddy overlay) */}
                        <div
                          className={`col-span-5 h-full px-12 lg:px-14 py-9 flex flex-col justify-between relative ${panelBg}`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-px bg-[#C5A572]" />
                              <span
                                className={`text-xs font-bold tracking-wide ${
                                  isLightPanel ? 'text-[#581C32]' : 'text-[#C5A572]'
                                }`}
                              >
                                {l(slide.eyebrow)}
                              </span>
                            </div>

                            <h1 className="font-editorial text-3xl lg:text-[42px] font-bold leading-[1.12] text-balance">
                              {l(slide.title)}
                            </h1>

                            <p
                              className={`text-sm leading-relaxed max-w-sm ${
                                isLightPanel ? 'text-[#5A524C]' : 'text-white/85'
                              }`}
                            >
                              {l(slide.subtitle)}
                            </p>
                          </div>

                          <div className="space-y-4 pt-4">
                            <p
                              className={`text-xs font-semibold tabular-nums ${
                                isLightPanel ? 'text-[#581C32]' : 'text-[#E3CFAF]'
                              }`}
                            >
                              {l(slide.offerNote)}
                            </p>

                            <div className="flex items-center gap-3 flex-wrap">
                              <Link
                                to={slide.link}
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-colors whitespace-nowrap shadow-xs ${
                                  isLightPanel
                                    ? 'bg-[#581C32] hover:bg-[#3D1023] text-white'
                                    : 'bg-[#C5A572] hover:bg-[#b59460] text-[#202020]'
                                }`}
                              >
                                <span>{l(slide.cta)}</span>
                                <ArrowIcon className="w-4 h-4" />
                              </Link>
                              <Link
                                to="/new-arrivals"
                                className={`text-xs font-bold underline underline-offset-4 whitespace-nowrap ${
                                  isLightPanel
                                    ? 'text-[#3D1023] hover:text-[#581C32]'
                                    : 'text-white/85 hover:text-[#C5A572]'
                                }`}
                              >
                                {t.sections.newArrivals}
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Unobstructed Full-Brightness Photography Column (7 cols) */}
                        <div className="col-span-7 relative h-full overflow-hidden bg-[#F3EDE3]">
                          <SmartImage
                            src={slide.image}
                            alt={l(slide.title)}
                            priority={idx === 0}
                            className="w-full h-full object-cover object-[center_12%]"
                          />
                          {/* Subtle Floating Editorial Piece Tag */}
                          <Link
                            to={slide.link}
                            className="absolute bottom-4 end-4 px-3.5 py-2 rounded-lg bg-white/94 backdrop-blur-sm border border-[#EAE5DF] shadow-md flex items-center gap-2 text-xs font-bold text-[#202020] hover:border-[#581C32] transition-colors"
                          >
                            <span className="tabular-nums">{l(slide.featuredPiece)}</span>
                            <ArrowIcon className="w-3.5 h-3.5 text-[#581C32]" />
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            {/* Companion 4-Col Stacked Editorial Campaign Tiles (Desktop Noon/Ounass Merchandising Rhythm) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 h-[468px]">
              {/* Top Companion Tile — Flash Deals */}
              <Link
                to="/flash-deals"
                className="group flex-1 rounded-2xl overflow-hidden border border-[#EAE5DF] bg-[#FAF5EC] grid grid-cols-12 hover:border-[#C5A572] transition-colors shadow-[0_4px_16px_rgba(32,32,32,0.03)]"
              >
                <div className="col-span-7 p-5 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D92D39]">
                      <Zap className="w-3.5 h-3.5 fill-[#D92D39]" />
                      <span>{lang === 'ar' ? 'عروض فلاش اليوم' : 'Today’s Flash Edit'}</span>
                    </span>
                    <h2 className="font-editorial text-2xl font-bold text-[#3D1023] leading-tight">
                      {lang === 'ar' ? 'خصومات تصل إلى 30%' : 'Up to 30% Off Signature Cuts'}
                    </h2>
                    <p className="text-xs text-[#6B625B]">
                      {lang === 'ar' ? 'عبايات بشت وكريب مختارة لفترة محدودة' : 'Selected crepe & bisht silhouettes'}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#581C32] group-hover:underline">
                    <span>{t.shopNow}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="col-span-5 relative overflow-hidden bg-[#EFE8DC]">
                  <SmartImage
                    src={HERO_SLIDES[0].mobileImage}
                    alt={t.sections.flashDeals}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>

              {/* Bottom Companion Tile — Eid & Evening Couture */}
              <Link
                to="/category/occasion-abayas"
                className="group flex-1 rounded-2xl overflow-hidden border border-[#3D1023] bg-[#3D1023] text-white grid grid-cols-12 hover:border-[#C5A572] transition-colors shadow-[0_4px_16px_rgba(61,16,35,0.08)]"
              >
                <div className="col-span-7 p-5 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#C5A572]">
                      {lang === 'ar' ? 'تشكيلة العيد والسهرات' : 'Eid & Evening Edit'}
                    </span>
                    <h2 className="font-editorial text-2xl font-bold leading-tight">
                      {lang === 'ar' ? 'فخامة اللؤلؤ والتطريز اليدوي' : 'Pearl Jacquard & Couture Trim'}
                    </h2>
                    <p className="text-xs text-white/75">
                      {lang === 'ar' ? 'طرحة متناسقة مجانية مع كل عباية' : 'Complimentary matching shayla included'}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A572] group-hover:underline">
                    <span>{lang === 'ar' ? 'استكشفي المناسبات' : 'Explore Occasions'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="col-span-5 relative overflow-hidden bg-[#2A0B18]">
                  <SmartImage
                    src={PROMO_BANNERS[2].image}
                    alt={lang === 'ar' ? 'تشكيلة العيد والسهرات' : 'Eid & Evening Edit'}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
            </div>
          </div>

          {/* Integrated Single-Row Saudi Shopping Promise Strip */}
          <div className="mt-4 pt-3.5 border-t border-[#EAE5DF] grid grid-cols-4 divide-x divide-[#EAE5DF] rtl:divide-x-reverse text-xs">
            <div className="flex items-center justify-center gap-2 px-3 text-[#202020] font-semibold">
              <Truck className="w-4 h-4 text-[#581C32] shrink-0" />
              <span className="truncate">
                {lang === 'ar' ? 'شحن مجاني فوق 399 ر.س داخل المملكة' : 'Free KSA Shipping Over SAR 399'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 px-3 text-[#202020] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#581C32] shrink-0" />
              <span className="truncate">
                {lang === 'ar' ? 'الأسعار شاملة ضريبة القيمة المضافة 15%' : 'All Prices Include 15% Saudi VAT'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 px-3 text-[#202020] font-semibold">
              <Sparkles className="w-4 h-4 text-[#581C32] shrink-0" />
              <span className="truncate">
                {lang === 'ar' ? 'قسّطي على 4 دفعات عبر تابي وتمارا' : '4 Interest-Free Tabby & Tamara'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 px-3 text-[#202020] font-semibold">
              <RefreshCw className="w-4 h-4 text-[#581C32] shrink-0" />
              <span className="truncate">
                {lang === 'ar' ? 'استبدال واسترجاع مرن خلال 14 يوماً' : '14-Day Easy Exchange & Returns'}
              </span>
            </div>
          </div>
        </div>

        {/* MOBILE NATIVE ANDROID APP HERO CAROUSEL + QUICK PROMO DUO */}
        <div className="md:hidden pt-3 pb-3">
          <div className="px-3">
            <Swiper
              key={isRtl ? 'hero-mobile-rtl' : 'hero-mobile-ltr'}
              dir={isRtl ? 'rtl' : 'ltr'}
              modules={[Autoplay, Pagination]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5200, disableOnInteraction: false }}
              slidesPerView={1.05}
              spaceBetween={10}
              className="layana-mobile-hero-swiper !overflow-visible"
            >
              {HERO_SLIDES.map((slide, idx) => {
                const isLightPanel = slide.accentTone === 'sand';
                const panelBg =
                  slide.accentTone === 'burgundy'
                    ? 'bg-[#3D1023] text-white'
                    : slide.accentTone === 'sand'
                      ? 'bg-[#FAF5EC] text-[#202020]'
                      : 'bg-[#1D1116] text-white';

                return (
                  <SwiperSlide key={slide.id}>
                    <Link
                      to={slide.link}
                      className={`grid grid-cols-12 h-[196px] rounded-2xl overflow-hidden border border-[#EAE5DF] shadow-[0_4px_14px_rgba(61,16,35,0.08)] active:scale-[0.99] transition-transform ${panelBg}`}
                    >
                      {/* Clean Solid Editorial Copy Half (7 cols — zero text on top of garment!) */}
                      <div className="col-span-7 p-4 flex flex-col justify-between min-w-0">
                        <div className="space-y-1.5">
                          <span
                            className={`block text-[10px] font-bold tracking-wide truncate ${
                              isLightPanel ? 'text-[#581C32]' : 'text-[#C5A572]'
                            }`}
                          >
                            {l(slide.eyebrow)}
                          </span>
                          <h1 className="clamp-2 font-editorial text-[19px] font-extrabold leading-[1.18]">
                            {l(slide.title)}
                          </h1>
                          <p
                            className={`clamp-1 text-[11px] font-medium ${
                              isLightPanel ? 'text-[#665D56]' : 'text-white/80'
                            }`}
                          >
                            {l(slide.offerNote)}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 self-start px-3.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap ${
                            isLightPanel
                              ? 'bg-[#581C32] text-white'
                              : 'bg-[#C5A572] text-[#202020]'
                          }`}
                        >
                          <span>{l(slide.cta)}</span>
                          <ArrowIcon className="w-3 h-3" />
                        </span>
                      </div>

                      {/* Crisp Bright Unobstructed Fashion Portrait Half (5 cols) */}
                      <div className="col-span-5 relative h-full overflow-hidden bg-[#EFE8DC]">
                        <SmartImage
                          src={slide.mobileImage}
                          alt={l(slide.title)}
                          priority={idx === 0}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          {/* Native Android App 2-Column Mini Promo Shortcuts */}
          <div className="px-3 mt-3 grid grid-cols-2 gap-2.5">
            <Link
              to="/flash-deals"
              className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#FAF5EC] border border-[#EAE5DF] active:scale-[0.98] transition-transform"
            >
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[#D92D39] flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-[#D92D39] shrink-0" />
                  <span className="truncate">{lang === 'ar' ? 'حتى 30%' : 'Up to 30%'}</span>
                </p>
                <p className="text-xs font-extrabold text-[#202020] truncate mt-0.5">
                  {lang === 'ar' ? 'عروض فلاش' : 'Flash Deals'}
                </p>
              </div>
              <div className="w-10 h-11 rounded-lg overflow-hidden bg-white border border-[#EAE5DF] shrink-0">
                <SmartImage
                  src={PROMO_BANNERS[0].image}
                  alt={t.sections.flashDeals}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </Link>

            <Link
              to="/category/occasion-abayas"
              className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#3D1023] text-white active:scale-[0.98] transition-transform"
            >
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[#C5A572] truncate">
                  {lang === 'ar' ? 'جديد العيد' : 'Eid Edit'}
                </p>
                <p className="text-xs font-extrabold truncate mt-0.5">
                  {lang === 'ar' ? 'عبايات مناسبات' : 'Occasion Wear'}
                </p>
              </div>
              <div className="w-10 h-11 rounded-lg overflow-hidden bg-[#2A0B18] shrink-0">
                <SmartImage
                  src={PROMO_BANNERS[2].image}
                  alt={lang === 'ar' ? 'عبايات مناسبات' : 'Occasion Wear'}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 space-y-5 sm:space-y-10 py-4 sm:py-8">
        {/* SECTION B — SHOP BY CATEGORY (Android App Squircle Strip on Mobile / Editorial Row on Desktop) */}
        <section aria-labelledby="sec-categories">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 id="sec-categories" className="text-[15px] sm:text-xl font-extrabold sm:font-bold text-[#202020]">
              {t.sections.shopByCategory}
            </h2>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline whitespace-nowrap"
            >
              <span>{t.viewAll}</span>
              <ArrowIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          <div className="flex gap-2.5 sm:gap-4 overflow-x-auto snap-x no-scrollbar pb-1.5 -mx-3 px-3 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="group snap-start shrink-0 w-[78px] sm:w-[122px] flex flex-col items-center text-center gap-1.5 sm:gap-2 active:scale-95 transition-transform"
              >
                <div className="w-[74px] h-[88px] sm:w-[116px] sm:h-[144px] rounded-2xl sm:rounded-xl overflow-hidden bg-white border border-[#EAE5DF] group-hover:border-[#581C32] shadow-xs transition-all">
                  <SmartImage
                    src={cat.image}
                    alt={l(cat.name)}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="clamp-2 text-[11px] sm:text-xs font-semibold text-[#202020] group-hover:text-[#581C32] leading-tight">
                  {l(cat.shortName)}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION C — FLASH DEALS */}
        <section
          aria-labelledby="sec-flash"
          className="bg-white rounded-2xl sm:rounded-xl border border-[#EAE5DF] p-3 sm:p-6 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3.5 sm:mb-5 pb-3 border-b border-[#EAE5DF]">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[#581C32]">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-[#D92D39] text-[#D92D39]" />
                <h2 id="sec-flash" className="text-[15px] sm:text-xl font-extrabold sm:font-bold text-[#202020]">
                  {t.sections.flashDeals}
                </h2>
              </div>

              <Link
                to="/flash-deals"
                className="sm:hidden inline-flex items-center gap-1 text-xs font-bold text-[#581C32] whitespace-nowrap"
              >
                <span>{t.viewAll}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#777777]">
                <Clock className="w-3.5 h-3.5 text-[#581C32] shrink-0" />
                <span className="truncate">{t.sections.flashEndsIn}</span>
                <div
                  className="inline-flex flex-row items-center gap-1 tabular-nums font-bold text-white [direction:ltr]"
                  dir="ltr"
                  aria-label={`${countdown.hours} hours ${countdown.minutes} minutes ${countdown.seconds} seconds`}
                >
                  <span className="inline-flex items-baseline gap-0.5 px-1.5 sm:px-2 py-0.5 rounded bg-[#581C32]">
                    <span>{countdown.hours}</span>
                    <span className="text-[9px] sm:text-[10px] font-medium text-[#C5A572]">
                      {lang === 'ar' ? 'س' : 'h'}
                    </span>
                  </span>
                  <span className="text-[#581C32]">:</span>
                  <span className="inline-flex items-baseline gap-0.5 px-1.5 sm:px-2 py-0.5 rounded bg-[#581C32]">
                    <span>{countdown.minutes}</span>
                    <span className="text-[9px] sm:text-[10px] font-medium text-[#C5A572]">
                      {lang === 'ar' ? 'د' : 'm'}
                    </span>
                  </span>
                  <span className="text-[#581C32]">:</span>
                  <span className="inline-flex items-baseline gap-0.5 px-1.5 sm:px-2 py-0.5 rounded bg-[#D92D39]">
                    <span>{countdown.seconds}</span>
                    <span className="text-[9px] sm:text-[10px] font-medium text-white/90">
                      {lang === 'ar' ? 'ث' : 's'}
                    </span>
                  </span>
                </div>
              </div>

              <Link
                to="/flash-deals"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#581C32] hover:underline whitespace-nowrap"
              >
                <span>{t.viewAll}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <ProductCarousel products={flashProducts} />
        </section>

        {/* SECTION D — RECOMMENDED FOR YOU (Native 2-Col Android Grid on Mobile / Dense 6-Col on Desktop) */}
        <section aria-labelledby="sec-recommended">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="min-w-0">
              <h2 id="sec-recommended" className="text-[15px] sm:text-xl font-extrabold sm:font-bold text-[#202020]">
                {t.sections.recommended}
              </h2>
              <p className="hidden sm:block text-xs text-[#777777] mt-0.5">{l(STORE_CONFIG.demoNotice)}</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline whitespace-nowrap shrink-0"
            >
              <span>{t.viewAll}</span>
              <ArrowIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* SECTION E — NEW ARRIVALS */}
        <section aria-labelledby="sec-new">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 id="sec-new" className="text-[15px] sm:text-xl font-extrabold sm:font-bold text-[#202020]">
              {t.sections.newArrivals}
            </h2>
            <Link
              to="/new-arrivals"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline whitespace-nowrap"
            >
              <span>{t.viewAll}</span>
              <ArrowIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          <ProductCarousel products={newArrivalProducts} />
        </section>

        {/* SECTION F — EDITORIAL PROMOTIONAL BANNERS (Swipeable Android Rail on Mobile / 4-Card Grid on Desktop) */}
        <section aria-labelledby="sec-campaigns">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 id="sec-campaigns" className="text-[15px] sm:text-xl font-extrabold sm:font-bold text-[#202020]">
              {t.sections.featuredCampaigns}
            </h2>
          </div>

          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto snap-x no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 pb-1 sm:pb-0">
            {PROMO_BANNERS.map((banner) => (
              <Link
                key={banner.id}
                to={banner.link}
                className="group snap-start shrink-0 w-[235px] sm:w-auto relative aspect-[4/5] rounded-2xl sm:rounded-xl overflow-hidden bg-[#3D1023] border border-[#EAE5DF]"
              >
                <SmartImage
                  src={banner.image}
                  alt={l(banner.title)}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A0B18]/90 via-[#2A0B18]/20 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                  <p className="text-[10px] sm:text-[11px] font-bold text-[#C5A572]">{l(banner.kicker)}</p>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold mt-0.5 leading-snug">
                    {l(banner.title)}
                  </h3>
                  <p className="clamp-2 text-[11px] sm:text-xs text-white/80 mt-1">{l(banner.subtitle)}</p>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-[#C5A572] group-hover:underline">
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
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 id="sec-bestsellers" className="text-[15px] sm:text-xl font-extrabold sm:font-bold text-[#202020]">
              {t.sections.bestSellers}
            </h2>
            <Link
              to="/best-sellers"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline whitespace-nowrap"
            >
              <span>{t.viewAll}</span>
              <ArrowIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
            {bestSellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* SECTION H — SHOP BY COLOR (Swipeable Mobile Rail / 8-Col Desktop Grid) */}
        <section
          aria-labelledby="sec-color"
          className="bg-white rounded-2xl sm:rounded-xl border border-[#EAE5DF] p-3.5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 id="sec-color" className="text-[15px] sm:text-xl font-extrabold sm:font-bold text-[#202020]">
              {t.sections.shopByColor}
            </h2>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline"
            >
              <span>{t.viewAll}</span>
              <ArrowIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3 overflow-x-auto snap-x no-scrollbar pb-1 sm:pb-0">
            {COLORS.map((c) => (
              <Link
                key={c.id}
                to={`/products?color=${c.id}`}
                className="group snap-start shrink-0 w-[104px] sm:w-auto rounded-xl sm:rounded-lg overflow-hidden border border-[#EAE5DF] hover:border-[#581C32] bg-[#F8F4ED] transition-all"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <SmartImage
                    src={c.image}
                    alt={l(c.name)}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2 sm:p-2.5 bg-white flex items-center justify-center gap-1.5 sm:gap-2">
                  <span
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-[#EAE5DF] shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[11px] sm:text-xs font-semibold text-[#202020] truncate">
                    {l(c.name)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION I — SHOP BY OCCASION (Swipeable Mobile Rail / 7-Col Desktop Grid) */}
        <section aria-labelledby="sec-occasion">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 id="sec-occasion" className="text-[15px] sm:text-xl font-extrabold sm:font-bold text-[#202020]">
              {t.sections.shopByOccasion}
            </h2>
            <Link
              to="/collections"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline"
            >
              <span>{t.viewAll}</span>
              <ArrowIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-3 overflow-x-auto snap-x no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 pb-1 sm:pb-0">
            {OCCASIONS.map((occ) => (
              <Link
                key={occ.slug}
                to={`/collection/${occ.slug}`}
                className="group snap-start shrink-0 w-[136px] sm:w-auto relative aspect-[3/4] rounded-2xl sm:rounded-xl overflow-hidden bg-[#3D1023] border border-[#EAE5DF]"
              >
                <SmartImage
                  src={occ.image}
                  alt={l(occ.name)}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A0B18]/90 via-[#2A0B18]/20 to-transparent flex flex-col justify-end p-3 text-white">
                  <h3 className="text-xs sm:text-sm font-bold leading-snug">{l(occ.name)}</h3>
                  <p className="clamp-1 text-[10px] sm:text-[11px] text-white/80 mt-0.5">{l(occ.subtitle)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION J — SHOP BY PRICE (Swipeable Mobile Pills / 5-Col Desktop Cards) */}
        <section aria-labelledby="sec-price">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 id="sec-price" className="text-[15px] sm:text-xl font-extrabold sm:font-bold text-[#202020]">
              {t.sections.shopByPrice}
            </h2>
          </div>

          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 overflow-x-auto snap-x no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 pb-1 sm:pb-0">
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
                  className="group snap-start shrink-0 w-[160px] sm:w-auto p-3.5 sm:p-5 rounded-2xl sm:rounded-xl bg-white border border-[#EAE5DF] hover:border-[#581C32] hover:bg-[#581C32] transition-colors flex flex-col justify-between gap-2"
                >
                  <div>
                    <p className="text-sm sm:text-lg font-extrabold text-[#581C32] group-hover:text-white tabular-nums">
                      {l(tier.label)}
                    </p>
                    <p className="clamp-1 text-[11px] sm:text-xs text-[#777777] group-hover:text-white/80 mt-1">
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
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 id="sec-recent" className="text-[15px] sm:text-xl font-extrabold sm:font-bold text-[#202020]">
                {t.sections.recentlyViewed}
              </h2>
              <Link
                to="/account/recently-viewed"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#581C32] hover:underline"
              >
                <span>{t.viewAll}</span>
                <ArrowIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
