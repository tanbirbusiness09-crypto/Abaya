import { Link } from 'react-router-dom';
import { SeoHead } from '../components/ui/SeoHead';
import { useLocale } from '../context/LocaleContext';

export function NotFoundPage() {
  const { lang, t } = useLocale();

  return (
    <>
      <SeoHead title="404" />
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="font-editorial text-6xl font-bold text-[#C5A572] tabular-nums">404</p>
        <h1 className="text-2xl font-bold text-[#202020]">
          {lang === 'ar' ? 'عذراً، الصفحة غير موجودة' : 'Sorry, Page Not Found'}
        </h1>
        <p className="text-sm text-[#777777]">
          {lang === 'ar'
            ? 'الرابط الذي تبحثين عنه غير متوفر. يمكنك العودة للرئيسية أو استكشاف أحدث عبايات ليانا.'
            : 'The page you are looking for is unavailable. Return home or browse the latest LAYANA abayas.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-6 py-3 rounded-lg bg-[#581C32] hover:bg-[#3D1023] text-white text-sm font-bold"
          >
            {t.home}
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 rounded-lg border border-[#EAE5DF] bg-white hover:border-[#581C32] text-sm font-bold text-[#202020]"
          >
            {t.shopNow}
          </Link>
        </div>
      </div>
    </>
  );
}
