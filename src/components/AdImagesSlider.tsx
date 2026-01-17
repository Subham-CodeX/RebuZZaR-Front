import { useEffect, useRef, useState } from "react";

type Props = {
  images: string[];
  title: string;
};

const AdImagesSlider = ({ images = [], title }: Props) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const hasImages = Array.isArray(images) && images.length > 0;

  const next = () => {
    if (!hasImages) return;
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    if (!hasImages) return;
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // ✅ Auto Slide
  useEffect(() => {
    if (!hasImages) return;
    if (images.length <= 1) return;
    if (isPaused) return;

    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, [images, isPaused]);

  // ✅ Swipe Support
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const startX = touchStartX.current;
    const endX = touchEndX.current;

    setIsPaused(false);

    if (startX === null || endX === null) return;

    const diff = startX - endX;

    // ✅ swipe threshold
    if (diff > 50) next(); // swipe left
    else if (diff < -50) prev(); // swipe right

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!hasImages) {
    return (
      <div className="w-full h-56 sm:h-72 md:h-80 bg-neutral-200 rounded-lg flex items-center justify-center">
        <p className="text-neutral-600 font-semibold">No images available</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden rounded-lg bg-neutral-200 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ✅ Images */}
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`${title} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-contain bg-neutral-200 transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          draggable={false}
        />
      ))}

      {/* ✅ Prev Button */}
      {images.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
          aria-label="Previous image"
        >
          ❮
        </button>
      )}

      {/* ✅ Next Button */}
      {images.length > 1 && (
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
          aria-label="Next image"
        >
          ❯
        </button>
      )}

      {/* ✅ Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdImagesSlider;
