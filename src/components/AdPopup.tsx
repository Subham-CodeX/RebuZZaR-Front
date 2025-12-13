import { useEffect, useState } from "react";
import api from "../lib/api";

const POSITIONS = [
  "bottom-right",
  "bottom-left",
  "top-right",
  "top-left",
];

const AdPopup = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState("bottom-right");

  // Fetch approved ads
  useEffect(() => {
    (async () => {
      const res = await api.get("/api/ads/public");
      setAds(res.data.ads || []);
    })();
  }, []);

  // Rotate ads every 30 seconds
  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % ads.length);
      setVisible(true);
      setPosition(POSITIONS[Math.floor(Math.random() * POSITIONS.length)]);
    }, 30000);

    return () => clearInterval(interval);
  }, [ads]);

  if (ads.length === 0 || !visible) return null;

  const ad = ads[currentIndex];

  return (
    <div
      className={`fixed z-50 p-4 w-80 bg-white shadow-xl rounded-xl border transition-all
        ${position === "bottom-right" && "bottom-4 right-4"}
        ${position === "bottom-left" && "bottom-4 left-4"}
        ${position === "top-right" && "top-4 right-4"}
        ${position === "top-left" && "top-4 left-4"}
      `}
    >
      <button 
        className="absolute top-2 right-2 text-gray-600"
        onClick={() => setVisible(false)}
      >
        ✕
      </button>

      <img 
        src={ad.images?.[0]} 
        className="w-full h-32 object-cover rounded-md mb-3" 
      />

      <h3 className="font-semibold text-lg">{ad.title}</h3>
      <p className="font-semibold text-lg">{ad.businessName}</p>
      <p className="text-sm text-gray-600">{ad.description}</p>
      {/* CTA Button */}
      <a
        href="/ads"
        className="mt-3 inline-block px-4 py-2 bg-secondary text-white rounded-lg text-sm hover:opacity-90"
      >
        View More
      </a>
    </div>
  );
};

export default AdPopup;