'use client'

import { useEffect, useState } from "react";
import Image from "next/image";

interface SlideshowProps {
  images: string[];
}

const Slideshow: React.FC<SlideshowProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="p-4 relative w-full h-[600px] rounded-xl pt-20 shadow-lg overflow-hidden select-none bg-black">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-30 pointer-events-none" />

      {images.map((src, idx) => (
        <div
          key={idx}
          className={`p-4 pt-20 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
            idx === currentIndex ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          <Image
            src={src}
            alt={`Slide ${idx + 1}`}
            fill
            className="object-cover"
            priority={idx === currentIndex}
            sizes="100vw"
          />
        </div>
      ))}

      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute top-1/2 left-6 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full p-4 text-3xl select-none transition"
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute top-1/2 right-6 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full p-4 text-3xl select-none transition"
      >
        ›
      </button>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4 z-40">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-4 h-4 rounded-full transition-colors ${
              currentIndex === idx ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
