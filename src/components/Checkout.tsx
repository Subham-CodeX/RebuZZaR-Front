const apiUrl = import.meta.env.VITE_BACKEND_URL;

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BookingLoadingModal from "../components/BookingLoadingModal";

// --- Helper Icon Component ---
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const Checkout = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  // ✅ LOADING STATE
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // ============================
  // PLACE BOOKING HANDLER
  // ============================
  const handleBooking = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please login to proceed.");
      navigate("/login");
      return;
    }

    setIsPlacingOrder(true); // 🔥 SHOW LOADING POPUP

    const bookingData = {
      products: cartItems.map((item) => ({
        productId: item.productId?.toString(),
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
    };

    try {
      const res = await fetch(`${apiUrl}/api/bookings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      toast.success("🎉 Booking successful!");
      clearCart();

      navigate("/booking-success", {
        state: { bookingId: data.bookingId },
      });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsPlacingOrder(false); // 🔥 HIDE LOADING POPUP
    }
  };

  // ============================
  // EMPTY CART VIEW
  // ============================
  if (cartItems.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center p-4">
        <h2 className="text-3xl font-bold text-neutral-800 mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-neutral-600 mb-8 max-w-sm">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/"
          className="bg-neutral-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // ============================
  // MAIN CHECKOUT UI
  // ============================
  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 mt-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8">
          Your Shopping Cart
        </h1>

        {/* CART ITEMS */}
        <div className="flex flex-col gap-5">
          {cartItems.map((item) => (
            <div
              key={item.productId?.toString()}
              className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow border"
            >
              <img
                src={
                  item.productImage ||
                  'https://placehold.co/96x96/e2e8f0/64748b?text=Image'
                }
                alt={item.productTitle || 'Product'}
                className="w-24 h-24 rounded-md object-cover"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    'https://placehold.co/96x96/e2e8f0/64748b?text=Image')
                }
              />

              <div className="flex-grow text-center sm:text-left">
                <h3 className="font-semibold truncate">{item.title}</h3>
                <p className="text-neutral-600">₹{item.price}</p>
              </div>

              <div className="flex items-center gap-4 mt-3 sm:mt-0">
                <button
                  onClick={() =>
                    decreaseQuantity(item.productId?.toString())
                  }
                  className="w-8 h-8 rounded-full bg-neutral-100"
                >
                  -
                </button>

                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    increaseQuantity(item.productId?.toString())
                  }
                  className="w-8 h-8 rounded-full bg-neutral-100"
                >
                  +
                </button>

                <button
                  onClick={() =>
                    removeFromCart(item.productId?.toString())
                  }
                  className="text-red-500 flex items-center gap-1"
                >
                  <TrashIcon /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="mt-10 bg-white p-6 rounded-lg shadow border">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span className="text-green-600">FREE</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

          <button
            onClick={handleBooking}
            disabled={isPlacingOrder}
            className="w-full mt-6 bg-neutral-700 text-white py-3 rounded-lg text-lg font-semibold
                       hover:bg-neutral-800 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlacingOrder ? "Placing booking..." : "Place Booking"}
          </button>
        </div>
      </div>

      {/* 🔥 LOADING POPUP */}
      {isPlacingOrder && <BookingLoadingModal />}
    </div>
  );
};

export default Checkout;
