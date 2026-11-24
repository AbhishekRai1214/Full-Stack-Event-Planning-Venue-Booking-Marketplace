# VenueAura – Authentication Flow

## Token Strategy

VenueAura uses a **dual-token** approach:

| Token | Type | Lifetime | Storage | Purpose |
|---|---|---|---|---|
| Access Token | JWT (signed with ACCESS_SECRET) | 15 minutes | Memory / Authorization header | API access |
| Refresh Token | Opaque token (stored in DB) | 7 days | HttpOnly, Secure, SameSite=Strict cookie | Obtain new access tokens |

**Why this design?**
- Access tokens are short-lived → compromise window is small
- Refresh tokens are stored HttpOnly → JavaScript cannot read them → XSS-safe
- Refresh tokens are stored in MongoDB → can be revoked on demand (logout, password change)
- Refresh token rotation: each use issues a new refresh token (old one is invalidated)

---

## Registration Flow

```
POST /api/v1/auth/register
  │
  ├── Zod validates: name, email, password, phone, role (only CUSTOMER or VENDOR)
  ├── Check: email already exists? → 409 Conflict
  ├── Hash password: bcrypt(password, 12)
  ├── Create user document (isEmailVerified: false)
  ├── Generate emailVerificationToken (crypto.randomBytes(32).toString('hex'))
  ├── Store hashed token + expiry in user document
  ├── Send verification email via Nodemailer
  └── Return: 201 Created, { user (without password) }
       (User must verify email before full access)
```

## Email Verification

```
GET /api/v1/auth/verify-email/:token
  │
  ├── Hash the incoming token
  ├── Find user where hashedToken matches AND expiry > now
  ├── If not found → 400 Bad Request (invalid or expired link)
  ├── Set isEmailVerified: true
  ├── Clear emailVerificationToken and expiry
  └── Return: 200 OK, "Email verified successfully"
```

## Login Flow

```
POST /api/v1/auth/login
  │
  ├── Zod validates: email, password
  ├── Rate limit: 5 attempts per 15 minutes per IP (auth-specific limiter)
  ├── Find user by email (select +password)
  ├── If not found → 401 (vague: "Invalid credentials")
  ├── bcrypt.compare(password, stored_hash)
  ├── If mismatch → 401 "Invalid credentials"
  ├── If !isEmailVerified → 403 "Please verify your email"
  ├── If !isActive → 403 "Account suspended"
  ├── Generate: accessToken (JWT, 15m), refreshToken (UUID)
  ├── Store refreshToken in user.refreshTokens[] with expiresAt
  ├── Set HttpOnly cookie: refreshToken
  ├── Update lastLogin
  └── Return: 200 OK, { accessToken, user (safe fields) }
```

## Authenticated Request Flow

```
Request with Authorization: Bearer <accessToken>
  │
  authenticate.js middleware:
  ├── Extract token from Authorization header
  ├── jwt.verify(token, ACCESS_SECRET)
  ├── If expired → 401 "Token expired" (client should refresh)
  ├── If invalid → 401 "Invalid token"
  ├── Attach req.user = { id, role, email }
  └── Call next()
  
authorize.js middleware:
  ├── Check req.user.role against required roles
  ├── If unauthorized → 403 "Insufficient permissions"
  └── Call next()
```

## Token Refresh Flow

```
POST /api/v1/auth/refresh
  │
  ├── Read refreshToken from HttpOnly cookie
  ├── If missing → 401
  ├── Find user where refreshTokens[].token === incoming token AND expiresAt > now
  ├── If not found → 401 "Invalid or expired refresh token" (possible token theft)
  ├── Rotation: remove old token from array
  ├── Generate new accessToken + new refreshToken
  ├── Add new refreshToken to user.refreshTokens[]
  ├── Set new HttpOnly cookie
  └── Return: 200 OK, { accessToken }
```

## Logout Flow

```
POST /api/v1/auth/logout
  │
  ├── Read refreshToken from cookie
  ├── Remove that specific token from user.refreshTokens[]
  ├── Clear the HttpOnly cookie
  └── Return: 200 OK "Logged out successfully"

POST /api/v1/auth/logout-all (logout all devices)
  │
  ├── Authenticate user
  ├── Clear ALL user.refreshTokens[]
  └── Return: 200 OK
```

## Password Reset Flow

```
POST /api/v1/auth/forgot-password
  │
  ├── Find user by email
  ├── If not found → 200 OK (don't reveal email existence)
  ├── Generate passwordResetToken (crypto.randomBytes(32))
  ├── Store hashed token + expiry (10 minutes)
  └── Send password reset email

POST /api/v1/auth/reset-password/:token
  │
  ├── Hash the token
  ├── Find user where hashedToken matches AND expiry > now
  ├── Validate new password strength (Zod)
  ├── Hash new password (bcrypt, cost 12)
  ├── Save new password
  ├── Invalidate ALL refresh tokens (security: revoke all sessions)
  ├── Clear reset token fields
  └── Return: 200 OK "Password reset successfully"
```

---

## Role-Based Access Control

```
Roles: CUSTOMER | VENDOR | ADMIN

CUSTOMER can:
  - Browse venues and vendors (public)
  - Book venues and vendors
  - Manage own bookings
  - Create and manage own budget plans
  - Write reviews (only for completed bookings)
  - Save/unsave venues and vendors
  - Manage own profile

VENDOR can:
  - Everything a CUSTOMER can
  - Create and manage own venue listings
  - Create and manage own vendor profile
  - Manage enquiries and bookings for own listings
  - Respond to reviews on own listings
  - Upload images to own portfolio

ADMIN can:
  - Everything
  - Approve/reject venue and vendor listings
  - Verify vendors
  - Manage all users
  - View all bookings
  - Manage reported content
  - View platform statistics
```

## Resource Ownership Authorization

Beyond role checks, controllers verify resource ownership:

```javascript
// Example: Customer can only access own budget
const budget = await Budget.findById(id);
if (budget.owner.toString() !== req.user.id) {
  throw new ApiError(403, 'You do not have permission to access this budget');
}
```

---

## Security Notes for Interviews

**Q: Why short-lived access tokens?**
A: If an access token is stolen, the attacker has at most 15 minutes before it expires. We can't revoke JWT tokens once issued (they're stateless), so short lifetime limits the damage.

**Q: Why store refresh tokens in the database?**
A: So we can revoke them. If we detect suspicious activity or the user logs out, we delete the token. The next refresh attempt fails. Pure refresh token cookies without DB storage cannot be revoked.

**Q: Why HttpOnly cookies for refresh tokens?**
A: JavaScript (including injected XSS scripts) cannot read HttpOnly cookies. Storing refresh tokens in localStorage makes them vulnerable to XSS attacks.

**Q: What is refresh token rotation?**
A: Every time a refresh token is used, it's replaced with a new one and the old one is invalidated. If an attacker steals a refresh token and uses it after the legitimate user has also used it, the system detects that the token was already rotated and can invalidate the entire session family.
