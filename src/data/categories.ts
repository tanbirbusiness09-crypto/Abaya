import { IMAGES } from './images';
import type { LocalizedText } from './storeConfig';

export interface CategoryItem {
  id: string;
  slug: string;
  name: LocalizedText;
  shortName: LocalizedText;
  description: LocalizedText;
  image: string;
  subcategories: { slug: string; name: LocalizedText }[];
}

export interface ColorOption {
  id: string;
  name: LocalizedText;
  hex: string;
  image: string;
}

export interface OccasionCollection {
  id: string;
  slug: string;
  name: LocalizedText;
  subtitle: LocalizedText;
  image: string;
}

export interface PriceShortcut {
  id: string;
  slug: string;
  label: LocalizedText;
  sublabel: LocalizedText;
  minPrice?: number;
  maxPrice?: number;
}

export interface HeroSlide {
  id: string;
  eyebrow: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  offerNote: LocalizedText;
  featuredPiece: LocalizedText;
  cta: LocalizedText;
  link: string;
  image: string;
  mobileImage: string;
  accentTone: 'burgundy' | 'sand' | 'dark';
  textSide: 'left' | 'right';
}

export interface PromoBannerItem {
  id: string;
  kicker: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  cta: LocalizedText;
  link: string;
  image: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'classic-black',
    slug: 'classic-black-abayas',
    name: { ar: 'عبايات سوداء كلاسيكية', en: 'Classic Black Abayas' },
    shortName: { ar: 'سوداء كلاسيك', en: 'Classic Black' },
    description: {
      ar: 'قصّات متقنة من الكريب الياباني والكوري باللون الأسود الفاحم لإطلالة يومية أنيقة.',
      en: 'Precision-tailored jet-black Japanese and Korean crepe abayas for timeless daily grace.',
    },
    image: IMAGES.classicBlack,
    subcategories: [
      { slug: 'everyday-abayas', name: { ar: 'عبايات يومية عملية', en: 'Everyday Crepe' } },
      { slug: 'closed-abayas', name: { ar: 'عبايات مقفلة', en: 'Closed Silhouettes' } },
      { slug: 'open-abayas', name: { ar: 'عبايات مفتوحة', en: 'Open Front' } },
    ],
  },
  {
    id: 'luxury-abayas',
    slug: 'luxury-abayas',
    name: { ar: 'عبايات فاخرة', en: 'Luxury Abayas' },
    shortName: { ar: 'عبايات فاخرة', en: 'Luxury' },
    description: {
      ar: 'تصاميم حصرية من الحرير والمخمل والأورجانزا بتفاصيل يدوية راقية للذوق الرفيع.',
      en: 'Exclusive silk, velvet, and organza editions finished with artisanal couture detailing.',
    },
    image: IMAGES.blackGoldEmbroidery,
    subcategories: [
      { slug: 'embroidered-abayas', name: { ar: 'تطريز يدوي فاخر', en: 'Hand Embroidered' } },
      { slug: 'occasion-abayas', name: { ar: 'عبايات سهرات ومناسبات', en: 'Evening Couture' } },
    ],
  },
  {
    id: 'open-abayas',
    slug: 'open-abayas',
    name: { ar: 'عبايات مفتوحة', en: 'Open Abayas' },
    shortName: { ar: 'عبايات مفتوحة', en: 'Open Abayas' },
    description: {
      ar: 'انسيابية عصرية سهلة التنسيق مع فساتين داخلية وقطع يومية فخمة.',
      en: 'Effortless open-front drapes designed for layered contemporary modest styling.',
    },
    image: IMAGES.sandBeigeLinen,
    subcategories: [
      { slug: 'linen-abayas', name: { ar: 'عبايات كتان مفتوحة', en: 'Open Linen' } },
      { slug: 'colored-abayas', name: { ar: 'عبايات ملونة مفتوحة', en: 'Colored Open Cuts' } },
    ],
  },
  {
    id: 'closed-abayas',
    slug: 'closed-abayas',
    name: { ar: 'عبايات مقفلة', en: 'Closed Abayas' },
    shortName: { ar: 'عبايات مقفلة', en: 'Closed Abayas' },
    description: {
      ar: 'تصاميم عملية ومحتشمة بطقطق مخفي أو قصّة كلوش مثالية للدوام والمشاوير.',
      en: 'Structured modest silhouettes with concealed snaps, tailored for effortless movement.',
    },
    image: IMAGES.oliveSage,
    subcategories: [
      { slug: 'classic-black-abayas', name: { ar: 'مقفلة سوداء', en: 'Black Closed' } },
      { slug: 'everyday-abayas', name: { ar: 'مقفلة للدوام', en: 'Office Closed' } },
    ],
  },
  {
    id: 'embroidered-abayas',
    slug: 'embroidered-abayas',
    name: { ar: 'عبايات مطرزة', en: 'Embroidered Abayas' },
    shortName: { ar: 'عبايات مطرزة', en: 'Embroidered' },
    description: {
      ar: 'تطريزات ذهبية وخرز ناعم مستوحاة من التراث السعودي الأصيل بلمسة معاصرة.',
      en: 'Intricate metallic threadwork and subtle beadwork inspired by Saudi heritage artistry.',
    },
    image: IMAGES.burgundyVelvet,
    subcategories: [
      { slug: 'luxury-abayas', name: { ar: 'بشت مطرز', en: 'Embroidered Bisht' } },
      { slug: 'occasion-abayas', name: { ar: 'تطريز مناسبات', en: 'Festive Embroidery' } },
    ],
  },
  {
    id: 'colored-abayas',
    slug: 'colored-abayas',
    name: { ar: 'عبايات ملونة', en: 'Colored Abayas' },
    shortName: { ar: 'عبايات ملونة', en: 'Colored' },
    description: {
      ar: 'لوحة ألوان ترابية وراقية من العنابي والزيتوني والبني والكحلي والرمادي.',
      en: 'Curated earthen and jewel tones in burgundy, espresso, olive, slate, and midnight navy.',
    },
    image: IMAGES.espressoBrown,
    subcategories: [
      { slug: 'linen-abayas', name: { ar: 'ألوان صيفية فاتحة', en: 'Summer Neutrals' } },
      { slug: 'everyday-abayas', name: { ar: 'ألوان هادئة للعمل', en: 'Workwear Neutrals' } },
    ],
  },
  {
    id: 'linen-abayas',
    slug: 'linen-abayas',
    name: { ar: 'عبايات كتان', en: 'Linen Abayas' },
    shortName: { ar: 'عبايات كتان', en: 'Linen' },
    description: {
      ar: 'أقمشة كتان طبيعي باردة وخفيفة مصممة خصيصاً لأجواء المملكة الدافئة.',
      en: 'Breathable, lightweight natural linen abayas tailored for warm Saudi days and travel.',
    },
    image: IMAGES.sandBeigeLinen,
    subcategories: [
      { slug: 'open-abayas', name: { ar: 'كتان مفتوح', en: 'Open Linen' } },
      { slug: 'colored-abayas', name: { ar: 'كتان بدرجات الرمل', en: 'Desert Tones' } },
    ],
  },
  {
    id: 'occasion-abayas',
    slug: 'occasion-abayas',
    name: { ar: 'عبايات مناسبات', en: 'Occasion Abayas' },
    shortName: { ar: 'للمناسبات', en: 'Occasion' },
    description: {
      ar: 'تشكيلات العيد ورمضان والأفراح بقصات بشت وأكمام واسعة وتفاصيل لافتة.',
      en: 'Statement Eid, Ramadan, and wedding abayas with sculpted sleeves and lustrous textures.',
    },
    image: IMAGES.pearlCreamEid,
    subcategories: [
      { slug: 'luxury-abayas', name: { ar: 'مجموعة العيد', en: 'Eid Editions' } },
      { slug: 'embroidered-abayas', name: { ar: 'سهرة ومخمل', en: 'Velvet & Organza' } },
    ],
  },
  {
    id: 'hijabs',
    slug: 'hijabs',
    name: { ar: 'حجابات وطرح يومية', en: 'Hijabs' },
    shortName: { ar: 'حجابات', en: 'Hijabs' },
    description: {
      ar: 'حجابات مودال وشيفون ثابتة ومريحة بملامس ناعمة وألوان متناسقة مع عبايات ليانا.',
      en: 'Featherlight modal and silk-blend hijabs dyed to coordinate seamlessly with LAYANA abayas.',
    },
    image: IMAGES.hijabShayla,
    subcategories: [
      { slug: 'shaylas', name: { ar: 'شيلات ليزر وشيفون', en: 'Laser & Chiffon' } },
      { slug: 'accessories', name: { ar: 'طواقي ومثبتات', en: 'Undercaps & Pins' } },
    ],
  },
  {
    id: 'shaylas',
    slug: 'shaylas',
    name: { ar: 'طرح وشيلات', en: 'Shaylas' },
    shortName: { ar: 'طرح وشيلات', en: 'Shaylas' },
    description: {
      ar: 'شيلات سعودية فاخرة من الليزر الياباني والحرير بأطراف مطرزة وكريستال ناعم.',
      en: 'Signature Gulf shaylas crafted from Japanese laser crepe and silk with fine trim.',
    },
    image: IMAGES.hijabShayla,
    subcategories: [
      { slug: 'hijabs', name: { ar: 'طرح سوداء فاخرة', en: 'Jet Black Shaylas' } },
      { slug: 'occasion-abayas', name: { ar: 'شيلات مناسبات', en: 'Embroidered Shaylas' } },
    ],
  },
  {
    id: 'prayer-sets',
    slug: 'prayer-sets',
    name: { ar: 'أطقم صلاة', en: 'Prayer Sets' },
    shortName: { ar: 'أطقم صلاة', en: 'Prayer Sets' },
    description: {
      ar: 'شراشف صلاة قطنية باردة ومطرزة مع سجادات متناسقة ومثالية للإهداء ورمضان.',
      en: 'Breathable cotton-silk prayer dresses paired with matching woven mats for daily devotion and gifting.',
    },
    image: IMAGES.prayerSetAccessories,
    subcategories: [
      { slug: 'accessories', name: { ar: 'سجادات ومسابح', en: 'Mats & Gift Pouches' } },
    ],
  },
  {
    id: 'accessories',
    slug: 'accessories',
    name: { ar: 'إكسسوارات وبراقع ونقابات', en: 'Accessories & Niqabs' },
    shortName: { ar: 'إكسسوارات', en: 'Accessories' },
    description: {
      ar: 'نقابات كورية مريحة، دبابيس مغناطيسية باللؤلؤ، فساتين داخلية، وحقائب حفظ العبايات.',
      en: 'Breathable Saudi niqabs, pearl magnetic hijab pins, satin inner slips, and garment bags.',
    },
    image: IMAGES.prayerSetAccessories,
    subcategories: [
      { slug: 'hijabs', name: { ar: 'دبابيس مغناطيسية', en: 'Magnetic Pins' } },
      { slug: 'prayer-sets', name: { ar: 'فساتين تحت العباية', en: 'Inner Dresses' } },
    ],
  },
];

