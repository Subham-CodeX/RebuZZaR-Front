import { useEffect, useState } from "react";

const AdImagesSlider = ({ images, title }: { images: string[]; title: string }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative w-full h-72 overflow-hidden bg-neutral-200">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`${title} ${i}`}
          className={`absolute w-full h-full object-contain bg-neutral-200 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}

        />
      ))}

      {/* Bottom Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full ${
              index === i ? "bg-white" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AdImagesSlider;
