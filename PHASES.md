# VenueAura – Development Phases

Track the development progress of VenueAura. Each phase is committed separately with a meaningful Git commit message.

---

## Phase Checklist

| Phase | Description | Status | Commit |
|---|---|---|---|
| **Phase 0** | Project Planning & Architecture | ✅ Complete | `docs: add project architecture and development roadmap` |
| **Phase 1** | Project Setup (MERN init) | ✅ Complete | `chore: initialize MERN stack project` |
| **Phase 2** | UI Foundation (design system) | ✅ Complete | `feat: implement reusable UI design system` |
| **Phase 3** | Home Page | ✅ Complete | `feat: build responsive VenueAura homepage` |
| **Phase 4** | Venue Marketplace | ✅ Complete | `feat: implement venue discovery marketplace` |
| **Phase 5** | Vendor Marketplace | ✅ Complete | `feat: implement vendor marketplace` |
| **Phase 6** | Authentication & Authorization | ⬜ Pending | `feat: implement JWT authentication and RBAC` |
| **Phase 7** | Customer & Vendor Dashboards | ⬜ Pending | `feat: implement customer and vendor dashboards` |
| **Phase 8** | Booking System | ⬜ Pending | `feat: implement booking and availability system` |
| **Phase 9** | Budget Planner | ⬜ Pending | `feat: implement interactive event budget planner` |
| **Phase 10** | Comparison System | ⬜ Pending | `feat: implement venue and vendor comparison` |
| **Phase 11** | Reviews & Contact | ⬜ Pending | `feat: implement reviews and contact system` |
| **Phase 12** | Admin Dashboard | ⬜ Pending | `feat: implement admin management dashboard` |
| **Phase 13** | Payments & Integrations | ⬜ Pending | `feat: integrate payments and external services` |
| **Phase 14** | Testing & Security | ⬜ Pending | `test: add application tests and security improvements` |
| **Phase 15** | Final Polish & Docs | ⬜ Pending | `docs: finalize project documentation and deployment guide` |

---

## Phase 0 – Project Planning & Architecture ✅

**Status:** Complete  
**Date:** 2026-11-24

### What Was Done

1. **Analyzed reference screenshots** – Identified all pages, components, and UI patterns:
   - Home page with hero, search form, event categories, service categories, featured venues, top vendors, budget preview
   - Venue listing page with filters, search, and venue detail
   - Vendor marketplace with categories and profiles
   - Budget planner with expense categories and progress bars
   - About page with team, stats, app promotion
   - Contact page with form
   - Customer, Vendor, and Admin dashboards

2. **Defined system architecture:**
   - Modular Monolith with 11 business domains
   - Layered request flow: Routes → Middleware → Controller → Service → Repository → Model
   - Feature-based frontend structure
   - Dual-token JWT authentication (access + refresh)

3. **Designed database schema:**
   - 10 MongoDB collections with proper relationships
   - Embedding vs reference decisions documented
   - Indexes planned for performance
   - Transaction strategy documented

4. **Created documentation suite:**
   - `docs/architecture.md` – System design and technology choices
   - `docs/database-design.md` – All schemas and relationships
   - `docs/authentication-flow.md` – Auth sequences with security reasoning
   - `docs/api-design.md` – All API endpoints and conventions
   - `docs/security.md` – OWASP mitigations
   - `docs/booking-workflow.md` – State machine and availability logic
   - `docs/payment-workflow.md` – Razorpay integration flow
   - `docs/testing-strategy.md` – Test scenarios and coverage targets
   - `docs/deployment.md` – Environment setup and production checklist

### Key Architectural Decisions

| Decision | Reasoning |
|---|---|
| Modular Monolith | Appropriate for project scale; avoids premature microservice complexity |
| JWT + HttpOnly Cookie | Access token in memory (XSS-safe), refresh token in HttpOnly cookie (XSS-safe) |
| MongoDB + Mongoose | Flexible schema suits event data; good JS/Node.js ecosystem |
| Feature-based frontend structure | Scales better than type-based (components/containers) as app grows |
| Zod for validation | Works on both frontend (React Hook Form) and backend; single schema source |
| Repository pattern | Keeps controllers thin; makes unit testing services easier |

### API Endpoints Planned

**15 route modules:** auth, users, venues, vendors, events, bookings, payments, budget, reviews, contact, notifications, admin + health

**~55 unique endpoints** across all modules.

### Database Collections

User, Venue, Vendor, Booking, Payment, Event, Budget, Review, Contact, Notification

---

## Phase 1 – Project Setup ✅

**Status:** Complete  
**Date:** 2026-11-24

### What Was Implemented

