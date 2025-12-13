// src/pages/MyAds.tsx
import React, { useEffect, useState } from "react";
import api from "../lib/api";
import AdCard from "../components/AdCard";

const MyAds = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
       const token =
          localStorage.getItem("authToken") ||
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken");

        const res = await api.get("/api/ads/my", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        // 🔥 Correct way to set ads
        setAds(res.data?.ads || []);
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
