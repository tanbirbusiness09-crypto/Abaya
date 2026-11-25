import { ArrowLeftRight, Eye, Heart, ShoppingBag, Star, Truck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../data/products';
import { formatPrice } from '../../utils/catalogLogic';
import { SmartImage } from '../ui/SmartImage';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { lang, l, t } = useLocale();
  const {
    isWishlisted,
    toggleWishlist,
    setQuickViewProduct,
    addToCart,
    compareIds,
    toggleCompare,
    showToast,
  } = useStore();

  const [selectedColorId, setSelectedColorId] = useState(product.colors[0]?.id ?? 'black');
  const [isHovered, setIsHovered] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const compared = compareIds.includes(product.id);

  const activeColor = product.colors.find((c) => c.id === selectedColorId) ?? product.colors[0];
  const primarySrc = activeColor?.image || product.images[0];
  const alternateSrc = product.images[1] && product.images[1] !== primarySrc ? product.images[1] : primarySrc;

  const badgeLabel =
    product.badge === 'flash'
      ? t.badges.flash
      : product.badge === 'new'
        ? t.badges.new
        : product.badge === 'bestseller'
          ? t.badges.bestseller
          : product.discountPercent > 0
            ? `${product.discountPercent}%-`
            : null;

  const handleQuickAction = () => {
    if (!product.isLengthSized) {
      addToCart(product, activeColor.id, product.sizes[0]?.label ?? 'One Size', 1, true);
      showToast(
        lang === 'ar'
          ? `تمت إضافة "${product.name.ar}" إلى سلتك`
          : `Added "${product.name.en}" to your cart`
      );
    } else {
      setQuickViewProduct(product);
    }
  };

  return (
    <article
      className="group bg-white rounded-xl sm:rounded-lg border border-[#EAE5DF] hover:border-[#C5A572] shadow-[0_1px_3px_rgba(32,32,32,0.03)] sm:shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Portrait 3:4 Fashion Photography Frame */}
      <div className="relative aspect-[3/4] bg-[#F8F4ED] overflow-hidden">
        <Link
          to={`/product/${product.slug}`}
          className="block w-full h-full"
          aria-label={l(product.name)}
        >
          <SmartImage
            src={primarySrc}
            alt={l(product.name)}
            fallbackTitle={l(product.name)}
            className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
              isHovered && alternateSrc !== primarySrc ? 'md:opacity-0' : 'opacity-100'
            }`}
          />
          {alternateSrc !== primarySrc && (
            <SmartImage
              src={alternateSrc}
              alt={`${l(product.name)} — ${lang === 'ar' ? 'زاوية أخرى' : 'alternate view'}`}
              className={`hidden md:block absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </Link>

        {/* Single quiet status label (top start) */}
        {badgeLabel && (
          <span
            className={`absolute top-1.5 sm:top-2 start-1.5 sm:start-2 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold tracking-tight ${
              product.badge === 'flash' || product.badge === 'sale' || (!product.badge && product.discountPercent > 0)
                ? 'bg-[#D92D39] text-white'
                : product.badge === 'new'
                  ? 'bg-[#581C32] text-white'
                  : 'bg-[#202020]/88 text-[#F8F4ED]'
            }`}
          >
            {badgeLabel}
          </span>
        )}

        {/* Wishlist & Compare controls (top end) */}
        <div className="absolute top-1.5 sm:top-2 end-1.5 sm:end-2 flex flex-col gap-1.5">
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
            aria-label={
              wishlisted
                ? `${lang === 'ar' ? 'إزالة من المفضلة' : 'Remove from wishlist'}: ${l(product.name)}`
                : `${lang === 'ar' ? 'إضافة إلى المفضلة' : 'Add to wishlist'}: ${l(product.name)}`
            }
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center text-[#202020] active:scale-90 transition-all"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                wishlisted ? 'fill-[#D92D39] text-[#D92D39]' : 'text-[#202020]'
              }`}
            />
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
            aria-label={`${t.compare}: ${l(product.name)}`}
            className={`hidden sm:flex w-8 h-8 rounded-full shadow-sm items-center justify-center transition-all ${
              compared
                ? 'bg-[#581C32] text-white opacity-100'
                : 'bg-white/95 hover:bg-white text-[#777777] hover:text-[#581C32] opacity-0 group-hover:opacity-100 focus:opacity-100'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop Quick View trigger on hover */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(product)}
          aria-label={`${t.quickView}: ${l(product.name)}`}
          className="hidden md:inline-flex items-center justify-center gap-1.5 absolute bottom-2 inset-x-2 py-2 rounded-md bg-white/95 hover:bg-[#581C32] text-[#202020] hover:text-white text-xs font-semibold shadow-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 focus:opacity-100 transition-all duration-150"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t.quickView}</span>
        </button>

        {/* Rating badge cleanly tucked bottom-start */}
        <div className="absolute bottom-1.5 sm:bottom-2 start-1.5 sm:start-2 md:group-hover:opacity-0 transition-opacity inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 rounded bg-white/95 text-[10px] sm:text-[11px] font-bold text-[#202020] shadow-xs tabular-nums">
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#168653] text-[#168653]" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-[#777777] font-normal hidden sm:inline">({product.reviewCount})</span>
        </div>
      </div>

      {/* Compact, Android-app conversion body with strict 2-line title clamp */}
      <div className={`flex flex-col flex-1 justify-between ${compact ? 'p-2 gap-1.5' : 'p-2.5 sm:p-3 gap-1.5 sm:gap-2'}`}>
        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          <p className="text-[10px] sm:text-[11px] text-[#777777] truncate">{l(product.collection)}</p>
          <Link
            to={`/product/${product.slug}`}
            className="block group/title"
            title={l(product.name)}
          >
            <h3 className="clamp-2 text-[12px] sm:text-[13px] font-semibold text-[#202020] group-hover/title:text-[#581C32] leading-[1.35] h-[2.7em]">
              {l(product.name)}
            </h3>
          </Link>
        </div>

        <div className="space-y-1.5 sm:space-y-2 pt-0.5">
          {/* Price row — compact single-line discipline on mobile */}
          <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap tabular-nums">
            <span className="text-[13px] sm:text-[15px] font-extrabold text-[#202020]">
              {formatPrice(product.price, lang)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-[11px] text-[#777777] line-through">
                {formatPrice(product.originalPrice, lang)}
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="text-[10px] sm:text-[11px] font-bold text-[#168653]">
                <span className="sm:hidden">-{product.discountPercent}%</span>
                <span className="hidden sm:inline">
                  {lang === 'ar' ? `وفّري ${product.discountPercent}%` : `${product.discountPercent}% OFF`}
                </span>
              </span>
            )}
          </div>

          {/* Swatches + Quick Delivery */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColorId(color.id)}
                  aria-label={`${l(product.name)} - ${l(color.name)}`}
                  title={l(color.name)}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-transform ${
                    selectedColorId === color.id
                      ? 'border-[#581C32] ring-1 ring-[#581C32] scale-110'
                      : 'border-[#EAE5DF]'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-[#777777]">+{product.colors.length - 4}</span>
              )}
            </div>
            <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] font-medium text-[#168653] shrink-0">
              <Truck className="w-3 h-3 shrink-0" />
              <span>{lang === 'ar' ? 'سريع' : 'Express'}</span>
            </span>
          </div>

          {/* Primary Action */}
          <button
            type="button"
            onClick={handleQuickAction}
            className="w-full h-8 sm:h-9 rounded-lg sm:rounded-md border border-[#581C32] text-[#581C32] hover:bg-[#581C32] hover:text-white active:scale-[0.98] text-[11px] sm:text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>{product.isLengthSized ? t.selectOptions : t.addToCart}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
