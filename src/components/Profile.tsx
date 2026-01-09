const apiUrl = import.meta.env.VITE_BACKEND_URL;

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import EmptyStateIcon from './EmptyStateIcon';
import { motion } from 'framer-motion';
import Avatar from '../components/Avatar';

const Profile = () => {
  const { user, token, logout } = useAuth();

  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ========================
  // Product Images Slider
  // ========================
  const ProductImagesSlider = ({
    images,
    title,
  }: {
    images: string[] | string;
    title: string;
  }) => {
    const imgs = Array.isArray(images) ? images : [images];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (imgs.length <= 1) return;
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % imgs.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [imgs]);

    if (imgs.length === 1) {
      return (
        <img
          src={imgs[0]}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      );
    }

    return (
      <div className="w-full h-48 overflow-hidden relative bg-neutral-200 flex items-center justify-center rounded-t-3xl">
        {imgs.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`${title} ${idx + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              idx === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
          {imgs.map((_, idx) => (
            <span
              key={idx}
              className={`h-2 w-2 rounded-full ${
                idx === currentIndex ? 'bg-white' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  // ========================
  // Fetch User Products
  // ========================
  useEffect(() => {
    const fetchUserProducts = async () => {
      if (!user || !token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/api/profile/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch your products');
        const data: Product[] = await response.json();
        setUserProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [user, token]);

  // ========================
  // Delete Product
  // ========================
  const handleDelete = async (productId: string) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;

    try {
      const response = await fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product.');
      }
      setUserProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Item deleted successfully!');
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 text-center">
        <p className="text-neutral-600 mb-6">
          Please log in to view your profile.
        </p>
        <Link
          to="/"
          className="bg-neutral-700 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-md"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto py-12 px-4 space-y-10">

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/80 border border-neutral-200 rounded-3xl p-8 shadow"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar userId={user._id} src={user.avatar} clickable />
              <div>
                <h1 className="text-3xl font-extrabold text-neutral-800">
                  {user.name}
                </h1>
                <p className="text-neutral-600">{user.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to="/edit-profile"
                className="bg-neutral-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90"
              >
                Edit Profile
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-red-600 md:hidden"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* ========================
           Student Information
        ======================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/80 border border-neutral-200 rounded-3xl shadow p-8"
        >
          <h2 className="text-2xl font-bold text-neutral-800 mb-6 border-b border-neutral-200 pb-3">
            Student Information 🎓
          </h2>

          <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-6">
            {[
              { label: 'Department', value: user.department },
              { label: 'Program Type', value: user.programType },
              { label: 'Year', value: user.year },
              { label: 'Student Code', value: user.studentCode },
            ]
              .filter((info) => info.value)
              .map((info) => (
                <div key={info.label}>
                  <dt className="text-sm text-neutral-500">{info.label}</dt>
                  <dd className="font-semibold text-neutral-800">
                    {info.value}
                  </dd>
                </div>
              ))}
          </dl>
        </motion.div>

        {/* Listings */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-bold text-neutral-800 mb-8">
            Your Active Listings 🛒
          </h2>

          {loading ? (
            <p className="text-center text-neutral-500 animate-pulse">
              Loading your items...
            </p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : userProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {userProducts.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/80 border rounded-3xl shadow hover:shadow-lg transition"
                >
                  <Link to={`/product/${item._id}`}>
                    <ProductImagesSlider
                      images={item.imageUrl}
                      title={item.title}
                    />
                  </Link>

                  <div className="p-5 space-y-3">
                    <h3 className="font-semibold text-lg truncate">
                      {item.title}
                    </h3>
                    <p className="text-xl font-bold">
                      ₹{item.price.toLocaleString()}
                    </p>
                    <div className="flex gap-3">
                      <Link to={`/edit-product/${item._id}`} className="flex-1">
                        <button className="w-full bg-neutral-700 text-white py-2 rounded-lg">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/80 border rounded-3xl">
              <EmptyStateIcon />
              <h3 className="text-2xl font-semibold mt-4">
                You have no active listings
              </h3>
              <Link
                to="/sell"
                className="inline-block mt-6 bg-neutral-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Sell Your First Item
              </Link>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default Profile;
