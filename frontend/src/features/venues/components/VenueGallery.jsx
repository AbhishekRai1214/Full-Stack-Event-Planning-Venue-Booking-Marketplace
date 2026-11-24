import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export const VenueGallery = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-80 rounded-card-lg bg-neutral-200 flex items-center justify-center text-text-muted">
        No images available
      </div>
    );
  }

  const currentImage = images[selectedIndex]?.url || images[0]?.url;

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3">
      {/* Main Image Showcase */}
      <div className="relative aspect-16/9 md:aspect-21/9 w-full rounded-card-lg overflow-hidden bg-neutral-900 shadow-card">
        <img
          src={currentImage}
          alt="Venue showcase"
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Prev / Next buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-text hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-text hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter Tag */}
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full font-medium">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-14 sm:w-24 sm:h-16 shrink-0 rounded-button overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-primary ring-2 ring-primary/30 scale-102'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueGallery;

