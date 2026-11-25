import { CheckCircle2, MapPin, Package, Truck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { SeoHead } from '../components/ui/SeoHead';
import { SmartImage } from '../components/ui/SmartImage';
import { useLocale } from '../context/LocaleContext';
import { useStore } from '../context/StoreContext';
import { PAYMENT_METHODS, SAUDI_CITIES } from '../data/storeConfig';
import { formatPrice } from '../utils/catalogLogic';

export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { lang, l, t } = useLocale();
  const { getOrderById } = useStore();

  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <SeoHead title={t.checkout.orderConfirmed} />
        <h1 className="text-2xl font-bold text-[#202020]">
          {lang === 'ar' ? 'الطلب غير موجود' : 'Order Not Found'}
        </h1>
        <Link to="/" className="inline-block px-6 py-3 rounded-lg bg-[#581C32] text-white text-sm font-bold">
          {t.home}
        </Link>
      </div>
    );
  }

  const cityObj = SAUDI_CITIES.find((c) => c.id === order.address.cityId) ?? SAUDI_CITIES[0];
  const paymentObj = PAYMENT_METHODS.find((p) => p.id === order.paymentMethodId);

  return (
    <>
      <SeoHead title={`${t.checkout.orderConfirmed} #${order.id}`} />
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
        <div className="bg-white rounded-xl border border-[#EAE5DF] p-6 sm:p-8 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#168653]/10 text-[#168653] flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <p className="text-xs font-bold text-[#168653]">
            {lang === 'ar' ? 'تأكيد طلب تجريبي — لا يوجد خصم مالي فعلي' : 'Demonstration Order Confirmation — No Real Charge'}
          </p>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#202020]">
            {t.checkout.orderConfirmed}
          </h1>
          <p className="text-sm text-[#777777]">
            {t.checkout.orderNumber}:{' '}
            <strong className="text-[#581C32] tabular-nums">{order.id}</strong>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to={`/order-tracking?order=${order.id}`}
              className="px-6 py-2.5 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-sm font-bold inline-flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>{t.checkout.trackOrder}</span>
            </Link>
            <Link
              to="/products"
              className="px-6 py-2.5 rounded-lg border border-[#EAE5DF] hover:border-[#581C32] text-sm font-bold text-[#202020]"
            >
              {t.cartPage.continueShopping}
            </Link>
          </div>
        </div>

        {/* Shipping & Receipt Details */}
        <div className="bg-white rounded-xl border border-[#EAE5DF] p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pb-5 border-b border-[#EAE5DF]">
            <div className="space-y-1">
              <p className="font-bold text-[#202020] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#581C32]" />
                {t.checkout.shippingSection}
              </p>
              <p className="text-[#777777]">{order.customer.fullName}</p>
              <p className="text-[#777777]" dir="ltr">{order.customer.phone}</p>
              <p className="text-[#777777]">
                {l(cityObj.name)}, {order.address.district}, {order.address.street} #{order.address.building} ({order.address.postalCode})
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-[#202020] flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#581C32]" />
                {lang === 'ar' ? 'تفاصيل الدفع والتوصيل' : 'Payment & Delivery'}
              </p>
              <p className="text-[#777777]">
                {lang === 'ar' ? 'طريقة الدفع:' : 'Payment:'} {paymentObj ? l(paymentObj.name) : order.paymentMethodId}
              </p>
              <p className="text-[#777777]">
                {lang === 'ar' ? 'التسليم المتوقع:' : 'Est. Delivery:'} <strong className="tabular-nums">{order.estimatedDelivery}</strong>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.key} className="flex items-center gap-3">
                <div className="w-12 h-16 rounded overflow-hidden bg-[#F8F4ED] shrink-0">
                  <SmartImage src={item.image} alt={l(item.name)} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-bold text-[#202020]">{l(item.name)}</p>
                  <p className="text-[#777777]">
                    {l(item.colorName)} · {item.size} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#581C32] tabular-nums">
                  {formatPrice(item.price * item.quantity, lang)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#EAE5DF] space-y-1.5 text-sm tabular-nums">
            <div className="flex justify-between text-[#777777]">
              <span>{t.cartPage.subtotal}</span>
              <span>{formatPrice(order.totals.subtotal, lang)}</span>
            </div>
            {order.totals.discount > 0 && (
              <div className="flex justify-between text-[#168653]">
                <span>{t.cartPage.discount}</span>
                <span>-{formatPrice(order.totals.discount, lang)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#777777]">
              <span>{t.cartPage.shipping}</span>
              <span>{order.totals.shipping === 0 ? t.cartPage.free : formatPrice(order.totals.shipping, lang)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#202020] pt-2 border-t border-[#EAE5DF]">
              <span>{t.cartPage.total}</span>
              <span className="text-[#581C32]">{formatPrice(order.totals.total, lang)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
