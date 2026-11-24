import React, { useState } from 'react';
import Modal from '@/components/common/Modal';

export const VendorPortfolio = ({ portfolio = [] }) => {
  const [activeImage, setActiveImage] = useState(null);

  if (!portfolio || portfolio.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-xl text-text">
          Portfolio & Past Event Work
        </h3>
        <span className="text-xs text-text-muted">{portfolio.length} Photographs</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {portfolio.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(item)}
            className="group relative aspect-4/3 rounded-card overflow-hidden bg-neutral-100 border border-border cursor-pointer shadow-xs"
          >
            <img
              src={item.url}
              alt={item.caption || `Work sample ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-[11px] font-medium line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <Modal
          isOpen={Boolean(activeImage)}
          onClose={() => setActiveImage(null)}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-3">
            <div className="aspect-16/10 w-full rounded-card overflow-hidden bg-black">
              <img
                src={activeImage.url}
                alt={activeImage.caption || 'Portfolio Showcase'}
                className="w-full h-full object-contain"
              />
            </div>
            {activeImage.caption && (
              <p className="text-sm font-medium text-text text-center">
                {activeImage.caption}
              </p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VendorPortfolio;
