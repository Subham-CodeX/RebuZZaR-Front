// src/pages/MyAds.tsx
import { useEffect, useState } from "react";
import api from "../lib/api";
import AdCard from "../components/AdCard";

type MyAdsResponse = {
  ads?: any[];
};

const MyAds = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token =
          localStorage.getItem("authToken") ??
          localStorage.getItem("token") ??
          localStorage.getItem("accessToken");

        const res = await api.get<MyAdsResponse>("/api/ads/my", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        // 🔥 Same logic, now type-safe
        setAds(Array.isArray(res.data.ads) ? res.data.ads : []);
      } catch (err) {
        console.error("fetch my ads err", err);
        setAds([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Advertisements</h1>

      {ads.length === 0 ? (
        <div>No advert submissions yet. Create one from the Advertise page.</div>
      ) : (
        <div className="space-y-4">
          {ads.map((a) => (
            <AdCard key={a._id} ad={a} showStatus showContact />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAds;
