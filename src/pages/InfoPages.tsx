import { ChevronDown, Mail, MapPin, Phone, Send } from 'lucide-react';
import React, { useState } from 'react';
import { SeoHead } from '../components/ui/SeoHead';
import { ABAYA_SIZE_CHART } from '../components/ui/SizeGuideModal';
import { SmartImage } from '../components/ui/SmartImage';
import { useLocale } from '../context/LocaleContext';
import { useStore } from '../context/StoreContext';
import { IMAGES } from '../data/images';
import { STORE_CONFIG } from '../data/storeConfig';

export function AboutPage() {
  const { lang } = useLocale();
  const title = lang === 'ar' ? 'عن ليانا | LAYANA' : 'About LAYANA | ليانا';

  return (
    <>
      <SeoHead title={title} />
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        <div className="rounded-2xl overflow-hidden bg-[#3D1023] text-white grid grid-cols-1 md:grid-cols-2">
          <div className="p-7 sm:p-10 flex flex-col justify-center space-y-4">
            <p className="text-xs font-bold text-[#C5A572] tracking-widest">RIYADH · SAUDI ARABIA</p>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold leading-tight">{title}</h1>
            <p className="text-sm text-white/85 leading-relaxed">
              {lang === 'ar'
                ? 'وُلدت علامة ليانا (علامة عرض تجريبية) لتجمع بين أصالة العباية السعودية الفاخرة وسلاسة التسوق الإلكتروني العصري، بأقمشة كريب ياباني وكتان طبيعي وتطريزات متقنة تلائم كل مناسبة.'
                : 'LAYANA (demonstration storefront brand) unites heritage Saudi abaya craftsmanship with effortless modern e-commerce — offering Japanese crepe, breathable natural linen, and artisanal embroidered silhouettes tailored for every occasion.'}
            </p>
          </div>
          <div className="aspect-[4/3] md:aspect-auto">
            <SmartImage src={IMAGES.heroBurgundy} alt={title} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              arTitle: 'أقمشة مختارة لأجواء المملكة',
              enTitle: 'Fabrics Curated for KSA Climate',
              arDesc: 'نختار أقمشة كريب ياباني، ندى كوري، وكتان طبيعي خفيف يمنحك انسيابية وبرودة طوال اليوم.',
              enDesc: 'We source cool Japanese crepe, Korean Nada, and natural linen chosen specifically for Saudi Arabia’s warm climate.',
            },
            {
              arTitle: 'مقاسات دقيقة من 50 إلى 62',
              enTitle: 'Precision Lengths 50 to 62"',
              arDesc: 'قصّات بشت وكلوش وبليزر مصممة بمقاسات سعودية دقيقة لتناسب جميع الأطوال مع طرحة متناسقة.',
              enDesc: 'Bisht, cloche, and office blazer cuts tailored across authentic Saudi abaya lengths with coordinated shaylas.',
            },
            {
              arTitle: 'توصيل لجميع مناطق السعودية',
              enTitle: 'Nationwide Saudi Fulfillment',
              arDesc: 'تجربة توصيل وتغليف فاخرة تغطي الرياض وجدة والدمام ومكة والمدينة وكافة مناطق المملكة.',
              enDesc: 'Refined unboxing and reliable delivery covering Riyadh, Jeddah, Dammam, Makkah, Madinah, and beyond.',
            },
          ].map((card) => (
            <div key={card.enTitle} className="bg-white rounded-xl border border-[#EAE5DF] p-6 space-y-2">
              <h2 className="text-base font-bold text-[#581C32]">
                {lang === 'ar' ? card.arTitle : card.enTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
                {lang === 'ar' ? card.arDesc : card.enDesc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function ContactPage() {
  const { lang, l } = useLocale();
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const title = lang === 'ar' ? 'اتصلي بنا' : 'Contact Us';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes('@') || !message.trim()) {
      showToast(lang === 'ar' ? 'يرجى تعبئة جميع الحقول بشكل صحيح' : 'Please fill in all fields accurately', 'error');
      return;
    }
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
    showToast(lang === 'ar' ? 'تم استلام رسالتك التجريبية بنجاح' : 'Your demo inquiry has been sent');
  };

  return (
    <>
      <SeoHead title={title} />
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-[#3D1023] text-white rounded-xl p-6 sm:p-8 space-y-5">
          <h1 className="font-editorial text-3xl font-bold">{title}</h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            {lang === 'ar'
              ? 'فريق خدمة عملاء ليانا يسعد بمساعدتك في اختيار المقاس، تتبع الطلبات، أو الاستفسار عن المجموعات الجديدة.'
              : 'Our Riyadh concierge team is here to assist with abaya length advice, order status, and styling queries.'}
          </p>
          <div className="space-y-3 text-xs sm:text-sm">
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C5A572] shrink-0 mt-1" />
              <span>{l(STORE_CONFIG.contact.headquarters)}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C5A572] shrink-0" />
              <span dir="ltr" className="tabular-nums">{STORE_CONFIG.contact.phone}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#C5A572] shrink-0" />
              <span>{STORE_CONFIG.contact.email}</span>
            </p>
            <p className="text-xs text-[#C5A572] pt-2">{l(STORE_CONFIG.contact.hours)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-xl border border-[#EAE5DF] p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-[#202020]">
            {lang === 'ar' ? 'أرسلي رسالة مباشرة' : 'Send a Direct Message'}
          </h2>
          {sent && (
            <div className="p-3 rounded-lg bg-[#168653]/10 text-[#168653] text-xs font-semibold">
              {lang === 'ar' ? 'شكراً لتواصلك! سنرد عليكِ خلال 24 ساعة عمل (محاكاة تجريبية).' : 'Thank you! Our team will respond within 24 business hours (demo submission).'}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold mb-1.5">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg border border-[#EAE5DF] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg border border-[#EAE5DF] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">{lang === 'ar' ? 'الرسالة' : 'Message'}</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3.5 rounded-lg border border-[#EAE5DF] text-sm"
            />
          </div>
          <button
            type="submit"
            className="h-11 px-6 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-sm font-bold inline-flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}</span>
          </button>
        </form>
      </div>
    </>
  );
}

const FAQS = [
  {
    qAr: 'كيف أختار طول العباية المناسب لي (50 – 62 إنش)؟',
    qEn: 'How do I choose the right Saudi abaya length (50–62 inches)?',
    aAr: 'تُقاس العباية من الكتف حتى الكعب. على سبيل المثال، الطول 159–163 سم يناسبه غالباً مقاس 54، بينما 164–168 سم يناسبه 56. راجعي صفحة دليل المقاسات للتفاصيل الكاملة.',
    aEn: 'Measure from shoulder seam to ankle. For height 159–163 cm, length 54 is standard; for 164–168 cm, length 56 fits comfortably. See our Size Guide page for full measurements.',
  },
  {
    qAr: 'هل تأتي العباية مع طرحة متناسقة؟',
    qEn: 'Does every abaya include a matching shayla?',
    aAr: 'نعم، جميع عبايات ليانا تأتي مع طرحة متناسقة مجانية من نفس اللون أو الخامة المكملة، ما لم يُذكر خلاف ذلك في صفحة المنتج.',
    aEn: 'Yes, all LAYANA abayas include a complimentary coordinated shayla unless specified otherwise on the product page.',
  },
  {
    qAr: 'هل الأسعار شاملة ضريبة القيمة المضافة في السعودية؟',
    qEn: 'Are all SAR prices inclusive of 15% KSA VAT?',
    aAr: 'نعم، جميع الأسعار المعروضة بالريال السعودي شاملة ضريبة القيمة المضافة 15% بالكامل.',
    aEn: 'Yes, every displayed SAR price already includes 15% Saudi Arabia VAT with no hidden checkout surprises.',
  },
  {
    qAr: 'كم يستغرق التوصيل داخل المملكة العربية السعودية؟',
    qEn: 'How long does shipping take across Saudi Arabia?',
    aAr: 'في الرياض وجدة والدمام والخبر يتوفر توصيل سريع خلال 24 ساعة (وفق السياسة التجريبية)، ولباقي مدن المملكة خلال 2 إلى 4 أيام عمل.',
    aEn: 'Express delivery in Riyadh, Jeddah, Dammam, and Khobar takes 1 business day (demo policy), and 2–4 business days across other Saudi regions.',
  },
  {
    qAr: 'ما هي خيارات الدفع المتاحة؟',
    qEn: 'Which payment methods are shown at checkout?',
    aAr: 'تعرض واجهة الدفع التجريبية خيارات مدى، Apple Pay، فيزا، ماستركارد، STC Pay، تابي، تمارا، والدفع عند الاستلام لأغراض العرض قبل ربط بوابة دفع فعلية.',
    aEn: 'The demonstration checkout showcases Mada, Apple Pay, Visa, Mastercard, STC Pay, Tabby, Tamara, and Cash on Delivery as UI options prior to live gateway integration.',
  },
];

export function FaqPage() {
  const { lang } = useLocale();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const title = lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions';

  return (
    <>
      <SeoHead title={title} />
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
        <h1 className="font-editorial text-3xl font-bold text-[#202020]">{title}</h1>
        <div className="bg-white rounded-xl border border-[#EAE5DF] divide-y divide-[#EAE5DF]">
          {FAQS.map((item, idx) => (
            <div key={idx} className="p-4 sm:p-5">
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                aria-expanded={openIdx === idx}
                className="w-full flex items-center justify-between gap-3 text-start text-sm sm:text-base font-bold text-[#202020]"
              >
                <span>{lang === 'ar' ? item.qAr : item.qEn}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#581C32] shrink-0 transition-transform ${
                    openIdx === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIdx === idx && (
                <p className="mt-3 text-xs sm:text-sm text-[#777777] leading-relaxed">
                  {lang === 'ar' ? item.aAr : item.aEn}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function SizeGuidePage() {
  const { lang } = useLocale();
  const title = lang === 'ar' ? 'دليل مقاسات وأطوال العبايات' : 'Abaya Length & Size Guide';

  return (
    <>
      <SeoHead title={title} />
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
        <h1 className="font-editorial text-3xl font-bold text-[#202020]">{title}</h1>
        <p className="text-sm text-[#777777]">
          {lang === 'ar'
            ? 'اعتمدي الجدول التالي لاختيار طول العباية السعودي المناسب (بالإنش والسنتيمتر).'
            : 'Use the chart below to choose your ideal Saudi abaya length in inches and centimeters.'}
        </p>

        <div className="bg-white rounded-xl border border-[#EAE5DF] overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-[#581C32] text-white">
              <tr>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'المقاس (إنش)' : 'Size (In)'}</th>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'الطول (سم)' : 'Length (cm)'}</th>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'طول القامة المقترح (سم)' : 'Suggested Height (cm)'}</th>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'عرض الصدر (سم)' : 'Chest (cm)'}</th>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'طول الكم (سم)' : 'Sleeve (cm)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE5DF] tabular-nums">
              {ABAYA_SIZE_CHART.map((row) => (
                <tr key={row.size} className="hover:bg-[#F8F4ED]/60">
                  <td className="px-4 py-3 font-bold text-[#581C32]">{row.size}</td>
                  <td className="px-4 py-3">{row.lengthCm}</td>
                  <td className="px-4 py-3">{row.heightCm}</td>
                  <td className="px-4 py-3">{row.chestCm}</td>
                  <td className="px-4 py-3">{row.sleeveCm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function PolicyPage({
  type,
}: {
  type: 'shipping' | 'returns' | 'privacy' | 'terms';
}) {
  const { lang } = useLocale();

  const contentMap = {
    shipping: {
      titleAr: 'سياسة الشحن والتوصيل (مسودة تجريبية)',
      titleEn: 'Shipping Policy (Draft Demo Policy)',
      sections: [
        {
          arH: 'مناطق التغطية داخل المملكة',
          enH: 'Saudi Arabia Coverage',
          arP: 'نوفّر التوصيل إلى الرياض، جدة، الدمام، الخبر، مكة، المدينة، الطائف، أبها، تبوك، القصيم، وكافة محافظات المملكة عبر شركات الشحن المعتمدة عند الإطلاق الفعلي.',
          enP: 'Delivery covers Riyadh, Jeddah, Dammam, Khobar, Makkah, Madinah, Taif, Abha, Tabuk, Al Qassim, and all Saudi provinces via partnered couriers upon production launch.',
        },
        {
          arH: 'الرسوم والمدد التقديرية',
          enH: 'Estimated Timelines & Fees',
          arP: 'شحن قياسي مجاني للطلبات فوق 399 ر.س (أو 24 ر.س للطلبات الأقل)، وتوصيل سريع بقيمة 39 ر.س خلال 1–2 يوم عمل.',
          enP: 'Free standard shipping applies above SAR 399 (otherwise SAR 24), with Express shipping available for SAR 39 within 1–2 business days.',
        },
      ],
    },
    returns: {
      titleAr: 'سياسة الاسترجاع والاستبدال (مسودة تجريبية)',
      titleEn: 'Return & Refund Policy (Draft Demo Policy)',
      sections: [
        {
          arH: 'مهلة الاستبدال والاسترجاع',
          enH: '14-Day Return Window',
          arP: 'يمكن طلب استبدال المقاس أو استرجاع المنتج خلال 14 يوماً من تاريخ الاستلام بشرط أن تكون العباية غير ملبوسة وفي عبوتها الأصلية مع كامل البطاقات والطرحة المرفقة.',
          enP: 'Size exchanges or returns may be requested within 14 days of delivery provided the abaya is unworn in original packaging with tags and matching shayla intact.',
        },
        {
          arH: 'القطع المستثناة',
          enH: 'Hygiene Exclusions',
          arP: 'حفاظاً على معايير النظافة، لا يُقبل استرجاع النقابات أو البراقع المفتوحة إلا في حال وجود عيب مصنعي.',
          enP: 'For hygiene reasons, opened niqabs and face veils are non-returnable unless received damaged or defective.',
        },
      ],
    },
    privacy: {
      titleAr: 'سياسة الخصوصية (مسودة تجريبية)',
      titleEn: 'Privacy Policy (Draft Demo Policy)',
      sections: [
        {
          arH: 'حماية بيانات العملاء',
          enH: 'Customer Data Protection',
          arP: 'في النسخة التجريبية الحالية تُحفظ بيانات السلة والمفضلة والطلبات محلياً داخل متصفحك (LocalStorage) فقط ولا تُرسل إلى خوادم خارجية.',
          enP: 'In this demonstration frontend, cart items, wishlists, and simulated orders are stored strictly in your browser LocalStorage and are not transmitted to external servers.',
        },
        {
          arH: 'الامتثال لنظام حماية البيانات الشخصية السعودي',
          enH: 'Saudi PDPL Alignment',
          arP: 'تُعد هذه المسودة تمهيداً لسياسة الخصوصية الرسمية المتوافقة مع نظام حماية البيانات الشخصية في المملكة العربية السعودية عند تفعيل المتجر.',
          enP: 'This draft serves as placeholder legal copy to be finalized in alignment with the Saudi Personal Data Protection Law (PDPL) prior to commercial launch.',
        },
      ],
    },
    terms: {
      titleAr: 'الشروط والأحكام (مسودة تجريبية)',
      titleEn: 'Terms & Conditions (Draft Demo Policy)',
      sections: [
        {
          arH: 'نطاق الاستخدام التجريبي',
          enH: 'Demonstration Storefront Notice',
          arP: 'جميع المنتجات والأسعار والتقييمات وأرقام الطلبات المعروضة في هذا الموقع هي بيانات عرض تجريبية ولا تشكل التزاماً بيعياً فعلياً.',
          enP: 'All products, prices, ratings, and order confirmations presented on this site are demonstration data and do not constitute binding commercial transactions.',
        },
        {
          arH: 'الضرائب والعملة',
          enH: 'Currency & VAT',
          arP: 'تُعرض الأسعار بالريال السعودي (SAR) شاملة ضريبة القيمة المضافة 15% وفق اللوائح التجارية في المملكة العربية السعودية.',
          enP: 'All prices are displayed in Saudi Riyals (SAR) inclusive of 15% VAT in accordance with Saudi commercial pricing guidelines.',
        },
      ],
    },
  }[type];

  const title = lang === 'ar' ? contentMap.titleAr : contentMap.titleEn;

  return (
    <>
      <SeoHead title={title} />
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
        <div className="bg-white rounded-xl border border-[#EAE5DF] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#EAE5DF] pb-4">
            <span className="text-xs font-bold text-[#581C32]">
              {lang === 'ar' ? 'مسودة سياسة متجر تجريبية' : 'DRAFT DEMONSTRATION POLICY'}
            </span>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#202020] mt-1">{title}</h1>
          </div>

          <div className="space-y-5">
            {contentMap.sections.map((sec) => (
              <div key={sec.enH} className="space-y-1.5">
                <h2 className="text-base font-bold text-[#202020]">
                  {lang === 'ar' ? sec.arH : sec.enH}
                </h2>
                <p className="text-sm text-[#777777] leading-relaxed">
                  {lang === 'ar' ? sec.arP : sec.enP}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
