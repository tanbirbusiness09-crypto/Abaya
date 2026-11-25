import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { PRODUCTS, type Product, type ProductReview } from '../data/products';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  calculateCartTotals,
  findCoupon,
  type CartItem,
  type CartTotals,
} from '../utils/catalogLogic';

export type OrderStatusStep =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered';

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  cityId: string;
  district: string;
  street: string;
  building: string;
  postalCode: string;
  notes?: string;
  isDefault?: boolean;
}

export interface DemoOrder {
  id: string;
  createdAt: string;
  status: OrderStatusStep;
  items: CartItem[];
  totals: CartTotals;
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  address: {
    cityId: string;
    district: string;
    street: string;
    building: string;
    postalCode: string;
    notes?: string;
  };
  deliveryMethod: 'standard' | 'express';
  paymentMethodId: string;
  estimatedDelivery: string;
}

export interface DemoUser {
  isAuthenticated: boolean;
  fullName: string;
  email: string;
  phone: string;
  memberSince: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  tone: 'success' | 'info' | 'error';
}

export interface UserNotification {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  date: string;
  read: boolean;
}

const INITIAL_DEMO_ORDERS: DemoOrder[] = [
  {
    id: 'LYN-2026-8421',
    createdAt: '2026-11-21T14:30:00Z',
    status: 'out_for_delivery',
    items: [
      {
        key: 'prod-06::black::54',
        productId: 'prod-06',
        slug: PRODUCTS[5].slug,
        sku: PRODUCTS[5].sku,
        name: PRODUCTS[5].name,
        image: PRODUCTS[5].images[0],
        price: PRODUCTS[5].price,
        originalPrice: PRODUCTS[5].originalPrice,
        colorId: 'black',
        colorName: PRODUCTS[5].colors[0].name,
        colorHex: PRODUCTS[5].colors[0].hex,
        size: '54',
        quantity: 1,
      },
      {
        key: 'prod-43::black::One Size',
        productId: 'prod-43',
        slug: PRODUCTS[42].slug,
        sku: PRODUCTS[42].sku,
        name: PRODUCTS[42].name,
        image: PRODUCTS[42].images[0],
        price: PRODUCTS[42].price,
        originalPrice: PRODUCTS[42].originalPrice,
        colorId: 'black',
        colorName: PRODUCTS[42].colors[0].name,
        colorHex: PRODUCTS[42].colors[0].hex,
        size: 'One Size',
        quantity: 1,
      },
    ],
    totals: calculateCartTotals([
      {
        key: 'prod-06::black::54',
        productId: 'prod-06',
        slug: PRODUCTS[5].slug,
        sku: PRODUCTS[5].sku,
        name: PRODUCTS[5].name,
        image: PRODUCTS[5].images[0],
        price: PRODUCTS[5].price,
        colorId: 'black',
        colorName: PRODUCTS[5].colors[0].name,
        colorHex: PRODUCTS[5].colors[0].hex,
        size: '54',
        quantity: 1,
      },
      {
        key: 'prod-43::black::One Size',
        productId: 'prod-43',
        slug: PRODUCTS[42].slug,
        sku: PRODUCTS[42].sku,
        name: PRODUCTS[42].name,
        image: PRODUCTS[42].images[0],
        price: PRODUCTS[42].price,
        colorId: 'black',
        colorName: PRODUCTS[42].colors[0].name,
        colorHex: PRODUCTS[42].colors[0].hex,
        size: 'One Size',
        quantity: 1,
      },
    ]),
    customer: {
      fullName: 'العنود العتيبي',
      phone: '+966 55 412 8901',
      email: 'alanoud.demo@layana-demo.sa',
    },
    address: {
      cityId: 'riyadh',
      district: 'حي الملقا',
      street: 'طريق أنس بن مالك',
      building: '4218',
      postalCode: '13521',
    },
    deliveryMethod: 'express',
    paymentMethodId: 'mada',
    estimatedDelivery: '2026-11-25',
  },
  {
    id: 'LYN-2026-7910',
    createdAt: '2026-11-08T10:15:00Z',
    status: 'delivered',
    items: [
      {
        key: 'prod-11::beige::56',
        productId: 'prod-11',
        slug: PRODUCTS[10].slug,
        sku: PRODUCTS[10].sku,
        name: PRODUCTS[10].name,
        image: PRODUCTS[10].images[0],
        price: PRODUCTS[10].price,
        colorId: 'beige',
        colorName: PRODUCTS[10].colors[0].name,
        colorHex: PRODUCTS[10].colors[0].hex,
        size: '56',
        quantity: 1,
      },
    ],
    totals: calculateCartTotals([
      {
        key: 'prod-11::beige::56',
        productId: 'prod-11',
        slug: PRODUCTS[10].slug,
        sku: PRODUCTS[10].sku,
        name: PRODUCTS[10].name,
        image: PRODUCTS[10].images[0],
        price: PRODUCTS[10].price,
        colorId: 'beige',
        colorName: PRODUCTS[10].colors[0].name,
        colorHex: PRODUCTS[10].colors[0].hex,
        size: '56',
        quantity: 1,
      },
    ]),
    customer: {
      fullName: 'العنود العتيبي',
      phone: '+966 55 412 8901',
      email: 'alanoud.demo@layana-demo.sa',
    },
    address: {
      cityId: 'riyadh',
      district: 'حي الملقا',
      street: 'طريق أنس بن مالك',
      building: '4218',
      postalCode: '13521',
    },
    deliveryMethod: 'standard',
    paymentMethodId: 'tabby',
    estimatedDelivery: '2026-11-10',
  },
];

