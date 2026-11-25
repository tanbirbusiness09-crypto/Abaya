import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/catalogLogic';
import { SmartImage } from '../ui/SmartImage';

export function CartDrawer() {
  const {
    cart,
    cartTotals,
    isCartDrawerOpen,
    setCartDrawerOpen,
    updateCartQty,
    removeFromCart,
  } = useStore();
  const { lang, l, t } = useLocale();

  if (!isCartDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={t.cartPage.title}
      onClick={() => setCartDrawerOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EAE5DF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#581C32]" />
            <h2 className="text-base font-bold text-[#202020]">
              {t.cartPage.title} ({cartTotals.itemCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCartDrawerOpen(false)}
            aria-label={lang === 'ar' ? 'إغلاق السلة' : 'Close cart drawer'}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#777777] hover:bg-[#F8F4ED]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress */}
        {cart.length > 0 && (
          <div className="px-5 py-3 bg-[#F8F4ED] border-b border-[#EAE5DF]">
            <div className="flex items-center gap-2 text-xs font-medium text-[#202020] mb-1.5">
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
            <div className="w-full h-1.5 bg-[#EAE5DF] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#168653] transition-all duration-300"
                style={{ width: `${cartTotals.freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-[#F8F4ED] flex items-center justify-center text-[#581C32] mb-4">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#202020]">{t.cartPage.emptyTitle}</h3>
              <p className="text-xs text-[#777777] mt-1.5 max-w-xs leading-relaxed">
                {t.cartPage.emptyDesc}
              </p>
              <Link
                to="/products"
                onClick={() => setCartDrawerOpen(false)}
                className="mt-5 px-6 py-2.5 rounded-lg bg-[#581C32] text-white text-sm font-semibold hover:bg-[#3D1023]"
              >
                {t.shopNow}
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.key} className="flex gap-3 pb-4 border-b border-[#EAE5DF] last:border-b-0">
                <Link
                  to={`/product/${item.slug}`}
                  onClick={() => setCartDrawerOpen(false)}
                  className="w-20 h-26 rounded-md overflow-hidden bg-[#F8F4ED] shrink-0 border border-[#EAE5DF]"
                >
                  <SmartImage src={item.image} alt={l(item.name)} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={() => setCartDrawerOpen(false)}
                        className="text-xs font-semibold text-[#202020] hover:text-[#581C32] line-clamp-2"
                      >
                        {l(item.name)}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        aria-label={`${t.cartPage.remove} ${l(item.name)}`}
                        className="text-[#777777] hover:text-[#D92D39] p-1 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#777777] mt-1">
                      {l(item.colorName)} · {lang === 'ar' ? 'المقاس' : 'Size'}: {item.size}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="inline-flex items-center border border-[#EAE5DF] rounded-md">
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.key, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-7 h-7 flex items-center justify-center text-[#202020] hover:bg-[#F8F4ED]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.key, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-7 h-7 flex items-center justify-center text-[#202020] hover:bg-[#F8F4ED]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-[#581C32] tabular-nums">
                      {formatPrice(item.price * item.quantity, lang)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#EAE5DF] bg-[#F8F4ED]/60 space-y-3">
            <div className="space-y-1.5 text-xs tabular-nums">
              <div className="flex justify-between text-[#777777]">
                <span>{t.cartPage.subtotal}</span>
                <span className="font-semibold text-[#202020]">{formatPrice(cartTotals.subtotal, lang)}</span>
              </div>
              {cartTotals.discount > 0 && (
                <div className="flex justify-between text-[#168653]">
                  <span>{t.cartPage.discount}</span>
                  <span>-{formatPrice(cartTotals.discount, lang)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#777777]">
                <span>{t.cartPage.shipping}</span>
                <span className={cartTotals.shipping === 0 ? 'text-[#168653] font-semibold' : ''}>
                  {cartTotals.shipping === 0 ? t.cartPage.free : formatPrice(cartTotals.shipping, lang)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#202020] pt-2 border-t border-[#EAE5DF]">
                <span>{t.cartPage.total}</span>
                <span className="text-[#581C32]">{formatPrice(cartTotals.total, lang)}</span>
              </div>
              <p className="text-[11px] text-[#777777]">{t.vatInclusive}</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/cart"
                onClick={() => setCartDrawerOpen(false)}
                className="h-11 rounded-lg border border-[#581C32] text-[#581C32] hover:bg-[#581C32]/5 text-xs font-bold flex items-center justify-center"
              >
                {t.cartPage.title}
              </Link>
              <Link
                to="/checkout"
                onClick={() => setCartDrawerOpen(false)}
                className="h-11 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-xs font-bold flex items-center justify-center"
              >
                {t.cartPage.proceedCheckout}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
