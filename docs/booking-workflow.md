# VenueAura – Booking Workflow

## Booking Status State Machine

```
enquiry → confirmed → advance_paid → fully_paid → completed
    │          │
    └──────────┴──→ cancelled / rejected
```

### Status Transitions

| Current Status | Action | Actor | New Status |
|---|---|---|---|
| enquiry | Confirm booking | VENDOR | confirmed |
| enquiry | Reject | VENDOR | rejected |
| enquiry | Cancel | CUSTOMER | cancelled |
| confirmed | Mark advance paid | System (payment) | advance_paid |
| confirmed | Cancel | CUSTOMER | cancelled |
| advance_paid | Mark fully paid | System (payment) | fully_paid |
| fully_paid | Mark completed | VENDOR / System | completed |
| fully_paid | Cancel | CUSTOMER | cancelled |

**Rule:** Only valid transitions are accepted. The service layer enforces this:

```javascript
const VALID_TRANSITIONS = {
  enquiry: ['confirmed', 'rejected', 'cancelled'],
  confirmed: ['advance_paid', 'cancelled'],
  advance_paid: ['fully_paid', 'cancelled'],
  fully_paid: ['completed', 'cancelled'],
};
```

---

## Venue Booking: Availability Check

**Problem:** Prevent two customers from booking the same venue on the same date.

**Solution:** Atomic check-and-create using MongoDB transaction:

```
1. Customer submits: { venueId, date, guestCount, eventType }
2. BEGIN TRANSACTION
3. Query: bookings where venue = venueId AND event.date = date AND status NOT IN [cancelled, rejected]
4. If conflicting booking found → ABORT, return 409 "Venue not available on this date"
5. Create booking document (status: 'enquiry')
6. COMMIT TRANSACTION
7. Send notification to vendor
8. Return booking details
```

**Edge case:** Two requests arrive simultaneously for the same date.
- MongoDB transaction with appropriate read concern ensures only one succeeds.

---

## Vendor Booking (Enquiry Flow)

Vendor services don't have strict date exclusivity (a DJ could do two events if they have staff), so vendor bookings are enquiry-based:

```
1. Customer submits enquiry: { vendorId, date, serviceDetails, budget }
2. Create booking (status: 'enquiry')
3. Notify vendor
4. Vendor reviews and confirms or rejects
5. Customer sees status update
```

---

## Cancellation Policy

- Cancellation before confirmation → full refund
- Cancellation within 72 hours of event → configurable penalty
- Refund processed via Razorpay refund API
- Refund status tracked in booking.cancellation.refundStatus

---

## Interview Questions

**Q: How do you prevent double bookings?**
A: We use MongoDB transactions. The availability check and booking creation happen atomically. If two requests arrive simultaneously, only one can commit the transaction successfully.

**Q: How do you handle the case where a customer's payment fails after a booking is confirmed?**
A: The booking status remains 'confirmed' but payment status is 'failed'. We implement a 24-hour payment deadline after confirmation. If payment is not received, the booking is automatically cancelled (a background job or webhook handles this).

**Q: What if the payment webhook fails to reach the server?**
A: Razorpay retries webhooks. We use idempotency keys (razorpayPaymentId) to ensure the same webhook event is only processed once even if received multiple times.

