import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { AdminProvider } from '@/context/AdminContext';
import { VendorProvider } from '@/context/VendorContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { ProtectedRoute, AdminRoute, VendorRoute } from '@/components/ProtectedRoute';

// Pages
import { Home } from '@/pages/Home';
import { Products } from '@/pages/Products';
import { ProductDetail } from '@/pages/ProductDetail';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { VendorDashboard } from '@/pages/VendorDashboard';
import { VendorApplication } from '@/pages/VendorApplication';
import { Favorites } from '@/pages/Favorites';
import { ReviewsPage } from '@/pages/Reviews';
import { AccountSettings } from '@/pages/AccountSettings';
import { FAQ, ShippingInfo, ReturnsPolicy, Terms, Privacy } from '@/pages/InfoPages';

// Auth Pages
import { RoleSelection } from '@/pages/RoleSelection';
import { CustomerLogin } from '@/pages/CustomerLogin';
import { VendorLogin } from '@/pages/VendorLogin';
import { AdminLogin } from '@/pages/AdminLogin';
import { SignUp } from '@/pages/SignUp';
import { ForgotPassword } from '@/pages/ForgotPassword';

import { ScrollToHash } from '@/components/ScrollToHash';

function App() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.title = t('site_name', 'El Eulma Store');
  }, [i18n.language, t]);

  return (
    <AuthProvider>
      <AdminProvider>
        <VendorProvider>
          <FavoritesProvider>
            <CartProvider>
              <Router>
                <ScrollToHash />
                <div className="min-h-screen bg-white">
                  <Header />
                  <AnimatePresence mode="wait">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/favorites" element={<Favorites />} />

                      {/* Auth Routes */}
                      <Route path="/login" element={<RoleSelection />} />
                      <Route path="/login/customer" element={<CustomerLogin />} />
                      <Route path="/login/vendor" element={<VendorLogin />} />
                      <Route path="/login/admin" element={<AdminLogin />} />
                      <Route path="/signup/:role" element={<SignUp />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />

                      {/* Checkout - requires authentication */}
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />

                      {/* Account Settings */}
                      <Route
                        path="/account"
                        element={
                          <ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}>
                            <AccountSettings />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin Routes - requires admin role */}
                      <Route
                        path="/admin"
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        }
                      />

                      {/* Vendor Routes - requires vendor role */}
                      <Route
                        path="/vendor"
                        element={
                          <VendorRoute>
                            <VendorDashboard />
                          </VendorRoute>
                        }
                      />

                      {/* Vendor Application - public */}
                      <Route path="/become-vendor" element={<VendorApplication />} />
                      <Route path="/reviews" element={<ReviewsPage />} />

                      {/* Info Pages */}
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/shipping" element={<ShippingInfo />} />
                      <Route path="/returns" element={<ReturnsPolicy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                    </Routes>
                  </AnimatePresence>
                  <FooterCondition />
                  <CartDrawer />
                  <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    toastOptions={{
                      style: {
                        fontFamily: 'inherit',
                      },
                    }}
                  />
                </div>
              </Router>
            </CartProvider>
          </FavoritesProvider>
        </VendorProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
function FooterCondition() {
  const { pathname } = useLocation();
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/signup')) return null;
  return <Footer />;
}
