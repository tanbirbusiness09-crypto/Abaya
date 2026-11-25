import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useStore } from '../../context/StoreContext';
import { STORE_CONFIG } from '../../data/storeConfig';

export function Footer() {
  const { lang, setLang, l, t } = useLocale();
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast(
        lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address',
        'error'
      );
      return;
    }
    setSubscribed(true);
    setEmail('');
    showToast(t.footer.subscribedMsg);
  };

  return (
    <footer className="bg-[#3D1023] text-[#F8F4ED] mt-12">
      {/* Newsletter Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
              {t.footer.newsletterTitle}
            </h2>
            <p className="text-xs sm:text-sm text-white/75 mt-1">{t.footer.newsletterSubtitle}</p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1 sm:w-80">
              <Mail className="w-4 h-4 text-white/60 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.newsletterPlaceholder}
                aria-label={t.footer.newsletterPlaceholder}
                className="w-full h-11 ps-10 pe-4 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/60 focus:bg-white/15 focus:border-[#C5A572]"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-6 rounded-lg bg-[#C5A572] hover:bg-[#b59460] text-[#202020] text-sm font-bold whitespace-nowrap transition-colors"
            >
              {t.footer.subscribe}
            </button>
          </form>
        </div>
        {subscribed && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pb-4">
            <p className="text-xs text-[#C5A572]">{t.footer.subscribedMsg}</p>
          </div>
        )}
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-2xl font-bold tracking-wider text-white">LAYANA</span>
            <span className="text-[#C5A572]">|</span>
            <span className="text-xl font-extrabold text-[#C5A572]">ليانا</span>
          </div>
          <p className="text-xs text-white/75 leading-relaxed max-w-md">
            {lang === 'ar'
              ? 'دار عبايات وأزياء محتشمة سعودية تجمع بين رقي التفصيل التقليدي وسهولة التسوّق العصري مع توصيل سريع لجميع مدن المملكة.'
              : 'A contemporary Saudi Arabian abaya and modest fashion house blending refined heritage tailoring with effortless modern e-commerce nationwide.'}
          </p>
          <div className="space-y-2 text-xs text-white/80">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C5A572] shrink-0 mt-0.5" />
              <span>{l(STORE_CONFIG.contact.headquarters)}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C5A572] shrink-0" />
              <span dir="ltr" className="tabular-nums">{STORE_CONFIG.contact.phone}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C5A572] shrink-0" />
              <span>{STORE_CONFIG.contact.email}</span>
            </p>
          </div>
        </div>

        {/* Shop links */}
        <div>
          <h3 className="text-sm font-bold text-[#C5A572] mb-3.5">{t.footer.shopCol}</h3>
          <ul className="space-y-2 text-xs text-white/80">
            <li><Link to="/new-arrivals" className="hover:text-white">{lang === 'ar' ? 'وصل حديثاً' : 'New Arrivals'}</Link></li>
            <li><Link to="/category/classic-black-abayas" className="hover:text-white">{lang === 'ar' ? 'عبايات سوداء كلاسيكية' : 'Classic Black Abayas'}</Link></li>
            <li><Link to="/category/luxury-abayas" className="hover:text-white">{lang === 'ar' ? 'عبايات فاخرة' : 'Luxury Abayas'}</Link></li>
            <li><Link to="/category/linen-abayas" className="hover:text-white">{lang === 'ar' ? 'عبايات كتان' : 'Linen Abayas'}</Link></li>
            <li><Link to="/category/occasion-abayas" className="hover:text-white">{lang === 'ar' ? 'عبايات مناسبات' : 'Occasion Abayas'}</Link></li>
            <li><Link to="/category/shaylas" className="hover:text-white">{lang === 'ar' ? 'الطرح والشيلات' : 'Hijabs & Shaylas'}</Link></li>
            <li><Link to="/flash-deals" className="hover:text-white">{t.sections.flashDeals}</Link></li>
          </ul>
        </div>

        {/* Customer service links */}
        <div>
          <h3 className="text-sm font-bold text-[#C5A572] mb-3.5">{t.footer.serviceCol}</h3>
          <ul className="space-y-2 text-xs text-white/80">
            <li><Link to="/order-tracking" className="hover:text-white">{t.checkout.trackOrder}</Link></li>
            <li><Link to="/size-guide" className="hover:text-white">{t.pdp.sizeGuide}</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-white">{lang === 'ar' ? 'سياسة الشحن والتوصيل' : 'Shipping Policy'}</Link></li>
            <li><Link to="/return-policy" className="hover:text-white">{lang === 'ar' ? 'سياسة الاسترجاع والاستبدال' : 'Return & Refund Policy'}</Link></li>
            <li><Link to="/faq" className="hover:text-white">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</Link></li>
            <li><Link to="/contact" className="hover:text-white">{lang === 'ar' ? 'اتصلي بنا' : 'Contact Us'}</Link></li>
          </ul>
        </div>

        {/* Company & Legal */}
        <div>
          <h3 className="text-sm font-bold text-[#C5A572] mb-3.5">{t.footer.companyCol}</h3>
          <ul className="space-y-2 text-xs text-white/80">
            <li><Link to="/about" className="hover:text-white">{lang === 'ar' ? 'عن ليانا' : 'About Us'}</Link></li>
            <li><Link to="/collections" className="hover:text-white">{lang === 'ar' ? 'المجموعات والمناسبات' : 'Collections'}</Link></li>
            <li><Link to="/best-sellers" className="hover:text-white">{lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers'}</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
            <li><Link to="/terms" className="hover:text-white">{lang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</Link></li>
          </ul>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              <Globe className="w-4 h-4 text-[#C5A572]" />
              <span>{lang === 'ar' ? 'Switch to English (LTR)' : 'التحويل للعربية (RTL)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment methods & bottom copyright */}
      <div className="border-t border-white/10 bg-[#2C0A18]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-[11px] text-white/60 me-1">{t.footer.paymentMethodsTitle}:</span>
            {['mada مدى', 'Apple Pay', 'Tabby', 'Tamara', 'STC Pay', 'VISA', 'Mastercard', 'COD'].map(
              (method) => (
                <span
                  key={method}
                  className="px-2.5 py-1 rounded bg-white/10 border border-white/15 text-[11px] font-semibold text-white/90"
                >
                  {method}
                </span>
              )
            )}
          </div>
          <p className="text-[11px] text-white/70 text-center md:text-end">{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
