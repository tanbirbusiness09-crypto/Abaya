import {
  Bell,
  Clock,
  Heart,
  LogOut,
  MapPin,
  Package,
  Plus,
  Settings,
  Trash2,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { SeoHead } from '../components/ui/SeoHead';
import { SmartImage } from '../components/ui/SmartImage';
import { useLocale } from '../context/LocaleContext';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { SAUDI_CITIES } from '../data/storeConfig';
import { formatPrice, formatSaudiPhone } from '../utils/catalogLogic';
import { OrderTimeline } from './OrderTrackingPage';

export type AccountSection =
  | 'profile'
  | 'orders'
  | 'order-details'
  | 'addresses'
  | 'wishlist'
  | 'notifications'
  | 'recently-viewed'
  | 'settings';

export function AccountPage({ section = 'profile' }: { section?: AccountSection }) {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { lang, setLang, l, t, city, setCityById } = useLocale();
  const {
    user,
    updateUserProfile,
    logoutDemoUser,
    orders,
    getOrderById,
    addresses,
    addAddress,
    removeAddress,
    setDefaultAddress,
    wishlistIds,
    recentlyViewedIds,
    notifications,
    markAllNotificationsRead,
    showToast,
  } = useStore();

  // Profile form
  const [nameInput, setNameInput] = useState(user.fullName);
  const [emailInput, setEmailInput] = useState(user.email);
  const [phoneInput, setPhoneInput] = useState(user.phone);

  // Add address form
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrLabel, setAddrLabel] = useState('');
  const [addrCity, setAddrCity] = useState(city.id);
  const [addrDistrict, setAddrDistrict] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrBuilding, setAddrBuilding] = useState('');
  const [addrPostal, setAddrPostal] = useState('');

  const navItems: { id: AccountSection; path: string; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { id: 'profile', path: '/account', icon: User, label: lang === 'ar' ? 'ملفي الشخصي' : 'My Profile' },
    { id: 'orders', path: '/account/orders', icon: Package, label: lang === 'ar' ? 'طلباتي' : 'My Orders' },
    { id: 'addresses', path: '/account/addresses', icon: MapPin, label: lang === 'ar' ? 'العناوين المحفوظة' : 'Saved Addresses' },
    { id: 'wishlist', path: '/account/wishlist', icon: Heart, label: t.wishlist },
    { id: 'notifications', path: '/account/notifications', icon: Bell, label: lang === 'ar' ? 'الإشعارات' : 'Notifications' },
    { id: 'recently-viewed', path: '/account/recently-viewed', icon: Clock, label: t.sections.recentlyViewed },
    { id: 'settings', path: '/account/settings', icon: Settings, label: lang === 'ar' ? 'الإعدادات' : 'Settings' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName: nameInput.trim() || user.fullName,
      email: emailInput.trim() || user.email,
      phone: formatSaudiPhone(phoneInput),
    });
    showToast(lang === 'ar' ? 'تم تحديث بيانات ملفك الشخصي' : 'Profile updated successfully');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrDistrict.trim() || !addrStreet.trim()) {
      showToast(lang === 'ar' ? 'يرجى إدخال الحي والشارع' : 'Please enter district and street', 'error');
      return;
    }
    addAddress({
      label: addrLabel.trim() || (lang === 'ar' ? 'عنوان جديد' : 'New Address'),
      fullName: user.fullName,
      phone: user.phone,
      cityId: addrCity,
      district: addrDistrict.trim(),
      street: addrStreet.trim(),
      building: addrBuilding.trim() || '1001',
      postalCode: addrPostal.trim() || '12214',
      isDefault: addresses.length === 0,
    });
    setShowAddrForm(false);
    setAddrLabel('');
    setAddrDistrict('');
    setAddrStreet('');
    setAddrBuilding('');
    setAddrPostal('');
    showToast(lang === 'ar' ? 'تم حفظ العنوان الجديد' : 'Address saved');
  };

  const activeOrder = orderId ? getOrderById(orderId) : undefined;
  const wishlistProducts = wishlistIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const recentProducts = recentlyViewedIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <SeoHead title={t.account} />
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Account Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-xl border border-[#EAE5DF] overflow-hidden">
            <div className="p-5 bg-[#3D1023] text-white">
              <p className="text-xs text-[#C5A572] font-semibold">LAYANA Member</p>
              <h1 className="text-base font-bold mt-0.5">{user.fullName}</h1>
              <p className="text-xs text-white/75 mt-0.5 truncate">{user.email}</p>
            </div>

            <nav aria-label="Account sections" className="p-2 flex lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active =
                  section === item.id || (section === 'order-details' && item.id === 'orders');
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-[#581C32] text-white'
                        : 'text-[#202020] hover:bg-[#F8F4ED]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  logoutDemoUser();
                  showToast(lang === 'ar' ? 'تم تسجيل الخروج' : 'Signed out', 'info');
                  navigate('/');
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-[#D92D39] hover:bg-[#FFF5F5] whitespace-nowrap"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            </nav>
          </aside>

          {/* Main Account Content */}
          <div className="lg:col-span-9 bg-white rounded-xl border border-[#EAE5DF] p-5 sm:p-7">
            {section === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
                <h2 className="text-xl font-bold text-[#202020]">
                  {lang === 'ar' ? 'ملفي الشخصي' : 'My Profile'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">{t.checkout.fullName}</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg border border-[#EAE5DF] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">{t.checkout.email}</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg border border-[#EAE5DF] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">{t.checkout.phone}</label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(formatSaudiPhone(e.target.value))}
                      className="w-full h-11 px-3.5 rounded-lg border border-[#EAE5DF] text-sm text-start tabular-nums"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-sm font-bold"
                >
                  {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
              </form>
            )}

            {section === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#202020]">
                    {lang === 'ar' ? 'طلباتي' : 'My Orders'} ({orders.length})
                  </h2>
                  <Link to="/order-tracking" className="text-xs font-bold text-[#581C32] hover:underline">
                    {t.checkout.trackOrder}
                  </Link>
                </div>

                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-xl border border-[#EAE5DF] hover:border-[#C5A572] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-extrabold text-sm text-[#581C32] tabular-nums">{ord.id}</span>
                          <span className="text-xs text-[#777777] tabular-nums">
                            {ord.createdAt.slice(0, 10)}
                          </span>
                        </div>
                        <p className="text-xs text-[#777777]">
                          {ord.items.length} {lang === 'ar' ? 'منتج' : 'item(s)'} ·{' '}
                          <strong className="text-[#202020] tabular-nums">
                            {formatPrice(ord.totals.total, lang)}
                          </strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Link
                          to={`/account/orders/${ord.id}`}
                          className="px-4 py-2 rounded-lg bg-[#F8F4ED] hover:bg-[#581C32] hover:text-white text-xs font-bold text-[#581C32] transition-colors"
                        >
                          {lang === 'ar' ? 'تفاصيل وتتبع الطلب' : 'Order Details & Track'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === 'order-details' && (
              <div className="space-y-5">
                {!activeOrder ? (
                  <p className="text-sm text-[#777777]">{lang === 'ar' ? 'الطلب غير موجود.' : 'Order not found.'}</p>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE5DF]">
                      <div>
                        <Link to="/account/orders" className="text-xs font-semibold text-[#581C32] hover:underline">
                          ← {lang === 'ar' ? 'العودة إلى طلباتي' : 'Back to My Orders'}
                        </Link>
                        <h2 className="text-xl font-extrabold text-[#202020] mt-1 tabular-nums">
                          {activeOrder.id}
                        </h2>
                      </div>
                      <span className="text-sm font-bold text-[#581C32] tabular-nums">
                        {formatPrice(activeOrder.totals.total, lang)}
                      </span>
                    </div>

                    <OrderTimeline status={activeOrder.status} />

                    <div className="space-y-3 pt-4 border-t border-[#EAE5DF]">
                      {activeOrder.items.map((item) => (
                        <div key={item.key} className="flex items-center gap-3">
                          <div className="w-14 h-18 rounded overflow-hidden bg-[#F8F4ED] shrink-0">
                            <SmartImage src={item.image} alt={l(item.name)} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 text-xs">
                            <Link to={`/product/${item.slug}`} className="font-bold text-[#202020] hover:text-[#581C32]">
                              {l(item.name)}
                            </Link>
                            <p className="text-[#777777] mt-0.5">
                              {l(item.colorName)} · {item.size} × {item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-[#581C32] tabular-nums">
                            {formatPrice(item.price * item.quantity, lang)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {section === 'addresses' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-xl font-bold text-[#202020]">
                    {lang === 'ar' ? 'العناوين المحفوظة' : 'Saved Saudi Addresses'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowAddrForm((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#581C32] text-white text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'إضافة عنوان جديد' : 'Add Address'}</span>
                  </button>
                </div>

                {showAddrForm && (
                  <form onSubmit={handleAddAddress} className="p-4 rounded-xl bg-[#F8F4ED] border border-[#EAE5DF] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <input
                      type="text"
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      placeholder={lang === 'ar' ? 'تسمية العنوان (المنزل / العمل)' : 'Label (Home / Office)'}
                      className="h-10 px-3 rounded-lg bg-white border border-[#EAE5DF]"
                    />
                    <select
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="h-10 px-3 rounded-lg bg-white border border-[#EAE5DF]"
                    >
                      {SAUDI_CITIES.map((c) => (
                        <option key={c.id} value={c.id}>{l(c.name)}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={addrDistrict}
                      onChange={(e) => setAddrDistrict(e.target.value)}
                      placeholder={t.checkout.district}
                      className="h-10 px-3 rounded-lg bg-white border border-[#EAE5DF]"
                    />
                    <input
                      type="text"
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      placeholder={t.checkout.street}
                      className="h-10 px-3 rounded-lg bg-white border border-[#EAE5DF]"
                    />
                    <input
                      type="text"
                      value={addrBuilding}
                      onChange={(e) => setAddrBuilding(e.target.value)}
                      placeholder={t.checkout.building}
                      className="h-10 px-3 rounded-lg bg-white border border-[#EAE5DF]"
                    />
                    <input
                      type="text"
                      value={addrPostal}
                      onChange={(e) => setAddrPostal(e.target.value)}
                      placeholder={t.checkout.postalCode}
                      className="h-10 px-3 rounded-lg bg-white border border-[#EAE5DF]"
                    />
                    <div className="sm:col-span-2 flex justify-end gap-2">
                      <button type="button" onClick={() => setShowAddrForm(false)} className="px-4 py-2 rounded-lg border border-[#EAE5DF] bg-white font-semibold">
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button type="submit" className="px-5 py-2 rounded-lg bg-[#581C32] text-white font-bold">
                        {lang === 'ar' ? 'حفظ العنوان' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => {
                    const c = SAUDI_CITIES.find((x) => x.id === addr.cityId);
                    return (
                      <div key={addr.id} className="p-4 rounded-xl border border-[#EAE5DF] space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#202020]">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[11px] font-bold text-[#168653]">
                              {lang === 'ar' ? 'افتراضي' : 'Default'}
                            </span>
                          )}
                        </div>
                        <p className="text-[#777777]">
                          {c ? l(c.name) : addr.cityId} — {addr.district}, {addr.street} #{addr.building} ({addr.postalCode})
                        </p>
                        <div className="flex items-center gap-3 pt-2 border-t border-[#EAE5DF]">
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-[#581C32] font-bold hover:underline"
                            >
                              {lang === 'ar' ? 'تعيين كافتراضي' : 'Set Default'}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeAddress(addr.id)}
                            className="inline-flex items-center gap-1 text-[#D92D39] hover:underline"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{t.cartPage.remove}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {section === 'wishlist' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#202020]">{t.wishlist} ({wishlistProducts.length})</h2>
                {wishlistProducts.length === 0 ? (
                  <p className="text-sm text-[#777777]">{lang === 'ar' ? 'لا توجد منتجات في المفضلة.' : 'No saved items yet.'}</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wishlistProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {section === 'notifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#202020]">
                    {lang === 'ar' ? 'الإشعارات' : 'Notifications'}
                  </h2>
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-xs font-bold text-[#581C32] hover:underline"
                  >
                    {lang === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}
                  </button>
                </div>
                <div className="divide-y divide-[#EAE5DF]">
                  {notifications.map((n) => (
                    <div key={n.id} className={`py-4 ${n.read ? 'opacity-75' : ''}`}>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-[#202020]">
                          {lang === 'ar' ? n.titleAr : n.titleEn}
                        </h3>
                        <span className="text-xs text-[#777777] tabular-nums">{n.date}</span>
                      </div>
                      <p className="text-xs text-[#777777] mt-1">
                        {lang === 'ar' ? n.bodyAr : n.bodyEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === 'recently-viewed' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#202020]">
                  {t.sections.recentlyViewed} ({recentProducts.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {recentProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}

            {section === 'settings' && (
              <div className="space-y-6 max-w-lg">
                <h2 className="text-xl font-bold text-[#202020]">
                  {lang === 'ar' ? 'تفضيلات الحساب والمتجر' : 'Account & Store Preferences'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-2">
                      {lang === 'ar' ? 'لغة العرض والاتجاه' : 'Display Language & Direction'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setLang('ar')}
                        className={`h-11 rounded-lg border text-sm font-bold ${
                          lang === 'ar'
                            ? 'bg-[#581C32] text-white border-[#581C32]'
                            : 'border-[#EAE5DF] text-[#202020]'
                        }`}
                      >
                        العربية (RTL)
                      </button>
                      <button
                        type="button"
                        onClick={() => setLang('en')}
                        className={`h-11 rounded-lg border text-sm font-bold ${
                          lang === 'en'
                            ? 'bg-[#581C32] text-white border-[#581C32]'
                            : 'border-[#EAE5DF] text-[#202020]'
                        }`}
                      >
                        English (LTR)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="pref-city" className="block text-xs font-bold mb-2">
                      {t.selectCity}
                    </label>
                    <select
                      id="pref-city"
                      value={city.id}
                      onChange={(e) => setCityById(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-[#EAE5DF] bg-white text-sm"
                    >
                      {SAUDI_CITIES.map((c) => (
                        <option key={c.id} value={c.id}>{l(c.name)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
