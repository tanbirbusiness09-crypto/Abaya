import { Check, Heart, Ruler, ShoppingBag, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/catalogLogic';
import { SmartImage } from './SmartImage';

export function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setSizeGuideOpen,
    showToast,
  } = useStore();
  const { lang, l, t } = useLocale();

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colors[0]?.id ?? 'black');
      setSelectedSize(quickViewProduct.isLengthSized ? '' : quickViewProduct.sizes[0]?.label ?? 'One Size');
      setValidationError('');
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const activeColor =
    quickViewProduct.colors.find((c) => c.id === selectedColor) ?? quickViewProduct.colors[0];
  const wishlisted = isWishlisted(quickViewProduct.id);

  const handleAdd = () => {
    if (!selectedSize) {
      setValidationError(t.pdp.validationRequired);
      return;
    }
    addToCart(quickViewProduct, activeColor.id, selectedSize, 1, true);
    showToast(
      lang === 'ar'
        ? `تمت إضافة "${quickViewProduct.name.ar}" إلى سلتك`
        : `Added "${quickViewProduct.name.en}" to your cart`
    );
    setQuickViewProduct(null);
  };

  return (
    <div
      className="fixed inset-0 z-[75] bg-black/55 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={l(quickViewProduct.name)}
      onClick={() => setQuickViewProduct(null)}
    >
      <div
        className="bg-white rounded-xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-[#EAE5DF] shadow-2xl grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-[#F8F4ED] aspect-[3/4] md:aspect-auto">
          <SmartImage
            src={activeColor?.image || quickViewProduct.images[0]}
            alt={l(quickViewProduct.name)}
            className="w-full h-full object-cover"
            priority
          />
          {quickViewProduct.discountPercent > 0 && (
            <span className="absolute top-3 start-3 bg-[#D92D39] text-white text-xs font-bold px-2 py-1 rounded">
              -{quickViewProduct.discountPercent}%
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#777777]">{l(quickViewProduct.collection)}</p>
                <h2 className="text-lg font-bold text-[#202020] leading-snug mt-0.5">
                  {l(quickViewProduct.name)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setQuickViewProduct(null)}
                aria-label={lang === 'ar' ? 'إغلاق النظرة السريعة' : 'Close quick view'}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#777777] hover:bg-[#F8F4ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#777777]">
              <span className="inline-flex items-center gap-1 text-[#202020] font-semibold">
                <Star className="w-3.5 h-3.5 fill-[#C5A572] text-[#C5A572]" />
                {quickViewProduct.rating.toFixed(1)}
              </span>
              <span>({quickViewProduct.reviewCount})</span>
              <span>·</span>
              <span>{quickViewProduct.sku}</span>
            </div>

            <div className="flex items-baseline gap-2.5 flex-wrap tabular-nums">
              <span className="text-xl font-bold text-[#581C32]">
                {formatPrice(quickViewProduct.price, lang)}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-sm text-[#777777] line-through">
                  {formatPrice(quickViewProduct.originalPrice, lang)}
                </span>
              )}
              <span className="text-[11px] text-[#777777]">{t.vatInclusive}</span>
            </div>

            <p className="text-xs text-[#777777] leading-relaxed line-clamp-3">
              {l(quickViewProduct.description)}
            </p>

            {/* Color selector */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#202020]">
                {t.pdp.selectColor}: <span className="font-normal text-[#777777]">{l(activeColor.name)}</span>
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {quickViewProduct.colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.id)}
                    aria-label={l(c.name)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform ${
                      selectedColor === c.id
                        ? 'border-[#581C32] scale-110 ring-2 ring-[#581C32]/20'
                        : 'border-[#EAE5DF]'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColor === c.id && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          c.id === 'cream' || c.id === 'beige' ? 'text-[#202020]' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Length / Size selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#202020]">
                  {quickViewProduct.isLengthSized ? t.pdp.selectLength : t.pdp.selectSize}
                </p>
                {quickViewProduct.isLengthSized && (
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-xs text-[#581C32] hover:underline font-medium"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{t.pdp.sizeGuide}</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {quickViewProduct.sizes.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    disabled={!s.inStock}
                    onClick={() => {
                      setSelectedSize(s.label);
                      setValidationError('');
                    }}
                    className={`min-w-[42px] h-9 px-2.5 rounded-md text-xs font-semibold border transition-colors tabular-nums ${
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
                <p className="text-xs font-medium text-[#D92D39]">{validationError}</p>
              )}
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-[#EAE5DF]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 h-11 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToCart}</span>
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct.id)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors ${
                  wishlisted
                    ? 'border-[#581C32] bg-[#581C32]/5 text-[#581C32]'
                    : 'border-[#EAE5DF] text-[#777777] hover:text-[#581C32]'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#581C32]' : ''}`} />
              </button>
            </div>
            <Link
              to={`/product/${quickViewProduct.slug}`}
              onClick={() => setQuickViewProduct(null)}
              className="block w-full text-center text-xs font-semibold text-[#581C32] hover:underline py-1"
            >
              {lang === 'ar' ? 'عرض جميع تفاصيل المنتج والصور ←' : 'View Full Product Details & Gallery →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
