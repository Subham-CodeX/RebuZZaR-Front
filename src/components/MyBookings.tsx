// ============================================================================
// 📘 MyBookings.tsx
// ----------------------------------------------------------------------------
// Displays all bookings for the logged-in user with clean, modern UI.
// Includes order info, product details, and cancel booking functionality.
// ============================================================================

const apiUrl = import.meta.env.VITE_API_URL;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// ----------------------------
// Type Definitions
// ----------------------------
interface ProductInfo {
  productId: {
    _id: string;
    title: string;
    imageUrl: string[];
  };
  quantity: number;
  price: number;
}

interface Booking {
  _id: string;
  totalPrice: number;
  status: string;
  bookingDate: string;
  products: ProductInfo[];
}

// ----------------------------
// Component: MyBookings
// ----------------------------
const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error("You must be logged in to view your bookings.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch bookings.');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Loading state
  if (loading) return <div className="text-center py-20">Loading your bookings...</div>;

  // Empty state
  if (bookings.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">No Bookings Yet</h2>
        <p className="text-gray-600 mb-8">You haven't booked any items. Let's change that!</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // ----------------------------
  // Bookings Display
  // ----------------------------
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-b pb-3">
        My Bookings
      </h1>

      <div className="space-y-10">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
          >
            {/* ---------------------------- */}
            {/* Booking Header Section */}
            {/* ---------------------------- */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-5 border-b pb-5">
              <div className="space-y-1">
                <p className="text-gray-500 text-sm">
                  Booking ID:{' '}
                  <span className="font-mono text-gray-700">{booking._id}</span>
                </p>
                <p className="font-semibold text-gray-700">
                  Date:{' '}
                  <span className="text-gray-900">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </span>
                </p>
              </div>

              <div className="text-right mt-4 sm:mt-0">
                <p className="text-lg font-bold text-gray-800">
                  Total:{' '}
                  <span className="text-blue-600">
                    ₹{booking.totalPrice.toLocaleString('en-IN')}
                  </span>
                </p>
                <span
                  className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mt-2 ${
                    booking.status === 'Cancelled'
                      ? 'bg-red-100 text-red-700'
                      : booking.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>

            {/* ---------------------------- */}
            {/* Items Section */}
            {/* ---------------------------- */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800 border-b pb-2">
                Items in this booking
              </h3>
              <div className="space-y-4">
                {booking.products.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 rounded-xl p-3 transition-all duration-200"
                  >
                    <img
                      src={item.productId.imageUrl[0]}
                      alt={item.productId.title}
                      className="w-20 h-20 object-contain rounded-lg border"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">
                        {item.productId.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-700 text-right">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------------------------- */}
            {/* Action Section - Bottom Right */}
            {/* ---------------------------- */}
            {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={async () => {
                    const confirmCancel = window.confirm(
                      'Are you sure you want to cancel this booking?'
                    );
                    if (!confirmCancel) return;

                    try {
                      const token = localStorage.getItem('authToken');
                      const res = await fetch(
                        `${apiUrl}/api/bookings/${booking._id}/cancel`,
                        {
                          method: 'PUT',
                          headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                          },
                        }
                      );

                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message);

                      toast.success('Booking cancelled successfully!');
                      setBookings((prev) =>
                        prev.map((b) =>
                          b._id === booking._id
                            ? { ...b, status: 'Cancelled' }
                            : b
                        )
                      );
                    } catch (err: any) {
                      toast.error(err.message || 'Failed to cancel booking');
                    }
                  }}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-all duration-300"
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------
// Export
// ----------------------------
export default MyBookings;
