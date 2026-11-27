/**
 * VendorCompareTable Component
 *
 * Side-by-side comparison matrix for up to 4 shortlisted event vendors:
 * - Avatar profile, name, city, and category
 * - Starting package pricing
 * - Professional experience & credentials
 * - Review score & total client recommendations
 * - Service area coverage & package features
 * - Direct enquiry link
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeCompareVendor, clearCompareVendors } from '../compareSlice';
import { Check, X, MapPin, Award, Trash2, Camera, Briefcase } from 'lucide-react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Rating from '@/components/common/Rating';
import { formatCurrency } from '@/utils';

export const VendorCompareTable = ({ vendors = [] }) => {
  const dispatch = useDispatch();

  if (vendors.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-border p-8 max-w-lg mx-auto shadow-card">
        <Camera className="w-16 h-16 text-primary/30 mx-auto mb-4" />
        <h3 className="font-serif font-bold text-2xl text-text mb-2">No Vendors Selected</h3>
        <p className="text-sm text-text-muted mb-6">
          Explore award-winning wedding photographers, royal caterers, DJs, and decorators to compare service tiers side-by-side.
        </p>
        <Link to="/vendors">
          <Button variant="primary" size="md">
            Explore Vendors
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-xl text-text">
            Side-by-Side Vendor Comparison
          </h2>
          <p className="text-xs text-text-muted">
            Comparing {vendors.length} event {vendors.length === 1 ? 'service partner' : 'service partners'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(clearCompareVendors())}
          className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Vendors</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[650px]">
          <tbody>
            {/* 1. Vendor Header Card Row */}
            <tr className="bg-neutral-50/60 border-b border-border">
              <td className="p-4 w-44 font-semibold text-text-muted uppercase text-[10px] tracking-wider align-top">
                Provider
              </td>
              {vendors.map((vendor) => {
                const img = vendor.avatar || vendor.image || 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=400&q=80';
                const name = vendor.businessName || vendor.name;

                return (
                  <td key={vendor.id} className="p-4 w-64 align-top border-l border-border">
                    <div className="space-y-3">
                      <div className="relative aspect-square w-24 h-24 rounded-2xl overflow-hidden bg-neutral-100 mx-auto">
                        <img
                          src={img}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => dispatch(removeCompareVendor(vendor.id))}
                          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-center">
                        <h4 className="font-serif font-bold text-sm text-text line-clamp-1">
                          {name}
                        </h4>
                        <p className="text-[11px] text-text-muted flex items-center justify-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-primary shrink-0" />
                          <span>{vendor.location?.city || vendor.city}</span>
                        </p>
                      </div>

                      <div className="flex justify-center">
                        <Rating value={vendor.rating || 4.9} count={vendor.reviewsCount || 88} size="xs" />
                      </div>

                      <Link to={`/vendors/${vendor.id}`} className="block">
                        <Button size="xs" variant="primary" className="w-full justify-center">
                          View Packages
                        </Button>
                      </Link>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* 2. Service Category */}
            <tr className="border-b border-border">
              <td className="p-3.5 font-semibold text-text-muted uppercase text-[10px] tracking-wider bg-neutral-50/40">
                Category
              </td>
              {vendors.map((vendor) => (
                <td key={vendor.id} className="p-3.5 border-l border-border font-medium capitalize text-text">
                  <Badge variant="primary" size="xs">
                    {vendor.category}
                  </Badge>
                </td>
              ))}
            </tr>

            {/* 3. Starting Price */}
            <tr className="border-b border-border">
              <td className="p-3.5 font-semibold text-text-muted uppercase text-[10px] tracking-wider bg-neutral-50/40">
                Starting Package
              </td>
              {vendors.map((vendor) => (
                <td key={vendor.id} className="p-3.5 border-l border-border font-bold text-sm text-primary">
                  {formatCurrency(vendor.startingPrice || 50000)}
                </td>
              ))}
            </tr>

            {/* 4. Experience */}
            <tr className="border-b border-border">
              <td className="p-3.5 font-semibold text-text-muted uppercase text-[10px] tracking-wider bg-neutral-50/40">
                Industry Experience
              </td>
              {vendors.map((vendor) => (
                <td key={vendor.id} className="p-3.5 border-l border-border text-text font-medium flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{typeof vendor.experience === 'number' ? `${vendor.experience}+ Years` : vendor.experience}</span>
                </td>
              ))}
            </tr>

            {/* 5. Service Areas */}
            <tr className="border-b border-border">
              <td className="p-3.5 font-semibold text-text-muted uppercase text-[10px] tracking-wider bg-neutral-50/40">
                Travel / Service Areas
              </td>
              {vendors.map((vendor) => {
                const areas = vendor.location?.serviceAreas || [vendor.city || 'Pan-India'];
                return (
                  <td key={vendor.id} className="p-3.5 border-l border-border text-text">
                    <p className="line-clamp-2 text-xs font-medium">
                      {areas.join(', ')}
                    </p>
                  </td>
                );
              })}
            </tr>

            {/* 6. Package Count */}
            <tr className="border-b border-border">
              <td className="p-3.5 font-semibold text-text-muted uppercase text-[10px] tracking-wider bg-neutral-50/40">
                Available Tiers
              </td>
              {vendors.map((vendor) => {
                const count = vendor.packages?.length || 2;
                return (
                  <td key={vendor.id} className="p-3.5 border-l border-border text-text font-semibold">
                    {count} Custom Packages
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorCompareTable;
