/**
 * BookingTimeline Component
 *
 * Visual state machine progress tracker showing booking journey:
 * Enquiry → Confirmed → Advance Paid → Fully Paid → Completed
 *
 * WHY a timeline instead of just a badge?
 * Customers see at a glance where their booking stands and what comes next.
 * This reduces support queries about "what happens after I enquire?"
 */

import React from 'react';
import { Check, Clock, XCircle } from 'lucide-react';

const STEPS = [
  { key: 'enquiry',      label: 'Enquiry Sent',   desc: 'Request submitted' },
  { key: 'confirmed',    label: 'Confirmed',       desc: 'Venue/vendor confirmed' },
  { key: 'advance_paid', label: 'Advance Paid',    desc: '30% deposit cleared' },
  { key: 'fully_paid',   label: 'Fully Paid',      desc: 'Full payment received' },
  { key: 'completed',    label: 'Completed',       desc: 'Event successfully hosted' },
];

const STATUS_ORDER = {
  enquiry: 0, confirmed: 1, advance_paid: 2, fully_paid: 3, completed: 4,
};

export const BookingTimeline = ({ status }) => {
  const isCancelled = status === 'cancelled' || status === 'rejected';
  const currentIndex = STATUS_ORDER[status] ?? 0;

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
        <XCircle className="w-5 h-5 shrink-0" />
        <div>
          <p className="font-semibold">
            {status === 'cancelled' ? 'Booking Cancelled' : 'Booking Rejected'}
          </p>
          <p className="text-xs text-red-500 mt-0.5">
            {status === 'cancelled'
              ? 'This booking was cancelled. Refund (if any) will be processed within 5–7 business days.'
              : 'The venue/vendor has declined this booking request.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-neutral-200 z-0" />
      <div
        className="absolute top-4 left-4 h-0.5 bg-primary z-0 transition-all duration-500"
        style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
      />

      <div className="relative z-10 flex items-start justify-between">
        {STEPS.map((step, idx) => {
          const isDone    = idx < currentIndex;
          const isActive  = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center gap-1 w-1/5 text-center">
              {/* Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 ${
                  isDone
                    ? 'bg-primary border-primary text-white'
                    : isActive
                    ? 'bg-white border-primary text-primary shadow-primary-sm'
                    : 'bg-white border-neutral-200 text-neutral-300'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4" />
                ) : isActive ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Labels */}
              <p className={`text-[10px] font-semibold leading-tight ${
                isDone || isActive ? 'text-primary' : 'text-neutral-400'
              }`}>
                {step.label}
              </p>
              <p className="text-[9px] text-text-muted hidden sm:block leading-tight">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingTimeline;
