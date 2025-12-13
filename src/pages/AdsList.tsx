// src/pages/AdsList.tsx
import React, { useEffect, useState } from "react";
import api, { withAuthHeaders } from "../lib/api";
import AdCard from "../components/AdCard";

const AdsList = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/ads/public");
        setAds(Array.isArray(res.data.ads) ? res.data.ads : []);
      } catch (err) {
        console.error("Failed to fetch ads", err);
        setAds([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-12 text-center">Loading ads...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Advertisements</h1>

      {ads.length === 0 ? (
        <div className="bg-neutral-100 p-8 rounded text-center">
          No advertisements currently. Check back later.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ads.map(ad => <AdCard key={ad._id} ad={ad} />)}
        </div>
      )}
    </div>
  );
};

export default AdsList;