const INITIAL_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    label: 'المنزل — الرياض / Home — Riyadh',
    fullName: 'العنود العتيبي',
    phone: '+966 55 412 8901',
    cityId: 'riyadh',
    district: 'حي الملقا',
    street: 'طريق أنس بن مالك',
    building: '4218',
    postalCode: '13521',
    isDefault: true,
  },
];

const INITIAL_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'notif-1',
    titleAr: 'طلبك #LYN-2026-8421 خرج للتوصيل',
    titleEn: 'Order #LYN-2026-8421 is Out for Delivery',
    bodyAr: 'المندوب في طريقه إليك في الرياض اليوم بين 4:00 و 8:00 مساءً (إشعار تجريبي).',
    bodyEn: 'Courier is en route in Riyadh today between 4:00 PM and 8:00 PM (Demo notification).',
    date: '2026-11-24',
    read: false,
  },
  {
    id: 'notif-2',
    titleAr: 'وصلت تشكيلة العيد والجاكار اللؤلؤي',
    titleEn: 'New Pearl Jacquard Eid Editions Arrived',
    bodyAr: 'استخدمي كود LAYANA15 للحصول على خصم 15% تجريبي للطلبات فوق 250 ر.س.',
    bodyEn: 'Use demo promo code LAYANA15 for 15% off orders above SAR 250.',
    date: '2026-11-20',
    read: true,
  },
];

