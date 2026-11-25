import { Grid2x2, Heart, Home, ShoppingBag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useStore } from '../../context/StoreContext';

export function MobileBottomNav() {
  const { pathname } = useLocation();
  const { t } = useLocale();
  const { cartTotals, wishlistIds } = useStore();

  // Hide bottom bar on Product Details page because PDP has its own sticky Add to Cart / Buy Now bar
  if (pathname.startsWith('/product/')) return null;

  const navItems = [
    { path: '/', label: t.home, icon: Home, match: (p: string) => p === '/' },
    {
      path: '/categories',
      label: t.categories,
      icon: Grid2x2,
      match: (p: string) => p.startsWith('/categories') || p.startsWith('/category/') || p === '/products',
    },
    {
      path: '/wishlist',
      label: t.wishlist,
      icon: Heart,
      badge: wishlistIds.length,
      match: (p: string) => p === '/wishlist',
    },
    {
      path: '/cart',
      label: t.cart,
      icon: ShoppingBag,
      badge: cartTotals.itemCount,
      match: (p: string) => p === '/cart' || p === '/checkout',
    },
    {
      path: '/account',
      label: t.account,
      icon: User,
      match: (p: string) => p.startsWith('/account') || p === '/login' || p === '/register' || p === '/order-tracking',
    },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#EAE5DF] shadow-[0_-4px_16px_rgba(32,32,32,0.06)] pb-safe"
    >
      <div className="grid grid-cols-5 h-[58px] px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] transition-all active:scale-95 ${
                active ? 'text-[#581C32] font-bold' : 'text-[#6E6660] font-medium'
              }`}
            >
              <span
                className={`relative inline-flex items-center justify-center px-3.5 py-1 rounded-full transition-colors ${
                  active ? 'bg-[#581C32]/12 text-[#581C32]' : 'bg-transparent'
                }`}
              >
                <Icon className="w-[19px] h-[19px]" strokeWidth={active ? 2.3 : 1.8} />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-0.5 end-1 min-w-[16px] h-4 px-1 rounded-full bg-[#D92D39] text-white text-[9px] font-bold flex items-center justify-center tabular-nums shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </span>
              <span className="truncate max-w-full px-1 leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
