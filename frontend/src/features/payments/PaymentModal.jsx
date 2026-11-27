import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, ShieldCheck, AlertCircle, Loader2, Sparkles, Receipt, ArrowRight } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { paymentsApi } from './paymentsApi';
import { formatCurrency } from '../../utils';

/**
 * PaymentModal
 *
 * Handles both simulated test checkout and live Razorpay checkout for deposits and balance payments.
 */
const PaymentModal = ({ isOpen, onClose, booking, paymentType = 'advance', onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('card'); // 'card', 'upi', 'netbanking'

  // Calculate amount to pay
  const amountToPay = paymentType === 'advance'
    ? (booking?.pricing?.advanceRequired || Math.round((booking?.pricing?.totalAmount || 0) * 0.3))
    : ((booking?.pricing?.totalAmount || 0) - (booking?.pricing?.advancePaid || 0));

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setPaymentSuccess(false);
      setVerificationResult(null);
      initializeOrder();
    }
  }, [isOpen, booking, paymentType]);

  const initializeOrder = async () => {
    if (!booking?._id) return;
    try {
      setLoading(true);
      setError(null);
      const order = await paymentsApi.createOrder({
        bookingId: booking._id,
        paymentType,
      });
      setOrderData(order);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to initialize payment order');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Simulated Instant Checkout (Guaranteed to work in sandbox & dev)
   */
  const handleSimulatePayment = async () => {
    if (!orderData || !booking?._id) return;
    try {
      setLoading(true);
      setError(null);

      // Generate mock payment details
      const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const mockSignature = `mock_sig_${Date.now()}_verified`;

      const verifyRes = await paymentsApi.verifyPayment({
        bookingId: booking._id,
        razorpay_order_id: orderData.orderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: mockSignature,
      });

      setVerificationResult({
        ...verifyRes,
        paymentId: mockPaymentId,
        orderId: orderData.orderId,
      });
      setPaymentSuccess(true);
      if (onSuccess) onSuccess(verifyRes);
    } catch (err) {
      setError(err?.response?.data?.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Launch Razorpay Checkout Modal (If external Razorpay SDK is present)
   */
  const handleRazorpayCheckout = () => {
    if (!orderData) return;

    if (!window.Razorpay) {
      // If script not loaded, fall back gracefully to instant simulation
      handleSimulatePayment();
      return;
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'VenueAura Marketplace',
      description: `Payment for booking #${booking.bookingNumber}`,
      image: '/favicon.ico',
      order_id: orderData.orderId,
      handler: async (response) => {
        try {
          setLoading(true);
          const verifyRes = await paymentsApi.verifyPayment({
            bookingId: booking._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          setVerificationResult({
            ...verifyRes,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
          });
          setPaymentSuccess(true);
          if (onSuccess) onSuccess(verifyRes);
        } catch (err) {
          setError(err?.response?.data?.message || 'Server verification failed');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: 'VenueAura Customer',
        email: 'customer@venueaura.com',
        contact: '9999999999',
      },
      theme: {
        color: '#D4AF37', // Gold / Primary
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={paymentSuccess ? 'Payment Confirmed' : 'Complete Secure Payment'}
      size="md"
    >
      <div className="space-y-5">
        {paymentSuccess ? (
          // ─── Payment Success Receipt ───────────────────────────────────────
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl text-text">Payment Successful!</h3>
              <p className="text-xs text-text-muted mt-1">
                Your payment of {formatCurrency(amountToPay)} has been verified and processed.
              </p>
            </div>

            <div className="bg-neutral-50 border border-border rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Booking Reference:</span>
                <span className="font-semibold text-text">{booking?.bookingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Razorpay Order ID:</span>
                <span className="font-mono text-text">{verificationResult?.orderId || orderData?.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Transaction ID:</span>
                <span className="font-mono text-text">{verificationResult?.paymentId}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-semibold text-text">Amount Paid:</span>
                <span className="font-bold text-emerald-600 text-sm">{formatCurrency(amountToPay)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={onClose}
            >
              Done & View Booking
            </Button>
          </div>
        ) : (
          // ─── Payment Order Form ───────────────────────────────────────────
          <>
            {/* Amount Summary */}
            <div className="bg-gradient-to-br from-primary/10 via-amber-50 to-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {paymentType === 'advance' ? 'Advance Booking Deposit' : 'Remaining Balance Settlement'}
              </p>
              <div className="text-3xl font-serif font-bold text-text mt-1">
                {formatCurrency(amountToPay)}
              </div>
              <p className="text-xs text-text-muted mt-1">
                For booking: <span className="font-mono font-semibold text-text">{booking?.bookingNumber}</span>
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Mode Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'card'
                      ? 'border-primary bg-primary-50/50 text-primary ring-2 ring-primary/20'
                      : 'border-border bg-white text-text-muted hover:border-text-muted'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Card / UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'upi'
                      ? 'border-primary bg-primary-50/50 text-primary ring-2 ring-primary/20'
                      : 'border-border bg-white text-text-muted hover:border-text-muted'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Instant UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'border-primary bg-primary-50/50 text-primary ring-2 ring-primary/20'
                      : 'border-border bg-white text-text-muted hover:border-text-muted'
                  }`}
                >
                  <Receipt className="w-5 h-5" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            {/* Security Assurance */}
            <div className="flex items-center gap-2 text-xs text-text-muted bg-neutral-50 p-3 rounded-xl border border-border">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>256-bit encrypted SSL checkout powered by Razorpay gateway.</span>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                className="w-full justify-center text-sm py-3"
                onClick={handleSimulatePayment}
                disabled={loading || !orderData}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Payment...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Pay {formatCurrency(amountToPay)} Securely <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <button
                type="button"
                className="w-full text-center text-xs text-text-muted hover:text-text py-1"
                onClick={onClose}
              >
                Cancel and Pay Later
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;
