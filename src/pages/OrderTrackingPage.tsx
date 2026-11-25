import { Check, Package, Search, Truck } from 'lucide-react';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SeoHead } from '../components/ui/SeoHead';
import { SmartImage } from '../components/ui/SmartImage';
import { useLocale } from '../context/LocaleContext';
import { useStore, type OrderStatusStep } from '../context/StoreContext';
import { SAUDI_CITIES } from '../data/storeConfig';
import { formatPrice } from '../utils/catalogLogic';

const TRACKING_STEPS: { id: OrderStatusStep; ar: string; en: string }[] = [
  { id: 'placed', ar: 'تم استلام الطلب', en: 'Order Placed' },
  { id: 'confirmed', ar: 'تم التأكيد', en: 'Confirmed' },
  { id: 'processing', ar: 'جاري التجهيز', en: 'Processing' },
  { id: 'shipped', ar: 'تم الشحن', en: 'Shipped' },
  { id: 'out_for_delivery', ar: 'خرج للتوصيل', en: 'Out for Delivery' },
  { id: 'delivered', ar: 'تم التسليم', en: 'Delivered' },
];

export function OrderTimeline({ status }: { status: OrderStatusStep }) {
  const { lang } = useLocale();
  const activeIdx = TRACKING_STEPS.findIndex((s) => s.id === status);

  return (
    <div className="py-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {TRACKING_STEPS.map((step, idx) => {
          const completed = idx <= activeIdx;
          const isCurrent = idx === activeIdx;
          return (
            <div
              key={step.id}
              className={`relative p-3 rounded-lg border text-center transition-colors ${
                isCurrent
                  ? 'border-[#581C32] bg-[#581C32]/5'
                  : completed
                    ? 'border-[#168653]/30 bg-[#168653]/5'
                    : 'border-[#EAE5DF] bg-[#F8F4ED]/50'
              }`}
            >
              <div
                className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                  completed ? 'bg-[#581C32] text-white' : 'bg-[#EAE5DF] text-[#777777]'
                }`}
              >
                {completed ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <p
                className={`text-xs font-bold leading-snug ${
                  completed ? 'text-[#202020]' : 'text-[#777777]'
                }`}
              >
                {lang === 'ar' ? step.ar : step.en}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const { lang, l, t } = useLocale();
  const { orders, getOrderById } = useStore();

  const initialCode = searchParams.get('order') ?? orders[0]?.id ?? 'LYN-2026-8421';
  const [query, setQuery] = useState(initialCode);
  const [searchedId, setSearchedId] = useState(initialCode);

  const order = getOrderById(searchedId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(query.trim());
  };

  const cityObj = order ? SAUDI_CITIES.find((c) => c.id === order.address.cityId) : undefined;

  return (
    <>
      <SeoHead title={t.checkout.trackOrder} />
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#202020]">
            {t.checkout.trackOrder}
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1">
            {lang === 'ar'
              ? 'أدخلي رقم الطلب لمتابعة حالة شحنتك داخل المملكة (محاكاة تجريبية). أرقام تجريبية متاحة: LYN-2026-8421 أو LYN-2026-7910'
              : 'Enter your order ID to view delivery progress across Saudi Arabia (demo simulation). Sample IDs: LYN-2026-8421 or LYN-2026-7910'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#EAE5DF] p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#777777] absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="LYN-2026-8421"
              aria-label={t.checkout.orderNumber}
              className="w-full h-11 ps-10 pe-3 rounded-lg border border-[#EAE5DF] text-sm uppercase"
            />
          </div>
          <button
            type="submit"
            className="h-11 px-6 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-sm font-bold"
          >
            {t.checkout.trackOrder}
          </button>
        </form>

        {/* Quick selectable demo orders */}
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <span className="text-[#777777]">{lang === 'ar' ? 'طلباتك المسجلة:' : 'Saved demo orders:'}</span>
          {orders.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setQuery(o.id);
                setSearchedId(o.id);
              }}
              className={`px-3 py-1 rounded-md border font-bold tabular-nums ${
                searchedId.toLowerCase() === o.id.toLowerCase()
                  ? 'bg-[#581C32] text-white border-[#581C32]'
                  : 'bg-white border-[#EAE5DF] text-[#581C32] hover:border-[#581C32]'
              }`}
            >
              {o.id}
            </button>
          ))}
        </div>

        {!order ? (
          <div className="bg-white rounded-xl border border-[#EAE5DF] p-10 text-center space-y-2">
            <Package className="w-8 h-8 mx-auto text-[#777777]" />
            <h2 className="text-base font-bold text-[#202020]">
              {lang === 'ar' ? 'لم نجد طلباً بهذا الرقم' : 'No order found with this ID'}
            </h2>
            <p className="text-xs text-[#777777]">
              {lang === 'ar'
                ? 'تأكدي من رقم الطلب أو اختاري أحد الأرقام التجريبية أعلاه.'
                : 'Check the order number or choose one of the demo order IDs above.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#EAE5DF] p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE5DF]">
              <div>
                <p className="text-xs text-[#777777]">{t.checkout.orderNumber}</p>
                <h2 className="text-lg font-extrabold text-[#581C32] tabular-nums">{order.id}</h2>
              </div>
              <div className="text-end text-xs">
                <p className="text-[#777777]">
                  {lang === 'ar' ? 'المدينة:' : 'Destination:'}{' '}
                  <strong className="text-[#202020]">{cityObj ? l(cityObj.name) : order.address.cityId}</strong>
                </p>
                <p className="text-[#168653] font-bold mt-0.5 inline-flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'ar' ? 'التسليم المتوقع:' : 'Est. Delivery:'} {order.estimatedDelivery}
                  </span>
                </p>
              </div>
            </div>

            <OrderTimeline status={order.status} />

            <div className="pt-4 border-t border-[#EAE5DF] space-y-3">
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
                  <span className="text-xs font-bold text-[#581C32] tabular-nums">
                    {formatPrice(item.price * item.quantity, lang)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
