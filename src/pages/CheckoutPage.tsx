import { CheckCircle2, Info, Lock, ShieldCheck, Tag, Truck } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SeoHead } from '../components/ui/SeoHead';
import { SmartImage } from '../components/ui/SmartImage';
import { useLocale } from '../context/LocaleContext';
import { useStore } from '../context/StoreContext';
import { PAYMENT_METHODS, SAUDI_CITIES, STORE_CONFIG } from '../data/storeConfig';
import {
  calculateCartTotals,
  formatPrice,
  formatSaudiPhone,
  isValidSaudiPhone,
} from '../utils/catalogLogic';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { lang, l, t, city } = useLocale();
  const {
    cart,
    couponCode,
    applyCoupon,
    user,
    addresses,
    createDemoOrder,
    showToast,
  } = useStore();

  const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];

  const [fullName, setFullName] = useState(user.isAuthenticated ? user.fullName : '');
  const [phone, setPhone] = useState(user.isAuthenticated ? user.phone : '+966 5');
  const [email, setEmail] = useState(user.isAuthenticated ? user.email : '');
  const [cityId, setCityId] = useState(defaultAddr?.cityId ?? city.id);
  const [district, setDistrict] = useState(user.isAuthenticated ? defaultAddr?.district ?? '' : '');
  const [street, setStreet] = useState(user.isAuthenticated ? defaultAddr?.street ?? '' : '');
  const [building, setBuilding] = useState(user.isAuthenticated ? defaultAddr?.building ?? '' : '');
  const [postalCode, setPostalCode] = useState(user.isAuthenticated ? defaultAddr?.postalCode ?? '' : '');
  const [notes, setNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethodId, setPaymentMethodId] = useState<string>('mada');
  const [couponInput, setCouponInput] = useState(couponCode ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCity = SAUDI_CITIES.find((c) => c.id === cityId) ?? SAUDI_CITIES[0];

  const totals = useMemo(
    () =>
      calculateCartTotals(cart, {
        couponCode,
        deliveryMethod,
        paymentMethodId,
      }),
    [cart, couponCode, deliveryMethod, paymentMethodId]
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <SeoHead title={t.checkout.title} />
        <h1 className="text-2xl font-bold text-[#202020]">{t.cartPage.emptyTitle}</h1>
        <p className="text-sm text-[#777777]">{t.cartPage.emptyDesc}</p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 rounded-lg bg-[#581C32] text-white text-sm font-bold"
        >
          {t.shopNow}
        </Link>
      </div>
    );
  }

  const validate = () => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) {
      next.fullName = lang === 'ar' ? 'يرجى إدخال الاسم الكامل' : 'Full name is required';
    }
    if (!isValidSaudiPhone(phone)) {
      next.phone =
        lang === 'ar'
          ? 'يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 5 (مثال: +966 55 123 4567)'
          : 'Enter a valid Saudi mobile number starting with 5 (e.g. +966 55 123 4567)';
    }
    if (!email.trim() || !email.includes('@')) {
      next.email = lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Valid email address is required';
    }
    if (!district.trim()) {
      next.district = lang === 'ar' ? 'يرجى إدخال اسم الحي' : 'District / neighborhood is required';
    }
    if (!street.trim()) {
      next.street = lang === 'ar' ? 'يرجى إدخال اسم الشارع' : 'Street name is required';
    }
    if (!building.trim()) {
      next.building = lang === 'ar' ? 'يرجى إدخال رقم المبنى' : 'Building number is required';
    }
    if (!/^\d{5}$/.test(postalCode.trim())) {
      next.postalCode =
        lang === 'ar' ? 'الرمز البريدي السعودي يتكون من 5 أرقام' : 'Saudi postal code must be 5 digits';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast(
        lang === 'ar' ? 'يرجى استكمال الحقول المطلوبة بشكل صحيح' : 'Please complete all required fields accurately',
        'error'
      );
      return;
    }

    const days = deliveryMethod === 'express' ? selectedCity.expressDays : selectedCity.standardDays;
    const estDate = new Date(Date.now() + days * 86400 * 1000).toISOString().slice(0, 10);

    const order = createDemoOrder({
      items: cart,
      totals,
      customer: {
        fullName: fullName.trim(),
        phone: formatSaudiPhone(phone),
        email: email.trim(),
      },
      address: {
        cityId,
        district: district.trim(),
        street: street.trim(),
        building: building.trim(),
        postalCode: postalCode.trim(),
        notes: notes.trim() || undefined,
      },
      deliveryMethod,
      paymentMethodId,
      estimatedDelivery: estDate,
    });

    showToast(
      lang === 'ar' ? `تم إنشاء الطلب التجريبي #${order.id}` : `Demo order #${order.id} confirmed!`
    );
    navigate(`/order-confirmation/${order.id}`);
  };

  return (
    <>
      <SeoHead title={t.checkout.title} />
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#202020]">
            {t.checkout.title}
          </h1>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#168653]">
            <Lock className="w-4 h-4" />
            <span>{lang === 'ar' ? 'واجهة دفع آمنة (وضع العرض)' : 'Secure Checkout UI (Demo Mode)'}</span>
          </span>
        </div>

        {/* Clear Demonstration Notice */}
        <div className="rounded-xl bg-[#581C32]/5 border border-[#581C32]/20 p-4 flex items-start gap-3 text-xs sm:text-sm text-[#3D1023]">
          <Info className="w-5 h-5 text-[#581C32] shrink-0 mt-0.5" />
          <p>{t.checkout.demoBanner}</p>
        </div>

        <form onSubmit={handlePlaceOrder} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Contact Information */}
            <section className="bg-white rounded-xl border border-[#EAE5DF] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#202020]">1. {t.checkout.contactSection}</h2>
                {!user.isAuthenticated && (
                  <Link to="/login" className="text-xs font-bold text-[#581C32] hover:underline">
                    {lang === 'ar' ? 'لديكِ حساب؟ تسجيل الدخول' : 'Have an account? Sign in'}
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="co-name" className="block text-xs font-semibold text-[#202020] mb-1.5">
                    {t.checkout.fullName} *
                  </label>
                  <input
                    id="co-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: نورة عبد الله القحطاني' : 'e.g. Noura Abdullah Al-Qahtani'}
                    className="w-full h-11 px-3.5 rounded-lg border border-[#EAE5DF] text-sm"
                  />
                  {errors.fullName && <p className="text-xs text-[#D92D39] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="co-phone" className="block text-xs font-semibold text-[#202020] mb-1.5">
                    {t.checkout.phone} *
                  </label>
                  <input
                    id="co-phone"
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(formatSaudiPhone(e.target.value))}
                    placeholder="+966 55 123 4567"
                    className="w-full h-11 px-3.5 rounded-lg border border-[#EAE5DF] text-sm tabular-nums text-start"
                  />
                  {errors.phone && <p className="text-xs text-[#D92D39] mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="co-email" className="block text-xs font-semibold text-[#202020] mb-1.5">
                    {t.checkout.email} *
                  </label>
                  <input
                    id="co-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 px-3.5 rounded-lg border border-[#EAE5DF] text-sm"
                  />
                  {errors.email && <p className="text-xs text-[#D92D39] mt-1">{errors.email}</p>}
                </div>
              </div>
            </section>

            {/* Saudi Delivery Address */}
            <section className="bg-white rounded-xl border border-[#EAE5DF] p-5 sm:p-6 space-y-4">
              <h2 className="text-base font-bold text-[#202020]">2. {t.checkout.shippingSection}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="co-city" className="block text-xs font-semibold text-[#202020] mb-1.5">
                    {t.checkout.city} *
                  </label>
                  <select
                    id="co-city"
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-[#EAE5DF] bg-white text-sm"
                  >
                    {SAUDI_CITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {l(c.name)} — {l(c.region)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="co-district" className="block text-xs font-semibold text-[#202020] mb-1.5">
                    {t.checkout.district} *
                  </label>
                  <input
                    id="co-district"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: حي الياسمين' : 'e.g. Al Yasmin District'}
                    className="w-full h-11 px-3.5 rounded-lg border border-[#EAE5DF] text-sm"
                  />
                  {errors.district && <p className="text-xs text-[#D92D39] mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label htmlFor="co-street" className="block text-xs font-semibold text-[#202020] mb-1.5">
                    {t.checkout.street} *
                  </label>
                  <input
                    id="co-street"
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: طريق الملك سلمان' : 'e.g. King Salman Rd'}
                    className="w-full h-11 px-3.5 rounded-lg border border-[#EAE5DF] text-sm"
                  />
                  {errors.street && <p className="text-xs text-[#D92D39] mt-1">{errors.street}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="co-building" className="block text-xs font-semibold text-[#202020] mb-1.5">
                      {t.checkout.building} *
                    </label>
                    <input
                      id="co-building"
                      type="text"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      placeholder="4218"
                      className="w-full h-11 px-3 rounded-lg border border-[#EAE5DF] text-sm tabular-nums"
                    />
                    {errors.building && <p className="text-xs text-[#D92D39] mt-1">{errors.building}</p>}
                  </div>

                  <div>
                    <label htmlFor="co-postal" className="block text-xs font-semibold text-[#202020] mb-1.5">
                      {t.checkout.postalCode} *
                    </label>
                    <input
                      id="co-postal"
                      type="text"
                      maxLength={5}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      placeholder="13521"
                      className="w-full h-11 px-3 rounded-lg border border-[#EAE5DF] text-sm tabular-nums"
                    />
                    {errors.postalCode && <p className="text-xs text-[#D92D39] mt-1">{errors.postalCode}</p>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="co-notes" className="block text-xs font-semibold text-[#202020] mb-1.5">
                    {t.checkout.notes}
                  </label>
                  <input
                    id="co-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      lang === 'ar'
                        ? 'رقم الشقة، أقرب معلم، أو تعليمات للمندوب...'
                        : 'Apartment no., nearby landmark, or delivery note...'
                    }
                    className="w-full h-11 px-3.5 rounded-lg border border-[#EAE5DF] text-sm"
                  />
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            <section className="bg-white rounded-xl border border-[#EAE5DF] p-5 sm:p-6 space-y-3.5">
              <h2 className="text-base font-bold text-[#202020]">3. {t.checkout.deliveryMethod}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-4 rounded-xl border-2 cursor-pointer flex items-start justify-between gap-3 transition-colors ${
                    deliveryMethod === 'standard'
                      ? 'border-[#581C32] bg-[#581C32]/5'
                      : 'border-[#EAE5DF] hover:border-[#C5A572]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="mt-1 accent-[#581C32]"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#202020]">{t.checkout.standardDelivery}</p>
                      <p className="text-xs text-[#777777] mt-0.5">
                        {lang === 'ar'
                          ? `${selectedCity.standardDays} أيام عمل إلى ${l(selectedCity.name)}`
                          : `${selectedCity.standardDays} business days to ${l(selectedCity.name)}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#168653] shrink-0 tabular-nums">
                    {totals.subtotal - totals.discount >= STORE_CONFIG.freeShippingThreshold
                      ? t.cartPage.free
                      : formatPrice(STORE_CONFIG.standardShippingFee, lang)}
                  </span>
                </label>

                <label
                  className={`p-4 rounded-xl border-2 cursor-pointer flex items-start justify-between gap-3 transition-colors ${
                    deliveryMethod === 'express'
                      ? 'border-[#581C32] bg-[#581C32]/5'
                      : 'border-[#EAE5DF] hover:border-[#C5A572]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === 'express'}
                      onChange={() => setDeliveryMethod('express')}
                      className="mt-1 accent-[#581C32]"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#202020]">{t.checkout.expressDelivery}</p>
                      <p className="text-xs text-[#777777] mt-0.5">
                        {lang === 'ar'
                          ? `${selectedCity.expressDays} يوم عمل إلى ${l(selectedCity.name)}`
                          : `${selectedCity.expressDays} business day(s) to ${l(selectedCity.name)}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#581C32] shrink-0 tabular-nums">
                    {formatPrice(STORE_CONFIG.expressShippingFee, lang)}
                  </span>
                </label>
              </div>
            </section>

            {/* Saudi Payment Method Selection (Demonstration UI Only — No Card Inputs Collected) */}
            <section className="bg-white rounded-xl border border-[#EAE5DF] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-base font-bold text-[#202020]">4. {t.checkout.paymentMethod}</h2>
                <span className="text-[11px] font-semibold text-[#777777]">
                  {lang === 'ar' ? 'لا يتم جمع بيانات بطاقات حقيقية' : 'No live payment processing or card capture'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((pm) => {
                  const active = paymentMethodId === pm.id;
                  return (
                    <label
                      key={pm.id}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-colors ${
                        active
                          ? 'border-[#581C32] bg-[#581C32]/5'
                          : 'border-[#EAE5DF] hover:border-[#C5A572]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={active}
                        onChange={() => setPaymentMethodId(pm.id)}
                        className="mt-1 accent-[#581C32]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-[#202020]">{l(pm.name)}</span>
                          {pm.badge && (
                            <span className="text-[10px] font-bold text-[#581C32] bg-[#F8F4ED] px-2 py-0.5 rounded">
                              {l(pm.badge)}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#777777] mt-0.5 leading-snug">{l(pm.subtitle)}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Order Summary Column */}
          <aside className="lg:col-span-4 bg-white rounded-xl border border-[#EAE5DF] p-5 sm:p-6 space-y-5 lg:sticky lg:top-28">
            <h2 className="text-base font-bold text-[#202020] pb-3 border-b border-[#EAE5DF]">
              {t.cartPage.orderSummary} ({totals.itemCount})
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pe-1">
              {cart.map((item) => (
                <div key={item.key} className="flex gap-3 items-center">
                  <div className="w-12 h-16 rounded overflow-hidden bg-[#F8F4ED] shrink-0">
                    <SmartImage src={item.image} alt={l(item.name)} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-semibold text-[#202020] truncate">{l(item.name)}</p>
                    <p className="text-[11px] text-[#777777]">
                      {l(item.colorName)} · {item.size} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#581C32] tabular-nums shrink-0">
                    {formatPrice(item.price * item.quantity, lang)}
                  </span>
                </div>
              ))}
            </div>

            {/* Inline coupon quick apply */}
            <div className="flex gap-2 pt-3 border-t border-[#EAE5DF]">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-[#777777] absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="LAYANA15"
                  aria-label="Coupon code"
                  className="w-full h-9 ps-8 pe-2 rounded-lg border border-[#EAE5DF] text-xs uppercase"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const res = applyCoupon(couponInput);
                  showToast(
                    res.ok
                      ? lang === 'ar' ? 'تم تطبيق الكوبون' : 'Coupon applied'
                      : lang === 'ar' ? 'كود غير صالح' : 'Invalid coupon',
                    res.ok ? 'success' : 'error'
                  );
                }}
                className="h-9 px-3 rounded-lg bg-[#202020] text-white text-xs font-bold"
              >
                {t.cartPage.applyCoupon}
              </button>
            </div>

            {/* Totals breakdown */}
            <div className="space-y-2 text-xs sm:text-sm tabular-nums pt-3 border-t border-[#EAE5DF]">
              <div className="flex justify-between text-[#777777]">
                <span>{t.cartPage.subtotal}</span>
                <span className="text-[#202020] font-semibold">{formatPrice(totals.subtotal, lang)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-[#168653] font-semibold">
                  <span>{t.cartPage.discount}</span>
                  <span>-{formatPrice(totals.discount, lang)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#777777]">
                <span>{t.cartPage.shipping}</span>
                <span className={totals.shipping === 0 ? 'text-[#168653] font-bold' : ''}>
                  {totals.shipping === 0 ? t.cartPage.free : formatPrice(totals.shipping, lang)}
                </span>
              </div>
              {totals.codFee > 0 && (
                <div className="flex justify-between text-[#777777]">
                  <span>{lang === 'ar' ? 'رسوم الدفع عند الاستلام' : 'Cash on Delivery Fee'}</span>
                  <span>{formatPrice(totals.codFee, lang)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-[#777777]">
                <span>{t.cartPage.vatIncludedLabel}</span>
                <span>{formatPrice(totals.vatIncluded, lang)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#202020] pt-3 border-t border-[#EAE5DF]">
                <span>{t.cartPage.total}</span>
                <span className="text-[#581C32]">{formatPrice(totals.total, lang)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.checkout.placeOrder}</span>
            </button>

            <div className="flex items-center justify-center gap-3 text-[11px] text-[#777777]">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#168653]" />
                {lang === 'ar' ? 'طلب محلي تجريبي' : 'Simulated local order'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#581C32]" />
                {l(selectedCity.name)}
              </span>
            </div>
          </aside>
        </form>
      </div>
    </>
  );
}
