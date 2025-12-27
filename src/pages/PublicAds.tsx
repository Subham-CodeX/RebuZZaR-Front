import { useEffect, useState } from "react";
import axios from "axios";
import AdCard from "../components/AdCard";

const API = import.meta.env.VITE_BACKEND_URL;

const PublicAds = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAds = async () => {
    try {
      const res = await axios.get(`${API}/api/ads/public`);
      setAds(res.data.ads);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  if (loading)
    return (
      <div className="text-center p-20 font-semibold text-neutral-500">
        Loading advertisements...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-neutral-800 text-center mb-8">
        Advertisements
      </h1>

      {ads.length === 0 ? (
        <div className="text-center py-20 bg-neutral-100 rounded-lg">
          <p className="text-xl text-neutral-600">No active advertisements at this moment.</p>
        </div>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ads.map(ad => (
            <AdCard key={ad._id} ad={ad} />
          ))}
       </div>

      )}
    </div>
  );
};

export default PublicAds;