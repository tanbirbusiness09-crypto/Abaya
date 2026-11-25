import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { SeoHead } from '../components/ui/SeoHead';
import { useLocale } from '../context/LocaleContext';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';

export function WishlistPage() {
  const { lang, t } = useLocale();
  const { wishlistIds } = useStore();

  const items = wishlistIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <SeoHead title={t.wishlist} />
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-6 space-y-6">
        <div className="flex items-baseline justify-between">
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#202020]">
            {t.wishlist} ({items.length})
          </h1>
          <Link to="/products" className="text-xs sm:text-sm font-bold text-[#581C32] hover:underline">
            {t.cartPage.continueShopping}
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#EAE5DF] p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F8F4ED] text-[#581C32] flex items-center justify-center">
              <Heart className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-[#202020]">
              {lang === 'ar' ? 'قائمة المفضلة فارغة' : 'Your wishlist is empty'}
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] max-w-md mx-auto">
              {lang === 'ar'
                ? 'احفظي العبايات والطرح التي تعجبك للعودة إليها بسهولة لاحقاً.'
                : 'Save your favorite Saudi abayas and shaylas here to revisit them anytime.'}
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 rounded-lg bg-[#581C32] text-white text-sm font-bold"
            >
              {t.shopNow}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