export const COLORS: ColorOption[] = [
  { id: 'black', name: { ar: 'أسود', en: 'Black' }, hex: '#1A1A1A', image: IMAGES.classicBlack },
  { id: 'beige', name: { ar: 'بيج رملي', en: 'Beige' }, hex: '#D8C7B2', image: IMAGES.sandBeigeLinen },
  { id: 'brown', name: { ar: 'بني إسبريسو', en: 'Brown' }, hex: '#5C3D2E', image: IMAGES.espressoBrown },
  { id: 'burgundy', name: { ar: 'عنابي ملكي', en: 'Burgundy' }, hex: '#581C32', image: IMAGES.burgundyVelvet },
  { id: 'olive', name: { ar: 'زيتوني', en: 'Olive' }, hex: '#5C6447', image: IMAGES.oliveSage },
  { id: 'grey', name: { ar: 'رمادي فحمي', en: 'Grey' }, hex: '#5A5E63', image: IMAGES.charcoalGreyOffice },
  { id: 'navy', name: { ar: 'كحلي ليلي', en: 'Navy' }, hex: '#1E2C47', image: IMAGES.navyEvening },
  { id: 'cream', name: { ar: 'كريمي لؤلؤي', en: 'Cream' }, hex: '#F1E9DC', image: IMAGES.pearlCreamEid },
];

