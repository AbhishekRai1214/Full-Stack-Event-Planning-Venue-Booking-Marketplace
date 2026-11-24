import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Instagram,
  Globe,
  Calendar,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { formatCurrency } from '@/utils';

export const VendorEnquiryCard = ({ vendor, selectedPackage }) => {
  const [eventDate, setEventDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const priceToDisplay = selectedPackage
    ? selectedPackage.price
    : vendor?.startingPrice || 50000;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSuccess(false);
    }, 2500);
  };

  return (
    <>
      <div className="card p-6 bg-white border border-border shadow-card space-y-6 sticky top-24">
        {/* Pricing header */}
        <div className="pb-4 border-b border-border space-y-1">
          <span className="text-xs uppercase tracking-wider text-text-muted font-semibold block">
            {selectedPackage ? 'Selected Package' : 'Starting From'}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-serif font-black text-primary">
              {formatCurrency(priceToDisplay)}
            </span>
            <span className="text-xs text-text-muted">/ event</span>
          </div>
          {selectedPackage && (
            <span className="text-xs font-semibold text-text block">
              Package: {selectedPackage.name}
            </span>
          )}
        </div>

        {/* Date Selector */}
        <div className="space-y-2 text-xs">
          <label className="font-semibold text-text uppercase tracking-wider block flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Select Event Date</span>
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="input-field py-2 text-xs bg-background-secondary"
          />
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <Button
            variant="primary"
            className="w-full py-3"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Check Availability & Quote
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<MessageSquare className="w-4 h-4 text-primary" />}
          >
            Send Direct Message
          </Button>
        </div>

        {/* Contact Info */}
        <div className="pt-4 border-t border-border space-y-2.5 text-xs text-text-muted">
          {vendor?.contact?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{vendor.contact.phone}</span>
            </div>
          )}
          {vendor?.contact?.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{vendor.contact.email}</span>
            </div>
          )}
          {vendor?.contact?.instagram && (
            <div className="flex items-center gap-2">
              <Instagram className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{vendor.contact.instagram}</span>
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="pt-3 border-t border-border space-y-1.5 text-[11px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Verified professional identity & portfolio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>No hidden fees, contract signed directly</span>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Inquire with ${vendor?.businessName || 'Vendor'}`}
      >
        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-xl text-text">
              Enquiry Sent Successfully!
            </h4>
            <p className="text-sm text-text-muted max-w-sm mx-auto">
              The vendor has received your event inquiry and will reply with a customized quote shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <p className="text-text-muted text-sm">
              Connect directly with {vendor?.businessName}. Share your event vision and dates to get custom pricing.
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
                <label className="font-semibold text-text block mb-1">Mobile Number</label>
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
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="input-field text-xs py-2 bg-background-secondary"
                />
              </div>
              <div>
                <label className="font-semibold text-text block mb-1">Event Type</label>
                <select className="input-field text-xs py-2 bg-background-secondary">
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="engagement">Engagement</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-text block mb-1">Requirement Details</label>
              <textarea
                rows={3}
                placeholder="Mention hours required, theme preferences, specific songs or dietary styles..."
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
                Submit Inquiry
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default VendorEnquiryCard;