interface StoreContextValue {
  cart: CartItem[];
  cartTotals: CartTotals;
  couponCode: string | null;
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, colorId: string, size: string, quantity?: number, openDrawer?: boolean) => void;
  updateCartQty: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { ok: boolean; reason?: 'invalid' | 'min_subtotal'; minSubtotal?: number };
  removeCoupon: () => void;

  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  recentlyViewedIds: string[];
  recordRecentlyViewed: (productId: string) => void;

  recentSearches: string[];
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;

  compareIds: string[];
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setCompareOpen: (open: boolean) => void;

  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  isSizeGuideOpen: boolean;
  setSizeGuideOpen: (open: boolean) => void;

  user: DemoUser;
  loginDemoUser: (data: Partial<DemoUser>) => void;
  logoutDemoUser: () => void;
  updateUserProfile: (data: Partial<DemoUser>) => void;

  orders: DemoOrder[];
  createDemoOrder: (orderInput: Omit<DemoOrder, 'id' | 'createdAt' | 'status'>) => DemoOrder;
  getOrderById: (id: string) => DemoOrder | undefined;

  addresses: SavedAddress[];
  addAddress: (addr: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  notifications: UserNotification[];
  markAllNotificationsRead: () => void;

  customReviews: Record<string, ProductReview[]>;
  addProductReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'verified'>) => void;

  toasts: ToastMessage[];
  showToast: (text: string, tone?: ToastMessage['tone']) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useLocalStorage<CartItem[]>('layana_cart_v1', []);
  const [couponCode, setCouponCode] = useLocalStorage<string | null>('layana_coupon_v1', null);
  const [wishlistIds, setWishlistIds] = useLocalStorage<string[]>('layana_wishlist_v1', ['prod-06', 'prod-11']);
  const [recentlyViewedIds, setRecentlyViewedIds] = useLocalStorage<string[]>('layana_recent_v1', ['prod-01', 'prod-07', 'prod-11', 'prod-16']);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('layana_searches_v1', []);
  const [compareIds, setCompareIds] = useLocalStorage<string[]>('layana_compare_v1', []);
  const [user, setUser] = useLocalStorage<DemoUser>('layana_user_v1', {
    isAuthenticated: false,
    fullName: 'العنود العتيبي',
    email: 'alanoud.demo@layana-demo.sa',
    phone: '+966 55 412 8901',
    memberSince: '2026',
  });
  const [orders, setOrders] = useLocalStorage<DemoOrder[]>('layana_orders_v1', INITIAL_DEMO_ORDERS);
  const [addresses, setAddresses] = useLocalStorage<SavedAddress[]>('layana_addresses_v1', INITIAL_ADDRESSES);
  const [notifications, setNotifications] = useLocalStorage<UserNotification[]>('layana_notifs_v1', INITIAL_NOTIFICATIONS);
  const [customReviews, setCustomReviews] = useLocalStorage<Record<string, ProductReview[]>>('layana_reviews_v1', {});

  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isCompareOpen, setCompareOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (text: string, tone: ToastMessage['tone'] = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, text, tone }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    },
    []
  );

  const cartTotals = useMemo(
    () => calculateCartTotals(cart, { couponCode }),
    [cart, couponCode]
  );

  const addToCart = useCallback(
    (product: Product, colorId: string, size: string, quantity = 1, openDrawer = true) => {
      const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
      const key = `${product.id}::${color.id}::${size}`;
      setCart((prev) => {
        const existing = prev.find((item) => item.key === key);
        if (existing) {
          return prev.map((item) =>
            item.key === key ? { ...item, quantity: Math.min(10, item.quantity + quantity) } : item
          );
        }
        return [
          ...prev,
          {
            key,
            productId: product.id,
            slug: product.slug,
            sku: product.sku,
            name: product.name,
            image: color.image || product.images[0],
            price: product.price,
            originalPrice: product.originalPrice,
            colorId: color.id,
            colorName: color.name,
            colorHex: color.hex,
            size,
            quantity,
          },
        ];
      });
      if (openDrawer) {
        setCartDrawerOpen(true);
      }
    },
    [setCart]
  );

  const updateCartQty = useCallback(
    (key: string, quantity: number) => {
      if (quantity <= 0) {
        setCart((prev) => prev.filter((i) => i.key !== key));
        return;
      }
      setCart((prev) =>
        prev.map((item) => (item.key === key ? { ...item, quantity: Math.min(10, quantity) } : item))
      );
    },
    [setCart]
  );

  const removeFromCart = useCallback(
    (key: string) => {
      setCart((prev) => prev.filter((i) => i.key !== key));
    },
    [setCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setCouponCode(null);
  }, [setCart, setCouponCode]);

  const applyCoupon = useCallback(
    (code: string) => {
      const coupon = findCoupon(code);
      if (!coupon) {
        return { ok: false as const, reason: 'invalid' as const };
      }
      if (cartTotals.subtotal < coupon.minSubtotal) {
        return { ok: false as const, reason: 'min_subtotal' as const, minSubtotal: coupon.minSubtotal };
      }
      setCouponCode(coupon.code);
      return { ok: true as const };
    },
    [cartTotals.subtotal, setCouponCode]
  );

  const removeCoupon = useCallback(() => setCouponCode(null), [setCouponCode]);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlistIds((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev]
      );
    },
    [setWishlistIds]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const recordRecentlyViewed = useCallback(
    (productId: string) => {
      setRecentlyViewedIds((prev) => {
        if (prev[0] === productId) return prev;
        return [productId, ...prev.filter((id) => id !== productId)].slice(0, 12);
      });
    },
    [setRecentlyViewedIds]
  );

  const addRecentSearch = useCallback(
    (q: string) => {
      const cleaned = q.trim();
      if (!cleaned) return;
      setRecentSearches((prev) => [cleaned, ...prev.filter((s) => s.toLowerCase() !== cleaned.toLowerCase())].slice(0, 6));
    },
    [setRecentSearches]
  );

  const clearRecentSearches = useCallback(() => setRecentSearches([]), [setRecentSearches]);

  const toggleCompare = useCallback(
    (productId: string) => {
      setCompareIds((prev) => {
        if (prev.includes(productId)) {
          return prev.filter((id) => id !== productId);
        }
        return [...prev.slice(-2), productId]; // Keep up to 3 items side by side
      });
    },
    [setCompareIds]
  );

  const clearCompare = useCallback(() => setCompareIds([]), [setCompareIds]);

  const loginDemoUser = useCallback(
    (data: Partial<DemoUser>) => {
      setUser((prev) => ({
        ...prev,
        ...data,
        isAuthenticated: true,
      }));
    },
    [setUser]
  );

  const logoutDemoUser = useCallback(() => {
    setUser((prev) => ({ ...prev, isAuthenticated: false }));
  }, [setUser]);

  const updateUserProfile = useCallback(
    (data: Partial<DemoUser>) => {
      setUser((prev) => ({ ...prev, ...data }));
    },
    [setUser]
  );

  const createDemoOrder = useCallback(
    (orderInput: Omit<DemoOrder, 'id' | 'createdAt' | 'status'>): DemoOrder => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newOrder: DemoOrder = {
        ...orderInput,
        id: `LYN-2026-${randomNum}`,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      };
      setOrders((prev) => [newOrder, ...prev]);
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          titleAr: `تم تأكيد طلبك التجريبي #${newOrder.id}`,
          titleEn: `Demo Order #${newOrder.id} Confirmed`,
          bodyAr: 'شكراً لتسوّقك من ليانا. يمكنك تتبع حالة الطلب من صفحة تتبع الطلبات.',
          bodyEn: 'Thank you for shopping with LAYANA. Track your shipment anytime in Order Tracking.',
          date: new Date().toISOString().slice(0, 10),
          read: false,
        },
        ...prev,
      ]);
      clearCart();
      return newOrder;
    },
    [setOrders, setNotifications, clearCart]
  );

  const getOrderById = useCallback(
    (id: string) => orders.find((o) => o.id.toLowerCase() === id.trim().toLowerCase()),
    [orders]
  );

  const addAddress = useCallback(
    (addr: Omit<SavedAddress, 'id'>) => {
      const id = `addr-${Date.now()}`;
      setAddresses((prev) => {
        const base = addr.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev;
        return [{ ...addr, id }, ...base];
      });
    },
    [setAddresses]
  );

  const removeAddress = useCallback(
    (id: string) => setAddresses((prev) => prev.filter((a) => a.id !== id)),
    [setAddresses]
  );

  const setDefaultAddress = useCallback(
    (id: string) =>
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id }))),
    [setAddresses]
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [setNotifications]);

  const addProductReview = useCallback(
    (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'verified'>) => {
      const next: ProductReview = {
        ...review,
        id: `rev-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        verified: true,
      };
      setCustomReviews((prev) => ({
        ...prev,
        [productId]: [next, ...(prev[productId] ?? [])],
      }));
    },
    [setCustomReviews]
  );

  const value: StoreContextValue = {
    cart,
    cartTotals,
    couponCode,
    isCartDrawerOpen,
    setCartDrawerOpen,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    wishlistIds,
    toggleWishlist,
    isWishlisted,
    recentlyViewedIds,
    recordRecentlyViewed,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    compareIds,
    toggleCompare,
    clearCompare,
    isCompareOpen,
    setCompareOpen,
    quickViewProduct,
    setQuickViewProduct,
    isSizeGuideOpen,
    setSizeGuideOpen,
    user,
    loginDemoUser,
    logoutDemoUser,
    updateUserProfile,
    orders,
    createDemoOrder,
    getOrderById,
    addresses,
    addAddress,
    removeAddress,
    setDefaultAddress,
    notifications,
    markAllNotificationsRead,
    customReviews,
    addProductReview,
    toasts,
    showToast,
    dismissToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
