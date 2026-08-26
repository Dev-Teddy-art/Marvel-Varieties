'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  images: string[];
  alt: string;
  aspectClass?: string;
}

export function ProductCarousel({ images, alt, aspectClass = "h-56 sm:h-64" }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const validImages = images && images.length > 0 ? images : ['/MARVEL VARIETIES.png'];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`relative w-full ${aspectClass} bg-slate-100 overflow-hidden group select-none`}>
      <img
        src={validImages[currentIndex]}
        alt={`${alt} - view ${currentIndex + 1}`}
        className="w-full h-full object-cover transition duration-300"
      />

      {/* Interactive Navigation Arrows */}
      {validImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-black/80 cursor-pointer z-10"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-black/80 cursor-pointer z-10"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {validImages.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-4 bg-[#D4AF37]' : 'w-1.5 bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}