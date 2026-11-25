export interface LocalizedText {
  ar: string;
  en: string;
}

export interface SaudiCity {
  id: string;
  name: LocalizedText;
  region: LocalizedText;
  expressDays: number;
  standardDays: number;
}

export interface DemoCoupon {
  code: string;
  type: 'percent' | 'fixed' | 'shipping';
  value: number;
  minSubtotal: number;
  description: LocalizedText;
}

export interface PaymentOption {
  id: string;
  name: LocalizedText;
  subtitle: LocalizedText;
  badge?: LocalizedText;
  fee?: number;
}

export const STORE_CONFIG = {
  brand: {
    en: 'LAYANA',
    ar: 'ليانا',
    full: 'LAYANA | ليانا',
    tagline: {
      ar: 'أناقة العباية السعودية المعاصرة',
      en: 'Contemporary Saudi Abaya House',
    },
  },
  currency: {
    code: 'SAR',
    symbolAr: 'ر.س',
    symbolEn: 'SAR',
  },
  vatRate: 0.15, // 15% KSA VAT included in all listed prices
  freeShippingThreshold: 399,
  standardShippingFee: 24,
  expressShippingFee: 39,
  codFee: 15,
  contact: {
    phone: '+966 11 510 8820',
    whatsappNumber: '966500123456',
    email: 'care@layana-demo.sa',
    hours: {
      ar: 'السبت – الخميس: 9:00 صباحاً – 10:00 مساءً (بتوقيت الرياض)',
      en: 'Sat – Thu: 9:00 AM – 10:00 PM (Riyadh Time)',
    },
    headquarters: {
      ar: 'طريق الملك فهد، حي العليا، الرياض 12214، المملكة العربية السعودية',
      en: 'King Fahd Rd, Al Olaya District, Riyadh 12214, Saudi Arabia',
    },
  },
  // Configurable flash deals countdown target (defaults to 14 hours ahead of load for evergreen demo)
  flashDealsDurationHours: 14,
  demoNotice: {
    ar: 'أسعار وتقييمات ومخزون تجريبي لأغراض العرض قبل ربط المتجر الفعلي.',
    en: 'Demonstration catalog prices, ratings, and inventory shown prior to live store integration.',
  },
} as const;

export const SAUDI_CITIES: SaudiCity[] = [
  { id: 'riyadh', name: { ar: 'الرياض', en: 'Riyadh' }, region: { ar: 'منطقة الرياض', en: 'Riyadh Region' }, expressDays: 1, standardDays: 2 },
  { id: 'jeddah', name: { ar: 'جدة', en: 'Jeddah' }, region: { ar: 'منطقة مكة المكرمة', en: 'Makkah Region' }, expressDays: 1, standardDays: 2 },
  { id: 'dammam', name: { ar: 'الدمام', en: 'Dammam' }, region: { ar: 'المنطقة الشرقية', en: 'Eastern Province' }, expressDays: 1, standardDays: 2 },
  { id: 'makkah', name: { ar: 'مكة المكرمة', en: 'Makkah' }, region: { ar: 'منطقة مكة المكرمة', en: 'Makkah Region' }, expressDays: 2, standardDays: 3 },
  { id: 'madinah', name: { ar: 'المدينة المنورة', en: 'Madinah' }, region: { ar: 'منطقة المدينة المنورة', en: 'Madinah Region' }, expressDays: 2, standardDays: 3 },
  { id: 'khobar', name: { ar: 'الخبر', en: 'Khobar' }, region: { ar: 'المنطقة الشرقية', en: 'Eastern Province' }, expressDays: 1, standardDays: 2 },
  { id: 'taif', name: { ar: 'الطائف', en: 'Taif' }, region: { ar: 'منطقة مكة المكرمة', en: 'Makkah Region' }, expressDays: 2, standardDays: 3 },
  { id: 'abha', name: { ar: 'أبها', en: 'Abha' }, region: { ar: 'منطقة عسير', en: 'Asir Region' }, expressDays: 2, standardDays: 4 },
  { id: 'tabuk', name: { ar: 'تبوك', en: 'Tabuk' }, region: { ar: 'منطقة تبوك', en: 'Tabuk Region' }, expressDays: 2, standardDays: 4 },
  { id: 'qassim', name: { ar: 'القصيم (بريدة)', en: 'Al Qassim (Buraydah)' }, region: { ar: 'منطقة القصيم', en: 'Al Qassim Region' }, expressDays: 2, standardDays: 3 },
];

