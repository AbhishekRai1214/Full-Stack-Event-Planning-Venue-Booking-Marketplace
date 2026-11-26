/**
 * BookingStatusBadge Component
 *
 * Renders a colour-coded badge matching the booking's current status in the state machine.
 * Maps each status to a semantic colour so users can scan booking lists at a glance.
 */

import React from 'react';
import Badge from '@/components/common/Badge';

const STATUS_CONFIG = {
  enquiry:      { variant: 'warning',  label: 'Enquiry Sent' },
  confirmed:    { variant: 'success',  label: 'Confirmed' },
  advance_paid: { variant: 'primary',  label: 'Advance Paid' },
  fully_paid:   { variant: 'primary',  label: 'Fully Paid' },
  completed:    { variant: 'success',  label: 'Completed' },
  cancelled:    { variant: 'neutral',  label: 'Cancelled' },
  rejected:     { variant: 'danger',   label: 'Rejected' },
};

export const BookingStatusBadge = ({ status, size = 'xs' }) => {
  const cfg = STATUS_CONFIG[status] || { variant: 'neutral', label: status };
  return <Badge variant={cfg.variant} size={size}>{cfg.label}</Badge>;
};

export default BookingStatusBadge;
