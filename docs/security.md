# VenueAura – Security Documentation

## Security Philosophy

Security is applied at every layer of the stack. Frontend validation is for UX only — all security decisions are enforced server-side.

---

## OWASP Top 10 Mitigations

| Risk | Mitigation |
|---|---|
| **A01 Broken Access Control** | JWT + RBAC on every protected route; resource ownership checks in every controller |
| **A02 Cryptographic Failures** | bcrypt(12) for passwords; HTTPS in production; HttpOnly cookies; never log sensitive data |
| **A03 Injection** | Zod validation on all inputs; Mongoose ORM prevents raw query injection; sanitize-mongo-query |
| **A04 Insecure Design** | Threat-modeled auth flow; refresh token rotation; payment signature verification |
| **A05 Security Misconfiguration** | Helmet headers; strict CORS allowlist; no stack traces in production |
| **A06 Vulnerable Components** | Minimal dependencies; `npm audit` in CI |
| **A07 Auth Failures** | Rate limiting on auth routes; account lockout consideration; vague error messages |
| **A08 Software & Data Integrity** | Razorpay HMAC-SHA256 webhook signature verification; npm lockfile |
| **A09 Logging Failures** | Pino structured logging; never log PII or tokens |
| **A10 SSRF** | No server-side URL fetching from user input |

---

## Helmet Configuration

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'"],
    }
  },
  crossOriginEmbedderPolicy: false // Required for Cloudinary images
}));
```

## CORS Configuration

```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Required for cookies
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));
```

## Rate Limiting

```
Global: 100 requests per 15 minutes per IP
Auth routes: 5 requests per 15 minutes per IP
Contact form: 3 submissions per hour per IP
```

## Input Validation

All requests pass through Zod validation middleware before reaching controllers:

```javascript
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, 'Validation failed', result.error.errors);
  }
  req.validatedBody = result.data; // Controller uses this, not req.body
  next();
};
```

Controllers always use `req.validatedBody`, never `req.body` directly. This prevents mass assignment attacks.

## File Upload Security

```javascript
// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Only JPEG, PNG, and WebP images are allowed'));
    }
  }
});
```

## Payment Security

Razorpay webhook signature verification:

```javascript
const crypto = require('crypto');

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
};
```

**Key principles:**
- Payment status is NEVER updated based on frontend report alone
- Only after signature verification does payment status change
- Webhook events are stored and de-duplicated by `razorpayPaymentId`
- Idempotency keys prevent double-charging

## Cookie Security

```javascript
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth', // Restrict cookie to auth routes only
});
```

## Error Handling

Production responses never include stack traces:

```javascript
if (process.env.NODE_ENV === 'production') {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.isOperational ? err.message : 'An unexpected error occurred',
  });
} else {
  // Development: include stack for debugging
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
}
```

