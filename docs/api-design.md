# VenueAura – API Design Standards

## Base URL

```
Development: http://localhost:5000/api/v1
Production:  https://api.venueaura.com/api/v1
```

## Versioning Strategy

URL-based versioning (`/api/v1/`) is used for simplicity and cache-friendliness. When breaking changes are required, a new version (`/api/v2/`) is introduced while keeping v1 available for backward compatibility.

---

## Standard Response Envelopes

### Success Response

```json
{
  "success": true,
  "message": "Venue retrieved successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 240,
    "totalPages": 24
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email address" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

---

## HTTP Status Codes

| Status | Usage |
|---|---|
| 200 | Success (GET, PATCH, DELETE) |
| 201 | Created (POST) |
| 204 | No Content (DELETE with no body) |
| 400 | Bad Request (validation failure, malformed request) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (authenticated but insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate email, conflicting booking) |
| 422 | Unprocessable Entity (business rule violation) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error (unexpected) |

---

## Endpoint Reference

### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/logout-all
POST   /api/v1/auth/refresh
GET    /api/v1/auth/verify-email/:token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password/:token
GET    /api/v1/auth/me
```

### Users
```
GET    /api/v1/users/profile
PATCH  /api/v1/users/profile
PATCH  /api/v1/users/change-password
POST   /api/v1/users/saved-venues/:venueId
DELETE /api/v1/users/saved-venues/:venueId
POST   /api/v1/users/saved-vendors/:vendorId
DELETE /api/v1/users/saved-vendors/:vendorId
GET    /api/v1/users/saved-venues
GET    /api/v1/users/saved-vendors
```

### Venues
```
GET    /api/v1/venues                    (public, paginated, filterable)
GET    /api/v1/venues/:idOrSlug          (public, venue detail)
POST   /api/v1/venues                    (VENDOR only)
PATCH  /api/v1/venues/:id               (VENDOR, owner only)
DELETE /api/v1/venues/:id               (VENDOR, owner only)
POST   /api/v1/venues/:id/images        (VENDOR, owner, multipart)
DELETE /api/v1/venues/:id/images/:imgId (VENDOR, owner only)
GET    /api/v1/venues/:id/availability  (public)
GET    /api/v1/venues/my-listings       (VENDOR only)
```

### Vendors
```
GET    /api/v1/vendors                   (public, paginated, filterable)
GET    /api/v1/vendors/:idOrSlug         (public)
POST   /api/v1/vendors/profile           (VENDOR, one per user)
PATCH  /api/v1/vendors/profile           (VENDOR, own profile)
DELETE /api/v1/vendors/profile           (VENDOR, own profile)
POST   /api/v1/vendors/portfolio         (VENDOR, multipart)
DELETE /api/v1/vendors/portfolio/:imgId  (VENDOR)
```

### Bookings
```
POST   /api/v1/bookings                  (CUSTOMER)
GET    /api/v1/bookings                  (CUSTOMER: own | VENDOR: received | ADMIN: all)
GET    /api/v1/bookings/:id              (owner or vendor or admin)
PATCH  /api/v1/bookings/:id/status       (VENDOR: confirm/reject | CUSTOMER: cancel)
GET    /api/v1/bookings/:id/invoice      (owner only)
```

### Payments
```
POST   /api/v1/payments/create-order     (CUSTOMER, requires bookingId)
POST   /api/v1/payments/verify           (CUSTOMER, Razorpay callback)
POST   /api/v1/payments/webhook          (Razorpay → server, no auth, verify signature)
GET    /api/v1/payments/:bookingId       (owner or admin)
```

### Events
```
GET    /api/v1/events                    (CUSTOMER: own events)
GET    /api/v1/events/:id               (owner only)
POST   /api/v1/events                   (CUSTOMER)
PATCH  /api/v1/events/:id              (owner only)
DELETE /api/v1/events/:id              (owner only)
```

### Budget
```
GET    /api/v1/budgets                   (CUSTOMER: own)
GET    /api/v1/budgets/:id              (owner only)
POST   /api/v1/budgets                  (CUSTOMER)
PATCH  /api/v1/budgets/:id             (owner only)
DELETE /api/v1/budgets/:id             (owner only)
POST   /api/v1/budgets/:id/expenses    (owner only)
PATCH  /api/v1/budgets/:id/expenses/:expId (owner only)
DELETE /api/v1/budgets/:id/expenses/:expId (owner only)
```

### Reviews
```
GET    /api/v1/reviews?venue=:id        (public)
GET    /api/v1/reviews?vendor=:id       (public)
POST   /api/v1/reviews                  (CUSTOMER, requires completed booking)
PATCH  /api/v1/reviews/:id             (author only, within 24 hours)
DELETE /api/v1/reviews/:id             (author or ADMIN)
POST   /api/v1/reviews/:id/response    (venue/vendor owner)
```

### Contact
```
POST   /api/v1/contact                  (public, rate limited)
GET    /api/v1/contact                  (ADMIN only)
PATCH  /api/v1/contact/:id/status      (ADMIN only)
```

### Notifications
```
GET    /api/v1/notifications            (authenticated user)
PATCH  /api/v1/notifications/:id/read  (recipient only)
PATCH  /api/v1/notifications/read-all  (authenticated user)
DELETE /api/v1/notifications/:id       (recipient only)
```

### Admin
```
GET    /api/v1/admin/stats              (ADMIN)
GET    /api/v1/admin/users              (ADMIN, paginated)
PATCH  /api/v1/admin/users/:id/status  (ADMIN: activate/deactivate)
GET    /api/v1/admin/venues/pending     (ADMIN)
PATCH  /api/v1/admin/venues/:id/approve (ADMIN)
PATCH  /api/v1/admin/venues/:id/reject  (ADMIN)
GET    /api/v1/admin/vendors/pending    (ADMIN)
PATCH  /api/v1/admin/vendors/:id/verify (ADMIN)
GET    /api/v1/admin/bookings           (ADMIN, all)
GET    /api/v1/admin/contacts           (ADMIN)
```

### Health
```
GET    /health
GET    /ready
```

---

## Pagination Convention

All list endpoints support:

```
GET /api/v1/venues?page=1&limit=12&sort=price&order=asc&city=Mumbai&eventType=wedding&minPrice=50000&maxPrice=500000&minCapacity=100&maxCapacity=1000&venueType=indoor&rating=4
```

Pagination metadata always returned in `meta`:

```json
{
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 240,
    "totalPages": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Query Optimization Notes

- Use MongoDB `lean()` for read-only list endpoints (removes Mongoose document overhead)
- Use `select()` to project only required fields
- Never fetch all documents and filter in JavaScript
- Use compound indexes that match the most common query patterns
- Avoid over-population: don't `.populate()` more than necessary

