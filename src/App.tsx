import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { SkeletonCard } from './components/ui/SkeletonCard';
import { LocaleProvider } from './context/LocaleContext';
import { StoreProvider } from './context/StoreContext';
import { HomePage } from './pages/HomePage';

// Route-based code splitting for secondary pages
const CatalogPage = React.lazy(() =>
  import('./pages/CatalogPage').then((m) => ({ default: m.CatalogPage }))
);
const CategoriesPage = React.lazy(() =>
  import('./pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage }))
);
const ProductDetailsPage = React.lazy(() =>
  import('./pages/ProductDetailsPage').then((m) => ({ default: m.ProductDetailsPage }))
);
const CartPage = React.lazy(() =>
  import('./pages/CartPage').then((m) => ({ default: m.CartPage }))
);
const CheckoutPage = React.lazy(() =>
  import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const OrderConfirmationPage = React.lazy(() =>
  import('./pages/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage }))
);
const WishlistPage = React.lazy(() =>
  import('./pages/WishlistPage').then((m) => ({ default: m.WishlistPage }))
);
const OrderTrackingPage = React.lazy(() =>
  import('./pages/OrderTrackingPage').then((m) => ({ default: m.OrderTrackingPage }))
);
const AuthPage = React.lazy(() =>
  import('./pages/AuthPages').then((m) => ({ default: m.AuthPage }))
);
const AccountPage = React.lazy(() =>
  import('./pages/AccountPage').then((m) => ({ default: m.AccountPage }))
);
const AboutPage = React.lazy(() =>
  import('./pages/InfoPages').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = React.lazy(() =>
  import('./pages/InfoPages').then((m) => ({ default: m.ContactPage }))
);
const FaqPage = React.lazy(() =>
  import('./pages/InfoPages').then((m) => ({ default: m.FaqPage }))
);
const SizeGuidePage = React.lazy(() =>
  import('./pages/InfoPages').then((m) => ({ default: m.SizeGuidePage }))
);
const PolicyPage = React.lazy(() =>
  import('./pages/InfoPages').then((m) => ({ default: m.PolicyPage }))
);
const NotFoundPage = React.lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

function RouteSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <StoreProvider>
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<RouteSkeleton />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<CatalogPage mode="all" />} />
                <Route path="/categories" element={<CategoriesPage initialTab="categories" />} />
                <Route path="/category/:slug" element={<CatalogPage mode="category" />} />
                <Route path="/collections" element={<CategoriesPage initialTab="collections" />} />
                <Route path="/collection/:slug" element={<CatalogPage mode="collection" />} />
                <Route path="/new-arrivals" element={<CatalogPage mode="new-arrivals" />} />
                <Route path="/best-sellers" element={<CatalogPage mode="best-sellers" />} />
                <Route path="/flash-deals" element={<CatalogPage mode="flash-deals" />} />
                <Route path="/sale" element={<CatalogPage mode="sale" />} />
                <Route path="/search" element={<CatalogPage mode="search" />} />
                <Route path="/product/:slug" element={<ProductDetailsPage />} />

                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />

                <Route path="/login" element={<AuthPage mode="login" />} />
                <Route path="/register" element={<AuthPage mode="register" />} />
                <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />

                <Route path="/account" element={<AccountPage section="profile" />} />
                <Route path="/account/orders" element={<AccountPage section="orders" />} />
                <Route path="/account/orders/:orderId" element={<AccountPage section="order-details" />} />
                <Route path="/account/addresses" element={<AccountPage section="addresses" />} />
                <Route path="/account/wishlist" element={<AccountPage section="wishlist" />} />
                <Route path="/account/notifications" element={<AccountPage section="notifications" />} />
                <Route path="/account/recently-viewed" element={<AccountPage section="recently-viewed" />} />
                <Route path="/account/settings" element={<AccountPage section="settings" />} />
                <Route path="/order-tracking" element={<OrderTrackingPage />} />

                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/size-guide" element={<SizeGuidePage />} />
                <Route path="/shipping-policy" element={<PolicyPage type="shipping" />} />
                <Route path="/return-policy" element={<PolicyPage type="returns" />} />
                <Route path="/privacy-policy" element={<PolicyPage type="privacy" />} />
                <Route path="/terms" element={<PolicyPage type="terms" />} />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </StoreProvider>
    </LocaleProvider>
  );
}
