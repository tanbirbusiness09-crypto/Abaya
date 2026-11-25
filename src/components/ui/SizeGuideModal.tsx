import { Ruler, X } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { useStore } from '../../context/StoreContext';

export const ABAYA_SIZE_CHART = [
  { size: '50', lengthCm: '127', heightCm: '148 – 153', chestCm: '104', sleeveCm: '66' },
  { size: '52', lengthCm: '132', heightCm: '154 – 158', chestCm: '108', sleeveCm: '67' },
  { size: '54', lengthCm: '137', heightCm: '159 – 163', chestCm: '112', sleeveCm: '69' },
  { size: '56', lengthCm: '142', heightCm: '164 – 168', chestCm: '118', sleeveCm: '71' },
  { size: '58', lengthCm: '147', heightCm: '169 – 173', chestCm: '122', sleeveCm: '73' },
  { size: '60', lengthCm: '152', heightCm: '174 – 178', chestCm: '128', sleeveCm: '75' },
  { size: '62', lengthCm: '157', heightCm: '179 – 184', chestCm: '132', sleeveCm: '76' },
];

export function SizeGuideModal() {
  const { isSizeGuideOpen, setSizeGuideOpen } = useStore();
  const { lang } = useLocale();

  if (!isSizeGuideOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/55 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'ar' ? 'دليل مقاسات وأطوال العبايات' : 'Saudi Abaya Length & Size Guide'}
      onClick={() => setSizeGuideOpen(false)}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#EAE5DF] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE5DF]">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-[#581C32]" />
            <h2 className="text-lg font-bold text-[#202020]">
              {lang === 'ar' ? 'دليل مقاسات وأطوال العبايات السعودية' : 'Saudi Abaya Length & Size Guide'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(false)}
            aria-label={lang === 'ar' ? 'إغلاق دليل المقاسات' : 'Close size guide'}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#777777] hover:bg-[#F8F4ED] hover:text-[#202020]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-[#777777] leading-relaxed">
            {lang === 'ar'
              ? 'تُقاس العبايات السعودية بالإنش من أعلى الكتف حتى أسفل الكعب. إذا كنتِ تفضلين ارتداء الكعب العالي مع العباية، ننصح باختيار مقاس أطول بدرجة واحدة.'
              : 'Saudi abayas are sized by length in inches measured from the top shoulder seam to the ankle hem. If you plan to wear heels, we recommend sizing up by one length (2 inches).'}
          </p>

          <div className="overflow-x-auto border border-[#EAE5DF] rounded-lg">
            <table className="w-full text-sm text-start">
              <thead className="bg-[#F8F4ED] text-[#581C32] font-semibold">
                <tr>
                  <th className="px-3.5 py-2.5 text-start">{lang === 'ar' ? 'المقاس (إنش)' : 'Size (In)'}</th>
                  <th className="px-3.5 py-2.5 text-start">{lang === 'ar' ? 'الطول (سم)' : 'Length (cm)'}</th>
                  <th className="px-3.5 py-2.5 text-start">{lang === 'ar' ? 'الطول المقترح (سم)' : 'Recommended Height'}</th>
                  <th className="px-3.5 py-2.5 text-start">{lang === 'ar' ? 'محيط الصدر (سم)' : 'Chest (cm)'}</th>
                  <th className="px-3.5 py-2.5 text-start">{lang === 'ar' ? 'طول الكم (سم)' : 'Sleeve (cm)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DF] tabular-nums">
                {ABAYA_SIZE_CHART.map((row) => (
                  <tr key={row.size} className="hover:bg-[#F8F4ED]/60">
                    <td className="px-3.5 py-2.5 font-bold text-[#581C32]">{row.size}</td>
                    <td className="px-3.5 py-2.5">{row.lengthCm}</td>
                    <td className="px-3.5 py-2.5">{row.heightCm}</td>
                    <td className="px-3.5 py-2.5">{row.chestCm}</td>
                    <td className="px-3.5 py-2.5">{row.sleeveCm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#F8F4ED] rounded-lg p-4 text-xs text-[#777777] space-y-1.5">
            <p className="font-semibold text-[#202020]">
              {lang === 'ar' ? 'نصيحة ليانا للمقاسات:' : 'LAYANA Fit Note:'}
            </p>
            <p>
              {lang === 'ar'
                ? 'قصّات البشت والكلوش تأتي بقصّة واسعة ومريحة، بينما قصّات البليزر والدوام تأتي بقصّة مرتبة ومحددة الأكتاف.'
                : 'Bisht and Half-Cloche cuts offer a generous flowing drape, while Blazer and Office silhouettes feature structured shoulders.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
