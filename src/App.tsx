import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { debug } from "./utils/debug";
import { useAuth } from "./context/AuthContext";

// Layout
import Navbar from "./components/Navbar";
import Menubar from "./components/Menubar";
import Footer from "./components/Footer";

// Pages & Components
import Main from "./components/Main";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Checkout from "./components/Checkout";
import Sell from "./components/Sell";
import ProductDetail from "./components/ProductDetail";
import EditProduct from "./components/EditProduct";
import BookingSuccess from "./components/BookingSuccess";
import MyBookings from "./components/MyBookings";
import ResetPassword from "./components/ResetPassword";

// Legal
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ReturnRefundPolicy from "./components/ReturnRefundPolicy";
import FAQ from "./components/FAQ";

// Ads
import MyAds from "./pages/MyAds";
import PublicAds from "./pages/PublicAds";
import AdsList from "./pages/AdsList";
import Advertise from "./pages/Advertise";
import AdminAdsPage from "./pages/AdminAdsPage";
import AdDetail from "./pages/AdDetail";

// Admin
import AdminRoute from "./components/AdminRoute";
import AdminPendingProducts from "./components/AdminPendingProducts";

// Auth
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";

// Context
import { CartProvider } from "./context/CartContext";

// Utilities
import ScrollToTop from "./components/ScrollToTop";

// ⭐ Advertisement Popup
import AdPopup from "./components/AdPopup";

// ⭐ WhatsApp Floating Button (NEW)
import WhatsAppFloat from "./components/WhatsAppFloat";
import "./styles/whatsapp.css";

const App: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [menu, setMenu] = useState<string>("");

  const { user } = useAuth();

  // Debug only in development
  useEffect(() => {
    debug("Logged-in user:", {
      email: user?.email,
      role: user?.role,
    });
  }, [user]);

  return (
    <CartProvider>
      <>
        {/* 🔔 Toast Notifications */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* 🧭 Navbar */}
        <Navbar setSearch={setSearch} setMenu={setMenu} />

        {/* 📂 Menubar (Desktop only) */}
        <div className="hidden md:block">
          <Menubar setMenu={setMenu} />
        </div>

        {/* ⬆️ Scroll to top on route change */}
        <ScrollToTop />

        {/* ⭐ Global Advertisement Popup */}
        <AdPopup />

        {/* 💬 GLOBAL WHATSAPP SUPPORT BUTTON (FREE) */}
        <WhatsAppFloat />

        {/* 🚦 Routes */}
        <Routes>
          <Route path="/" element={<Main search={search} menu={menu} />} />

          <Route path="/sell" element={<Sell />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/booking-success" element={<BookingSuccess />} />

          <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />

          {/* 📜 Legal */}
          <Route path="/legal/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/legal/return-refund-policy" element={<ReturnRefundPolicy />} />
          <Route path="/legal/faq" element={<FAQ />} />

          {/* 📢 Advertisements */}
          <Route path="/ads/my" element={<MyAds />} />
          <Route path="/ads" element={<PublicAds />} />
          <Route path="/advertisements" element={<AdsList />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/ads/:id" element={<AdDetail />} />

          {/* 🛡️ Admin Ads */}
          <Route path="/admin/ads" element={<AdminAdsPage />} />

          {/* 🛠️ Admin Pending Products */}
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminPendingProducts />
              </AdminRoute>
            }
          />
        </Routes>

        {/* 🦶 Footer */}
        <Footer />
      </>
    </CartProvider>
  );
};

export default App;
