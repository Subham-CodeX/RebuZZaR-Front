import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { debug } from "./utils/debug";
import { useAuth } from "./context/AuthContext";
import api from "./lib/api";

// Layout
import Navbar from "./components/Navbar";
import Menubar from "./components/Menubar";
import Footer from "./components/Footer";

// Pages
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
import AdvertisePolicy from "./components/AdvertisePolicy";

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
import AdminBroadcast from "./pages/admin/AdminBroadcast";

// Auth
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";

// Context
import { CartProvider } from "./context/CartContext";

// Utilities
import ScrollToTop from "./components/ScrollToTop";

// UI Extras
import AdPopup from "./components/AdPopup";
import WhatsAppFloat from "./components/WhatsAppFloat";
import WelcomePopup from "./components/WelcomePopup";
import "./styles/whatsapp.css";

const App: React.FC = () => {
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  const { user, justSignedUp, setJustSignedUp } = useAuth();

  // Debug
  useEffect(() => {
    debug("User state:", {
      email: user?.email,
      hasSeenWelcome: user?.hasSeenWelcome,
      justSignedUp,
    });
  }, [user, justSignedUp]);

  // ⭐ SHOW WELCOME ONLY ON SIGNUP SESSION
  useEffect(() => {
    if (user && justSignedUp && user.hasSeenWelcome === false) {
      setShowWelcome(true);
    }
  }, [user, justSignedUp]);

  const closeWelcomePopup = async () => {
    setShowWelcome(false);
    setJustSignedUp(false);

    try {
      await api.post("/user/mark-welcome-seen");
    } catch (err) {
      console.error("Failed to mark welcome as seen", err);
    }
  };

  return (
    <CartProvider>
      <>
        <Toaster position="top-center" />

        {showWelcome && (
          <WelcomePopup
            onClose={closeWelcomePopup}
            userName={user?.name}
          />
        )}

        <Navbar setSearch={setSearch} setMenu={setMenu} />

        <div className="hidden md:block">
          <Menubar setMenu={setMenu} />
        </div>

        <ScrollToTop />
        <AdPopup />
        <WhatsAppFloat />

        <Routes>
          {/* PUBLIC */}
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

          {/* LEGAL */}
          <Route path="/legal/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/legal/return-refund-policy" element={<ReturnRefundPolicy />} />
          <Route path="/legal/faq" element={<FAQ />} />
          <Route path="/advertise-policy" element={<AdvertisePolicy />} />

          {/* ADS */}
          <Route path="/ads/my" element={<MyAds />} />
          <Route path="/ads" element={<PublicAds />} />
          <Route path="/advertisements" element={<AdsList />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/ads/:id" element={<AdDetail />} />

          {/* ADMIN */}
          <Route path="/admin/ads" element={<AdminAdsPage />} />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminPendingProducts />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/broadcast"
            element={
              <AdminRoute>
                <AdminBroadcast />
              </AdminRoute>
            }
          />
        </Routes>

        <Footer />
      </>
    </CartProvider>
  );
};

export default App;
