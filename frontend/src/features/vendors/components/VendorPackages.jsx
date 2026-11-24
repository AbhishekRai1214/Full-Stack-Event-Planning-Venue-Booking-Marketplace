import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import Button from '@/components/common/Button';
import { formatCurrency } from '@/utils';

export const VendorPackages = ({ packages = [], onSelectPackage }) => {
  if (!packages || packages.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-xl text-text">
          Service Packages & Pricing
        </h3>
        <span className="text-xs text-text-muted">Direct Vendor Rates</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packages.map((pkg, idx) => (
          <div
            key={pkg.id || idx}
            className={`card p-5 border flex flex-col justify-between transition-all ${
              idx === 0
                ? 'border-primary/40 bg-gradient-to-b from-primary/5 to-white shadow-card'
                : 'border-border bg-white'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-serif font-bold text-base text-text">
                    {pkg.name}
                  </h4>
                  {pkg.description && (
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      {pkg.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="my-3 pb-3 border-b border-border">
                <span className="font-serif font-black text-2xl text-primary">
                  {formatCurrency(pkg.price)}
                </span>
                <span className="text-xs text-text-muted ml-1.5 font-normal">
                  / event
                </span>
              </div>

              {pkg.includes && pkg.includes.length > 0 && (
                <ul className="space-y-2 text-xs text-text mb-5">
                  {pkg.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Button
              variant={idx === 0 ? 'primary' : 'outline'}
              size="sm"
              className="w-full mt-auto"
              onClick={() => onSelectPackage?.(pkg)}
            >
              Select Package
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorPackages;
