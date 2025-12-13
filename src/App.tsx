import React, { useState, useEffect, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { debug } from "./utils/debug";
import { useAuth } from "./context/AuthContext";

import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Menubar from "./components/Menubar";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";

import { CartProvider } from "./context/CartContext";

import Checkout from "./components/Checkout";
import Sell from "./components/Sell";
import ProductDetail from "./components/ProductDetail";
import EditProduct from "./components/EditProduct";
import BookingSuccess from "./components/BookingSuccess";
import MyBookings from "./components/MyBookings";
import ResetPassword from "./components/ResetPassword";

import Footer from "./components/Footer";

import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ReturnRefundPolicy from "./components/ReturnRefundPolicy";
import FAQ from "./components/FAQ";

import MyAds from "./pages/MyAds";
import PublicAds from "./pages/PublicAds";
import AdsList from "./pages/AdsList";
import Advertise from "./pages/Advertise";
import AdminAdsPage from "./pages/AdminAdsPage";

// ⭐ NEW — Advertisement Popup
import AdPopup from "./components/AdPopup";

// ScrollToTop
import ScrollToTop from "./components/ScrollToTop";

// Lazy Admin Component
const AdminPendingProducts = lazy(() => import("./components/AdminPendingProducts"));

const App: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [menu, setMenu] = useState<string>("");

  const { user } = useAuth();

  // Debug only in dev
  useEffect(() => {
    debug("Logged-in user:", { email: user?.email, role: user?.role });
  }, [user]);

  return (
    <CartProvider>
      <>
        {/* Toast Notifications */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* Navbar */}
        <Navbar setSearch={setSearch} setMenu={setMenu} />

        {/* Menubar */}
        <div className="hidden md:block">
          <Menubar setMenu={setMenu} />
        </div>

        {/* Scroll to top on navigation */}
        <ScrollToTop />

        {/* ⭐ ADVERTISEMENT POPUP (GLOBAL POPUP) */}
        <AdPopup />

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Main search={search} menu={menu} />} />

          <Route path="/sell" element={<Sell />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          {/* Legal */}
          <Route path="/legal/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/legal/return-refund-policy" element={<ReturnRefundPolicy />} />
          <Route path="/legal/faq" element={<FAQ />} />

          {/* --- ADVERTISEMENTS --- */}
          <Route path="/ads/my" element={<MyAds />} />
          <Route path="/ads" element={<PublicAds />} />
          <Route path="/advertisements" element={<AdsList />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/admin/ads" element={<AdminAdsPage />} />

          {/* Admin routes */}
          <Route
            path="/admin/pending-products"
            element={
              <Suspense fallback={<div>Loading admin dashboard...</div>}>
                <AdminRoute>
                  <AdminPendingProducts />
                </AdminRoute>
              </Suspense>
            }
          />
        </Routes>

        {/* Footer */}
        <Footer />
      </>
    </CartProvider>
  );
};

export default App;
