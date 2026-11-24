# VenueAura – Testing Strategy

## Tools

| Tool | Purpose |
|---|---|
| Jest | Test runner, assertions |
| Supertest | HTTP integration testing |
| mongodb-memory-server | In-memory MongoDB for tests (no real DB needed) |
| @faker-js/faker | Realistic test data generation |

---

## Testing Pyramid

```
         /\
        /  \  E2E Tests (10%)
       /----\  Critical user flows
      /      \
     /--------\  Integration Tests (30%)
    /  API +DB  \  Endpoints, auth, DB operations
   /------------\
  /              \  Unit Tests (60%)
 / Services, Utils \  Business logic, validators
/--------------------\
```

---

## Unit Tests

Located in `backend/src/tests/unit/`

### What to test:

**Services:**
- `auth.service`: password hashing, token generation, login logic
- `booking.service`: status transition validation, availability check logic, price calculation
- `budget.service`: expense calculation, utilization percentage, remaining budget
- `venue.service`: search/filter logic, slug generation

**Utilities:**
- `ApiError`: correct status codes and messages
- `pagination`: correct page/limit/skip calculation
- `generateTokens`: valid JWT structure

**Validators:**
- Zod schemas accept valid input
- Zod schemas reject invalid input with correct error messages

---

## Integration Tests

Located in `backend/src/tests/integration/`

### Critical test scenarios:

#### Auth
```
✓ POST /register: creates customer account with hashed password
✓ POST /register: rejects duplicate email (409)
✓ POST /register: rejects invalid role (ADMIN not allowed)
✓ POST /login: returns access token with correct credentials
✓ POST /login: returns 401 with wrong password
✓ POST /login: returns 401 with vague message (no info about whether email exists)
✓ POST /refresh: returns new access token with valid refresh token cookie
✓ POST /refresh: rejects expired or revoked refresh token
✓ POST /logout: invalidates refresh token
```

#### Authorization
```
✓ Customer cannot access admin routes (403)
✓ Vendor cannot modify another vendor's listing (403)
✓ Customer cannot access another customer's budget (403)
✓ Unauthenticated request to protected route returns 401
✓ Expired access token returns 401
```

#### Venues
```
✓ GET /venues: returns paginated list
✓ GET /venues: filters by city, eventType, priceRange correctly
✓ GET /venues/:id: returns venue detail
✓ POST /venues: vendor can create listing
✓ POST /venues: customer cannot create listing (403)
✓ PATCH /venues/:id: owner can update
✓ PATCH /venues/:id: non-owner vendor cannot update (403)
```

#### Bookings
```
✓ POST /bookings: customer creates booking for available venue
✓ POST /bookings: 409 for already-booked date
✓ POST /bookings: 409 for concurrent requests on same date (race condition)
✓ PATCH /bookings/:id/status: vendor can confirm own booking
✓ PATCH /bookings/:id/status: vendor cannot modify another vendor's booking (403)
✓ PATCH /bookings/:id/status: invalid status transition returns 422
✓ Customer can cancel own booking
✓ Customer cannot cancel another's booking (403)
```

#### Budget
```
✓ POST /budgets: creates budget with correct calculations
✓ POST /budgets/:id/expenses: adds expense and recalculates totals
✓ PATCH /budgets/:id/expenses/:id: updates expense, recalculates
✓ DELETE /budgets/:id/expenses/:id: removes expense, recalculates
✓ GET /budgets/:id: 403 for non-owner
✓ Utilization percentage correct to 2 decimal places
```

#### Payments
```
✓ POST /payments/verify: accepts valid signature, updates booking
✓ POST /payments/verify: rejects tampered signature (400)
✓ POST /payments/webhook: idempotent (same event twice → only processed once)
✓ POST /payments/webhook: rejects invalid webhook signature
```

---

## Coverage Target

| Category | Target |
|---|---|
| Auth service | >95% |
| Booking service | >90% |
| Budget service | >90% |
| Venue service | >80% |
| Utilities | >95% |
| Overall backend business logic | >80% |

---

## Running Tests

```bash
npm run test              # Run all tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:coverage     # With coverage report
npm run test:watch        # Watch mode during development
```

