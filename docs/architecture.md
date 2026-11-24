# VenueAura – System Architecture

## Overview

VenueAura is a **Modular Monolith** MERN stack application structured by business domain. The architecture follows a strict layered request flow to enforce separation of concerns, security, and testability.

```
Client (React + Vite)
  │
  ├── Redux Toolkit (state)
  ├── React Router DOM (routing)
  ├── Axios (HTTP client)
  └── Tailwind CSS (styling)
       │
       ▼
  REST API  /api/v1/*
       │
  Express.js Backend
  ┌──────────────────────────────────────────┐
  │  Routes                                  │
  │    └── Middleware (auth, validate, rate) │
  │          └── Controllers                 │
  │                └── Services (biz logic) │
  │                      └── Repositories   │
  │                            └── Models   │
  │                                 └── MongoDB (Mongoose)  │
  └──────────────────────────────────────────┘
```

---

## Why Modular Monolith?

| Factor | Decision |
|---|---|
| Team size | Solo / small team → microservices overhead unnecessary |
| Deployment | Single Node.js process, easy to host on Railway/Render/VPS |
| Development speed | Shared in-process function calls, no network overhead between modules |
| Future scaling | Modules have hard boundaries → can be extracted to microservices later |
| Complexity | Event-driven / distributed systems add complexity without benefit at this stage |

---

## Request Flow (Detailed)

```
1. HTTP Request arrives at Express
2. Global Middleware: Helmet, CORS, body-parser, compression, requestLogger
3. Rate Limiter checks request quota
4. Router matches the endpoint
5. Authenticate middleware verifies JWT
6. Authorize middleware checks RBAC role
7. Validate middleware runs Zod schema
8. Controller extracts validated data
9. Controller calls Service method
10. Service applies business rules
11. Service calls Repository for DB access
12. Repository queries MongoDB via Mongoose
13. Data flows back up the chain
14. Controller sends ApiResponse to client
```

---

## Module Boundaries

| Module | Responsibility |
|---|---|
| **auth** | Registration, login, logout, token refresh, password reset, email verification |
| **users** | Profile management, account settings, saved venues/vendors |
| **venues** | CRUD, search, filter, availability, gallery, approval workflow |
| **vendors** | CRUD, categories, portfolio, packages, approval workflow |
| **events** | Customer event records, event types, event-vendor-venue linking |
| **bookings** | Booking creation, availability validation, status transitions, history |
| **payments** | Razorpay order creation, signature verification, webhook handling, idempotency |
| **budget** | Budget plans, expense categories, CRUD, server-side calculations |
| **reviews** | Create/read reviews, rating aggregation, eligibility validation |
| **notifications** | In-app notifications, email via Nodemailer |
| **admin** | User management, vendor verification, listing approval, platform statistics |

---

## Frontend Architecture

Feature-based folder structure aligns frontend modules with backend domains:

```
frontend/src/
├── app/           # Redux store, root reducer
├── assets/        # Images, fonts, icons
├── components/
│   ├── common/    # Button, Badge, Modal, Toast, Spinner
│   ├── layout/    # Navbar, Footer, Sidebar, PageWrapper
│   ├── forms/     # FormInput, FormSelect, FormTextarea, FileUpload
│   └── cards/     # VenueCard, VendorCard, ReviewCard, BookingCard
├── features/
│   ├── auth/      # Login, Register, slice, api, hooks
│   ├── venues/    # VenueList, VenueDetail, slice, api, hooks
│   ├── vendors/   # VendorList, VendorDetail, slice, api, hooks
│   ├── bookings/  # BookingForm, BookingHistory, slice, api
│   ├── budget/    # BudgetPlanner, ExpenseForm, BudgetSummary
│   ├── events/    # EventList, EventDetail, slice, api
│   ├── reviews/   # ReviewList, ReviewForm
│   ├── compare/   # CompareBar, CompareTable
│   └── admin/     # AdminDashboard, ManageUsers, ManageVenues
├── hooks/         # useDebounce, usePagination, useLocalStorage
├── layouts/       # PublicLayout, DashboardLayout, AdminLayout
├── pages/         # Route-level page components
├── routes/        # AppRouter, ProtectedRoute, RoleRoute
├── services/      # axios instance, interceptors
├── store/         # Redux store configuration
├── utils/         # formatCurrency, formatDate, cn (classnames)
├── App.jsx
└── main.jsx
```

---

## Security Architecture

| Layer | Control |
|---|---|
| Transport | HTTPS in production, CORS allowlist |
| Headers | Helmet (CSP, HSTS, X-Frame-Options, etc.) |
| Rate Limiting | express-rate-limit (global + auth-specific tighter limit) |
| Authentication | JWT access token (15 min) + HttpOnly cookie refresh token (7 days) |
| Authorization | Role-based (CUSTOMER, VENDOR, ADMIN) + resource ownership checks |
| Input | Zod validation on every route, body size limit (10 MB) |
| Passwords | bcrypt, cost factor 12 |
| NoSQL Injection | Mongoose sanitization + never passing raw user strings into operators |
| File Uploads | Multer + file type/size checks + Cloudinary virus scanning |
| Payments | Razorpay HMAC-SHA256 signature verification server-side only |
| Logging | Never log passwords, tokens, or PII |

---

## Technology Choices

| Technology | Purpose | Why |
|---|---|---|
| React + Vite | Frontend SPA | Fast HMR, modern tooling |
| Tailwind CSS | Styling | Utility-first, consistent design tokens |
| Redux Toolkit | State management | Predictable state, DevTools, RTK Query option |
| React Hook Form + Zod | Form management | Minimal re-renders, schema validation |
| Node.js + Express | Backend API | Familiar, large ecosystem, flexible |
| MongoDB + Mongoose | Database | Flexible schema, great for event/venue data |
| JWT + HTTP-only cookies | Auth | XSS-safe refresh token storage |
| Cloudinary | Image uploads | CDN, transformation, storage |
| Razorpay | Payments | Indian payment gateway, good test mode |
| Nodemailer | Email | Simple SMTP integration |
| Pino | Logging | Structured JSON logs, production-ready |
| Jest + Supertest | Testing | Industry standard, great DX |
| Swagger/OpenAPI | API docs | Auto-generated, always in sync |
