import React from 'react';
import {
  Car,
  Wind,
  Sparkles,
  Utensils,
  Wine,
  Zap,
  Music,
  Shield,
  Wifi,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const VenueFacilities = ({ facilities = [] }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-serif font-bold text-xl text-text">
        Available Facilities & Amenities
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {facilities.map((facility, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 p-3 rounded-card bg-background-secondary border border-border/80 text-xs sm:text-sm font-medium text-text"
          >
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>{facility}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueFacilities;