export const OCCASIONS: OccasionCollection[] = [
  {
    id: 'everyday',
    slug: 'everyday-wear',
    name: { ar: 'إطلالات يومية', en: 'Everyday Wear' },
    subtitle: { ar: 'راحة وأناقة تدوم طوال اليوم', en: 'Effortless daily comfort & drape' },
    image: IMAGES.classicBlack,
  },
  {
    id: 'office',
    slug: 'office-wear',
    name: { ar: 'عبايات العمل والدوام', en: 'Office Wear' },
    subtitle: { ar: 'قصّات رسمية منظمة وعملية', en: 'Tailored silhouettes for workdays' },
    image: IMAGES.charcoalGreyOffice,
  },
  {
    id: 'wedding',
    slug: 'wedding-party',
    name: { ar: 'الأفراح والسهرات', en: 'Wedding & Party' },
    subtitle: { ar: 'أورجانزا وتطريزات فاخرة', en: 'Couture organza & fine beadwork' },
    image: IMAGES.navyEvening,
  },
  {
    id: 'ramadan',
    slug: 'ramadan-collection',
    name: { ar: 'مجموعة رمضان', en: 'Ramadan Collection' },
    subtitle: { ar: 'روحانية وأناقة أمسيات الشهر الفضيل', en: 'Refined pieces for blessed evenings' },
    image: IMAGES.burgundyVelvet,
  },
  {
    id: 'eid',
    slug: 'eid-collection',
    name: { ar: 'مجموعة العيد', en: 'Eid Collection' },
    subtitle: { ar: 'جاكار لؤلؤي وتفاصيل ذهبية راقية', en: 'Luminous jacquard & gold accents' },
    image: IMAGES.pearlCreamEid,
  },
  {
    id: 'travel',
    slug: 'travel-collection',
    name: { ar: 'مجموعة السفر', en: 'Travel Collection' },
    subtitle: { ar: 'أقمشة باردة لا تتجعد بسهولة', en: 'Wrinkle-resistant breathable travel cuts' },
    image: IMAGES.sandBeigeLinen,
  },
  {
    id: 'luxury',
    slug: 'luxury-collection',
    name: { ar: 'الإصدار الفاخر', en: 'Luxury Collection' },
    subtitle: { ar: 'إصدارات محدودة بتفاصيل يدوية', en: 'Signature limited-run craftsmanship' },
    image: IMAGES.blackGoldEmbroidery,
  },
];

