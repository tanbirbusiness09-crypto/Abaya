import { ArrowLeftRight, Star, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';
import { formatPrice } from '../../utils/catalogLogic';
import { SmartImage } from './SmartImage';

export function CompareDrawer() {
  const { compareIds, toggleCompare, clearCompare, isCompareOpen, setCompareOpen } = useStore();
  const { lang, l } = useLocale();

  const items = compareIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0) return null;

  return (
    <>
      {!isCompareOpen && (
        <div className="fixed bottom-16 md:bottom-5 start-4 z-40">
          <button
            type="button"
            onClick={() => setCompareOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3D1023] text-white text-xs font-semibold shadow-lg hover:bg-[#581C32] transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#C5A572]" />
            <span>
              {lang === 'ar' ? `مقارنة (${items.length})` : `Compare (${items.length})`}
            </span>
          </button>
        </div>
      )}

      {isCompareOpen && (
        <div
          className="fixed inset-0 z-[75] bg-black/55 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'ar' ? 'مقارنة المنتجات' : 'Product Comparison'}
          onClick={() => setCompareOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[88vh] overflow-y-auto border border-[#EAE5DF] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE5DF]">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-[#581C32]" />
                <h2 className="text-base font-bold text-[#202020]">
                  {lang === 'ar' ? 'مقارنة العبايات المختارة' : 'Compare Selected Designs'}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    clearCompare();
                    setCompareOpen(false);
                  }}
                  className="text-xs font-medium text-[#D92D39] hover:underline"
                >
                  {lang === 'ar' ? 'مسح القائمة' : 'Clear All'}
                </button>
                <button
                  type="button"
                  onClick={() => setCompareOpen(false)}
                  aria-label="Close comparison"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#777777] hover:bg-[#F8F4ED]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-x-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-[540px]">
                {items.map((item) => (
                  <div key={item.id} className="border border-[#EAE5DF] rounded-lg overflow-hidden flex flex-col">
                    <div className="relative aspect-[3/4] bg-[#F8F4ED]">
                      <SmartImage
                        src={item.images[0]}
                        alt={l(item.name)}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => toggleCompare(item.id)}
                        aria-label={`Remove ${l(item.name)} from comparison`}
                        className="absolute top-2 end-2 w-8 h-8 rounded-full bg-white/90 text-[#777777] hover:text-[#D92D39] flex items-center justify-center shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3.5 space-y-2 text-xs flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={() => setCompareOpen(false)}
                          className="font-bold text-sm text-[#202020] hover:text-[#581C32] line-clamp-2"
                        >
                          {l(item.name)}
                        </Link>
                        <p className="text-base font-bold text-[#581C32] tabular-nums">
                          {formatPrice(item.price, lang)}
                        </p>
                        <div className="divide-y divide-[#EAE5DF] border-t border-[#EAE5DF] pt-1">
                          <div className="py-1.5 flex justify-between gap-2">
                            <span className="text-[#777777]">{lang === 'ar' ? 'القماش' : 'Fabric'}</span>
                            <span className="font-medium text-end">{l(item.fabric)}</span>
                          </div>
                          <div className="py-1.5 flex justify-between gap-2">
                            <span className="text-[#777777]">{lang === 'ar' ? 'القصّة' : 'Cut'}</span>
                            <span className="font-medium text-end">{l(item.style)}</span>
                          </div>
                          <div className="py-1.5 flex justify-between gap-2">
                            <span className="text-[#777777]">{lang === 'ar' ? 'التقييم' : 'Rating'}</span>
                            <span className="inline-flex items-center gap-1 font-semibold">
                              <Star className="w-3 h-3 fill-[#C5A572] text-[#C5A572]" />
                              {item.rating.toFixed(1)}
                            </span>
                          </div>
                          <div className="py-1.5 flex justify-between gap-2">
                            <span className="text-[#777777]">{lang === 'ar' ? 'مع طرحة' : 'Shayla'}</span>
                            <span className="font-medium">
                              {item.includesShayla
                                ? lang === 'ar' ? 'نعم' : 'Included'
                                : lang === 'ar' ? 'لا ينطبق' : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={() => setCompareOpen(false)}
                        className="mt-2 block w-full text-center py-2 rounded-lg bg-[#581C32] text-white font-semibold hover:bg-[#3D1023]"
                      >
                        {lang === 'ar' ? 'عرض المنتج' : 'View Product'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