**Backend (Node.js + Express):**
- Full modular folder structure under `backend/src/`
- `config/env.js` – Zod-validated environment variables (fail-fast on startup)
- `config/database.js` – MongoDB connection with graceful shutdown and reconnect events
- `config/cloudinary.js` – Cloudinary initialization stub
- `utils/logger.js` – Pino structured logger with PII redaction
- `utils/ApiError.js` – Custom operational error class with factory methods
- `utils/ApiResponse.js` – Standardized response envelopes
- `utils/asyncHandler.js` – Async route wrapper (eliminates try/catch boilerplate)
- `utils/pagination.js` – Reusable pagination helpers
- `utils/generateTokens.js` – JWT + secure token generation/verification
- `constants/index.js` – All enums (roles, booking status, event types, etc.)
- `middleware/errorHandler.js` – Centralized error handling (Mongoose, JWT, ApiError)
- `middleware/notFound.js` – 404 catcher
- `middleware/rateLimiter.js` – Global, auth-specific, and contact limiters
- `middleware/authenticate.js` – JWT Bearer token verification
- `middleware/authorize.js` – RBAC role checking
- `middleware/validate.js` – Zod request validation (body/query/params)
- `app.js` – Express app with all middleware, health endpoints, CORS, Helmet
- `server.js` – HTTP server with graceful shutdown and error handlers
- 12 module route stubs (auth, users, venues, vendors, events, bookings, payments, budget, reviews, notifications, admin, contact)

**Frontend (React + Vite):**
- React 18 + Vite 5 scaffold with `@/` path alias
- Tailwind CSS v3 with full VenueAura design system (colors, fonts, shadows, components)
- `index.css` – 200+ lines: base reset, btn-primary/secondary/ghost, cards, inputs, badges, sections
- `src/main.jsx` – Redux Provider + BrowserRouter setup
- `src/App.jsx` – Working placeholder with phase tracker UI
- `src/app/store.js` – Redux Toolkit store (ready for slice additions)
- `src/services/api.js` – Axios instance with interceptors + in-memory token storage + auto-refresh
- `src/utils/index.js` – formatCurrency, formatDate, cn, getInitials, getErrorMessage

**Infrastructure:**
- Root `package.json` with `npm run dev` (runs both apps concurrently)
- `.vscode/extensions.json` with recommended extensions
- Backend `.env.example` with all required variable documentation

### Verification Results
| Check | Result |
|---|---|
| `backend npm install` | ✅ 607 packages installed |
| `frontend npm install` | ✅ 360 packages installed |
| `root npm install` | ✅ 29 packages installed |
| `node -e "require('./src/app')"` | ✅ Exit code 0 (no syntax errors) |
| `npm run build` (frontend) | ✅ 46 modules built in 6.68s |
| Health endpoint registered | ✅ `GET /health` and `GET /ready` |

---

## Phase 2 – UI Foundation ✅

**Status:** Complete  
**Date:** 2026-11-25

### What Was Implemented

1. **Design Tokens & Theme System:**
   - Emerald green primary palette (`#00C853` default, `#009B45` dark, scales 50-950)
   - Warm off-white section background (`#F7F8F6`)
   - Playfair Display serif headings paired with clean Inter sans-serif body
   - Custom shadows, radii (`rounded-button`, `rounded-card`, `rounded-card-lg`)

2. **Common UI Component Library (`frontend/src/components/common/`):**
   - `Button.jsx` – forwardRef button supporting primary, secondary, outline, ghost, dark, danger variants, sizes (sm/md/lg/icon), loading spinners, and icon slots
   - `Badge.jsx` – Status & category pill badges (default, primary, success, warning, danger, info, outline)
   - `Spinner.jsx` – Animated SVG loading spinners and full-page `LoadingScreen`
   - `Skeleton.jsx` – Shimmer loading placeholders including `VenueCardSkeleton`
   - `Modal.jsx` – Accessible dialog portal with backdrop blur, Escape dismissal, and document body scroll lock
   - `Rating.jsx` – Star rating renderer with numeric scores and review counts
   - `ErrorBoundary.jsx` – React component error boundary catching runtime errors with graceful fallback

3. **Layout Components (`frontend/src/components/layout/`):**
   - `Navbar.jsx` – Responsive sticky top navigation bar with VenueAura brand logo, navigation links (Home, Venues, Vendors, Compare, Budget Planner, About, Contact), wishlist link, auth buttons, and mobile animated drawer menu
   - `Footer.jsx` – Multi-column footer with brand mission, quick directory links, company pages, social channels, and verified vendor trust badges
   - `MainLayout.jsx` – Responsive master layout wrapping Navbar, ErrorBoundary-protected main content, and Footer

4. **Marketplace Cards (`frontend/src/components/cards/`):**
   - `VenueCard.jsx` – Venue listing card with responsive image thumbnail, zoom effect on hover, type and verification badges, wishlist heart toggle, city location, guest capacity range, price per event & plate, and View Details CTA
   - `VendorCard.jsx` – Vendor profile card with avatar, verified badge, rating, category badge, city, years of experience, starting price, and View Profile action

5. **Design System Showcase (`frontend/src/App.jsx`):**
   - Interactive live showcase demonstrating all tokens, button variants, badges, cards, modals, and shimmer skeletons
   - Full routing setup for placeholder pages

