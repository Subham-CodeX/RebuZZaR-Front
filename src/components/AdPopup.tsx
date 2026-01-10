import { useEffect, useState } from "react";
import api from "../lib/api";
import "../styles/adPopup.css";
import { useIsMobile } from "../hooks/useIsMobile";

const DESKTOP_POSITIONS = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

const MOBILE_POSITIONS = [
  "top-center",
  "bottom-center",
];

const getRandomPosition = (isMobile: boolean) => {
  const list = isMobile ? MOBILE_POSITIONS : DESKTOP_POSITIONS;
  return list[Math.floor(Math.random() * list.length)];
};

type PublicAdsResponse = {
  ads: any[];
};

const AdPopup = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState<string>("bottom-right");

  const isMobile = useIsMobile();

  // Fetch ads
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<PublicAdsResponse>("/api/ads/public");
        setAds(Array.isArray(res.data.ads) ? res.data.ads : []);
      } catch (err) {
        console.error("Failed to load ads", err);
      }
    })();
  }, []);

  // Rotate ad + position every 30s
  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % ads.length);
      setPosition(getRandomPosition(isMobile));
      setVisible(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [ads, isMobile]);

  if (ads.length === 0 || !visible) return null;

  const ad = ads[currentIndex];

  const positionClass = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  }[position];

  return (
    <div
      className={`
        fixed z-50
        bg-white border shadow-xl rounded-xl
        p-3 w-[280px]
        transition-all duration-300
        ${positionClass}
        ${isMobile ? "ad-mobile-slide mobile-ad-popup" : ""}
      `}
    >
      {/* Close button (desktop only visible) */}
      {!isMobile && (
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={() => setVisible(false)}
        >
          ✕
        </button>
      )}

      {/* Image */}
      <img
        src={ad.images?.[0]}
        alt={ad.title}
        className="
          w-full h-28 object-cover rounded-md mb-2
          mobile-ad-image
        "
      />

      {/* Content (hidden on mobile) */}
      <div className="mobile-ad-content">
        <h3 className="font-semibold text-sm leading-tight">
          {ad.title}
        </h3>

        <p className="font-medium text-sm text-gray-800">
          {ad.businessName}
        </p>

        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
          {ad.description}
        </p>

        <a
          href={`/ads/${ad._id}`}
          className="
            mt-2 block w-full text-center
            px-3 py-1.5
            bg-secondary text-white rounded-lg
            text-xs font-semibold
          "
        >
          View More
        </a>
      </div>
    </div>
  );
};

export default AdPopup;
