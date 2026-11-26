/**
 * CreateBudgetModal Component
 *
 * Popover dialog for creating a new celebration budget plan
 * with presets for wedding, birthday, and custom celebrations.
 */

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBudget } from '../budgetSlice';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { IndianRupee, Sparkles } from 'lucide-react';

export const CreateBudgetModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    totalBudget: 1500000,
  });

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.totalBudget) return;

    dispatch(
      createBudget({
        name: formData.name,
        totalBudget: Number(formData.totalBudget),
        currency: 'INR',
      })
    );

    onClose();
  };

  const quickPresets = [
    { label: 'Intimate Gathering (₹3L)', amount: 300000 },
    { label: 'Grand Birthday (₹6L)', amount: 600000 },
    { label: 'Classic Wedding (₹15L)', amount: 1500000 },
    { label: 'Royal Destination (₹35L)', amount: 3500000 },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Celebration Budget" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1">
            Budget Plan Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Sangeet & Reception Financial Plan"
            className="w-full px-3 py-2 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1">
            Total Target Budget (₹) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              <IndianRupee className="w-4 h-4" />
            </div>
            <input
              type="number"
              required
              min="10000"
              step="10000"
              value={formData.totalBudget}
              onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Quick Amount Selector */}
        <div>
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
            Quick Budget Presets
          </p>
          <div className="grid grid-cols-2 gap-2">
            {quickPresets.map((preset) => (
              <button
                key={preset.amount}
                type="button"
                onClick={() => setFormData({ ...formData, totalBudget: preset.amount })}
                className={`py-1.5 px-2.5 rounded-lg border text-xs text-left transition-colors ${
                  formData.totalBudget === preset.amount
                    ? 'border-primary bg-primary-50/50 text-primary font-semibold'
                    : 'border-border bg-white text-text hover:bg-neutral-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-primary-50 rounded-xl border border-primary-100 text-xs text-text-muted">
          <p className="flex items-center gap-1.5 font-semibold text-primary mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Auto-Allocation Included:</span>
          </p>
          <span>
            VenueAura will automatically generate standard industry expense allocations for Venue (40%), Catering (25%), Decor (12%), Photography (8%), and Entertainment.
          </span>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button size="sm" variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button size="sm" variant="primary" type="submit">
            Generate Budget Plan
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBudgetModal;
