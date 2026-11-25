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
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#EAE5DF] shadow-[0_-2px_12px_rgba(0,0,0,0.05)] pb-safe"
    >
      <div className="grid grid-cols-5 h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
                active ? 'text-[#581C32] font-bold' : 'text-[#777777]'
              }`}
            >
              {active && (
                <span className="absolute top-0 inset-x-4 h-0.5 bg-[#581C32] rounded-b" />
              )}
              <span className="relative">
                <Icon className="w-5 h-5" strokeWidth={active ? 2.3 : 1.8} />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1.5 -end-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#581C32] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </span>
              <span className="truncate max-w-full px-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