### Verification Results
| Check | Result |
|---|---|
| `npm run build` (frontend) | ✅ 1389 modules transformed and built clean (0 errors) |
| Responsive Layout | ✅ Desktop, Tablet, Mobile verified |
| Design Tokens | ✅ Matches reference screenshots (#00C853, Playfair serif, warm off-white) |

---

## Phase 3 – Home Page ✅

**Status:** Complete  
**Date:** 2026-11-25

### What Was Implemented

1. **Hero & Dynamic Search Section (`HeroSection.jsx`):**
   - High-resolution luxury banquet/palace background with dark gradient overlay
   - Headline: *"Plan Every Celebration Beautifully"* with primary italic accent
   - Subtitle & Action CTAs: *"Explore Venues"* and *"Plan My Event"*
   - Comprehensive multi-filter search widget:
     - Location (Mumbai, Delhi NCR, Jaipur, Bengaluru, Goa, Hyderabad, Udaipur, Pune)
     - Event Type (Wedding, Birthday, Engagement, Baby Shower, Corporate, Farewell, Anniversary, Religious)
     - Date selection
     - Guest Capacity (50-100, 100-300, 300-600, 600-1200, 1200+)
     - Search query builder redirecting to `/venues?city=...`

2. **Browse by Event (`BrowseByEvent.jsx`):**
   - Visual card grid for 8 key event types with photo cards, venue counters, and zoom transitions:
     - Wedding, Birthday Party, Engagement, Baby Shower, Corporate Event, Farewell Party, Anniversary, Religious Event
   - Direct category route linking

3. **Everything in One Place (`EverythingInOnePlace.jsx`):**
   - Service category discovery grid with custom Lucide icon badges and item counts:
     - Venues, Photographers, Catering, Decoration, DJ & Sound, Makeup Artists, Cars & Vehicles, Mehendi Artists, Tent House, Bands, Pandits & Priests, Florists, Invitations
   - Integrated vendor onboarding banner CTA for venue owners & event providers

4. **Featured Venues (`FeaturedVenuesSection.jsx`):**
   - Curated showcase of top heritage palaces, luxury waterfront lawns, and ballroom spaces
   - Cards display verification badges, capacity, starting & per-plate prices, ratings, and wishlist toggles

5. **Top Rated Vendors (`TopRatedVendorsSection.jsx`):**
   - Acclaimed photographers, caterers, decorators, and DJs with experience tags, ratings, and pricing

6. **Interactive Build Your Event Preview (`BuildYourEventSection.jsx`):**
   - Live budget utilization card calculating total spent vs total budget
   - Dynamic animated progress bar and remaining budget indicator
   - Selected items breakdown with real-time deletion & calculation
   - Quick action to open the full interactive Budget Planner

7. **Realistic Mock Seed Dataset (`frontend/src/features/home/data/homeData.js`):**
   - Structured data for 8 event categories, 13 service types, 6 featured venues, and 4 top vendors

### Verification Results
| Check | Result |
|---|---|
| `npm run build` (frontend) | ✅ 1397 modules built cleanly in 26s (0 errors) |
| Search Form Execution | ✅ Constructs valid URL query parameters |
| Interactive Budget Preview | ✅ Real-time calculations & reactive progress bar |
| Responsive Layout | ✅ 320px mobile to 1440px desktop verified |

---

## Phase 4 – Venue Marketplace ✅

**Status:** Complete  
**Date:** 2026-11-25

### What Was Implemented

1. **Backend Venue Domain (`backend/src/modules/venues/`):**
   - **`venue.model.js`**: Mongoose schema with embedded images, location coordinates, eventTypes array, capacity (min/max), pricing (starting & per-plate), facilities, ratings, availability, and compound indexes (`{ status: 1, 'location.city': 1, 'pricing.startingPrice': 1 }`, text index).
   - **`venue.validation.js`**: Zod validation schemas for query parameters (`listVenuesQuerySchema`) with type transformations, and body validations (`createVenueSchema`, `updateVenueSchema`).
   - **`venue.repository.js`**: Data access abstraction using `.lean()`, pagination, sorting, text search, and document counting.
   - **`venue.service.js`**: Business logic layer managing dynamic MongoDB filters, slug generation, sorting rules, and ownership authorization.
   - **`venue.controller.js`**: HTTP handlers utilizing `asyncHandler` and standardized `ApiResponse`.
   - **`venue.routes.js`**: REST routes (`GET /api/v1/venues`, `GET /api/v1/venues/:idOrSlug`, `POST /api/v1/venues`, `PATCH /api/v1/venues/:id`, `DELETE /api/v1/venues/:id`) with JWT auth & RBAC middleware.
   - Mounted in `backend/src/app.js` under `/api/v1/venues`.
   - **`backend/src/jobs/seedVenues.js`**: Comprehensive database seed script with 8 luxury heritage palaces, convention centers, and beachfront venues.

2. **Frontend Venue Marketplace Features (`frontend/src/features/venues/`):**
   - **`venuesApi.js`**: Axios client with query parameter serialization and seamless fallback handling for standalone/offline operation.
   - **`venuesSlice.js`**: Redux Toolkit slice managing venue lists, active filters, selected venue details, pagination metadata, and wishlist bookmarks.
   - Mounted in `frontend/src/app/store.js` as `venues` state slice.
   - **`VenueFilters.jsx`**: Collapsible filter sidebar with City dropdown, Event Type selector, Space Style selector, Price Range selector, Guest Capacity pills, Rating threshold, and Reset button.
   - **`VenueGallery.jsx`**: Image showcase featuring main 16:9 view, image counter, next/previous controls, and clickable thumbnail filmstrip.
   - **`VenueFacilities.jsx`**: Grid displaying all verified amenities with icon checks.
   - **`VenueBookingCard.jsx`**: Sticky booking/reservation calculator card with live date selector, interactive guest count range slider, estimated catering & venue total calculation, 25% advance requirement breakdown, and interactive "Inquire with Venue" modal with form validation.

3. **Pages & Routing:**
   - **`VenueListingPage.jsx`**: Responsive venue directory with top search bar, sort dropdown, results count, active filters, mobile slide-over drawer, responsive 3-column venue card grid, and multi-page pagination.
   - **`VenueDetailPage.jsx`**: Complete venue profile with breadcrumbs, badges, title, location, gallery, specifications grid, description, amenities list, verified review quotes, and sticky booking card.
   - Registered `/venues` and `/venues/:id` in `frontend/src/App.jsx`.

### Verification Results
| Check | Result |
|---|---|
| `backend syntax check` | ✅ `node -e "require('./src/app')"` loaded with 0 errors |
| `npm run build` (frontend) | ✅ 1465 modules built cleanly in 21.5s (0 errors) |
| Filtering & Search | ✅ City, budget, capacity, space style, and keyword search operational |
| Responsive Layout | ✅ Mobile slide-over drawer, sticky booking card, thumbnail gallery |

---

## Phase 5 – Vendor Marketplace ✅

**Status:** Complete  
**Date:** 2026-11-25

### What Was Implemented

1. **Backend Vendor Domain (`backend/src/modules/vendors/`):**
   - **`vendor.model.js`**: Mongoose model with embedded package tiers, portfolio items, contact info, ratings, and compound indexes (`{ status: 1, category: 1, 'location.city': 1 }`, full text index on `businessName`, `description`, `city`).
   - **`vendor.validation.js`**: Zod query schema with type transformations for filtering (`category`, `city`, `search`, `minPrice`, `maxPrice`, `minExperience`, `rating`, `sort`, `page`, `limit`), and body schemas (`createVendorSchema`, `updateVendorSchema`).
   - **`vendor.repository.js`**: Encapsulated database operations using `.lean()`, sorting, pagination, and count operations.
   - **`vendor.service.js`**: Business logic layer managing dynamic MongoDB filters, slug generation, sort strategies, and ownership verification.
   - **`vendor.controller.js`**: Handlers using `asyncHandler` and standardized `ApiResponse`.
   - **`vendor.routes.js`**: REST routes (`GET /api/v1/vendors`, `GET /api/v1/vendors/:idOrSlug`, `POST /api/v1/vendors/profile`, `PATCH /api/v1/vendors/:id`, `DELETE /api/v1/vendors/:id`).
   - Mounted in `backend/src/app.js` under `/api/v1/vendors`.
   - **`backend/src/jobs/seedVendors.js`**: Dedicated database seeder with 6 award-winning event vendors across photography, catering, floral decor, DJ acoustics, couture makeup, and live acoustic music.

2. **Frontend Vendor Marketplace (`frontend/src/features/vendors/`):**
   - **`vendorsApi.js` & `vendorsSlice.js`**: Redux Toolkit slice and Axios API client with local fallback dataset for offline/sandbox mode.
   - Mounted in `frontend/src/app/store.js` as `vendors` state slice.
   - **`VendorFilters.jsx`**: Sidebar filter with Category selector, City dropdown, Experience tiers (5+, 8+, 10+, 15+ years), Price range thresholds, and Reset All.
   - **`VendorPackages.jsx`**: Tiered package cards displaying pricing in INR, feature checklists, and interactive package selection.
   - **`VendorPortfolio.jsx`**: Responsive visual photo gallery with lightbox image enlargement modal.
   - **`VendorEnquiryCard.jsx`**: Sticky card displaying selected package / starting price, direct phone & email, date selection, and an interactive "Inquire with Vendor" modal with form validation.

3. **Pages & Routing:**
   - **`VendorListingPage.jsx`**: Quick horizontal category pill bar, search bar, sort selector (`newest`, `rating_desc`, `experience_desc`, `price_asc`, `price_desc`), mobile filter drawer, responsive vendor profile cards, and pagination.
   - **`VendorDetailPage.jsx`**: Comprehensive vendor profile with cover banner, avatar, experience & verified badges, bio & service areas, packages comparison, portfolio grid, verified client quotes, and sticky enquiry card.
   - Registered `/vendors` and `/vendors/:id` in `frontend/src/App.jsx`.

### Verification Results
| Check | Result |
|---|---|
| `backend syntax check` | ✅ `node -e "require('./src/app')"` loaded with 0 errors |
| `npm run build` (frontend) | ✅ 1474 modules built cleanly in 17.2s (0 errors) |
| Category Quick Tabs | ✅ Real-time filtering across 8 event service categories |
| Responsive Layout | ✅ Mobile slide-over drawer, sticky enquiry card, lightbox modal |

---

## Phase 6 – Authentication & Authorization (RBAC) ✅

**Status:** Complete  
**Date:** 2026-11-25

### What Was Implemented

1. **Backend User & Authentication Architecture (`backend/src/modules/`):**
   - **`user.model.js`**:
     - Fields: `name`, `email` (unique, lowercase), `password` (bcrypt hash, `select: false`), `role` (`CUSTOMER`, `VENDOR`, `ADMIN`), `phone`, `avatar`, `refreshTokens[]` (token string + expiry), `isEmailVerified`, `isActive`, `lastLogin`, and audit timestamps.
     - Pre-save bcrypt hashing hook (cost factor 12) and `comparePassword(candidate)` method.
     - Custom JSON transform excluding passwords, refresh tokens, and internal properties.
   - **`auth.validation.js`**: Zod schemas for `registerSchema` (enforcing strong passwords and preventing self-assigning `ADMIN`), `loginSchema`, and `refreshTokenSchema`.
   - **`user.repository.js`**: Data access layer for user creation, credential queries, refresh token storage, and session token invalidation.
   - **`auth.service.js`**:
     - Register: validates uniqueness, hashes credentials, generates initial access + opaque refresh token pair.
     - Login: authenticates email & password, prunes expired tokens, issues dual tokens.
     - Refresh: rotates refresh token, revokes consumed token, and issues fresh access token.
     - Logout: clears refresh token in DB and flushes cookie.
     - Current User (`getMe`): fetches authenticated profile.
   - **`auth.controller.js`**: Handles HTTP contracts, returning standard `ApiResponse` JSON and setting secure `HttpOnly` cookie for refresh tokens.
   - **`auth.routes.js`**: REST endpoints (`POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`), protected with `authRateLimiter` and validation middleware.
   - Mounted in `backend/src/app.js` under `/api/v1/auth`.

2. **Frontend Authentication & State (`frontend/src/`):**
   - **`authApi.js`**: Authentication client communicating with API and handling access token memory storage. Includes simulated fallback accounts for seamless offline testing.
   - **`authSlice.js`**: Redux Toolkit slice managing `user`, `accessToken`, `isAuthenticated`, `isLoading`, and `error`. Hydrates initial session from storage and registered in `store.js`.
   - **`ProtectedRoute.jsx`**: Route guard validating authentication state and enforcing RBAC with customizable `allowedRoles`. Redirects unauthenticated visitors to `/login` with return intent.
   - **`Navbar.jsx` Auth Integration**:
     - Dynamically renders Sign In / Get Started CTAs or authenticated User Pill.
     - User Pill displays avatar, name, and role badge (`CUSTOMER`, `VENDOR`, `ADMIN`).
     - Dropdown menu with navigation to Role Portal (Admin Control Center, Vendor Portal, My Profile) and one-click Sign Out.
   - **`LoginPage.jsx`**: Responsive login form with demo credentials quick-fill buttons for Customer, Vendor, and Admin accounts, eye-toggle password visibility, and validation feedback.
   - **`RegisterPage.jsx`**: Role selection tabs (Customer vs Vendor Partner), validation, and registration flow.
   - Mounted `/login`, `/register`, and `/profile` routes in `frontend/src/App.jsx`.

### Verification Results
| Check | Result |
|---|---|
| `backend app syntax check` | ✅ `node -e "require('./src/app')"` loaded with 0 errors |
| `JWT signing & verification` | ✅ Dual token signing and payload extraction verified |
| `npm run build` (frontend) | ✅ 1479 modules built cleanly in 9.5s (0 errors) |
| Responsive Layout & RBAC | ✅ Guard routes, demo account logins, and role dropdown verified |

---

## Phase 7 – Event Management ✅

**Status:** Complete  
**Date:** 2026-11-25

### What Was Implemented

1. **Backend Event Module (`backend/src/modules/events/`):**
   - **`event.model.js`**:
     - Fields: `owner` (ObjectId ref User), `name`, `eventType` (wedding, birthday, engagement, corporate, etc.), `date`, `endDate`, `city`, `guestCount`, `estimatedBudget`, `venue` (ref Venue), `vendors[]` (ref Vendor with category & shortlist status), `checklist[]` (task title, category, isCompleted, dueDate), `notes`, `status` (`planning`, `confirmed`, `completed`, `cancelled`), `coverImage`.
     - Indexes on `{ owner: 1, date: -1 }` and `eventType`.
   - **`event.validation.js`**:
     - Zod schemas for `createEventSchema`, `updateEventSchema`, and `addChecklistItemSchema`.
   - **`event.repository.js`**:
     - Full data access layer with Mongoose population for linked venue and vendors, checklist array mutation methods (`addChecklistItem`, `toggleChecklistItem`, `deleteChecklistItem`).
   - **`event.service.js`**:
     - Enforces strict resource ownership (`event.owner === user.id` or `user.role === 'ADMIN'`).
     - Auto-seeds helpful starter checklist tasks (e.g., guest list, photographer booking, menu tasting, decor concept) when a new event is created.
   - **`event.controller.js`**:
     - Standard REST endpoints responding with uniform `ApiResponse` payloads.
   - **`event.routes.js`**:
     - Protected by `authenticate` middleware.
     - Endpoints: `POST /api/v1/events`, `GET /api/v1/events`, `GET /api/v1/events/:id`, `PATCH /api/v1/events/:id`, `DELETE /api/v1/events/:id`, `POST /api/v1/events/:id/tasks`, `PATCH /api/v1/events/:id/tasks/:itemId/toggle`, `DELETE /api/v1/events/:id/tasks/:itemId`.
   - Mounted in `backend/src/app.js` under `/api/v1/events`.

2. **Frontend Event Management (`frontend/src/`):**
   - **`eventsApi.js` & `eventsSlice.js`**:
     - Redux Toolkit state slice handling asynchronous API calls, task toggles, creation, deletion, and local fallback storage for offline resilience.
     - Registered in `frontend/src/app/store.js` as `events` reducer.
   - **`EventCard.jsx`**:
     - High-impact visual card displaying countdown days, planning progress bar (completed vs total tasks), budget, guest count, city, and status badge.
   - **`EventChecklist.jsx`**:
     - Interactive task manager allowing hosts to toggle tasks as complete with one click, add custom tasks categorized by department (Venue, Catering, Photography, etc.), and remove finished tasks.
   - **`CreateEventModal.jsx`**:
     - Smooth popover dialog for creating new celebrations with date pickers, expected guest counters, budget, and planning notes.
   - **`EventsPage.jsx`**:
     - Central event management dashboard featuring aggregated metrics (Total Events, Active in-planning, Total guests), responsive celebration grid, and quick creation action.
   - **`EventDetailPage.jsx`**:
     - Comprehensive planning workspace showcasing countdown banner, linked venue card with quick links to venue specs, planning checklist, and notes.
   - **Navigation & Routing**:
     - Added "Events" link in `Navbar.jsx`.
     - Protected routes `/events` and `/events/:id` wired in `frontend/src/App.jsx`.

### Verification Results
| Check | Result |
|---|---|
| `backend app syntax check` | ✅ `node -e "require('./src/app')"` loaded with 0 errors |
| `event schema validation` | ✅ Zod validation test executed cleanly |
| `npm run build` (frontend) | ✅ 1486 modules built cleanly in 7.7s (0 errors) |
| Protected Routing | ✅ `/events` guarded by `ProtectedRoute` |

---

## Phase 8 – Booking Workflow & State Machine ✅

**Status:** Complete  
**Date:** 2026-11-26

### What Was Implemented

1. **Backend Booking Module (`backend/src/modules/bookings/`):**
   - **`booking.model.js`**:
     - Fields: `bookingNumber` (auto-generated: `VA-YYYYMMDD-XXXXX`), `customer` (ObjectId ref User), `bookingType` (`venue` | `vendor`), `venue` / `vendor` (conditional refs), `event` (name, type, date, guestCount), `pricing` (baseAmount, taxes, totalAmount, advanceRequired, advancePaid, currency), `status` (state machine enum), `notes`, `vendorNotes`, `cancellation` (cancelledBy, reason, cancelledAt, refundAmount, refundStatus), `payment`.
     - Compound indexes: `{ customer: 1, createdAt: -1 }`, `{ venue: 1, 'event.date': 1 }`, `{ vendor: 1, 'event.date': 1 }`.
   - **`booking.validation.js`**: Zod schemas for `createVenueBookingSchema`, `createVendorBookingSchema`, `updateStatusSchema`, and `cancelBookingSchema`.
   - **`booking.repository.js`**: Data access layer including availability conflict detection (`findConflictingVenueBooking`), customer/vendor-owner queries, and status aggregation.
   - **`booking.service.js`** (core state machine logic):
     - **Venue bookings**: Availability check before creation (409 Conflict if same venue/date already has an active booking), 18% GST calculation, 30% advance requirement auto-computation.
     - **Vendor bookings**: Enquiry-based creation (no date exclusivity).
     - **`updateStatus`**: Validates transitions against `BOOKING_STATUS_TRANSITIONS` lookup; enforces role permissions (CUSTOMER → cancel only; VENDOR → confirm/reject/complete; ADMIN → any).
     - **`cancelBooking`**: Sets `cancellation` subdocument with actor, reason, timestamp, and refund status.
   - **`booking.controller.js`** and **`booking.routes.js`**:
     - `POST /api/v1/bookings/venues` (CUSTOMER only)
     - `POST /api/v1/bookings/vendors` (CUSTOMER only)
     - `GET /api/v1/bookings/my` (authenticated)
     - `GET /api/v1/bookings/:id` (owner or ADMIN)
     - `PATCH /api/v1/bookings/:id/status` (VENDOR or ADMIN)
     - `POST /api/v1/bookings/:id/cancel` (authenticated with ownership check)
     - `GET /api/v1/bookings` (ADMIN only)
   - Mounted in `backend/src/app.js` under `/api/v1/bookings`.

2. **Frontend Booking Management (`frontend/src/`):**
   - **`bookingsApi.js` & `bookingsSlice.js`**: Redux Toolkit slice with async thunks for fetching, creating, and cancelling bookings; rich LocalStorage mock fallback with 3 realistic seed bookings.
   - Registered in `store.js` as `bookings` reducer.
   - **`BookingStatusBadge.jsx`**: Semantic colour-coded status badge mapping all 7 booking states.
   - **`BookingCard.jsx`**: Compact booking row card with cover image, booking number, event details, pricing summary, advance payment progress bar, and inline cancellation modal.
   - **`BookingTimeline.jsx`**: Visual state machine progress tracker (Enquiry → Confirmed → Advance Paid → Fully Paid → Completed) with active-step highlighting and cancelled/rejected special states.
   - **`BookingsPage.jsx`**: Customer bookings dashboard with tab filters (All / Active / Completed / Cancelled) and summary stats.
   - **`BookingDetailPage.jsx`**: Full booking workspace showing timeline, event details panel, pricing breakdown with payment progress bar, vendor/customer notes, cancellation history, and action buttons.
   - Navbar updated to include "Bookings" link.
   - Protected routes `/bookings` and `/bookings/:id` wired in `App.jsx`.

### Verification Results
| Check | Result |
|---|---|
| Backend app syntax | ✅ `node -e "require('./src/app')"` loaded with 0 errors |
| Booking schema validation | ✅ Zod + state machine constants verified |
| `npm run build` (frontend) | ✅ 1493 modules built in 21.2s (0 errors) |
| Protected Routes | ✅ `/bookings` and `/bookings/:id` guarded by `ProtectedRoute` |

---

## Phase 9 – Budget Planner & Calculator ✅

**Status:** Complete  
**Date:** 2026-11-26

### What Was Implemented

1. **Backend Budget Module (`backend/src/modules/budget/`):**
   - **`budget.model.js`**:
     - Fields: `owner` (ref User), `event` (ref Event), `name`, `totalBudget`, `currency`, `expenses[]` (category, name, estimatedAmount, actualAmount, isPaid, notes).
     - Auto-computed fields: `totalEstimated`, `totalActual`, `remainingBudget`, and `utilizationPercent`.
     - Pre-save hook automatically computes summary aggregates server-side, preventing client payload manipulation.
   - **`budget.validation.js`**: Zod schemas for `createBudgetSchema`, `updateBudgetSchema`, `addExpenseItemSchema`, and `updateExpenseItemSchema`.
   - **`budget.repository.js`**: Data access layer supporting budget plan CRUD, line-item additions, in-place updates, and array deletions using Mongoose subdocument methods.
   - **`budget.service.js`**:
     - Smart Auto-Presets: automatically seeds recommended allocations if empty (Venue 40%, Catering 25%, Decor 12%, Photography 8%, DJ 4%, Makeup 4%, Clothing 4%, Invitations 3%).
     - Resource ownership guards ensuring only the budget owner or Admin can view/modify budgets.
   - **`budget.controller.js`** & **`budget.routes.js`**:
     - Full REST API mounted at `/api/v1/budgets` with authentication and schema validation.
   - Mounted in `backend/src/app.js` under `/api/v1/budgets`.

2. **Frontend Budget Planner (`frontend/src/`):**
   - **`budgetApi.js` & `budgetSlice.js`**: Redux Toolkit slice managing budgets, active plan selection, and expense CRUD with offline LocalStorage fallback data.
   - Registered in Redux store at `store.js`.
   - **`BudgetSummaryCards.jsx`**: Metric tiles displaying Total Budget, Estimated Cost, Actual Amount Paid, and Remaining Funds with dynamic over-budget alerts.
   - **`BudgetCategoryBreakdown.jsx`**: Multi-segment progress bar and responsive category pill grid with percentage share and paid indicators.
   - **`ExpenseTable.jsx`**: Interactive table allowing inline Paid/Pending status toggling, quick new expense drawer, and line-item deletions.
   - **`CreateBudgetModal.jsx`**: Modal dialog for creating new budgets with instant preset buttons (Intimate Gathering ₹3L, Grand Birthday ₹6L, Classic Wedding ₹15L, Royal Destination ₹35L).
   - **`BudgetPlannerPage.jsx`**: Central workspace with active plan dropdown switcher, summary cards, category distributions, and expense table.
   - Wired `/budget` protected route in `App.jsx`.

### Verification Results
| Check | Result |
|---|---|
| Backend syntax check | ✅ App loads with 0 errors |
| Frontend production build | ✅ 1,500 modules built cleanly in 34.7s |
| Protected Routing | ✅ `/budget` guarded by `ProtectedRoute` |

---

## Phase 10 – Comparison Tool (Side-by-Side Venues & Vendors) ✅

**Status:** Complete  
**Date:** 2026-11-27

### What Was Implemented

1. **Comparison State Architecture (`frontend/src/features/compare/`):**
   - **`compareSlice.js`**: Redux Toolkit slice managing shortlisted `venueIds` and `vendorIds` with an automatic capacity cap of 4 items per category.
   - Integrated persistent synchronization with browser `localStorage` (`venueaura_compare_venues`, `venueaura_compare_vendors`) to maintain user shortlists across tabs and refreshes.
   - Registered `compare` reducer in `frontend/src/app/store.js`.
   - **`CompareBar.jsx`**: Floating sticky bottom drawer that smoothly slides up whenever any item is shortlisted, previewing thumbnails with remove buttons, a count indicator, and an instant "Compare Now" CTA.

2. **Card Integrations:**
   - **`VenueCard.jsx`**: Added dedicated comparison toggle scale icon button with active/shortlisted visual state.
   - **`VendorCard.jsx`**: Added dedicated compare toggle icon button on vendor cards.

3. **Side-by-Side Evaluation Matrix (`frontend/src/pages/ComparePage.jsx`):**
   - **`VenueCompareTable.jsx`**:
     - Up to 4 venues side-by-side.
     - Direct comparison rows: Cover preview, rental starting price, per-plate veg/non-veg pricing, guest capacity (min-max), venue classification, and review scores.
     - Full amenities matrix (Valet parking, AC, bridal dressing room, in-house catering, power backup, alcohol permitted, DJ permitted, guest rooms) with visual Check vs Cross badges.
   - **`VendorCompareTable.jsx`**:
     - Up to 4 event vendors side-by-side.
     - Category, starting package cost, industry experience, review rating, service coverage areas, and available tiers.
   - Header with category tab switchers (Venues vs Vendors) and total shortlisted counter.
   - Empty states with call-to-actions to explore venues and vendors.
   - Routed `/compare` in `App.jsx` and added "Compare" navigation tab in `Navbar.jsx`.

### Verification Results
| Check | Result |
|---|---|
| Backend syntax check | ✅ App loads with 0 errors |
| Frontend production build | ✅ 1,505 modules built cleanly in 24.8s |
| Redux state & localStorage sync | ✅ Verified shortlist cap of 4 items and state persistence |

---

## Phase 11 – Reviews, Notifications & Contact Inquiries ✅

**Status:** Complete  
**Date:** 2026-11-27

### What Was Implemented

1. **Backend Reviews Module (`backend/src/modules/reviews/`):**
   - **`review.model.js`**: Fields for `author` (ref User), `targetType` (venue/vendor), `venue`, `vendor`, `booking` (one review per booking constraint), `rating` (1–5), `title`, `comment`, `isVerified`, and `ownerResponse` (comment, respondedAt).
   - **`review.validation.js`**: Zod schemas for review submission and host replies.
   - **`review.service.js`**: Review creation and owner response posting (enforcing VENDOR or ADMIN permissions).
   - Mounted at `/api/v1/reviews`.

2. **Backend Notifications Module (`backend/src/modules/notifications/`):**
   - **`notification.model.js`**: Supports `booking_created`, `booking_confirmed`, `booking_cancelled`, `payment_received`, `review_posted`, `general`.
   - **`notification.service.js`**: Fetch unread alerts, mark as read, and bulk mark all read.
   - Mounted at `/api/v1/notifications`.

3. **Backend Contact Module (`backend/src/modules/contact/`):**
   - **`contact.model.js`**: Stores customer/partner inquiries with status (`new`, `read`, `replied`, `closed`) and IP logging for anti-spam.
   - Protected by `contactRateLimiter` (3 submissions per hour per IP) and mounted at `/api/v1/contact`.

4. **Frontend Integrations (`frontend/src/`):**
   - **`phase11Api.js`**: Unified API client for reviews, notifications, and contact inquiries.
   - **`NotificationBell.jsx`**: Real-time notification bell dropdown in `Navbar.jsx` with unread count badge, animated popover list, and one-click "Mark all read".
   - **`ReviewsSection.jsx`**: Reusable verified review feed with rating stats, feedback cards, host management replies, and an interactive "Write a Review" modal with star rating picker.
   - **`ContactPage.jsx`**: Dedicated support and partner onboarding page with office address, telephone hotline, hours, dynamic topic dropdown, validation, and inquiry submission feedback banner.
   - Routed `/contact` in `App.jsx`.

### Verification Results
| Check | Result |
|---|---|
| Backend syntax check | ✅ All 3 modules loaded with 0 errors |
| Frontend production build | ✅ 1,508 modules built cleanly in 25.9s |
| Rate limiting & validation | ✅ Strict Zod and express-rate-limit active |

---

## Phases 12–15

See phase descriptions in [architecture.md](./docs/architecture.md).

---

## Development Notes

### Running the Project

```bash
# Install all dependencies
npm run install:all

# Development (runs both frontend and backend)
npm run dev

# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### Git Workflow

Each completed phase gets its own commit. Never combine multiple phases into one commit.

```bash
git add .
git commit -m "feat: build responsive VenueAura homepage"
```

### Environment Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in required values (MongoDB URI, JWT secrets, etc.)
3. See [docs/deployment.md](./docs/deployment.md) for full setup guide

