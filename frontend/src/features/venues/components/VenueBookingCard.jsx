import React, { useState } from 'react';
import {
  Calendar,
  Users,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { formatCurrency } from '@/utils';

export const VenueBookingCard = ({ venue }) => {
  const [bookingDate, setBookingDate] = useState('');
  const [guestCount, setGuestCount] = useState(venue?.capacity?.min || 150);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);

  const startingPrice = venue?.pricing?.startingPrice || 150000;
  const pricePerPlate = venue?.pricing?.pricePerPlate || 1800;

  const estimatedCatering = pricePerPlate ? pricePerPlate * guestCount : 0;
  const estimatedTotal = startingPrice + estimatedCatering;
  const advanceRequired = Math.round(estimatedTotal * 0.25);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsBookedSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsBookedSuccess(false);
    }, 2500);
  };

  return (
    <>
      <div className="card p-6 bg-white border border-border shadow-card space-y-6 sticky top-24">
        {/* Pricing Header */}
        <div className="pb-4 border-b border-border space-y-1">
          <span className="text-xs uppercase tracking-wider text-text-muted font-semibold block">
            Rental Package Starts at
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-serif font-black text-primary">
              {formatCurrency(startingPrice)}
            </span>
            <span className="text-xs text-text-muted font-normal">/ day</span>
          </div>
          {pricePerPlate && (
            <span className="text-xs font-medium text-text-muted block">
              + ₹{pricePerPlate} per plate for catering
            </span>
          )}
        </div>

        {/* Quick Calculator Form */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-text uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Select Date</span>
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="input-field py-2 text-xs bg-background-secondary"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-text uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>Expected Guests</span>
              </label>
              <span className="font-bold text-text">{guestCount} Guests</span>
            </div>
            <input
              type="range"
              min={venue?.capacity?.min || 50}
              max={venue?.capacity?.max || 1000}
              step={10}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-text-muted mt-1">
              <span>Min: {venue?.capacity?.min || 50}</span>
              <span>Max: {venue?.capacity?.max || 1000}</span>
            </div>
          </div>
        </div>

        {/* Estimated Price Breakdown */}
        <div className="p-3.5 rounded-card bg-background-secondary space-y-2 text-xs">
          <div className="flex justify-between text-text-muted">
            <span>Base Venue Rental</span>
            <span className="font-medium text-text">{formatCurrency(startingPrice)}</span>
          </div>
          {pricePerPlate && (
            <div className="flex justify-between text-text-muted">
              <span>Est. Food ({guestCount} × ₹{pricePerPlate})</span>
              <span className="font-medium text-text">{formatCurrency(estimatedCatering)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-border flex justify-between font-bold text-sm text-text">
            <span>Est. Total</span>
            <span className="text-primary">{formatCurrency(estimatedTotal)}</span>
          </div>
          <div className="flex justify-between text-[11px] text-text-muted pt-1">
            <span>25% Advance Booking:</span>
            <span>{formatCurrency(advanceRequired)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <Button
            variant="primary"
            className="w-full py-3"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Check Availability & Book
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<MessageSquare className="w-4 h-4 text-primary" />}
          >
            Contact Venue Owner
          </Button>
        </div>

        {/* Trust Guarantees */}
        <div className="pt-4 border-t border-border space-y-2 text-[11px] text-text-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span>100% Verified Venue & Pricing Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Direct manager contact, zero commission markup</span>
          </div>
        </div>
      </div>

      {/* Booking Enquiry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Inquire with ${venue?.name || 'Venue'}`}
      >
        {isBookedSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-xl text-text">
              Enquiry Submitted Successfully!
            </h4>
            <p className="text-sm text-text-muted max-w-sm mx-auto">
              The venue coordinator has been notified. You will receive an official response and quote within 2 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
            <p className="text-text-muted text-sm">
              Submit your dates and requirements to receive exact package pricing, availability confirmation, and complimentary site visit scheduling.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-text block mb-1">Your Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Abhishek Rai"
                  className="input-field text-xs py-2 bg-background-secondary"
                />
              </div>
              <div>
                <label className="font-semibold text-text block mb-1">Contact Phone</label>
                <input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="input-field text-xs py-2 bg-background-secondary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-text block mb-1">Event Date</label>
                <input
                  required
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="input-field text-xs py-2 bg-background-secondary"
                />
              </div>
              <div>
                <label className="font-semibold text-text block mb-1">Guest Count</label>
                <input
                  required
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="input-field text-xs py-2 bg-background-secondary"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-text block mb-1">Specific Requests or Notes</label>
              <textarea
                rows={3}
                placeholder="Mention catering preferences, stage decor, alcohol license requirements, or accommodation needs..."
                className="input-field text-xs py-2 bg-background-secondary"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Send Enquiry
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default VenueBookingCard;

