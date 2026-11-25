import {
  ArrowLeftRight,
  Check,
  ChevronRight,
  Expand,
  Heart,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductCarousel } from '../components/product/ProductCarousel';
import { SeoHead } from '../components/ui/SeoHead';
import { SmartImage } from '../components/ui/SmartImage';
import { useLocale } from '../context/LocaleContext';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { storeService } from '../services/storeService';
import { formatPrice } from '../utils/catalogLogic';

export function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang, isRtl, l, t, city } = useLocale();
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    compareIds,
    setSizeGuideOpen,
    recordRecentlyViewed,
    recentlyViewedIds,
    customReviews,
    addProductReview,
    showToast,
  } = useStore();

  const product = useMemo(() => (slug ? storeService.getProductBySlug(slug) : undefined), [slug]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorId, setSelectedColorId] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'care' | 'shipping' | 'reviews'>('desc');

  // Review form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedColorId(product.colors[0]?.id ?? 'black');
      setSelectedSize(product.isLengthSized ? '' : product.sizes[0]?.label ?? 'One Size');
      setActiveImageIndex(0);
      setQuantity(1);
      setValidationError('');
      recordRecentlyViewed(product.id);
    }
  }, [product, recordRecentlyViewed]);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#202020]">
          {lang === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}
        </h1>
        <p className="text-sm text-[#777777]">
          {lang === 'ar'
            ? 'عذراً، لم نتمكن من العثور على هذا التصميم. تصفحي أحدث تشكيلات ليانا.'
            : 'Sorry, we could not find this design. Browse the latest LAYANA collection.'}
        </p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 rounded-lg bg-[#581C32] text-white text-sm font-bold"
        >
          {t.shopNow}
        </Link>
      </div>
    );
  }

  const activeColor = product.colors.find((c) => c.id === selectedColorId) ?? product.colors[0];
  const galleryImages = useMemo(() => {
    const colorImg = activeColor?.image;
    const base = colorImg ? [colorImg, ...product.images.filter((img) => img !== colorImg)] : product.images;
    return base;
  }, [activeColor, product.images]);

  const currentImage = galleryImages[activeImageIndex] ?? galleryImages[0];
  const wishlisted = isWishlisted(product.id);
  const compared = compareIds.includes(product.id);

  const allReviews = [...(customReviews[product.id] ?? []), ...product.reviews];
  const similarProducts = storeService.getSimilarProducts(product, 8);
  const crossSellProducts = storeService.getCrossSellProducts([product.id], 8);
  const recentProducts = recentlyViewedIds
    .filter((id) => id !== product.id)
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const validateAndAdd = (buyNow = false) => {
    if (!selectedSize) {
      setValidationError(t.pdp.validationRequired);
      showToast(t.pdp.validationRequired, 'error');
      return;
    }
    setValidationError('');
    addToCart(product, activeColor.id, selectedSize, quantity, !buyNow);
    showToast(
      lang === 'ar'
        ? `تمت إضافة "${product.name.ar}" (${selectedSize}) إلى السلة`
        : `Added "${product.name.en}" (Size ${selectedSize}) to cart`
    );
    if (buyNow) {
      navigate('/checkout');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      showToast(
        lang === 'ar' ? 'يرجى كتابة الاسم والتعليق' : 'Please enter your name and review comment',
        'error'
      );
      return;
    }
    addProductReview(product.id, {
      author: reviewAuthor.trim(),
      city: city.name,
      rating: reviewRating,
      comment: { ar: reviewComment.trim(), en: reviewComment.trim() },
    });
    setReviewAuthor('');
    setReviewComment('');
    setReviewRating(5);
    showToast(lang === 'ar' ? 'شكراً لكِ! تم إضافة تقييمك التجريبي.' : 'Thank you! Your demo review has been posted.');
  };

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: l(product.name),
    sku: product.sku,
    description: l(product.description),
    brand: { '@type': 'Brand', name: 'LAYANA | ليانا' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'SAR',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <SeoHead title={l(product.name)} description={l(product.description)} jsonLd={productJsonLd} />

      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#777777] flex-wrap">
          <Link to="/" className="hover:text-[#581C32]">{t.home}</Link>
          <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          <Link to={`/category/${product.categorySlug}`} className="hover:text-[#581C32]">
            {l(storeService.getCategoryBySlug(product.categorySlug)?.name ?? product.collection)}
          </Link>
          <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          <span className="font-semibold text-[#202020] truncate max-w-[260px]">{l(product.name)}</span>
        </nav>

        {/* Contiguous Purchase Layout: Sticky Gallery + Sticky Purchase Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-28 space-y-3">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              {/* Thumbnails */}
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible no-scrollbar">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`${l(product.name)} image ${idx + 1}`}
                    className={`w-16 h-20 sm:w-18 sm:h-24 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${
                      activeImageIndex === idx ? 'border-[#581C32]' : 'border-[#EAE5DF] hover:border-[#C5A572]'
                    }`}
                  >
                    <SmartImage src={img} alt={`${l(product.name)} ${idx + 1}`} className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>

              {/* Main Portrait Image with Click-to-Zoom & Fullscreen */}
              <div className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden bg-white border border-[#EAE5DF]">
                <div
                  onClick={() => setZoomed((z) => !z)}
                  className={`w-full h-full cursor-zoom-in overflow-hidden`}
                >
                  <SmartImage
                    src={currentImage}
                    alt={l(product.name)}
                    priority
                    className={`w-full h-full object-cover object-top transition-transform duration-300 ${
                      zoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
                    }`}
                  />
                </div>

                {product.discountPercent > 0 && (
                  <span className="absolute top-3 start-3 bg-[#D92D39] text-white text-xs font-bold px-2.5 py-1 rounded">
                    -{product.discountPercent}%
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  aria-label={t.pdp.fullscreen}
                  className="absolute bottom-3 end-3 w-9 h-9 rounded-lg bg-white/95 hover:bg-white shadow-md flex items-center justify-center text-[#202020]"
                >
                  <Expand className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Purchase Module Column */}
          <div className="lg:col-span-6 xl:col-span-6 bg-white rounded-xl border border-[#EAE5DF] p-5 sm:p-7 space-y-5">
            {/* Collection, Title, SKU, Rating */}
            <div className="space-y-2 border-b border-[#EAE5DF] pb-4">
              <div className="flex items-center justify-between gap-2 text-xs text-[#777777]">
                <span className="font-semibold text-[#581C32]">{l(product.collection)}</span>
                <span className="tabular-nums">{t.pdp.sku}: {product.sku}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#202020] leading-snug">
                {l(product.name)}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#777777]">
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="inline-flex items-center gap-1 font-bold text-[#202020] hover:text-[#581C32]"
                >
                  <Star className="w-4 h-4 fill-[#C5A572] text-[#C5A572]" />
                  <span className="tabular-nums">{product.rating.toFixed(1)}</span>
                  <span className="text-[#777777] font-normal">({allReviews.length} {t.pdp.reviewsTab})</span>
                </button>
                <span>·</span>
                <span className={product.stockCount > 10 ? 'text-[#168653] font-semibold' : 'text-[#D92D39] font-semibold'}>
                  {product.stockCount > 10
                    ? t.inStock
                    : `${t.lowStock} (${product.stockCount})`}
                </span>
                {product.includesShayla && (
                  <>
                    <span>·</span>
                    <span className="text-[#581C32] font-medium">{t.includesShayla}</span>
                  </>
                )}
              </div>
            </div>

            {/* Pricing Block */}
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-3 flex-wrap tabular-nums">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#581C32]">
                  {formatPrice(product.price, lang)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#777777] line-through">
                    {formatPrice(product.originalPrice, lang)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-bold text-[#168653]">
                    {lang === 'ar' ? `وفّري ${product.discountPercent}%` : `Save ${product.discountPercent}%`}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#777777]">
                {t.vatInclusive} ·{' '}
                {lang === 'ar'
                  ? `أو 4 دفعات شهرية بقيمة ${formatPrice(Number((product.price / 4).toFixed(2)), lang)} عبر تابي أو تمارا (توضيحي)`
                  : `Or 4 interest-free payments of ${formatPrice(Number((product.price / 4).toFixed(2)), lang)} via Tabby/Tamara (demo)`}
              </p>
            </div>

            {/* Color Selection */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-[#202020]">
                {t.pdp.selectColor}: <span className="font-normal text-[#777777]">{l(activeColor.name)}</span>
              </p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedColorId(c.id);
                      setActiveImageIndex(0);
                    }}
                    aria-label={l(c.name)}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-transform ${
                      selectedColorId === c.id
                        ? 'border-[#581C32] scale-110 ring-2 ring-[#581C32]/20'
                        : 'border-[#EAE5DF] hover:border-[#C5A572]'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColorId === c.id && (
                      <Check
                        className={`w-4 h-4 ${
                          c.id === 'cream' || c.id === 'beige' ? 'text-[#202020]' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Abaya Length / Size Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-[#202020]">
                  {product.isLengthSized ? t.pdp.selectLength : t.pdp.selectSize}
                  {selectedSize && <span className="text-[#581C32] ms-1.5">({selectedSize})</span>}
                </p>
                {product.isLengthSized && (
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#581C32] hover:underline"
                  >
                    <Ruler className="w-4 h-4" />
                    <span>{t.pdp.sizeGuide}</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    disabled={!s.inStock}
                    onClick={() => {
                      setSelectedSize(s.label);
                      setValidationError('');
                    }}
                    className={`min-w-[48px] h-10 px-3 rounded-lg border text-sm font-bold tabular-nums transition-colors ${
                      !s.inStock
                        ? 'bg-[#F8F4ED] text-[#777777]/50 border-[#EAE5DF] line-through cursor-not-allowed'
                        : selectedSize === s.label
                          ? 'bg-[#581C32] text-white border-[#581C32]'
                          : 'bg-white text-[#202020] border-[#EAE5DF] hover:border-[#581C32]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {validationError && (
                <p role="alert" className="text-xs font-semibold text-[#D92D39]">
                  {validationError}
                </p>
              )}
            </div>

            {/* Quantity & Primary Actions */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#202020]">{t.pdp.quantity}:</span>
                <div className="inline-flex items-center border border-[#EAE5DF] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-9 h-9 flex items-center justify-center hover:bg-[#F8F4ED]"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                    className="w-9 h-9 flex items-center justify-center hover:bg-[#F8F4ED]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => validateAndAdd(false)}
                  className="h-12 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.addToCart}</span>
                </button>
                <button
                  type="button"
                  onClick={() => validateAndAdd(true)}
                  className="h-12 rounded-lg bg-[#C5A572] hover:bg-[#b59460] text-[#202020] text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <span>{t.buyNow}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    toggleWishlist(product.id);
                    showToast(
                      wishlisted
                        ? lang === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from wishlist'
                        : lang === 'ar' ? 'تمت الإضافة إلى المفضلة' : 'Saved to wishlist',
                      'info'
                    );
                  }}
                  className={`flex-1 h-10 rounded-lg border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                    wishlisted
                      ? 'border-[#D92D39] text-[#D92D39] bg-[#D92D39]/5'
                      : 'border-[#EAE5DF] text-[#202020] hover:border-[#581C32]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#D92D39]' : ''}`} />
                  <span>{t.wishlist}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleCompare(product.id);
                    showToast(
                      compared
                        ? lang === 'ar' ? 'تمت الإزالة من المقارنة' : 'Removed from compare'
                        : lang === 'ar' ? 'أُضيف للمقارنة' : 'Added to compare',
                      'info'
                    );
                  }}
                  className={`flex-1 h-10 rounded-lg border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                    compared
                      ? 'border-[#581C32] text-[#581C32] bg-[#581C32]/5'
                      : 'border-[#EAE5DF] text-[#202020] hover:border-[#581C32]'
                  }`}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>{t.compare}</span>
                </button>
              </div>
            </div>

            {/* Delivery Estimator & Trust Card */}
            <div className="rounded-lg bg-[#F8F4ED] border border-[#EAE5DF] p-4 space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#581C32] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#202020]">
                    {t.pdp.deliveryToCity} {l(city.name)}
                  </p>
                  <p className="text-[#777777] mt-0.5">
                    {lang === 'ar'
                      ? `توصيل سريع خلال ${city.expressDays} يوم أو قياسي خلال ${city.standardDays} أيام عمل (تقدير تجريبي).`
                      : `Express in ${city.expressDays} day(s) or standard in ${city.standardDays} business days (demo estimate).`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-[#777777]">
                <Truck className="w-4 h-4 text-[#168653] shrink-0" />
                <span>{l(product.deliveryEstimate)}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#777777]">
                <RefreshCw className="w-4 h-4 text-[#581C32] shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'استبدال واسترجاع خلال 14 يوماً وفق سياسة المتجر التجريبية.'
                    : '14-day exchange & return under draft demo store policy.'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[#777777]">
                <ShieldCheck className="w-4 h-4 text-[#581C32] shrink-0" />
                <span>
                  {lang === 'ar'
                    ? `القماش: ${l(product.fabric)} · القصّة: ${l(product.style)}`
                    : `Fabric: ${l(product.fabric)} · Cut: ${l(product.style)}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs: Description / Fabric & Care / Shipping / Reviews */}
        <section className="bg-white rounded-xl border border-[#EAE5DF] overflow-hidden">
          <div role="tablist" className="flex overflow-x-auto no-scrollbar border-b border-[#EAE5DF]">
            {(
              [
                { id: 'desc', label: t.pdp.descriptionTab },
                { id: 'care', label: t.pdp.fabricCareTab },
                { id: 'shipping', label: t.pdp.shippingTab },
                { id: 'reviews', label: `${t.pdp.reviewsTab} (${allReviews.length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#581C32] text-[#581C32]'
                    : 'border-transparent text-[#777777] hover:text-[#202020]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-7 text-sm text-[#202020] leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-3xl">
                <p>{l(product.description)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-[#F8F4ED]">
                    <span className="text-[#777777] block">{t.filters.fabric}</span>
                    <span className="font-bold mt-0.5 block">{l(product.fabric)}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F8F4ED]">
                    <span className="text-[#777777] block">{t.filters.style}</span>
                    <span className="font-bold mt-0.5 block">{l(product.style)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <ul className="space-y-2.5 max-w-2xl text-sm list-disc ps-5">
                {product.careInstructions.map((line, i) => (
                  <li key={i}>{l(line)}</li>
                ))}
              </ul>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 max-w-3xl text-xs sm:text-sm text-[#777777]">
                <p className="font-bold text-[#202020]">
                  {lang === 'ar'
                    ? 'مسودة سياسة الشحن والاسترجاع (توضيحية)'
                    : 'Draft Shipping & Return Summary (Illustrative)'}
                </p>
                <p>
                  {lang === 'ar'
                    ? 'تتوفر خدمة التوصيل لجميع مدن المملكة العربية السعودية خلال 1–4 أيام عمل. شحن قياسي مجاني للطلبات فوق 399 ر.س.'
                    : 'Delivery covers all Saudi Arabian cities within 1–4 business days. Free standard shipping applies on demo orders above SAR 399.'}
                </p>
                <p>
                  {lang === 'ar'
                    ? 'يمكن استبدال أو استرجاع العباية خلال 14 يوماً بشرط بقائها بحالتها الأصلية ومع البطاقة المرفقة.'
                    : 'Abayas may be exchanged or returned within 14 days in original unworn condition with attached tags.'}
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  {allReviews.map((rev) => (
                    <div key={rev.id} className="pb-4 border-b border-[#EAE5DF] last:border-b-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#202020]">{rev.author}</span>
                          <span className="text-xs text-[#777777]">· {l(rev.city)}</span>
                        </div>
                        <span className="text-xs text-[#777777] tabular-nums">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`w-3.5 h-3.5 ${
                              n <= rev.rating ? 'fill-[#C5A572] text-[#C5A572]' : 'text-[#EAE5DF]'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-[#202020]/90">{l(rev.comment)}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmitReview} className="lg:col-span-5 bg-[#F8F4ED] rounded-xl p-5 space-y-3.5">
                  <h3 className="text-sm font-bold text-[#202020]">{t.pdp.writeReview}</h3>
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {lang === 'ar' ? 'الاسم' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: سارة العتيبي' : 'e.g. Sarah Al-Otaibi'}
                      className="w-full h-10 px-3 rounded-lg bg-white border border-[#EAE5DF] text-xs"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold mb-1">
                      {t.filters.rating}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewRating(n)}
                          aria-label={`${n} stars`}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              n <= reviewRating ? 'fill-[#C5A572] text-[#C5A572]' : 'text-[#CCCCCC]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {lang === 'ar' ? 'تجربتك مع المنتج' : 'Your Review'}
                    </label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={lang === 'ar' ? 'اكتبي رأيك في القماش والمقاس...' : 'Share your thoughts on fabric and length fit...'}
                      className="w-full p-3 rounded-lg bg-white border border-[#EAE5DF] text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-10 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-xs font-bold"
                  >
                    {t.pdp.submitReview}
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#202020] mb-4">{t.pdp.similarProducts}</h2>
            <ProductCarousel products={similarProducts} />
          </section>
        )}

        {/* You May Also Like */}
        {crossSellProducts.length > 0 && (
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#202020] mb-4">{t.pdp.youMayAlsoLike}</h2>
            <ProductCarousel products={crossSellProducts} />
          </section>
        )}

        {/* Recently Viewed */}
        {recentProducts.length > 0 && (
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#202020] mb-4">{t.sections.recentlyViewed}</h2>
            <ProductCarousel products={recentProducts} />
          </section>
        )}
      </div>

      {/* Mobile Sticky Bottom Add to Cart & Buy Now Action Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#EAE5DF] px-3 py-2.5 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center gap-2">
        <div className="shrink-0 pe-1">
          <p className="text-[10px] text-[#777777]">{lang === 'ar' ? 'السعر' : 'Price'}</p>
          <p className="text-sm font-extrabold text-[#581C32] tabular-nums">
            {formatPrice(product.price, lang)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => validateAndAdd(false)}
          className="flex-1 h-11 rounded-lg bg-[#581C32] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t.addToCart}</span>
        </button>
        <button
          type="button"
          onClick={() => validateAndAdd(true)}
          className="flex-1 h-11 rounded-lg bg-[#C5A572] text-[#202020] text-xs font-bold"
        >
          {t.buyNow}
        </button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={l(product.name)}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen gallery"
            className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-2xl max-h-[88vh] flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={currentImage}
              alt={l(product.name)}
              className="max-h-[75vh] w-auto object-contain rounded-lg"
            />
            <div className="flex gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={`${img}-lb-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-18 rounded overflow-hidden border-2 ${
                    activeImageIndex === idx ? 'border-[#C5A572]' : 'border-white/30'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