export const PRICE_SHORTCUTS: PriceShortcut[] = [
  {
    id: 'under-99',
    slug: 'under-99',
    label: { ar: 'أقل من 99 ر.س', en: 'Under SAR 99' },
    sublabel: { ar: 'طرح، حجابات وإكسسوارات', en: 'Hijabs, Shaylas & Essentials' },
    maxPrice: 99,
  },
  {
    id: 'under-149',
    slug: 'under-149',
    label: { ar: 'أقل من 149 ر.س', en: 'Under SAR 149' },
    sublabel: { ar: 'أطقم صلاة وشيلات مطرزة', en: 'Prayer Sets & Silk Shaylas' },
    maxPrice: 149,
  },
  {
    id: 'under-199',
    slug: 'under-199',
    label: { ar: 'أقل من 199 ر.س', en: 'Under SAR 199' },
    sublabel: { ar: 'عبايات يومية عملية', en: 'Everyday Crepe Classics' },
    maxPrice: 199,
  },
  {
    id: 'under-299',
    slug: 'under-299',
    label: { ar: 'أقل من 299 ر.س', en: 'Under SAR 299' },
    sublabel: { ar: 'كتان، بليزر وعبايات ملونة', en: 'Linen, Office & Colored' },
    maxPrice: 299,
  },
  {
    id: 'premium',
    slug: 'premium-collection',
    label: { ar: 'المجموعة الفاخرة +300 ر.س', en: 'Premium Collection' },
    sublabel: { ar: 'بشت، مخمل وتطريز يدوي', en: 'Couture Bisht & Occasion' },
    minPrice: 300,
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'timeless-elegance',
    eyebrow: { ar: 'إصدار الموسم الفاخر', en: 'Signature Season Edit' },
    title: { ar: 'اكتشفي الأناقة الخالدة', en: 'Discover Timeless Elegance' },
    subtitle: {
      ar: 'عبايات حرير كريب وبشت مطرز بخيوط ذهبية متقنة مصممة لإطلالة سعودية راقية في كل وقت.',
      en: 'Silk-crepe abayas and antique gold-embroidered bishts crafted for contemporary Saudi grace.',
    },
    offerNote: { ar: 'تبدأ من 449 ر.س · شامل الضريبة', en: 'From SAR 449 · VAT Included' },
    featuredPiece: { ar: 'عباية قصر العنابي · 749 ر.س', en: 'Qasr Burgundy Velvet · SAR 749' },
    cta: { ar: 'تسوّقي التشكيلة', en: 'Shop Collection' },
    link: '/category/luxury-abayas',
    image: IMAGES.heroBurgundy,
    mobileImage: IMAGES.burgundyVelvet,
    accentTone: 'burgundy',
    textSide: 'right',
  },
  {
    id: 'everyday-linen',
    eyebrow: { ar: 'مجموعة الكتان والدوام', en: 'Everyday Linen Edit' },
    title: { ar: 'راحة الكتان الطبيعي بألوان هادئة', en: 'Effortless Desert Linen' },
    subtitle: {
      ar: 'أقمشة باردة وانسيابية مثالية للعمل والمشاوير الصباحية والسفر بخياطة سعودية متقنة.',
      en: 'Breathable natural linen silhouettes tailored for Riyadh workdays, errands, and effortless travel.',
    },
    offerNote: { ar: 'خصم تجريبي حتى 20% · توصيل سريع', en: 'Up to 20% Off · Express KSA' },
    featuredPiece: { ar: 'عباية صحارى كتان · 269 ر.س', en: 'Sahara Sand Linen · SAR 269' },
    cta: { ar: 'اكتشفي الكتان', en: 'Explore Linen' },
    link: '/category/linen-abayas',
    image: IMAGES.heroLinen,
    mobileImage: IMAGES.sandBeigeLinen,
    accentTone: 'sand',
    textSide: 'left',
  },
  {
    id: 'evening-occasion',
    eyebrow: { ar: 'إصدار العيد والمناسبات', en: 'Evening & Eid Couture' },
    title: { ar: 'حضور ملكي في كل مناسبة', en: 'Refined Occasion Couture' },
    subtitle: {
      ar: 'أورجانزا فاخرة وتفاصيل شك يدوي رقيق تمنحك فخامة استثنائية في أمسيات العيد والزفاف.',
      en: 'Sculpted organza and subtle hand-stitched metallic trim tailored for Eid gatherings and weddings.',
    },
    offerNote: { ar: 'قسّطي على 4 دفعات بدون فوائد', en: '4 Interest-Free Payments' },
    featuredPiece: { ar: 'عباية العلا المطرزة · 689 ر.س', en: 'Al-Ula Gold Bisht · SAR 689' },
    cta: { ar: 'تسوّقي المناسبات', en: 'Shop Occasions' },
    link: '/category/occasion-abayas',
    image: IMAGES.heroEvening,
    mobileImage: IMAGES.blackGoldEmbroidery,
    accentTone: 'dark',
    textSide: 'left',
  },
];

