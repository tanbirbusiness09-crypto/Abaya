import { Link } from 'react-router-dom';
import { SeoHead } from '../components/ui/SeoHead';
import { SmartImage } from '../components/ui/SmartImage';
import { useLocale } from '../context/LocaleContext';
import { CATEGORIES, COLORS, OCCASIONS, PRICE_SHORTCUTS } from '../data/categories';
import { PRODUCTS } from '../data/products';

export function CategoriesPage({ initialTab = 'categories' }: { initialTab?: 'categories' | 'collections' }) {
  const { lang, l, t } = useLocale();

  const title =
    initialTab === 'collections'
      ? lang === 'ar' ? 'المجموعات والمناسبات' : 'Collections & Occasions'
      : t.allCategories;

  return (
    <>
      <SeoHead title={title} />
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-6 space-y-10">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#202020]">{title}</h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1">
            {lang === 'ar'
              ? 'استكشفي جميع أقسام ليانا من العبايات السوداء والفاخرة والكتان والطرح وأطقم الصلاة.'
              : 'Explore every LAYANA category from classic black crepe and luxury couture to linen, shaylas, and prayer sets.'}
          </p>
        </div>

        {/* All 12 Categories */}
        <section>
          <h2 className="text-lg font-bold text-[#202020] mb-4">{t.sections.shopByCategory}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {CATEGORIES.map((cat) => {
              const count = PRODUCTS.filter(
                (p) => p.categorySlug === cat.slug || p.secondaryCategories.includes(cat.slug)
              ).length;
              return (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="group bg-white rounded-xl border border-[#EAE5DF] hover:border-[#581C32] overflow-hidden transition-all"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-[#F8F4ED]">
                    <SmartImage
                      src={cat.image}
                      alt={l(cat.name)}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs sm:text-sm font-bold text-[#202020] group-hover:text-[#581C32] line-clamp-1">
                      {l(cat.name)}
                    </h3>
                    <p className="text-[11px] text-[#777777] mt-0.5 tabular-nums">
                      {count} {t.filters.productsFound}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Occasion Collections */}
        <section>
          <h2 className="text-lg font-bold text-[#202020] mb-4">{t.sections.shopByOccasion}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {OCCASIONS.map((occ) => (
              <Link
                key={occ.slug}
                to={`/collection/${occ.slug}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-[#3D1023] border border-[#EAE5DF]"
              >
                <SmartImage
                  src={occ.image}
                  alt={l(occ.name)}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A0B18]/85 via-[#2A0B18]/25 to-transparent flex flex-col justify-end p-4 text-white">
                  <h3 className="text-base font-bold">{l(occ.name)}</h3>
                  <p className="text-xs text-white/80 mt-0.5">{l(occ.subtitle)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Shop by Color & Price */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#EAE5DF] p-5">
            <h2 className="text-base font-bold text-[#202020] mb-4">{t.sections.shopByColor}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {COLORS.map((c) => (
                <Link
                  key={c.id}
                  to={`/products?color=${c.id}`}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[#EAE5DF] hover:border-[#581C32]"
                >
                  <span
                    className="w-5 h-5 rounded-full border border-[#EAE5DF] shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-xs font-semibold text-[#202020]">{l(c.name)}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#EAE5DF] p-5">
            <h2 className="text-base font-bold text-[#202020] mb-4">{t.sections.shopByPrice}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRICE_SHORTCUTS.map((tier) => (
                <Link
                  key={tier.id}
                  to={`/products?${tier.maxPrice ? `maxPrice=${tier.maxPrice}` : `minPrice=${tier.minPrice}`}`}
                  className="p-3 rounded-lg bg-[#F8F4ED] hover:bg-[#581C32] hover:text-white transition-colors group"
                >
                  <p className="text-sm font-bold text-[#581C32] group-hover:text-white">{l(tier.label)}</p>
                  <p className="text-[11px] text-[#777777] group-hover:text-white/80">{l(tier.sublabel)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
