# VenueAura – Payment Workflow

## Razorpay Integration Flow

```
1. Customer clicks "Pay Now" on a confirmed booking
2. Frontend requests: POST /api/v1/payments/create-order { bookingId }
3. Backend:
   a. Verify booking belongs to customer
   b. Verify booking status is 'confirmed' (or 'advance_paid' for balance)
   c. Create Razorpay order via Razorpay API
   d. Save payment record (status: 'created', razorpayOrderId)
   e. Return: { orderId, amount, currency, key }
4. Frontend initializes Razorpay checkout with orderId
5. Customer completes payment (Razorpay handles UI)
6. Razorpay calls frontend with: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
7. Frontend sends these to: POST /api/v1/payments/verify
8. Backend:
   a. Verify HMAC-SHA256 signature
   b. If invalid → return 400, do NOT update status
   c. If valid → update payment status to 'captured'
   d. Update booking status (advance_paid or fully_paid)
   e. Send booking confirmation email
   f. Create notification
9. Webhook (parallel, independent, for reliability):
   POST /api/v1/payments/webhook (from Razorpay servers)
   a. Verify webhook signature (different from payment signature)
   b. Check for duplicate (idempotency)
   c. Update payment/booking status if not already updated
```

## Security Checklist

- [ ] Never expose RAZORPAY_KEY_SECRET to frontend
- [ ] Always verify payment signature server-side
- [ ] Never trust payment_id or amount reported by frontend
- [ ] Store webhook events for audit trail
- [ ] Implement idempotency to prevent double-processing
- [ ] Use test keys in development (never real keys in .env.example)