export const PROMO_BANNERS: PromoBannerItem[] = [
  {
    id: 'premium-abaya',
    kicker: { ar: 'تصاميم حصرية', en: 'Signature Atelier' },
    title: { ar: 'مجموعة العبايات الفاخرة', en: 'Premium Abaya Collection' },
    subtitle: { ar: 'تطريز يدوي وأقمشة يابانية فاخرة', en: 'Hand-embroidered bishts & fine Japanese fabrics' },
    cta: { ar: 'استكشفي الفخامة', en: 'Explore Luxury' },
    link: '/category/luxury-abayas',
    image: IMAGES.blackGoldEmbroidery,
  },
  {
    id: 'everyday-collection',
    kicker: { ar: 'عملية وأنيقة', en: 'Daily Essentials' },
    title: { ar: 'مجموعة الإطلالات اليومية', en: 'Everyday Collection' },
    subtitle: { ar: 'قصّات مريحة للدوام والجامعة والمشاوير', en: 'Tailored crepe & office-ready abayas' },
    cta: { ar: 'تسوّقي اليومي', en: 'Shop Everyday' },
    link: '/collection/everyday-wear',
    image: IMAGES.charcoalGreyOffice,
  },
  {
    id: 'evening-occasion',
    kicker: { ar: 'سهرات ومناسبات', en: 'Evening Edit' },
    title: { ar: 'مجموعة السهرة والمناسبات', en: 'Evening & Occasion Collection' },
    subtitle: { ar: 'حرير، مخمل وجاكار للعيد والأفراح', en: 'Silk velvet & jacquard for Eid & weddings' },
    cta: { ar: 'تسوّقي المناسبات', en: 'Shop Occasion' },
    link: '/category/occasion-abayas',
    image: IMAGES.pearlCreamEid,
  },
  {
    id: 'hijab-shayla',
    kicker: { ar: 'لمسة متكاملة', en: 'Finishing Touches' },
    title: { ar: 'مجموعة الطرح والشيلات', en: 'Hijab & Shayla Collection' },
    subtitle: { ar: 'شيفون حريري ومودال بألوان متناسقة', en: 'Silk chiffon & modal shaylas in curated hues' },
    cta: { ar: 'تسوّقي الطرح', en: 'Shop Shaylas' },
    link: '/category/shaylas',
    image: IMAGES.hijabShayla,
  },
];