export const DEMO_COUPONS: DemoCoupon[] = [
  {
    code: 'LAYANA15',
    type: 'percent',
    value: 15,
    minSubtotal: 250,
    description: { ar: 'خصم 15% للطلبات فوق 250 ر.س (عرض تجريبي)', en: '15% off orders over SAR 250 (Demo)' },
  },
  {
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    minSubtotal: 0,
    description: { ar: 'خصم ترحيبي 10% على أول طلب (عرض تجريبي)', en: '10% welcome discount on any order (Demo)' },
  },
  {
    code: 'EID50',
    type: 'fixed',
    value: 50,
    minSubtotal: 400,
    description: { ar: 'خصم 50 ر.س للطلبات فوق 400 ر.س (عرض تجريبي)', en: 'SAR 50 off orders over SAR 400 (Demo)' },
  },
  {
    code: 'FREESHIP',
    type: 'shipping',
    value: 100,
    minSubtotal: 0,
    description: { ar: 'شحن قياسي مجاني داخل المملكة (عرض تجريبي)', en: 'Free standard KSA delivery (Demo)' },
  },
];

export const PAYMENT_METHODS: PaymentOption[] = [
  {
    id: 'mada',
    name: { ar: 'مدى', en: 'Mada' },
    subtitle: { ar: 'بطاقة الصراف السعودية — واجهة تجريبية بدون خصم فعلي', en: 'Saudi debit card — demo UI only, no real charge' },
    badge: { ar: 'الأكثر استخداماً', en: 'Most Popular' },
  },
  {
    id: 'apple_pay',
    name: { ar: 'Apple Pay', en: 'Apple Pay' },
    subtitle: { ar: 'دفع سريع بلمسة واحدة — محاكاة تجريبية', en: 'Express one-tap checkout — demo simulation' },
  },
  {
    id: 'tabby',
    name: { ar: 'تابي Tabby', en: 'Tabby' },
    subtitle: { ar: 'قسّميها على 4 دفعات بدون فوائد — عرض توضيحي', en: 'Split in 4 interest-free payments — demo option' },
    badge: { ar: '4 دفعات', en: '4 Payments' },
  },
  {
    id: 'tamara',
    name: { ar: 'تمارا Tamara', en: 'Tamara' },
    subtitle: { ar: 'ادفعي على 4 دفعات ميسّرة — عرض توضيحي', en: 'Pay in 4 easy installments — demo option' },
  },
  {
    id: 'stc_pay',
    name: { ar: 'STC Pay', en: 'STC Pay' },
    subtitle: { ar: 'محفظة STC الرقمية — واجهة تجريبية', en: 'STC digital wallet — demo UI only' },
  },
  {
    id: 'visa',
    name: { ar: 'فيزا Visa', en: 'Visa' },
    subtitle: { ar: 'بطاقة ائتمانية — محاكاة بدون إدخال بيانات حقيقية', en: 'Credit card — simulated without collecting card numbers' },
  },
  {
    id: 'mastercard',
    name: { ar: 'ماستركارد Mastercard', en: 'Mastercard' },
    subtitle: { ar: 'بطاقة ائتمانية — محاكاة بدون إدخال بيانات حقيقية', en: 'Credit card — simulated without collecting card numbers' },
  },
  {
    id: 'cod',
    name: { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery' },
    subtitle: { ar: 'ادفعي نقداً أو عبر مدى عند التسليم (+15 ر.س رسوم تجريبية)', en: 'Pay cash or Mada at doorstep (+SAR 15 demo fee)' },
    fee: 15,
  },
];

export const ABAYA_LENGTHS = ['50', '52', '54', '56', '58', '60', '62'] as const;

export const POPULAR_SEARCHES = {
  ar: ['عباية سوداء', 'عباية كتان', 'عباية بشت مطرزة', 'عباية عنابي', 'طرحة حرير', 'طقم صلاة', 'عباية دوام'],
  en: ['Black Abaya', 'Linen Abaya', 'Embroidered Bisht', 'Burgundy Velvet', 'Silk Shayla', 'Prayer Set', 'Office Abaya'],
};
