import { Heart, Minus, Plus, ShoppingBag, Tag, Trash2, Truck, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCarousel } from '../components/product/ProductCarousel';
import { SeoHead } from '../components/ui/SeoHead';
import { SmartImage } from '../components/ui/SmartImage';
import { useLocale } from '../context/LocaleContext';
import { useStore } from '../context/StoreContext';
import { DEMO_COUPONS } from '../data/storeConfig';
import { storeService } from '../services/storeService';
import { formatPrice } from '../utils/catalogLogic';

export function CartPage() {
  const { lang, l, t } = useLocale();
  const {
    cart,
    cartTotals,
    couponCode,
    updateCartQty,
    removeFromCart,
    toggleWishlist,
    isWishlisted,
    applyCoupon,
    removeCoupon,
    showToast,
  } = useStore();

  const [couponInput, setCouponInput] = useState(couponCode ?? '');
  const [couponError, setCouponError] = useState('');

  const related = storeService.getCrossSellProducts(
    cart.map((i) => i.productId),
    8
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCoupon(couponInput);
    if (res.ok) {
      setCouponError('');
      showToast(lang === 'ar' ? 'تم تطبيق كود الخصم التجريبي بنجاح' : 'Demo promo code applied');
    } else if (res.reason === 'min_subtotal') {
      setCouponError(
        lang === 'ar'
          ? `الحد الأدنى لتطبيق هذا الكوبون هو ${formatPrice(res.minSubtotal ?? 0, lang)}`
          : `Minimum order for this code is ${formatPrice(res.minSubtotal ?? 0, lang)}`
      );
    } else {
      setCouponError(
        lang === 'ar'
          ? 'كود الخصم غير صحيح. جرّبي: LAYANA15 أو WELCOME10'
          : 'Invalid promo code. Try LAYANA15 or WELCOME10'
      );
    }
  };

  return (
    <>
      <SeoHead title={t.cartPage.title} />
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-6 space-y-10">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#202020]">
            {t.cartPage.title} ({cartTotals.itemCount})
          </h1>
          <Link to="/products" className="text-xs sm:text-sm font-bold text-[#581C32] hover:underline">
            {t.cartPage.continueShopping}
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#EAE5DF] p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F8F4ED] flex items-center justify-center text-[#581C32]">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-[#202020]">{t.cartPage.emptyTitle}</h2>
            <p className="text-xs sm:text-sm text-[#777777] max-w-md mx-auto">{t.cartPage.emptyDesc}</p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-sm font-bold"
            >
              {t.shopNow}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Cart Items Column */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free shipping bar */}
              <div className="bg-white rounded-xl border border-[#EAE5DF] p-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#202020] mb-2">
                  <Truck className="w-4 h-4 text-[#168653] shrink-0" />
                  <span>
                    {cartTotals.amountToFreeShipping === 0
                      ? t.cartPage.freeShippingUnlocked
                      : t.cartPage.freeShippingRemaining.replace(
                          '{amount}',
                          formatPrice(cartTotals.amountToFreeShipping, lang)
                        )}
                  </span>
                </div>
                <div className="w-full h-2 bg-[#F8F4ED] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#168653] transition-all duration-300"
                    style={{ width: `${cartTotals.freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-xl border border-[#EAE5DF] divide-y divide-[#EAE5DF]">
                {cart.map((item) => (
                  <div key={item.key} className="p-4 sm:p-5 flex gap-4">
                    <Link
                      to={`/product/${item.slug}`}
                      className="w-24 sm:w-28 aspect-[3/4] rounded-lg overflow-hidden bg-[#F8F4ED] border border-[#EAE5DF] shrink-0"
                    >
                      <SmartImage src={item.image} alt={l(item.name)} className="w-full h-full object-cover object-top" />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${item.slug}`}
                            className="text-sm sm:text-base font-bold text-[#202020] hover:text-[#581C32] line-clamp-2"
                          >
                            {l(item.name)}
                          </Link>
                          <p className="text-sm sm:text-base font-extrabold text-[#581C32] tabular-nums shrink-0">
                            {formatPrice(item.price * item.quantity, lang)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#777777] mt-1.5">
                          <span className="inline-flex items-center gap-1">
                            <span
                              className="w-3 h-3 rounded-full border border-[#EAE5DF]"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            {l(item.colorName)}
                          </span>
                          <span>·</span>
                          <span>
                            {lang === 'ar' ? 'المقاس / الطول' : 'Size / Length'}: <strong>{item.size}</strong>
                          </span>
                          <span>·</span>
                          <span className="tabular-nums">{item.sku}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="inline-flex items-center border border-[#EAE5DF] rounded-lg">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.key, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#F8F4ED]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-9 text-center text-xs font-bold tabular-nums">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.key, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#F8F4ED]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              if (!isWishlisted(item.productId)) toggleWishlist(item.productId);
                              removeFromCart(item.key);
                              showToast(
                                lang === 'ar' ? 'تم نقل المنتج إلى المفضلة' : 'Moved item to wishlist',
                                'info'
                              );
                            }}
                            className="inline-flex items-center gap-1 text-[#777777] hover:text-[#581C32] font-medium"
                          >
                            <Heart className="w-3.5 h-3.5" />
                            <span>{t.cartPage.moveToWishlist}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.key)}
                            className="inline-flex items-center gap-1 text-[#777777] hover:text-[#D92D39] font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{t.cartPage.remove}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:col-span-4 bg-white rounded-xl border border-[#EAE5DF] p-5 sm:p-6 space-y-5 lg:sticky lg:top-28">
              <h2 className="text-base font-bold text-[#202020] pb-3 border-b border-[#EAE5DF]">
                {t.cartPage.orderSummary}
              </h2>

              {/* Coupon Form */}
              <div className="space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-[#777777] absolute start-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={t.cartPage.couponPlaceholder}
                      aria-label={t.cartPage.couponPlaceholder}
                      className="w-full h-10 ps-9 pe-3 rounded-lg border border-[#EAE5DF] bg-[#F8F4ED]/50 text-xs uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-lg bg-[#202020] hover:bg-[#581C32] text-white text-xs font-bold whitespace-nowrap transition-colors"
                  >
                    {t.cartPage.applyCoupon}
                  </button>
                </form>

                {couponError && <p className="text-xs text-[#D92D39]">{couponError}</p>}

                {cartTotals.appliedCoupon && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#168653]/10 text-[#168653] text-xs font-semibold">
                    <span>
                      {cartTotals.appliedCoupon.code} — {l(cartTotals.appliedCoupon.description)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        removeCoupon();
                        setCouponInput('');
                      }}
                      aria-label={t.cartPage.removeCoupon}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {DEMO_COUPONS.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCouponInput(c.code);
                        applyCoupon(c.code);
                      }}
                      className="px-2 py-1 rounded border border-dashed border-[#C5A572] text-[11px] font-semibold text-[#581C32] hover:bg-[#F8F4ED]"
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2.5 text-sm tabular-nums pt-3 border-t border-[#EAE5DF]">
                <div className="flex justify-between text-[#777777]">
                  <span>{t.cartPage.subtotal}</span>
                  <span className="font-semibold text-[#202020]">{formatPrice(cartTotals.subtotal, lang)}</span>
                </div>
                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-[#168653] font-semibold">
                    <span>{t.cartPage.discount}</span>
                    <span>-{formatPrice(cartTotals.discount, lang)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#777777]">
                  <span>{t.cartPage.shipping}</span>
                  <span className={cartTotals.shipping === 0 ? 'text-[#168653] font-bold' : 'text-[#202020]'}>
                    {cartTotals.shipping === 0 ? t.cartPage.free : formatPrice(cartTotals.shipping, lang)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#777777]">
                  <span>{t.cartPage.vatIncludedLabel}</span>
                  <span>{formatPrice(cartTotals.vatIncluded, lang)}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-[#202020] pt-3 border-t border-[#EAE5DF]">
                  <span>{t.cartPage.total}</span>
                  <span className="text-[#581C32]">{formatPrice(cartTotals.total, lang)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full h-12 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-sm font-bold flex items-center justify-center transition-colors"
              >
                {t.cartPage.proceedCheckout}
              </Link>
            </aside>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#202020] mb-4">{t.cartPage.relatedTitle}</h2>
            <ProductCarousel products={related} />
          </section>
        )}
      </div>
    </>
  );
}