export const SECONDARY_NAV_ITEMS: { label: LocalizedText; path: string; categorySlug?: string; highlight?: boolean }[] = [
  { label: { ar: 'وصل حديثاً', en: 'New Arrivals' }, path: '/new-arrivals' },
  { label: { ar: 'العبايات', en: 'Abayas' }, path: '/products' },
  { label: { ar: 'عبايات فاخرة', en: 'Luxury Abayas' }, path: '/category/luxury-abayas', categorySlug: 'luxury-abayas' },
  { label: { ar: 'عبايات يومية', en: 'Everyday Abayas' }, path: '/collection/everyday-wear' },
  { label: { ar: 'عبايات مفتوحة', en: 'Open Abayas' }, path: '/category/open-abayas', categorySlug: 'open-abayas' },
  { label: { ar: 'عبايات مقفلة', en: 'Closed Abayas' }, path: '/category/closed-abayas', categorySlug: 'closed-abayas' },
  { label: { ar: 'عبايات مطرزة', en: 'Embroidered Abayas' }, path: '/category/embroidered-abayas', categorySlug: 'embroidered-abayas' },
  { label: { ar: 'عبايات مناسبات', en: 'Occasion Abayas' }, path: '/category/occasion-abayas', categorySlug: 'occasion-abayas' },
  { label: { ar: 'الطرح والشيلات', en: 'Hijabs & Shaylas' }, path: '/category/shaylas', categorySlug: 'shaylas' },
  { label: { ar: 'الإكسسوارات', en: 'Accessories' }, path: '/category/accessories', categorySlug: 'accessories' },
  { label: { ar: 'الأكثر مبيعاً', en: 'Best Sellers' }, path: '/best-sellers' },
  { label: { ar: 'التخفيضات', en: 'Sale' }, path: '/sale', highlight: true },
];
